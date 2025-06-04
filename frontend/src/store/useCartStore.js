// src/store/useCartStore.js
import { create } from 'zustand';

const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

const useCartStore = create((set, get) => ({
    cartItems: Array.isArray(savedCart) ? savedCart : [],

    addToCart: ({ productId, name, price, image, quantity = 1, ...options }) => {
        const existing = get().cartItems.find((item) => item.productId === productId);
        if (existing) {
            set((state) => {
                const updated = state.cartItems.map((item) =>
                    item.productId === productId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
                localStorage.setItem('cartItems', JSON.stringify(updated));
                return { cartItems: updated };
            });
        } else {
            set((state) => {
                const updated = [
                    ...state.cartItems,
                    { productId, name, price, image, quantity, options },
                ];
                localStorage.setItem('cartItems', JSON.stringify(updated));
                return { cartItems: updated };
            });
        }
    },

    removeFromCart: (productId) => {
        set((state) => {
            const updated = state.cartItems.filter((item) => item.productId !== productId);
            localStorage.setItem('cartItems', JSON.stringify(updated));
            return { cartItems: updated };
        });
    },

    updateQuantity: (productId, newQuantity) => {
        set((state) => {
            let updated;
            if (newQuantity <= 0) {
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

    clearCart: () => {
        localStorage.removeItem('cartItems');
        set({ cartItems: [] });
    },

    getTotalCount: () => {
        return get().cartItems.reduce((sum, item) => sum + item.quantity, 0);
    },

    getTotalPrice: () => {
        return get().cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
}));

export default useCartStore;