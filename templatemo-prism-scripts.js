// Product data for carousel
const portfolioData = [
    {
        id: 1,
        title: 'Marine Supplies',
        description: 'Shipbuilding raw materials including Fiberglass, Resins, and Repair Kits. ISO Certified for marine safety.',
        image: 'images/marine_supplies.webp',
        tech: ['Fiberglass', 'Resins', 'Marine']
    },
    {
        id: 2,
        title: 'Industrial Components',
        description: 'High-performance Water Pump Valves and Utility Hardware for commercial industrial applications.',
        image: 'images/industrial.webp',
        tech: ['Valves', 'Hardware', 'Industrial']
    },
    {
        id: 3,
        title: 'Domestic Logistics',
        description: 'Dedicated domestic supply chain services for perishable goods like fruits and vegetables.',
        image: 'images/domestic.webp',
        tech: ['Perishables', 'Logistics', 'Supply']
    },
    {
        id: 4,
        title: 'Marine Timber',
        description: 'Premium Grade A Teak Logs and marine-grade timber for shipbuilding and decking.',
        image: 'images/marine_timber.webp',
        tech: ['Teak', 'Timber', 'Shipbuilding']
    },
    {
        id: 5,
        title: 'General Trading',
        description: 'Global trading of engineered mechanical parts, accessories, and commercial consumer goods.',
        image: 'images/general_trading.webp',
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
                <img src="${data.image}" alt="${data.title}" loading="lazy" width="300" height="200" decoding="async">
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
    const start = performance.now();

    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = progress * target;
        if (Number.isInteger(target)) {
            element.textContent = Math.floor(current) + suffix;
        } else {
            element.textContent = current.toFixed(1) + suffix;
        }
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target + suffix;
        }
    }
    requestAnimationFrame(step);
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


// Mobile menu toggle & Native Mobile Navigation Experience
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

let navBackdrop = document.querySelector('.nav-backdrop');
if (!navBackdrop && navMenu) {
    navBackdrop = document.createElement('div');
    navBackdrop.className = 'nav-backdrop';
    document.body.appendChild(navBackdrop);
}

function openMobileMenu() {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.add('active');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    if (navBackdrop) navBackdrop.classList.add('active');
}

