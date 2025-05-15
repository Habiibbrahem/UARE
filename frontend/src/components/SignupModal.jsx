import React, { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaEnvelope, FaGoogle } from 'react-icons/fa';
import './LoginModal.css'; // Reusing the same CSS

const SignupModal = ({ onClose, showLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        console.log({ name, email, password });
        onClose();
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