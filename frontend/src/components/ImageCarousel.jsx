// src/components/ImageCarousel.jsx
import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            image: '/images/carousel1.jpg',
            title: 'Nouvelle Collection',
            text: 'Découvrez nos dernières nouveautés de la saison',
            button: 'Voir la collection'
        },
        {
            image: '/images/carousel2.jpg',
            title: 'Soldes d’été',
            text: "Jusqu'à 50 % de réduction sur une sélection",
            button: 'Voir les offres'
        },
        {
            image: '/images/carousel3.jpg',
            title: 'Styles Premium',
            text: 'Sublimez votre garde-robe avec des pièces de luxe',
            button: 'Explorer'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="edge-to-edge-carousel">
            <div className="carousel-track">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentIndex ? 'active' : ''}`}
                    >
                        <img
                            src={slide.image}
                            alt={`Diapositive ${index + 1}`}
                            className="carousel-image"
                        />
                        <div className="slide-content">
                            <h2 className="slide-title">{slide.title}</h2>
                            <p className="slide-text">{slide.text}</p>
                            <button className="slide-button">
                                {slide.button}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImageCarousel;
