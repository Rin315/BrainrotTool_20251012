
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove, get } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

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
    "Default", "Gold", "Diamond", "Rainbow", "Crystal", "Heaven", "Void", "Love", "Toxic",
    "Galaxy", "Zombie", "Dreamy", "ICE&FIRE", "Carnival",
    "Aqua", "Halloween", "Darkness", "Neon", "Christmas", "Chocolate"
];

// Variant colors (matching sidebar tab border colors)
const variantColors = {
    Default: '#333', Gold: '#ffd700', Diamond: '#00b0ff', Rainbow: '#d500f9',
    Crystal: '#5BC0EB', Heaven: '#FFFFFF', Void: '#5D3B8E', Love: '#FF69B4', Toxic: '#9ACD32',
    Galaxy: '#663399', Zombie: '#2E8B57', Dreamy: '#FF69B4', 'ICE&FIRE': '#FF4500',
    Carnival: '#FF1493', Aqua: '#00FFFF', Halloween: '#FF8C00', Darkness: '#4B0082',
    Neon: '#39FF14', Christmas: '#228B22', Chocolate: '#D2691E'
};

// rules.js に記載のモンスターIDをSetに収集（動的に変更に追従）
const rulesMonsterIds = new Set();
if (typeof monsterProbabilityRules !== 'undefined') {
    for (const rule of monsterProbabilityRules) {
        for (const m of rule.monsters) {
            rulesMonsterIds.add(m.id);
        }
    }
}

function getItemsPerPage() {
    return window.innerWidth >= 768 ? 32 : 16;
}
let state = {
    currentTab: "Default",
    currentPage: 1,
    collection: {}, // { "monsterId_variant": timestamp }
    isAdmin: false,
    filterUnobtained: true,
    undoStack: [],
    searchMode: false,
    monsterFilter: null,       // null = no filter, Set of monster IDs to show
    monsterFilterLabel: null   // label for the active filter banner
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
const plusMenu = document.getElementById('plus-menu');
const plusBtn = document.getElementById('plus-btn');
const plusMenuItems = document.getElementById('plus-menu-items');
const variantSearchBtn = document.getElementById('variant-search-btn');
const searchModeBanner = document.getElementById('search-mode-banner');
const variantSearchModal = document.getElementById('variant-search-modal');
const variantSearchResult = document.getElementById('variant-search-result');
const variantSearchModalTitle = document.getElementById('variant-search-modal-title');

// Monster Filter Elements
const monsterFilterBtn = document.getElementById('monster-filter-btn');
const filterPopupOverlay = document.getElementById('filter-popup-overlay');
const filterActiveBanner = document.getElementById('filter-active-banner');
const filterActiveLabel = document.getElementById('filter-active-label');

// Export Modal Elements
const exportModal = document.getElementById('export-modal');
const exportTextArea = document.getElementById('export-text-area');
const copyTextBtn = document.getElementById('copy-text-btn');
const closeModalBtns = [
    document.getElementById('close-modal'),
    document.getElementById('close-modal-btn')
];

// History Modal Elements
const historyModal = document.getElementById('history-modal');
const historyModalTitle = document.getElementById('history-modal-title');
const historyContent = document.getElementById('history-content');

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
    setupMarkAllObtained();

    if (state.isAdmin) {
        if (markAllBtn) markAllBtn.classList.remove('hidden');
        if (exportTextBtn) exportTextBtn.classList.remove('hidden');
        if (variantSearchBtn) variantSearchBtn.classList.remove('hidden');
        // if (plusMenu) plusMenu.classList.remove('hidden'); // ＋メニュー復活時に有効化
        if (undoBtn) {
            undoBtn.classList.remove('hidden');
            updateUndoButtonVisibility();
        }
    }

    setupExportText();
    setupUndo();
    setupHistoryModal();
    setupPlusMenu();
    setupVariantSearch();
    setupMonsterFilter();

    // Initial Render
    renderGrid();

    // Listen to Migration Version
    const metaRef = ref(db, '_metadata/migration_v2');
    onValue(metaRef, (snapshot) => {
        if (!snapshot.val() && state.isAdmin) {
            console.log("Starting Migration to Obtained-Default...");
            migrateToObtainedDefault();
        }
    }, { onlyOnce: true });

    // Listen to Firebase (Source of Truth: Positive Collection)
    const collectionRef = ref(db, 'collection_status');
    onValue(collectionRef, (snapshot) => {
        const data = snapshot.val() || {};
        state.collection = data;
        renderTabs(); // Update tabs for progress count
        renderGrid();
        updateStats();

        // Admin: record daily progress
        if (state.isAdmin) {
            recordProgressHistory();
        }
    });
}

