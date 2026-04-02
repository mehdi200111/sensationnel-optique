import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsApi } from '../services/pocketbaseService.js';

// Import PocketBase
import PocketBase from 'pocketbase';

const BestsellersSection = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [bestsellersData, setBestsellersData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Détecter si on est sur la page home
  const isHomePage = window.location.pathname === '/';
  const isProductDetailPage = window.location.pathname.includes('/detail/');

  // Initialiser PocketBase
  const pb = new PocketBase(import.meta.env.VITE_PB_URL);

  // Récupérer les bestsellers depuis PocketBase
  useEffect(() => {
    let cancelled = false;
    
    const fetchBestsellers = async () => {
      try {
        if (cancelled) return;
        setLoading(true);
        
        // Utiliser le service existant pour récupérer les bestsellers
        const res = await productsApi.getShopList({ bestseller: true });
        
        if (cancelled) return;
        
        console.log('📋 Résultat du service:', res);

        if (!res.success || !res.data || res.data.length === 0) {
          console.log('ℹ️ Aucun produit trouvé - utilisation des données mock');
          // Utiliser les données mock directement sans erreur
          const mockData = [
            {
              id: 'bs1',
              name: 'RAY-BAN | META WAYFARER - GEN 1',
              image: 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1765683548/Gemini_Generated_Image_xj61cyxj61cyxj61_zbr4me.png',
              oldPrice: '359,00 DH',
              price: '269,25 DH',
              category: 'homme',
              discount: '-25%',
              isNew: false
            },
            {
              id: 'bs2',
              name: 'AVIATOR MAX',
              image: 'https://images.unsplash.com/photo-1511407307959-80b24a7fbf8?w=400&h=400&fit=crop',
              price: '183,00 DH',
              category: 'homme',
              isNew: true
            },
            {
              id: 'bs3',
              name: 'OAKLEY | HOLBROOK',
              image: 'https://images.unsplash.com/photo-1572635148818-ef62f2c7f492?w=400&h=400&fit=crop',
              price: '425,00 DH',
              oldPrice: '550,00 DH',
              category: 'femme',
              discount: '-23%',
              isNew: false
            }
          ];
          
          if (cancelled) return;
          setBestsellersData(mockData);
          setLoading(false);
          return;
        }

        // Limiter à 10 produits maximum (le filtre bestseller est déjà fait côté serveur)
        const bestsellers = res.data.slice(0, 10);

        if (bestsellers.length === 0) {
          console.log('ℹ️ Aucun produit bestseller trouvé - utilisation des données mock');
          // Utiliser les données mock directement sans erreur
          const mockData = [
            {
              id: 'bs1',
              name: 'RAY-BAN | META WAYFARER - GEN 1',
              image: 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1765683548/Gemini_Generated_Image_xj61cyxj61cyxj61_zbr4me.png',
              oldPrice: '359,00 DH',
              price: '269,25 DH',
              category: 'homme',
              discount: '-25%',
              isNew: false
            },
            {
              id: 'bs2',
              name: 'AVIATOR MAX',
              image: 'https://images.unsplash.com/photo-1511407307959-80b24a7fbf8?w=400&h=400&fit=crop',
              price: '183,00 DH',
              category: 'homme',
              isNew: true
            },
            {
              id: 'bs3',
              name: 'OAKLEY | HOLBROOK',
              image: 'https://images.unsplash.com/photo-1572635148818-ef62f2c7f492?w=400&h=400&fit=crop',
              price: '425,00 DH',
              oldPrice: '550,00 DH',
              category: 'femme',
              discount: '-23%',
              isNew: false
            }
          ];
          
          if (cancelled) return;
          setBestsellersData(mockData);
          setLoading(false);
          return;
        }

        // Formater les données pour le composant selon ta structure
        const formattedData = bestsellers.map(item => {
          // Utiliser une image par défaut si img est vide ou null
          const imageUrl = item.img && item.img.trim() !== '' 
            ? item.img 
            : 'https://images.unsplash.com/photo-1511499767750-ae8a1eeaeeb?w=400&h=400&fit=crop';
          
          return {
            id: item.id,
            name: item.name || 'Produit sans nom',
            image: imageUrl,
            price: item.price ? `${item.price} DH` : '0 DH',
            oldPrice: item.originalPrice && item.originalPrice !== item.price ? `${item.originalPrice} DH` : null,
            category: item.gender || 'Lunettes',
            discount: item.promoPercentage && item.promoPercentage > 0 ? `-${item.promoPercentage}%` : null,
            isNew: false
          };
        });

        if (cancelled) return;
        console.log('✨ Données formatées:', formattedData);
        setBestsellersData(formattedData);
      } catch (error) {
        if (cancelled) return;
        console.error('❌ Erreur:', error.message);
        
        // Utiliser les données mock en cas d'erreur
        setBestsellersData([
          {
            id: 'bs1',
            name: 'RAY-BAN | META WAYFARER - GEN 1',
            image: 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1765683548/Gemini_Generated_Image_xj61cyxj61cyxj61_zbr4me.png',
            oldPrice: '359,00 DH',
            price: '269,25 DH',
            category: 'homme',
            discount: '-25%',
            isNew: false
          },
          {
            id: 'bs2',
            name: 'AVIATOR MAX',
            image: 'https://images.unsplash.com/photo-1511407307959-80b24a7fbf8?w=400&h=400&fit=crop',
            price: '183,00 DH',
            category: 'homme',
            isNew: true
          },
          {
            id: 'bs3',
            name: 'OAKLEY | HOLBROOK',
            image: 'https://images.unsplash.com/photo-1572635148818-ef62f2c7f492?w=400&h=400&fit=crop',
            price: '425,00 DH',
            oldPrice: '550,00 DH',
            category: 'femme',
            discount: '-23%',
            isNew: false
          }
        ]);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBestsellers();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollAmount = 320; // Largeur d'une carte + gap

  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener('resize', checkScrollPosition);
    return () => window.removeEventListener('resize', checkScrollPosition);
  }, []);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const styles = {
    section: {
      backgroundColor: '#FFFFFF', // Toujours blanc maintenant
      padding: '40px 16px',
      position: 'relative',
      zIndex: 2,
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '30px',
    },
    title: {
      fontFamily: '"BBH Hegarty", sans-serif', // Même police que les collections
      fontWeight: 400,
      letterSpacing: '1.5px',
      textAlign: 'center',
      color: '#0c0c0c', // Couleur foncée pour fond blanc
      textTransform: 'uppercase',
      margin: 0,
    },
    scrollContainer: {
      position: 'relative',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    scrollWrapper: {
      display: 'flex',
      overflowX: 'auto',
      scrollSnapType: 'x mandatory',
      gap: '18px', // Même gap que les collections
      padding: '0 60px', // Espace pour les flèches
      scrollbarWidth: 'none', // Cache la barre sur Firefox
      msOverflowStyle: 'none', // Cache la barre sur IE
      WebkitOverflowScrolling: 'touch', // Scroll fluide sur iOS
    },
    arrow: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'rgba(0,0,0,0.45)',
      color: '#fff8f8ff',
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: 'bold',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      transition: 'all 0.3s ease',
      zIndex: 10,
    },
    arrowLeft: {
      left: '10px',
    },
    arrowRight: {
      right: '10px',
    },
    arrowDisabled: {
      opacity: 0.3,
      cursor: 'not-allowed',
    },
    card: {
      height: '280px', // Augmenté pour accommoder les prix
      borderRadius: '25px', // Même border radius
      backgroundImage: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url()',
      backgroundSize: 'cover',
      backgroundPosition: '50% 25%',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      color: '#f8f8f8ff', // Même couleur texte que collections
      fontSize: '1.05rem',
      fontWeight: '700',
      textAlign: 'center',
      textTransform: 'uppercase',
      cursor: 'pointer',
      paddingBottom: '18px',
      position: 'relative',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      flex: '0 0 280px', // Largeur fixe pour toutes les cartes
      scrollSnapAlign: 'start',
    },
    badge: {
      position: 'absolute',
      top: '16px',
      left: '16px',
      backgroundColor: '#e21b1b',
      color: '#fff',
      fontSize: '11px',
      fontWeight: '700',
      letterSpacing: '0.5px',
      padding: '6px 12px',
      borderRadius: '20px',
      textTransform: 'uppercase',
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/sunglasses/detail/${productId}`);
  };

  return (
    <section style={styles.section}>
      <div style={styles.header}>
        <h2 style={styles.title}>Bestsellers</h2>
      </div>
      
      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#0c0c0c' }}>
          <div>🔄 Chargement des produits...</div>
        </div>
      )}
      
      {/* Empty state */}
      {!loading && bestsellersData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#0c0c0c' }}>
          <div>📦 Aucun produit bestseller trouvé</div>
          <div style={{ fontSize: '14px', marginTop: '10px' }}>
            Vérifie que tu as des produits avec "bestseller = true" dans PocketBase
          </div>
        </div>
      )}
      
      {/* Products display */}
      {!loading && bestsellersData.length > 0 && (
        <div style={styles.scrollContainer}>
          <button
            style={{
              ...styles.arrow,
              ...styles.arrowLeft,
              ...(canScrollLeft ? {} : styles.arrowDisabled)
            }}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            ‹
          </button>
          
          <button
            style={{
              ...styles.arrow,
              ...styles.arrowRight,
              ...(canScrollRight ? {} : styles.arrowDisabled)
            }}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            ›
          </button>
          
          <div 
            ref={scrollRef}
            style={styles.scrollWrapper}
            onScroll={checkScrollPosition}
          >
            {bestsellersData.map((product, index) => (
              <div
                key={product.id}
                style={{
                  ...styles.card,
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${product.image})`,
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
                onClick={() => handleCardClick(product.id)}
              >
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  display: 'flex',
                  gap: '5px',
                  zIndex: 1
                }}>
                  {product.isNew && <span style={styles.badge}>Nouveauté</span>}
                  {product.discount && <span style={styles.badge}>{product.discount}</span>}
                </div>
                
                <div style={{ textAlign: 'center', padding: '0 10px' }}>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '600',
                    display: 'block',
                    marginBottom: '8px',
                    lineHeight: '1.2'
                  }}>
                    {product.name}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <strong style={{ fontSize: '1rem', color: '#FFFFFF' }}>
                      {product.price}
                    </strong>
                    {product.oldPrice && (
                      <span style={{ 
                        textDecoration: 'line-through', 
                        color: '#cccccc', 
                        fontSize: '0.85rem' 
                      }}>
                        {product.oldPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Debug info */}
      <div style={{ 
        position: 'absolute', 
        bottom: '10px', 
        right: '10px', 
        fontSize: '10px', 
        color: '#666',
        background: 'rgba(255,255,255,0.1)',
        padding: '5px',
        borderRadius: '3px'
      }}>
        Debug: {loading ? 'Loading...' : `${bestsellersData.length} produits`}
      </div>
    </section>
  );
};

export default BestsellersSection;
