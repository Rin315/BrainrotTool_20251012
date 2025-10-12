function updateTypeProbability(){
  const hasAny = selectedImages.some(img => img);
  const probs = { Default: 9, Gold: 10, Diamond: 5, Rainbow: 0, Halloween: 0, Other: 0 };
  const colorSums = { Default:0, Gold:0, Diamond:0, Rainbow:0, Halloween:0, Other:0 };

  if (hasAny) {
    for (let i = 0; i < selectedImages.length; i++){
      const img = selectedImages[i];
      const color = selectedColors[i];
      if (!img || !color) continue;
      colorSums[color] += img.value;
    }
    const totalColorSum = Object.values(colorSums).reduce((a,b)=>a+b, 0);
    if (totalColorSum > 0) {
      const bonusTotal = 75;
      for (const color in colorSums){
        if (colorSums[color] > 0) {
          probs[color] += bonusTotal * (colorSums[color] / totalColorSum);
        }
      }
    }
  } else {
    // 無選択時は固定値
    probs.Default = 84; probs.Gold = 10; probs.Diamond = 5;
  }

  const items = Object.keys(probs)
    .map(k => ({ name: k, prob: Math.round(probs[k] || 0) }))
    .sort((a,b) => b.prob - a.prob);

  // 背景付き出力
  typeProbEl.innerHTML = items.map(it =>
    `<span class="${it.name}">${it.name}: ${it.prob}%</span>`
  ).join('');
}
