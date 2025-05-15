import React, { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaGoogle } from 'react-icons/fa';
import './LoginModal.css';

const LoginModal = ({ onClose, showSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, password });
        onClose();
    };

    return (
        <div className="login-modal-content">
            <button className="close-button" onClick={onClose}>
                <FaTimes />
            </button>

            <div className="modal-header">
                <FaUser className="user-icon" />
                <h2>Login to Your Account</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <FaUser className="input-icon" />
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

                <div className="options">
                    <label>
                        <input type="checkbox" /> Remember me
                    </label>
                    <a href="/forgot-password">Forgot password?</a>
                </div>

                <button type="submit" className="login-button">
                    Login
                </button>

                <div className="divider">
                    <span>OR</span>
                </div>

                <button type="button" className="google-button">
                    <FaGoogle /> Continue with Google
                </button>

                <p className="signup-text">
                    Don't have an account?
                    <button
                        type="button"
                        className="text-link"
                        onClick={() => {
                            onClose();
                            showSignup();
                        }}
                    >
                        Sign up
                    </button>
                </p>
            </form>
        </div>
    );
};

export default LoginModal;