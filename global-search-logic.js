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
    input.placeholder = 'Search trade, travel, medical services...';
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

    input.setAttribute('aria-label', 'Search trade, travel, and medical services');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-autocomplete', 'list');

    // 4. Index Data for Fast Search
    const searchIndex = buildSearchIndex();
    let activeResultIndex = -1;

    // 5. Event Listeners
    input.addEventListener('input', (e) => {
        const term = e.target.value.trim().toLowerCase();
        activeResultIndex = -1;
        handleSearch(term, dropdown, searchIndex);
        input.setAttribute('aria-expanded', dropdown.classList.contains('active') ? 'true' : 'false');
    });

    input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.search-result-item');
        if (!dropdown.classList.contains('active') || items.length === 0) {
            if (e.key === 'Escape') {
                dropdown.classList.remove('active');
                input.setAttribute('aria-expanded', 'false');
            }
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            activeResultIndex = (activeResultIndex + 1) % items.length;
            updateActiveItem(items, activeResultIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            activeResultIndex = (activeResultIndex - 1 + items.length) % items.length;
            updateActiveItem(items, activeResultIndex);
        } else if (e.key === 'Enter') {
            if (activeResultIndex >= 0 && items[activeResultIndex]) {
                e.preventDefault();
                items[activeResultIndex].click();
            }
        } else if (e.key === 'Escape') {
            dropdown.classList.remove('active');
            input.setAttribute('aria-expanded', 'false');
            input.blur();
        }
    });

    function updateActiveItem(items, index) {
        items.forEach((item, i) => {
            if (i === index) {
                item.classList.add('active-keyboard');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('active-keyboard');
            }
        });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            dropdown.classList.remove('active');
            input.setAttribute('aria-expanded', 'false');
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
                        url: `products.html?category=${catKey}&sub=${subKey}`,
                        icon: icon
                    });
                });
            });
        }
    });

    // Add Datta Chaya Tourism Services to Search Index
    const travelServices = [
        { title: 'Datta Chaya Tourism (Tours & Travel)', category: 'Datta Chaya Tourism', url: 'tours-travel.html', icon: '✈️' },
        { title: 'Corporate & Business Travel Management', category: 'Tours & Travel', url: 'tours-travel.html#travel-services', icon: '💼' },
        { title: 'Bespoke Leisure & Luxury Holiday Packages', category: 'Tours & Travel', url: 'tours-travel.html#travel-services', icon: '🏖️' },
        { title: 'Global Flight & Luxury Hotel Bookings', category: 'Tours & Travel', url: 'tours-travel.html#travel-services', icon: '🏨' },
        { title: 'Visa Assistance & Travel Documentation', category: 'Tours & Travel', url: 'tours-travel.html#travel-services', icon: '🛂' },
        { title: 'Luxury Cruises & Private Yacht Charters', category: 'Tours & Travel', url: 'tours-travel.html#travel-services', icon: '🛳️' },
        { title: 'MICE & Corporate Group Expeditions', category: 'Tours & Travel', url: 'tours-travel.html#travel-services', icon: '🏛️' },
        { title: 'Custom Travel Itinerary Planning', category: 'Tours & Travel', url: 'tours-travel.html#travel-inquiry', icon: '🗺️' }
    ];

    travelServices.forEach(item => {
        index.push({
            type: 'Service',
            title: item.title,
            category: item.category,
            url: item.url,
            icon: item.icon
        });
    });

    // Add Medical Tourism Services to Search Index
    const medicalServices = [
        { title: 'Medical Tourism & Healthcare Travel Coordination', category: 'Medical Tourism', url: 'medical-tourism.html', icon: '🩺' },
        { title: 'Hospital & Specialist Discovery', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '🏥' },
        { title: 'Doctor & Specialist Coordination', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '👨‍⚕️' },
        { title: 'Medical Treatment Itinerary Planning', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '📋' },
        { title: 'Consultation & Appointment Scheduling', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '🗓️' },
        { title: 'Medical Visa & Travel Documentation', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '🛂' },
        { title: 'Patient Accommodation & Airport Transfers', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '🏨' },
        { title: 'Dedicated On-Ground Patient Concierge', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '🤝' },
        { title: 'Post-Treatment Recovery & Follow-up Coordination', category: 'Medical Tourism', url: 'medical-tourism.html#medical-services', icon: '💚' },
        { title: 'Confidential Medical Travel Inquiry', category: 'Medical Tourism', url: 'medical-tourism.html#medical-inquiry', icon: '🔒' }
    ];

    medicalServices.forEach(item => {
        index.push({
            type: 'Service',
            title: item.title,
            category: item.category,
            url: item.url,
            icon: item.icon
        });
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
        dropdown.innerHTML = '<div class="no-results">No results found</div>';
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

