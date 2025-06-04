// src/services/storeService.js
import axiosInstance from './axiosInstance';

export const getStoreById = (storeId) =>
    axiosInstance.get(`/stores/${storeId}`);

// Add this function:
export const getProductsByStore = (storeId) =>
    axiosInstance.get(`/products/store/${storeId}`);

// Keep any other existing exports