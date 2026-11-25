/**
 * Maison Calla - Cart JavaScript
 * Handles cart drawer, quantity updates, grouping, and interactions
 */

(function() {
  'use strict';

  let cart = null;

  // Initialize cart functionality
  function initCart() {
    fetchCart();
    setupCartDrawer();
    setupQuantityControls();
    setupRemoveButtons();
    setupDiscountCode();
    setupCancellationPolicy();
    setupPickupToggle();
    setupCartButtons();
  }

  // Fetch cart data from Shopify Cart API
  async function fetchCart() {
    try {
      const response = await fetch('/cart.js');
      cart = await response.json();
      updateCartUI();
      return cart;
    } catch (error) {
      console.error('[Cart] Error fetching cart:', error);
    }
  }

  // Update cart UI after changes
  function updateCartUI() {
    if (!cart) return;
    
    // Update cart count in header
    updateCartCount();
    
    // Update cart drawer if open
    if (document.querySelector('.cart-drawer.open')) {
      renderCartDrawer();
    }
    
    // Update main cart page if present
    if (document.querySelector('.main-cart')) {
      renderMainCart();
    }
  }

  // Update cart count badge
  function updateCartCount() {
    const countElements = document.querySelectorAll('[data-cart-count]');
    const count = cart ? cart.item_count : 0;
    
    countElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
    });
  }

  // Setup cart drawer open/close
  function setupCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (!drawer) return;
    
    const openButtons = document.querySelectorAll('[data-cart-open]');
    const closeButtons = drawer.querySelectorAll('[data-cart-close]');
    const overlay = drawer.querySelector('.cart-drawer__overlay');
    
    openButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openCartDrawer();
      });
    });
    
    closeButtons.forEach(btn => {
      btn.addEventListener('click', closeCartDrawer);
    });
    
    if (overlay) {
      overlay.addEventListener('click', closeCartDrawer);
    }
    
    // Escape key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeCartDrawer();
      }
    });
  }

  // Open cart drawer
  function openCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (!drawer) return;
    
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
    
    // Fetch latest cart and render
    fetchCart().then(() => {
      renderCartDrawer();
    });
    
    // Focus first focusable element
    const firstFocusable = drawer.querySelector('button, a, input');
    if (firstFocusable) {
      setTimeout(() => firstFocusable.focus(), 100);
    }
    
    // Announce to screen readers
    if (window.announceToScreenReader) {
      window.announceToScreenReader('Cart opened');
    }
  }

  // Close cart drawer
  function closeCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (!drawer) return;
    
    drawer.classList.remove('open');
    document.body.style.overflow = '';
    
    // Return focus to trigger button
    const cartButton = document.querySelector('[data-cart-open]');
    if (cartButton) cartButton.focus();
  }

  // Render cart drawer content
  function renderCartDrawer() {
    const drawer = document.querySelector('.cart-drawer');
    if (!drawer || !cart) return;
    
    const content = drawer.querySelector('.cart-drawer__content');
    if (!content) return;
    
    if (cart.items.length === 0) {
      content.innerHTML = `
        <div class="cart-empty">
          <p>Your cart is empty</p>
          <a href="/collections/all" class="button">Continue shopping</a>
        </div>
      `;
      return;
    }
    
    // Group items (appointments vs products)
    const { appointments, products } = groupCartItems(cart.items);
    
    let html = '<div class="cart-items">';
    
    // Appointments section
    if (appointments.length > 0) {
      html += `
        <div class="cart-section">
          <h3 class="cart-section__title">Appointments</h3>
          ${appointments.map(item => renderCartItem(item, 'appointment')).join('')}
        </div>
      `;
    }
    
    // Products section
    if (products.length > 0) {
      html += `
        <div class="cart-section">
          <h3 class="cart-section__title">Products</h3>
          ${products.map(item => renderCartItem(item, 'product')).join('')}
        </div>
      `;
    }
    
    html += '</div>';
    
    // Cart summary
    html += renderCartSummary('drawer');
    
    content.innerHTML = html;
    
    // Re-attach event listeners
    setupQuantityControls();
    setupRemoveButtons();
  }

  // Render main cart page
  function renderMainCart() {
    const mainCart = document.querySelector('.main-cart');
    if (!mainCart || !cart) return;
    
    const content = mainCart.querySelector('.cart-content');
    if (!content) return;
    
    if (cart.items.length === 0) {
      content.innerHTML = `
        <div class="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add treatments or products to get started</p>
          <a href="/collections/all" class="button">Shop now</a>
        </div>
      `;
      return;
    }
    
    // Similar rendering for main cart page
    const { appointments, products } = groupCartItems(cart.items);
    
    let html = '<div class="cart-items">';
    
    if (appointments.length > 0) {
      html += `
        <div class="cart-section">
          <h2 class="cart-section__title">Appointments</h2>
          ${appointments.map(item => renderCartItem(item, 'appointment')).join('')}
        </div>
      `;
    }
    
    if (products.length > 0) {
      html += `
        <div class="cart-section">
          <h2 class="cart-section__title">Products</h2>
          ${products.map(item => renderCartItem(item, 'product')).join('')}
        </div>
      `;
    }
    
    html += '</div>';
    
    content.innerHTML = html;
    
    // Update summary
    const summary = mainCart.querySelector('.cart-summary');
    if (summary) {
      summary.innerHTML = renderCartSummary('main');
    }
    
    // Re-attach event listeners
    setupQuantityControls();
    setupRemoveButtons();
  }

  // Group cart items into appointments and products
  function groupCartItems(items) {
    const appointments = [];
    const products = [];
    
    items.forEach(item => {
      // Check if item is a treatment/appointment
      if (item.product_type === 'Treatment' || item.product_type === 'treatment' || 
          item.properties?.type === 'treatment') {
        appointments.push(item);
      } else {
        products.push(item);
      }
    });
    
    return { appointments, products };
  }

  // Render individual cart item
  function renderCartItem(item, type) {
    const isAppointment = type === 'appointment';
    
    return `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item__image">
          <img src="${item.image}" alt="${item.title}" width="80" height="80">
        </div>
        
        <div class="cart-item__details">
          <h4 class="cart-item__title">${item.product_title}</h4>
          ${item.variant_title && item.variant_title !== 'Default Title' ? 
            `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
          
          ${isAppointment ? renderAppointmentProperties(item) : ''}
          
          ${isAppointment ? '' : `
            <div class="cart-item__quantity">
              <button class="quantity-btn" data-action="decrease" data-key="${item.key}">−</button>
              <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-key="${item.key}" readonly>
              <button class="quantity-btn" data-action="increase" data-key="${item.key}">+</button>
            </div>
          `}
        </div>
        
        <div class="cart-item__pricing">
          <p class="cart-item__price">${formatMoney(item.final_line_price)}</p>
          ${isAppointment && item.properties?.deposit_amount ? 
            `<p class="cart-item__deposit">$${item.properties.deposit_amount} deposit</p>` : ''}
          <button class="cart-item__remove" data-key="${item.key}">Remove</button>
        </div>
      </div>
    `;
  }

  // Render appointment-specific properties
  function renderAppointmentProperties(item) {
    if (!item.properties) return '';
    
    let html = '<div class="cart-item__properties">';
    
    if (item.properties.provider) {
      html += `<p><strong>Provider:</strong> ${item.properties.provider}</p>`;
    }
    if (item.properties.date) {
      html += `<p><strong>Date:</strong> ${item.properties.date}</p>`;
    }
    if (item.properties.time) {
      html += `<p><strong>Time:</strong> ${item.properties.time}</p>`;
    }
    if (item.properties.location) {
      html += `<p><strong>Studio:</strong> ${item.properties.location}</p>`;
    }
    
    html += '<p class="reschedule-note"><a href="/pages/booking">Reschedule</a></p>';
    html += '</div>';
    
    return html;
  }

  // Render cart summary
  function renderCartSummary(context) {
    if (!cart) return '';
    
    // Calculate due today vs due at visit (demo calculation)
    const { appointments, products } = groupCartItems(cart.items);
    let dueToday = 0;
    let dueAtVisit = 0;
    
    appointments.forEach(item => {
      const depositAmount = item.properties?.deposit_amount || 50;
      dueToday += depositAmount * 100; // Convert to cents
      dueAtVisit += item.final_line_price - (depositAmount * 100);
    });
    
    products.forEach(item => {
      dueToday += item.final_line_price;
    });
    
    const isDrawer = context === 'drawer';
    
    return `
      <div class="cart-summary__pricing">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${formatMoney(cart.total_price)}</span>
        </div>
        ${appointments.length > 0 ? `
          <div class="summary-row summary-row--highlight">
            <span>Due today</span>
            <span>${formatMoney(dueToday)}</span>
          </div>
          <div class="summary-row">
            <span>Due at visit</span>
            <span>${formatMoney(dueAtVisit)}</span>
          </div>
        ` : ''}
      </div>
      
      ${isDrawer ? '' : `
        <div class="cart-upsells">
          <!-- Upsell cards rendered here -->
        </div>
        
        <div class="cart-discount">
          <input type="text" placeholder="Discount code" class="discount-input">
          <button class="button button--secondary button--compact">Apply</button>
        </div>
      `}
      
      <div class="cart-summary__actions">
        <button class="button button--full-width" onclick="window.location.href='/checkout'" ${!canCheckout() ? 'disabled' : ''}>
          Checkout · ${formatMoney(dueToday)}
        </button>
        ${isDrawer ? '<a href="/cart" class="cart-view-full">View full bag</a>' : ''}
      </div>
    `;
  }

  // Check if checkout is allowed
  function canCheckout() {
    const policyCheckbox = document.querySelector('#cancellation-policy-checkbox');
    return !policyCheckbox || policyCheckbox.checked;
  }

  // Setup quantity controls
  function setupQuantityControls() {
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const key = btn.dataset.key;
        const action = btn.dataset.action;
        const input = document.querySelector(`.quantity-input[data-key="${key}"]`);
        
        if (!input) return;
        
        let newQuantity = parseInt(input.value);
        
        if (action === 'increase') {
          newQuantity++;
        } else if (action === 'decrease' && newQuantity > 1) {
          newQuantity--;
        }
        
        await updateCartItemQuantity(key, newQuantity);
      });
    });
  }

  // Setup remove buttons
  function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.cart-item__remove');
    
    removeButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.key;
        await updateCartItemQuantity(key, 0);
      });
    });
  }

  // Update cart item quantity
  async function updateCartItemQuantity(key, quantity) {
    try {
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: key,
          quantity: quantity
        })
      });
      
      cart = await response.json();
      updateCartUI();
      
      if (window.announceToScreenReader) {
        window.announceToScreenReader('Cart updated');
      }
    } catch (error) {
      console.error('[Cart] Error updating quantity:', error);
      alert('Failed to update cart. Please try again.');
    }
  }

  // Setup discount code
  function setupDiscountCode() {
    const discountInput = document.querySelector('.discount-input');
    const applyBtn = document.querySelector('.cart-discount .button');
    
    if (!discountInput || !applyBtn) return;
    
    applyBtn.addEventListener('click', () => {
      const code = discountInput.value.trim();
      if (code) {
        window.location.href = `/discount/${code}?redirect=/checkout`;
      }
    });
    
    discountInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        applyBtn.click();
      }
    });
  }

  // Setup cancellation policy checkbox
  function setupCancellationPolicy() {
    const checkbox = document.querySelector('#cancellation-policy-checkbox');
    const checkoutBtn = document.querySelector('.cart-summary__actions .button');
    
    if (!checkbox || !checkoutBtn) return;
    
    checkbox.addEventListener('change', () => {
      checkoutBtn.disabled = !checkbox.checked;
    });
  }

  // Setup pickup toggle
  function setupPickupToggle() {
    const toggles = document.querySelectorAll('.pickup-toggle input');
    
    toggles.forEach(toggle => {
      toggle.addEventListener('change', (e) => {
        const isPickup = e.target.checked;
        const itemKey = toggle.closest('[data-key]')?.dataset.key;
        
        // Save as line item property
        // This would need cart attributes or line item properties API
        console.log(`[Cart] Pickup toggle for ${itemKey}:`, isPickup);
      });
    });
  }

  // Setup cart buttons (add to cart)
  function setupCartButtons() {
    document.addEventListener('submit', async (e) => {
      if (e.target.matches('[action="/cart/add"]')) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {
          items: [{
            id: formData.get('id'),
            quantity: parseInt(formData.get('quantity') || 1),
            properties: {}
          }]
        };
        
        // Add any line item properties
        for (let [key, value] of formData.entries()) {
          if (key.startsWith('properties[')) {
            const propKey = key.match(/properties\[(.*?)\]/)[1];
            data.items[0].properties[propKey] = value;
          }
        }
        
        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          });
          
          if (response.ok) {
            await fetchCart();
            openCartDrawer();
          } else {
            const error = await response.json();
            alert(error.description || 'Failed to add to cart');
          }
        } catch (error) {
          console.error('[Cart] Error adding to cart:', error);
          alert('Failed to add to cart. Please try again.');
        }
      }
    });
  }

  // Format money
  function formatMoney(cents) {
    return '$' + (cents / 100).toFixed(2);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }

})();
