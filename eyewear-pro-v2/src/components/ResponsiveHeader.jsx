import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import HeaderMobile from './HeaderMobile.jsx';

/**
 * Composant ResponsiveHeader
 * Affiche le Header approprié selon la taille de l'écran
 * - Header (desktop) pour les écrans >= 768px
 * - HeaderMobile (mobile) pour les écrans < 768px
 */
const ResponsiveHeader = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Nettoyage de l'écouteur d'événement
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  console.log(`ResponsiveHeader: Affichage ${isMobile ? 'mobile' : 'desktop'}`);

  return isMobile ? <HeaderMobile /> : <Header />;
};

export default ResponsiveHeader;
