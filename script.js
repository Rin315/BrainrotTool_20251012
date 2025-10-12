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
  { src: './img/chicleteira.png', value: 8000 },
  { src: './img/pad.png', value: 10000 },
  { src: './img/house.png', value: 20000 },
  { src: './img/8.png', value: 5 },
  { src: './img/brainrot1.png', value: 4 },
  { src: './img/secret1.png', value: 3 },
  { src: './img/secret2.png', value: 5 },
  { src: './img/trenostruzzo.png', value: 300 }
];

// DOM参照
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper'); // 5枠
const totalEl = document.getElementById('total');
const typeProbEl = document.getElementById('probability'); // ②種類確率の出力先（既存）
let secretProbEl = document.getElementById('secret-probability'); // ①Secret確率（無ければ作る）

// 無ければ ①用の要素を probability の直後に作る
(function ensureSecretProbEl() {
  if (!secretProbEl) {
    secretProbEl = document.createElement('div');
    secretProbEl.id = 'secret-probability';
    // 見出しを分かりやすく
    const label = document.createElement('div');
    label.textContent = 'Secret確率';
    label.style.fontWeight = 'bold';
    label.style.marginTop = '8px';
    typeProbEl.insertAdjacentElement('afterend', label);
    label.insertAdjacentElement('afterend', secretProbEl);
  }
})();

// 状態（5枠固定）
let selectedImages = [null, null, null, null, null];
let selectedColors  = [null, null, null, null, null]; // 'Normal' など

// ②の基本確率
const baseProb = { Normal: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ユーティリティ
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

// ギャラリー表示（140×150固定）
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
    selectedImages[emptyIndex] = { ...imgObj }; // 同じ画像でも独立
    selectedColors[emptyIndex]  = 'Normal';     // 既定色
    renderSelected();
    updateAll();
  });
  gallery.appendChild(img);
});

// 選択枠をクリックでキャンセル
function removeFromSelected(index){
  selectedImages[index] = null;
  selectedColors[index]  = null;
  renderSelected();
  updateAll();
}

// 5枠レンダリング
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
      img.style.cursor = 'pointer';
      const color = selectedColors[idx] || 'Normal';
      img.style.border = `5px solid ${getButtonColor(color)}`;
      img.addEventListener('click', () => removeFromSelected(idx));
      wrapper.appendChild(img);

      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      ['Normal','Gold','Diamond','Rainbow','Halloween','Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedColors[idx] = type;
          img.style.border = `5px solid ${getButtonColor(type)}`;
          updateAll();
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);

    } else {
      const ph = document.createElement('div');
      ph.style.width = '140px';
      ph.style.height = '180px';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// 合計 & 両方の確率を更新
function updateAll(){
  updateTotal();
  updateSecretProbability(); // ①
  updateTypeProbability();   // ②
}

// 合計（value合計）
function updateTotal(){
  const sum = selectedImages.reduce((acc, img) => acc + (img ? img.value : 0), 0);
  totalEl.textContent = sum;
}

// ① Secret確率（合計値のしきい値ベース）
function updateSecretProbability(){
  const sum = selectedImages.reduce((acc, img) => acc + (img ? img.value : 0), 0);
  if (sum >= 1001) {
    secretProbEl.innerHTML = `<strong>Secret：100%</strong>`;
  } else if (sum >= 751) {
    secretProbEl.innerHTML = `<strong>Secret：75%　BrainrotGod：25%</strong>`;
  } else if (sum >= 501) {
    secretProbEl.innerHTML = `<strong>BrainrotGod：60%　Secret：40%</strong>`;
  } else {
    secretProbEl.innerHTML = ''; // 条件未達のときは空
  }
}

// ② 種類確率（基本＋75%分配、降順ソート表示）
function updateTypeProbability(){
  // 基本確率
  const probs = { ...baseProb };

  // 色ごとの value 合計
  const colorSums = { Normal:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };
  for (let i = 0; i < selectedImages.length; i++){
    const img = selectedImages[i];
    const color = selectedColors[i];
    if (!img || !color) continue;
    colorSums[color] += img.value; // どの色でも value だけを使用
  }
  const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b, 0);

  // 75%を比率で分配（同色ボーナスなし）
  if (totalColorSum > 0) {
    const bonusTotal = 75;
    for (const color in colorSums){
      if (colorSums[color] > 0) {
        probs[color] += bonusTotal * (colorSums[color] / totalColorSum);
      }
    }
  }
  // 並べ替え（降順）
  const items = Object.keys(probs).map(k => ({ name: k, prob: probs[k] || 0 }));
  items.sort((a,b) => b.prob - a.prob);

  // 表示
  typeProbEl.innerHTML = items
    .map(it => `${it.name}: ${it.prob.toFixed(2)}%`)
    .join(' | ');
}

// 初期表示
renderSelected();
updateAll();