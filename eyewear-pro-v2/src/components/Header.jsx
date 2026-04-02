import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import './icon-fix.css';

/* ================== BANDEAU HAUT ================== */
const TopBanner = () => {
  const messages = [
    "Échanges & retours gratuits sous 14 jours",
    "Livraison partout au Maroc en 24h/48h"
  ];

  const [current, setCurrent] = useState(0);

  const prevMessage = () =>
    setCurrent(prev => (prev === 0 ? messages.length - 1 : prev - 1));

  const nextMessage = () =>
    setCurrent(prev => (prev === messages.length - 1 ? 0 : prev + 1));

  /* 🔥 AUTO SLIDE (AJOUT UNIQUE) */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev =>
        prev === messages.length - 1 ? 0 : prev + 1
      );
    }, 4000); // 4 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={topBannerStyle}>
      <button onClick={prevMessage} style={bannerBtn}>‹</button>
      <span style={{ flex: 1, textAlign: 'center' }}>
        {messages[current]}
      </span>
      <button onClick={nextMessage} style={bannerBtn}>›</button>
    </div>
  );
};

/* ================= MENU DE NAVIGATION ================== */
const NavigationMenu = () => {
  const [openSolar, setOpenSolar] = useState(false);
  const [openOptical, setOpenOptical] = useState(false);

  return (
    <nav style={navStyle}>
      <Link to="/" style={navItemStyle}>Accueil</Link>

      <div style={dropdownContainer}>
        <button 
          style={dropdownButton} 
          onMouseEnter={() => setOpenSolar(true)}
          onMouseLeave={() => setOpenSolar(false)}
        >
          Lunettes Solaires
        </button>
        {openSolar && (
          <div 
            style={dropdownContent}
            onMouseEnter={() => setOpenSolar(true)}
            onMouseLeave={() => setOpenSolar(false)}
          >
            <Link to="/sunglasses/homme" style={dropdownItemStyle}>
              Lunettes solaires Homme
            </Link>
            <Link to="/sunglasses/femme" style={dropdownItemStyle}>
              Lunettes solaires Femme
            </Link>
          </div>
        )}
      </div>

      <div style={dropdownContainer}>
        <button 
          style={dropdownButton} 
          onMouseEnter={() => setOpenOptical(true)}
          onMouseLeave={() => setOpenOptical(false)}
        >
          Lunettes Optiques
        </button>
        {openOptical && (
          <div 
            style={dropdownContent}
            onMouseEnter={() => setOpenOptical(true)}
            onMouseLeave={() => setOpenOptical(false)}
          >
            <Link to="/optical/homme" style={dropdownItemStyle}>
              Lunettes optique Homme
            </Link>
            <Link to="/optical/femme" style={dropdownItemStyle}>
              Lunettes optique Femme
            </Link>
          </div>
        )}
      </div>

      <Link to="/Store" style={navItemStyle}>
        Point de Vente
      </Link>
    </nav>
  );
};

