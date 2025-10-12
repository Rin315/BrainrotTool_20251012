const gallery = document.getElementById('gallery');
const selected = document.getElementById('selected');
const totalDiv = document.getElementById('total');

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

let selectedImages = [];

images.forEach(imgData => {
  const img = document.createElement('img');
  img.src = imgData.src;
  img.alt = "ギャラリー画像";

  img.addEventListener('click', () => {
    selectImage(imgData);
  });

  gallery.appendChild(img);
});

function selectImage(imgData) {
  if (selectedImages.length >= 5) {
    selectedImages.shift();
  }
  selectedImages.push(imgData);

  renderSelected();
  calculateTotal();
}

function renderSelected() {
  selected.innerHTML = '';
  selectedImages.forEach((imgData, index) => {
    const container = document.createElement('div');
    container.style.display = 'inline-block';
    container.style.textAlign = 'center';

    const img = document.createElement('img');
    img.src = imgData.src;
    img.classList.add('selected-img');
    container.appendChild(img);

    // 縦ボタンコンテナ
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
      button.classList.add(btn.name); // CSSで背景色指定用
      button.style.borderColor = btn.color;

      button.addEventListener('click', () => {
        img.style.borderColor = btn.color;
      });

      btnContainer.appendChild(button);
    });

    container.appendChild(btnContainer);
    selected.appendChild(container);
  });
}

function calculateTotal() {
  const sum = selectedImages.reduce((acc, img) => acc + img.value, 0);
  totalDiv.textContent = sum;
}