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
// 色は常に保持（初期は Default 扱い）。ただし「枠を出す/出さない」は別フラグで管理。
let selectedColors = ['Default','Default','Default','Default','Default'];
let selectedHasBorder = [false, false, false, false, false]; // 押すまでは枠を出さない

// ========== 基本確率 ==========
const baseProb = { Default: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };

// ========== 押下フィードバック（枠ごと縮小 & 暗転 / 最低表示時間あり） ==========
function attachPressFeedbackBox(boxEl) {
  let timer = null;
  let pressed = false;

  const add = () => {
    if (pressed) return;
    pressed = true;
    boxEl.classList.add('pressed'); // ← .imgbox に付与（画像だけ縮めると隙間が見えるため）
    timer = setTimeout(() => {
      timer = null;
      if (!pressed) boxEl.classList.remove('pressed');
    }, 120);
  };
  const rm = () => {
    if (!pressed) return;
    pressed = false;
    if (timer) return;
    boxEl.classList.remove('pressed');
  };

  boxEl.addEventListener('pointerdown', add);
  boxEl.addEventListener('pointerup', rm);
  boxEl.addEventListener('pointercancel', rm);
  boxEl.addEventListener('pointerleave', rm);
}

// ========== ギャラリー生成 ==========
images.forEach((imgObj) => {
  const box = document.createElement('div');
  box.className = 'imgbox imgbox--gallery';
  attachPressFeedbackBox(box); // ← 枠ごと縮小で白い縁が見えない

  const img = document.createElement('img');
  img.src = imgObj.src;
  img.alt = imgObj.src.split('/').pop();
  img.className = 'gallery-img';

  const label = document.createElement('div');
  label.className = 'value-label';
  label.textContent = `${imgObj.value} K/s`;

  img.addEventListener('click', () => {
    const emptyIndex = selectedImages.findIndex(v => v === null);
    if (emptyIndex === -1) return;
    selectedImages[emptyIndex]  = { ...imgObj };
    selectedColors[emptyIndex]  = 'Default'; // 計算上は Default 扱い
    selectedHasBorder[emptyIndex] = false;   // ただし見た目の枠は出さない
    renderSelected();
    updateAll();
  });

  box.appendChild(img);
  box.appendChild(label);
  gallery.appendChild(box);
});

// ========== 選択エリア描画（画像→帯→縁=outline の順 / 縁は画像外側） ==========
function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      const box = document.createElement('div');
      box.className = 'imgbox imgbox--selected';
      attachPressFeedbackBox(box); // ← 枠ごと縮小でスマホでも綺麗

      // 画像（最下）
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      // 画像自体にはボーダーを当てない（数字帯や押下でズレる問題を避ける）
      img.style.border = "0 solid transparent";
      img.addEventListener('click', () => removeFromSelected(idx));
      box.appendChild(img);

      // 数値帯（中）
      const label = document.createElement('div');
      label.textContent = `${imgObj.value} K/s`;
      label.className = 'value-label';
      box.appendChild(label);

      // 縁（外側 / outlineで画像の外につける → 数字に被らない）
      applyOutline(box, idx);

      // DOMに追加
      wrapper.appendChild(box);

      // ボタン群（このスロットだけ更新）
      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      ['Default', 'Gold', 'Diamond', 'Rainbow', 'Halloween', 'Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedColors[idx]  = type;     // ← この idx だけ更新
          selectedHasBorder[idx] = true;    // ← 枠を表示
          applyOutline(box, idx);           // ← 見た目即時反映（外枠）
          updateAll();                      // ← 計算更新
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);

    } else {
      // 未選択時のプレースホルダ
      const ph = document.createElement('div');
      ph.className = 'imgbox imgbox--selected';
      // 縁は表示しない
      ph.style.outline = 'none';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// 画像外側の枠（outline）を適用
function applyOutline(boxEl, idx){
  const color  = getButtonColor(selectedColors[idx] || 'Default');
  const width  = window.matchMedia('(max-width: 600px)').matches ? 3 : 5;
  if (selectedHasBorder[idx]) {
    // outline はボックス外側に描かれるので数字帯と重ならない
    boxEl.style.outline = `${width}px solid ${color}`;
    boxEl.style.outlineOffset = '0px';
  } else {
    boxEl.style.outline = 'none';
  }
}

// ========== 画像削除（左詰め） ==========
function removeFromSelected(index){
  selectedImages.splice(index, 1);
  selectedImages.push(null);
  selectedColors.splice(index, 1);
  selectedColors.push('Default');      // デフォルトに戻す
  selectedHasBorder.splice(index, 1);
  selectedHasBorder.push(false);       // 枠非表示
  renderSelected();
  updateAll();
}

// ========== RESET ==========
resetBtn.addEventListener('click', () => {
  selectedImages   = [null, null, null, null, null];
  selectedColors   = ['Default','Default','Default','Default','Default'];
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

// ========== 種類確率（各スロットの色だけ加算） ==========
function updateTypeProbability(){
  const probs = { ...baseProb };
  const colorSums = { Default:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };

  for (let i = 0; i < selectedImages.length; i++){
    const img = selectedImages[i];
    if (!img) continue;
    const color = selectedColors[i] || 'Default'; // スロットごとに色を反映
    colorSums[color] += img.value;
  }

  const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b,0);
  if (totalColorSum > 0) {
    const bonus = 75;
    for (const c in colorSums) {
      if (colorSums[c] > 0) probs[c] += bonus * (colorSums[c] / totalColorSum);
    }
  } else {
    // 未選択時の固定表示
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
    case 'Other': return 'white';
    default: return 'black';
  }
}

// 初期表示
renderSelected();
updateAll();
