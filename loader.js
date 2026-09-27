/**
 * AORR Global Enterprise - Preloader Controller
 * Ensures clean, non-overlapping preloader display & seamless dismissal.
 */

(function() {
    const MIN_DISPLAY_TIME = 500; // ms
    const MAX_DISPLAY_TIME = 3000; // ms safety fallback
    let renderStart = Date.now();
    let hidden = false;

    // Lock scrolling immediately when loader initializes
    function lockScroll() {
        if (document.documentElement) document.documentElement.style.overflow = 'hidden';
        if (document.body) document.body.style.overflow = 'hidden';
    }

    function unlockScroll() {
        if (document.documentElement) document.documentElement.style.overflow = '';
        if (document.body) document.body.style.overflow = '';
    }

    lockScroll();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', lockScroll);
    }

    function hideLoader() {
        if (hidden) return;
        const loader = document.getElementById('aorr-loader');
        if (!loader) {
            unlockScroll();
            return;
        }
        
        hidden = true;
        const elapsedTime = Date.now() - renderStart;
        const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);
        
        setTimeout(() => {
            loader.classList.add('loader-hidden');
            unlockScroll();

            // Remove element from DOM after fade-out transition completes
            setTimeout(() => {
                if (loader && loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 400);
        }, remainingTime);
    }
    
    // Safety Fallback
    const fallbackTimer = setTimeout(hideLoader, MAX_DISPLAY_TIME);
    
    if (document.readyState === 'complete') {
        clearTimeout(fallbackTimer);
        hideLoader();
    } else {
        window.addEventListener('load', () => {
            clearTimeout(fallbackTimer);
            hideLoader();
        }, { once: true });
    }
})();
