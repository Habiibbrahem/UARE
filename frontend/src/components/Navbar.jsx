// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import axios from 'axios';
import './Navbar.css';

const API_BASE = 'http://localhost:3000';

const RecursiveDropdown = ({ categories }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    if (!categories || categories.length === 0) return null;

    return (
        <div className="navbar-categories">
            {categories.map((cat, idx) => (
                <div
                    key={cat._id}
                    className="category"
                    onMouseEnter={() => setActiveIndex(idx)}
                    onMouseLeave={() => setActiveIndex(null)}
                >
                    <button className="category-button">
                        {cat.name}
                        {cat.children && cat.children.length > 0 && (
                            <FaChevronRight style={{ marginLeft: 6 }} />
                        )}
                    </button>

                    {activeIndex === idx && cat.children && cat.children.length > 0 && (
                        <div className="submenu">
                            <RecursiveDropdown categories={cat.children} />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [cartItems] = useState(3);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const getUserRoleFromToken = (token) => {
        try {
            const decoded = jwt_decode(token);
            return decoded.role || null;
        } catch {
            return null;
        }
    };

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = token
                ? await axios.get(`${API_BASE}/categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                : await axios.get(`${API_BASE}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
            setCategories([]);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCategories();
    }, []);

    // Re-fetch on login status change
    useEffect(() => {
        fetchCategories();
    }, [isLoggedIn]);

    // Listen for login/logout events from storage
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        setUserRole(token ? getUserRoleFromToken(token) : null);

        const onStorage = () => {
            const t = localStorage.getItem('token');
            setIsLoggedIn(!!t);
            setUserRole(t ? getUserRoleFromToken(t) : null);
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    // Navbar shadow on scroll
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    return (
        <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="navbar">
                <div className="navbar-center">
                    {location.pathname === '/' ? (
                        categories.length ? (
                            <RecursiveDropdown categories={categories} />
                        ) : (
                            <div>No Categories Available</div>
                        )
                    ) : null}

                    <div className="navbar-logo">
                        <Link to="/">UARE COLLECTION</Link>
                    </div>
                </div>

                <div className="navbar-right">
                    {userRole === 'admin' && (
                        <button
                            className="dashboard-button"
                            onClick={() => navigate('/admin')}
                            title="Admin Dashboard"
                        >
                            Dashboard
                        </button>
                    )}

                    <div
                        className="icon-container search-icon-container"
                        title="Search"
                        onClick={() => alert('Search clicked!')}
                    >
                        <FaSearch className="icon" />
                        <span className="icon-name">Search</span>
                    </div>

                    {isLoggedIn ? (
                        <div
                            className="icon-container account-icon"
                            title="Logout"
                            onClick={handleLogout}
                        >
                            <FaUser className="icon" />
                            <span className="icon-name">Logout</span>
                        </div>
                    ) : (
                        <div
                            className="icon-container account-icon"
                            title="Login"
                            onClick={() => setShowLoginModal(true)}
                        >
                            <FaUser className="icon" />
                            <span className="icon-name">Mon Compte</span>
                        </div>
                    )}

                    <div className="icon-container">
                        <FaShoppingBag className="icon" />
                        {cartItems > 0 && <span className="cart-count">{cartItems}</span>}
                        <span className="icon-name">Mon Panier</span>
                    </div>
                </div>
            </nav>

            {showLoginModal && (
                <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <LoginModal
                            onClose={() => setShowLoginModal(false)}
                            showSignup={() => {
                                setShowLoginModal(false);
                                setShowSignupModal(true);
                            }}
                        />
                    </div>
                </div>
            )}

            {showSignupModal && (
                <div className="modal-overlay" onClick={() => setShowSignupModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <SignupModal
                            onClose={() => setShowSignupModal(false)}
                            showLogin={() => {
                                setShowSignupModal(false);
                                setShowLoginModal(true);
                            }}
                        />
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
