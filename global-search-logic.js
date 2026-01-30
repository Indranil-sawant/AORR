import PRODUCTS_CATALOG from './products-data.js';

/**
 * GLOBAL SEARCH LOGIC
 * Features:
 * - Injects search input into Navbar (if not present)
 * - Auto-suggestion dropdown
 * - Navigation to products page
 */

const CATEGORY_ICONS = {
    machinery_mechanical: '⚙️',
    artificial_jewellery: '💎',
    artificial_products: '🏺',
    garments: '👕',
    agriculture: '🌾',
    fiberglass_boats: '🚤',
    ship_repairing: '⚓',
    after_sales_frp: '🛠️',
    default: '📦'
};

document.addEventListener('DOMContentLoaded', () => {
    initGlobalSearch();
});

function initGlobalSearch() {
    // 1. Locate Navbar
    const navContainer = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navContainer) return;

    // 2. Create Search UI
    const searchWrapper = document.createElement('div');
    searchWrapper.className = 'nav-search-container';
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search products...';
    input.className = 'nav-search-input';
    
    const icon = document.createElement('span');
    icon.innerHTML = '🔍';
    icon.className = 'nav-search-icon';
    
    const dropdown = document.createElement('div');
    dropdown.className = 'search-results-dropdown';
    
    searchWrapper.appendChild(input);
    searchWrapper.appendChild(icon);
    searchWrapper.appendChild(dropdown);
    
    // 3. Insert into Navbar (Before Menu Toggle)
    const toggle = document.getElementById('menuToggle');
    if (toggle) {
        navContainer.insertBefore(searchWrapper, toggle);
    } else {
        navContainer.appendChild(searchWrapper);
    }

    // 4. Index Data for Fast Search
    const searchIndex = buildSearchIndex();

    // 5. Event Listeners
    input.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        handleSearch(term, dropdown, searchIndex);
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

/**
 * Flattens products data into a searchable array
 */
function buildSearchIndex() {
    const index = [];

    Object.entries(PRODUCTS_CATALOG).forEach(([catKey, data]) => {
        const icon = CATEGORY_ICONS[catKey] || CATEGORY_ICONS.default;
        
        // Add Category itself
        index.push({
            type: 'Category',
            title: data.title,
            category: 'Category',
            url: `products.html?category=${catKey}`,
            icon: icon
        });

        // Add Items (Direct)
        if (data.items) {
            data.items.forEach(item => {
                index.push({
                    type: 'Product',
                    title: item,
                    category: data.title,
                    url: `products.html?category=${catKey}&search=${encodeURIComponent(item)}`,
                    icon: icon
                });
            });
        }
        
        // Add Subcategories & Nested Items
        const nested = data.subcategories || data.sections;
        if (nested) {
            Object.entries(nested).forEach(([subKey, items]) => {
                const subTitle = formatTitle(subKey);
                
                // Add Subcategory
                index.push({
                    type: 'Subcategory',
                    title: subTitle,
                    category: data.title,
                    url: `products.html?category=${catKey}&sub=${subKey}`,
                    icon: icon
                });

                // Add Items
                items.forEach(item => {
                    index.push({
                        type: 'Product',
                        title: item,
                        category: `${data.title} > ${subTitle}`,
                        url: `products.html?category=${catKey}&sub=${subKey}`, // Link to sub page
                        icon: icon
                    });
                });
            });
        }
    });

    return index;
}

function handleSearch(term, dropdown, index) {
    if (term.length < 2) {
        dropdown.classList.remove('active');
        return;
    }

    // Filter
    const results = index.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.category.toLowerCase().includes(term)
    ).slice(0, 8); // Limit to 8

    // Render
    dropdown.innerHTML = '';
    
    if (results.length > 0) {
        const list = document.createElement('ul');
        list.className = 'search-results-list';
        
        // Header
        const header = document.createElement('div');
        header.className = 'search-result-header';
        header.textContent = `Found ${results.length} matches`;
        dropdown.appendChild(header);

        results.forEach(res => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.className = 'search-result-item';
            link.href = res.url;
            
            link.innerHTML = `
                <div class="result-icon">${res.icon}</div>
                <div class="result-info">
                    <span class="result-title">${highlight(res.title, term)}</span>
                    <span class="result-category">${res.category}</span>
                </div>
            `;
            
            li.appendChild(link);
            list.appendChild(li);
        });
        
        dropdown.appendChild(list);
    } else {
        dropdown.innerHTML = '<div class="no-results">No products found</div>';
    }

    dropdown.classList.add('active');
}

function highlight(text, term) {
    const re = new RegExp(`(${term})`, 'gi');
    return text.replace(re, '<span style="background:#fff3cd; color:#333;">$1</span>');
}

function formatTitle(str) {
    return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
