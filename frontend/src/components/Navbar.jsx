// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import './Navbar.css';

import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import CartIcon from './CartIcon';                // ← NEW: import CartIcon

const API_BASE = 'http://localhost:3000';

// Utility to build a tree from a flat list
const buildTree = (categories) => {
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
        map[cat._id] = { ...cat, children: [] };
    });

    categories.forEach((cat) => {
        if (cat.parent) {
            if (map[cat.parent]) {
                map[cat.parent].children.push(map[cat._id]);
            } else {
                roots.push(map[cat._id]);
            }
        } else {
            roots.push(map[cat._id]);
        }
    });

    return roots;
};

// Recursive dropdown component
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
                        {cat.children.length > 0 && <FaChevronRight style={{ marginLeft: 6 }} />}
                    </button>
                    {activeIndex === idx && cat.children.length > 0 && (
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
    const [categoryTree, setCategoryTree] = useState([]);
    const [stores, setStores] = useState([]);
    const [boutiqueOpen, setBoutiqueOpen] = useState(false);
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

    // Fetch categories
    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${API_BASE}/categories`);
            setCategories(res.data);
        } catch (err) {
            console.error('Failed to fetch categories:', err);
        }
    };

    // Fetch stores for Boutique
    const fetchStores = async () => {
        try {
            const res = await axios.get(`${API_BASE}/stores`);
            setStores(res.data);
        } catch (err) {
            console.error('Failed to fetch stores:', err);
        }
    };

    useEffect(() => {
        fetchCategories();
        fetchStores();
    }, []);

    useEffect(() => {
        setCategoryTree(buildTree(categories));
    }, [categories]);

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
                    {location.pathname === '/' && (
                        <>
                            {/* Boutique dropdown */}
                            <div
                                className="category"
                                onMouseEnter={() => setBoutiqueOpen(true)}
                                onMouseLeave={() => setBoutiqueOpen(false)}
                            >
                                <button className="category-button">
                                    Boutique <FaChevronRight style={{ marginLeft: 6 }} />
                                </button>
                                {boutiqueOpen && (
                                    <div className="submenu">
                                        {stores.map((store) => (
                                            <div key={store._id} className="submenu-item-container">
                                                <Link to={`/store/${store._id}`}>{store.name}</Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Category dropdown */}
                            {categoryTree.length ? (
                                <RecursiveDropdown categories={categoryTree} />
                            ) : (
                                <div>No Categories Available</div>
                            )}
                        </>
                    )}

                    <div className="navbar-logo">
                        <Link to="/">UARE COLLECTION</Link>
                    </div>
                </div>

                <div className="navbar-right">
                    {userRole === 'admin' && (
                        <button
                            className="dashboard-button"
                            onClick={() => navigate('/admin')}
                        >
                            Dashboard
                        </button>
                    )}
                    {userRole === 'store_owner' && (
                        <button
                            className="dashboard-button"
                            onClick={() => navigate('/store-owner')}
                        >
                            Dashboard
                        </button>
                    )}
                    {userRole === 'store_member' && (
                        <button
                            className="dashboard-button"
                            onClick={() => navigate('/store-member')}
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

                    {/* CartIcon shows live cart count and navigates to /cart */}
                    <CartIcon />

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
