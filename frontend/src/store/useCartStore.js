import { create } from 'zustand';

const savedCart = JSON.parse(localStorage.getItem('cartItems') || '[]');

const useCartStore = create((set, get) => ({
    cartItems: Array.isArray(savedCart) ? savedCart : [],

    addToCart: ({ productId, name, price, image, quantity = 1, storeId, color, size }) => {
        if (!storeId) throw new Error('Product must belong to a store');

        set((state) => {
            const existingIndex = state.cartItems.findIndex(
                item => item.productId === productId &&
                    item.color === color &&
                    item.size === size
            );

            let updated;
            if (existingIndex >= 0) {
                updated = [...state.cartItems];
                updated[existingIndex].quantity += quantity;
            } else {
                updated = [
                    ...state.cartItems,
                    {
                        productId,
                        name,
                        price,
                        image,
                        quantity,
                        storeId,
                        ...(color && { color }),
                        ...(size && { size })
                    }
                ];
            }

            localStorage.setItem('cartItems', JSON.stringify(updated));
            return { cartItems: updated };
        });
    },

    removeFromCart: (productId) => {
        set((state) => {
            const updated = state.cartItems.filter((item) => item.productId !== productId);
            localStorage.setItem('cartItems', JSON.stringify(updated));
            return { cartItems: updated };
        });
    },

    updateQuantity: (productId, newQuantity, color, size) => {
        set((state) => {
            let updated;
            if (newQuantity <= 0) {
                updated = state.cartItems.filter(item =>
                    !(item.productId === productId &&
                        item.color === color &&
                        item.size === size)
                );
            } else {
                updated = state.cartItems.map(item =>
                    (item.productId === productId &&
                        item.color === color &&
                        item.size === size)
                        ? { ...item, quantity: newQuantity }
                        : item
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
        return get().cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },

    getStoreId: () => {
        const stores = [...new Set(get().cartItems.map(item => item.storeId))];
        return stores.length === 1 ? stores[0] : null;
    }
}));

export default useCartStore;