// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
    FaSearch,
    FaUser,
    FaChevronRight,
    FaTimes,
    FaBars,
} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import debounce from 'lodash.debounce';
import './Navbar.css';
import CartIcon from './CartIcon';

const API_BASE = 'http://localhost:3000';

export default function Navbar({ isAdmin = false }) {
    const [categories, setCategories] = useState([]);
    const [categoryTree, setCategoryTree] = useState([]);
    const [stores, setStores] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeMegaMenu, setActiveMegaMenu] = useState(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [userData, setUserData] = useState(null);
    const [storeData, setStoreData] = useState(null);

    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem('token');
    const isLoggedIn = !!token;
    const [userRole, setUserRole] = useState(null);

    const buildTree = useCallback((cats) => {
        const map = {};
        const roots = [];
        cats.forEach((c) => (map[c._id] = { ...c, children: [] }));
        cats.forEach((c) => {
            if (c.parent && map[c.parent]) {
                map[c.parent].children.push(map[c._id]);
            } else if (!c.parent) {
                roots.push(map[c._id]);
            }
        });
        return roots;
    }, []);

    const fetchData = useCallback(async () => {
        try {
            const [catRes, storeRes] = await Promise.all([
                axios.get(`${API_BASE}/categories`),
                axios.get(`${API_BASE}/stores`),
            ]);
            setCategories(catRes.data);
            setStores(storeRes.data);
        } catch (err) {
            console.error('Failed to fetch data:', err);
        }
    }, []);

    const handleScroll = useCallback(
        debounce(() => {
            setIsScrolled(window.scrollY > 10);
        }, 100),
        []
    );

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
        setSearchOpen(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUserRole(null);
        setUserData(null);
        setStoreData(null);
        navigate('/');
    };

    useEffect(() => {
        fetchData();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [fetchData, handleScroll]);

    useEffect(() => {
        setCategoryTree(buildTree(categories));
    }, [categories, buildTree]);

    useEffect(() => {
        if (!token) {
            setUserRole(null);
            return;
        }

        // decode returns { sub, email, role }
        const { sub: userId, role } = jwt_decode(token);
        setUserRole(role);

        // fetch the public /users/me (uses JWT guard)
        (async () => {
            try {
                const res = await axios.get(`${API_BASE}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUserData(res.data);

                if (['store_owner', 'store_member'].includes(role)) {
                    const storeRes = await axios.get(
                        `${API_BASE}/stores/user/${userId}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setStoreData(storeRes.data[0] || null);
                }
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setUserData(null);
                setStoreData(null);
            }
        })();
    }, [token]);

    useEffect(() => {
        // close mobile menu on route change
        setMobileMenuOpen(false);
        setActiveMegaMenu(null);
    }, [location.pathname]);

    const renderUserIndicator = () => {
        if (!isLoggedIn) return <FaUser className="icon" />;

        let text =
            userData?.name?.split(' ')[0] || userData?.email || 'My Account';
        if (userRole === 'admin') text = 'Admin';
        else if (userRole === 'store_owner')
            text = `${storeData?.name || 'Store'} Owner`;
        else if (userRole === 'store_member')
            text = `${storeData?.name || 'Store'} Member`;

        return (
            <div className="user-indicator">
                <FaUser className="icon" />
                <span className="user-role-badge">{text}</span>
            </div>
        );
    };

    return (
        <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <div className="announcement-bar" />

            <nav className="navbar">
                <button
                    className="mobile-menu-button"
                    onClick={() => setMobileMenuOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>

                <div className="navbar-left">
                    <div className="nav-items-container">
                        <div
                            className="nav-item"
                            onMouseEnter={() => setActiveMegaMenu('boutique')}
                            onMouseLeave={() => setActiveMegaMenu(null)}
                        >
                            <button className="nav-button">
                                Boutique{' '}
                                {stores.length > 0 && (
                                    <FaChevronRight className="nav-chevron" />
                                )}
                            </button>
                            {activeMegaMenu === 'boutique' && (
                                <div className="mega-menu boutique-mega">
                                    <div className="mega-menu-container">
                                        <div className="mega-menu-inner">
                                            <h2 className="mega-menu-title">Our Boutiques</h2>
                                            <div className="stores-grid">
                                                {stores.map((s) => (
                                                    <Link
                                                        key={s._id}
                                                        to={`/store/${s._id}`}
                                                        className="store-card"
                                                    >
                                                        {s.logo ? (
                                                            <img
                                                                src={s.logo}
                                                                alt={s.name}
                                                                className="store-logo"
                                                            />
                                                        ) : (
                                                            <div className="store-logo-placeholder">
                                                                {s.name.charAt(0)}
                                                            </div>
                                                        )}
                                                        <span className="store-name">{s.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {categoryTree.map((top) => (
                            <div
                                key={top._id}
                                className="nav-item"
                                onMouseEnter={() => setActiveMegaMenu(top._id)}
                                onMouseLeave={() => setActiveMegaMenu(null)}
                            >
                                <button className="nav-button">
                                    {top.name}
                                    {top.children.length > 0 && (
                                        <FaChevronRight className="nav-chevron" />
                                    )}
                                </button>
                                {activeMegaMenu === top._id && (
                                    <div className="mega-menu">
                                        <div className="mega-menu-container">
                                            <div className="mega-menu-inner">
                                                <div className="mega-menu-header">
                                                    <h2 className="mega-menu-title">{top.name}</h2>
                                                    <Link
                                                        to={`/categories/${top._id}`}
                                                        className="view-all-link"
                                                    >
                                                        View All
                                                    </Link>
                                                </div>
                                                <div className="mega-columns-container">
                                                    {top.children.map((c) => (
                                                        <div key={c._id} className="mega-col">
                                                            <h3 className="mega-col-title">
                                                                <Link to={`/categories/${c._id}`}>{c.name}</Link>
                                                            </h3>
                                                            {c.children.length > 0 ? (
                                                                <ul className="mega-links-list">
                                                                    {c.children.map((g) => (
                                                                        <li key={g._id}>
                                                                            <Link
                                                                                to={`/categories/${g._id}`}
                                                                                className="mega-link"
                                                                            >
                                                                                {g.name}
                                                                            </Link>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : (
                                                                <Link
                                                                    to={`/categories/${c._id}`}
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

                <div className="navbar-center">
                    <div className="navbar-logo">
                        <Link to="/">UARE COLLECTION</Link>
                    </div>
                </div>

                <div className="navbar-right">
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
                            onClick={() => setSearchOpen((v) => !v)}
                            aria-label="Toggle search"
                        >
                            <FaSearch />
                        </button>
                    </div>

                    <div className="account-dropdown">
                        <button className="icon-button" aria-label="Account">
                            {renderUserIndicator()}
                        </button>
                        <div className="dropdown-content">
                            {isLoggedIn ? (
                                <>
                                    <Link to="/account" className="dropdown-link">
                                        My Account
                                    </Link>
                                    <Link to="/orders" className="dropdown-link">
                                        My Orders
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-link">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="dropdown-link"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="dropdown-link"
                                    >
                                        Sign Up
                                    </button>
                                </>
                            )}
                            {userRole && (
                                <Link
                                    to={
                                        userRole === 'admin'
                                            ? '/admin'
                                            : userRole === 'store_owner'
                                                ? '/store-owner'
                                                : '/store-member'
                                    }
                                    className="dropdown-link dashboard-link"
                                >
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    <CartIcon />
                </div>
            </nav>

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
        </header>
    );
}
