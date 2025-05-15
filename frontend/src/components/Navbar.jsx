import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaChevronRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import './Navbar.css';

const Navbar = () => {
    const [activeCategory, setActiveCategory] = useState(null);
    const [hoverTimeout, setHoverTimeout] = useState(null);
    const [cartItems] = useState(3);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const categories = [
        {
            name: 'FEMME',
            subcategories: [
                {
                    name: 'Vêtements',
                    items: [
                        'Manteaux & Doudounes', 'Vestes & Blazers', 'Robes & Combinaisons',
                        'Chemises & Blouses', 'Kimonos', 'Pulls & Cardigans', 'Sweats & Gilets',
                        'Tops & T-shirts', 'Pantalons', 'Jeans', 'Joggings & Leggings',
                        'Jupes & Shorts', 'Vêtements de Sport', 'Sous-vêtements & Lingerie',
                        'Pyjamas', 'Maillots de Bain'
                    ]
                },
                {
                    name: 'Chaussures',
                    items: [
                        'Chaussures de ville', 'Sneakers', 'Bottes & Bottines',
                        'Escarpins', 'Sandales', 'Mules & Tongs'
                    ]
                },
                {
                    name: 'Accessoires',
                    items: [
                        'Lunettes', 'Casquettes', 'Bagagerie', 'Parfums',
                        'Ceintures', 'Chaussettes', 'Portefeuilles', 'Beauté'
                    ]
                }
            ]
        },
        {
            name: 'HOMME',
            subcategories: [
                {
                    name: 'Vêtements',
                    items: [
                        'Manteaux & Doudounes', 'Vestes & Blazers', 'Pulls & Gilets',
                        'Chemises', 'T-Shirts & Polos', 'Kimonos', 'Sweats', 'Pantalons',
                        'Jeans', 'Joggings & Leggings', 'Shorts & Bermudas',
                        'Vêtements de Sport', 'Maillots de Bain', 'Sous-vêtements & Pyjamas'
                    ]
                },
                {
                    name: 'Chaussures',
                    items: [
                        'Bottes & Bottines', 'Chaussures de ville', 'Sneakers',
                        'Sandales', 'Mules & Tongs'
                    ]
                },
                {
                    name: 'Accessoires',
                    items: [
                        'Lunettes', 'Casquettes', 'Bagagerie', 'Parfums',
                        'Ceintures', 'Chaussettes', 'Portefeuilles', 'Beauté'
                    ]
                }
            ]
        },
        {
            name: 'ENFANT',
            subcategories: [
                {
                    name: 'Vêtements Fille',
                    items: [
                        'Manteaux & Blousons', 'Sweats & Gilets', 'Robes & Combinaisons',
                        'Tops & T-shirts', 'Chemises & Blouses', 'Jeans & Pantalons',
                        'Jupes & Shorts', 'Chaussettes'
                    ]
                },
                {
                    name: 'Vêtements Garçon',
                    items: [
                        'Manteaux & Blousons', 'Sweats & Gilets', 'Combinaisons',
                        'T-Shirts & Polos', 'Chemises & Blouses', 'Jeans & Pantalons',
                        'Shorts & Bermudas', 'Chaussettes'
                    ]
                },
                {
                    name: 'Chaussures',
                    items: [
                        'Chaussures Fille', 'Chaussures Garçon', 'Sneakers Fille',
                        'Sneakers Garçon', 'Bottes & Bottines'
                    ]
                }
            ]
        },
        {
            name: 'BOUTIQUE',
            subcategories: ['Nouveautés', 'Promotions', 'Accessoires']
        },
        {
            name: 'SOLDE',
            subcategories: ['Réductions', 'Vente privée']
        }
    ];

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

    return (
        <header className={`navbar-container ${isScrolled ? 'scrolled' : ''}`}>
            <nav className="navbar" onMouseLeave={handleMouseLeaveNav}>
                <div className="navbar-left">
                    <FaSearch className="search-icon" />
                </div>

                <div className="navbar-center">
                    <div className="navbar-categories">
                        {categories.slice(0, 3).map((category, idx) => (
                            <div key={category.name} className="category" onMouseEnter={() => handleMouseEnterCategory(idx)}>
                                <button className="category-button">{category.name}</button>
                                {activeCategory === idx && (
                                    <div className="submenu">
                                        {category.subcategories.map((sub, subIdx) => (
                                            <div key={subIdx} className="submenu-item-container">
                                                <div className="submenu-item">
                                                    {typeof sub === 'string' ? sub : sub.name}
                                                    {typeof sub === 'object' && <FaChevronRight className="submenu-arrow" />}
                                                </div>
                                                {typeof sub === 'object' && (
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

                    <div className="navbar-categories">
                        {categories.slice(3).map((category, idx) => (
                            <div key={category.name} className="category" onMouseEnter={() => handleMouseEnterCategory(idx + 3)}>
                                <button className="category-button">{category.name}</button>
                                {activeCategory === idx + 3 && (
                                    <div className="submenu">
                                        {category.subcategories.map((sub, subIdx) => (
                                            <div key={subIdx} className="submenu-item">
                                                {typeof sub === 'string' ? sub : sub.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="navbar-right">
                    <div className="icon-container account-icon" onClick={handleAccountClick}>
                        <FaUser className="icon" />
                        <span className="icon-name">Mon Compte</span>
                    </div>
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