import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaChevronRight } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [cartItems] = useState(3);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    const getUserRoleFromToken = (token) => {
        try {
            const decoded = jwt_decode(token);
            return decoded.role || null;
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setCategories([]);
                    return;
                }
                const res = await axios.get('http://localhost:3000/categories', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const cats = res.data.map(cat => ({
                    ...cat,
                    subcategories: cat.subcategories || [],
                }));
                setCategories(cats);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
        if (token) setUserRole(getUserRoleFromToken(token));
        else setUserRole(null);
    }, []);

    useEffect(() => {
        const handleStorage = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
            if (token) setUserRole(getUserRoleFromToken(token));
            else setUserRole(null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (showLoginModal || showSignupModal) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
    }, [showLoginModal, showSignupModal]);

    const handleMouseEnterCategory = (idx) => {
        clearTimeout(hoverTimeout);
        setActiveCategory(idx);
    };

    const handleMouseLeaveNav = () => {
        const timeout = setTimeout(() => setActiveCategory(null), 200);
        setHoverTimeout(timeout);
    };

    const handleAccountClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowLoginModal(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
        navigate('/');
    };

    return (
        <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="navbar" onMouseLeave={handleMouseLeaveNav}>
                <div className="navbar-center">
                    <div className="navbar-categories">
                        {categories.map((category, idx) => (
                            <div
                                key={category._id || category.name}
                                className="category"
                                onMouseEnter={() => handleMouseEnterCategory(idx)}
                            >
                                <button className="category-button">{category.name}</button>
                                {activeCategory === idx && category.subcategories.length > 0 && (
                                    <div className="submenu">
                                        {category.subcategories.map((sub, subIdx) => (
                                            <div key={sub._id || subIdx} className="submenu-item-container">
                                                <div className="submenu-item">
                                                    {sub.name || sub}
                                                    {sub.items && sub.items.length > 0 && (
                                                        <FaChevronRight className="submenu-arrow" />
                                                    )}
                                                </div>
                                                {sub.items && sub.items.length > 0 && (
                                                    <div className="sub-submenu">
                                                        <div className="sub-submenu-header">
                                                            <h4>{sub.name}</h4>
                                                        </div>
                                                        <div className="sub-submenu-items">
                                                            {sub.items.map((item, itemIdx) => (
                                                                <div key={itemIdx} className="sub-submenu-item">
                                                                    {item}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="navbar-logo">
                        <Link to="/">UARE COLLECTION</Link>
                    </div>
                </div>

                <div className="navbar-right">
                    {/* Dashboard button for admin */}
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
                            onClick={handleLogout}
                            style={{ cursor: 'pointer' }}
                            title="Logout"
                        >
                            <FaUser className="icon" />
                            <span className="icon-name">Logout</span>
                        </div>
                    ) : (
                        <div
                            className="icon-container account-icon"
                            onClick={handleAccountClick}
                            style={{ cursor: 'pointer' }}
                            title="Login"
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
