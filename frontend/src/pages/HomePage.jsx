import React from 'react';
import Navbar from '../components/Navbar';
import ImageCarousel from '../components/ImageCarousel';
import {
    FaTruck,
    FaUndo,
    FaCheckCircle,
    FaHeadset
} from 'react-icons/fa';
import '../components/Navbar.css';
import '../components/ImageCarousel.css';
import './HomePage.css';

const HomePage = () => {
    const categories = [
        { name: "Chaussures, vêtements et accessoires", subtext: "Plus de catégories" },
        { name: "Mode, beauté, luxe et plus" },
        // Main categories
        "Manteaux", "Doudounes", "Sweats", "Gilets",
        "Chemises", "Blouses", "Robes", "Combinaisons",
        "Jeans", "Sport", "Pyjamas", "Vestes",
        "Blazers", "Pulls", "Cardigans", "Tops",
        "T-Shirts", "Polos", "Pantalons", "Jupes",
        "Shorts", "Sous-vêtements", "Maillots de Bain",
        // Footwear
        "Chaussures", "Sneakers", "Bottes", "Bottines",
        "Escarpins", "Sandales", "Mules", "Tongs",
        // Accessories
        "Lunettes", "Montres", "Sacs", "Pochettes",
        "Casquettes", "Bagagerie"
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