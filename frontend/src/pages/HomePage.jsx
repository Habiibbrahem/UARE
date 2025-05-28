import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ImageCarousel from '../components/ImageCarousel';
import {
    FaTruck,
    FaUndo,
    FaCheckCircle,
    FaHeadset
} from 'react-icons/fa';
import axios from 'axios';
import '../components/Navbar.css';
import '../components/ImageCarousel.css';
import './HomePage.css';

const API_BASE = 'http://localhost:3000';

const HomePage = () => {
    const [subSubCategories, setSubSubCategories] = useState([]);

    const categories = [
        { name: "Chaussures, vêtements et accessoires", subtext: "Plus de catégories" },
        { name: "Mode, beauté, luxe et plus" },
        // Removed hardcoded sub-subcategories here!
    ];

    const services = [
        {
            icon: <FaTruck className="service-icon" />,
            title: "LIVRAISON RAPIDE",
            description: "de 2 à 5 jours ouvrables"
        },
        {
            icon: <FaUndo className="service-icon" />,
            title: "RETOUR GRATUIT",
            description: "jusqu'à 10 jours"
        },
        {
            icon: <FaCheckCircle className="service-icon" />,
            title: "100% AUTHENTIQUES",
            description: "satisfait ou remboursé"
        },
        {
            icon: <FaHeadset className="service-icon" />,
            title: "SERVICE CLIENT",
            description: "de 8:30h à 14h00"
        }
    ];

    useEffect(() => {
        // Fetch all categories and filter sub-subcategories (depth = 2)
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE}/categories`);
                const categories = res.data;

                // Filter sub-subcategories: categories with a parent that also has a parent
                const subSubs = categories.filter(cat => {
                    if (!cat.parent) return false;
                    // Find parent category
                    const parentCat = categories.find(c => c._id === cat.parent);
                    return parentCat && parentCat.parent !== null;
                });

                setSubSubCategories(subSubs);
            } catch (err) {
                console.error('Failed to fetch categories:', err);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="home-page">
            <Navbar />
            <main className="home-main">
                <ImageCarousel />
                <section className="categories-section">
                    <div className="categories-container">
                        {categories.map((category, index) => (
                            typeof category === 'object' ? (
                                <div key={index} className="category-header">
                                    <h3>{category.name}</h3>
                                    {category.subtext && <p>{category.subtext}</p>}
                                </div>
                            ) : (
                                <div key={index} className="category-item">
                                    {category}
                                </div>
                            )
                        ))}
                    </div>
                </section>

                {/* New Sub-subcategories Section */}
                <section className="subsubcategories-section">
                    <h2>Nos Articles</h2>
                    {subSubCategories.length === 0 ? (
                        <p>Aucune sous-sous-catégorie disponible.</p>
                    ) : (
                        <ul>
                            {subSubCategories.map(cat => (
                                <li key={cat._id}>{cat.name}</li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="services-section">
                    <div className="divider-line"></div>
                    <div className="services-container">
                        {services.map((service, index) => (
                            <div key={index} className="service-card">
                                <div className="service-icon-container">
                                    {service.icon}
                                </div>
                                <h3 className="service-title">{service.title}</h3>
                                <p className="service-description">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
