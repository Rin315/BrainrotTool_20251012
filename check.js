// Variants list
const variants = [
    "Default", "Gold", "Diamond", "Rainbow", "Chocolate",
    "Galaxy", "Zombie", "Dreamy", "ICE&FIRE", "Carnival",
    "Aqua", "Chocolate", "Halloween", "Darkness"
];

const checklistContainer = document.getElementById('checklist-container');
const resetCheckBtn = document.getElementById('reset-check-btn');

// Load saved data
let checklistData = JSON.parse(localStorage.getItem('monster_checklist')) || {};

// Group duplicates (same logic as script.js)
const groupedImages = [];
const processedIndices = new Set();

images.forEach((imgObj, index) => {
    if (processedIndices.has(index)) return;

    const group = [imgObj];
    processedIndices.add(index);

    for (let i = index + 1; i < images.length; i++) {
        if (processedIndices.has(i)) continue;
        const other = images[i];
        if (other.value === imgObj.value && other.sale === imgObj.sale) {
            group.push(other);
            processedIndices.add(i);
        }
    }
    groupedImages.push(group);
});

// Render Checklist
function renderChecklist() {
    checklistContainer.innerHTML = '';

    groupedImages.forEach((group, groupIndex) => {
        // Unique ID for the group (using value and sale as key base)
        const firstObj = group[0];
        const groupKey = `${firstObj.value}_${firstObj.sale}`;

        const item = document.createElement('div');
        item.className = 'checklist-item';

        // Image Container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'checklist-img-container';

        if (group.length > 1) {
            imgContainer.classList.add('split');
            group.forEach(imgObj => {
                const img = document.createElement('img');
                img.src = imgObj.src;
                img.className = 'checklist-split-img';
                imgContainer.appendChild(img);
            });
        } else {
            const img = document.createElement('img');
            img.src = firstObj.src;
            img.className = 'checklist-img';
            imgContainer.appendChild(img);
        }

        item.appendChild(imgContainer);

        // Variants List
        const variantsList = document.createElement('div');
        variantsList.className = 'checklist-variants';

        let allChecked = true;

        variants.forEach(variant => {
            const variantKey = `${groupKey}_${variant}`;
            const isChecked = checklistData[variantKey] || false;

            if (!isChecked) allChecked = false;

            const row = document.createElement('div');
            row.className = 'variant-row';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = isChecked;
            checkbox.addEventListener('change', () => {
                checklistData[variantKey] = checkbox.checked;
                saveData();
                checkCompletion(item, groupKey);
            });

            const label = document.createElement('span');
            label.className = 'variant-name';
            label.textContent = variant;

            // Allow clicking the row to toggle
            row.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    checkbox.checked = !checkbox.checked;
                    // Trigger change event manually
                    checkbox.dispatchEvent(new Event('change'));
                }
            });

            row.appendChild(checkbox);
            row.appendChild(label);
            variantsList.appendChild(row);
        });

        item.appendChild(variantsList);
        checklistContainer.appendChild(item);

        // Initial completion check
        if (allChecked) {
            item.classList.add('completed');
        }
    });
}

function checkCompletion(itemElement, groupKey) {
    let allChecked = true;
    for (const variant of variants) {
        const variantKey = `${groupKey}_${variant}`;
        if (!checklistData[variantKey]) {
            allChecked = false;
            break;
        }
    }

    if (allChecked) {
        itemElement.classList.add('completed');
    } else {
        itemElement.classList.remove('completed');
    }
}

function saveData() {
    localStorage.setItem('monster_checklist', JSON.stringify(checklistData));
}

resetCheckBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all checklist data?')) {
        checklistData = {};
        saveData();
        renderChecklist();
    }
});

// Initialize
renderChecklist();