/* ================= HEADER PRINCIPAL ================== */
const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Synchroniser le nombre de favoris depuis localStorage et écouter les mises à jour
  useEffect(() => {
    const updateFavoritesCount = () => {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setFavoritesCount(favorites.length);
    };

    // Charger au montage
    updateFavoritesCount();
    
    // Écouter les mises à jour
    window.addEventListener('favoritesUpdated', updateFavoritesCount);
    
    return () => {
      window.removeEventListener('favoritesUpdated', updateFavoritesCount);
    };
  }, []);

  const navigate = useNavigate();
  const cartItemCount = cartItems.length;

  // Logs de debug pour vérifier l'état d'authentification
  console.log('=== DEBUG HEADER ===');
  console.log('Header: user =', user);
  console.log('Header: user type =', typeof user);
  console.log('Header: user === null =', user === null);
  console.log('Header: user === undefined =', user === undefined);
  console.log('Header: user keys =', user ? Object.keys(user) : 'N/A');
  console.log('Header: isAuthenticated =', isAuthenticated);
  console.log('Header: user.email =', user?.email);
  console.log('Header: JSON.stringify(user) =', JSON.stringify(user));
  console.log('==================');

  /**
   * Fonction de déconnexion
   * Déconnecte l'utilisateur et le redirige vers la page d'accueil
   */
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <TopBanner />
      
      <header style={headerStyle}>
        <div style={headerContainer}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            SENSATIONNEL OPTIQUE
          </Link>

          {/* Navigation */}
          <NavigationMenu />

          {/* Actions (Panier + Authentification) */}
          <div style={actionsStyle}>
            {/* Panier */}
            <Link to="/cart" style={cartButtonStyle} data-translate="no" className="no-translate">
              <span className="material-symbols-outlined" translate="no">
                shopping_bag_speed
              </span>
              {cartItemCount > 0 && (
                <span style={cartBadge}>{cartItemCount}</span>
              )}
            </Link>

            {/* Section Authentification */}
            <div style={authSection}>
              {isAuthenticated && user ? (
                // Utilisateur connecté : Profil utilisateur et Déconnexion
                <>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    borderRadius: '6px',
                    backgroundColor: 'rgba(204, 160, 66, 0.05)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: '#cca042',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#333',
                      maxWidth: '120px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {user.name || user.email}
                    </span>
                  </div>
                  <Link 
                    to="/profile" 
                    style={{
                      ...authButtonStyle,
                      backgroundColor: 'rgba(204, 160, 66, 0.1)',
                      color: '#cca042',
                      border: '1px solid rgba(204, 160, 66, 0.3)',
                      position: 'relative'
                    }}
                  >
                    Mon Compte
                    {favoritesCount > 0 && (
                      <span style={{
                        position: 'absolute',
                        top: '-4px',
                        right: '-4px',
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: '#ff4444',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid white'
                      }}>
                        {favoritesCount > 99 ? '99+' : favoritesCount}
                      </span>
                    )}
                  </Link>
                  <button 
                    onClick={handleLogout}
                    style={logoutButtonStyle}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                // Utilisateur non connecté : Connexion et Inscription
                <>
                  <Link 
                    to="/login" 
                    style={authButtonStyle}
                  >
                    Connexion
                  </Link>
                  <Link 
                    to="/register" 
                    style={registerButtonStyle}
                  >
                    S'inscrire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

/* ================= STYLES ================== */
const topBannerStyle = {
  background: 'rgba(0, 0, 0, 0.45)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  color: '#ffffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '9px 14px',
  fontSize: '15px',
  fontWeight: '600',
  width: '100%',
  borderBottom: '1px solid rgba(255,255,255,0.15)',
};

const bannerBtn = {
  background: 'none',
  border: 'none',
  color: '#ffffffff',
  cursor: 'pointer',
  fontSize: '19px',
};

const headerStyle = {
  position: 'sticky',
  top: '0',
  left: '0',
  width: '100%',
  zIndex: '1000',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  boxShadow: '0 2px 20px rgba(0, 0, 0, 0.1)',
};

const headerContainer = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: '70px',
};

const logoStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#cca042',
  textDecoration: 'none',
  letterSpacing: '1px',
};

const navStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '30px',
};

const navItemStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '16px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};

const dropdownContainer = {
  position: 'relative',
};

const dropdownButton = {
  background: 'none',
  border: 'none',
  color: '#333',
  fontSize: '16px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const dropdownContent = {
  position: 'absolute',
  top: '100%',
  left: '0',
  background: 'white',
  border: '1px solid rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  padding: '8px 0',
  minWidth: '200px',
  zIndex: '1000',
};

const dropdownItemStyle = {
  display: 'block',
  padding: '12px 20px',
  textDecoration: 'none',
  color: '#333',
  fontSize: '14px',
  transition: 'background 0.2s ease',
};

const actionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
};

const cartButtonStyle = {
  position: 'relative',
  textDecoration: 'none',
  color: '#333',
  fontSize: '24px',
  padding: '8px',
  borderRadius: '8px',
  transition: 'all 0.3s ease',
};

const cartBadge = {
  position: 'absolute',
  top: '0',
  right: '0',
  backgroundColor: '#E63946',
  color: '#FFFFFF',
  borderRadius: '50%',
  padding: '2px 6px',
  fontSize: '11px',
  fontWeight: '700',
  minWidth: '18px',
  height: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const authSection = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const authButtonStyle = {
  textDecoration: 'none',
  color: '#333',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px solid rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
};

const logoutButtonStyle = {
  background: 'rgba(220, 53, 69, 0.1)',
  color: '#dc3545',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '6px',
  border: '1px solid rgba(220, 53, 69, 0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const registerButtonStyle = {
  background: '#cca042',
  color: 'white',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  padding: '8px 16px',
  borderRadius: '6px',
  border: 'none',
  transition: 'all 0.3s ease',
};

export default Header;
