import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

/* ================= MENU LATÉRAL ================= */
const MobileNavMenu = ({ isOpen, onClose, user, isAuthenticated, handleLogout, favoritesCount }) => {
  const [openSolar, setOpenSolar] = useState(false);
  const [openOptical, setOpenOptical] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Gestion du swipe pour fermer le menu (uniquement depuis le haut)
  const handleTouchStart = (e) => {
    setTouchEnd(0);
    const touchY = e.targetTouches[0].clientY;
    setTouchStart(touchY);
    
    // Ne fermer le menu que si le swipe commence dans la zone supérieure (premiers 100px)
    const menuElement = e.currentTarget;
    const rect = menuElement.getBoundingClientRect();
    const relativeY = touchY - rect.top;
    
    if (relativeY <= 100) {
      menuElement.dataset.canClose = 'true';
    } else {
      menuElement.dataset.canClose = 'false';
    }
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    
    const menuElement = e.currentTarget;
    const canClose = menuElement.dataset.canClose === 'true';
    
    if (canClose) {
      const distance = touchStart - touchEnd;
      const isDownSwipe = distance < -50; // Swipe vers le bas de plus de 50px
      
      if (isDownSwipe) {
        onClose();
      }
    }
    
    // Réinitialiser
    menuElement.dataset.canClose = 'false';
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-100%',
        width: '72%',
        height: '100%',
        backdropFilter: 'blur(30px) saturate(150%)',
        WebkitBackdropFilter: 'blur(30px) saturate(150%)',
        background: 'rgba(20, 20, 20, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.25)',
        transition: 'left 0.35s ease',
        padding: '22px 18px',
        zIndex: 1000, // Augmenté pour être au-dessus de ProductActionBar (qui a zIndex: 100)
        overflowY: 'auto', // Permettre le scroll vertical
        WebkitOverflowScrolling: 'touch' // Scroll fluide sur iOS
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button onClick={onClose} style={closeBtn}>×</button>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Link to="/" onClick={onClose} style={navItemStyle}>Accueil</Link>

        <div style={accordionStyle}>
          <div style={accordionHeader} onClick={() => setOpenSolar(!openSolar)}>
            <span>Lunettes Solaires</span>
            <span style={chevronStyle}>{openSolar ? '⌄' : '›'}</span>
          </div>
          {openSolar && (
            <div style={accordionContent}>
              <Link to="/sunglasses/homme" onClick={onClose} style={subItemStyle}>
                Lunettes solaires Homme
              </Link>
              <Link to="/sunglasses/femme" onClick={onClose} style={subItemStyle}>
                Lunettes solaires Femme
              </Link>
            </div>
          )}
        </div>

        <div style={accordionStyle}>
          <div style={accordionHeader} onClick={() => setOpenOptical(!openOptical)}>
            <span>Lunettes Optiques</span>
            <span style={chevronStyle}>{openOptical ? '⌄' : '›'}</span>
          </div>
          {openOptical && (
            <div style={accordionContent}>
              <Link to="/optical/homme" onClick={onClose} style={subItemStyle}>
                Lunettes optique Homme
              </Link>
              <Link to="/optical/femme" onClick={onClose} style={subItemStyle}>
                Lunettes optique Femme
              </Link>
            </div>
          )}
        </div>

        <Link to="/Store" onClick={onClose} style={navItemStyle}>
          Point de Vente
        </Link>

        <div style={authSection}>
          {isAuthenticated && user ? (
            // Utilisateur connecté : Mon Compte et Déconnexion
            <>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                marginBottom: '12px',
                background: 'rgba(204, 160, 66, 0.1)',
                border: '1px solid rgba(204, 160, 66, 0.3)',
                borderRadius: '14px'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#cca042',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#FFFFFF',
                  flex: 1
                }}>
                  {user.name || user.email}
                </span>
              </div>
              <Link
                to="/profile"
                onClick={onClose}
                style={{ 
                  ...navItemStyle, 
                  background: 'rgba(10, 10, 10, 0.4)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  position: 'relative'
                }}
              >
                Mon Compte
                {favoritesCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    fontSize: '11px',
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
                onClick={() => {
                  handleLogout();
                  onClose();
                }}
                style={{ 
                  ...navItemStyle, 
                  background: 'rgba(220, 53, 69, 0.8)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF'
                }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            // Utilisateur non connecté : Connexion et Inscription
            <>
              <Link
                to="/login"
                onClick={onClose}
                style={{ ...navItemStyle, background: 'rgba(10, 10, 10, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              >
                Connexion
              </Link>
              <Link
                to="/register"
                onClick={onClose}
                style={{ ...navItemStyle, background: 'rgba(255, 255, 255, 0.15)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.25)' }}
              >
                S'inscrire
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

/* ================= HEADER MOBILE ================= */
const HeaderMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const cartItemCount = cartItems.length;
  const [favoritesCount, setFavoritesCount] = useState(0);

  // Vérifier si nous sommes sur la page du panier ou checkout
  const isCartPage = location.pathname === '/cart';
  const isCheckoutPage = location.pathname === '/checkout';
  
  // Pages où le bouton favoris doit s'afficher (uniquement pour les utilisateurs non connectés)
  const isSunglassesMobile = location.pathname.includes('/sunglasses') && location.pathname !== '/sunglasses/homme' && location.pathname !== '/sunglasses/femme';
  const isProductsPage = location.pathname === '/products' || location.pathname.includes('/products');
  const isOpticalMobile = location.pathname.includes('/optical') && location.pathname !== '/optical/homme' && location.pathname !== '/optical/femme';
  const isOpticalDetail = location.pathname.includes('/optical/') && (location.pathname.includes('/detail') || location.pathname.split('/').length > 3);
  const isProductDetailMobileOptical = location.pathname.includes('/product') && location.pathname.includes('optical');
  const isProductDetailMobile = location.pathname.includes('/product') && !location.pathname.includes('optical');
  
  // Pages autorisées pour le bouton favoris (utilisateurs non connectés uniquement)
  const allowedPagesForFavorites = isSunglassesMobile || isProductsPage || isOpticalMobile || 
                                   isOpticalDetail || isProductDetailMobileOptical || isProductDetailMobile;

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

  // Logs de debug pour vérifier l'état d'authentification
  console.log('=== DEBUG HEADER MOBILE ===');
  console.log('HeaderMobile: user =', user);
  console.log('HeaderMobile: user type =', typeof user);
  console.log('HeaderMobile: user === null =', user === null);
  console.log('HeaderMobile: user === undefined =', user === undefined);
  console.log('HeaderMobile: user keys =', user ? Object.keys(user) : 'N/A');
  console.log('HeaderMobile: isAuthenticated =', isAuthenticated);
  console.log('HeaderMobile: user.email =', user?.email);
  console.log('HeaderMobile: JSON.stringify(user) =', JSON.stringify(user));
  console.log('========================');

  /**
   * Fonction de déconnexion
   */
  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <TopBanner />

      <header style={headerStyle} data-header-mobile="true">
        <button onClick={() => setIsMenuOpen(true)} style={menuButtonStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', position: 'relative' }}>
            <span style={burgerLine} />
            <span style={burgerLine} />
            <span style={burgerLine} />
            {isAuthenticated && favoritesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#ff4444',
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                zIndex: 1
              }}>
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </span>
            )}
          </div>
        </button>

        {/* Bouton panier - masqué sur la page panier et checkout */}
        {!isCartPage && !isCheckoutPage && (
          <Link to="/cart" style={{ textDecoration: 'none' }}>
            <div style={cartButtonStyle} data-translate="no" className="no-translate">
              <span className="material-symbols-outlined" translate="no">
                shopping_bag_speed
              </span>
              {cartItemCount > 0 && (
                <span style={cartBadge}>{cartItemCount}</span>
              )}
            </div>
          </Link>
        )}

        {/* Bouton favoris supprimé pour les utilisateurs déconnectés */}

        {/* Bouton favoris supprimé pour les utilisateurs déconnectés */}

        <MobileNavMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          user={user}
          isAuthenticated={isAuthenticated}
          handleLogout={handleLogout}
          favoritesCount={favoritesCount}
        />
      </header>
    </>
  );
};

/* ================= STYLES ================= */
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
  position: 'fixed',
  top: '50px',
  left: -6,
  width: '100%',
  zIndex: 1001, // Le header doit être au-dessus du menu (zIndex: 1000) et de ProductActionBar (zIndex: 100)
  backgroundColor: 'transparent',
  padding: '0px 3px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const menuButtonStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  backgroundColor: '#cca042ff',
  border: 'none',
  boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginLeft: '7px',
  marginTop: '0px',
};

const cartButtonStyle = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  backgroundColor: '#cca042ff',
  boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  color: '#6B6B6B',
  marginRight: '1px',
  // top: '-10px', // Supprimé pour remettre à l'ancienne position
};

