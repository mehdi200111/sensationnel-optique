// File: StorePage.jsx
import React from 'react';

const StorePage = () => {
  return (
    <div
      style={{
        padding: '16px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#FAFAFA',
        minHeight: '100vh',
        marginTop: '70px'
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#0E0E0E' }}>
          Point De Vente
        </h1>
        <p style={{ fontSize: '16px', color: '#6B6B6B', marginTop: '6px' }}>
          Votre magasin à Casablanca
        </p>
      </div>

      {/* Image du magasin */}
      <div
        style={{
          width: '100%',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
          marginBottom: '20px',
        }}
      >
        <img
          src="https://res.cloudinary.com/dhpaxqja8/image/upload/v1769622447/IMG_7158_tnv1j2.jpg" // Remplace cette image plus tard
          alt="Sensationnel Optique - Magasin"
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </div>

      {/* Adresse et description */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 6px 16px rgba(0,0,0,0.05)',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', marginLeft: '35%' }}>
          Adresse
        </h2>
        <p style={{ fontSize: '16px', color: '#333333', marginBottom: '12px' }}>
          Residence Belles Mehdia Salam Immeuble E Magasin 5 Anassi Casablanca, Maroc
        </p>
        <p style={{ fontSize: '14px', color: '#6B6B6B', lineHeight: '1.5' }}>
          Chez Sensationnel Optique, nous vous proposons une large gamme de lunettes
          solaires et optiques de qualité. Nos experts sont à votre disposition pour vous
          conseiller.
        </p>
      </div>

      {/* Bouton Google Maps */}
      <div style={{ textAlign: 'center' }}>
        <a
          href="https://share.google/SCiVztSMbWfwXG8gf" // Remplace par ton lien
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#0E0E0E',
            color: '#FFFFFF',
            borderRadius: '12px',
            fontWeight: '700',
            textDecoration: 'none',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            transition: 'all 0.3s ease',
          }}
        >
          Voir la localisation
        </a>
      </div>

      {/* Options supplémentaires (si tu veux) */}
      <div
        style={{
          marginTop: '30px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6B6B6B',
          lineHeight: '1.6',
        }}
      >
        <p>📞 Contactez-nous : +212 6 91 95 55 69</p>
        <p>⏰ Horaires : Lundi - Samedi : 9h - 20h</p>
      </div>
    </div>
  );
};

export default StorePage;
