// src/services/productService.js
import axiosInstance from './axiosInstance';

// override create/update to expect FormData
export const getProductsByStore = (storeId) =>
    axiosInstance.get(`/products/store/${storeId}`);

export const createProduct = (formData) =>
    axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const updateProduct = (id, formData) =>
    axiosInstance.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const deleteProduct = (id) => axiosInstance.delete(`/products/${id}`);
