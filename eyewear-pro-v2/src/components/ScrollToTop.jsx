import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Approche multiple pour garantir le scroll en haut
    const scrollToTop = () => {
      // Méthode 1: scrollTo immédiat
      window.scrollTo(0, 0);
      
      // Méthode 2: scrollIntoView sur le body
      document.body.scrollIntoView({ behavior: 'instant', block: 'start' });
      
      // Méthode 3: documentElement
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };

    // Exécuter immédiatement
    scrollToTop();
    
    // Exécuter après un court délai pour contourner certains navigateurs
    const timeoutId = setTimeout(scrollToTop, 0);
    
    // Exécuter après le rendu
    const rafId = requestAnimationFrame(scrollToTop);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [pathname]);

  return null;
};

export default ScrollToTop;
