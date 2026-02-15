// ========== DOM要素 ==========
const galleryBrainrot = document.getElementById('gallery-brainrot');
const gallerySecret = document.getElementById('gallery-secret');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalBox = document.getElementById('total');
const totalTitle = document.getElementById('total-title');
const typeProbEl = document.getElementById('probability');
const monsterProbEl = document.getElementById('monster-probability');
const resetBtn = document.getElementById('reset-btn');

// ========== 状態 ==========
let selectedImages = [null, null, null, null, null];
let selectedColors = ['Default', 'Default', 'Default', 'Default', 'Default'];
let selectedHasBorder = [false, false, false, false, false];

// ========== 基本確率 ==========
const baseProb = { Default: 9.5, Gold: 10, Diamond: 5, Rainbow: 0.5, Toxic: 0, Galaxy: 0, Zombie: 0, Dreamy: 0, "ICE&FIRE": 0, Carnival: 0, Aqua: 0, Halloween: 0, Darkness: 0, Neon: 0, Christmas: 0, Chocolate: 0, Other: 0 };

// ========== モンスターごとの確率ルール（rules.js で定義） ==========
// monsterProbabilityRules は rules.js から読み込まれます

// ========== ユーティリティ ==========
function formatSaleLabelM(valueM) {
  if (valueM >= 1000) {
    const b = valueM / 1000;
    return `$ ${trimNum(b)} B`;
  }
  return `$ ${trimNum(valueM)} M`;
}
function trimNum(n) {
  return Number.isInteger(n) ? String(n) : String(+parseFloat(n.toFixed(2)));
}

// ========== 次のしきい値までの差分 ==========
function getNextThresholdDiff(sumValue) {
  for (let i = 0; i < monsterProbabilityRules.length; i++) {
    const rule = monsterProbabilityRules[i];
    if (sumValue <= rule.threshold) {
      if (rule.threshold === Infinity) return null;
      return rule.threshold - sumValue;
    }
  }
  return null;
}

// ========== 前のしきい値からの差分 ==========
function getPrevThresholdDiff(sumValue) {
  for (let i = 0; i < monsterProbabilityRules.length; i++) {
    const rule = monsterProbabilityRules[i];
    if (sumValue <= rule.threshold) {
      if (i === 0) return sumValue;
      const prevMax = monsterProbabilityRules[i - 1].threshold;
      return sumValue - prevMax;
    }
  }
  return null;
}

// ========== ギャラリー生成 ==========
// ========== ギャラリー生成 ==========
let showEventLimited = false;

function renderGallery() {
  galleryBrainrot.innerHTML = '';
  gallerySecret.innerHTML = '';
  const processedIndices = new Set();
  const groupedImages = [];

  images.forEach((imgObj, index) => {
    if (processedIndices.has(index)) return;

    // イベント限定モンスターのフィルタリング（初期は非表示）
    if (!showEventLimited && imgObj.rarity.endsWith('-')) return;

    const group = [imgObj];
    processedIndices.add(index);
    for (let i = index + 1; i < images.length; i++) {
      if (processedIndices.has(i)) continue;
      const other = images[i];
      if (other.value === imgObj.value && other.rarity === imgObj.rarity) {
        group.push(other);
        processedIndices.add(i);
      }
    }
    groupedImages.push(group);
  });

  groupedImages.forEach((group) => {
    const box = document.createElement('div');
    box.className = 'imgbox imgbox--gallery';
    const firstObj = group[0];
    if (group.length > 1) {
      box.classList.add('imgbox--split');
      group.forEach((imgObj, index) => {
        const isLeft = index === 0;
        const hitArea = document.createElement('div');
        hitArea.className = `split-hit-area ${isLeft ? 'split-hit-left' : 'split-hit-right'}`;
        hitArea.addEventListener('click', (e) => {
          e.stopPropagation();
          selectMonster(imgObj);
        });
        box.appendChild(hitArea);
        const img = document.createElement('img');
        img.src = imgObj.src;
        img.className = `gallery-img split-img ${isLeft ? 'split-img-left' : 'split-img-right'}`;
        img.style.objectFit = 'cover';
        box.appendChild(img);
      });
    } else {
      const imgObj = group[0];
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'gallery-img';
      img.style.objectFit = 'cover';
      img.addEventListener('click', () => { selectMonster(imgObj); });
      box.appendChild(img);
    }
    const label = document.createElement('div');
    label.className = 'value-label';
    label.textContent = `${firstObj.value} K/s`;

    // Rarity checks should use startsWith to handle event-limited variants (e.g. BrainrotGot-)
    if (firstObj.rarity.startsWith('BrainrotGot')) {
      galleryBrainrot.appendChild(box);
      const saleLabel = document.createElement('div');
      saleLabel.className = 'sale-label';
      saleLabel.textContent = formatSaleLabelM(0);
      box.appendChild(saleLabel);
    } else if (firstObj.rarity.startsWith('Secret')) {
      gallerySecret.appendChild(box);
      const saleLabel = document.createElement('div');
      saleLabel.className = 'sale-label';
      saleLabel.textContent = formatSaleLabelM(1);
      box.appendChild(saleLabel);
    } else {
      return;
    }
    box.appendChild(label);
  });
}

