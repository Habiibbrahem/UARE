import React from 'react';
import './ServiceInfoSection.css';

const ServiceInfoSection = () => {
    const services = [
        {
            title: "LIVRAISON RAPIDE",
            description: "de 2 à 5 jours ouvrables"
        },
        {
            title: "RETOUR GRATUIT",
            description: "jusqu'à 10 jours"
        },
        {
            title: "100% AUTHENTIQUES",
            description: "satisfait ou remboursé"
        },
        {
            title: "SERVICE CLIENT",
            description: "de 8:30h à 14h00"
        }
    ];

    return (
        <div className="service-info-section">
            <div className="divider-line"></div>
            <div className="services-container">
                {services.map((service, index) => (
                    <div key={index} className="service-card">
                        <h3 className="service-title">{service.title}</h3>
                        <p className="service-description">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ServiceInfoSection;