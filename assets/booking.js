/**
 * Maison Calla - Booking Page JavaScript
 * Handles multi-step booking flow, state management, and mobile interactions
 */

(function() {
  'use strict';

  // Booking state
  const bookingState = {
    currentStep: 1,
    totalSteps: 5,
    treatment: null,
    provider: null,
    location: null,
    date: null,
    time: null,
    details: {},
    depositAmount: 0,
    totalAmount: 0
  };

  // Initialize booking flow
  function initBookingFlow() {
    const stepper = document.querySelector('.booking-stepper');
    const panels = document.querySelectorAll('.booking-step-panel');
    const summary = document.querySelector('.booking-summary');
    
    if (!stepper || !panels.length) return;

    // Initialize first step
    showStep(1);
    
    // Setup navigation buttons
    setupNavigationButtons();
    
    // Setup step panels
    setupTreatmentSelection();
    setupProviderSelection();
    setupDateTimeSelection();
    setupDetailsForm();
    
    // Setup mobile bottom sheet
    setupMobileBottomSheet();
  }

  // Show specific step
  function showStep(stepNumber) {
    bookingState.currentStep = stepNumber;
    
    // Update stepper
    updateStepper(stepNumber);
    
    // Show/hide panels
    document.querySelectorAll('.booking-step-panel').forEach((panel, index) => {
      if (index + 1 === stepNumber) {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Update progress bar for mobile
    updateMobileProgress(stepNumber);
    
    // Update continue button state
    updateContinueButton();
    
    // Populate confirm step if we're on step 5
    if (stepNumber === 5) {
      populateConfirmStep();
    }
    
    // Scroll to top of booking section
    document.querySelector('.booking-container')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Update stepper visual state
  function updateStepper(currentStep) {
    document.querySelectorAll('.stepper__step').forEach((step, index) => {
      const stepNum = index + 1;
      
      if (stepNum < currentStep) {
        step.setAttribute('data-status', 'done');
      } else if (stepNum === currentStep) {
        step.setAttribute('data-status', 'active');
        step.setAttribute('aria-current', 'step');
      } else {
        step.setAttribute('data-status', 'todo');
        step.removeAttribute('aria-current');
      }
    });
  }

  // Update mobile progress bar
  function updateMobileProgress(currentStep) {
    const progressBar = document.querySelector('.mobile-progress-bar');
    if (!progressBar) return;
    
    const progressText = progressBar.querySelector('.mobile-progress-bar__text');
    const progressFill = progressBar.querySelector('.mobile-progress-bar__fill');
    
    if (progressText) {
      progressText.textContent = `Step ${currentStep} of ${bookingState.totalSteps}`;
    }
    
    if (progressFill) {
      const percentage = (currentStep / bookingState.totalSteps) * 100;
      progressFill.style.width = `${percentage}%`;
    }
  }

  // Setup navigation buttons
  function setupNavigationButtons() {
    const backButtons = document.querySelectorAll('[data-booking-back]');
    const continueButtons = document.querySelectorAll('[data-booking-continue]');
    
    backButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (bookingState.currentStep > 1) {
          showStep(bookingState.currentStep - 1);
        }
      });
    });
    
    continueButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateCurrentStep() && bookingState.currentStep < bookingState.totalSteps) {
          showStep(bookingState.currentStep + 1);
        }
      });
    });
  }

  // Validate current step before proceeding
  function validateCurrentStep() {
    switch (bookingState.currentStep) {
      case 1:
        return bookingState.treatment !== null;
      case 2:
        return bookingState.provider !== null && bookingState.location !== null;
      case 3:
        return bookingState.date !== null && bookingState.time !== null;
      case 4:
        const detailsForm = document.querySelector('.booking-details-form');
        return detailsForm ? detailsForm.checkValidity() : false;
      default:
        return true;
    }
  }

  // Update continue button state
  function updateContinueButton() {
    const continueBtn = document.querySelector('[data-booking-continue]');
    if (!continueBtn) return;
    
    const isValid = validateCurrentStep();
    continueBtn.disabled = !isValid;
    continueBtn.setAttribute('aria-disabled', !isValid);
  }

  // Setup treatment selection (Step 1)
  function setupTreatmentSelection() {
    const treatmentTiles = document.querySelectorAll('.treatment-tile');
    const filterPills = document.querySelectorAll('.treatment-filter-pill');
    
    // Category filtering
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const category = pill.dataset.category;
        
        // Update active state
        filterPills.forEach(p => p.setAttribute('aria-pressed', 'false'));
        pill.setAttribute('aria-pressed', 'true');
        
        // Filter treatments
        treatmentTiles.forEach(tile => {
          if (category === 'all' || tile.dataset.category === category) {
            tile.style.display = '';
            tile.setAttribute('aria-hidden', 'false');
          } else {
            tile.style.display = 'none';
            tile.setAttribute('aria-hidden', 'true');
          }
        });
      });
    });
    
    // Treatment selection
    treatmentTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        // Deselect all
        treatmentTiles.forEach(t => {
          t.classList.remove('selected');
          t.setAttribute('aria-pressed', 'false');
        });
        
        // Select clicked tile
        tile.classList.add('selected');
        tile.setAttribute('aria-pressed', 'true');
        
        // Update state
        bookingState.treatment = {
          id: tile.dataset.treatmentId,
          name: tile.dataset.treatmentName,
          price: parseFloat(tile.dataset.treatmentPrice),
          duration: tile.dataset.treatmentDuration
        };
        
        // Update summary
        updateSummary();
        updateContinueButton();
      });
    });
  }

  // Setup provider selection (Step 2)
  function setupProviderSelection() {
    const providerTiles = document.querySelectorAll('.provider-tile');
    const locationTiles = document.querySelectorAll('.location-tile');
    
    // Provider selection
    providerTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        providerTiles.forEach(t => {
          t.classList.remove('selected');
          t.setAttribute('aria-pressed', 'false');
        });
        
        tile.classList.add('selected');
        tile.setAttribute('aria-pressed', 'true');
        
        bookingState.provider = {
          id: tile.dataset.providerId,
          name: tile.dataset.providerName
        };
        
        updateSummary();
        updateContinueButton();
      });
    });
    
    // Location selection
    locationTiles.forEach(tile => {
      tile.addEventListener('click', () => {
        locationTiles.forEach(t => {
          t.classList.remove('selected');
          t.setAttribute('aria-pressed', 'false');
        });
        
        tile.classList.add('selected');
        tile.setAttribute('aria-pressed', 'true');
        
        bookingState.location = {
          id: tile.dataset.locationId,
          name: tile.dataset.locationName
        };
        
        updateSummary();
        updateContinueButton();
      });
    });
  }

  // Setup date and time selection (Step 3)
  function setupDateTimeSelection() {
    const datePills = document.querySelectorAll('.date-pill');
    const timePills = document.querySelectorAll('.time-pill');
    
    // Date selection
    datePills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (pill.disabled) return;
        
        datePills.forEach(p => {
          p.classList.remove('selected');
          p.setAttribute('aria-pressed', 'false');
        });
        
        pill.classList.add('selected');
        pill.setAttribute('aria-pressed', 'true');
        
        bookingState.date = pill.dataset.date;
        
        updateSummary();
        updateContinueButton();
      });
    });
    
    // Time selection
    timePills.forEach(pill => {
      pill.addEventListener('click', () => {
        if (pill.disabled) return;
        
        timePills.forEach(p => {
          p.classList.remove('selected');
          p.setAttribute('aria-pressed', 'false');
        });
        
        pill.classList.add('selected');
        pill.setAttribute('aria-pressed', 'true');
        
        bookingState.time = pill.dataset.time;
        
        updateSummary();
        updateContinueButton();
      });
    });
  }

  // Setup details form (Step 4)
  function setupDetailsForm() {
    const form = document.querySelector('.booking-details-form');
    if (!form) return;
    
    // Monitor form validity
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        updateContinueButton();
      });
      
      input.addEventListener('blur', () => {
        updateContinueButton();
      });
    });
    
    // Skin concern chips
    const concernChips = document.querySelectorAll('.concern-chip');
    concernChips.forEach(chip => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('selected');
        const pressed = chip.classList.contains('selected');
        chip.setAttribute('aria-pressed', pressed);
        
        // Update state
        if (!bookingState.details.skinConcerns) {
          bookingState.details.skinConcerns = [];
        }
        
        const concern = chip.dataset.concern;
        if (pressed) {
          bookingState.details.skinConcerns.push(concern);
        } else {
          bookingState.details.skinConcerns = bookingState.details.skinConcerns.filter(c => c !== concern);
        }
      });
    });
    
    // First visit toggle
    const firstVisitToggle = document.querySelector('#first-visit-toggle');
    if (firstVisitToggle) {
      firstVisitToggle.addEventListener('change', (e) => {
        bookingState.details.firstVisit = e.target.checked;
      });
    }
    
    // SMS reminders switch
    const smsSwitch = document.querySelector('#sms-reminders');
    if (smsSwitch) {
      smsSwitch.addEventListener('change', (e) => {
        bookingState.details.smsReminders = e.target.checked;
      });
    }
    
    // Consent checkbox
    const consentCheckbox = document.querySelector('#consent-checkbox');
    if (consentCheckbox) {
      consentCheckbox.addEventListener('change', () => {
        updateContinueButton();
      });
    }
  }

  // Update booking summary
  function updateSummary() {
    const summaryRows = document.querySelector('.booking-summary__rows');
    if (!summaryRows) return;
    
    let html = '';
    
    if (bookingState.treatment) {
      html += `
        <div class="summary-row">
          <span class="summary-row__label">Treatment</span>
          <span class="summary-row__value">${bookingState.treatment.name}</span>
        </div>
      `;
    }
    
    if (bookingState.provider) {
      html += `
        <div class="summary-row">
          <span class="summary-row__label">Provider</span>
          <span class="summary-row__value">${bookingState.provider.name}</span>
        </div>
      `;
    }
    
    if (bookingState.location) {
      html += `
        <div class="summary-row">
          <span class="summary-row__label">Location</span>
          <span class="summary-row__value">${bookingState.location.name}</span>
        </div>
      `;
    }
    
    if (bookingState.date) {
      html += `
        <div class="summary-row">
          <span class="summary-row__label">Date</span>
          <span class="summary-row__value">${bookingState.date}</span>
        </div>
      `;
    }
    
    if (bookingState.time) {
      html += `
        <div class="summary-row">
          <span class="summary-row__label">Time</span>
          <span class="summary-row__value">${bookingState.time}</span>
        </div>
      `;
    }
    
    summaryRows.innerHTML = html;
    
    // Update pricing
    if (bookingState.treatment) {
      const dueToday = document.querySelector('.booking-summary__due-today .summary-price__amount');
      const dueAtVisit = document.querySelector('.booking-summary__due-visit .summary-price__amount');
      
      // Demo: $50 deposit, rest at visit
      const depositAmount = 50;
      const remainingAmount = bookingState.treatment.price - depositAmount;
      
      if (dueToday) dueToday.textContent = `$${depositAmount}`;
      if (dueAtVisit) dueAtVisit.textContent = `$${remainingAmount}`;
    }
  }

  // Populate confirmation step (Step 5)
  function populateConfirmStep() {
    // Treatment
    const confirmTreatment = document.querySelector('[data-confirm-treatment]');
    if (confirmTreatment && bookingState.treatment) {
      confirmTreatment.textContent = bookingState.treatment.name;
    }
    
    // Provider
    const confirmProvider = document.querySelector('[data-confirm-provider]');
    if (confirmProvider && bookingState.provider) {
      confirmProvider.textContent = bookingState.provider.name;
    }
    
    // Location
    const confirmLocation = document.querySelector('[data-confirm-location]');
    if (confirmLocation && bookingState.location) {
      confirmLocation.textContent = bookingState.location.name;
    }
    
    // Date & Time
    const confirmDateTime = document.querySelector('[data-confirm-datetime]');
    if (confirmDateTime && bookingState.date && bookingState.time) {
      confirmDateTime.textContent = `${bookingState.date} at ${bookingState.time}`;
    }
    
    // Duration
    const confirmDuration = document.querySelector('[data-confirm-duration]');
    if (confirmDuration && bookingState.treatment && bookingState.treatment.duration) {
      confirmDuration.textContent = bookingState.treatment.duration;
    }
    
    // Price
    const confirmPrice = document.querySelector('[data-confirm-price]');
    if (confirmPrice && bookingState.treatment) {
      confirmPrice.textContent = `$${bookingState.treatment.price.toFixed(2)}`;
    }
  }

  // Setup mobile bottom sheet
  function setupMobileBottomSheet() {
    const bottomBar = document.querySelector('.booking-mobile-bar');
    const bottomSheet = document.querySelector('.booking-mobile-sheet');
    
    if (!bottomBar || !bottomSheet) return;
    
    const expandBtn = bottomBar.querySelector('[data-expand-sheet]');
    const closeBtn = bottomSheet.querySelector('[data-close-sheet]');
    const overlay = bottomSheet.querySelector('.mobile-sheet__overlay');
    
    // Expand sheet
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        bottomSheet.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        // Focus trap
        const firstFocusable = bottomSheet.querySelector('button, a, input');
        if (firstFocusable) firstFocusable.focus();
        
        // Announce to screen readers
        if (window.announceToScreenReader) {
          window.announceToScreenReader('Booking summary opened');
        }
      });
    }
    
    // Close sheet
    const closeSheet = () => {
      bottomSheet.classList.remove('open');
      document.body.style.overflow = '';
      expandBtn?.focus();
    };
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeSheet);
    }
    
    if (overlay) {
      overlay.addEventListener('click', closeSheet);
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && bottomSheet.classList.contains('open')) {
        closeSheet();
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingFlow);
  } else {
    initBookingFlow();
  }

})();