function closeMobileMenu() {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (navBackdrop) navBackdrop.classList.remove('active');
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navMenu.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (navMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        }
    });

    // Close when tapping backdrop
    if (navBackdrop) {
        navBackdrop.addEventListener('click', closeMobileMenu);
        navBackdrop.addEventListener('touchstart', (e) => {
            e.preventDefault();
            closeMobileMenu();
        }, { passive: false });
    }

    // Close when clicking any nav link
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Auto-close and restore body scrolling on orientation change or desktop resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// Header scroll effect - OPTIMIZED with IntersectionObserver
const header = document.getElementById('header');
if (header) {
    // Create a sentinel element at the top of the body to detect scroll position
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '100%';
    sentinel.style.height = '1px';
    sentinel.style.pointerEvents = 'none';
    sentinel.style.visibility = 'hidden';
    document.body.prepend(sentinel);

    const headerObserver = new IntersectionObserver((entries) => {
        const entry = entries[0];
        // If sentinel is NOT intersecting (scrolled down past 50px roughly via margin if needed, or just 0)
        // We want > 50px. So we can position sentinel at 50px.
        if (!entry.isIntersecting) {
            header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
        } else {
            header.style.boxShadow = "none";
        }
    }, { rootMargin: '-50px 0px 0px 0px', threshold: 0 }); // Trigger when scrolled 50px

    headerObserver.observe(sentinel);
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
    // Critical visual component for immediate view
    initCarousel();

    // Chunk non-critical initializations to yield main thread (<50ms task slices)
    setTimeout(() => {
        initParticles();
        initMobileSocialDock();
        initFormsSystem();
        initPerformanceChart();
        initCatalogFilters();
    }, 0);

    // Handle Resize for Carousel to switch between 3D and Scroll modes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel();
        }, 100); // Debounce resize
    });

    // ==========================================================================
    // UNIFIED FORM CONTROLLER & INTERACTION SYSTEM
    // ==========================================================================
    function initFormsSystem() {
        // Email Template Quick-Fill Listeners
        const emailButtons = document.querySelectorAll('.email-btn');
        const contactForm = document.getElementById('contactForm');
        if (emailButtons.length > 0 && contactForm) {
            emailButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const emailType = btn.dataset.email;
                    const messageField = contactForm.querySelector('textarea[name="message"]');
                    let templateMessage = "";
                    let targetEmail = "";

                    if (emailType === 'sales') {
                        targetEmail = "sales@aorr.in";
                        templateMessage = "Hello Sales Team,\n\nI am interested in purchasing products from your catalog, specifically [Product Name / Technical Grade].\n\nPlease provide pricing, MOQs, and delivery timelines.\n\nBest regards,";
                    } else if (emailType === 'purchase') {
                        targetEmail = "purchase@aorr.in";
                        templateMessage = "Hello Purchase Team,\n\nI have a query regarding a recent order [Order ID / Port Destination].\n\nPlease assist.\n\nBest regards,";
                    } else if (emailType === 'general') {
                        targetEmail = "aorr@aorr.in";
                        templateMessage = "Hello AORR Team,\n\nI would like to inquire about [Topic / Strategic Partnership].\n\nBest regards,";
                    }

                    contactForm.scrollIntoView({ behavior: 'smooth' });
                    if (messageField) {
                        messageField.value = templateMessage;
                        messageField.focus();
                    }
                    contactForm.dataset.targetEmail = targetEmail;
                });
            });
        }

        // Initialize All Forms
        const forms = document.querySelectorAll('form.form, form#contactForm, form#medicalInquiryForm');
        forms.forEach(form => {
            // Set current URL to hidden page field
            if (form.elements.page) {
                form.elements.page.value = window.location.href;
            }

            // 1. Dynamic Select State Colors
            const selects = form.querySelectorAll('select.input-field, select.form-control');
            selects.forEach(sel => {
                const updateSelectVisual = () => {
                    if (sel.value && sel.value.trim() !== '') {
                        sel.classList.add('has-value');
                        sel.style.color = '#111827';
                    } else {
                        sel.classList.remove('has-value');
                        sel.style.color = '#6B7280';
                    }
                };
                updateSelectVisual();
                sel.addEventListener('change', () => {
                    updateSelectVisual();
                    validateField(sel);
                });
            });

            // 2. Real-Time Blur & Input Validation
            const inputs = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    validateField(input);
                });
                input.addEventListener('input', () => {
                    const parent = input.closest('.field') || input.parentElement;
                    if (parent && parent.classList.contains('is-invalid')) {
                        validateField(input);
                    }
                });
            });

            // 3. Form Submit Handler with Loading State & Validation
            form.addEventListener('submit', (e) => {
                let isFormValid = true;
                let firstInvalidEl = null;

                inputs.forEach(input => {
                    if (!validateField(input)) {
                        isFormValid = false;
                        if (!firstInvalidEl) firstInvalidEl = input;
                    }
                });

                if (!isFormValid) {
                    e.preventDefault();
                    if (firstInvalidEl) {
                        firstInvalidEl.focus();
                    }
                    return;
                }

                // UI loading state
                const submitBtn = form.querySelector('button[type="submit"]');
                const statusBanner = form.querySelector('.form-status-banner') || form.querySelector('#formStatus') || form.querySelector('#medicalFormStatus');

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.classList.add('is-loading');
                    const textSpan = submitBtn.querySelector('.btn-text');
                    submitBtn.dataset.origText = textSpan ? textSpan.textContent : submitBtn.textContent;
                    submitBtn.innerHTML = '<span class="btn-spinner"></span> <span>Processing Request...</span>';
                }

                if (statusBanner) {
                    statusBanner.className = 'form-status-banner';
                    statusBanner.style.display = 'none';
                }

                // Google Apps Script iframe submission completes
                setTimeout(() => {
                    if (statusBanner) {
                        statusBanner.className = 'form-status-banner success';
                        statusBanner.innerHTML = '<span>✓</span> <span>Thank you! Your inquiry has been submitted successfully. Our team will contact you within 24 hours.</span>';
                        statusBanner.style.display = 'flex';
                    }

                    if (submitBtn) {
                        submitBtn.classList.remove('is-loading');
                        submitBtn.innerHTML = '<span>✓ Request Submitted</span>';
                    }

                    form.reset();
                    selects.forEach(s => {
                        s.classList.remove('has-value');
                        s.style.color = '#6B7280';
                    });
                    form.querySelectorAll('.field').forEach(f => f.classList.remove('is-valid', 'is-invalid'));

                    // Re-enable submit button after 5 seconds
                    setTimeout(() => {
                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.innerHTML = submitBtn.dataset.origText || 'Submit Inquiry →';
                        }
                    }, 5000);
                }, 1200);
            });
        });

        function validateField(field) {
            const parent = field.closest('.field') || field.parentElement;
            if (!parent) return true;

            const val = field.value ? field.value.trim() : '';
            let valid = true;

            if (field.hasAttribute('required') && (!val || val === '')) {
                valid = false;
            } else if (field.type === 'email' && val) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(val)) valid = false;
            } else if (field.type === 'tel' && val) {
                const digits = val.replace(/\D/g, '');
                if (digits.length < 7) valid = false;
            } else if (field.tagName === 'SELECT' && field.hasAttribute('required')) {
                if (!val || val === '') valid = false;
            }

            if (!valid) {
                parent.classList.add('is-invalid');
                parent.classList.remove('is-valid');
            } else {
                parent.classList.remove('is-invalid');
                if (val) parent.classList.add('is-valid');
            }

            return valid;
        }

        // Newsletter forms
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(nf => {
            nf.addEventListener('submit', (e) => {
                e.preventDefault();
                const input = nf.querySelector('input[type="email"]');
                const btn = nf.querySelector('button[type="submit"]');
                if (input && input.value.trim()) {
                    if (btn) {
                        const orig = btn.textContent;
                        btn.disabled = true;
                        btn.textContent = 'Subscribed ✓';
                        setTimeout(() => {
                            input.value = '';
                            btn.disabled = false;
                            btn.textContent = orig;
                        }, 3000);
                    }
                }
            });
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

    // Filtering Logic
    function filterItems(category, searchTerm) {
        category = category.trim();
        searchTerm = searchTerm.toLowerCase().trim();

        let visibleCount = 0;

        catalogItems.forEach(item => {
            const title = item.querySelector('.catalog-title').textContent.toLowerCase();
            const categoryTag = item.querySelector('.catalog-category').textContent.trim(); 
            
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

// Mobile Scroll Highlight Logic - OPTIMIZED with IntersectionObserver
function initMobileScrollHighlight() {
    const carousel = document.getElementById('carousel');
    if (!carousel) return;

    const items = carousel.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    // Use IntersectionObserver to track which card is active
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
               items.forEach(i => i.classList.remove('active-card'));
                // Add to current
                entry.target.classList.add('active-card');
            }
        });
    }, {
        root: carousel,
        threshold: 0.6 // Trigger when 60% visible
    });

    items.forEach(item => observer.observe(item));
}

