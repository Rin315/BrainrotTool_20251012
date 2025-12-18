
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
    "Aqua", "Halloween", "Darkness"
];

const ITEMS_PER_PAGE = 16;
let state = {
    currentTab: "Default",
    currentPage: 1,
    collection: {}, // { "monsterId_variant": timestamp }
    isAdmin: false
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
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');

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
    setupExportImport();

    // Listen to Firebase (Source of Truth)
    const collectionRef = ref(db, 'collection_status');
    onValue(collectionRef, (snapshot) => {
        const data = snapshot.val() || {};
        state.collection = data;
        renderGrid();
        updateStats();
    });

    // Initial Render
    renderGrid();
}

// ========== Rendering ==========
function renderTabs() {
    tabsContainer.innerHTML = '';
    variants.forEach(variant => {
        const btn = document.createElement('button');
        btn.className = `tab-btn ${variant} px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${state.currentTab === variant
            ? 'tab-active shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`;
        btn.textContent = variant;
        btn.onclick = () => {
            state.currentTab = variant;
            // Page remains same as per requirement
            renderTabs(); // Re-render to update active class
            renderGrid();
        };
        tabsContainer.appendChild(btn);
    });
}

function renderGrid() {
    gridContainer.innerHTML = '';

    // Apply flex layout to main container to hold two blocks side-by-side
    gridContainer.className = 'flex flex-col md:flex-row gap-8 justify-center items-start';

    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    // We expect ITEMS_PER_PAGE to be 16 for this layout to make sense per page

    // Block 1: Indices 0-7 (relative to page start)
    const block1 = document.createElement('div');
    block1.className = 'grid grid-cols-4 gap-4';

    // Block 2: Indices 8-15 (relative to page start)
    const block2 = document.createElement('div');
    block2.className = 'grid grid-cols-4 gap-4';

    for (let i = 0; i < ITEMS_PER_PAGE; i++) {
        const globalIndex = startIndex + i;

        let card;
        if (globalIndex < monsters.length) {
            const monster = monsters[globalIndex];
            card = createMonsterCard(monster, globalIndex);
        } else {
            // Empty slot
            card = document.createElement('div');
            card.className = 'monster-card opacity-0 pointer-events-none';
        }

        // Add to appropriate block
        // 0-3: Top row of Block 1
        // 4-7: Bottom row of Block 1
        // 8-11: Top row of Block 2
        // 12-15: Bottom row of Block 2

        // The user requested:
        // Left Top: 1,2,3,4 (Indices 0,1,2,3)
        // Left Bottom: 5,6,7,8 (Indices 4,5,6,7)
        // Right Top: 9,10,11,12 (Indices 8,9,10,11)
        // Right Bottom: 13,14,15,16 (Indices 12,13,14,15)

        // This maps naturally to 0-7 in Block 1 and 8-15 in Block 2 if we use grid-cols-4.

        if (i < 8) {
            block1.appendChild(card);
        } else {
            block2.appendChild(card);
        }
    }

    gridContainer.appendChild(block1);
    gridContainer.appendChild(block2);

    updatePaginationUI();
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
        img.src = 'https://placehold.co/100x100?text=No+Image';
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

function updatePaginationUI() {
    const totalPages = Math.ceil(monsters.length / ITEMS_PER_PAGE);
    pageIndicator.textContent = `Page ${state.currentPage} / ${totalPages}`;
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage === totalPages;
}

function updateStats() {
    // Current tab stats
    const totalInTab = monsters.length;
    let obtainedInTab = 0;

    for (let i = 0; i < monsters.length; i++) {
        const key = `${i}_${state.currentTab}`;
        if (state.collection[key]) obtainedInTab++;
    }

    collectionCountEl.textContent = obtainedInTab;
    totalCountEl.textContent = totalInTab;
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
        const totalPages = Math.ceil(monsters.length / ITEMS_PER_PAGE);
        if (state.currentPage < totalPages) {
            state.currentPage++;
            renderGrid();
        }
    };
}

function setupReset() {
    if (!resetBtn) return;
    resetBtn.onclick = () => {
        // Only Admin can reset global data? 
        // Or should this be local only? 
        // Requirement says "Source of Truth = Firebase".
        // If we reset, we should probably reset Firebase if we are admin.
        // But for safety, maybe just local reset isn't enough if sync is on.
        // Let's assume Reset is an Admin action for now, or warn user.
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

function setupExportImport() {
    // Export/Import is less relevant with Realtime Sync, but good for backup.
    // We can keep it working with local state (which reflects Firebase).

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
    // This ensures strict Source of Truth compliance.
    // Admin clicks -> Firebase Write -> Listener -> UI Update

    const itemRef = ref(db, `collection_status/${key}`);
    if (isCurrentlyObtained) {
        remove(itemRef).catch(err => console.error("Firebase remove failed:", err));
    } else {
        set(itemRef, Date.now()).catch(err => console.error("Firebase set failed:", err));
    }
}

// Start
init();
