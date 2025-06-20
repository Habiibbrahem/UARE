// src/api/userService.js
import axiosInstance from '../services/axiosInstance';

export const getCurrentUser = () =>
    axiosInstance.get('/users/me');

export const updateCurrentUser = ({ email, currentPassword, newPassword, confirmPassword }) =>
    axiosInstance.put('/users/me', {
        email,
        currentPassword,
        newPassword,
        confirmPassword,
    });

export const deleteCurrentUser = (currentPassword) =>
    axiosInstance.delete('/users/me', { data: { currentPassword } });

// (keep createUser for admin/store-owner panels)
export const createUser = (userData) =>
    axiosInstance.post('/users', userData);
