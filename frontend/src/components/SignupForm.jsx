// src/components/SignupForm.jsx
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
        setSuccess('');
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
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
                throw new Error(data.message || "Échec de l'inscription");
            }

            setSuccess('Compte créé avec succès ! Redirection vers la connexion...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.message || "Échec de l'inscription. Veuillez réessayer.");
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
                    <h1 className="auth-image-title">Rejoignez-nous</h1>
                    <p className="auth-image-subtitle">
                        🌟 Rejoignez notre communauté<br />
                        Créez votre compte gratuit pour :
                        <br />✓ Recevoir des recommandations personnalisées
                        <br />✓ Sauvegarder vos listes de souhaits et historique de commandes
                        <br />✓ Profiter d’un paiement plus rapide et d’offres exclusives
                    </p>
                    <p className="auth-image-tagline">
                        « Vos trouvailles parfaites sont à un compte près »
                    </p>
                </div>
            </div>

            <div className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-header">
                        <h2 className="auth-title">Créer un compte</h2>
                        <p className="auth-subtitle">
                            Remplissez vos informations pour commencer
                        </p>
                    </div>

                    {error && <div className="auth-message error-message">{error}</div>}
                    {success && <div className="auth-message success-message">{success}</div>}

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <FiUser className="form-icon" />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Nom complet"
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
                                placeholder="Adresse e-mail"
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
                                placeholder="Mot de passe (min 6 caractères)"
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
                                placeholder="Confirmez le mot de passe"
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
                            {isLoading ? 'Création en cours...' : 'S’inscrire'}
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
                            Vous avez déjà un compte ?{' '}
                            <button
                                type="button"
                                className="auth-link"
                                onClick={handleLoginClick}
                            >
                                Connexion
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;