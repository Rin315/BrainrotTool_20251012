const images = [
  { src: './img/tob.png', value: 25, gold: 31.25, diamond: 37.5, halloween: 250 },
  { src: './img/tralalero.png', value: 50, gold: 62.5, diamond: 75, halloween: 500 },
  { src: './img/Odin.png', value: 75, gold: 93.75, diamond: 112.5, halloween: 750 },
  { src: './img/Espressona.png', value: 90, gold: 112.5, diamond: 135, halloween: 900 },
  { src: './img/lavaca.png', value: 100, gold: 125, diamond: 150, halloween: 1000 },
  { src: './img/ecco.png', value: 110, gold: 137.5, diamond: 165, halloween: 1100 },
  { src: './img/bambini.png', value: 120, gold: 150, diamond: 180, halloween: 1200 },
  { src: './img/brri.png', value: 130, gold: 162.5, diamond: 195, halloween: 1300 },
  { src: './img/bulbito.png', value: 130, gold: 162.5, diamond: 195, halloween: 1300 },
  { src: './img/brrestrh.png', value: 140, gold: 175, diamond: 210, halloween: 1400 },
  { src: './img/torrtuginni.png', value: 150, gold: 187.5, diamond: 225, halloween: 1500 },
  { src: './img/los.png', value: 170, gold: 212.5, diamond: 255, halloween: 1700 },
  { src: './img/alessio.png', value: 180, gold: 225, diamond: 270, halloween: 1800 },
  { src: './img/karkerkar.png', value: 190, gold: 237.5, diamond: 285, halloween: 1900 },
  { src: './img/lostralaleritas.png', value: 200, gold: 250, diamond: 300, halloween: 2000 },
  { src: './img/lostralaletitos.png', value: 200, gold: 250, diamond: 300, halloween: 2000 },
  { src: './img/iipiccione.png', value: 210, gold: 262.5, diamond: 315, halloween: 2100 },
  { src: './img/iimastodontico.png', value: 220, gold: 275, diamond: 330, halloween: 2200 },
  { src: './img/jobjobjob.png', value: 220, gold: 275, diamond: 330, halloween: 2200 },
  { src: './img/ketchuru.png', value: 1500, gold: 1875, diamond: 2250, halloween: 15000 }
];

// DOM取得
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalDiv = document.getElementById('total');
let selectedImages = [];

// ギャラリー生成
images.forEach(img => {
  const imageElement = document.createElement('img');
  imageElement.src = img.src;
  imageElement.alt = '';
  imageElement.addEventListener('click', () => selectImage(img));
  gallery.appendChild(imageElement);
});

// 画像選択
function selectImage(img) {
  if (selectedImages.find(s => s.img.src === img.src)) return; // 重複禁止
  const emptyIndex = Array.from(selectedWrappers).findIndex(w => w.childElementCount === 0);
  if (emptyIndex === -1) return; // 5枚以上は選択不可

  const wrapper = selectedWrappers[emptyIndex];

  const selectedImg = document.createElement('img');
  selectedImg.src = img.src;
  selectedImg.classList.add('selected-img');
  selectedImg.dataset.index = emptyIndex;
  selectedImg.addEventListener('click', () => removeImage(emptyIndex));
  wrapper.appendChild(selectedImg);

  const btnContainer = document.createElement('div');
  btnContainer.classList.add('button-container');
  ['Normal','Gold','Diamond','Halloween'].forEach(type => {
    const btn = document.createElement('button');
    btn.textContent = type;
    btn.classList.add(type);
    btn.addEventListener('click', () => {
      selectedImg.style.borderColor = getBorderColor(type);
      selectedImages[emptyIndex].currentType = type;
      updateTotal();
    });
    btnContainer.appendChild(btn);
  });

  wrapper.appendChild(btnContainer);

  selectedImages[emptyIndex] = { ...img, currentType:'Normal', img: selectedImg };
  updateTotal();
}

// 画像解除
function removeImage(index){
  const wrapper = selectedWrappers[index];
  wrapper.innerHTML = '';
  selectedImages[index] = null;
  updateTotal();
}

function getBorderColor(type){
  switch(type){
    case 'Normal': return 'black';
    case 'Gold': return 'gold';
    case 'Diamond': return 'cyan';
    case 'Halloween': return 'orange';
  }
}

// 合計値・確率計算
function updateTotal(){
  let sum = selectedImages.reduce((acc,img)=>{
    if(img) return acc + img.value; // Normalの合計
    return acc;
  },0);

  totalDiv.textContent = sum;

  const probDiv = document.getElementById('probability');
  if(sum>=1001) probDiv.textContent = 'Secret：100%';
  else if(sum>=751) probDiv.textContent = 'Secret：75% BrainrotGod：25%';
  else if(sum>=501) probDiv.textContent = 'BrainrotGod：60% Secret：40%';
  else probDiv.textContent = '';
}
