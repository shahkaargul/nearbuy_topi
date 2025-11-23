// ============================================
// NearBuy - Main Application Controller
// DOM Manipulation & Event Handling
// ============================================

import { DB } from './db.js';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
  getCartCount,
  getSubtotal,
  clearCart,
  getCartByStore
} from './cart.js';
import { initEmailJS, sendOrderEmails } from './emailService.js';

// App State
let currentView = 'stores'; // 'stores' or 'products'
let currentStoreId = null;
let currentCategory = 'All';

// DOM Elements
const storesContainer = document.getElementById('stores-container');
const productsContainer = document.getElementById('products-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartBadge = document.getElementById('cart-badge');
const cartModal = document.getElementById('cart-modal');
const checkoutModal = document.getElementById('checkout-modal');
const categoryFilters = document.getElementById('category-filters');
const backToStores = document.getElementById('back-to-stores');
const viewCartBtn = document.getElementById('view-cart-btn');
const closeCartBtn = document.getElementById('close-cart-btn');
const checkoutBtn = document.getElementById('checkout-btn');
const closeCheckoutBtn = document.getElementById('close-checkout-btn');
const checkoutForm = document.getElementById('checkout-form');

// Initialize App
function init() {
  initEmailJS();
  renderCategoryFilters();
  renderStores();
  updateCartBadge();
  attachEventListeners();
}

// Attach Event Listeners
function attachEventListeners() {
  // Category filters
  if (categoryFilters) {
    categoryFilters.addEventListener('click', (e) => {
      if (e.target.classList.contains('category-btn')) {
        currentCategory = e.target.dataset.category;
        renderCategoryFilters();
        renderStores();
      }
    });
  }

  // Back to stores button
  if (backToStores) {
    backToStores.addEventListener('click', () => {
      currentView = 'stores';
      currentStoreId = null;
      renderStores();
    });
  }

  // View cart button
  if (viewCartBtn) {
    viewCartBtn.addEventListener('click', () => {
      openCartModal();
    });
  }

  // Close cart modal
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      closeModal(cartModal);
    });
  }

  // Alternative close cart button
  const closeCartBtn2 = document.getElementById('close-cart-btn-2');
  if (closeCartBtn2) {
    closeCartBtn2.addEventListener('click', () => {
      closeModal(cartModal);
    });
  }

  // Checkout button
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      closeModal(cartModal);
      openCheckoutModal();
    });
  }

  // Close checkout modal
  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener('click', () => {
      closeModal(checkoutModal);
    });
  }

  // Checkout form submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }

  // Close modals on overlay click
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeModal(e.target);
    }
  });
}

// Render Category Filters
function renderCategoryFilters() {
  if (!categoryFilters) return;

  const categories = DB.getAllCategories();

  categoryFilters.innerHTML = categories.map(category => `
    <button class="category-btn ${category === currentCategory ? 'active' : ''}" 
            data-category="${category}">
      ${category}
    </button>
  `).join('');
}

