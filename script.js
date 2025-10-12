// 画像データ
const images = [
  { src: './img/tob.png', value: 25, gold: 31.25, diamond: 37.5, halloween: 250 },
  { src: './img/tralalero.png', value: 50, gold: 62.5, diamond: 75, halloween: 500 },
  { src: './img/Odin.png', value: 75, gold: 93.75, diamond: 112.5, halloween: 750 },
  { src: './img/Espressona.png', value: 90, gold: 112.5, diamond: 135, halloween: 900 },
  { src: './img/lavaca.png', value: 100, gold: 125, diamond: 150, halloween: 1000 },
  { src: './img/ecco.png', value: 110, gold: 137.5, diamond: 165, halloween: 1100 },
  { src: './img/bambini.png', value: 120, gold: 150, diamond: 180, halloween: 1200 },
  { src: './img/brri.png', value: 130, gold: 162.5, diamond: 195, halloween: 1300 },
  { src: './img/bulbito.png', value: 130, gold: 162.5, diamond: 195, halloween: 1300 },
  { src: './img/brrestrh.png', value: 140, gold: 175, diamond: 210, halloween: 1400 },
  { src: './img/torrtuginni.png', value: 150, gold: 187.5, diamond: 225, halloween: 1500 },
  { src: './img/los.png', value: 170, gold: 212.5, diamond: 255, halloween: 1700 },
  { src: './img/alessio.png', value: 180, gold: 225, diamond: 270, halloween: 1800 },
  { src: './img/karkerkar.png', value: 190, gold: 237.5, diamond: 285, halloween: 1900 },
  { src: './img/lostralaleritas.png', value: 200, gold: 250, diamond: 300, halloween: 2000 },
  { src: './img/lostralaletitos.png', value: 200, gold: 250, diamond: 300, halloween: 2000 },
  { src: './img/iipiccione.png', value: 210, gold: 262.5, diamond: 315, halloween: 2100 },
  { src: './img/iimastodontico.png', value: 220, gold: 275, diamond: 330, halloween: 2200 },
  { src: './img/jobjobjob.png', value: 220, gold: 275, diamond: 330, halloween: 2200 },
  { src: './img/ketchuru.png', value: 1500, gold: 1875, diamond: 2250, halloween: 15000 },
  { src: './img/losorcaleritos.png', value: 400, gold: 500, diamond: 600, halloween: 4000 },
  { src: './img/piccione.png', value: 500, gold: 625, diamond: 750, halloween: 5000 },
  { src: './img/pakrah.png', value: 600, gold: 750, diamond: 900, halloween: 6000 },
  { src: './img/pothotspot.png', value: 2000, gold: 2500, diamond: 3000, halloween: 20000 },
  { src: './img/nomyhotspot.png', value: 2500, gold: 3125, diamond: 3750, halloween: 25000 },
  { src: './img/garamarama.png', value: 3000, gold: 3750, diamond: 4500, halloween: 30000 },
  { src: './img/iisacro.png', value: 4000, gold: 5000, diamond: 6000, halloween: 40000 },
  { src: './img/losjob.png', value: 1000, gold: 1250, diamond: 1500, halloween: 10000 },
  { src: './img/orcalero.png', value: 1000, gold: 1250, diamond: 1500, halloween: 10000 },
  { src: './img/chicleteira.png', value: 8000, gold: 10000, diamond: 12000, halloween: 80000 },
  { src: './img/pad.png', value: 10000, gold: 12500, diamond: 15000, halloween: 100000 },
  { src: './img/house.png', value: 20000, gold: 25000, diamond: 30000, halloween: 200000 },
  { src: './img/8.png', value: 5, gold: 6.25, diamond: 7.5, halloween: 50 },
  { src: './img/brainrot1.png', value: 4, gold: 5, diamond: 6, halloween: 40 },
  { src: './img/secret1.png', value: 3, gold: 3.75, diamond: 4.5, halloween: 30 },
  { src: './img/secret2.png', value: 5, gold: 6.25, diamond: 7.5, halloween: 50 }
];

// DOM取得
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper'); // 5個の枠
const totalEl = document.getElementById('total');
const probabilityEl = document.getElementById('probability');

// 選択枠（5枠固定）と色状態
let selectedImages = [null, null, null, null, null]; // 各枠に入る画像オブジェクト（または null）
let selectedColors = [null, null, null, null, null]; // 同じインデックスで対応する色 (Normal, Gold, ...)

