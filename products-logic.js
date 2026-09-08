import PRODUCTS_CATALOG from './products-data.js';
import SUBCATEGORY_META from './subcategory-data.js';

/**
 * PRODUCTS PAGE LOGIC (v4 - Subcategory Landing Pages)
 * Features:
 * - Dynamic Sidebar with Subcategories
 * - Main View: Category Cards 
 * - Subcategory View: Dedicated Landing Page with Hero + Item Cards
 * - "Pseudo-Routing" handling via URL Search Params
 */

const CATEGORY_ICONS = {
    machinery_mechanical: '⚙️',
    artificial_jewellery: '💎',
    artificial_products: '🏺',
    garments: '👕',
    agriculture: '🌾',
    fiberglass_boats: '🚤',
    ship_repairing: '⚓',
    after_sales_frp: '🛠️'
};

const DEFAULT_ICON = '📦';

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    initCatalog();
    setupSearch();
    setupEnquiryModal();
    
    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handleRouting);
});

function initCatalog() {
    const navRoot = document.getElementById('sidebar-nav-list');
    if (navRoot) renderSidebar(navRoot);

    // Determines what to render based on URL
    handleRouting();
}

/**
 * 0. ROUTING HANDLER
 * Decides between Main Catalog View and Subcategory View
 */
function handleRouting() {
    const params = new URLSearchParams(window.location.search);
    const subKey = params.get('sub');
    const parentKey = params.get('category');
    
    const root = document.getElementById('products-root');
    const header = document.querySelector('.section-header-left');
    
    // Clear Content
    root.innerHTML = '';

    if (subKey && parentKey) {
        // RENDER SUBCATEGORY PAGE
        if(header) header.style.display = 'none'; // Hide default header
        renderSubcategoryPage(root, parentKey, subKey);
        updateSidebarActiveState(parentKey, subKey);
    } else {
        // RENDER MAIN CATALOG
        if(header) header.style.display = 'block';
        renderAllCards(root);
        updateSidebarActiveState(parentKey || null, null);
        
        // If category param exists but no sub, maybe scroll to it?
        if(parentKey) {
           setTimeout(() => {
               const el = document.querySelector(`[data-key="${parentKey}"].product-card`);
               if(el) el.scrollIntoView({behavior:'smooth'});
           }, 500);
        }
    }
}

/**
 * 1. Build Dynamic Sidebar
 * Updated to use navigate() for history pushing
 */
function renderSidebar(navRoot) {
    navRoot.innerHTML = '';
    
    Object.entries(PRODUCTS_CATALOG).forEach(([key, data]) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        
        // Parent Link
        const link = document.createElement('a');
        link.href = `?category=${key}`;
        link.className = 'nav-link-parent';
        link.dataset.key = key;
        link.textContent = data.title || formatTitle(key);
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(key, null);
        });
        
        li.appendChild(link);

        // Subcategories
        const nested = data.subcategories || data.sections;
        if (nested) {
            const subUl = document.createElement('ul');
            subUl.className = 'nav-sub-list';
            
            Object.keys(nested).forEach(subKey => {
                const subLi = document.createElement('li');
                const subLink = document.createElement('a');
                subLink.href = `?category=${key}&sub=${subKey}`;
                subLink.className = 'nav-link-child';
                subLink.dataset.parent = key;
                subLink.dataset.sub = subKey;
                subLink.textContent = formatTitle(subKey);
                
                subLink.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    navigateTo(key, subKey);
                });
                
                subLi.appendChild(subLink);
                subUl.appendChild(subLi);
            });
            li.appendChild(subUl);
        }

        navRoot.appendChild(li);
    });
}

function navigateTo(category, sub) {
    let url = `?category=${category}`;
    if(sub) url += `&sub=${sub}`;
    
    window.history.pushState({}, '', url);
    handleRouting();
}

/**
 * 2. Render Main Catalog (Default State - Category Cards)
 */
function renderAllCards(root) {
    Object.entries(PRODUCTS_CATALOG).forEach(([key, data]) => {
        const card = createCategoryCard(key, data);
        if (card) root.appendChild(card);
    });
}

