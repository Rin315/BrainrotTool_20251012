const images = [
  { src: './img/tob.png', value: 25 },
  { src: './img/tralalero.png', value: 50 },
  { src: './img/Odin.png', value: 75 },
  { src: './img/Espressona.png', value: 90 },
  { src: './img/lavaca.png', value: 100 },
  { src: './img/ecco.png', value: 110 },
  { src: './img/losvaguitas.png', value: 115 },
  { src: './img/bulbito.png', value: 120 },
  { src: './img/brri.png', value: 135 },
  { src: './img/brrestrh.png', value: 145 },
  { src: './img/torrtuginni.png', value: 150 },
  { src: './img/bambini.png', value: 160 },
  { src: './img/los.png', value: 170 },
  { src: './img/alessio.png', value: 180 },
  { src: './img/karkerkar.png', value: 190 },
  { src: './img/lostralaleritas.png', value: 200 },
  { src: './img/lostralaletitos.png', value: 200 },
  { src: './img/iipiccione.png', value: 210 },
  { src: './img/iimastodontico.png', value: 220 },
  { src: './img/jobjobjob.png', value: 220 },
  { src: './img/trenostruzzo.png', value: 300 },
  { src: './img/losorcaleritos.png', value: 400 },
  { src: './img/piccione.png', value: 500 },
  { src: './img/pakrah.png', value: 600 },
  { src: './img/losjob.png', value: 700 },
  { src: './img/orcalero.png', value: 1000 },
  { src: './img/ketchuru.png', value: 1500 },
  { src: './img/pothotspot.png', value: 2000 },
  { src: './img/nomyhotspot.png', value: 2500 },
  { src: './img/garamarama.png', value: 3000 },
  { src: './img/iisacro.png', value: 4000 },
  { src: './img/67.png', value: 6700 },
  { src: './img/chicleteira.png', value: 8000 },
  { src: './img/pad.png', value: 10000 },
  { src: './img/house.png', value: 20000 },
  { src: './img/brainrot1.png', value: 500 },//不明
  { src: './img/secret1.png', value: 50000 },//不明
  { src: './img/secret2.png', value: 50000 },//不明
];
// DOM要素
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalEl = document.getElementById('total');
const typeProbEl = document.getElementById('probability');
const secretProbEl = document.getElementById('secret-probability');
const resetBtn = document.getElementById('reset-btn');
const totalValueEl = document.getElementById('total-value');
const totalWaitEl  = document.getElementById('total-wait');

// 状態
let selectedImages = [null, null, null, null, null];
let selectedColors  = [null, null, null, null, null];

// 種類確率の基本値（Defaultに名称変更済み）
const baseProb = { Default: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ========== ギャラリー生成 ==========
images.forEach((imgObj) => {
  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.alt = imgObj.src.split('/').pop();
  img.addEventListener('click', () => {
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return; // 空きなし
    // 同じ画像でも独立運用
    selectedImages[emptyIndex] = { ...imgObj };
    selectedColors[emptyIndex]  = 'Default';
    renderSelected();
    updateAll();
  });
  gallery.appendChild(img);
});

// ========== 選択エリア描画 ==========
function renderSelected(){
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';

    const imgObj = selectedImages[idx];
    if (imgObj) {
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      const color = selectedColors[idx] || 'Default';
      img.style.borderColor = getButtonColor(color);
      img.addEventListener('click', () => removeFromSelected(idx));
      wrapper.appendChild(img);

      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      ['Default','Gold','Diamond','Rainbow','Halloween','Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedColors[idx] = type;
          img.style.borderColor = getButtonColor(type);
          updateAll();
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);

    } else {
      // プレースホルダ（高さ維持用）
      const ph = document.createElement('div');
      ph.style.width = '110px';
      ph.style.height = '150px';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// ========== 画像削除（左詰め） ==========
function removeFromSelected(index){
  selectedImages.splice(index, 1);
  selectedImages.push(null);
  selectedColors.splice(index, 1);
  selectedColors.push(null);
  renderSelected();
  updateAll();
}

// ========== RESET ==========
resetBtn.addEventListener('click', () => {
  selectedImages = [null, null, null, null, null];
  selectedColors  = [null, null, null, null, null];
  renderSelected();
  updateAll();
});

// ========== 合計・確率更新 ==========
function updateAll(){
  updateTotal();
  updateSecretProbability();
  updateTypeProbability();
}

function updateTotal() {
  // 合計（DOMは読まず、選択配列から算出）
  const sum = selectedImages.reduce((acc, img) => acc + Number(img.value || 0), 0);

  // 数値だけを更新（リアルタイム安定）
  if (totalValueEl) totalValueEl.textContent = sum;

  // Wait 表示（条件は「超えた場合」なので > を使用）
  let waitText = "(Wait 1h0m)";
  if (sum > 50000) {
    waitText = "(Wait 2h0m)";
  } else if (sum > 10000) {
    waitText = "(Wait 1h30m)";
  }
  if (totalWaitEl) totalWaitEl.textContent = waitText;

  // Secret確率（①）
  if (sum >= 1001) {
    probabilityEl.textContent = "Secret：100%";
  } else if (sum >= 751) {
    probabilityEl.textContent = "Secret：75% BrainrotGod：25%";
  } else if (sum >= 501) {
    probabilityEl.textContent = "BrainrotGod：60% Secret：40%";
  } else {
    probabilityEl.textContent = "Secret：5%以下";
  }

  // 種類確率（②）
  updateTypeProbability();
}

// ① Secret確率（合計による段階表示）
function updateSecretProbability(){
  const sum = selectedImages.reduce((acc, img) => acc + (img ? img.value : 0), 0);
  if (sum >= 1001) {
    secretProbEl.innerHTML = `<strong>Secret：100%</strong>`;
  } else if (sum >= 751) {
    secretProbEl.innerHTML = `<strong>Secret：75%　BrainrotGod：25%</strong>`;
  } else if (sum >= 501) {
    secretProbEl.innerHTML = `<strong>BrainrotGod：60%　Secret：40%</strong>`;
  } else {
    secretProbEl.innerHTML = `<strong>Secret：15%以下</strong>`;
  }
}

// ② 種類確率（基本＋75%分配／降順／色付きバッジ）
function updateTypeProbability(){
  const hasAny = selectedImages.some(img => img);
  const probs = { ...baseProb };
  const colorSums = { Default:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };

  if (hasAny) {
    for (let i = 0; i < selectedImages.length; i++){
      const img = selectedImages[i];
      const color = selectedColors[i];
      if (!img || !color) continue;
      colorSums[color] += img.value;
    }
    const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b, 0);
    if (totalColorSum > 0) {
      const bonus = 75;
      for (const c in colorSums) {
        if (colorSums[c] > 0) probs[c] += bonus * (colorSums[c] / totalColorSum);
      }
    }
  } else {
    // 何も選択されていない時の固定表示（背景付き）
    probs.Default = 84; probs.Gold = 10; probs.Diamond = 5;
    probs.Rainbow = 0; probs.Halloween = 0; probs.Other = 0;
  }

  const items = Object.keys(probs)
    .map(k => ({ name: k, prob: Math.round(probs[k] || 0) }))
    .sort((a,b) => b.prob - a.prob);

  typeProbEl.innerHTML = items
    .map(it => `<span class="${it.name}">${it.name}: ${it.prob}%</span>`)
    .join('');
}

// 枠色
function getButtonColor(type){
  switch(type){
    case 'Default': return 'black';
    case 'Gold': return '#ffff99';
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'gray';
    default: return 'black';
  }
}

// 初期描画
renderSelected();
updateAll();