// src/components/SignupModal.jsx

import React, { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaEnvelope, FaGoogle } from 'react-icons/fa';
import './LoginModal.css'; // Reusing the same CSS

const SignupModal = ({ onClose, showLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (password !== confirmPassword) {
            setError("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: 'customer', // ← send lowercase here
                }),
            });

            if (!response.ok) {
                const errData = await response.json();
                setError(errData.message || 'Failed to register');
                return;
            }

            setSuccessMsg('Registration successful! Please log in.');
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // After a brief delay, close this modal and show the login modal:
            setTimeout(() => {
                onClose();
                showLogin();
            }, 1500);
        } catch {
            setError('Registration failed. Try again.');
        }
    };

    return (
        <div className="login-modal-content">
            <button className="close-button" onClick={onClose}>
                <FaTimes />
            </button>

            <div className="modal-header">
                <FaUser className="user-icon" />
                <h2>Create Your Account</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FaUser className="input-icon" />
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <FaEnvelope className="input-icon" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <FaLock className="input-icon" />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="login-button">
                    Sign Up
                </button>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMsg && <p style={{ color: 'green' }}>{successMsg}</p>}

                <div className="divider">
                    <span>OR</span>
                </div>

                <button type="button" className="google-button">
                    <FaGoogle /> Continue with Google
                </button>

                <p className="signup-text">
                    Already have an account?
                    <button
                        type="button"
                        className="text-link"
                        onClick={() => {
                            onClose();
                            showLogin();
                        }}
                    >
                        Log in
                    </button>
                </p>
            </form>
        </div>
    );
};

export default SignupModal;