/**
 * 3. RENDER SUBCATEGORY LANDING PAGE
 * New View Logic
 */
function renderSubcategoryPage(root, parentKey, subKey) {
    const parentData = PRODUCTS_CATALOG[parentKey];
    if(!parentData) {
        root.innerHTML = '<h3>Category not found</h3>';
        return;
    }

    // Get Items
    const nested = parentData.subcategories || parentData.sections;
    const items = nested ? nested[subKey] : [];
    
    if(!items) {
        root.innerHTML = '<h3>Subcategory not found</h3>';
        return;
    }

    // Get Metadata
    const meta = SUBCATEGORY_META[subKey] || SUBCATEGORY_META[parentKey] || SUBCATEGORY_META.default;
    const itemsArray = Array.isArray(items) ? items : [];

    // Construct View
    const container = document.createElement('div');
    container.className = 'subcategory-view-container';

    // 1. Back Button
    const backBtn = document.createElement('a');
    backBtn.className = 'back-btn';
    backBtn.innerHTML = '← Back to Catalog';
    backBtn.onclick = () => { navigateTo(parentKey, null); }; // Go to parent
    container.appendChild(backBtn);

    // 2. Hero Banner
    const hero = document.createElement('div');
    hero.className = 'sub-hero-banner';
    hero.style.backgroundImage = `url('${meta.image}')`;
    hero.innerHTML = `
        <div class="sub-hero-overlay"></div>
        <div class="sub-hero-content">
            <h1 class="sub-hero-title">${formatTitle(subKey)}</h1>
            <p class="sub-hero-desc">${meta.description}</p>
        </div>
    `;
    container.appendChild(hero);

    // 3. Items Grid (Rendered as Cards)
    const grid = document.createElement('div');
    grid.className = 'products-card-grid';

    if(itemsArray.length > 0) {
        itemsArray.forEach(itemName => {
            const card = createItemCard(itemName, formatTitle(subKey));
            grid.appendChild(card);
        });
    } else {
        grid.innerHTML = '<p>No products listed in this section.</p>';
    }

    container.appendChild(grid);
    root.appendChild(container);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Create ITEM Card (For Subcategory Page)
 */
function createItemCard(name, categoryName) {
    const el = document.createElement('div');
    el.className = 'item-card';
    el.innerHTML = `
        <div class="item-card-image-placeholder">
            ${DEFAULT_ICON}
        </div>
        <div class="item-card-body">
            <div class="item-card-category">${categoryName}</div>
            <h3 class="item-card-title">${name}</h3>
            <button class="item-card-btn enquiry-trigger" data-product="${name}">Enquire Now</button>
        </div>
    `;
    return el;
}

/**
 * Create CATEGORY Card (For Main Page) - Preserved Logic
 */
function createCategoryCard(key, data) {
    // Determine if we should show this card based on logic (reuse v3 logic if needed, but here simple)
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.key = key;

    const icon = CATEGORY_ICONS[key] || DEFAULT_ICON;
    card.innerHTML = `
        <div class="card-header-visual">
            <div class="card-icon-large">${icon}</div>
        </div>
        <div class="card-body">
            <h3 class="card-title">${data.title}</h3>
            <details class="card-details-drawer">
                <summary class="card-drawer-trigger">View Inventory</summary>
                <div class="hidden-list"></div>
            </details>
        </div>
    `;

    // Populate the list for the drawer
    const container = card.querySelector('.hidden-list');
    
    // Quick populate logic (simplified from v3 since we focus on routing now)
    if(data.items) appendList(container, null, data.items);
    if(data.fast_moving_items) appendList(container, 'Stock Items', data.fast_moving_items);
    
    const nested = data.subcategories || data.sections;
    if(nested) {
        Object.entries(nested).forEach(([subKey, items]) => {
             appendList(container, formatTitle(subKey), items);
        });
    }

    return card;
}

function appendList(container, title, items) {
    if(!items || items.length === 0) return;
    if(title) {
        const t = document.createElement('div');
        t.className = 'subcategory-title';
        t.textContent = title;
        container.appendChild(t);
    }
    const ul = document.createElement('ul');
    ul.className = 'item-list';
    items.forEach(i => {
         const li = document.createElement('li');
         // Make the list item clickable for enquiry
         const link = document.createElement('a');
         link.href = "#";
         link.className = 'enquiry-trigger';
         link.dataset.product = i; // Use the item name as the product
         link.textContent = i;
         link.style.textDecoration = 'none';
         link.style.color = 'inherit';
         
         li.appendChild(link);
         ul.appendChild(li);
    });
    container.appendChild(ul);
}


function updateSidebarActiveState(parentKey, subKey) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
    
    if (parentKey) {
        const pLink = document.querySelector(`.nav-link-parent[data-key="${parentKey}"]`);
        if(pLink) pLink.classList.add('active');
    }

    if (subKey) {
        const sLink = document.querySelector(`.nav-link-child[data-parent="${parentKey}"][data-sub="${subKey}"]`);
        if(sLink) sLink.classList.add('active');
    }
}

