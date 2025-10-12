const gallery = document.getElementById('gallery');
const selected = document.getElementById('selected');
const totalDiv = document.getElementById('total');

// 画像と数値を割り当て
const images = [
  { src: './img/8.png', value: 5 },
  { src: './img/67.png', value: 3 },
  { src: './img/alessio.png', value: 7 },
  { src: './img/bambini.png', value: 2 },
  { src: './img/brainrot1.png', value: 4 },
  { src: './img/brrestrh.png', value: 6 },
  { src: './img/brri.png', value: 1 },
  { src: './img/bulbito.png', value: 8 },
  { src: './img/Userschicleteira.png', value: 3 },
  { src: './img/cocofanto.png', value: 5 },
  { src: './img/ecco.png', value: 2 },
  { src: './img/Espressona.png', value: 7 },
  { src: './img/garamarama.png', value: 4 },
  { src: './img/house.png', value: 6 },
  { src: './img/iimastodontico.png', value: 3 },
  { src: './img/iipiccione.png', value: 5 },
  { src: './img/iisacro.png', value: 2 },
  { src: './img/jobjobjob.png', value: 8 },
  { src: './img/karkerkar.png', value: 1 },
  { src: './img/ketchuru.png', value: 4 },
  { src: './img/lavaca.png', value: 6 },
  { src: './img/los.png', value: 3 },
  { src: './img/losorcaleritos.png', value: 5 },
  { src: './img/losrabca.png', value: 2 },
  { src: './img/lostralaleritas.png', value: 7 },
  { src: './img/lostralaletitos.png', value: 4 },
  { src: './img/nomyhotspot.png', value: 6 },
  { src: './img/Odin.png', value: 3 },
  { src: './img/orcalero.png', value: 5 },
  { src: './img/pad.png', value: 2 },
  { src: './img/pakrah.png', value: 7 },
  { src: './img/piccione.png', value: 4 },
  { src: './img/pothotspot.png', value: 6 },
  { src: './img/secret1.png', value: 3 },
  { src: './img/secret2.png', value: 5 },
  { src: './img/tob.png', value: 2 },
  { src: './img/torrtuginni.png', value: 7 },
  { src: './img/tralalero.png', value: 4 },
  { src: './img/trenostruzzo.png', value: 6 }
];

// 選択した画像（最大5つ）
let selectedImages = [];

// ギャラリーに画像を生成
images.forEach(imgData => {
  const img = document.createElement('img');
  img.src = imgData.src;
  img.alt = "ギャラリー画像";

  img.addEventListener('click', () => {
    selectImage(imgData);
  });

  gallery.appendChild(img);
});

// 画像選択処理
function selectImage(imgData) {
  // 5枚以上は古いものを削除
  if (selectedImages.length >= 5) {
    selectedImages.shift();
  }
  selectedImages.push(imgData);

  renderSelected();
  calculateTotal();
}

// 選択画像を表示
function renderSelected() {
  selected.innerHTML = '';
  selectedImages.forEach(imgData => {
    const img = document.createElement('img');
    img.src = imgData.src;
    selected.appendChild(img);
  });
}

// 合計値を計算して表示
function calculateTotal() {
  const sum = selectedImages.reduce((acc, img) => acc + img.value, 0);
  totalDiv.textContent = sum;
}