// ========== 画像データ ==========
// ========== 画像データ ==========
// data.js で定義されています

// ========== DOM要素 ==========
const galleryBrainrot = document.getElementById('gallery-brainrot');
const gallerySecret = document.getElementById('gallery-secret');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalBox = document.getElementById('total');
const totalTitle = document.getElementById('total-title');
const typeProbEl = document.getElementById('probability');
const monsterProbEl = document.getElementById('monster-probability'); // ← 新パネル
const resetBtn = document.getElementById('reset-btn');

// ========== 状態 ==========
let selectedImages = [null, null, null, null, null];
let selectedColors = ['Default', 'Default', 'Default', 'Default', 'Default'];
let selectedHasBorder = [false, false, false, false, false];

// ========== 基本確率 ==========
const baseProb = { Default: 9.5, Gold: 10, Diamond: 5, Rainbow: 0.5, Chocolate: 0, Other: 0 };

// ========== モンスターごとの確率ルール（グローバル化） ==========
const probabilityRules = [
  {
    max: 500, list: [
      { img: 'bambini.png', p: 40 },
      { img: 'alessio.png', p: 25 },
      { img: 'karkerkar.png', p: 20 },
      { img: 'piccione.png', p: 15 },
    ]
  },
  {
    max: 750, list: [
      { img: 'alessio.png', p: 25 },
      { img: 'karkerkar.png', p: 25 },
      { img: 'piccione.png', p: 35 },
      { img: 'ketchuru.png', p: 10 },
      { img: 'pothotspot.png', p: 5 },
    ]
  },
  {
    max: 1000, list: [
      { img: 'alessio.png', p: 15 },
      { img: 'karkerkar.png', p: 10 },
      { img: 'piccione.png', p: 55 },
      { img: 'ketchuru.png', p: 15 },
      { img: 'pothotspot.png', p: 5 },
    ]
  },
  {
    max: 1500, list: [
      { img: 'piccione.png', p: 50 },
      { img: 'ketchuru.png', p: 30 },
      { img: 'pothotspot.png', p: 20 },
    ]
  },
  {
    max: 2000, list: [
      { img: 'piccione.png', p: 30 },
      { img: 'ketchuru.png', p: 30 },
      { img: 'pothotspot.png', p: 35 },
      { img: 'iisacro.png', p: 5 },
    ]
  },
  {
    max: 3000, list: [
      { img: 'ketchuru.png', p: 30 },
      { img: 'pothotspot.png', p: 55 },
      { img: 'iisacro.png', p: 15 },
    ]
  },
  {
    max: 4000, list: [
      { img: 'ketchuru.png', p: 10 },
      { img: 'pothotspot.png', p: 60 },
      { img: 'iisacro.png', p: 25 },
      { img: 'chicleteira.png', p: 5 },
    ]
  },
  {
    max: 5000, list: [
      { img: 'pothotspot.png', p: 45 },
      { img: 'iisacro.png', p: 30 },
      { img: 'legolem.png', p: 20 },
      { img: 'chicleteira.png', p: 5 },
    ]
  },
  {
    max: 6500, list: [
      { img: 'pothotspot.png', p: 25 },
      { img: 'iisacro.png', p: 25 },
      { img: 'legolem.png', p: 30 },
      { img: 'chicleteira.png', p: 20 },
    ]
  },
  {
    max: 8000, list: [
      { img: 'pothotspot.png', p: 5 },
      { img: 'iisacro.png', p: 30 },
      { img: 'legolem.png', p: 35 },
      { img: 'chicleteira.png', p: 25 },
      { img: 'dulduldul.png', p: 5 },
    ]
  },
  {
    max: 10000, list: [
      { img: 'iisacro.png', p: 25 },
      { img: 'legolem.png', p: 35 },
      { img: 'chicleteira.png', p: 30 },
      { img: 'dulduldul.png', p: 10 },
    ]
  },
  {
    max: 12000, list: [
      { img: 'iisacro.png', p: 10 },
      { img: 'legolem.png', p: 25 },
      { img: 'chicleteira.png', p: 45 },
      { img: 'dulduldul.png', p: 20 },
    ]
  },
  {
    max: 16000, list: [
      { img: 'iisacro.png', p: 10 },
      { img: 'legolem.png', p: 15 },
      { img: 'chicleteira.png', p: 40 },
      { img: 'dulduldul.png', p: 30 },
      { img: 'chinpanking.png', p: 5 },
    ]
  },
  {
    max: 20000, list: [
      { img: 'legolem.png', p: 10 },
      { img: 'chicleteira.png', p: 35 },
      { img: 'dulduldul.png', p: 45 },
      { img: 'chinpanking.png', p: 10 },
    ]
  },
  {
    max: 25000, list: [
      { img: 'chicleteira.png', p: 35 },
      { img: 'dulduldul.png', p: 50 },
      { img: 'chinpanking.png', p: 15 },
    ]
  },
  {
    max: 30000, list: [
      { img: 'chicleteira.png', p: 25 },
      { img: 'dulduldul.png', p: 55 },
      { img: 'chinpanking.png', p: 20 },
    ]
  },
  {
    max: 35000, list: [
      { img: 'chicleteira.png', p: 20 },
      { img: 'dulduldul.png', p: 45 },
      { img: 'chinpanking.png', p: 30 },
      { img: 'cabritos.png', p: 5 },
    ]
  },
  {
    max: Infinity, list: [
      { img: 'chicleteira.png', p: 10 },
      { img: 'dulduldul.png', p: 45 },
      { img: 'chinpanking.png', p: 35 },
      { img: 'cabritos.png', p: 10 },
    ]
  },
];

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
  // 今いる帯を探す
  for (let i = 0; i < probabilityRules.length; i++) {
    const rule = probabilityRules[i];
    if (sumValue <= rule.max) {
      // 最終帯(=Infinity)ならもう上はない
      if (rule.max === Infinity) {
        return null;
      }
      // その帯の上限まであとどれくらいか
      const diff = rule.max - sumValue;
      // diffは0以上になるはず。0なら「次の帯に入るまで0K/s」だが、
      // 実質しきい値ちょうどの時は次の帯に入った扱いになるので0は出してOK
      return diff;
    }
  }
  // ここには基本こないはず
  return null;
}

