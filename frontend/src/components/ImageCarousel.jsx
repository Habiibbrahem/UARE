import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';

const ImageCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            image: '/images/carousel1.jpg',
            title: 'New Collection',
            text: 'Discover our latest arrivals for the season',
            button: 'Shop Now'
        },
        {
            image: '/images/carousel2.jpg',
            title: 'Summer Sale',
            text: 'Up to 50% off selected items',
            button: 'View Deals'
        },
        {
            image: '/images/carousel3.jpg',
            title: 'Premium Styles',
            text: 'Elevate your wardrobe with luxury pieces',
            button: 'Explore'
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
                            alt={`Slide ${index + 1}`}
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