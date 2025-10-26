// ========== 画像データ ==========
const images = [
  { src: './img/cocofanto.png', value: 10 ,sale:5},
  { src: './img/tob.png', value: 25 ,sale:7.5},
  { src: './img/tralalero.png', value: 50 ,sale:10},
  { src: './img/Odin.png', value: 75 ,sale:15},
  { src: './img/Espressona.png', value: 90 ,sale:20},
  { src: './img/lavaca.png', value: 100 ,sale:25},
  { src: './img/ecco.png', value: 110 ,sale:27},
  { src: './img/losvaguitas.png', value: 115 ,sale:10},
  { src: './img/bulbito.png', value: 120 ,sale:30},
  { src: './img/chillin.png', value: 130 ,sale:33},
  { src: './img/brri.png', value: 135 ,sale:10},
  { src: './img/brrestrh.png', value: 145 ,sale:38},
  { src: './img/torrtuginni.png', value: 150 ,sale:40},
  { src: './img/losbros.png', value: 155 ,sale:10},
  { src: './img/bambini.png', value: 160 ,sale:10},
  { src: './img/los.png', value: 170 ,sale:10},
  { src: './img/alessio.png', value: 180 ,sale:60},
  { src: './img/karkerkar.png', value: 190 ,sale:70},
  { src: './img/lostralaleritas.png', value: 200 ,sale:60},
  { src: './img/lostralaletitos.png', value: 200 ,sale:60},
  { src: './img/iipiccione.png', value: 210 ,sale:75},
  { src: './img/iimastodontico.png', value: 240 ,sale:90},
  { src: './img/jobjobjob.png', value: 220 ,sale:80},
  { src: './img/malame.png', value: 250 ,sale:100},
  { src: './img/trenostruzzo.png', value: 300 ,sale:170},
  { src: './img/losorcaleritos.png', value: 400 ,sale:160},
  { src: './img/loscouples.png', value: 450 ,sale:150},
  { src: './img/piccione.png', value: 500 ,sale:125},
  { src: './img/pakrah.png', value: 600 ,sale:300},
  { src: './img/losjob.png', value: 700 ,sale:150},
  { src: './img/orcalero.png', value: 1000 ,sale:200},
  { src: './img/ketchuru.png', value: 1500 ,sale:250},
  { src: './img/pothotspot.png', value: 2000 ,sale:400},
  { src: './img/losmobilis.png', value: 2200 ,sale:425},
  { src: './img/nomyhotspot.png', value: 2500 ,sale:450},
  { src: './img/garamarama.png', value: 3000 ,sale:500},
  { src: './img/iisacro.png', value: 4000 ,sale:800},
  { src: './img/chari2.png', value: 4500 ,sale:900},
  { src: './img/lagrande.png', value: 5000 ,sale:1000},
  { src: './img/67.png', value: 6700 ,sale:6700},
  { src: './img/chicleteira.png', value: 8000 ,sale:2000},
  { src: './img/pad.png', value: 10000 ,sale:3000},
  { src: './img/dulduldul.png', value: 12000 ,sale:5000},
  { src: './img/chinpanking.png', value: 25000 ,sale:10000},
];

// ========== DOM要素 ==========
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalBox = document.getElementById('total');
const typeProbEl = document.getElementById('probability');
const monsterProbEl = document.getElementById('monster-probability'); // ← 新パネル
const resetBtn = document.getElementById('reset-btn');

// ========== 状態 ==========
let selectedImages   = [null, null, null, null, null];
let selectedColors   = ['Default','Default','Default','Default','Default'];
let selectedHasBorder= [false, false, false, false, false];