/**
 * 🔄 Migration Logic: Flip Unobtained-Default to Obtained-Default
 * Only runs once for the admin if the flag is not set.
 */
async function migrateToObtainedDefault() {
    try {
        // 1. Get current "Unobtained" state
        const oldRef = ref(db, 'unobtained_status');
        const oldDataRef = await new Promise((resolve) => {
            onValue(oldRef, (snap) => resolve(snap.val() || {}), { onlyOnce: true });
        });

        // 2. Prepare new "Obtained" state for ALL current monsters
        // Current Obtained = NOT in current Unobtained List
        const newCollection = {};
        const now = Date.now();

        monsters.forEach(monster => {
            const mId = getMonsterId(monster);
            variants.forEach(variant => {
                const key = `${mId}_${variant}`;
                if (!oldDataRef[key]) {
                    // Not in unobtained list means it IS obtained
                    newCollection[key] = now;
                }
            });
        });

        // 3. Batch write to new path
        await set(ref(db, 'collection_status'), newCollection);

        // 4. Mark migration as finished
        await set(ref(db, '_metadata/migration_v2'), true);

        console.log("Migration Successful: Database flipped to Obtained-Positive.");
        alert("データベースの移行が完了しました。今後、新しく追加されるモンスターは「未所持」がデフォルトになります。");
    } catch (err) {
        console.error("Migration Failed:", err);
    }
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
            if (state.collection[key]) {
                obtainedCount++;
                totalObtainedGlobal++;
            }
        });

        const btn = document.createElement('button');
        // Add flex to button to align text
        const isActive = !state.searchMode && state.currentTab === variant;
        btn.className = `tab-btn ${variant} px-3 md:px-4 py-2 rounded-lg font-bold text-xs md:text-sm whitespace-nowrap transition-colors flex justify-between items-center gap-2 md:gap-4 flex-shrink-0 ${isActive
            ? 'tab-active shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`;

        // Use spans for layout
        const nameSpan = document.createElement('span');
        nameSpan.textContent = variant;

        const countSpan = document.createElement('span');
        const remaining = totalCount - obtainedCount;
        countSpan.textContent = `残り${remaining}体`;
        countSpan.className = 'text-xs opacity-80 hidden md:inline history-clickable';
        countSpan.onclick = (e) => {
            e.stopPropagation();
            showProgressChart(variant);
        };

        btn.appendChild(nameSpan);
        btn.appendChild(countSpan);

        btn.onclick = () => {
            // Exit search mode when clicking a variant tab
            if (state.searchMode) {
                state.searchMode = false;
                searchModeBanner.classList.remove('active');
                // Restore "未所持のみ表示" filter
                state.filterUnobtained = true;
                state.currentPage = 1;
                filterToggleBtn.textContent = 'すべて表示';
                filterToggleBtn.className = `px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded transition-colors`;
            }
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
        totalProgressEl.textContent = `残り${totalPossibleGlobal - totalObtainedGlobal}体`;
        totalProgressEl.className = 'ml-2 text-sm font-normal text-gray-500 history-clickable';
        totalProgressEl.onclick = () => showProgressChart('_total');
    }
}

