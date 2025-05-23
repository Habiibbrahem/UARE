import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // your backend base URL

export const getCategories = () => {
    return axios.get(`${API_BASE}/categories`);
};

export const getSubcategories = () => {
    return axios.get(`${API_BASE}/subcategories`);
};
