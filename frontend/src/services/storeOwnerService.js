// src/services/storeOwnerService.js
import axiosInstance from './axiosInstance';

// Get store by owner ID (returns array but store owner has one store only)
export const getStoreByOwner = (ownerId) => {
    return axiosInstance.get(`/stores/owner/${ownerId}`);
};

// Get members of a store by storeId (members are user IDs, get user info for each)
export const getMembersOfStore = async (storeId) => {
    const res = await axiosInstance.get(`/stores/${storeId}`);
    return res.data.members; // members should be populated user objects or IDs
};

// Get all users with role STORE_MEMBER available for adding as members
export const getStoreMembersAvailable = () => {
    return axiosInstance.get('/users?role=store_member');
};

// Add member to store
export const addMemberToStore = (storeId, userId) => {
    return axiosInstance.post(`/stores/${storeId}/members`, { userId });
};

// Remove member from store
export const removeMemberFromStore = (storeId, userId) => {
    return axiosInstance.delete(`/stores/${storeId}/members/${userId}`);
};

// === Orders related API calls ===

// Fetch orders by store ID
export const getOrdersByStore = (storeId) => {
    return axiosInstance.get(`/orders?storeId=${storeId}`);
};

// Update order status
export const updateOrderStatus = (orderId, status) => {
    return axiosInstance.patch(`/orders/${orderId}/status`, { status });
};

// Confirm order delivery
export const confirmOrderDelivery = (orderId) => {
    return axiosInstance.patch(`/orders/${orderId}/confirm-delivery`);
};

// Cancel order
export const cancelOrder = (orderId) => {
    return axiosInstance.patch(`/orders/${orderId}/cancel`);
};
