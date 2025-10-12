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
  { src: './img/losjob.png', value: 1000 }, // 不明
  { src: './img/orcalero.png', value: 1000 },
  { src: './img/chicleteira.png', value: 8000 },
  { src: './img/pad.png', value: 10000 },
  { src: './img/house.png', value: 20000 },
  { src: './img/8.png', value: 5 },
  { src: './img/brainrot1.png', value: 4 },
  { src: './img/secret1.png', value: 3 },
  { src: './img/secret2.png', value: 5 },
  { src: './img/trenostruzzo.png', value: 300 }
];

// ---------- DOM 取得 ----------
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper'); // 5個の枠想定
const totalEl = document.getElementById('total');
const probabilityEl = document.getElementById('probability');

// ---------- 状態 ----------
let selectedImages = [null, null, null, null, null]; // 5枠
let selectedColors = [null, null, null, null, null]; // 各枠に対応する色名 (Normal/Gold/...)

// ---------- 基本確率 ----------
const baseProb = { Normal: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ---------- ユーティリティ ----------
function safeNumber(n){
  return (typeof n === 'number' && !isNaN(n)) ? n : 0;
}

function getButtonColor(type){
  switch(type){
    case 'Normal': return 'black';
    case 'Gold': return '#ffff99';
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'gray';
    default: return 'black';
  }
}

// ---------- ギャラリー表示（上部） ----------
// ギャラリー画像は強制 140x150 にする
images.forEach(imgObj => {
  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.style.width = '140px';
  img.style.height = '150px';
  img.style.objectFit = 'cover';
  img.style.cursor = 'pointer';
  img.addEventListener('click', () => {
    // 空き枠に追加（同じ画像を複数回追加可能）
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return;
    selectedImages[emptyIndex] = { ...imgObj }; // コピー
    selectedColors[emptyIndex] = 'Normal'; // デフォルト色
    renderSelected();
    updateTotalAndProbability();
  });
  gallery.appendChild(img);
});

// ---------- 選択枠クリックでキャンセル ----------
function removeFromSelected(index){
  selectedImages[index] = null;
  selectedColors[index] = null;
  renderSelected();
  updateTotalAndProbability();
}

// ---------- renderSelected: 5枠を常に描画する ----------
function renderSelected(){
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = ''; // 中身リセット

    const imgObj = selectedImages[idx];
    if (imgObj) {
      // 画像要素（強制サイズ）
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.style.width = '140px';
      img.style.height = '150px';
      img.style.objectFit = 'cover';
      img.style.cursor = 'pointer';
      const color = selectedColors[idx] || 'Normal';
      img.style.border = `5px solid ${getButtonColor(color)}`;
      // クリックでその枠をキャンセル
      img.addEventListener('click', () => removeFromSelected(idx));
      wrapper.appendChild(img);

      // ボタン群（画像の下に表示）
      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      const types = ['Normal','Gold','Diamond','Rainbow','Halloween','Other'];
      types.forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // 親のクリック（remove）を防ぐ
          selectedColors[idx] = type;
          img.style.border = `5px solid ${getButtonColor(type)}`;
          updateTotalAndProbability();
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);

    } else {
      // 未選択枠用のプレースホルダ（常に四角が見えるように）
      const ph = document.createElement('div');
      ph.style.width = '140px';
      // placeholder は画像150 + ボタン領域の一部を見越して高さを調整
      ph.style.height = '180px';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// ---------- 合計値と確率の更新まとめ ----------
function updateTotalAndProbability(){
  updateTotal();
  updateProbability();
}

// Normal の合計（value の合計）を計算
function updateTotal(){
  const sum = selectedImages.reduce((acc, img) => acc + (img ? safeNumber(img.value) : 0), 0);
  totalEl.textContent = sum;
}

// 確率計算：value のみ使用、75%を選択された色の value 合計比で分配
function updateProbability(){
  // base に基礎確率をコピー
  const probs = { ...baseProb }; // Normal,Gold,Diamond,Rainbow,Halloween,Other

  // 色ごとの value 合計を集計（valueのみ）
  const colorSums = { Normal:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };
  for (let i = 0; i < selectedImages.length; i++){
    const img = selectedImages[i];
    const color = selectedColors[i];
    if (!img || !color) continue;
    colorSums[color] += safeNumber(img.value); // どの色でも value を足す（gold/diamondの別数値は無視）
  }

  const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b, 0);

  // Special override by Normal合計 thresholds
  const sumNormal = selectedImages.reduce((acc, img) => acc + (img ? safeNumber(img.value) : 0), 0);
  let specialText = '';
  if (sumNormal >= 1001) {
    specialText = 'Secret：100%';
    // 色確率は0に
    for (const k in probs) probs[k] = 0;
  } else if (sumNormal >= 751) {
    specialText = 'Secret：75% BrainrotGod：25%';
    for (const k in probs) probs[k] = 0;
  } else if (sumNormal >= 501) {
    specialText = 'BrainrotGod：60% Secret：40%';
    for (const k in probs) probs[k] = 0;
  } else {
    // 通常時：75%を分配
    const bonusTotal = 75;
    if (totalColorSum > 0) {
      for (const color in colorSums){
        if (colorSums[color] > 0) {
          const add = (bonusTotal * (colorSums[color] / totalColorSum));
          probs[color] = (probs[color] || 0) + add;
        }
      }
    }
    // 選択されていない（totalColorSum===0）の場合は base のみ表示
  }

  // 表示用にソート（確率が大きい順）
  const items = Object.keys(probs).map(k => ({ name: k, prob: probs[k] || 0 }));
  items.sort((a,b) => b.prob - a.prob);

  // 出力：確率の大きい順で並べ、下に specialText を表示（あれば）
  const colorLines = items.map(it => `${it.name}: ${it.prob.toFixed(2)}%`).join(' | ');
  if (specialText) {
    probabilityEl.innerHTML = `${colorLines} <br><strong>${specialText}</strong>`;
  } else {
    probabilityEl.innerHTML = `${colorLines}`;
  }
}

// ---------- 初期化 ----------
renderSelected();
updateTotalAndProbability();