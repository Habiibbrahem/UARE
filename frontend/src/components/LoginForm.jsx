// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { FaLock, FaGoogle } from 'react-icons/fa';
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
                throw new Error(data.message || 'Échec de la connexion');
            }

            localStorage.setItem('token', data.access_token);
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.message || "E-mail ou mot de passe invalide");
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
                    <h1 className="auth-image-title">Bon retour sur UARE COLLECTION</h1>
                    <p className="auth-image-subtitle">
                        🔑 Connectez-vous à votre compte<br />
                        Suivez vos commandes & gérez vos achats<br />
                        Enregistrez vos favoris pour plus tard<br />
                        Profitez de recommandations personnalisées
                    </p>
                    <p className="auth-image-tagline">
                        « Chaque achat raconte votre histoire »
                    </p>
                </div>
            </div>

            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Connexion</h2>
                        <p className="auth-subtitle">
                            Entrez vos identifiants pour accéder à votre compte
                        </p>
                    </div>

                    {error && <div className="auth-message error-message">{error}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <FiMail className="form-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="Adresse e-mail"
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
                                placeholder="Mot de passe"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-options">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Se souvenir de moi</span>
                            </label>
                            <button type="button" className="forgot-password">
                                Mot de passe oublié&nbsp;?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-button primary-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Connexion en cours...' : 'Connexion'}
                        </button>

                        <div className="auth-divider">ou</div>

                        <button
                            type="button"
                            className="auth-button secondary-button"
                        >
                            <FaGoogle style={{ marginRight: '8px' }} />
                            Continuer avec Google
                        </button>

                        <div className="auth-footer">
                            Vous n’avez pas de compte&nbsp;?{' '}
                            <button
                                type="button"
                                className="auth-link"
                                onClick={handleSignupClick}
                            >
                                Inscription
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
