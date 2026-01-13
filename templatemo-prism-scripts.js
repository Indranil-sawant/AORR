// Product data for carousel
const portfolioData = [
    {
        id: 1,
        title: 'Agro-Commodities',
        description: 'Premium quality Cashew, Spices, and Cocoa sourced directly from top producers. Ensuring food safety and traceability.',
        image: 'images/design.jpg',
        tech: ['Cashew', 'Spices', 'Cocoa']
    },
    {
        id: 2,
        title: 'Sugar & Sweeteners',
        description: 'High-grade ICUMSA 45 Sugar and sweeteners. Sparkling white purity for industrial and consumer applications.',
        image: 'images/quantum-cloud.jpg',
        tech: ['ICUMSA 45', 'Refined', 'Global']
    },
    {
        id: 3,
        title: 'FMCG Logistics',
        description: 'Rapid distribution of fast-moving consumer goods to international markets with efficient supply chain management.',
        image: 'images/boat.jpg',
        tech: ['Consumer Goods', 'Fast Moving', 'Export']
    },
    {
        id: 4,
        title: 'Industrial',
        description: 'Heavy machinery, scrap metal, and timber logs. Powering infrastructure and manufacturing globally.',
        image: 'images/iot-matrix.jpg',
        tech: ['Machinery', 'Timber', 'Metals']
    },
    {
        id: 5,
        title: 'Consulting',
        description: 'Expert guidance on trade regulations, customs clearance, and market entry strategies.',
        image: 'images/data-nexus.jpg',
        tech: ['Strategy', 'Compliance', 'Logistics']
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
    portfolioData.forEach((data, index) => {
        const item = createCarouselItem(data, index);
        carousel.appendChild(item);
    });
    updateCarousel();
}

// Update Carousel with Professional 'Deck' Style
function updateCarousel() {
    if (!carousel) return;
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;
    const isMobile = window.innerWidth <= 768;

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
        const spacing = isMobile ? 40 : 120; // Much tighter than 320px
        const baseScale = isMobile ? 0.9 : 0.95;

        if (absOffset === 0) {
            // Center Item
            item.style.transform = 'translate(-50%, -50%) translateZ(0) scale(1)';
            item.style.zIndex = '10';
            item.style.opacity = '1';
            item.style.boxShadow = '0 20px 50px rgba(0,0,0,0.2)'; // Emphasis shadow
        } else if (absOffset === 1) {
            // Immediate Neighbors
            item.style.transform = `translate(-50%, -50%) translateX(${sign * (isMobile ? 180 : 380)}px) translateZ(-100px) scale(${baseScale})`;
            item.style.zIndex = '5';
            item.style.opacity = '0.9';
            item.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        } else if (absOffset === 2) {
            // Far Neighbors
            item.style.transform = `translate(-50%, -50%) translateX(${sign * (isMobile ? 320 : 700)}px) translateZ(-200px) scale(${baseScale * 0.9})`;
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

    // Carousel buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    // Auto rotate carousel
    setInterval(nextSlide, 5000);

    // Contact form listener
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Optional: prevent default if you want to handle via JS, but for now let's fake it
            e.preventDefault();
            alert('Transmission Received. We will respond within 24 hours.');
            contactForm.reset();
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
});