// ========== 画像データ ==========
const images = [
  { src: './img/cocofanto.png', value: 10 ,sale:5},
  { src: './img/tob.png', value: 25 ,sale:7.5},
  { src: './img/tralalero.png', value: 50 ,sale:10},
  { src: './img/Odin.png', value: 75 ,sale:15},
  { src: './img/Espressona.png', value: 90 ,sale:20},
  { src: './img/lavaca.png', value: 100 ,sale:25},//
  { src: './img/ecco.png', value: 110 ,sale:10},//
  { src: './img/losvaguitas.png', value: 115 ,sale:10},//
  { src: './img/bulbito.png', value: 120 ,sale:30},//
  { src: './img/chillin.png', value: 130 ,sale:33},
  { src: './img/brri.png', value: 135 ,sale:10},//
  { src: './img/brrestrh.png', value: 145 ,sale:38},
  { src: './img/torrtuginni.png', value: 150 ,sale:40},
  { src: './img/losbros.png', value: 155 ,sale:10},//
  { src: './img/bambini.png', value: 160 ,sale:10},//
  { src: './img/los.png', value: 170 ,sale:10},//
  { src: './img/alessio.png', value: 180 ,sale:60},
  { src: './img/karkerkar.png', value: 190,sale:10 },//
  { src: './img/lostralaleritas.png', value: 200 ,sale:60},//
  { src: './img/lostralaletitos.png', value: 200 ,sale:60},//
  { src: './img/iipiccione.png', value: 210 ,sale:75},
  { src: './img/iimastodontico.png', value: 220 ,sale:10},//
  { src: './img/jobjobjob.png', value: 220 ,sale:80},//
  { src: './img/brainrot1.png', value: 250 ,sale:10}, // 画像なし
  { src: './img/trenostruzzo.png', value: 300 ,sale:170},
  { src: './img/losorcaleritos.png', value: 400 ,sale:10},//
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
  { src: './img/lagrande.png', value: 5000 ,sale:1000},
  { src: './img/67.png', value: 6700 ,sale:6700},
  { src: './img/chicleteira.png', value: 8000 ,sale:2000},
  { src: './img/pad.png', value: 10000 ,sale:3000},
  //{ src: './img/house.png', value: 20000 },


  //{ src: './img/secret2.png', value: 50000 }, // 不明
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
let selectedImages   = [null, null, null, null, null];
let selectedColors   = ['Default','Default','Default','Default','Default'];
let selectedHasBorder= [false, false, false, false, false];

// ========== 基本確率 ==========
const baseProb = { Default: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ========== 押下フィードバック（枠ごと縮小 & 暗転） ==========
function attachPressFeedbackBox(boxEl) {
  let timer = null;
  let pressed = false;
  const add = () => {
    if (pressed) return;
    pressed = true;
    boxEl.classList.add('pressed');
    timer = setTimeout(() => { timer = null; if (!pressed) boxEl.classList.remove('pressed'); }, 120);
  };
  const rm = () => { if (!pressed) return; pressed = false; if (timer) return; boxEl.classList.remove('pressed'); };
  boxEl.addEventListener('pointerdown', add);
  boxEl.addEventListener('pointerup', rm);
  boxEl.addEventListener('pointercancel', rm);
  boxEl.addEventListener('pointerleave', rm);
}

// ========== ギャラリー生成（画像は cover で隙間なし） ==========
images.forEach((imgObj) => {
  const box = document.createElement('div');
  box.className = 'imgbox imgbox--gallery';
  attachPressFeedbackBox(box);

  const img = document.createElement('img');
  img.src = imgObj.src;
  img.alt = imgObj.src.split('/').pop();
  img.className = 'gallery-img';
  img.style.objectFit = 'cover'; // ← ギャラリーも余白なくぴったり

  const label = document.createElement('div');
  label.className = 'value-label';
  label.textContent = `${imgObj.value} K/s`;

  // 🔽 追加：sale の表示
  const saleLabel = document.createElement('div');
  saleLabel.className = 'sale-label';
  saleLabel.textContent = `${imgObj.sale} M`;
  box.appendChild(saleLabel);

  img.addEventListener('click', () => {
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return;
    // 画像選択：即 Default を適用＆枠を出す
    selectedImages[emptyIndex]    = { ...imgObj };
    selectedColors[emptyIndex]    = 'Default';
    selectedHasBorder[emptyIndex] = true;
    renderSelected();
    updateAll();
  });

  box.appendChild(img);
  box.appendChild(label);
  gallery.appendChild(box);
});

// ========== 選択エリア描画（画像→帯→縁=outline） ==========
function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      const box = document.createElement('div');
      box.className = 'imgbox imgbox--selected';
      attachPressFeedbackBox(box);

      // 画像：枠いっぱいに cover（隙間ゼロ）
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.style.objectFit = 'cover';
      img.style.border = '0 solid transparent';
      img.addEventListener('click', () => removeFromSelected(idx));
      box.appendChild(img);

      // 数値帯
      const label = document.createElement('div');
      label.textContent = `${imgObj.value} K/s`;
      label.className = 'value-label';
      box.appendChild(label);

      // 🔽 追加：sale（下部表示）
      const saleLabel = document.createElement('div');
      if (imgObj.sale > 1000) {
        imgObj.sale = imgObj.sale/1000;
        saleLabel.textContent = `$${imgObj.sale} B`;
      }
      else{
        saleLabel.textContent = `$${imgObj.sale} M`;
      }
        
      saleLabel.className = 'sale-label';
      box.appendChild(saleLabel);

      // 縁（outline を .imgbox に当てる＝数字に被らない）
      applyOutline(box, idx);

      wrapper.appendChild(box);

      // ボタン（このスロットだけを更新）
      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      ['Default', 'Gold', 'Diamond', 'Rainbow', 'Halloween', 'Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedColors[idx]    = type;
          selectedHasBorder[idx] = true;
          applyOutline(box, idx); // 即見た目更新
          updateAll();            // 計算更新
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);
    } else {
      // 未選択プレースホルダ（枠サイズ維持）
      const ph = document.createElement('div');
      ph.className = 'imgbox imgbox--selected';
      ph.style.outline = 'none';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// ========== 枠（outline）適用：画像外側に表示 ==========
function applyOutline(boxEl, idx){
  const color = getButtonColor(selectedColors[idx] || 'Default');
  const bw = window.matchMedia('(max-width: 600px)').matches ? 3 : 5;
  if (selectedHasBorder[idx]) {
    boxEl.style.outline = `${bw}px solid ${color}`;
    boxEl.style.outlineOffset = '0';
  } else {
    boxEl.style.outline = 'none';
  }
}

// ========== 画像削除（左詰め） ==========
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
  let waitText = "(Wait 1h0m)";
  if (sum > 5000) waitText = "(Wait 2h0m)";
  else if (sum > 750) waitText = "(Wait 1h30m)";
  totalWaitEl.textContent = waitText;
  totalWaitEl.style.fontSize = "12px";
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
    secretProbEl.innerHTML = `<strong>Secret：15%以下</strong>`;
  }
}

// ========== 種類確率（スロット毎の色だけ加算） ==========
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

// ========== 枠色 ==========
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

// 初期表示
renderSelected();
updateAll();
