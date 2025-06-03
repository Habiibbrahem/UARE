import React, { useState, useEffect, useCallback } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaChevronRight, FaTimes, FaBars } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './Navbar.css';

import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import CartIcon from './CartIcon';

const API_BASE = 'http://localhost:3000';

const Navbar = () => {
    // State management (same as before)
    const [categories, setCategories] = useState([]);
    const [categoryTree, setCategoryTree] = useState([]);
    const [stores, setStores] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    // User authentication state
    const token = localStorage.getItem('token');
    const [userRole, setUserRole] = useState(null);
    const isLoggedIn = !!token;

    // Build category tree (same as before)
    const buildTree = useCallback((categories) => {
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
    }, []);

    // Fetch data (same as before)
    const fetchData = useCallback(async () => {
        try {
            const [categoriesRes, storesRes] = await Promise.all([
                axios.get(`${API_BASE}/categories`),
                axios.get(`${API_BASE}/stores`)
            ]);
            setCategories(categoriesRes.data);
            setStores(storesRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
    }, []);

    // Handle scroll effect (same as before)
    const handleScroll = useCallback(debounce(() => {
        setIsScrolled(window.scrollY > 10);
    }, 100), []);

    // Handle search (same as before)
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    // Handle logout (same as before)
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        navigate('/');
    };

    // Effects (same as before)
    useEffect(() => {
        fetchData();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchData, handleScroll]);

    useEffect(() => {
        setCategoryTree(buildTree(categories));
    }, [categories, buildTree]);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUserRole(decoded.role);
            } catch {
                setUserRole(null);
            }
        }
    }, [token]);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        setActiveMegaMenu(null);
    }, [location.pathname]);

    return (
        <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            {/* Top Announcement Bar */}
            <div className="announcement-bar">
                Free shipping on orders over $50 | Use code WELCOME10 for 10% off
            </div>

            <nav className="navbar">
                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Left Side - Categories */}
                <div className="navbar-left">
                    <div className="nav-items-container">
                        {/* Boutique Mega Menu */}
                        <div
                            className="nav-item"
                            onMouseEnter={() => setActiveMegaMenu('boutique')}
                            onMouseLeave={() => setActiveMegaMenu(null)}
                        >
                            <button className="nav-button">
                                Boutique {stores.length > 0 && <FaChevronRight className="nav-chevron" />}
                            </button>
                            {activeMegaMenu === 'boutique' && (
                                <div className="mega-menu boutique-mega">
                                    <div className="mega-menu-container">
                                        <div className="mega-menu-inner">
                                            <h2 className="mega-menu-title">Our Boutiques</h2>
                                            <div className="stores-grid">
                                                {stores.map((store) => (
                                                    <Link
                                                        key={store._id}
                                                        to={`/store/${store._id}`}
                                                        className="store-card"
                                                    >
                                                        {store.logo ? (
                                                            <img src={store.logo} alt={store.name} className="store-logo" />
                                                        ) : (
                                                            <div className="store-logo-placeholder">{store.name.charAt(0)}</div>
                                                        )}
                                                        <span className="store-name">{store.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Category Mega Menus */}
                        {categoryTree.map((topCat) => (
                            <div
                                key={topCat._id}
                                className="nav-item"
                                onMouseEnter={() => setActiveMegaMenu(topCat._id)}
                                onMouseLeave={() => setActiveMegaMenu(null)}
                            >
                                <button className="nav-button">
                                    {topCat.name}
                                    {topCat.children.length > 0 && <FaChevronRight className="nav-chevron" />}
                                </button>
                                {activeMegaMenu === topCat._id && (
                                    <div className="mega-menu">
                                        <div className="mega-menu-container">
                                            <div className="mega-menu-inner">
                                                <div className="mega-menu-header">
                                                    <h2 className="mega-menu-title">{topCat.name}</h2>
                                                    <Link
                                                        to={`/categories/${topCat._id}`}
                                                        className="view-all-link"
                                                    >
                                                        View All
                                                    </Link>
                                                </div>
                                                <div className="mega-columns-container">
                                                    {topCat.children.map((childCat) => (
                                                        <div key={childCat._id} className="mega-col">
                                                            <h3 className="mega-col-title">
                                                                <Link to={`/categories/${childCat._id}`}>
                                                                    {childCat.name}
                                                                </Link>
                                                            </h3>
                                                            {childCat.children.length > 0 ? (
                                                                <ul className="mega-links-list">
                                                                    {childCat.children.map((grand) => (
                                                                        <li key={grand._id}>
                                                                            <Link
                                                                                to={`/categories/${grand._id}`}
                                                                                className="mega-link"
                                                                            >
                                                                                {grand.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <Link
                                                                    to={`/categories/${childCat._id}`}
                                                                    className="mega-link see-all"
                                                                >
                                                                    Shop All
                                                                </Link>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center - Logo */}
                <div className="navbar-center">
                    <div className="navbar-logo">
                        <Link to="/">UARE COLLECTION</Link>
                    </div>
                </div>

                {/* Right Side - Search, Account, Cart */}
                <div className="navbar-right">
                    {/* Search - Toggleable on mobile */}
                    <div className={`search-container ${searchOpen ? 'search-open' : ''}`}>
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <button type="submit" className="search-submit">
                                <FaSearch />
                            </button>
                        </form>
                        <button
                            className="search-toggle mobile-only"
                            onClick={() => setSearchOpen(!searchOpen)}
                            aria-label="Toggle search"
                        >
                            <FaSearch />
                        </button>
                    </div>

                    {/* User Account */}
                    <div className="account-dropdown">
                        <button className="icon-button" aria-label="Account">
                            <FaUser />
                        </button>
                        <div className="dropdown-content">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/account" className="dropdown-link">My Account</Link>
                                    <Link to="/orders" className="dropdown-link">My Orders</Link>
                                    <button onClick={handleLogout} className="dropdown-link">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setShowLoginModal(true)}
                                        className="dropdown-link"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => setShowSignupModal(true)}
                                        className="dropdown-link"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                            {userRole && (
                                <Link
                                    to={
                                        userRole === 'admin' ? '/admin' :
                                            userRole === 'store_owner' ? '/store-owner' :
                                                '/store-member'
                                    }
                                    className="dropdown-link dashboard-link"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Cart */}
                    <CartIcon />
                </div>
            </nav>

            {/* Mobile Search - Appears below navbar */}
            {mobileMenuOpen && (
                <div className="mobile-search-container">
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                        />
                        <button type="submit" className="search-submit">
                            <FaSearch />
                        </button>
                    </form>
                </div>
            )}

            {/* Modals */}
            {showLoginModal && (
                <LoginModal
                    onClose={() => setShowLoginModal(false)}
                    showSignup={() => {
                        setShowLoginModal(false);
                        setShowSignupModal(true);
                    }}
                />
            )}

            {showSignupModal && (
                <SignupModal
                    onClose={() => setShowSignupModal(false)}
                    showLogin={() => {
                        setShowSignupModal(false);
                        setShowLoginModal(true);
                    }}
                />
            )}
        </header>
    );
};

export default Navbar;