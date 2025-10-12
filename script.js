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
  { src: './img/chicleteira.png', value: '8000' }, // 文字列でもOK（safeNumberで吸収）
  { src: './img/pad.png', value: 10000 },
  { src: './img/house.png', value: 20000 },
  { src: './img/8.png', value: 5 },
  { src: './img/brainrot1.png', value: 4 },
  { src: './img/secret1.png', value: 3 },
  { src: './img/secret2.png', value: 5 },
  { src: './img/trenostruzzo.png', value: 300 }
];

// DOM
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper'); // 5枠
const totalEl = document.getElementById('total');
const probabilityEl = document.getElementById('probability'); // ← ここに必ず出力

// 状態（5枠固定：各枠に画像＆色を持たせる）
let selectedImages = [null, null, null, null, null];
let selectedColors = [null, null, null, null, null]; // 'Normal' など

// 基本確率
const baseProb = { Normal: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// 安全に数値化
function safeNumber(n) {
  const num = Number(n);
  return (typeof num === 'number' && !isNaN(num)) ? num : 0;
}

// 枠色
function getButtonColor(type){
  switch(type){
    case 'Normal': return 'black';
    case 'Gold': return '#ffff99'; // 薄い黄色
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'gray';
    default: return 'black';
  }
}

// ギャラリー描画（140x150固定）
images.forEach(imgObj => {
  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.style.width = '140px';
  img.style.height = '150px';
  img.style.objectFit = 'cover';
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return; // 空き枠なし
    selectedImages[emptyIndex] = { ...imgObj };     // コピーして格納（同じ画像でも独立）
    selectedColors[emptyIndex] = 'Normal';          // 既定色
    renderSelected();
    updateTotalAndProbability();
  });
  gallery.appendChild(img);
});

// 選択枠クリックでその枠をキャンセル
function removeFromSelected(index){
  selectedImages[index] = null;
  selectedColors[index] = null;
  renderSelected();
  updateTotalAndProbability();
}

// 5枠を常に描画（140x150固定、下に6ボタン）
function renderSelected(){
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.style.width = '140px';
      img.style.height = '150px';
      img.style.objectFit = 'cover';
      const color = selectedColors[idx] || 'Normal';
      img.style.border = `5px solid ${getButtonColor(color)}`;
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => removeFromSelected(idx));
      wrapper.appendChild(img);

      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      ['Normal','Gold','Diamond','Rainbow','Halloween','Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // 画像のremove発火を防止
          selectedColors[idx] = type;
          img.style.border = `5px solid ${getButtonColor(type)}`;
          updateTotalAndProbability();
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);

    } else {
      // 未選択プレースホルダ（四角を常に見せる）
      const ph = document.createElement('div');
      ph.style.width = '140px';
      ph.style.height = '180px'; // 見た目用
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// 合計値（Normal基準）と確率の更新
function updateTotalAndProbability(){
  updateTotal();
  updateProbability();
}

// 合計値（valueの合計）を表示＆閾値メッセージ（別行でprobabilityElに一緒に出す）
function updateTotal(){
  const sum = selectedImages.reduce((acc, img) => acc + (img ? safeNumber(img.value) : 0), 0);
  totalEl.textContent = sum;
}

// 確率計算（valueのみ、75%分配、閾値で上書き、降順ソート表示）
function updateProbability(){
  // 1) 基本確率
  const probs = { ...baseProb };

  // 2) 色ごとの value 合計
  const colorSums = { Normal:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };
  for (let i = 0; i < selectedImages.length; i++){
    const img = selectedImages[i];
    const color = selectedColors[i];
    if (!img || !color) continue;
    colorSums[color] += safeNumber(img.value); // どの色でも value だけを足す
  }
  const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b, 0);

  // 3) 合計値による上書き条件（Normal合計＝value合計）
  const sumNormal = selectedImages.reduce((acc, img) => acc + (img ? safeNumber(img.value) : 0), 0);
  let specialText = '';
  if (sumNormal >= 1001) {
    specialText = 'Secret：100%';
    for (const k in probs) probs[k] = 0;
  } else if (sumNormal >= 751) {
    specialText = 'Secret：75% BrainrotGod：25%';
    for (const k in probs) probs[k] = 0;
  } else if (sumNormal >= 501) {
    specialText = 'BrainrotGod：60% Secret：40%';
    for (const k in probs) probs[k] = 0;
  } else {
    // 4) 上書きがないときは 75% を色比で分配
    const bonusTotal = 75;
    if (totalColorSum > 0) {
      for (const color in colorSums){
        if (colorSums[color] > 0) {
          probs[color] += bonusTotal * (colorSums[color] / totalColorSum);
        }
      }
    }
  }

  // 5) 確率の大きい順に整列して表示
  const items = Object.keys(probs).map(k => ({ name: k, prob: probs[k] || 0 }));
  items.sort((a,b) => b.prob - a.prob);

  const colorLine = items.map(it => `${it.name}: ${it.prob.toFixed(2)}%`).join(' | ');
  if (specialText) {
    // 色確率の下に閾値メッセージを改行して表示
    probabilityEl.innerHTML = `${colorLine}<br><strong>${specialText}</strong>`;
  } else {
    probabilityEl.innerHTML = colorLine;
  }
}

// 初期表示
renderSelected();
updateTotalAndProbability();