// 基本確率（変更された値）
const baseProb = { Normal: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ギャラリー表示（上部）
images.forEach(imgObj => {
  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.style.width = '140px';
  img.style.height = '150px';
  img.style.objectFit = 'cover';
  img.addEventListener('click', () => selectFromGallery(imgObj));
  gallery.appendChild(img);
});

// ギャラリーから選択（同じ画像も複数追加可能）
function selectFromGallery(imgObj) {
  const emptyIndex = selectedImages.findIndex(v => v === null);
  if (emptyIndex === -1) return; // 空き枠なし
  selectedImages[emptyIndex] = { ...imgObj }; // コピーして格納
  selectedColors[emptyIndex] = 'Normal'; // デフォルト色
  renderSelected();
  updateTotalAndProb();
}

// 選択枠クリックでキャンセル（下側の枠をクリックしたとき）
function removeFromSelected(index) {
  selectedImages[index] = null;
  selectedColors[index] = null;
  renderSelected();
  updateTotalAndProb();
}

// 選択枠を再描画（常に5枠表示）
function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';

    const imgObj = selectedImages[idx];
    if (imgObj) {
      // 実際の画像要素（強制サイズ）
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.style.width = '140px';
      img.style.height = '150px';
      img.style.objectFit = 'cover';
      // border 初期色は現在の選択色
      const color = selectedColors[idx] || 'Normal';
      img.style.border = `5px solid ${getButtonColor(color)}`;
      img.addEventListener('click', () => removeFromSelected(idx));
      wrapper.appendChild(img);

      // ボタン群（画像の下に配置）
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
      ['Normal','Gold','Diamond','Rainbow','Halloween','Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // ボタンクリックで枠のremoveイベントが走らないように
          selectedColors[idx] = type;
          // 更新（ボーダー反映 + 再計算）
          img.style.border = `5px solid ${getButtonColor(type)}`;
          updateTotalAndProb();
        });
        buttonContainer.appendChild(btn);
      });
      wrapper.appendChild(buttonContainer);

    } else {
      // 未選択枠（常に見えるダミー）
      const placeholder = document.createElement('div');
      placeholder.style.width = '140px';
      placeholder.style.height = '180px'; // 画像+ボタン領域を意識した高さ
      placeholder.style.backgroundColor = '#555';
      wrapper.appendChild(placeholder);
    }
  });
}

// 合計値（Normal基準）と確率をまとめて更新
function updateTotalAndProb() {
  updateTotal();
  updateProbability();
}

// 合計値（Normalの合計）を計算して表示
function updateTotal() {
  const sumNormal = selectedImages.reduce((acc, img) => {
    if (!img) return acc;
    return acc + (img.value || 0);
  }, 0);
  totalEl.textContent = sumNormal;
}

// 確率計算・表示（75%を分配する仕様、同色ボーナスなし、上書き条件あり）
// 表示は確率の高い順にソートして出力。合計値閾値によるSecret/BrainrotGodの優先適用あり。
function updateProbability() {
  // 1) 基本確率を用意
  const probs = { ...baseProb }; // shallow copy

  // 2) collect color sums
  // 色ごとの合計は、その色に応じた該当値を足す
  const colorSums = { Normal:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };
  for (let i = 0; i < selectedImages.length; i++) {
    const img = selectedImages[i];
    const color = selectedColors[i];
    if (!img || !color) continue;
    // 色別の「合計値」：Normal/Other/Rainbow -> img.value, Gold -> img.gold, Diamond -> img.diamond, Halloween -> img.halloween
    if (color === 'Gold') colorSums.Gold += (img.gold !== undefined ? img.gold : img.value || 0);
    else if (color === 'Diamond') colorSums.Diamond += (img.diamond !== undefined ? img.diamond : img.value || 0);
    else if (color === 'Halloween') colorSums.Halloween += (img.halloween !== undefined ? img.halloween : img.value || 0);
    else if (color === 'Rainbow') colorSums.Rainbow += (img.value || 0);
    else if (color === 'Other') colorSums.Other += (img.value || 0);
    else colorSums.Normal += (img.value || 0);
  }

  // total of color sums (denominator for distribution)
  const totalColorSum = Object.values(colorSums).reduce((a,b) => a+b, 0);

  // 3) Special override by Normal-sum thresholds
  const sumNormal = selectedImages.reduce((acc, img) => acc + (img ? (img.value||0) : 0), 0);

  let specialText = ''; // will hold the BrainrotGod/Secret message if triggered
  if (sumNormal >= 1001) {
    specialText = 'Secret：100%';
    // When special overrides apply, we set all color probs to 0 (per prior agreement)
    for (const k in probs) probs[k] = 0;
  } else if (sumNormal >= 751) {
    specialText = 'Secret：75% BrainrotGod：25%';
    for (const k in probs) probs[k] = 0;
  } else if (sumNormal >= 501) {
    specialText = 'BrainrotGod：60% Secret：40%';
    for (const k in probs) probs[k] = 0;
  } else {
    specialText = ''; // no special override
  }

  // 4) If no override, distribute 75% across colors proportionally to colorSums
  if (specialText === '') {
    const bonusTotal = 75; // percent to distribute
    if (totalColorSum > 0) {
      for (const color in colorSums) {
        if (colorSums[color] > 0) {
          const add = (bonusTotal * (colorSums[color] / totalColorSum));
          probs[color] = (probs[color] || 0) + add;
        }
      }
    }
    // If totalColorSum is zero (no selection), probs remains baseProb
  }

  // 5) Prepare display items (sort by prob desc)
  // We'll show all color probabilities (Normal, Gold, Diamond, Rainbow, Halloween, Other)
  const displayItems = Object.keys(probs).map(k => ({ name: k, prob: probs[k] || 0 }));
  // Sort descending by prob
  displayItems.sort((a,b) => b.prob - a.prob);

  // 6) Render to probabilityEl
  // First, render color probabilities sorted
  const colorLines = displayItems.map(item => `${item.name}: ${item.prob.toFixed(2)}%`).join(' | ');

  // Then append specialText (if any) as separate line under or after (per request)
  if (specialText) {
    probabilityEl.innerHTML = `${colorLines} <br><strong>${specialText}</strong>`;
  } else {
    probabilityEl.innerHTML = `${colorLines}`;
  }
}

// ボタン色取得（表示用）
function getButtonColor(type){
  switch(type){
    case 'Normal': return 'black';
    case 'Gold': return '#ffff99'; // うす黄色
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'gray';
    default: return 'black';
  }
}

// 初期レンダリング（枠を表示）
renderSelected();
updateTotalAndProb();