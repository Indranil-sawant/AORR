// Product data for carousel
const portfolioData = [
    {
        id: 1,
        title: 'Marine Supplies',
        description: 'Shipbuilding raw materials including Fiberglass, Resins, and Repair Kits. ISO Certified for marine safety.',
        image: 'https://dummyimage.com/320x220/002147/fff&text=Marine+Supplies',
        tech: ['Fiberglass', 'Resins', 'Marine']
    },
    {
        id: 2,
        title: 'Industrial Components',
        description: 'High-performance Water Pump Valves and Utility Hardware for commercial industrial applications.',
        image: 'https://dummyimage.com/320x220/002147/fff&text=Industrial+Valves',
        tech: ['Valves', 'Hardware', 'Industrial']
    },
    {
        id: 3,
        title: 'Domestic Logistics',
        description: 'Dedicated domestic supply chain services for perishable goods like fruits and vegetables.',
        image: 'https://dummyimage.com/320x220/002147/fff&text=Domestic+Logistics',
        tech: ['Perishables', 'Logistics', 'Supply']
    },
    {
        id: 4,
        title: 'Marine Timber',
        description: 'Premium Grade A Teak Logs and marine-grade timber for shipbuilding and decking.',
        image: 'https://dummyimage.com/320x220/002147/fff&text=Marine+Timber',
        tech: ['Teak', 'Timber', 'Shipbuilding']
    },
    {
        id: 5,
        title: 'General Trading',
        description: 'Global trading of engineered mechanical parts, accessories, and commercial consumer goods.',
        image: 'https://dummyimage.com/320x220/002147/fff&text=General+Trading',
        tech: ['Trading', 'Commercial', 'Global']
    }
];

// Initialize particles for philosophy section
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (18 + Math.random() * 8) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialize carousel
let currentIndex = 0;
const carousel = document.getElementById('carousel');

function createCarouselItem(data, index) {
    const item = document.createElement('div');
    item.className = 'carousel-item';
    item.dataset.index = index;
    // Set background image

    // Create inner HTML
    item.innerHTML = `
        <div class="card">
            <div class="card-number">0${data.id}</div>
            <div class="card-image">
                <img src="${data.image}" alt="${data.title}">
            </div>
            <h3 class="card-title">${data.title}</h3>
            <p class="card-description">${data.description}</p>
            <button class="card-cta" onclick="document.getElementById('contact').scrollIntoView({behavior:'smooth'})">Inquire</button>
        </div>
    `;
    return item;
}

function initCarousel() {
    if (!carousel) return;
    carousel.innerHTML = '';
    
    // Create items
    const createdItems = portfolioData.map((data, index) => {
        const item = createCarouselItem(data, index);
        carousel.appendChild(item);
        return item;
    });

    // Robust Image Loading Handler
    const images = Array.from(carousel.querySelectorAll('img'));
    const imagePromises = images.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Proceed even if an image fails
        });
    });

    // Wait for images then initialize layout
    Promise.all(imagePromises).then(() => {
        // Force a layout update
        updateCarousel();
        
        // Add class to reveal container smoothly
        const container = carousel.parentElement;
        if (container) {
            container.classList.add('initialized');
        }
    });
}

// Update Carousel with Professional 'Deck' Style
function updateCarousel() {
    if (!carousel) return;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
        // Mobile: Reset styles to allow CSS flex/scroll handling
        items.forEach((item) => {
            item.style.transform = '';
            item.style.zIndex = '';
            item.style.opacity = '';
            item.style.boxShadow = '';
            item.style.position = '';
            item.style.top = '';
            item.style.left = '';
        });
        // Initialize highlights once
        if (!carousel.dataset.mobileInitialized) {
            initMobileScrollHighlight();
            carousel.dataset.mobileInitialized = 'true';
        }
        return;
    }

    items.forEach((item, index) => {
        let offset = index - currentIndex;
        if (offset > totalItems / 2) offset -= totalItems;
        else if (offset < -totalItems / 2) offset += totalItems;

        const absOffset = Math.abs(offset);
        const sign = offset < 0 ? -1 : 1;

        item.style.transform = '';
        item.style.zIndex = '';
        item.style.opacity = '';
        item.style.boxShadow = '';

        // Tighter spacing and less rotation for corporate look
        const spacing = 120;
        const baseScale = 0.95;

        if (absOffset === 0) {
            // Center Item
            item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
            item.style.zIndex = '10';
            item.style.opacity = '1';
            item.style.boxShadow = '0 20px 50px rgba(0,0,0,0.2)'; // Emphasis shadow
        } else if (absOffset === 1) {
            // Immediate Neighbors
            item.style.transform = `translate(-50%, -50%) translateX(${sign * 380}px) translateZ(-100px) scale(${baseScale})`;
            item.style.zIndex = '5';
            item.style.opacity = '0.9';
            item.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else if (absOffset === 2) {
            // Far Neighbors
            item.style.transform = `translate(-50%, -50%) translateX(${sign * 700}px) translateZ(-200px) scale(${baseScale * 0.9})`;
            item.style.zIndex = '2';
            item.style.opacity = '0.6';
        } else {
            item.style.transform = `translate(-50%, -50%) translateZ(-400px) scale(0)`;
            item.style.zIndex = '0';
            item.style.opacity = '0';
        }
    });
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % portfolioData.length;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length;
    updateCarousel();
}

