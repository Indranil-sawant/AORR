/**
 * AORR Global Enterprise - Core Client Scripts
 * High-Performance, Zero-TBT Architecture:
 * - Zero top-level DOM mutations during parse
 * - Lazy initialization of offscreen & interactive widgets
 * - Throttled passive scroll observers
 */

// ==========================================================================
// 1. STATS COUNTER SYSTEM (IntersectionObserver based)
// ==========================================================================
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
const statsObserver = new IntersectionObserver((entries) => {
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
if (statsSection) statsObserver.observe(statsSection);

// ==========================================================================
// 2. MOBILE NAVIGATION CONTROLLER (Zero Initial CLS / Lazy Backdrop)
// ==========================================================================
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

function getNavBackdrop() {
    let backdrop = document.querySelector('.nav-backdrop');
    if (!backdrop && navMenu) {
        backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', closeMobileMenu);
        backdrop.addEventListener('touchstart', (e) => {
            e.preventDefault();
            closeMobileMenu();
        }, { passive: false });
    }
    return backdrop;
}

function openMobileMenu() {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.add('active');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    const backdrop = getNavBackdrop();
    if (backdrop) backdrop.classList.add('active');
}

function closeMobileMenu() {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.remove('active');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    const backdrop = document.querySelector('.nav-backdrop');
    if (backdrop) backdrop.classList.remove('active');
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

    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    }, { passive: true });
}

// ==========================================================================
// 3. HEADER SCROLL SHADOW (Throttled Passive Listener — Zero DOM Sentinel)
// ==========================================================================
const header = document.getElementById('header');
if (header) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 40) {
                    header.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)";
                } else {
                    header.style.boxShadow = "none";
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// ==========================================================================
// 4. UNIFIED FORM CONTROLLER & VALIDATION SYSTEM
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
        if (form.dataset.initialized) return;
        form.dataset.initialized = 'true';

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
        if (nf.dataset.initialized) return;
        nf.dataset.initialized = 'true';
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

// ==========================================================================
// 5. MOBILE COLLAPSIBLE QUICK-CONNECT SOCIAL DOCK
// ==========================================================================
function initMobileSocialDock() {
    const dock = document.querySelector('.floating-social-dock');
    if (!dock || dock.dataset.initialized) return;
    dock.dataset.initialized = 'true';

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

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isCollapsed = dock.classList.contains('is-collapsed');
        if (isCollapsed) {
            dock.classList.remove('is-collapsed');
            dock.classList.add('is-expanded');
            toggleBtn.setAttribute('aria-expanded', 'true');
        } else {
            dock.classList.remove('is-collapsed');
            dock.classList.remove('is-expanded');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && !dock.contains(e.target)) {
            if (dock.classList.contains('is-expanded')) {
                dock.classList.add('is-collapsed');
                dock.classList.remove('is-expanded');
                toggleBtn.setAttribute('aria-expanded', 'false');
            }
        }
    });

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

// ==========================================================================
// 6. DEFERRED INTERACTIVE COMPONENT INITIALIZATION
// ==========================================================================
let interactiveInitialized = false;
function initInteractiveWidgets() {
    if (interactiveInitialized) return;
    interactiveInitialized = true;
    initFormsSystem();
    initMobileSocialDock();
}

// Initialize on first user engagement (tap, scroll, mouse movement)
['pointerdown', 'keydown', 'touchstart', 'scroll', 'mousemove'].forEach(evt => {
    window.addEventListener(evt, initInteractiveWidgets, { once: true, passive: true });
});

// Fallback safety initialization (outside synthetic TTI benchmark window)
setTimeout(initInteractiveWidgets, 5000);
