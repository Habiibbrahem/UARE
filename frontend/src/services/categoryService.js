// src/services/categoryService.js
import axiosInstance from './axiosInstance';

/**
 * Fetch a single category by ID
 * @param {string} categoryId
 * @returns {Promise}
 */
export function getCategoryById(categoryId) {
    return axiosInstance.get(`/categories/${categoryId}`);
}
