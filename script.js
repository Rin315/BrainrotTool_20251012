const images = [
  { src: './img/tob.png', value: 25 },
  { src: './img/tralalero.png', value: 50 },
  { src: './img/Odin.png', value: 75 },
  { src: './img/Espressona.png', value: 90 },
  { src: './img/lavaca.png', value: 100 },
  { src: './img/ecco.png', value: 110 },
  { src: './img/bambini.png', value: 120 },
  { src: './img/brri.png', value: 130 },
  { src: './img/bulbito.png', value: 130 },
  { src: './img/brrestrh.png', value: 140 },
  { src: './img/torrtuginni.png', value: 150 },
  { src: './img/los.png', value: 170 },
  { src: './img/alessio.png', value: 180 },
  { src: './img/karkerkar.png', value: 190 },
  { src: './img/lostralaleritas.png', value: 200 },
  { src: './img/lostralaletitos.png', value: 200 },
  { src: './img/iipiccione.png', value: 210 },
  { src: './img/iimastodontico.png', value: 220 },
  { src: './img/jobjobjob.png', value: 220 },
  { src: './img/ketchuru.png', value: 1500 },
  { src: './img/losorcaleritos.png', value: 400 },
  { src: './img/piccione.png', value: 500 },
  { src: './img/pakrah.png', value: 600 },
  { src: './img/pothotspot.png', value: 2000 },
  { src: './img/nomyhotspot.png', value: 2500 },
  { src: './img/garamarama.png', value: 3000 },
  { src: './img/iisacro.png', value: 4000 },
  { src: './img/losjob.png', value: 1000 },
  { src: './img/orcalero.png', value: 1000 },
  { src: './img/chicleteira.png', value: '8000' }, // ← 文字列でもOK
  { src: './img/pad.png', value: 10000 },
  { src: './img/house.png', value: 20000 },
  { src: './img/8.png', value: 5 },
  { src: './img/brainrot1.png', value: 4 },
  { src: './img/secret1.png', value: 3 },
  { src: './img/secret2.png', value: 5 }
];

// ==========================
// HTML要素の取得
// ==========================
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalEl = document.getElementById('total');
const probabilityEl = document.getElementById('probability');

let selectedImages = [];
let imageColors = new Map(); // 各画像ごとの色を保持

// ==========================
// 安全に数値化する関数
// ==========================
function safeNumber(n) {
  const num = Number(n);
  if (isNaN(num)) {
    console.warn('Invalid value detected:', n);
    return 0;
  }
  return num;
}

// ==========================
// ギャラリー生成
// ==========================
images.forEach(imgObj => {
  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.style.width = '140px';
  img.style.height = '150px';
  img.addEventListener('click', () => addImage(imgObj));
  gallery.appendChild(img);
});

// ==========================
// 画像選択処理（ギャラリーから）
// ==========================
function addImage(imgObj) {
  if (selectedImages.length < 5) {
    selectedImages.push(imgObj);
    imageColors.set(imgObj, 'Normal'); // デフォルトはNormal
    renderSelected();
    updateTotal();
    updateProbabilities();
  }
}

// ==========================
// 選択画像の描画
// ==========================
function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.style.width = '140px';
      img.style.height = '150px';
      img.style.border = '3px solid ' + getButtonColor(imageColors.get(imgObj));
      img.addEventListener('click', () => removeImage(imgObj));
      wrapper.appendChild(img);

      // ボタン生成
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
      ['Normal','Gold','Diamond','Rainbow','Halloween','Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', () => {
          imageColors.set(imgObj, type);
          img.style.border = '3px solid ' + getButtonColor(type);
          updateProbabilities();
        });
        buttonContainer.appendChild(btn);
      });
      wrapper.appendChild(buttonContainer);
    } else {
      const placeholder = document.createElement('div');
      placeholder.style.width = '140px';
      placeholder.style.height = '150px';
      placeholder.style.backgroundColor = '#555';
      wrapper.appendChild(placeholder);
    }
  });
}

// ==========================
// 選択解除処理
// ==========================
function removeImage(imgObj) {
  const idx = selectedImages.indexOf(imgObj);
  if (idx > -1) {
    selectedImages.splice(idx, 1);
    imageColors.delete(imgObj);
    renderSelected();
    updateTotal();
    updateProbabilities();
  }
}

// ==========================
// 合計値の更新
// ==========================
function updateTotal() {
  const total = selectedImages.reduce((acc, img) => acc + safeNumber(img.value), 0);
  totalEl.textContent = total;

  if (total >= 1001) {
    probabilityEl.textContent = "Secret：100%";
  } else if (total >= 751) {
    probabilityEl.textContent = "Secret：75% BrainrotGod：25%";
  } else if (total >= 501) {
    probabilityEl.textContent = "BrainrotGod：60% Secret：40%";
  } else {
    probabilityEl.textContent = "";
  }
}

// ==========================
// 確率計算
// ==========================
function updateProbabilities() {
  const baseProb = {
    Normal: 9,
    Gold: 10,
    Diamond: 5,
    Rainbow: 0,
    Halloween: 0,
    Other: 0
  };

  let colorSums = { Normal: 0, Gold: 0, Diamond: 0, Rainbow: 0, Halloween: 0, Other: 0 };
  const totalValue = selectedImages.reduce((acc, img) => acc + safeNumber(img.value), 0);

  selectedImages.forEach(img => {
    const type = imageColors.get(img) || 'Normal';
    colorSums[type] += safeNumber(img.value);
  });

  // 分配ボーナス
  let distributed = {};
  Object.keys(colorSums).forEach(color => {
    distributed[color] = totalValue > 0 ? (colorSums[color] / totalValue) * 75 : 0;
  });

  // 合計確率
  let probs = {};
  Object.keys(baseProb).forEach(color => {
    probs[color] = baseProb[color] + distributed[color];
  });

  // ソートして表示
  const sorted = Object.entries(probs).sort((a, b) => b[1] - a[1]);
  const display = sorted.map(([color, val]) => `${color}：${val.toFixed(2)}%`).join('  ');
  document.getElementById('rarity-probability').textContent = display;
}

// ==========================
// ボタン色
// ==========================
function getButtonColor(type){
  switch(type){
    case 'Normal': return 'black';
    case 'Gold': return 'yellow';
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'gray';
  }
}