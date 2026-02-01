/**
 * AORR Global Trading - Loader Logic
 * Handles safe removal of the preloader after site assets are ready.
 */

(function() {
    // Configuration
    const MIN_DISPLAY_TIME = 800; // ms (prevent flickering on fast networks)
    const MAX_DISPLAY_TIME = 5000; // ms (safety fallback)
    
    let renderStart = Date.now();
    
    function hideLoader() {
        const loader = document.getElementById('aorr-loader');
        if (!loader) return;
        
        // Calculate how much time has passed
        const elapsedTime = Date.now() - renderStart;
        const remainingTime = Math.max(0, MIN_DISPLAY_TIME - elapsedTime);
        
        setTimeout(() => {
            // Add fade-out class
            loader.classList.add('loader-hidden');
            
            // Remove from DOM after transition completes to free memory
            loader.addEventListener('transitionend', () => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, { once: true });
            
            // Allow scrolling again (if we locked it)
            document.body.style.overflow = '';
            
        }, remainingTime);
    }
    
    // Safety Fallback (in case onload event hangs)
    const fallbackTimer = setTimeout(hideLoader, MAX_DISPLAY_TIME);
    
    // Main Event Listener
    window.addEventListener('load', () => {
        clearTimeout(fallbackTimer); // Clear safety timer
        hideLoader(); // Trigger removal
    });
    
    // Initialize: Lock scrolling while loading
    // document.body.style.overflow = 'hidden'; // Optional: prefer not to lock if content height varies
})();