// ========== 前のしきい値からの差分 ==========
function getPrevThresholdDiff(sumValue) {
  for (let i = 0; i < probabilityRules.length; i++) {
    const rule = probabilityRules[i];
    if (sumValue <= rule.max) {
      if (i === 0) {
        // 最初の帯なら0からの距離
        return sumValue;
      }
      const prevMax = probabilityRules[i - 1].max;
      return sumValue - prevMax;
    }
  }
  return null;
}

// ========== ギャラリー生成 ==========
// ========== ギャラリー生成 ==========
// グループ化
const groupedImages = [];
const processedIndices = new Set();

images.forEach((imgObj, index) => {
  if (processedIndices.has(index)) return;

  // 同じvalueとrarityを持つものを探す
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

  // 共通のラベル情報
  const firstObj = group[0];

  if (group.length > 1) {
    // 複数ある場合（分割表示）
    box.classList.add('imgbox--split');

    // ヒットエリアと画像を生成
    // CSSの ~ セレクタのために、ヒットエリアを先にDOMに追加する必要があるか、
    // あるいは兄弟関係であれば順序は柔軟だが、ここでは「ヒットエリア -> 画像」の順で追加する
    // ただし、HitLeft -> ImgLeft -> HitRight -> ImgRight の順でも
    // HitLeft ~ ImgLeft は成立する。

    group.forEach((imgObj, index) => {
      const isLeft = index === 0;

      // 1. ヒットエリア作成
      const hitArea = document.createElement('div');
      hitArea.className = `split-hit-area ${isLeft ? 'split-hit-left' : 'split-hit-right'}`;
      hitArea.addEventListener('click', (e) => {
        e.stopPropagation();
        selectMonster(imgObj);
      });
      box.appendChild(hitArea);

      // 2. 画像作成
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = `gallery-img split-img ${isLeft ? 'split-img-left' : 'split-img-right'}`;
      img.style.objectFit = 'cover';
      // 画像自体のクリックイベントはヒットエリアが上に来るため不要だが、念のため削除または残してもよい
      // ここではヒットエリアがclickを拾うので画像にはつけない

      box.appendChild(img);
    });

  } else {
    // 1つの場合（通常表示）
    const imgObj = group[0];
    const img = document.createElement('img');
    img.src = imgObj.src;
    img.className = 'gallery-img';
    img.style.objectFit = 'cover';

    img.addEventListener('click', () => {
      selectMonster(imgObj);
    });

    box.appendChild(img);
  }

  const label = document.createElement('div');
  label.className = 'value-label';
  label.textContent = `${firstObj.value} K/s`;

  // saleLabelの代わりにrarityを表示するか、あるいは非表示にするか
  // 要件: "BrainrotGot"のものはBrainrotGot欄、"Secret"のものはSecret欄
  // rarityがそれ以外の画像は表示しない

  // ラベル表示は一旦そのまま（saleプロパティはなくなったので注意）
  // formatSaleLabelM(firstObj.sale) -> formatSaleLabelM(???)
  // saleはもうないので、このラベルが何を表示していたかによる。
  // 元のコード: formatSaleLabelM(firstObj.sale)
  // sale=0 or 1 だった。
  // formatSaleLabelMの実装: valueM >= 1000 ? ... : ...
  // おそらく sale は数値として使われていたが、今回は rarity 文字列になった。
  // ユーザー要件に「saleLabelの表示」については言及なし。
  // ただし、既存のUIを壊さないようにするなら、
  // BrainrotGot -> 旧sale:0相当
  // Secret -> 旧sale:1相当
  // として扱うか、あるいはこのラベル自体を削除するか。
  // ここでは、一旦非表示にするか、あるいはダミーの値を入れるか。
  // formatSaleLabelM は数値を受け取る。
  // ユーザーは「value, rarityとし...」と言っている。
  // saleLabelが何を表示していたか確認すると、
  // function formatSaleLabelM(valueM) { ... }
  // これは引数が valueM となっているが、呼び出しは formatSaleLabelM(firstObj.sale) だった。
  // saleが0か1だったので、$ 0 M とか $ 1 M とか表示されていた？
  // いや、formatSaleLabelMの実装を見ると:
  // if (valueM >= 1000) ... return `$ ${trimNum(b)} B`;
  // return `$ ${trimNum(valueM)} M`;
  // sale=0なら $ 0 M, sale=1なら $ 1 M。
  // これが重要なら残すべきだが、"BrainrotGot" / "Secret" という区分になったので、
  // このラベルは意味が変わるかもしれない。
  // 一旦、Secretなら1、それ以外0として渡すか、あるいは非表示にする。
  // ユーザー指示「BrainrotGot欄に表示」「Secret欄に表示」「それ以外は表示しない」
  // フィルタリングをここで行う。

  if (firstObj.rarity === 'BrainrotGot') {
    galleryBrainrot.appendChild(box);
    // saleLabelの扱い: 以前は0だった
    const saleLabel = document.createElement('div');
    saleLabel.className = 'sale-label';
    saleLabel.textContent = formatSaleLabelM(0);
    box.appendChild(saleLabel);
  } else if (firstObj.rarity === 'Secret') {
    gallerySecret.appendChild(box);
    // saleLabelの扱い: 以前は1だった
    const saleLabel = document.createElement('div');
    saleLabel.className = 'sale-label';
    saleLabel.textContent = formatSaleLabelM(1);
    box.appendChild(saleLabel);
  } else {
    // 表示しない
    return;
  }

  box.appendChild(label);
  // box.appendChild(saleLabel); // 上でappendした
});