function renderGrid() {
    gridContainer.innerHTML = '';
    const itemsPerPage = getItemsPerPage();

    // Map monsters to include their original index for correct key generation
    let displayMonsters = [...monsters];

    // Apply monster filter (luckyrot / gousei)
    if (state.monsterFilter) {
        displayMonsters = displayMonsters.filter(m => state.monsterFilter.has(getMonsterId(m)));
    }

    if (state.filterUnobtained) {
        displayMonsters = displayMonsters.filter(m => {
            const key = `${getMonsterId(m)}_${state.currentTab}`;
            return !state.collection[key]; // Obtained monsters have timestamps, so we want the ones WITHOUT them
        });
    }

    // Fix: Update pagination state BEFORE rendering to clamp currentPage within valid bounds
    updatePaginationUI(displayMonsters.length);

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
}

function createMonsterCard(monster) {
    const key = `${getMonsterId(monster)}_${state.currentTab}`; // Stable ID: name + variant
    const timestamp = state.collection[key];
    const isObtained = !!timestamp; // Default is UNobtained (not in collection)

    const card = document.createElement('div');
    // In search mode or filtering unobtained only, show all cards bright
    const visuallyObtained = isObtained || state.filterUnobtained || state.searchMode;
    card.className = `monster-card ${visuallyObtained ? 'obtained' : 'unobtained'}`;

    // Apply variant class for border color
    card.classList.add(state.currentTab);

    // rules.js に記載のモンスターの場合、黒い影を追加
    const monsterId = getMonsterId(monster);
    if (rulesMonsterIds.has(monsterId)) {
        card.classList.add('rules-monster');
    }

    // Check for Complete (all variants collected for this monster)
    let isComplete = true;
    for (const v of variants) {
        const k = `${getMonsterId(monster)}_${v}`;
        if (!state.collection[k]) { // If any variant is NOT obtained
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
        if (state.searchMode) {
            showVariantStatus(monster);
            return;
        }
        // Enforce Admin-only writes
        if (!state.isAdmin) return;
        toggleCollection(key, isObtained);
    };

    // Add search mode class for hover effect
    if (state.searchMode) {
        card.classList.add('search-mode-active');
    }

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
        let displayMonsters = [...monsters];
        // Apply monster filter (luckyrot / gousei)
        if (state.monsterFilter) {
            displayMonsters = displayMonsters.filter(m => state.monsterFilter.has(getMonsterId(m)));
        }
        if (state.filterUnobtained) {
            displayMonsters = displayMonsters.filter(m => !state.collection[`${getMonsterId(m)}_${state.currentTab}`]);
        }
        const totalItems = displayMonsters.length;
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
            set(ref(db, 'collection_status'), null)
                .then(() => {
                    alert("All data reset to unobtained.");
                })
                .catch(err => console.error("Reset failed:", err));
        }
    };
}

