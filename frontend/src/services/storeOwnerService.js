// src/services/storeOwnerService.js
import axiosInstance from './axiosInstance';

/**
 * Fetches the currently‐logged‐in owner’s store(s). 
 * The backend will extract the user ID from the JWT (no /:ownerId in the URL).
 * Returns an array (but a store owner only ever has one store).
 */
export const getStoreByOwner = () => {
    return axiosInstance.get('/stores/owner');
};

/**
 * Fetch all members (user IDs or user objects) of a given store.
 * This still needs a storeId because it’s store‐scoped.
 */
export const getMembersOfStore = async (storeId) => {
    const res = await axiosInstance.get(`/stores/${storeId}`);
    return res.data.members;
};

/**
 * Fetch all users who have the role “store_member”, so the owner can pick one to add.
 */
export const getStoreMembersAvailable = () => {
    return axiosInstance.get('/users?role=store_member');
};

/**
 * Add a single user as a member to this store.
 */
export const addMemberToStore = (storeId, userId) => {
    return axiosInstance.post(`/stores/${storeId}/members`, { userId });
};

/**
 * Remove a member from this store.
 */
export const removeMemberFromStore = (storeId, userId) => {
    return axiosInstance.delete(`/stores/${storeId}/members/${userId}`);
};

// === Orders-related calls ===

/**
 * Fetch all orders for a given store.
 * The owner’s dashboard will pass in the storeId it retrieved from getStoreByOwner().
 */
export const getOrdersByStore = (storeId) => {
    return axiosInstance.get(`/orders?storeId=${storeId}`);
};

/**
 * Update an order’s status.
 */
export const updateOrderStatus = (orderId, status) => {
    return axiosInstance.patch(`/orders/${orderId}/status`, { status });
};

/**
 * Confirm that a given order has been delivered.
 */
export const confirmOrderDelivery = (orderId) => {
    return axiosInstance.patch(`/orders/${orderId}/confirm-delivery`);
};

/**
 * Cancel a given order.
 */
export const cancelOrder = (orderId) => {
    return axiosInstance.patch(`/orders/${orderId}/cancel`);
};