// ========== 基本確率 ==========
const baseProb = { Default: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ========== ユーティリティ ==========
function formatSaleLabelM(valueM){
  if (valueM >= 1000) {
    const b = valueM / 1000;
    return `$ ${trimNum(b)} B`;
  }
  return `$ ${trimNum(valueM)} M`;
}
function trimNum(n){
  return Number.isInteger(n) ? String(n) : String(+parseFloat(n.toFixed(2)));
}

// ========== ギャラリー生成 ==========
images.forEach((imgObj) => {
  const box = document.createElement('div');
  box.className = 'imgbox imgbox--gallery';

  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.style.objectFit = 'cover';

  const label = document.createElement('div');
  label.className = 'value-label';
  label.textContent = `${imgObj.value} K/s`;

  const saleLabel = document.createElement('div');
  saleLabel.className = 'sale-label';
  saleLabel.textContent = formatSaleLabelM(imgObj.sale);

  img.addEventListener('click', () => {
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return;
    selectedImages[emptyIndex]    = { ...imgObj };
    selectedColors[emptyIndex]    = 'Default';
    selectedHasBorder[emptyIndex] = true;
    renderSelected();
    updateAll();
  });

  box.appendChild(img);
  box.appendChild(label);
  box.appendChild(saleLabel);
  gallery.appendChild(box);
});

// ========== 選択エリア描画 ==========
function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      const box = document.createElement('div');
      box.className = 'imgbox imgbox--selected';

      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.addEventListener('click', () => removeFromSelected(idx));
      box.appendChild(img);

      const label = document.createElement('div');
      label.textContent = `${imgObj.value} K/s`;
      label.className = 'value-label';
      box.appendChild(label);

      const saleLabel = document.createElement('div');
      saleLabel.textContent = formatSaleLabelM(imgObj.sale);
      saleLabel.className = 'sale-label';
      box.appendChild(saleLabel);

      applyOutline(box, idx);
      wrapper.appendChild(box);
    } else {
      const ph = document.createElement('div');
      ph.className = 'imgbox imgbox--selected';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// ========== 枠色 ==========
function applyOutline(boxEl, idx){
  const color = getButtonColor(selectedColors[idx] || 'Default');
  const bw = window.matchMedia('(max-width: 600px)').matches ? 3 : 5;
  if (selectedHasBorder[idx]) {
    boxEl.style.outline = `${bw}px solid ${color}`;
  } else {
    boxEl.style.outline = 'none';
  }
}

function removeFromSelected(index){
  selectedImages.splice(index, 1);
  selectedImages.push(null);
  selectedColors.splice(index, 1);
  selectedColors.push('Default');
  selectedHasBorder.splice(index, 1);
  selectedHasBorder.push(false);
  renderSelected();
  updateAll();
}

// ========== RESET ==========
resetBtn.addEventListener('click', () => {
  selectedImages    = [null, null, null, null, null];
  selectedColors    = ['Default','Default','Default','Default','Default'];
  selectedHasBorder = [false, false, false, false, false];
  renderSelected();
  updateAll();
});

// ========== 更新 ==========
function updateAll(){
  updateTotal();
  updateMonsterProbability(); // ← Secret確率の代わりにこれを呼ぶ
  updateTypeProbability();
}

// ========== Total欄 ==========
function updateTotal() {
  const sumValue = selectedImages.reduce((acc, img) => acc + Number(img?.value || 0), 0);
  const sumSaleM = selectedImages.reduce((acc, img) => acc + Number(img?.sale  || 0), 0);

  let waitStr = "1h0m";
  if (sumValue > 5000) waitStr = "2h0m";
  else if (sumValue > 750) waitStr = "1h30m";

  const sumSaleLabel = formatSaleLabelM(sumSaleM).replace('$ ', '');

  totalBox.innerHTML = [
    `Total K/s：${sumValue}`,
    `Total $　：${sumSaleLabel}`,
    `Wait　　：${waitStr}`
  ].map(t => `<div>${t}</div>`).join('');
}

// ========== モンスターごとの確率表示（仮：cocofanto5体・20%） ==========
function updateMonsterProbability() {
  const container = document.getElementById('monster-probability');
  if (!container) return;
  container.innerHTML = ''; // 初期化

  for (let i = 0; i < 5; i++) {
    const box = document.createElement('div');
    box.className = 'monster-box';

    const img = document.createElement('img');
    img.src = './img/cocofanto.png';
    img.alt = 'cocofanto';

    const probText = document.createElement('div');
    probText.className = 'monster-prob-text';
    probText.textContent = '20%';

    box.appendChild(img);
    box.appendChild(probText);
    container.appendChild(box);
  }
}


// ========== 種類確率 ==========
function updateTypeProbability(){
  const probs = { ...baseProb };
  const colorSums = { Default:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };

  for (let i = 0; i < selectedImages.length; i++){
    const img = selectedImages[i];
    if (!img) continue;
    const color = selectedColors[i] || 'Default';
    colorSums[color] += img.value;
  }

  const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b,0);
  if (totalColorSum > 0) {
    const bonus = 75;
    for (const c in colorSums) {
      if (colorSums[c] > 0) probs[c] += bonus * (colorSums[c] / totalColorSum);
    }
  } else {
    probs.Default = 84; probs.Gold = 10; probs.Diamond = 5;
  }

  const items = Object.keys(probs)
    .map(k => ({ name: k, prob: Math.round(probs[k] || 0) }))
    .sort((a,b) => b.prob - a.prob);

  typeProbEl.innerHTML = items
    .map(it => `<span class="${it.name}">${it.name}: ${it.prob}%</span>`)
    .join('');
}

function getButtonColor(type){
  switch(type){
    case 'Default': return 'black';
    case 'Gold': return '#ffff99';
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'white';
    default: return 'black';
  }
}

renderSelected();
updateAll();