// Stats Counter
function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const suffix = element.dataset.suffix || '';
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const counter = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(counter);
        } else {
            if (Number.isInteger(target)) {
                element.textContent = Math.floor(current) + suffix;
            } else {
                element.textContent = current.toFixed(1) + suffix;
            }
        }
    }, 16);
}

// Observer for stats
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(number => {
                if (!number.classList.contains('animated')) {
                    number.classList.add('animated');
                    animateCounter(number);
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) observer.observe(statsSection);


// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Header scroll effect
const header = document.getElementById('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    });
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    // Init components
    initCarousel();
    initParticles();

    // Handle Resize for Carousel to switch between 3D and Scroll modes
    window.addEventListener('resize', () => {
        updateCarousel();
    });

    // Carousel buttons
    // Auto rotate carousel - REMOVED for user preference (no auto rotation)
    // setInterval(nextSlide, 5000);

    // Debounce state for scroll
    let isTransitioning = false;
    const scrollCooldown = 800; // Matches transition time

    // Add Scroll/Wheel Interaction with Debounce
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('wheel', (e) => {
            // Disable custom scroll logic on mobile/tablets to ensure native vertical scrolling works
            if (window.innerWidth <= 768) return; 

            e.preventDefault();
            
            if (isTransitioning) return;
            
            // Threshold for trackpads
            if (Math.abs(e.deltaY) < 20) return;

            isTransitioning = true;
            
            if (e.deltaY > 0) {
                nextSlide();
            } else {
                prevSlide();
            }

            setTimeout(() => {
                isTransitioning = false;
            }, scrollCooldown);
        }, { passive: false }); // key for preventing default
    }

    // Contact form listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // Email Template Logic
        const emailButtons = document.querySelectorAll('.email-btn');
        if (emailButtons.length > 0) {
            emailButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const emailType = btn.dataset.email;
                    const messageField = contactForm.querySelector('textarea[name="message"]');
                    
                    let templateMessage = "";
                    let targetEmail = "";

                    if (emailType === 'sales') {
                        targetEmail = "sales@aorr.in";
                        templateMessage = "Hello Sales Team,\n\nI am interested in purchasing products from your catalog. specifically [Product Name].\n\nPlease provide pricing and availability.\n\nBest regards,";
                    } else if (emailType === 'purchase') {
                        targetEmail = "purchase@aorr.in";
                        templateMessage = "Hello Purchase Team,\n\nI have a query regarding a recent order [Order ID].\n\nPlease assist.\n\nBest regards,";
                    } else if (emailType === 'general') {
                        targetEmail = "aorr@aorr.in";
                        templateMessage = "Hello AORR Team,\n\nI would like to inquire about [Topic].\n\nBest regards,";
                    }

                    // Scroll to form
                    contactForm.scrollIntoView({ behavior: 'smooth' });

                    // Fill message
                    if (messageField) {
                        messageField.value = templateMessage;
                    }
                    
                    // Store target email
                    contactForm.dataset.targetEmail = targetEmail;
                });
            });
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email'); 
            const phone = formData.get('phone');
            const location = formData.get('location');
            const message = formData.get('message');
            
            // Determine recipient
            const recipient = contactForm.dataset.targetEmail || "aorr@aorr.in"; 
            
            // Construct Mailto Link
            const subject = encodeURIComponent(`New Inquiry from ${name} - ${location}`);
            const body = encodeURIComponent(
                `Name: ${name}\n` +
                `Phone: ${phone}\n` +
                `Email: ${email}\n` +
                `Location: ${location}\n\n` +
                `Message:\n${message}`
            );

            // Open Email Client
            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
            
            // Reset form (optional, maybe keep it filled for reference)
            // contactForm.reset();
        });
    }

    // Performance Chart Initialization
    function initPerformanceChart() {
        const canvas = document.getElementById('performanceChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Chart data
        const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        // Before AORR data (higher delivery times)
        const beforeData = [18, 19, 20, 21, 22, 23, 22, 21, 20, 19, 18, 17];

        // After AORR data (reduced delivery times by 45%)
        const afterData = [18, 19, 20, 21, 18, 15, 12, 11, 10, 11, 12, 10];

        // Create gradient for the filled area
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(65, 105, 225, 0.4)');
        gradient.addColorStop(1, 'rgba(65, 105, 225, 0.02)');

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Before AORR',
                        data: beforeData,
                        borderColor: 'rgba(220, 53, 69, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        tension: 0.4,
                        hidden: false
                    },
                    {
                        label: 'With AORR',
                        data: afterData,
                        borderColor: '#4169E1',
                        borderWidth: 3,
                        backgroundColor: gradient,
                        fill: true,
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointBackgroundColor: '#4169E1',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        titleFont: {
                            size: 13,
                            weight: 'bold'
                        },
                        bodyFont: {
                            size: 12
                        },
                        callbacks: {
                            label: function (context) {
                                return context.dataset.label + ': ' + context.parsed.y + ' days';
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 25,
                        ticks: {
                            callback: function (value) {
                                return value + ' days';
                            },
                            font: {
                                size: 11
                            },
                            color: '#666'
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)',
                            drawBorder: false
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 11
                            },
                            color: '#666'
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });

        // Toggle functionality
        const toggle = document.getElementById('performanceToggle');
        if (toggle) {
            toggle.addEventListener('change', function () {
                if (this.checked) {
                    // Show AORR improvements
                    chart.data.datasets[0].hidden = false;
                    chart.data.datasets[1].hidden = false;
                } else {
                    // Show only before state
                    chart.data.datasets[0].hidden = false;
                    chart.data.datasets[1].hidden = true;
                }
                chart.update('active');
            });
        }
    }

    // Initialize chart when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPerformanceChart);
    } else {
        initPerformanceChart();
    }
    
    // Initialize Catalog Filters
    initCatalogFilters();
});

