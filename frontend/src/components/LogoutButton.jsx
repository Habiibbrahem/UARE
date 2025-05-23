import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/'); // Redirect to home page after logout
    };

    return (
        <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
            Logout
        </button>
    );
}
