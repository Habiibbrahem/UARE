// src/api/userService.js
import axios from 'axios';

const API_BASE = 'http://localhost:3000';

export const createUser = (userData, token) => {
    return axios.post(
        `${API_BASE}/users`,
        userData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};