// Catalog Filter Functionality
function initCatalogFilters() {
    const searchInput = document.querySelector('.search-box input');
    const categoryLinks = document.querySelectorAll('.cat-link');
    const catalogItems = document.querySelectorAll('.catalog-item');
    const productCountLabels = document.querySelectorAll('.cat-link .count');

    if (!searchInput || !categoryLinks.length || !catalogItems.length) return;

    // Mobile Collapsible Sidebar Widgets
    function initMobileCollapse() {
        if (window.innerWidth <= 768) {
            const widgets = document.querySelectorAll('.sidebar-widget');
            
            widgets.forEach((widget, index) => {
                const title = widget.querySelector('.widget-title');
                if (!title) return;
                
                // Keep search widget open by default, collapse others
                if (index !== 0 && !widget.classList.contains('help-widget')) {
                    widget.classList.add('collapsed');
                    const content = Array.from(widget.children).filter(el => !el.classList.contains('widget-title'));
                    content.forEach(el => el.style.display = 'none');
                }
                
                // Add click handler
                title.addEventListener('click', () => {
                    const isCollapsed = widget.classList.contains('collapsed');
                    const content = Array.from(widget.children).filter(el => !el.classList.contains('widget-title'));
                    
                    if (isCollapsed) {
                        widget.classList.remove('collapsed');
                        content.forEach(el => {
                            el.style.display = '';
                            el.style.animation = 'slideDown 0.3s ease';
                        });
                    } else {
                        widget.classList.add('collapsed');
                        content.forEach(el => {
                            el.style.display = 'none';
                        });
                    }
                });
            });
        }
    }
    
    // Init on load and resize
    initMobileCollapse();
    window.addEventListener('resize', () => {
        // Reset on desktop
        if (window.innerWidth > 768) {
            document.querySelectorAll('.sidebar-widget').forEach(widget => {
                widget.classList.remove('collapsed');
                Array.from(widget.children).forEach(el => el.style.display = '');
            });
        } else {
            initMobileCollapse();
        }
    });

    // Helper to calculate counts
    function updateCounts() {
        // Reset counts mapping
        const counts = {
            'All Products': 0,
            'Agro-Commodities': 0,
            'Industrial Machinery': 0,
            'Spices & Herbs': 0,
            'Raw Materials': 0
            // Add other mapping if needed
        };
        
        // Manual mapping from UPPERCASE categories in HTML to Title Case sidebar categories
        // HTML categories: AGRO-COMMODITY, COMMODITY, INDUSTRIAL, MACHINERY, SPICES, RECYCLING
        const categoryMap = {
            'AGRO-COMMODITY': 'Agro-Commodities',
            'COMMODITY': 'All Products', // General fallback or specific? Let's treat 'Refined Sugar' as part of 'All' for now unless we add a Sugar category
            'INDUSTRIAL': 'Raw Materials', // Teak logs -> Raw Materials
            'MACHINERY': 'Industrial Machinery',
            'SPICES': 'Spices & Herbs',
            'RECYCLING': 'Raw Materials' // Scrap -> Raw Materials
        };
        
        // Count visible items based on their category
        // Note: For this simple implementation, we might just filter by text match if we don't have strict data attributes
        
        // Let's implement Filtering First, then update counts dynamically or just execute filter
    }

    // Filter Logic
    function filterItems(category, searchTerm) {
        category = category.trim();
        searchTerm = searchTerm.toLowerCase().trim();

        let visibleCount = 0;

        catalogItems.forEach(item => {
            const title = item.querySelector('.catalog-title').textContent.toLowerCase();
            const categoryTag = item.querySelector('.catalog-category').textContent.trim(); // e.g. AGRO-COMMODITY
            
            // Map Sidebar Category to Item Category
            // Sidebar: 'All Products', 'Agro-Commodities', 'Industrial Machinery', 'Spices & Herbs', 'Raw Materials'
            // Items: 'AGRO-COMMODITY', 'COMMODITY'(Sugar), 'INDUSTRIAL'(Wood), 'MACHINERY', 'SPICES', 'RECYCLING'
            
            let matchCategory = false;
            
            if (category === 'All Products') {
                matchCategory = true;
            } else if (category === 'Agro-Commodities') {
                if (categoryTag === 'AGRO-COMMODITY' || title.includes('coffee') || title.includes('cashew')) matchCategory = true;
            } else if (category === 'Industrial Machinery') {
                if (categoryTag === 'MACHINERY' || title.includes('machine') || title.includes('tractor')) matchCategory = true;
            } else if (category === 'Spices & Herbs') {
                if (categoryTag === 'SPICES' || title.includes('pepper')) matchCategory = true;
            } else if (category === 'Raw Materials') {
                if (categoryTag === 'INDUSTRIAL' || categoryTag === 'RECYCLING' || title.includes('wood') || title.includes('scrap')) matchCategory = true;
            }

            // Check Search
            const matchSearch = title.includes(searchTerm) || categoryTag.toLowerCase().includes(searchTerm);

            if (matchCategory && matchSearch) {
                item.style.display = 'block';
                // Animation for appearance
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
                visibleCount++;
            } else {
                item.style.display = 'none';
            }
        });
        
        // Update "All Products" count text if needed, but for now we just filter
    }

    // Event Listeners for Categories
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all
            categoryLinks.forEach(l => l.classList.remove('active'));
            // Add to clicked
            link.classList.add('active');
            
            // Get category name
            // Text content includes count e.g. "Agro-Commodities (3)"
            // We need just the text node or parse it
            const fullText = link.textContent; // "Agro-Commodities (3)"
            const categoryName = fullText.split('(')[0].trim();
            
            filterItems(categoryName, searchInput.value);
        });
    });

    // Event Listener for Search
    searchInput.addEventListener('input', (e) => {
        const activeLink = document.querySelector('.cat-link.active');
        const fullText = activeLink.textContent;
        const categoryName = fullText.split('(')[0].trim();
        
        filterItems(categoryName, e.target.value);
    });
}

// Mobile Scroll Highlight Logic
function initMobileScrollHighlight() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    // Helper to find center card
    const updateActiveCard = () => {
        const containerCenter = carousel.scrollLeft + (carousel.offsetWidth / 2);
        let closestItem = null;
        let minDistance = Infinity;

        items.forEach(item => {
            // Get item center relative to the container scroll
            // item.offsetLeft is relative to container start (0), not viewport
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const distance = Math.abs(containerCenter - itemCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestItem = item;
            }
        });

        items.forEach(item => {
            if (item === closestItem) {
                item.classList.add('active-card');
            } else {
                item.classList.remove('active-card');
            }
        });
    };

    // Listen for scroll
    carousel.addEventListener('scroll', () => {
        // Throttling via RequestAnimationFrame for performance
        window.requestAnimationFrame(updateActiveCard);
    }, { passive: true });

    // Initial run
    setTimeout(updateActiveCard, 100);
}
