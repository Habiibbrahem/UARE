// src/store/useCartStore.js
import { create } from 'zustand';

// Try to load an existing cart from localStorage on startup:
const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

const useCartStore = create((set, get) => ({
    // Initialize cartItems from localStorage (or empty array)
    cartItems: Array.isArray(savedCart) ? savedCart : [],

    // Add one product to cart. If already in cart, just increase quantity.
    addToCart: ({ productId, name, price, image, quantity = 1, ...options }) => {
        const existing = get().cartItems.find((item) => item.productId === productId);
        if (existing) {
            // Already in cart → update quantity
            set((state) => {
                const updated = state.cartItems.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                // persist to localStorage
                localStorage.setItem('cartItems', JSON.stringify(updated));
                return { cartItems: updated };
            });
        } else {
            // New item
            set((state) => {
                const updated = [
                    ...state.cartItems,
                    { productId, name, price, image, quantity, ...options },
                ];
                localStorage.setItem('cartItems', JSON.stringify(updated));
                return { cartItems: updated };
            });
        }
    },

    // Remove an item fully from cart
    removeFromCart: (productId) => {
        set((state) => {
            const updated = state.cartItems.filter((item) => item.productId !== productId);
            localStorage.setItem('cartItems', JSON.stringify(updated));
            return { cartItems: updated };
        });
    },

    // Update quantity to a new value (overwrite)
    updateQuantity: (productId, newQuantity) => {
        set((state) => {
            let updated;
            if (newQuantity <= 0) {
                // If zero or below, remove from cart
                updated = state.cartItems.filter((item) => item.productId !== productId);
            } else {
                updated = state.cartItems.map((item) =>
                    item.productId === productId ? { ...item, quantity: newQuantity } : item
                );
            }
            localStorage.setItem('cartItems', JSON.stringify(updated));
            return { cartItems: updated };
        });
    },

    // Clear entire cart
    clearCart: () => {
        localStorage.removeItem('cartItems');
        set({ cartItems: [] });
    },

    // Computed property: total number of items (sum of quantities)
    getTotalCount: () => {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },

    // Computed property: total price
    getTotalPrice: () => {
        return get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
}));

export default useCartStore;
