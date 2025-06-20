// src/services/productService.js
import axiosInstance from './axiosInstance';

// Fetch all products for a given store
export const getProductsByStore = (storeId) =>
    axiosInstance.get(`/products/store/${storeId}`);

// Fetch products by category
export const getProductsByCategory = (categoryId) =>
    axiosInstance.get(`/products/category/${categoryId}`);   // ← new

// Fetch a single product by its ID
export const getProductById = (productId) =>
    axiosInstance.get(`/products/${productId}`);

// Create new product (expects FormData)
export const createProduct = (formData) =>
    axiosInstance.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

// Update existing product (expects FormData)
export const updateProduct = (id, formData) =>
    axiosInstance.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

// Delete a product by id
export const deleteProduct = (id) =>
    axiosInstance.delete(`/products/${id}`);

// Search products
export const searchProducts = (q) =>
    axiosInstance.get(`/products/search?q=${encodeURIComponent(q)}`);