const burgerLine = {
  width: '22px',
  height: '3px',
  backgroundColor: '#6B6B6B',
  borderRadius: '2px',
};

const navItemStyle = {
  padding: '16px 18px',
  borderRadius: '14px',
  textDecoration: 'none',
  color: '#FFFFFF',
  fontSize: '15px',
  fontWeight: '600',
  background: 'rgba(20, 20, 20, 0.3)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
};

const accordionStyle = {
  borderRadius: '16px',
  overflow: 'hidden',
  marginBottom: '16px',
};

const accordionHeader = {
  padding: '16px 18px',
  fontSize: '15px',
  fontWeight: '600',
  color: '#FFFFFF',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer',
  background: 'rgba(20, 20, 20, 0.3)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '14px',
  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s ease',
};

const chevronStyle = { fontSize: '18px', opacity: 0.6 };

const accordionContent = {
  display: 'flex',
  flexDirection: 'column',
  marginTop: '8px',
  gap: '4px',
};

const subItemStyle = {
  padding: '14px 22px',
  textDecoration: 'none',
  color: '#FFFFFF',
  fontSize: '14px',
  fontWeight: '500',
  background: 'rgba(20, 20, 20, 0.2)',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
};

const closeBtn = {
  fontSize: '28px',
  marginBottom: '26px',
  background: 'rgba(20, 20, 20, 0.3)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  cursor: 'pointer',
  color: '#FFFFFF',
  borderRadius: '12px',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const authSection = {
  marginTop: '26px',
  paddingTop: '18px',
  borderTop: '1px solid #fff3f3ff',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const cartBadge = {
  position: 'absolute',
  top: '-4px',
  right: '-4px',
  width: '18px',
  height: '18px',
  borderRadius: '50%',
  backgroundColor: '#E63946',
  color: '#FFFFFF',
  fontSize: '11px',
  fontWeight: 'bold',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '2px solid white'
};

export default HeaderMobile;
