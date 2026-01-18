
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// ========== Configuration ==========
// TODO: Replace with your actual Firebase config
const firebaseConfig = {

    apiKey: "AIzaSyCwV5lIhHQoHgJq_wd8IfUphSRDy7TqVuE",
    authDomain: "brainrotzukan.firebaseapp.com",
    databaseURL: "https://brainrotzukan-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "brainrotzukan",
    storageBucket: "brainrotzukan.firebasestorage.app",
    messagingSenderId: "203251550904",
    appId: "1:203251550904:web:cbc56e7dc367587ea4024d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ========== State ==========
const variants = [
    "Default", "Gold", "Diamond", "Rainbow", "Toxic",
    "Galaxy", "Zombie", "Dreamy", "ICE&FIRE", "Carnival",
    "Aqua", "Halloween", "Darkness", "Neon", "Christmas", "Chocolate"
];

function getItemsPerPage() {
    return window.innerWidth >= 768 ? 32 : 16;
}
let state = {
    currentTab: "Default",
    currentPage: 1,
    collection: {}, // { "monsterId_variant": timestamp }
    isAdmin: false,
    filterUnobtained: true,
    undoStack: []
};

// Access global images from data.js
let monsters = [];

function getMonsterId(monster) {
    // Use id if available, otherwise name. Sanitize for Firebase keys.
    const baseId = monster.id || monster.name;
    return baseId.replace(/[.\$#\[\]\/]/g, '_');
}

// ========== DOM Elements ==========
const tabsContainer = document.getElementById('variant-tabs');
const gridContainer = document.getElementById('monster-grid');
const prevBtn = document.getElementById('prev-page');
const nextBtn = document.getElementById('next-page');
const pageIndicator = document.getElementById('page-indicator');
const collectionCountEl = document.getElementById('collection-count');
const totalCountEl = document.getElementById('total-count');
const resetBtn = document.getElementById('reset-check-btn');
const filterToggleBtn = document.getElementById('filter-toggle-btn');
const markAllBtn = document.getElementById('mark-all-btn');
const exportTextBtn = document.getElementById('export-text-btn');
const undoBtn = document.getElementById('undo-btn');

// Export Modal Elements
const exportModal = document.getElementById('export-modal');
const exportTextArea = document.getElementById('export-text-area');
const copyTextBtn = document.getElementById('copy-text-btn');
const closeModalBtns = [
    document.getElementById('close-modal'),
    document.getElementById('close-modal-btn')
];

// ========== Initialization ==========
function init() {
    // Check Admin Mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin')) {
        state.isAdmin = true;
        console.log("Admin Mode Enabled");
        const pcLabel = document.getElementById('admin-label-pc');
        const spLabel = document.getElementById('admin-label-sp');
        if (pcLabel) pcLabel.textContent = ' 【管理者】';
        if (spLabel) spLabel.textContent = '【管理者】'; // A bit shorter for mobile
    }

    // Load monsters from global window object
    monsters = window.images || [];
    if (monsters.length === 0) {
        console.warn("No monsters found in window.images");
    }

    // NOTE: Removed localStorage loading to enforce Firebase as Source of Truth

    renderTabs();
    setupPagination();
    setupReset();
    setupFiltering();
    setupMarkAll();

    if (state.isAdmin) {
        if (markAllBtn) markAllBtn.classList.remove('hidden');
        if (exportTextBtn) exportTextBtn.classList.remove('hidden');
        if (undoBtn) {
            undoBtn.classList.remove('hidden');
            updateUndoButtonVisibility();
        }
    }

    setupExportText();
    setupUndo();

    // Listen to Firebase (Source of Truth)
    const collectionRef = ref(db, 'unobtained_status');
    onValue(collectionRef, (snapshot) => {
        const data = snapshot.val() || {};
        state.collection = data;
        renderTabs(); // Update tabs for progress count
        renderGrid();
        updateStats();
    });

    // Initial Render
    renderGrid();
}

// ========== Rendering ==========
function renderTabs() {
    tabsContainer.innerHTML = '';

    // Calculate Total Progress
    let totalObtainedGlobal = 0;
    const totalPossibleGlobal = monsters.length * variants.length;

    variants.forEach(variant => {
        // Calculate progress for this variant
        let obtainedCount = 0;
        const totalCount = monsters.length;

        monsters.forEach(monster => {
            const key = `${getMonsterId(monster)}_${variant}`;
            if (!state.collection[key]) {
                obtainedCount++;
                totalObtainedGlobal++;
            }
        });

        const btn = document.createElement('button');
        // Add flex to button to align text
        btn.className = `tab-btn ${variant} px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm whitespace-nowrap transition-colors flex justify-between items-center gap-2 md:gap-4 flex-shrink-0 ${state.currentTab === variant
            ? 'tab-active shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`;

        // Use spans for layout
        const nameSpan = document.createElement('span');
        nameSpan.textContent = variant;

        const countSpan = document.createElement('span');
        countSpan.textContent = `${obtainedCount}/${totalCount}`;
        countSpan.className = 'text-xs opacity-80 hidden md:inline';

        btn.appendChild(nameSpan);
        btn.appendChild(countSpan);

        btn.onclick = () => {
            state.currentTab = variant;
            // Page remains same as per requirement
            renderTabs(); // Re-render to update active class
            renderGrid();
        };
        tabsContainer.appendChild(btn);
    });

    // Update Total Progress Display
    const totalProgressEl = document.getElementById('total-progress');
    if (totalProgressEl) {
        totalProgressEl.textContent = `${totalObtainedGlobal}/${totalPossibleGlobal}`;
    }
}

function renderGrid() {
    gridContainer.innerHTML = '';
    const itemsPerPage = getItemsPerPage();

    // Map monsters to include their original index for correct key generation
    let displayMonsters = [...monsters];

    if (state.filterUnobtained) {
        displayMonsters = displayMonsters.filter(m => {
            const key = `${getMonsterId(m)}_${state.currentTab}`;
            return !!state.collection[key]; // Explicitly check for existence
        });
    }

    // Use grid for blocks: 1 col on mobile, 2 cols on PC (to make 2x2 for 32 items)
    gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 gap-8 w-full';

    const startIndex = (state.currentPage - 1) * itemsPerPage;

    const numBlocks = itemsPerPage / 8;
    const blocks = [];
    for (let b = 0; b < numBlocks; b++) {
        const block = document.createElement('div');
        block.className = 'grid grid-cols-4 gap-4 w-full';
        blocks.push(block);
    }

    for (let i = 0; i < itemsPerPage; i++) {
        const relativeIndex = startIndex + i;

        let card;
        if (relativeIndex < displayMonsters.length) {
            const monster = displayMonsters[relativeIndex];
            card = createMonsterCard(monster);
        } else {
            // Empty slot
            card = document.createElement('div');
            card.className = 'monster-card opacity-0 pointer-events-none';
        }

        const blockIndex = Math.floor(i / 8);
        blocks[blockIndex].appendChild(card);
    }

    blocks.forEach(block => gridContainer.appendChild(block));

    updatePaginationUI(displayMonsters.length);
}

function createMonsterCard(monster) {
    const key = `${getMonsterId(monster)}_${state.currentTab}`; // Stable ID: name + variant
    const timestamp = state.collection[key];
    const isObtained = !timestamp; // Default is obtained (not in collection)

    const card = document.createElement('div');
    card.className = `monster-card ${isObtained ? 'obtained' : 'unobtained'}`;

    // Apply variant class for border color
    card.classList.add(state.currentTab);

    // Check for Complete (all variants collected for this monster)
    let isComplete = true;
    for (const v of variants) {
        const k = `${getMonsterId(monster)}_${v}`;
        if (state.collection[k]) { // If any variant is UNobtained
            isComplete = false;
            break;
        }
    }

    if (isComplete) {
        card.classList.add('complete'); // Add class for CSS override
        const overlay = document.createElement('div');
        overlay.className = 'complete-overlay';
        overlay.textContent = 'Complete!';
        card.appendChild(overlay);
    }

    const img = document.createElement('img');
    // Use src from data.js
    img.src = monster.src;
    // Fallback for broken images
    img.onerror = () => {
        const div = document.createElement('div');
        div.className = 'fallback-text w-full h-full flex items-center justify-center text-center p-2 font-bold text-white break-words';
        div.textContent = monster.name;
        img.replaceWith(div);
    };

    card.appendChild(img);

    // Click Handler
    card.onclick = () => {
        // Enforce Admin-only writes
        if (!state.isAdmin) return;
        toggleCollection(key, isObtained);
    };

    return card;
}

function updatePaginationUI(totalItems = monsters.length) {
    const itemsPerPage = getItemsPerPage();
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

    // Ensure current page is within bounds after filtering
    if (state.currentPage > totalPages) {
        state.currentPage = totalPages;
    }

    pageIndicator.textContent = `Page ${state.currentPage} / ${totalPages}`;
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;
}

function updateStats() {
    // Stats display removed from UI as per request
    // Keeping function to avoid breaking calls, but it does nothing now.
}

// ========== Logic ==========
function setupPagination() {
    prevBtn.onclick = () => {
        if (state.currentPage > 1) {
            state.currentPage--;
            renderGrid();
        }
    };
    nextBtn.onclick = () => {
        const itemsPerPage = getItemsPerPage();
        let totalItems = monsters.length;
        if (state.filterUnobtained) {
            totalItems = monsters.filter(m => state.collection[`${getMonsterId(m)}_${state.currentTab}`]).length;
        }
        const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderGrid();
        }
    };

    // Handle window resize to update items per page
    window.addEventListener('resize', () => {
        // Reset to page 1 if items per page changes to avoid confusion
        // but let's just re-render for now to see if it works
        renderGrid();
    });
}

function setupReset() {
    if (!resetBtn) return;
    resetBtn.onclick = () => {
        if (!state.isAdmin) {
            alert("Reset is only allowed in Admin mode.");
            return;
        }

        if (confirm('Are you sure you want to reset ALL progress? (This will mark everything as obtained)')) {
            // Clear Firebase
            set(ref(db, 'unobtained_status'), null)
                .then(() => {
                    alert("All data reset to obtained.");
                })
                .catch(err => console.error("Reset failed:", err));
        }
    };
}

function setupFiltering() {
    if (!filterToggleBtn) return;

    // Initial UI state based on default filterUnobtained: true
    filterToggleBtn.textContent = 'すべて表示';
    filterToggleBtn.className = `px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded transition-colors`;

    filterToggleBtn.onclick = () => {
        state.filterUnobtained = !state.filterUnobtained;
        state.currentPage = 1; // Reset to page 1 when filtering
        filterToggleBtn.textContent = state.filterUnobtained ? 'すべて表示' : '未所持のみ表示';
        filterToggleBtn.className = `px-3 py-1 ${state.filterUnobtained ? 'bg-gray-500' : 'bg-blue-500'} text-white text-xs font-bold rounded transition-colors`;
        renderGrid();
    };
}

function setupMarkAll() {
    if (!markAllBtn) return;
    markAllBtn.onclick = () => {
        if (!state.isAdmin) return;

        if (confirm(`Mark ALL monsters in ALL variants as obtained?`)) {
            set(ref(db, 'unobtained_status'), null)
                .then(() => alert(`All monsters marked as obtained.`))
                .catch(err => console.error("Mark all failed:", err));
        }
    };
}

function setupExportText() {
    if (!exportTextBtn) return;
    exportTextBtn.onclick = () => {
        let output = [];
        variants.forEach(variant => {
            let variantMonsters = [];
            monsters.forEach(monster => {
                const key = `${getMonsterId(monster)}_${variant}`;
                if (state.collection[key]) {
                    variantMonsters.push(` ${monster.name}`);
                }
            });
            if (variantMonsters.length > 0) {
                const variantCapitalized = variant.charAt(0).toUpperCase() + variant.slice(1).toLowerCase();
                output.push(`◆${variantCapitalized}\n${variantMonsters.join('\n')}`);
            }
        });

        if (output.length === 0) {
            alert("未所持のモンスターはありません。");
            return;
        }

        exportTextArea.textContent = output.join('\n\n');
        exportModal.classList.remove('hidden');
    };

    closeModalBtns.forEach(btn => {
        if (btn) btn.onclick = () => exportModal.classList.add('hidden');
    });

    if (copyTextBtn) {
        copyTextBtn.onclick = () => {
            navigator.clipboard.writeText(exportTextArea.textContent).then(() => {
                const originalText = copyTextBtn.textContent;
                copyTextBtn.textContent = 'コピー完了！';
                copyTextBtn.classList.replace('bg-blue-600', 'bg-green-600');
                setTimeout(() => {
                    copyTextBtn.textContent = originalText;
                    copyTextBtn.classList.replace('bg-green-600', 'bg-blue-600');
                }, 2000);
            });
        };
    }

    // Close modal on outside click
    exportModal.onclick = (e) => {
        if (e.target === exportModal) exportModal.classList.add('hidden');
    };
}

function setupUndo() {
    if (!undoBtn) return;
    undoBtn.onclick = () => {
        if (!state.isAdmin) return;
        undoLastAction();
    };
}

function updateUndoButtonVisibility() {
    if (!undoBtn) return;
    if (state.undoStack.length > 0) {
        undoBtn.classList.remove('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    } else {
        undoBtn.classList.add('opacity-50', 'cursor-not-allowed', 'pointer-events-none');
    }
}

function undoLastAction() {
    const lastAction = state.undoStack.pop();
    if (!lastAction) return;

    const { key, wasObtained } = lastAction;
    const itemRef = ref(db, `unobtained_status/${key}`);

    if (wasObtained) {
        // Last action was "mark as unobtained", so undo is "mark as obtained"
        remove(itemRef).catch(err => console.error("Undo remove failed:", err));
    } else {
        // Last action was "mark as obtained", so undo is "mark as unobtained"
        set(itemRef, lastAction.timestamp || Date.now()).catch(err => console.error("Undo set failed:", err));
    }

    updateUndoButtonVisibility();
}

function toggleCollection(key, isCurrentlyObtained) {
    // Save to undo stack BEFORE updating
    state.undoStack.push({
        key: key,
        wasObtained: isCurrentlyObtained,
        timestamp: Date.now()
    });
    if (state.undoStack.length > 50) state.undoStack.shift();
    updateUndoButtonVisibility();

    // NO Optimistic Update - Rely on Firebase Listener
    const itemRef = ref(db, `unobtained_status/${key}`);
    if (isCurrentlyObtained) {
        // Was obtained, now marking as UNobtained -> Add to DB
        set(itemRef, Date.now()).catch(err => console.error("Firebase set failed:", err));
    } else {
        // Was unobtained, now marking as obtained -> Remove from DB
        remove(itemRef).catch(err => console.error("Firebase remove failed:", err));
    }
}

// Start
init();