// 初期描画
renderGallery();

// イベント限定モンスター表示切り替えボタン
const eventToggleBtn = document.getElementById('event-toggle-btn');
if (eventToggleBtn) {
  eventToggleBtn.onclick = () => {
    showEventLimited = !showEventLimited;
    eventToggleBtn.classList.toggle('active', showEventLimited);
    eventToggleBtn.textContent = showEventLimited ? 'イベント限定モンスターを非表示' : 'イベント限定モンスターを表示';
    renderGallery();
  };
}

function selectMonster(imgObj) {
  const emptyIndex = selectedImages.findIndex(v => v === null);
  if (emptyIndex === -1) return;
  selectedImages[emptyIndex] = { ...imgObj };
  selectedColors[emptyIndex] = 'Default';
  selectedHasBorder[emptyIndex] = true;
  renderSelected();
  updateAll();
}

function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];
    if (imgObj) {
      const box = document.createElement('div');
      box.className = 'imgbox imgbox--selected';
      const group = images.filter(img => img.value === imgObj.value && img.rarity === imgObj.rarity);
      if (group.length > 1) {
        box.classList.add('imgbox--split');
        group.forEach((gImg, index) => {
          const isLeft = index === 0;
          const hitArea = document.createElement('div');
          hitArea.className = `split-hit-area ${isLeft ? 'split-hit-left' : 'split-hit-right'}`;
          hitArea.addEventListener('click', () => removeFromSelected(idx));
          box.appendChild(hitArea);
          const img = document.createElement('img');
          img.src = gImg.src;
          img.className = `selected-img split-img ${isLeft ? 'split-img-left' : 'split-img-right'}`;
          box.appendChild(img);
        });
      } else {
        const img = document.createElement('img');
        img.src = imgObj.src;
        img.className = 'selected-img';
        img.addEventListener('click', () => removeFromSelected(idx));
        box.appendChild(img);
      }
      const label = document.createElement('div');
      label.textContent = `${imgObj.value} K/s`;
      label.className = 'value-label';
      box.appendChild(label);
      const saleLabel = document.createElement('div');
      if (imgObj.rarity === 'BrainrotGot') {
        saleLabel.textContent = formatSaleLabelM(0);
      } else if (imgObj.rarity.startsWith('Secret')) {
        saleLabel.textContent = formatSaleLabelM(1);
      } else {
        saleLabel.textContent = '';
      }
      saleLabel.className = 'sale-label';
      box.appendChild(saleLabel);
      applyOutline(box, idx);
      wrapper.appendChild(box);
      /* 
      // 変異選択ボタン（一時的に無効化）
      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';
      ['Default', 'Gold', 'Diamond', 'Rainbow', 'Toxic', 'Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedColors[idx] = type;
          selectedHasBorder[idx] = true;
          applyOutline(box, idx);
          updateAll();
        });
        btnContainer.appendChild(btn);
      });
      wrapper.appendChild(btnContainer);
      */
    } else {
      const ph = document.createElement('div');
      ph.className = 'imgbox imgbox--selected';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

function applyOutline(boxEl, idx) {
  const color = getButtonColor(selectedColors[idx] || 'Default');
  const bw = window.matchMedia('(max-width: 600px)').matches ? 3 : 5;
  if (selectedHasBorder[idx]) {
    boxEl.style.outline = `${bw}px solid ${color}`;
  } else {
    boxEl.style.outline = 'none';
  }
}

function removeFromSelected(index) {
  selectedImages.splice(index, 1);
  selectedImages.push(null);
  selectedColors.splice(index, 1);
  selectedColors.push('Default');
  selectedHasBorder.splice(index, 1);
  selectedHasBorder.push(false);
  renderSelected();
  updateAll();
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    selectedImages = [null, null, null, null, null];
    selectedColors = ['Default', 'Default', 'Default', 'Default', 'Default'];
    selectedHasBorder = [false, false, false, false, false];
    renderSelected();
    updateAll();
  });
}

