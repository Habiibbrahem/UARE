// src/services/storeService.js
import axiosInstance from './axiosInstance';

// Fetch one store (populated with products array)
export const getStoreById = (storeId) =>
    axiosInstance.get(`/stores/${storeId}`);

// If you prefer to fetch products separately:
// export const getProductsByStore = (storeId) =>
//   axiosInstance.get(`/products/store/${storeId}`);