function selectMonster(imgObj) {
  const emptyIndex = selectedImages.findIndex(v => v === null);
  if (emptyIndex === -1) return;
  selectedImages[emptyIndex] = { ...imgObj };
  selectedColors[emptyIndex] = 'Default';
  selectedHasBorder[emptyIndex] = true;
  renderSelected();
  updateAll();
}

// ========== 選択エリア描画 ==========
function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';
    const imgObj = selectedImages[idx];

    if (imgObj) {
      // 画像ボックス生成
      const box = document.createElement('div');
      box.className = 'imgbox imgbox--selected';

      // グループ（ペア）を探す
      const group = images.filter(img => img.value === imgObj.value && img.rarity === imgObj.rarity);

      if (group.length > 1) {
        box.classList.add('imgbox--split');

        group.forEach((gImg, index) => {
          const isLeft = index === 0;

          // 1. ヒットエリア作成
          const hitArea = document.createElement('div');
          hitArea.className = `split-hit-area ${isLeft ? 'split-hit-left' : 'split-hit-right'}`;
          hitArea.addEventListener('click', () => removeFromSelected(idx));
          box.appendChild(hitArea);

          // 2. 画像作成
          const img = document.createElement('img');
          img.src = gImg.src;
          img.className = `selected-img split-img ${isLeft ? 'split-img-left' : 'split-img-right'}`;
          // 画像のクリックイベントはヒットエリアが拾うので不要
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
      // saleLabel.textContent = formatSaleLabelM(imgObj.sale); // 旧コード
      if (imgObj.rarity === 'BrainrotGot') {
        saleLabel.textContent = formatSaleLabelM(0);
      } else if (imgObj.rarity === 'Secret') {
        saleLabel.textContent = formatSaleLabelM(1);
      } else {
        saleLabel.textContent = '';
      }
      saleLabel.className = 'sale-label';
      box.appendChild(saleLabel);

      applyOutline(box, idx);
      wrapper.appendChild(box);

      // ボタンコンテナ
      const btnContainer = document.createElement('div');
      btnContainer.className = 'button-container';

      ['Default', 'Gold', 'Diamond', 'Rainbow', 'Chocolate', 'Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;

        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          selectedColors[idx] = type;
          selectedHasBorder[idx] = true;
          applyOutline(box, idx); // 枠色を即時反映
          updateAll();            // 計算更新
        });

        btnContainer.appendChild(btn);
      });

      wrapper.appendChild(btnContainer);
    } else {
      // 未選択時のプレースホルダ
      const ph = document.createElement('div');
      ph.className = 'imgbox imgbox--selected';
      ph.style.backgroundColor = '#555';
      wrapper.appendChild(ph);
    }
  });
}

