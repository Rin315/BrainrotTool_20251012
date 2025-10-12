// 画像データ
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
  { src: './img/ketchuru.png', value: 1500, gold: 1875, diamond: 2250, halloween: 15000 },
  { src: './img/losorcaleritos.png', value: 400, gold: 500, diamond: 600, halloween: 4000 },
  { src: './img/piccione.png', value: 500, gold: 625, diamond: 750, halloween: 5000 },
  { src: './img/pakrah.png', value: 600, gold: 750, diamond: 900, halloween: 6000 },
  { src: './img/pothotspot.png', value: 2000, gold: 2500, diamond: 3000, halloween: 20000 },
  { src: './img/nomyhotspot.png', value: 2500, gold: 3125, diamond: 3750, halloween: 25000 },
  { src: './img/garamarama.png', value: 3000, gold: 3750, diamond: 4500, halloween: 30000 },
  { src: './img/iisacro.png', value: 4000, gold: 5000, diamond: 6000, halloween: 40000 },
  { src: './img/losjob.png', value: 1000, gold: 1250, diamond: 1500, halloween: 10000 }, // 不明
  { src: './img/orcalero.png', value: 1000, gold: 1250, diamond: 1500, halloween: 10000 },
  { src: './img/chicleteira.png', value: 8000, gold: 10000, diamond: 12000, halloween: 80000 },
  { src: './img/pad.png', value: 10000, gold: 12500, diamond: 15000, halloween: 100000 },
  { src: './img/house.png', value: 20000, gold: 25000, diamond: 30000, halloween: 200000 },
  { src: './img/8.png', value: 5, gold: 6.25, diamond: 7.5, halloween: 50 }, // 不明
  { src: './img/brainrot1.png', value: 4, gold: 5, diamond: 6, halloween: 40 }, // 不明
  { src: './img/secret1.png', value: 3, gold: 3.75, diamond: 4.5, halloween: 30 }, // 不明
  { src: './img/secret2.png', value: 5, gold: 6.25, diamond: 7.5, halloween: 50 }  // 不明
];
// 選択処理
const gallery = document.getElementById('gallery');
const selectedWrappers = document.querySelectorAll('.selected-wrapper');
const totalEl = document.getElementById('total');
const probabilityEl = document.getElementById('probability');

let selectedImages = [];

function updateTotal() {
  let sum = selectedImages.reduce((acc, img) => acc + img.value, 0);
  totalEl.textContent = sum;

  if(sum >= 1001) {
    probabilityEl.textContent = "Secret：100%";
  } else if(sum >= 751) {
    probabilityEl.textContent = "Secret：75% BrainrotGod：25%";
  } else if(sum >= 501) {
    probabilityEl.textContent = "BrainrotGod：60% Secret：40%";
  } else {
    probabilityEl.textContent = "";
  }
}

// ギャラリー表示
images.forEach((imgObj, idx) => {
  const img = document.createElement('img');
  img.src = imgObj.src;
  img.className = 'gallery-img';
  img.addEventListener('click', () => selectImage(imgObj));
  gallery.appendChild(img);
});

function selectImage(imgObj) {
  // すでに選択されている場合はキャンセル
  const index = selectedImages.indexOf(imgObj);
  if(index > -1) {
    selectedImages.splice(index,1);
    renderSelected();
    updateTotal();
    return;
  }

  // 空いている枠に追加
  if(selectedImages.length < 5) {
    selectedImages.push(imgObj);
    renderSelected();
    updateTotal();
  }
}

function renderSelected() {
  selectedWrappers.forEach((wrapper, idx) => {
    wrapper.innerHTML = '';

    const imgObj = selectedImages[idx];

    if(imgObj){
      // 選択されている場合は画像表示
      const img = document.createElement('img');
      img.src = imgObj.src;
      img.className = 'selected-img';
      img.addEventListener('click', ()=> selectImage(imgObj));
      wrapper.appendChild(img);

      // ボタン作成
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'button-container';
      ['Normal','Gold','Diamond','Rainbow','Halloween','Other'].forEach(type => {
        const btn = document.createElement('button');
        btn.textContent = type;
        btn.className = type;
        btn.addEventListener('click', ()=>{
          img.style.borderColor = getButtonColor(type);
          updateTotal();
        });
        buttonContainer.appendChild(btn);
      });
      wrapper.appendChild(buttonContainer);

    } else {
      // 未選択枠用のダミー要素を追加
      const placeholder = document.createElement('div');
      placeholder.style.width = '140px';
      placeholder.style.height = '150px';
      // 背景色を枠の色にする
      placeholder.style.backgroundColor = '#555';
      wrapper.appendChild(placeholder);
    }
  });
}


function getButtonColor(type){
  switch(type){
    case 'Normal': return 'black';
    case 'Gold': return 'yellow';
    case 'Diamond': return 'cyan';
    case 'Rainbow': return 'pink';
    case 'Halloween': return 'orange';
    case 'Other': return 'gray';
  }
}