function updateAll() {
  updateTotal();
  updateMonsterProbability();
  updateTypeProbability();
}

function updateTotal() {
  const sumValue = selectedImages.reduce((acc, img) => acc + Number(img?.value || 0), 0);

  // 1. Calculate Next and Next²
  let nextDiff = null;
  let nextNextDiff = null;
  let currentRangeIndex = -1;

  // Find current range index.
  // monsterProbabilityRules is sorted by threshold (ascending).
  for (let i = 0; i < monsterProbabilityRules.length; i++) {
    if (sumValue <= monsterProbabilityRules[i].threshold) {
      currentRangeIndex = i;
      break;
    }
  }

  // If sumValue is larger than the last threshold (should cover max range logic if rules are exhaustive),
  // or if it matches the last one exactly?
  // Let's assume the rules cover all ranges up to infinity or the last item is the max.
  // Actually, getNextThresholdDiff found the *next* threshold.
  // Here we want to find the current active range to determine "Next" (start of next range)
  // The "Next" threshold is simply the end of the current range + 1?
  // Or is it the *next* range's start?
  // Logic: "Next" means distance to the NEXT probability tier.
  // unique behavior: "Next²" means distance to the tier AFTER the next one.

  // Re-evaluating based on existing getNextThresholdDiff logic:
  // It returns (threshold - sumValue). So (threshold - sumValue + 1) is amount needed to reach Next Tier.

  let isMax = false;
  if (currentRangeIndex === -1) {
    // Falls through if rules are not exhaustive or sum > all thresholds?
    // In current data, last threshold might be valid.
    // Let's stick to using the found index.
    // If loop finished without break, we are above all defined thresholds?
    // Wait, getNextThresholdDiff handles "infinity".
    // Let's assume we are in range `currentRangeIndex`.
    // If we are at the last index, we are at Max.
    if (sumValue > monsterProbabilityRules[monsterProbabilityRules.length - 1].threshold) {
      isMax = true;
    }
  } else if (currentRangeIndex === monsterProbabilityRules.length - 1) {
    // If we are in the last defined range, is it max?
    // Usually the last rule is the "Max" range or "Highest".
    // Let's assume the last entry in rules IS the highest band.
    isMax = true;
  }

  // Logic for Next / Next²
  // Next Diff = (Current Range Threshold) - sumValue + 1
  // Next² Diff = (Next Range Threshold) - sumValue + 1

  let nextLineHTML = '';

  if (isMax) {
    nextLineHTML = '確率は現在が<span style="color: #ff4d4d; font-weight: bold;">最高帯</span>です。';
  } else {
    // We are at currentRangeIndex.
    // Next tier starts at monsterProbabilityRules[currentRangeIndex].threshold + 1
    const currentThreshold = monsterProbabilityRules[currentRangeIndex].threshold;
    nextDiff = currentThreshold - sumValue + 1;

    const emoji1 = nextDiff <= sumValue / 20 ? " 😱" : "";
    nextLineHTML += `Next ： 次の確率帯まで あと <span class="total-number">${nextDiff}</span> K/s${emoji1}`;

    // Next²
    // The tier AFTER next starts at monsterProbabilityRules[currentRangeIndex + 1].threshold + 1
    if (currentRangeIndex + 1 < monsterProbabilityRules.length - 1) { // -1 because the last one is Max? Or just check existence?
      // If current is i, next range is i+1.
      // If i+1 is the *last* one, it is the Max range. format says "Next²: さらに次の..."
      // Let's enable Next² as long as i+1 exists.
      const nextNextThreshold = monsterProbabilityRules[currentRangeIndex + 1].threshold;
      nextNextDiff = nextNextThreshold - sumValue + 1;
      const emoji2 = nextNextDiff <= sumValue / 20 ? " 😱" : ""; // Use same emoji logic?
      nextLineHTML += `<br>Next²： さらに次の確率帯まで あと <span class="total-number">${nextNextDiff}</span> K/s${emoji2}`;
    }
  }

  const diffToPrev = getPrevThresholdDiff(sumValue);
  if (totalTitle) totalTitle.textContent = "Total";

  // Format Line 1: Total ... (Prev ...)
  let line1 = `TOTAL： <span class="total-number">${sumValue}</span> K/s`;
  if (diffToPrev !== null) {
    const emoji = diffToPrev <= sumValue / 20 ? " 😍" : "";
    line1 += ` （前の確率帯から + <span class="total-number">${diffToPrev}</span> K/s オーバー${emoji}）`;
  }

  const lines = [line1, nextLineHTML];
  totalBox.innerHTML = lines.map(t => `<div>${t}</div>`).join('');
}