// Render Stores
function renderStores() {
  if (!storesContainer) return;

  // Show stores view, hide products view
  storesContainer.classList.remove('hidden');
  if (productsContainer) productsContainer.classList.add('hidden');
  if (backToStores) backToStores.classList.add('hidden');

  const stores = DB.getStoresByCategory(currentCategory);

  if (stores.length === 0) {
    storesContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-text">No stores found in this category</div>
      </div>
    `;
    return;
  }

  storesContainer.innerHTML = `
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      ${stores.map(store => `
        <div class="store-card" data-store-id="${store.id}">
          <img src="${store.imageUrl}" alt="${store.name}" class="store-card-image" loading="lazy">
          <div class="store-card-body">
            <h3 class="store-card-title">${store.name}</h3>
            <span class="store-card-category">${store.category}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach click handlers to store cards
  document.querySelectorAll('.store-card').forEach(card => {
    card.addEventListener('click', () => {
      const storeId = parseInt(card.dataset.storeId);
      openStore(storeId);
    });
  });
}

// Open Store and Show Products
function openStore(storeId) {
  currentView = 'products';
  currentStoreId = storeId;
  renderProducts(storeId);
}

// Render Products
function renderProducts(storeId) {
  if (!productsContainer) return;

  const store = DB.getStoreById(storeId);
  const products = DB.getProductsByStoreId(storeId);

  // Hide stores view, show products view
  if (storesContainer) storesContainer.classList.add('hidden');
  productsContainer.classList.remove('hidden');
  if (backToStores) backToStores.classList.remove('hidden');

  if (products.length === 0) {
    productsContainer.innerHTML = `
      <div class="section-header">
        <h2 class="section-title">${store.name}</h2>
        <p class="section-subtitle">No products available</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${store.name}</h2>
      <p class="section-subtitle">${store.category}</p>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      ${products.map(product => `
        <div class="product-card">
          <img src="${product.imageUrl}" alt="${product.name}" class="product-card-image" loading="lazy">
          <div class="product-card-body">
            <h3 class="product-card-title">${product.name}</h3>
            <div class="product-card-price">Rs. ${product.price.toLocaleString()}</div>
            <button class="btn btn-primary btn-full add-to-cart-btn" 
                    data-product-id="${product.id}">
              Add to Cart
            </button>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  // Attach click handlers to add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      handleAddToCart(productId);
    });
  });
}

// Handle Add to Cart
function handleAddToCart(productId) {
  const product = DB.getProductById(productId);
  if (!product) return;

  addToCart(product);
  updateCartBadge();
  showToast(`${product.name} added to cart!`);
}

// Update Cart Badge
function updateCartBadge() {
  if (!cartBadge) return;

  const count = getCartCount();

  if (count > 0) {
    cartBadge.textContent = count;
    cartBadge.classList.remove('hidden');
  } else {
    cartBadge.classList.add('hidden');
  }
}

// Open Cart Modal
function openCartModal() {
  if (!cartModal) return;

  renderCart();
  openModal(cartModal);
}

// Render Cart
function renderCart() {
  if (!cartItemsContainer) return;

  const cart = getCart();
  const subtotal = getSubtotal();

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <div class="cart-empty-text">Your cart is empty</div>
        <p style="color: var(--color-gray-700); margin-top: var(--spacing-md);">
          Add items from stores to get started!
        </p>
      </div>
    `;

    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.classList.add('hidden');
    }
    return;
  }

  cartItemsContainer.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-image" loading="lazy">
          <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-price">Rs. ${item.price.toLocaleString()} each</div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-quantity">
              <button class="decrease-qty" data-product-id="${item.id}">-</button>
              <span>${item.quantity}</span>
              <button class="increase-qty" data-product-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-product-id="${item.id}">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-summary-row">
        <span>Subtotal:</span>
        <span>Rs. ${subtotal.toLocaleString()}</span>
      </div>
    </div>
  `;

  // Attach event handlers
  document.querySelectorAll('.increase-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const item = cart.find(i => i.id === productId);
      if (item) {
        updateQuantity(productId, item.quantity + 1);
        renderCart();
        updateCartBadge();
      }
    });
  });

  document.querySelectorAll('.decrease-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      const item = cart.find(i => i.id === productId);
      if (item && item.quantity > 1) {
        updateQuantity(productId, item.quantity - 1);
        renderCart();
        updateCartBadge();
      }
    });
  });

  document.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const productId = parseInt(btn.dataset.productId);
      removeFromCart(productId);
      renderCart();
      updateCartBadge();
      showToast('Item removed from cart');
    });
  });

  if (checkoutBtn) {
    checkoutBtn.disabled = false;
    checkoutBtn.classList.remove('hidden');
  }
}

// Open Checkout Modal
function openCheckoutModal() {
  if (!checkoutModal) return;

  openModal(checkoutModal);
}

// Handle Checkout
async function handleCheckout(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const customerName = formData.get('name');
  const location = formData.get('location');
  const customerEmail = formData.get('email');

  const cart = getCart();
  const total = getSubtotal();

  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Show loading spinner
  showSpinner('Processing your order...');

  try {
    // Group cart by store
    const cartByStore = getCartByStore();
    const storeIds = Object.keys(cartByStore);

    // For simplicity, we'll use the first store for WhatsApp
    const primaryStoreId = parseInt(storeIds[0]);
    const store = DB.getStoreById(primaryStoreId);

    // Prepare order data
    const orderData = {
      customerName,
      customerEmail,
      location,
      items: cart,
      total,
      storeName: store.name
    };

    // Send emails
    const emailResult = await sendOrderEmails(orderData);

    // Open WhatsApp
    const whatsappMessage = createWhatsAppMessage(orderData, store);
    openWhatsApp(store.whatsappNumber, whatsappMessage);

    // Wait a bit for emails to send
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Hide spinner
    hideSpinner();

    // Show success message
    showSuccessMessage();

    // Clear cart
    clearCart();
    updateCartBadge();

    // Close modals
    closeModal(checkoutModal);
    closeModal(cartModal);

    // Reset form
    e.target.reset();

  } catch (error) {
    console.error('Checkout error:', error);
    hideSpinner();
    alert('There was an error processing your order. Please try again.');
  }
}

// Create WhatsApp Message
function createWhatsAppMessage(orderData, store) {
  let message = `*New Order from NearBuy*\\n\\n`;
  message += `*Customer:* ${orderData.customerName}\\n`;
  message += `*Location:* ${orderData.location}\\n`;
  message += `*Email:* ${orderData.customerEmail}\\n\\n`;
  message += `*Order Details:*\\n`;

  orderData.items.forEach(item => {
    message += `• ${item.name} x ${item.quantity} - Rs. ${(item.price * item.quantity).toLocaleString()}\\n`;
  });

  message += `\\n*Total: Rs. ${orderData.total.toLocaleString()}*`;

  return encodeURIComponent(message);
}

// Open WhatsApp
function openWhatsApp(phoneNumber, message) {
  const url = `https://wa.me/${phoneNumber}?text=${message}`;
  window.open(url, '_blank');
}

// Show Toast Notification
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span class="toast-icon">✓</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close">×</button>
  `;

  document.body.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    removeToast(toast);
  });

  setTimeout(() => {
    removeToast(toast);
  }, 3000);
}

// Remove Toast
function removeToast(toast) {
  toast.classList.add('toast-hide');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

// Show Spinner
function showSpinner(message = 'Loading...') {
  const spinner = document.createElement('div');
  spinner.id = 'loading-spinner';
  spinner.className = 'spinner-overlay';
  spinner.innerHTML = `
    <div class="spinner"></div>
    <div class="spinner-text">${message}</div>
  `;
  document.body.appendChild(spinner);
}

// Hide Spinner
function hideSpinner() {
  const spinner = document.getElementById('loading-spinner');
  if (spinner && spinner.parentNode) {
    spinner.parentNode.removeChild(spinner);
  }
}

// Show Success Message
function showSuccessMessage() {
  const successDiv = document.createElement('div');
  successDiv.className = 'modal-overlay';
  successDiv.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">Order Placed Successfully! 🎉</h2>
      </div>
      <div class="modal-body">
        <p style="font-size: var(--font-size-lg); text-align: center; margin-bottom: var(--spacing-lg);">
          Your order has been sent to the store via WhatsApp and you will receive a confirmation email shortly.
        </p>
        <p style="text-align: center; color: var(--color-gray-700);">
          Thank you for using NearBuy!
        </p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-full" id="success-ok-btn">Okay</button>
      </div>
    </div>
  `;
  document.body.appendChild(successDiv);

  const okBtn = successDiv.querySelector('#success-ok-btn');
  okBtn.addEventListener('click', () => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  });
}

// Open Modal
function openModal(modal) {
  if (modal) {
    modal.classList.remove('hidden');
  }
}

// Close Modal
function closeModal(modal) {
  if (modal) {
    modal.classList.add('hidden');
  }
}

// Initialize on DOM Content Loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
