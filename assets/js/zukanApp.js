
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
    "Default", "Gold", "Diamond", "Rainbow", "Chocolate",
    "Galaxy", "Zombie", "Dreamy", "ICE&FIRE", "Carnival",
    "Aqua", "Halloween", "Darkness", "Neon", "Christmas"
];

function getItemsPerPage() {
    return window.innerWidth >= 768 ? 32 : 16;
}
let state = {
    currentTab: "Default",
    currentPage: 1,
    collection: {}, // { "monsterId_variant": timestamp }
    isAdmin: false,
    filterUnobtained: true
};

// Access global images from data.js
let monsters = [];

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

// ========== Initialization ==========
function init() {
    // Check Admin Mode
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin')) {
        state.isAdmin = true;
        console.log("Admin Mode Enabled");
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

    if (state.isAdmin && markAllBtn) {
        markAllBtn.classList.remove('hidden');
    }

    // Listen to Firebase (Source of Truth)
    const collectionRef = ref(db, 'collection_status');
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

        for (let i = 0; i < monsters.length; i++) {
            const key = `${i}_${variant}`;
            if (state.collection[key]) {
                obtainedCount++;
                totalObtainedGlobal++;
            }
        }

        const btn = document.createElement('button');
        // Add flex to button to align text
        btn.className = `tab-btn ${variant} px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors flex justify-between items-center gap-4 ${state.currentTab === variant
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
    let displayMonsters = monsters.map((m, i) => ({ ...m, originalIndex: i }));

    if (state.filterUnobtained) {
        displayMonsters = displayMonsters.filter(m => {
            const key = `${m.originalIndex}_${state.currentTab}`;
            return !state.collection[key];
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
            card = createMonsterCard(monster, monster.originalIndex);
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

function createMonsterCard(monster, index) {
    const key = `${index}_${state.currentTab}`; // Unique ID: index + variant
    const timestamp = state.collection[key];
    const isObtained = !!timestamp;

    const card = document.createElement('div');
    card.className = `monster-card ${isObtained ? 'obtained' : 'unobtained'}`;

    // Apply variant class for border color
    card.classList.add(state.currentTab);

    // Check for Complete (all variants collected for this monster)
    let isComplete = true;
    for (const v of variants) {
        const k = `${index}_${v}`;
        if (!state.collection[k]) {
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
        img.src = `https://placehold.co/100x100?text=${encodeURIComponent(monster.name)}`;
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
            totalItems = monsters.filter((_, i) => !state.collection[`${i}_${state.currentTab}`]).length;
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

        if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
            // Clear Firebase
            set(ref(db, 'collection_status'), null)
                .then(() => {
                    alert("All data reset.");
                })
                .catch(err => console.error("Reset failed:", err));
        }
    };
}

function setupFiltering() {
    if (!filterToggleBtn) return;
    filterToggleBtn.onclick = () => {
        state.filterUnobtained = !state.filterUnobtained;
        state.currentPage = 1; // Reset to page 1 when filtering
        filterToggleBtn.textContent = state.filterUnobtained ? '未所持のみ表示' : 'すべて表示';
        filterToggleBtn.className = `px-3 py-1 ${state.filterUnobtained ? 'bg-gray-500' : 'bg-blue-500'} text-white text-xs font-bold rounded transition-colors`;
        renderGrid();
    };
}

function setupMarkAll() {
    if (!markAllBtn) return;
    markAllBtn.onclick = () => {
        if (!state.isAdmin) return;

        if (confirm(`Mark ALL monsters in ALL variants as obtained?`)) {
            const updates = {};
            const now = Date.now();
            monsters.forEach((_, i) => {
                variants.forEach(variant => {
                    const key = `${i}_${variant}`;
                    updates[key] = now;
                });
            });

            set(ref(db, 'collection_status'), updates)
                .then(() => alert(`All monsters in all variants marked as obtained.`))
                .catch(err => console.error("Mark all failed:", err));
        }
    };
}

function setupExportImport() {
    if (exportBtn) {
        exportBtn.onclick = () => {
            const dataStr = JSON.stringify(state.collection);
            const encoded = btoa(encodeURIComponent(dataStr));
            navigator.clipboard.writeText(encoded).then(() => {
                alert('Save code copied to clipboard!');
            }).catch(() => {
                prompt('Copy this code:', encoded);
            });
        };
    }

    if (importBtn) {
        importBtn.onclick = () => {
            if (!state.isAdmin) {
                alert("Import is only allowed in Admin mode.");
                return;
            }
            const code = prompt('Paste your save code here:');
            if (code) {
                try {
                    const decoded = decodeURIComponent(atob(code));
                    const data = JSON.parse(decoded);

                    // Update Firebase
                    set(ref(db, 'collection_status'), data)
                        .then(() => alert('Data imported successfully to Firebase!'))
                        .catch(err => console.error("Import failed:", err));

                } catch (e) {
                    alert('Invalid code!');
                    console.error(e);
                }
            }
        };
    }
}

function toggleCollection(key, isCurrentlyObtained) {
    // NO Optimistic Update - Rely on Firebase Listener
    const itemRef = ref(db, `collection_status/${key}`);
    if (isCurrentlyObtained) {
        remove(itemRef).catch(err => console.error("Firebase remove failed:", err));
    } else {
        set(itemRef, Date.now()).catch(err => console.error("Firebase set failed:", err));
    }
}

// Start
init();