function updateMonsterProbability() {
  const container = document.getElementById('monster-probability');
  if (!container) return;
  container.innerHTML = '';
  const sumValue = selectedImages.reduce((acc, img) => acc + Number(img?.value || 0), 0);
  if (sumValue <= 251) return;
  const rule = monsterProbabilityRules.find(r => sumValue <= r.threshold);
  if (!rule) return;
  rule.monsters.forEach(({ id, percent }) => {
    const monster = images.find(m => m.id === id);
    if (!monster) return;
    const box = document.createElement('div');
    box.className = 'monster-box';
    const image = document.createElement('img');
    image.src = monster.src;
    const probText = document.createElement('div');
    probText.className = 'monster-prob-text';
    probText.textContent = `${percent}%`;
    box.appendChild(image);
    box.appendChild(probText);
    container.appendChild(box);
  });
}

function updateTypeProbability() {
  // シリーズごとの確率計算を無効化（仕様変更のため）
  /*
  const probs = { ...baseProb };
  const colorSums = {};
  selectedImages.forEach((img, i) => {
    if (!img) return;
    const color = selectedColors[i] || 'Default';
    colorSums[color] = (colorSums[color] || 0) + img.value;
  });
  const totalColorSum = Object.values(colorSums).reduce((a, b) => a + b, 0);
  if (totalColorSum > 0) {
    const bonus = 75;
    for (const c in colorSums) {
      if (typeof probs[c] !== 'undefined') {
        probs[c] += bonus * (colorSums[c] / totalColorSum);
      }
    }
  } else {
    probs.Default = 84.5; probs.Gold = 10; probs.Diamond = 5; probs.Rainbow = 0.5;
  }
  const items = Object.keys(probs)
    .map(k => ({ name: k, prob: parseFloat(probs[k].toFixed(1)) }))
    .sort((a, b) => b.prob - a.prob);
  typeProbEl.innerHTML = items
    .filter(it => it.prob > 0)
    .map(it => `<span class="${it.name}">${it.name}: ${it.prob}%</span>`)
    .join('');
  */
}

function getButtonColor(type) {
  switch (type) {
    case 'Default': return '#333333';
    case 'Gold': return '#ffd700';
    case 'Diamond': return '#00b0ff';
    case 'Rainbow': return '#d500f9';
    case 'Toxic': return '#9ACD32';
    case 'Chocolate': return '#D2691E';
    case 'Other': return '#888888';
    default: return '#333333';
  }
}

renderSelected();
updateAll();