import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const FooterMobile = () => {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        padding: '30px 16px',
        borderTop: '1px solid rgba(230, 211, 163, 0.2)',
        textAlign: 'center',
        fontSize: '0.9rem',
        color: '#0c0c0c',
        marginTop: '40px',
      }}
    >
      {/* ===== NEWSLETTER ===== */}
      <div
        style={{
          marginBottom: '30px',
          padding: '25px 20px',
          backgroundColor: 'rgba(230, 211, 163, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(230, 211, 163, 0.3)',
          boxShadow: '0 2px 8px rgba(230, 211, 163, 0.2)',
        }}
      >
        <h3
          style={{
            fontSize: '1.3rem',
            fontWeight: '700',
            marginBottom: '8px',
            color: '#0c0c0c',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Rejoignez notre newsletter
        </h3>
        <p
          style={{
            fontSize: '0.9rem',
            marginBottom: '18px',
            color: '#333333',
            lineHeight: '1.4',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
          }}
        >
          Recevez nos dernières offres et nouveautés directement dans votre boîte mail
        </p>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            maxWidth: '320px',
            margin: '0 auto',
          }}
        >
          <input
            type="email"
            placeholder="Votre email"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid rgba(230, 211, 163, 0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box',
              backgroundColor: '#FFFFFF',
              color: '#0c0c0c',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#E6D3A3';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(230, 211, 163, 0.3)';
            }}
          />
          <button
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#E6D3A3',
              color: '#000000',
              border: '1px solid rgba(230, 211, 163, 0.3)',
              borderRadius: '8px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              transition: 'all 0.2s ease',
              boxSizing: 'border-box',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#d4c3a3';
              e.target.style.borderColor = '#E6D3A3';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#E6D3A3';
              e.target.style.borderColor = 'rgba(230, 211, 163, 0.3)';
            }}
            onClick={() => {
              alert('Merci pour votre inscription !');
            }}
          >
            S'abonner
          </button>
        </div>
      </div>

      {/* ===== TEXTE MARQUE ===== */}
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '1rem',
          marginBottom: '8px',
          color: '#0c0c0c',
        }}
      >
        Optique Maroc
      </p>
      <p style={{ fontSize: '0.8rem', marginBottom: '20px', color: '#333333' }}>
        Votre spécialiste en lunettes et verres optiques de qualité
      </p>

      {/* ===== LIENS RAPIDES ===== */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: '18px',
        }}
      >
        <Link to="/" style={linkStyle}>Accueil</Link>
        <Link to="/sunglasses" style={linkStyle}>Lunettes</Link>
        <Link to="/cart" style={linkStyle}>Panier</Link>
        <Link to="/contact" style={linkStyle}>Contact</Link>
      </div>

      {/* ===== LIGNE DE SÉPARATION ===== */}
      <div
        style={{
          width: '100%',
          height: '1px',
          backgroundColor: 'rgba(230, 211, 163, 0.2)',
          margin: '20px 0',
        }}
      />

      {/* ===== CONTACT ===== */}
      <div style={{ marginBottom: '18px', fontSize: '0.85rem', color: '#333333' }}>
        <p style={{ marginBottom: '6px' }}>
          📞 +212 6 12 34 56 78
        </p>
        <p style={{ marginBottom: '6px' }}>
          ✉️ contact@optique.com
        </p>
        <p>
          📍 Casablanca, Maroc
        </p>
      </div>

      {/* ===== RÉSEAUX SOCIAUX ===== */}
      <div
  style={{
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
    gap: '18px',
  }}
>
  <a
    href="https://www.facebook.com"
    target="_blank"
    rel="noopener noreferrer"
    style={iconStyle}
  >
    <FaFacebookF />
  </a>

  <a
    href="https://www.instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    style={iconStyle}
  >
    <FaInstagram />
  </a>

  <a
    href="https://www.tiktok.com"
    target="_blank"
    rel="noopener noreferrer"
    style={iconStyle}
  >
    <FaTiktok />
  </a>
</div>

      {/* ===== COPYRIGHT ===== */}
      <div style={{ fontSize: '0.75rem', color: '#666666' }}>
        © {new Date().getFullYear()} Optique Maroc. Tous droits réservés.
      </div>
    </footer>
  );
};

const linkStyle = {
  color: '#E6D3A3',
  textDecoration: 'none',
  fontWeight: 500,
};

const socialStyle = {
  color: '#333333',
  textDecoration: 'none',
};
const iconStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: 'rgba(230, 211, 163, 0.1)',
  color: '#E6D3A3',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.1rem',
  textDecoration: 'none',
  boxShadow: '0 4px 10px rgba(230, 211, 163, 0.2)',
  transition: 'transform 0.2s ease',
  border: '1px solid rgba(230, 211, 163, 0.3)',
};

export default FooterMobile;
