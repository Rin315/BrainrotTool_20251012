// ========= Level Calculator Tool =========
(function () {
  'use strict';

  // ── Base Growth Data ──
  const baseGrowthData = [
    0, // Lv0 (ダミー)
    10, 13, 16.9, 21.9, 28.5, 37, 48.1, 62.5, 81.2, 105,
    136, 176, 228, 296, 383, 493, 636, 819, 1050, 1350,
    1730, 2210, 2830, 3620, 4630, 5870, 7430, 9400, 11900, 15000,
    18800, 23600, 29500, 36900, 46200, 57000, 70300, 86700, 107000, 131000,
    160000, 194000, 235000, 285000, 346000, 412000, 491000, 584000, 695000, 827000,
    955000, 1100000, 1270000, 1470000, 1700000, 1960000, 2260000, 2610000, 3010000, 3480000,
    4000000, 4610000, 5310000, 6110000, 7040000, 8070000, 9260000, 10600000, 12100000, 13900000,
    15900000, 18100000, 20700000, 23600000, 26900000, 30400000, 34400000, 39000000, 44100000, 50000000,
    56000000, 62900000, 70500000, 79100000, 88800000, 98500000, 109000000, 121000000, 134000000, 149000000,
    163000000, 179000000, 196000000, 215000000, 235000000, 254000000, 275000000, 297000000, 320000000, 346000000,
    370000000, 396000000, 424000000, 454000000, 486000000, 520000000, 556000000, 595000000, 636000000, 681000000,
    728000000, 778000000, 832000000, 889000000, 950000000, 1010000000, 1080000000, 1150000000, 1230000000, 1320000000,
    1400000000, 1500000000, 1590000000, 1700000000, 1810000000, 1930000000, 2050000000, 2180000000, 2320000000, 2470000000,
    2620000000, 2780000000, 2950000000, 3130000000, 3330000000, 3520000000, 3720000000, 3940000000, 4170000000, 4410000000,
    4650000000, 4900000000, 5160000000, 5440000000, 5740000000, 6030000000, 6330000000, 6650000000, 6980000000, 7330000000,
    7690000000, 8080000000, 8480000000, 8910000000, 9350000000, 9820000000, 10300000000, 10800000000, 11300000000, 11900000000,
    12500000000, 13100000000, 13800000000, 14400000000, 15200000000, 15900000000, 16700000000, 17500000000, 18300000000, 19200000000,
    20200000000, 21100000000, 22200000000, 23200000000, 24300000000, 25500000000, 26700000000, 27900000000, 29300000000, 30600000000,
    32000000000, 33500000000, 35000000000, 36600000000, 38300000000, 40000000000, 41700000000, 43600000000, 45500000000, 47500000000,
    49500000000, 51600000000, 53800000000, 56000000000, 58400000000, 60700000000, 63200000000, 65700000000, 68300000000, 71100000000,
    73200000000, 75400000000, 77600000000, 80000000000, 82400000000, 84800000000, 87400000000, 90000000000, 92700000000, 95500000000,
    98300000000, 101000000000, 104000000000, 107000000000, 110000000000, 113000000000, 116000000000, 120000000000, 123000000000, 127000000000,
    130000000000, 134000000000, 138000000000, 142000000000, 146000000000, 150000000000, 154000000000, 158000000000, 162000000000, 166000000000,
    171000000000, 175000000000, 180000000000, 184000000000, 189000000000, 194000000000, 198000000000, 203000000000, 208000000000, 213000000000,
    218000000000, 222000000000, 227000000000, 232000000000, 237000000000, 242000000000, 247000000000, 252000000000, 257000000000, 262000000000
  ];

  // ── Unit definitions ──
  const units = [
    { suffix: '', threshold: 1 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'Qa', threshold: 1e15 },
    { suffix: 'Qi', threshold: 1e18 },
    { suffix: 'Sx', threshold: 1e21 },
    { suffix: 'Sp', threshold: 1e24 },
    { suffix: 'Oct', threshold: 1e27 }
  ];

  const unitMultipliers = {
    '': 1,
    'K': 1e3,
    'M': 1e6,
    'B': 1e9,
    'T': 1e12,
    'Qa': 1e15,
    'Qi': 1e18,
    'Sx': 1e21,
    'Sp': 1e24,
    'Oct': 1e27
  };

  // ── Format number with unit suffix ──
  function formatWithUnit(value) {
    if (value === 0) return '0.0';
    // Find the largest unit that fits
    let chosen = units[0];
    for (let i = units.length - 1; i >= 0; i--) {
      if (value >= units[i].threshold) {
        chosen = units[i];
        break;
      }
    }
    const divided = value / chosen.threshold;
    // Format to exactly 1 decimal place
    const formatted = divided.toFixed(1);
    return formatted + chosen.suffix;
  }

  // ── Calculate predicted earning ──
  function calculate() {
    const overlay = document.getElementById('level-calc-popup-overlay');
    if (!overlay) return;

    const currentLevel = parseInt(document.getElementById('lc-current-level').value, 10);
    const earningInput = parseFloat(document.getElementById('lc-current-earning').value);
    const earningUnit = document.getElementById('lc-earning-unit').value;
    const targetLevel = parseInt(document.getElementById('lc-target-level').value, 10);
    const resultEl = document.getElementById('lc-result-value');
    const resultContainer = document.getElementById('lc-result-container');
    const errorEl = document.getElementById('lc-error');

    // Determine language
    const lang = overlay.dataset.lang || 'ja';

    // Validation - check all fields are filled
    if (isNaN(currentLevel) || currentLevel < 1 || currentLevel > 250 ||
      isNaN(targetLevel) || targetLevel < 1 || targetLevel > 250 ||
      isNaN(earningInput) || earningInput <= 0) {
      resultContainer.classList.remove('show');
      // Only show error if at least one field has a value (avoid error on empty form)
      if (!isNaN(currentLevel) || !isNaN(targetLevel) || !isNaN(earningInput)) {
        errorEl.textContent = lang === 'ja'
          ? 'すべての項目を正しく入力してください。'
          : 'Please fill in all fields correctly.';
        errorEl.style.display = 'block';
      }
      return;
    }

    // Validation - target level must be higher than current level
    if (targetLevel <= currentLevel) {
      resultContainer.classList.remove('show');
      errorEl.textContent = lang === 'ja'
        ? '目標レベルは現在のレベルより高く設定してください。'
        : 'Target level must be higher than current level.';
      errorEl.style.display = 'block';
      return;
    }

    errorEl.style.display = 'none';

    // Convert earning to raw value
    const currentEarning = earningInput * (unitMultipliers[earningUnit] || 1);

    // Calculate
    const baseTarget = baseGrowthData[targetLevel];
    const baseCurrent = baseGrowthData[currentLevel];

    if (!baseCurrent || !baseTarget) {
      resultContainer.classList.remove('show');
      errorEl.textContent = lang === 'ja'
        ? 'レベルデータが見つかりません。'
        : 'Level data not found.';
      errorEl.style.display = 'block';
      return;
    }

    const predicted = currentEarning * (baseTarget / baseCurrent);
    const growthMultiplier = baseTarget / baseCurrent;

    resultEl.textContent = formatWithUnit(predicted);
    document.getElementById('lc-result-multiplier').textContent =
      (lang === 'ja' ? '倍率: ' : 'Multiplier: ') + 'x' + growthMultiplier.toFixed(2);
    resultContainer.classList.add('show');
  }

  // ── Init ──
  function init() {
    // Open button
    const openBtn = document.getElementById('level-calc-btn');
    const overlay = document.getElementById('level-calc-popup-overlay');
    const closeBtn = document.getElementById('close-level-calc-popup');

    if (!openBtn || !overlay || !closeBtn) return;

    openBtn.addEventListener('click', function () {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', function () {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Real-time calculation on input change
    ['lc-current-level', 'lc-current-earning', 'lc-earning-unit', 'lc-target-level'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', calculate);
        el.addEventListener('change', calculate);
      }
    });
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
