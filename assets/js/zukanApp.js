
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";

// ========== Configuration ==========
// TODO: Replace with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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

    // Load from LocalStorage
    const savedCollection = localStorage.getItem('zukan_collection');
    if (savedCollection) {
        state.collection = JSON.parse(savedCollection);
    }

    renderTabs();
    setupPagination();

    // Listen to Firebase
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
        btn.className = `px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${state.currentTab === variant
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

    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    // Slice monsters for current page
    // Note: We use the master list order.
    // If a page has fewer items (e.g. last page), we still render empty slots if needed to maintain layout?
    // Requirement says: "例外で存在しない、またはコンプリートして非表示になった枠は、詰めずに「空欄（透明）」"
    // But here we are just paging through the master list. 
    // If index is out of bounds, we render empty slot.

    for (let i = startIndex; i < endIndex; i++) {
        if (i < monsters.length) {
            const monster = monsters[i];
            const card = createMonsterCard(monster, i);
            gridContainer.appendChild(card);
        } else {
            // Empty slot for layout stability
            const empty = document.createElement('div');
            empty.className = 'monster-card opacity-0 pointer-events-none';
            gridContainer.appendChild(empty);
        }
    }

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
        // if (!state.isAdmin) return; // Temporarily disabled for testing
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
    // Count total obtained for current tab? Or global?
    // Usually Zukan counts total obtained.
    // Let's count total obtained across ALL variants for now, or just current tab.
    // Given the UI is "Collection / Total", maybe per tab is better for context.

    // Let's do current tab stats
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

function toggleCollection(key, isCurrentlyObtained) {
    // Optimistic Update
    if (isCurrentlyObtained) {
        delete state.collection[key];
    } else {
        state.collection[key] = Date.now();
    }

    // Save to LocalStorage
    localStorage.setItem('zukan_collection', JSON.stringify(state.collection));

    renderGrid();
    updateStats();

    const itemRef = ref(db, `collection_status/${key}`);
    if (isCurrentlyObtained) {
        remove(itemRef).catch(err => console.error("Firebase remove failed:", err));
    } else {
        set(itemRef, state.collection[key]).catch(err => console.error("Firebase set failed:", err)); // Save timestamp
    }
}

// Start
init();
