// Exemple d'intégration i18n dans le Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAppTranslation } from '../hooks/useTranslation.js';
import LanguageSwitcher from './LanguageSwitcher.jsx';

/* ================== BANDEAU HAUT ================== */
const TopBanner = () => {
  const { t } = useAppTranslation();
  
  const messages = [
    t('common.freeShipping'),
    t('common.expressDelivery')
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
  const { t } = useAppTranslation();
  const [openSolar, setOpenSolar] = useState(false);
  const [openOptical, setOpenOptical] = useState(false);

  return (
    <nav style={navStyle}>
      <Link to="/" style={navItemStyle}>{t('navigation.home')}</Link>

      <div style={dropdownContainer}>
        <button 
          style={dropdownButton} 
          onMouseEnter={() => setOpenSolar(true)}
          onMouseLeave={() => setOpenSolar(false)}
        >
          {t('navigation.sunglasses')}
        </button>
        {openSolar && (
          <div 
            style={dropdownContent}
            onMouseEnter={() => setOpenSolar(true)}
            onMouseLeave={() => setOpenSolar(false)}
          >
            <Link to="/sunglasses/homme" style={dropdownItemStyle}>
              {t('navigation.sunglasses')} {t('common.male')}
            </Link>
            <Link to="/sunglasses/femme" style={dropdownItemStyle}>
              {t('navigation.sunglasses')} {t('common.female')}
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
          {t('navigation.optical')}
        </button>
        {openOptical && (
          <div 
            style={dropdownContent}
            onMouseEnter={() => setOpenOptical(true)}
            onMouseLeave={() => setOpenOptical(false)}
          >
            <Link to="/optical/homme" style={dropdownItemStyle}>
              {t('navigation.optical')} {t('common.male')}
            </Link>
            <Link to="/optical/femme" style={dropdownItemStyle}>
              {t('navigation.optical')} {t('common.female')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

/* ================= HEADER PRINCIPAL ================== */
const Header = () => {
  const { t, isRTL } = useAppTranslation();
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cart?.items?.length || 0;

  return (
    <header style={headerStyle}>
      {/* Top Banner */}
      <TopBanner />

      {/* Main Header */}
      <div style={mainHeaderStyle}>
        <div style={headerContainerStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            <h1 style={logoTextStyle}>EYEWEAR PRO</h1>
          </Link>

          {/* Navigation */}
          <NavigationMenu />

          {/* Actions */}
          <div style={headerActionsStyle} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Cart */}
            <Link 
              to="/cart" 
              style={cartButtonStyle}
              className="relative flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2v1a1 1 0 001 1h1a1 1 0 001-1V2a1 1 0 00-1-1H3a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V2a1 1 0 00-1-1H3z"/>
                <path d="M7 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z"/>
                <path d="M17 3a1 1 0 00-1-1H8a1 1 0 00-1 1v2a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1z"/>
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div style={userMenuStyle} className="relative">
                <button 
                  style={userButtonStyle}
                  className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3a1 1 0 01-1-1v-5a1 1 0 011-1h1a1 1 0 011 1v5a1 1 0 01-1 1h7a7 7 0 11-14 0z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-medium">{user.name || t('common.account')}</span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <Link 
                    to="/account" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t('common.profile')}
                  </Link>
                  <Link 
                    to="/orders" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t('common.orders')}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {t('common.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                style={loginButtonStyle}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3a1 1 0 01-1-1v-5a1 1 0 011-1h1a1 1 0 011 1v5a1 1 0 01-1 1h7a7 7 0 11-14 0z" clipRule="evenodd"/>
                </svg>
                {t('common.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

/* ================= STYLES ================== */
// Garder les styles existants et ajouter des classes Tailwind où nécessaire
const topBannerStyle = {
  background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 100%)',
  color: '#ffffff',
  padding: '8px 0',
  textAlign: 'center',
  fontSize: '14px',
  fontWeight: '500',
  position: 'relative',
  overflow: 'hidden'
};

const bannerBtn = {
  background: 'none',
  border: 'none',
  color: '#ffffff',
  fontSize: '18px',
  cursor: 'pointer',
  padding: '0 15px',
  transition: 'all 0.3s ease'
};

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  gap: '30px',
  padding: '0 20px',
  backgroundColor: '#ffffff',
  borderBottom: '1px solid #e5e7eb'
};

const navItemStyle = {
  textDecoration: 'none',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  padding: '10px 0',
  borderBottom: '2px solid transparent',
  transition: 'all 0.3s ease'
};

const dropdownContainer = {
  position: 'relative'
};

const dropdownButton = {
  background: 'none',
  border: 'none',
  color: '#1a1a1a',
  fontSize: '16px',
  fontWeight: '500',
  padding: '10px 0',
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  transition: 'all 0.3s ease'
};

const dropdownContent = {
  position: 'absolute',
  top: '100%',
  left: '0',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
  zIndex: '1000',
  minWidth: '200px',
  padding: '8px 0'
};

const dropdownItemStyle = {
  display: 'block',
  padding: '12px 20px',
  textDecoration: 'none',
  color: '#1a1a1a',
  fontSize: '14px',
  transition: 'all 0.3s ease',
  borderBottom: '1px solid #f3f4f6'
};

const headerStyle = {
  position: 'sticky',
  top: '0',
  zIndex: '1000',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
};

const mainHeaderStyle = {
  borderBottom: '1px solid #e5e7eb'
};

const headerContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  height: '70px'
};

const logoStyle = {
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center'
};

const logoTextStyle = {
  fontSize: '24px',
  fontWeight: '800',
  color: '#1a1a1a',
  margin: '0',
  fontFamily: '"Playfair Display", serif'
};

const headerActionsStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '15px'
};

const cartButtonStyle = {
  textDecoration: 'none',
  position: 'relative'
};

const userMenuStyle = {
  position: 'relative'
};

const userButtonStyle = {
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer'
};

const loginButtonStyle = {
  textDecoration: 'none',
  border: 'none',
  cursor: 'pointer'
};
