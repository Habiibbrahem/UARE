// src/services/axiosInstance.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

const axiosInstance = axios.create({
    baseURL: API_BASE,
});

// Attach token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default axiosInstance;