/**
 * 5. Search Logic (Global)
 */
function setupSearch() {
    const input = document.getElementById('product-search');
    const root = document.getElementById('products-root');
    
    if (!input) return;

    input.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        
        // If we are on a Subcategory Page, we should probably go back to Main View to search all?
        // Or filter current?
        // Simpler: Redirect to Main view if search starts, to search everything.
        
        const currentParams = new URLSearchParams(window.location.search);
        if(currentParams.get('sub') && term.length > 0) {
            // Reset to main view but keep search
            window.history.pushState({}, '', '?search=mode'); 
            handleRouting(); // Renders main cards
        }

        if (!term) {
             const allCards = root.querySelectorAll('.product-card');
             allCards.forEach(c => c.style.display = 'flex');
             return;
        }

        // Filter valid Cards (Category Cards) in the Main View
        const cards = root.querySelectorAll('.product-card');
        cards.forEach(card => {
             const text = card.textContent.toLowerCase();
             if(text.includes(term)) {
                 card.style.display = 'flex';
                 const details = card.querySelector('details');
                 if(details) details.open = true;
             } else {
                 card.style.display = 'none';
             }
        });
    });
}

function formatTitle(str) {
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

/**
 * 6. PRODUCT ENQUIRY MODAL LOGIC
 * Handles opening, closing, and submitting the enquiry form.
 */
function setupEnquiryModal() {
    const modal = document.getElementById('product-enquiry-modal');
    const closeBtn = document.getElementById('modal-close');
    const form = document.getElementById('product-enquiry-form');
    const root = document.getElementById('products-root'); // For delegation

    if (!modal || !form) return;

    // 1. OPEN MODAL (Event Delegation)
    // We listen on the document body or a high-level container to catch clicks on dynamically created buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('enquiry-trigger')) {
            e.preventDefault();
            const productName = e.target.dataset.product;
            openModal(productName);
        }
    });

    // 2. CLOSE MODAL
    const closeModal = () => {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scroll
        
        // Reset status message after delay, but keep form data for now in case of error retry? 
        // Best to clear if success. 
        setTimeout(() => {
            document.getElementById('enquiry-status').textContent = '';
        }, 500);
    };

    closeBtn.addEventListener('click', closeModal);

    // Click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });

    // 3. OPEN LOGIC
    function openModal(productName) {
        document.getElementById('modal-product-name').textContent = productName || 'Product';
        document.getElementById('form-product-name').value = productName || 'General Product';
        document.getElementById('form-page-url').value = window.location.href;
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Lock scroll
    }

    // 4. SUBMIT HANDLER (Hidden Iframe approach)
    form.addEventListener('submit', () => {
        const status = document.getElementById('enquiry-status');
        status.textContent = "Sending Enquiry...";
        status.style.color = "blue";

        // Give it a second to "send" (since it goes to iframe invisible)
        setTimeout(() => {
            status.textContent = "✓ Enquiry Sent Successfully!";
            status.style.color = "green";
            form.reset();
            
            // Close after success
            setTimeout(closeModal, 2000);
        }, 1500);
    });
}
