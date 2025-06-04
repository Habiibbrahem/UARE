import React, { useState } from 'react';
import { FaUser, FaLock, FaGoogle } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/authForms.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            localStorage.setItem('token', data.access_token);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <div className="auth-container">
            <div className="auth-image-section">
                <div className="auth-image-content">
                    <h1 className="auth-image-title">Welcome Back</h1>
                    <p className="auth-image-subtitle">
                        Login to access your personalized dashboard and continue your journey with us.
                    </p>
                    <p className="auth-image-tagline">
                        Capturing Moments, Creating Memories
                    </p>
                </div>
            </div>

            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Sign In</h2>
                        <p className="auth-subtitle">Enter your credentials to access your account</p>
                    </div>

                    {error && <div className="auth-message error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <FiMail className="form-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <FaLock className="form-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <button type="button" className="forgot-password">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-button primary-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Sign In'}
                        </button>

                        <div className="auth-divider">or</div>

                        <button
                            type="button"
                            className="auth-button secondary-button"
                        >
                            <FaGoogle style={{ marginRight: '8px' }} />
                            Continue with Google
                        </button>

                        <div className="auth-footer">
                            Don't have an account?{' '}
                            <button
                                type="button"
                                className="auth-link"
                                onClick={handleSignupClick}
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;