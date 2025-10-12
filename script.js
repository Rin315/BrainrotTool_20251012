const gallery = document.getElementById('gallery');
const selected = document.getElementById('selected');
const totalDiv = document.getElementById('total');

const images = [
  { src: './img/8.png', value: 5, gold: 6.25, diamond: 7.5, halloween: 50 }, // 不明
  { src: './img/67.png', value: 6700, gold: 8375, diamond: 10050, halloween: 67000 },
  { src: './img/alessio.png', value: 180, gold: 225, diamond: 270, halloween: 1800 },
  { src: './img/bambini.png', value: 120, gold: 150, diamond: 180, halloween: 1200 },
  { src: './img/brainrot1.png', value: 4, gold: 5, diamond: 6, halloween: 40 }, // 不明
  { src: './img/brrestrh.png', value: 140, gold: 175, diamond: 210, halloween: 1400 },
  { src: './img/brri.png', value: 130, gold: 162.5, diamond: 195, halloween: 1300 },
  { src: './img/bulbito.png', value: 130, gold: 162.5, diamond: 195, halloween: 1300 }, // 怪しい
  { src: './img/chicleteira.png', value: 8000, gold: 10000, diamond: 12000, halloween: 80000 },
  { src: './img/cocofanto.png', value: 10, gold: 12.5, diamond: 15, halloween: 100 },
  { src: './img/ecco.png', value: 110, gold: 137.5, diamond: 165, halloween: 1100 },
  { src: './img/Espressona.png', value: 90, gold: 112.5, diamond: 135, halloween: 900 },
  { src: './img/garamarama.png', value: 3000, gold: 3750, diamond: 4500, halloween: 30000 },
  { src: './img/house.png', value: 20000, gold: 25000, diamond: 30000, halloween: 200000 },
  { src: './img/iimastodontico.png', value: 220, gold: 275, diamond: 330, halloween: 2200 }, // 怪しい
  { src: './img/iipiccione.png', value: 210, gold: 262.5, diamond: 315, halloween: 2100 },
  { src: './img/iisacro.png', value: 4000, gold: 5000, diamond: 6000, halloween: 40000 },
  { src: './img/jobjobjob.png', value: 220, gold: 275, diamond: 330, halloween: 2200 },
  { src: './img/karkerkar.png', value: 190, gold: 237.5, diamond: 285, halloween: 1900 },
  { src: './img/ketchuru.png', value: 1500, gold: 1875, diamond: 2250, halloween: 15000 },
  { src: './img/lavaca.png', value: 100, gold: 125, diamond: 150, halloween: 1000 },
  { src: './img/los.png', value: 170, gold: 212.5, diamond: 255, halloween: 1700 },
  { src: './img/losorcaleritos.png', value: 400, gold: 500, diamond: 600, halloween: 4000 },
  { src: './img/losjob.png', value: 1000, gold: 1250, diamond: 1500, halloween: 10000 }, // 不明
  { src: './img/lostralaleritas.png', value: 200, gold: 250, diamond: 300, halloween: 2000 },
  { src: './img/lostralaletitos.png', value: 200, gold: 250, diamond: 300, halloween: 2000 },
  { src: './img/nomyhotspot.png', value: 2500, gold: 3125, diamond: 3750, halloween: 25000 },
  { src: './img/Odin.png', value: 75, gold: 93.75, diamond: 112.5, halloween: 750 },
  { src: './img/orcalero.png', value: 1000, gold: 1250, diamond: 1500, halloween: 10000 },
  { src: './img/pad.png', value: 10000, gold: 12500, diamond: 15000, halloween: 100000 },
  { src: './img/pakrah.png', value: 600, gold: 750, diamond: 900, halloween: 6000 },
  { src: './img/piccione.png', value: 500, gold: 625, diamond: 750, halloween: 5000 },
  { src: './img/pothotspot.png', value: 2000, gold: 2500, diamond: 3000, halloween: 20000 },
  { src: './img/secret1.png', value: 3, gold: 3.75, diamond: 4.5, halloween: 30 }, // 不明
  { src: './img/secret2.png', value: 5, gold: 6.25, diamond: 7.5, halloween: 50 }, // 不明
  { src: './img/tob.png', value: 25, gold: 31.25, diamond: 37.5, halloween: 250 },
  { src: './img/torrtuginni.png', value: 150, gold: 187.5, diamond: 225, halloween: 1500 },
  { src: './img/tralalero.png', value: 50, gold: 62.5, diamond: 75, halloween: 500 },
  { src: './img/trenostruzzo.png', value: 300, gold: 375, diamond: 450, halloween: 3000 }
];

// 選択された画像を保持する配列
let selectedImages = [];

// ギャラリーに画像を表示
images.forEach(imgData => {
  const img = document.createElement('img');
  img.src = imgData.src;
  img.alt = "ギャラリー画像";

  img.addEventListener('click', () => {
    selectImage(imgData);
  });

  gallery.appendChild(img);
});

// 画像を選択する関数
function selectImage(imgData) {
  if (selectedImages.length >= 5) {
    selectedImages.shift();
  }

  // 縁色を保持するためオブジェクトをコピーして追加
  selectedImages.push({...imgData, borderColor: 'black'}); // 初期縁色は黒

  renderSelected();
  calculateTotal();
}

// 選択画像を表示
function renderSelected() {
  selected.innerHTML = '';
  selectedImages.forEach((imgData, index) => {
    const container = document.createElement('div');
    container.style.display = 'inline-block';
    container.style.textAlign = 'center';

    const img = document.createElement('img');
    img.src = imgData.src;
    img.classList.add('selected-img');
    img.style.borderColor = imgData.borderColor; // 保存された縁色を適用
    container.appendChild(img);

    // ボタン縦配置
    const btnContainer = document.createElement('div');
    btnContainer.classList.add('button-container');

    const buttonInfo = [
      { name: 'Normal', color: 'black' },
      { name: 'Gold', color: 'yellow' },
      { name: 'Diamond', color: 'cyan' },
      { name: 'Halloween', color: 'orange' }
    ];

    buttonInfo.forEach(btn => {
      const button = document.createElement('button');
      button.textContent = btn.name;
      button.classList.add(btn.name);
      button.style.borderColor = btn.color;

      // ボタン押下時に縁色更新
      button.addEventListener('click', () => {
        imgData.borderColor = btn.color; // 状態を保持
        img.style.borderColor = btn.color; // 表示更新
        calculateTotal(); // リアルタイムに合計値更新
      });

      btnContainer.appendChild(button);
    });

    container.appendChild(btnContainer);
    selected.appendChild(container);
  });
}

// 合計値を計算（縁色によって倍率後の数値を使用）
function calculateTotal() {
  let sum = 0;
  selectedImages.forEach(img => {
    let val = img.value; // 初期値

    if (img.borderColor === 'yellow') val = img.gold;
    else if (img.borderColor === 'cyan') val = img.diamond;
    else if (img.borderColor === 'orange') val = img.halloween;

    sum += val;
  });

  totalDiv.textContent = sum;
}
