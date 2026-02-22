const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

let engHtml = indexHtml
  .replace('<html lang="ja">', '<html lang="en">')
  .replace('<meta name="description" content="Brainrot（ブレインロット）合成マシン確率計算ツールは、モンスターの組み合わせによるレアリティの確率や合計値を自動で計算できる非公式ツールです。">', '<meta name="description" content="The unofficial Brainrot Machine combination probability calculator. Automatically calculates rarity probabilities and total values based on monster combinations.">')
  .replace('<title>BrainrotMachine計算ツール - ツール</title>', '<title>Brainrot Calculator - Tool</title>')
  .replace('fetch("navbar.html")', 'fetch("navbar_en.html")')
  .replace('<span class="update-text">合成マシンの確率を最新のデータに更新しました。新キャラを追加しました。一部モンスターの図鑑画像を募集しています。<a\n          href="/contact.html">コチラ</a>からお願いします。</span>', '<span class="update-text">Updated machine probabilities to the latest data. Added new characters. We are looking for encyclopedia images for some monsters. Please submit them <a href="/contact.html">here</a>.</span>')
  .replace('<button id="event-toggle-btn" type="button">イベント限定モンスターを表示</button>', '<button id="event-toggle-btn" type="button">Show Event Limited Monsters</button>')
  .replace('<div class="panel-title">モンスターごとの確率</div>', '<div class="panel-title">Probability Per Monster</div>')
  .replace('・<strong>モンスターごとの確率</strong>は選択されたモンスターのK/s(1秒あたりに稼ぐ金額)の合計によって変動します。<br>', '・<strong>Probabilities</strong> vary depending on the total K/s (cash per second) of the selected monsters.<br>')
  .replace('・モンスターごとの確率や詳細なアルゴリズムは <a href="/calculation.html">こちらのページ</a> で説明しています。<br>', '・For details on probabilities and algorithms, please check <a href="/calculation.html">this page</a>.<br>')
  .replace('・<strong>「Total K/s」</strong>は1秒あたりに稼ぐ金額の合計です。<br>', '・<strong>"Total K/s"</strong> is the sum of cash earned per second.<br>')
  .replace('・最新の情報と異なる可能性があります。<br>', '・Information may not reflect the absolute latest updates.<br>');

fs.writeFileSync('index_en.html', engHtml);
console.log('index_en.html generated');
