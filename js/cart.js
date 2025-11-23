// ============================================
// NearBuy - Cart Logic
// LocalStorage Persistence & Cart Management
// ============================================

const CART_STORAGE_KEY = 'nearbuy_cart';

// Cart state
let cart = loadCartFromStorage();

// Load cart from localStorage
function loadCartFromStorage() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Error loading cart from storage:', error);
        return [];
    }
}

// Save cart to localStorage
function saveCartToStorage() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to storage:', error);
    }
}

// Add item to cart
export function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            storeId: product.storeId,
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: 1
        });
    }

    saveCartToStorage();
    return cart;
}

// Remove item from cart
export function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    return cart;
}

// Update item quantity
export function updateQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = quantity;
            saveCartToStorage();
        }
    }

    return cart;
}

// Get cart items
export function getCart() {
    return cart;
}

// Get cart count (total items)
export function getCartCount() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

// Calculate subtotal
export function getSubtotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Clear cart
export function clearCart() {
    cart = [];
    saveCartToStorage();
    return cart;
}

// Get cart grouped by store
export function getCartByStore() {
    const grouped = {};

    cart.forEach(item => {
        if (!grouped[item.storeId]) {
            grouped[item.storeId] = [];
        }
        grouped[item.storeId].push(item);
    });

    return grouped;
}

// Check if cart has items from multiple stores
export function hasMultipleStores() {
    const storeIds = new Set(cart.map(item => item.storeId));
    return storeIds.size > 1;
}

// Get unique store IDs from cart
export function getCartStoreIds() {
    return [...new Set(cart.map(item => item.storeId))];
}
