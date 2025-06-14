import React, { useState } from 'react';
import { FaLock, FaGoogle } from 'react-icons/fa';
import { FiMail, FiUser } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import '../styles/authForms.css';

const SignupForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'customer'
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess('Account created successfully! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    return (
        <div className="auth-container">
            <div className="auth-image-section">
                <div className="auth-image-content">
                    <h1 className="auth-image-title">Join Us</h1>
                    <p className="auth-image-subtitle">
                        🌟 Join Our Community
                        <br />Create your free account to:
                        <br />✓ Get personalized recommendations
                        <br />✓ Save your wishlists & order history
                        ✓ Enjoy faster checkout & exclusive deals                      </p>
                    <p className="auth-image-tagline">
                        "Your perfect finds are just an account away"


                    </p>
                </div>
            </div>

            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Create Account</h2>
                        <p className="auth-subtitle">Fill in your details to get started</p>
                    </div>

                    {error && <div className="auth-message error-message">{error}</div>}
                    {success && <div className="auth-message success-message">{success}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <FiUser className="form-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <FiMail className="form-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Email Address"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <FaLock className="form-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Password (min 6 characters)"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <FaLock className="form-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button primary-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating account...' : 'Sign Up'}
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
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="auth-link"
                                onClick={handleLoginClick}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;