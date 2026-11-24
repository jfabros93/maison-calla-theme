/**
 * Maison Calla Theme - Global JavaScript
 * Handles booking click tracking, lazy loading, and core interactions
 */

(function() {
  'use strict';

  // ============================================================================
  // Book Click Tracking
  // ============================================================================
  
  /**
   * Track booking CTA clicks for analytics integration
   * Fires both a CustomEvent and dataLayer push for Meta Pixel/GA4
   * Note: This tracks click intent, not confirmed bookings
   */
  function initBookClickTracking() {
    document.addEventListener('click', function(e) {
      const bookButton = e.target.closest('[data-book-cta]');
      if (!bookButton) return;

      const treatmentName = bookButton.dataset.treatmentName || '';
      const treatmentPrice = bookButton.dataset.treatmentPrice || '';
      const ctaType = bookButton.dataset.ctaType || 'book'; // 'book' or 'consult'

      // Fire custom event
      const customEvent = new CustomEvent('maison:book_click', {
        bubbles: true,
        detail: {
          treatment_name: treatmentName,
          treatment_price: treatmentPrice,
          cta_type: ctaType,
          timestamp: new Date().toISOString()
        }
      });
      document.dispatchEvent(customEvent);

      // Push to dataLayer for GTM/GA4
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'book_click',
        treatment_name: treatmentName,
        treatment_price: treatmentPrice,
        cta_type: ctaType
      });

      console.log('[Maison Calla] Book click tracked:', {
        treatment_name: treatmentName,
        treatment_price: treatmentPrice,
        cta_type: ctaType
      });
    });
  }

  // ============================================================================
  // Lazy Loading Images
  // ============================================================================
  
  function initLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading supported
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.addEventListener('load', function() {
          this.classList.add('loaded');
        });
        // Check if already loaded (from cache)
        if (img.complete) {
          img.classList.add('loaded');
        }
      });
    } else {
      // Fallback for older browsers
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
      document.body.appendChild(script);
    }
  }

  // ============================================================================
  // Mobile Book Bar
  // ============================================================================
  
  function initMobileBookBar() {
    const bookBar = document.querySelector('.mobile-book-bar');
    if (!bookBar) return;

    // Hide/show on scroll
    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', function() {
      if (!ticking) {
        window.requestAnimationFrame(function() {
          const currentScroll = window.pageYOffset;
          
          if (currentScroll <= 100) {
            bookBar.classList.remove('hidden');
          } else if (currentScroll > lastScroll && currentScroll > 200) {
            // Scrolling down - hide
            bookBar.classList.add('hidden');
          } else if (currentScroll < lastScroll) {
            // Scrolling up - show
            bookBar.classList.remove('hidden');
          }
          
          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    });

    // Handle app trigger if configured
    const appTrigger = bookBar.dataset.appTrigger;
    if (appTrigger) {
      const button = bookBar.querySelector('.mobile-book-bar__button');
      if (button) {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          try {
            // Execute the app trigger code
            // eslint-disable-next-line no-eval
            eval(appTrigger);
          } catch (error) {
            console.error('[Maison Calla] Error executing book bar app trigger:', error);
            // Fallback to link if trigger fails
            if (button.href) {
              window.location.href = button.href;
            }
          }
        });
      }
    }
  }

  // ============================================================================
  // Accessibility Enhancements
  // ============================================================================
  
  function initAccessibility() {
    // Trap focus in modals if any are opened
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
        if (openModal) {
          const closeButton = openModal.querySelector('[data-close-modal]');
          if (closeButton) closeButton.click();
        }
      }
    });

    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'visually-hidden';
    document.body.appendChild(announcer);

    window.announceToScreenReader = function(message) {
      announcer.textContent = message;
      setTimeout(function() {
        announcer.textContent = '';
      }, 1000);
    };
  }

  // ============================================================================
  // Form Enhancements
  // ============================================================================
  
  function initFormEnhancements() {
    // Add loading states to forms
    document.addEventListener('submit', function(e) {
      if (e.target.tagName === 'FORM' && !e.target.hasAttribute('data-no-loading')) {
        const submitButton = e.target.querySelector('[type="submit"]');
        if (submitButton) {
          submitButton.classList.add('loading');
          submitButton.disabled = true;
        }
      }
    });
  }

  // ============================================================================
  // Responsive Embeds
  // ============================================================================
  
  function initResponsiveEmbeds() {
    // Wrap iframes in responsive containers
    const iframes = document.querySelectorAll('iframe:not(.no-responsive)');
    iframes.forEach(function(iframe) {
      if (!iframe.parentElement.classList.contains('responsive-embed')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'responsive-embed';
        iframe.parentNode.insertBefore(wrapper, iframe);
        wrapper.appendChild(iframe);
      }
    });
  }

  // ============================================================================
  // Initialize Everything
  // ============================================================================
  
  function init() {
    initBookClickTracking();
    initLazyLoading();
    initMobileBookBar();
    initAccessibility();
    initFormEnhancements();
    initResponsiveEmbeds();

    // Dispatch theme loaded event
    document.dispatchEvent(new CustomEvent('maison:theme_loaded'));
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ============================================================================
  // Public API
  // ============================================================================
  
  window.MaisonCalla = {
    version: '1.0.0',
    trackBookClick: function(treatmentName, treatmentPrice, ctaType) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'book_click',
        treatment_name: treatmentName || '',
        treatment_price: treatmentPrice || '',
        cta_type: ctaType || 'book'
      });
    }
  };

})();