// ==========================================================================
// MOBILE COLLAPSIBLE QUICK-CONNECT SOCIAL DOCK
// ==========================================================================
function initMobileSocialDock() {
    const dock = document.querySelector('.floating-social-dock');
    if (!dock) return;

    // Check if links wrapper already exists
    let linksWrap = dock.querySelector('.social-dock-links');
    if (!linksWrap) {
        linksWrap = document.createElement('div');
        linksWrap.className = 'social-dock-links';
        const buttons = Array.from(dock.querySelectorAll('.social-dock-btn'));
        buttons.forEach(btn => linksWrap.appendChild(btn));
        dock.appendChild(linksWrap);
    }

    // Check if toggle button already exists
    let toggleBtn = dock.querySelector('.social-dock-toggle');
    if (!toggleBtn) {
        toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'social-dock-toggle';
        toggleBtn.setAttribute('aria-label', 'Toggle social channels');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('title', 'Connect with AORR');
        toggleBtn.innerHTML = `
            <svg class="icon-toggle-open" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            <svg class="icon-toggle-close" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        dock.insertBefore(toggleBtn, linksWrap);
    }

    // Sync state based on screen width
    const updateDockState = () => {
        if (window.innerWidth <= 768) {
            if (!dock.classList.contains('is-expanded')) {
                dock.classList.add('is-collapsed');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        } else {
            dock.classList.remove('is-collapsed');
            dock.classList.remove('is-expanded');
            toggleBtn.setAttribute('aria-expanded', 'true');
        }
    };

    updateDockState();

    // Toggle button click handler
    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = dock.classList.contains('is-collapsed');
        if (isCollapsed) {
            dock.classList.remove('is-collapsed');
            dock.classList.add('is-expanded');
            toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
            dock.classList.add('is-collapsed');
            dock.classList.remove('is-expanded');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Auto-collapse when tapping outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !dock.contains(e.target)) {
            if (dock.classList.contains('is-expanded')) {
                dock.classList.add('is-collapsed');
                dock.classList.remove('is-expanded');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

    // Auto-collapse when scrolling on mobile if expanded
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && dock.classList.contains('is-expanded')) {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                dock.classList.add('is-collapsed');
                dock.classList.remove('is-expanded');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }, 150);
        }
    }, { passive: true });
}

