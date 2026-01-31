// AORR - Accessibility Enhancement JavaScript
// Add this to templatemo-prism-scripts.js or include separately

(function() {
    'use strict';
    
    // Keyboard Navigation Enhancement
    function initKeyboardNav() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (menuToggle) {
            // Keyboard support for hamburger menu
            menuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    menuToggle.click();
                    
                    // Update ARIA expanded state
                    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                    menuToggle.setAttribute('aria-expanded', !isExpanded);
                }
                
                // Close menu on Escape
                if (e.key === 'Escape' && navMenu) {
                    navMenu.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    menuToggle.focus();
                }
            });
            
            // Update aria-expanded on click
            menuToggle.addEventListener('click', () => {
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
            });
        }
        
        // Trap focus in mobile menu when open
        if (navMenu) {
            navMenu.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    menuToggle.click();
                    menuToggle.focus();
                }
            });
        }
        
        // Add keyboard support to all carousel buttons
        const carouselBtns = document.querySelectorAll('.carousel-btn, .card-cta');
        carouselBtns.forEach(btn => {
            if (!btn.hasAttribute('role')) {
                btn.setAttribute('role', 'button');
            }
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }
    
    // Form Accessibility Enhancement
    function initFormAccessibility() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Add role if not present
            if (!form.hasAttribute('role')) {
                form.setAttribute('role', 'form');
            }
            
            // Enhance input fields
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                // Add aria-required to required fields
                if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
                    input.setAttribute('aria-required', 'true');
                }
                
                // Ensure proper labeling
                if (!input.getAttribute('aria-label') && !input.getAttribute('placeholder')) {
                    console.warn('Input missing accessible label:', input);
                }
            });
        });
    }
    
    // Add skip to main content link
    function addSkipLink() {
        if (document.querySelector('.skip-link')) return; // Already exists
        
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 0;
            background: var(--accent-gold);
            color: var(--primary-navy);
            padding: 8px 16px;
            text-decoration: none;
            font-weight: bold;
            z-index: 10000;
            transition: top 0.2s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '0';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add id to main content if not exists
        const hero = document.querySelector('.hero');
        if (hero && !hero.id) {
            hero.id = 'main-content';
        }
    }
    
    // Focus Visible Polyfill (for older browsers)
    function initFocusVisible() {
        // Add .focus-visible class on keyboard navigation
        let usingMouse = false;
        
        document.addEventListener('mousedown', () => {
            usingMouse = true;
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                usingMouse = false;
            }
        });
        
        document.addEventListener('focusin', (e) => {
            if (!usingMouse) {
                e.target.classList.add('focus-visible');
            }
        });
        
        document.addEventListener('focusout', (e) => {
            e.target.classList.remove('focus-visible');
        });
    }
    
    // Add enhanced focus styles to CSS
    function addFocusStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Screen reader only class */
            .sr-only {
                position: absolute;
                width: 1px;
                height: 1px;
                padding: 0;
                margin: -1px;
                overflow: hidden;
                clip: rect(0, 0, 0, 0);
                white-space: nowrap;
                border-width: 0;
            }
            
            /* Focus visible styles */
            .focus-visible,
            *:focus-visible {
                outline: 3px solid var(--accent-gold);
                outline-offset: 2px;
            }
            
            /* Remove outline for mouse users */
            *:focus:not(.focus-visible) {
                outline: none;
            }
            
            /* Skip link */
            .skip-link:focus {
                outline: 3px solid var(--primary-navy);
                outline-offset: 2px;
            }
            
            /* Mobile tap target sizes */
            @media (max-width: 768px) {
                .nav-link, .card-cta, button, a[role="button"] {
                    min-height: 48px;
                    min-width: 48px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    padding: 12px 16px;
                }
                
                input, textarea, select {
                    min-height: 48px;
                    font-size: 16px; /* Prevents zoom on iOS */
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Announce dynamic content changes to screen readers
    function createLiveRegion() {
        if (document.querySelector('[role="status"]')) return; // Already exists
        
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('role', 'status');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }
    
    // Helper function to announce to screen readers
    window.announceToScreenReader = function(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    };
    
    // Initialize all accessibility features
    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        console.log('🎯 Initializing accessibility enhancements...');
        
        addSkipLink();
        addFocusStyles();
        createLiveRegion();
        initKeyboardNav();
        initFormAccessibility();
        initFocusVisible();
        
        console.log('✅ Accessibility enhancements loaded');
    }
    
    // Auto-initialize
    init();
    
})();

// Example usage for dynamic content:
// When carousel changes: announceToScreenReader('Showing product 2 of 5');
// When form submits: announceToScreenReader('Message sent successfully');