// ========== 枠色 ==========
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

// ========== RESET ==========
resetBtn.addEventListener('click', () => {
  selectedImages = [null, null, null, null, null];
  selectedColors = ['Default', 'Default', 'Default', 'Default', 'Default'];
  selectedHasBorder = [false, false, false, false, false];
  renderSelected();
  updateAll();
});

// ========== 更新 ==========
function updateAll() {
  updateTotal();
  updateMonsterProbability();
  updateTypeProbability();
}

// ========== Total欄 ==========
function updateTotal() {
  const sumValue = selectedImages.reduce((acc, img) => acc + Number(img?.value || 0), 0);
  const sumSaleM = selectedImages.reduce((acc, img) => acc + Number(img?.sale || 0), 0);

  let waitStr = "1h0m";
  if (sumValue > 5000) waitStr = "2h0m";
  else if (sumValue > 750) waitStr = "1h30m";

  const sumSaleLabel = formatSaleLabelM(sumSaleM).replace('$ ', '');

  // 次のしきい値まであと何K/sか
  const rawDiff = getNextThresholdDiff(sumValue);
  let nextLineText;

  if (rawDiff === null) {
    nextLineText = "確率は現在が最高帯です";
  } else {
    const diffToNext = rawDiff + 1;
    if (diffToNext > 0) {
      const emoji = diffToNext <= sumValue / 20 ? " 😱" : "";
      nextLineText = `次の確率帯まで<span class="total-number">${diffToNext}</span> K/s${emoji}`;
    } else {
      nextLineText = "次の確率帯まで <span class=\"total-number\">1</span> K/s 😱";
    }
  }

  const diffToPrev = getPrevThresholdDiff(sumValue);

  if (totalTitle) {
    totalTitle.textContent = "Total";
  }

  const lines = [
    `Total K/s：<span class="total-number">${sumValue}</span>`,
    //`Total $　：<span class="total-number">${sumSaleLabel}</span>`,
    //`Wait　　：${waitStr}`,
    nextLineText
  ];

  if (diffToPrev !== null) {
    const emoji = diffToPrev <= sumValue / 20 ? " 😍" : "";
    lines.push(`(前の確率帯から +${diffToPrev} K/s${emoji})`);
  }

  totalBox.innerHTML = lines.map(t => `<div>${t}</div>`).join('');
}

