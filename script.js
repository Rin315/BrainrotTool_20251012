// ========== 画像データ ==========
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
  { src: './img/brainrot1.png', value: 500 }, // 不明
  { src: './img/secret1.png', value: 50000 }, // 不明
  { src: './img/secret2.png', value: 50000 }, // 不明
];

// ========== DOM要素 ==========
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalValueEl = document.getElementById('total-value');
const totalWaitEl  = document.getElementById('total-wait');
const typeProbEl   = document.getElementById('probability');
const secretProbEl = document.getElementById('secret-probability');
const resetBtn     = document.getElementById('reset-btn');

// ========== 状態 ==========
let selectedImages = [null, null, null, null, null];
let selectedColors = [null, null, null, null, null];

// ========== 基本確率 ==========
const baseProb = { Default: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ========== ギャラリー生成（上段のモンスター選択） ==========
images.forEach((imgObj) => {
  const imgContainer = document.createElement('div');
  imgContainer.style.position = 'relative';
  imgContainer.style.display = 'inline-block';
  imgContainer.style.width = 'var(--imgW)';
  imgContainer.style.height = 'var(--imgH)';

  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.alt = imgObj.src.split('/').pop();
  img.style.display = 'block';

  img.addEventListener('click', () => {
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return;
    selectedImages[emptyIndex] = { ...imgObj };
    selectedColors[emptyIndex]  = 'Default';
    renderSelected();
    updateAll();
  });
  imgContainer.appendChild(img);

  // 🔸 値ラベル（黒帯＋黄色文字＋単位K/s）
  const valueLabel = document.createElement('div');
  valueLabel.textContent = `${imgObj.value} K/s`;
  valueLabel.className = 'value-label';
  imgContainer.appendChild(valueLabel);

  gallery.appendChild(imgContainer);
});



// ========== 選択エリア描画 ==========
function renderSelected(){
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      // 画像を包むコンテナ
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.width = '110px';
      imgContainer.style.height = '120px';

      // 画像本体
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      const color = selectedColors[idx] || 'Default';
      img.style.borderColor = getButtonColor(color);
      img.addEventListener('click', () => removeFromSelected(idx));
      imgContainer.appendChild(img);

      // 🔸 値ラベル（黒帯＋黄色文字＋単位K/s）
      const valueLabel = document.createElement('div');
      valueLabel.textContent = `${imgObj.value} K/s`;
      valueLabel.className = 'value-label';
      imgContainer.appendChild(valueLabel);


      wrapper.appendChild(imgContainer);

      // ボタン群
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
      // 未選択時のプレースホルダ
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
  selectedColors = [null, null, null, null, null];
  renderSelected();
  updateAll();
});

// ========== 総更新 ==========
function updateAll(){
  updateTotal();
  updateSecretProbability();
  updateTypeProbability();
}

// ========== 合計＆Wait ==========
function updateTotal() {
  const sum = selectedImages.reduce((acc, img) => acc + Number(img?.value || 0), 0);
  totalValueEl.textContent = sum;

  // Wait条件を変更：750超で1h30m
  let waitText = "(Wait 1h0m)";
  if (sum > 5000) waitText = "(Wait 2h0m)";
  else if (sum > 750) waitText = "(Wait 1h30m)";

  totalWaitEl.textContent = waitText;
  totalWaitEl.style.fontSize = "12px"; // ← Waitを小さく
}

// ========== Secret確率 ==========
function updateSecretProbability(){
  const sum = selectedImages.reduce((acc, img) => acc + (img ? img.value : 0), 0);
  if (sum >= 1001) {
    secretProbEl.innerHTML = `<strong>Secret：100%</strong>`;
  } else if (sum >= 751) {
    secretProbEl.innerHTML = `<strong>Secret：75%　BrainrotGod：25%</strong>`;
  } else if (sum >= 501) {
    secretProbEl.innerHTML = `<strong>BrainrotGod：60%　Secret：40%</strong>`;
  } else {
    secretProbEl.innerHTML = `<strong>Secret：15%以下</strong>`; // ← 修正
  }
}

// ========== 種類確率 ==========
function updateTypeProbability(){
  const probs = { ...baseProb };
  const colorSums = { Default:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };

  for (let i = 0; i < selectedImages.length; i++){
    const img = selectedImages[i];
    const color = selectedColors[i];
    if (!img || !color) continue;
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

// ========== 枠色取得 ==========
function getButtonColor(type){
  switch(type){
    case 'Default': return 'black';
    case 'Gold': return '#ffff99';
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'white'; // ← 修正
    default: return 'black';
  }
}

// 初期表示
renderSelected();
updateAll();