function setupFiltering() {
    if (!filterToggleBtn) return;

    // Initial UI state based on default filterUnobtained: true (未所持のみ表示)
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

function setupMarkAllObtained() {
    if (!markAllBtn) return;
    markAllBtn.onclick = () => {
        if (!state.isAdmin) return;

        if (confirm(`Mark ALL monsters in ALL variants as obtained?`)) {
            const allObtained = {};
            const now = Date.now();
            monsters.forEach(m => {
                variants.forEach(v => {
                    allObtained[`${getMonsterId(m)}_${v}`] = now;
                });
            });

            set(ref(db, 'collection_status'), allObtained)
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
                if (!state.collection[key]) {
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
    const itemRef = ref(db, `collection_status/${key}`);

    if (!wasObtained) {
        // Last action was "mark as obtained", so to undo we must remove it
        remove(itemRef).catch(err => console.error("Undo remove failed:", err));
    } else {
        // Last action was "remove obtained state", so to undo we must put it back
        set(itemRef, lastAction.timestamp || Date.now()).catch(err => console.error("Undo set failed:", err));
    }

    updateUndoButtonVisibility();
}

// ========== Plus Menu ==========
function setupPlusMenu() {
    if (!plusBtn || !plusMenuItems) return;
    plusBtn.onclick = () => {

        plusBtn.classList.toggle('open');
        plusMenuItems.classList.toggle('open');
    };
}

// ========== Variant Search ==========
function setupVariantSearch() {
    if (!variantSearchBtn) return;

    variantSearchBtn.onclick = () => {
        state.searchMode = !state.searchMode;
        if (state.searchMode) {
            searchModeBanner.classList.add('active');
            // Close plus menu (＋メニュー復活時に有効化)
            // plusBtn.classList.remove('open');
            // plusMenuItems.classList.remove('open');
            // Force "すべて表示" mode
            if (state.filterUnobtained) {
                state.filterUnobtained = false;
                state.currentPage = 1;
                filterToggleBtn.textContent = '未所持のみ表示';
                filterToggleBtn.className = `px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded transition-colors`;
            }
        } else {
            searchModeBanner.classList.remove('active');
            // Restore "未所持のみ表示" filter
            state.filterUnobtained = true;
            state.currentPage = 1;
            filterToggleBtn.textContent = 'すべて表示';
            filterToggleBtn.className = `px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded transition-colors`;
        }
        renderGrid(); // Re-render to apply/remove search-mode-active class
    };

    // Exit search mode from banner
    const exitBtn = document.getElementById('exit-search-mode');
    if (exitBtn) {
        exitBtn.onclick = () => {
            state.searchMode = false;
            searchModeBanner.classList.remove('active');
            // Restore "未所持のみ表示" filter
            state.filterUnobtained = true;
            state.currentPage = 1;
            filterToggleBtn.textContent = 'すべて表示';
            filterToggleBtn.className = `px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded transition-colors`;
            renderGrid();
        };
    }

    // Close variant search modal
    const closeBtn = document.getElementById('close-variant-search');
    const closeBtnBottom = document.getElementById('close-variant-search-btn');
    const closeModal = () => variantSearchModal.classList.add('hidden');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeBtnBottom) closeBtnBottom.onclick = closeModal;
    variantSearchModal.onclick = (e) => {
        if (e.target === variantSearchModal) closeModal();
    };
}

function showVariantStatus(monster) {
    const monsterId = getMonsterId(monster);
    variantSearchModalTitle.textContent = `${monster.name} の種類一覧`;
    variantSearchResult.innerHTML = '';

    variants.forEach(variant => {
        const key = `${monsterId}_${variant}`;
        const isObtained = !!state.collection[key];
        const color = variantColors[variant] || '#999';

        const item = document.createElement('div');
        item.className = `variant-status-item ${isObtained ? 'obtained' : 'unobtained'}`;
        item.style.borderColor = color;

        const icon = document.createElement('span');
        icon.className = 'status-icon';
        icon.textContent = isObtained ? '✅' : '❌';

        const name = document.createElement('span');
        name.textContent = variant;

        item.appendChild(icon);
        item.appendChild(name);
        variantSearchResult.appendChild(item);
    });

    variantSearchModal.classList.remove('hidden');
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
    const itemRef = ref(db, `collection_status/${key}`);
    if (!isCurrentlyObtained) {
        // Was unobtained, now marking as obtained -> Add to DB
        set(itemRef, Date.now()).catch(err => console.error("Firebase set failed:", err));
    } else {
        // Was obtained, now marking as unobtained -> Remove from DB
        remove(itemRef).catch(err => console.error("Firebase remove failed:", err));
    }
}
// ========== Progress History ==========

/**
 * Get today's date string in JST (YYYY-MM-DD)
 */
function getTodayJST() {
    const now = new Date();
    const jst = new Date(now.getTime() + (9 * 60 * 60 * 1000));
    return jst.toISOString().split('T')[0];
}

/**
 * Record progress to Firebase (admin only, once per day)
 */
function recordProgressHistory() {
    const today = getTodayJST();
    const todayRef = ref(db, `progress_history/${today}`);

    // Calculate remaining for each variant and total
    const record = {};
    let totalRemaining = 0;

    variants.forEach(variant => {
        let obtainedCount = 0;
        monsters.forEach(monster => {
            const key = `${getMonsterId(monster)}_${variant}`;
            if (state.collection[key]) obtainedCount++;
        });
        const remaining = monsters.length - obtainedCount;
        record[variant] = remaining;
        totalRemaining += remaining;
    });
    record['_total'] = totalRemaining;

    // Check if today's data already exists
    get(todayRef).then(snapshot => {
        const existing = snapshot.val();
        if (!existing) {
            // No data for today — save
            set(todayRef, record)
                .then(() => console.log(`Progress history saved for ${today}`))
                .catch(err => console.error('Failed to save progress history:', err));
        } else {
            // Data exists — update only if changed
            let changed = false;
            for (const k of Object.keys(record)) {
                if (existing[k] !== record[k]) {
                    changed = true;
                    break;
                }
            }
            if (changed) {
                set(todayRef, record)
                    .then(() => console.log(`Progress history updated for ${today}`))
                    .catch(err => console.error('Failed to update progress history:', err));
            }
        }
    }).catch(err => console.error('Failed to check progress history:', err));
}

/**
 * Show progress history as text (daily changes)
 * @param {string} variantKey - variant name or '_total' for aggregate
 */
function showProgressChart(variantKey) {
    const historyRef = ref(db, 'progress_history');

    get(historyRef).then(snapshot => {
        const allData = snapshot.val();
        if (!allData) {
            alert('履歴データがありません。');
            return;
        }

        // Sort dates ascending
        const dates = Object.keys(allData).sort();
        const values = dates.map(d => allData[d][variantKey] ?? null);

        // Set modal title
        const label = variantKey === '_total' ? '全体' : variantKey;
        historyModalTitle.textContent = `${label} — 進捗履歴`;

        // Build daily diff list (newest first)
        let html = '';
        const entries = [];

        for (let i = 1; i < dates.length; i++) {
            const prev = values[i - 1];
            const curr = values[i];
            if (prev === null || curr === null) continue;
            const diff = curr - prev;
            if (diff === 0) continue; // Skip days with no change

            const d = dates[i];
            const parts = d.split('-');
            const dateStr = `${parts[0]}/${parseInt(parts[1])}/${parseInt(parts[2])}`;
            const diffStr = diff < 0 ? `${diff}体` : `+${diff}体`;
            const color = diff < 0 ? '#22c55e' : '#ef4444'; // green for decrease, red for increase

            entries.push({ dateStr, diffStr, color, remaining: curr });
        }

        // Reverse for newest first
        entries.reverse();

        if (entries.length === 0) {
            html = '<p class="text-gray-500 text-center">変化の記録がありません。</p>';
        } else {
            html = '<div style="display: flex; flex-direction: column; gap: 6px;">';
            entries.forEach(e => {
                html += `<div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-radius: 8px; background: #f9fafb; border: 1px solid #e5e7eb;">`;
                html += `<span style="font-weight: 600; color: #374151; font-size: 14px;">${e.dateStr}</span>`;
                html += `<div style="display: flex; align-items: center; gap: 12px;">`;
                html += `<span style="color: ${e.color}; font-weight: 700; font-size: 15px;">${e.diffStr}</span>`;
                html += `<span style="color: #9ca3af; font-size: 12px;">残り${e.remaining}体</span>`;
                html += `</div></div>`;
            });
            html += '</div>';
        }

        historyContent.innerHTML = html;
        historyModal.classList.remove('hidden');
    }).catch(err => {
        console.error('Failed to load progress history:', err);
        alert('履歴の読み込みに失敗しました。');
    });
}

/**
 * Setup history modal close handlers
 */
function setupHistoryModal() {
    const closeBtn = document.getElementById('close-history-modal');
    const closeBtnBottom = document.getElementById('close-history-modal-btn');

    const closeModal = () => historyModal.classList.add('hidden');

    if (closeBtn) closeBtn.onclick = closeModal;
    if (closeBtnBottom) closeBtnBottom.onclick = closeModal;

    historyModal.onclick = (e) => {
        if (e.target === historyModal) closeModal();
    };
}

// ========== Monster Filter (Luckyrot / Gousei) ==========
function setupMonsterFilter() {
    if (!monsterFilterBtn || !filterPopupOverlay) return;

    const closePopup = () => filterPopupOverlay.classList.remove('active');

    // Open filter popup
    monsterFilterBtn.onclick = () => {
        filterPopupOverlay.classList.add('active');
    };

    // Close filter popup
    const closeBtn = document.getElementById('close-filter-popup');
    const closeBtnBottom = document.getElementById('close-filter-popup-btn');
    if (closeBtn) closeBtn.onclick = closePopup;
    if (closeBtnBottom) closeBtnBottom.onclick = closePopup;
    filterPopupOverlay.onclick = (e) => {
        if (e.target === filterPopupOverlay) closePopup();
    };

    // Filter button labels
    const filterLabels = {
        'normal-mythic': '通常 Mythic',
        'normal-brainGot': '通常 BrainGot',
        'normal-secret': '通常 Secret',
        'grande-mythic': 'グランデ Mythic',
        'grande-brainGot': 'グランデ BrainGot',
        'grande-secret': 'グランデ Secret',
        'gousei': '合成',
    };

    // Handle filter button clicks
    const filterBtns = filterPopupOverlay.querySelectorAll('[data-filter]');
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            const filterKey = btn.getAttribute('data-filter');
            let monsterIds = [];

            if (filterKey === 'gousei') {
                // Use rulesMonsterIds from rules.js
                monsterIds = [...rulesMonsterIds];
            } else {
                // Parse luckyrot_filter.js config
                const [type, category] = filterKey.split('-');
                if (typeof luckyrotFilter !== 'undefined' && luckyrotFilter[type] && luckyrotFilter[type][category]) {
                    monsterIds = luckyrotFilter[type][category];
                }
            }

            // Apply filter
            state.monsterFilter = new Set(monsterIds);
            state.monsterFilterLabel = filterLabels[filterKey] || filterKey;
            state.currentPage = 1;

            // Show filter active banner
            if (filterActiveBanner) {
                filterActiveLabel.textContent = `🔸 フィルタ適用中：${state.monsterFilterLabel}`;
                filterActiveBanner.classList.add('active');
            }

            // Update filter button appearance
            monsterFilterBtn.textContent = 'フィルタ中';
            monsterFilterBtn.className = 'px-3 h-[28px] bg-orange-600 text-white text-xs font-bold rounded hover:bg-orange-700 transition-colors ring-2 ring-orange-300';

            closePopup();
            renderGrid();
        };
    });

    // Clear filter button in popup
    const clearBtn = document.getElementById('clear-filter-btn');
    if (clearBtn) {
        clearBtn.onclick = () => {
            clearMonsterFilter();
            closePopup();
        };
    }

    // Exit filter mode from banner
    const exitBtn = document.getElementById('exit-filter-mode');
    if (exitBtn) {
        exitBtn.onclick = () => {
            clearMonsterFilter();
        };
    }
}

function clearMonsterFilter() {
    state.monsterFilter = null;
    state.monsterFilterLabel = null;
    state.currentPage = 1;

    // Hide filter active banner
    if (filterActiveBanner) {
        filterActiveBanner.classList.remove('active');
    }

    // Reset filter button appearance
    if (monsterFilterBtn) {
        monsterFilterBtn.textContent = 'フィルタ';
        monsterFilterBtn.className = 'px-3 h-[28px] bg-orange-500 text-white text-xs font-bold rounded hover:bg-orange-600 transition-colors';
    }

    renderGrid();
}

// Start
init();