// ========== モンスターごとの確率ルール取得 ==========
function getMonsterProbabilities(sumValue) {
  return probabilityRules.find(r => sumValue <= r.max).list;
}

// ========== モンスターごとの確率表示（Total K/sに応じて動的更新） ==========
function updateMonsterProbability() {
  const container = document.getElementById('monster-probability');
  if (!container) return;
  container.innerHTML = '';

  // 合計K/s
  const sumValue = selectedImages.reduce((acc, img) => acc + Number(img?.value || 0), 0);

  // 251以下なら表示しない（要件）
  if (sumValue <= 251) return;
  // 0扱いなら何も出さない、もこれに含まれる

  const monsters = getMonsterProbabilities(sumValue);

  monsters.forEach(({ img, p }) => {
    const box = document.createElement('div');
    box.className = 'monster-box';

    const image = document.createElement('img');
    image.src = `./img/${img}`;
    image.alt = img;

    const probText = document.createElement('div');
    probText.className = 'monster-prob-text';
    probText.textContent = `${p}%`;

    box.appendChild(image);
    box.appendChild(probText);
    container.appendChild(box);
  });
}

// ========== 種類確率 ==========
function updateTypeProbability() {
  const probs = { ...baseProb };
  const colorSums = { Default: 0, Gold: 0, Diamond: 0, Rainbow: 0, Chocolate: 0, Other: 0 };

  for (let i = 0; i < selectedImages.length; i++) {
    const img = selectedImages[i];
    if (!img) continue;
    const color = selectedColors[i] || 'Default';
    colorSums[color] += img.value;
  }

  const totalColorSum = Object.values(colorSums).reduce((a, b) => a + b, 0);
  if (totalColorSum > 0) {
    const bonus = 75;
    for (const c in colorSums) {
      if (colorSums[c] > 0) probs[c] += bonus * (colorSums[c] / totalColorSum);
    }
  } else {
    probs.Default = 84.5; probs.Gold = 10; probs.Diamond = 5; probs.Rainbow = 0.5;
  }

  const items = Object.keys(probs)
    .map(k => ({ name: k, prob: (probs[k] || 0).toFixed(1) }))
    .sort((a, b) => b.prob - a.prob);

  typeProbEl.innerHTML = items
    .map(it => `<span class="${it.name}">${it.name}: ${it.prob}%</span>`)
    .join('');
}

function getButtonColor(type) {
  switch (type) {
    case 'Default': return '#333333';
    case 'Gold': return '#ffd700';
    case 'Diamond': return '#00b0ff';
    case 'Rainbow': return '#d500f9';
    case 'Chocolate': return '#D2691E';
    case 'Other': return '#888888';
    default: return '#333333';
  }
}

renderSelected();
updateAll();