import React, { useEffect, useState, useMemo } from 'react';

import { Link, useParams, useNavigate } from 'react-router-dom';

import { productsApi } from '../services/pocketbaseService.js';

import { useCart } from '../context/CartContext';

import { useAuth } from '../context/AuthContext.jsx';

import ProgressIndicator from '../components/ProgressIndicator.jsx';

import OptimizedImage from '../components/OptimizedImage.jsx';

import '../components/icon-fix.css';



// 🎨 COULEURS VISUELLES

const colorMap = {

  Noir: '#000',

  Marron: '#8B4513',

  Blanc: '#fff',

  Bleu: '#1e40af',

  Or: '#FFD700',

  Écaille:

    'repeating-linear-gradient(45deg,#8B4513,#8B4513 6px,#D2B48C 6px,#D2B48C 12px)',

};



const OpticalPage = () => {

  const { gender } = useParams();

  const navigate = useNavigate();

  const { addToCart } = useCart();

  const { isAuthenticated } = useAuth();

  

  // Hook pour détecter si on est sur desktop

  const [isDesktop, setIsDesktop] = useState(false);

  

  useEffect(() => {

    const checkDesktop = () => {

      setIsDesktop(window.innerWidth >= 1024);

    };

    

    checkDesktop();

    window.addEventListener('resize', checkDesktop);

    

    return () => window.removeEventListener('resize', checkDesktop);

  }, []);



  const [products, setProducts] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState('');



  const [color, setColor] = useState(null);

  const [budget, setBudget] = useState(null);

  const [showFilters, setShowFilters] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const [showCartToast, setShowCartToast] = useState(false);

  const [displayedCount, setDisplayedCount] = useState(8); // Nombre initial de produits affichés



  const genderLower = gender?.toLowerCase();



  useEffect(() => {

    let cancelled = false;



    const load = async () => {

      setIsLoading(true);

      setLoadError('');

      

      try {

        const res = await productsApi.getShopList({ 

          gender: genderLower, 

          type: 'optique'

        });



        if (cancelled) return;



        if (res.success) {

          setProducts(res.data);

          setLoadError('');

        } else {

          setProducts([]);

          setLoadError(res.error || 'Failed to load optical products');

        }

      } catch (error) {

        if (cancelled) return;

        console.error('Error loading products:', error);

        setProducts([]);

        setLoadError('Erreur lors du chargement des produits. Veuillez réessayer.');

      }

      setIsLoading(false);

    };



    load();



    return () => {

      cancelled = true;

    };

  }, [gender]);



  // useEffect pour restaurer l'état complet au retour

  useEffect(() => {

    // Vérifier si nous revenons d'une page de détail

    const savedPosition = localStorage.getItem('scrollRestorePosition');

    const savedPath = localStorage.getItem('scrollRestorePath');

    const savedType = localStorage.getItem('scrollRestoreType');

    const savedDisplayedCount = localStorage.getItem('opticalDisplayedCount');

    

    console.log('🔍 Vérification restauration Optical:', {

      savedPosition,

      savedPath,

      savedType,

      savedDisplayedCount,

      currentPath: window.location.pathname,

      isLoading,

      productsCount: products.length

    });

    

    // Restaurer uniquement si tout correspond

    if (savedPosition && savedPath === window.location.pathname && savedType === 'optical' && !isLoading && products.length > 0) {

      

      // Restaurer le nombre de produits affichés

      if (savedDisplayedCount) {

        const count = parseInt(savedDisplayedCount);

        if (count > displayedCount) {

          console.log('📦 Restauration du nombre de produits affichés Optical:', count);

          setDisplayedCount(count);

        }

      }

      

      // Attendre un peu pour que le DOM se mette à jour avec les nouveaux produits

      setTimeout(() => {

        console.log('📍 Restauration de la position Optical à:', parseInt(savedPosition));

        window.scrollTo({

          top: parseInt(savedPosition),

          behavior: 'instant' // Pas d'animation pour restauration instantanée

        });

        

        // Nettoyer le localStorage après restauration

        localStorage.removeItem('scrollRestorePosition');

        localStorage.removeItem('scrollRestorePath');

        localStorage.removeItem('scrollRestoreType');

        localStorage.removeItem('opticalDisplayedCount');

      }, 500);

    }

  }, [isLoading, products, displayedCount]);



  const filteredProducts = useMemo(() => {

    return products.filter((p) => {

      const colorMatch = !color || p.colors.includes(color);

      let budgetMatch = true;

      if (budget !== null) {

        const budgetOptions = [

          (price) => price <= 500,

          (price) => price > 500 && price <= 1000,

          (price) => price > 1000 && price <= 1500,

          (price) => price > 1500,

        ];

        budgetMatch = budgetOptions[budget](p.price);

      }

      const genderMatch = !genderLower || (Array.isArray(p.gender) && p.gender.includes(genderLower));

      return colorMatch && budgetMatch && genderMatch;

    });

  }, [products, color, budget, genderLower]);



  const handleLoadMore = () => {

    setDisplayedCount(prev => Math.min(prev + 8, filteredProducts.length));

  };



  const calculateDiscountPercentage = (product) => {

    if (product.promoPercentage !== undefined && product.promoPercentage !== null && product.promoPercentage !== '') {

      const p = Number(product.promoPercentage);

      return Number.isFinite(p) ? Math.round(p) : 0;

    }

    if (product.originalPrice && product.originalPrice > product.price) {

      return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

    }

    return 0;

  };



  const formatPrice = (price) => {
    const p = parseFloat(price);
    if (isNaN(p)) return 'N/A';
    
    // Détecter la langue actuelle depuis le HTML ou localStorage
    const currentLang = document.documentElement.lang || localStorage.getItem('language') || 'fr';
    
    // Utiliser la devise appropriée selon la langue
    if (currentLang === 'ar') {
      return `${p.toFixed(0)} درهمًا`;
    } else {
      return `${p.toFixed(0)} DH`;
    }
  };



  const handleAddToCart = (e, product) => {

    e.stopPropagation();

    addToCart(

      { id: product.id, name: product.name, price: product.price, images: [product.img], colors: product.colors },

      null,

      1,

      color

    );

    setShowCartToast(true);

    setTimeout(() => setShowCartToast(false), 2500);

  };



  if (isLoading) {

    return (

      <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>

        Chargement des lunettes optiques...

      </div>

    );

  }



  if (loadError) {

    return (

      <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>

        <h1 style={{ color: '#dc3545' }}>Erreur de chargement</h1>

        <p>{loadError}</p>

        <Link to="/" style={{ marginTop: '20px', padding: '10px 20px', display: 'inline-block' }}>

          Retour à l'accueil

        </Link>

      </div>

    );

  }



  return (

    <main

      style={{

        width: isDesktop ? '100%' : '105.6vw',

        marginLeft: isDesktop ? '0' : '-4vw',

        display: 'flex',

        flexDirection: 'column',

        backgroundColor: 'rgba(230, 211, 163, 0.1)',

        minHeight: '100vh',

        maxWidth: isDesktop ? '1400px' : 'none',

        margin: isDesktop ? '0 auto' : undefined,

        padding: isDesktop ? '0 20px' : undefined,

      }}

    >

      {/* TITRE DE LA PAGE */}

      <section

        style={{

          padding: '40px 16px 20px',

          backgroundColor: 'rgba(230, 211, 163, 0.1)',

          textAlign: 'center',

        }}

      >

        <h1

          style={{

            fontFamily: 'Inter, sans-serif',

            fontWeight: 400,

            letterSpacing: '1.5px',

            color: '#000000',

            fontSize: '2.5rem',

            marginBottom: '10px',

            textTransform: 'uppercase',

          }}

        >

          Lunettes Optiques

        </h1>

        {gender && (

          <p

            style={{

              color: '#999',

              fontSize: '1.1rem',

              marginBottom: '20px',

              letterSpacing: '1px',

            }}

          >

            Collection {gender}

          </p>

        )}

      </section>



      {/* BOUTON FILTRER */}

      <section

        style={{

          padding: '0 16px 20px',

          backgroundColor: 'rgba(230, 211, 163, 0.1)',

        }}

      >

        <button

          onClick={() => setShowFilters(!showFilters)}

          style={{

            width: '100%',

            padding: '16px',

            borderRadius: '30px',

            border: '2px solid #D4AF37',

            backgroundColor: '#D4AF37',

            color: '#000000',

            fontWeight: 600,

            fontSize: '1rem',

            cursor: 'pointer',

            fontFamily: 'Inter, sans-serif',

            letterSpacing: '1px',

            textTransform: 'uppercase',

            transition: 'all 0.3s ease',

          }}

          onMouseOver={(e) => {

            e.currentTarget.style.backgroundColor = '#B8941F';

            e.currentTarget.style.color = '#000000';

          }}

          onMouseOut={(e) => {

            e.currentTarget.style.backgroundColor = '#D4AF37';

            e.currentTarget.style.color = '#000000';

          }}

        >

          {showFilters ? 'Fermer les filtres' : 'Filtrer les produits'}

        </button>

      </section>



      {/* FILTRES */}

      {showFilters && (

        <section

          style={{

            padding: '0 16px 30px',

            backgroundColor: 'rgba(230, 211, 163, 0.1)',

          }}

        >

          <div

            style={{

              backgroundColor: '#2a2a2a',

              borderRadius: '20px',

              padding: '24px',

              border: '1px solid #333',

            }}

          >

            {/* COULEURS */}

            <div style={{ marginBottom: '24px' }}>

              <h3

                style={{

                  fontSize: '1.1rem',

                  fontWeight: 600,

                  color: '#E6D3A3',

                  marginBottom: '16px',

                  fontFamily: 'Inter, sans-serif',

                  letterSpacing: '1px',

                  textTransform: 'uppercase',

                }}

              >

                Couleur

              </h3>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

                {Object.entries(colorMap).map(([name, bg]) => (

                  <div

                    key={name}

                    onClick={() => setColor(color === name ? null : name)}

                    title={name}

                    style={{

                      width: '40px',

                      height: '40px',

                      borderRadius: '50%',

                      background: bg,

                      border: color === name ? '3px solid #E6D3A3' : '2px solid #555',

                      cursor: 'pointer',

                      transition: 'all 0.3s ease',

                    }}

                  />

                ))}

              </div>

            </div>



            {/* BUDGET */}

            <div>

              <h3

                style={{

                  fontSize: '1.1rem',

                  fontWeight: 600,

                  color: '#E6D3A3',

                  marginBottom: '16px',

                  fontFamily: 'Inter, sans-serif',

                  letterSpacing: '1px',

                  textTransform: 'uppercase',

                }}

              >

                Budget

              </h3>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>

                {['Moins de 500 DH', '500 - 1500 DH', 'Plus de 1500 DH'].map((label, index) => (

                  <button

                    key={index}

                    onClick={() => setBudget(budget === index ? null : index)}

                    style={{

                      padding: '10px 20px',

                      borderRadius: '25px',

                      border: budget === index ? '2px solid #E6D3A3' : '1px solid #555',

                      backgroundColor: budget === index ? '#E6D3A3' : 'transparent',

                      color: budget === index ? '#1a1a1a' : '#E6D3A3',

                      fontSize: '0.9rem',

                      cursor: 'pointer',

                      fontFamily: 'Inter, sans-serif',

                      letterSpacing: '0.5px',

                      transition: 'all 0.3s ease',

                    }}

                  >

                    {label}

                  </button>

                ))}

              </div>

            </div>

          </div>

        </section>

      )}



      {/* PRODUITS */}

      <section

        style={{

          padding: isDesktop ? '0 0 40px' : '0 16px 40px',

          backgroundColor: 'rgba(230, 211, 163, 0.1)',

        }}

      >

        {filteredProducts.length === 0 ? (

          <div

            style={{

              textAlign: 'center',

              padding: '60px 20px',

              backgroundColor: '#2a2a2a',

              borderRadius: '20px',

              border: '1px solid #333',

            }}

          >

            <h3

              style={{

                color: '#E6D3A3',

                fontSize: '1.5rem',

                marginBottom: '15px',

                fontFamily: 'Inter, sans-serif',

                letterSpacing: '1px',

              }}

            >

              Aucun produit optique trouvé

            </h3>

            <p

              style={{

                color: '#999',

                fontSize: '1rem',

              }}

            >

              Essayez de modifier vos filtres pour voir plus de produits.

            </p>

          </div>

        ) : (

          <div

            style={{

              display: 'flex',

              flexWrap: 'wrap',

              gap: isDesktop ? '24px' : '16px',

              justifyContent: isDesktop ? 'flex-start' : 'space-between',

              marginLeft: isDesktop ? '0' : '6px'

            }}

          >

            {filteredProducts.slice(0, displayedCount).map((product) => (

              <div

                key={product.id}

                onClick={() => {

                  // Sauvegarder l'état complet AVANT la navigation

                  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;

                  const currentPath = window.location.pathname;

                  

                  // Sauvegarder toutes les informations nécessaires

                  localStorage.setItem('scrollRestorePosition', scrollPosition.toString());

                  localStorage.setItem('scrollRestorePath', currentPath);

                  localStorage.setItem('scrollRestoreType', 'optical');

                  localStorage.setItem('opticalDisplayedCount', displayedCount.toString());

                  

                  console.log('💾 État complet sauvegardé Optical:', {

                    position: scrollPosition,

                    path: currentPath,

                    displayedCount: displayedCount,

                    productId: product.id

                  });

                  

                  navigate(`/optical/detail/${product.id}`);

                }}

                style={{

                  background: '#ffffffff',

                  backdropFilter: 'blur(10px)',

                  WebkitBackdropFilter: 'blur(10px)',

                  borderRadius: '20px',

                  flex: isDesktop ? '0 0 calc(25% - 18px)' : '1 1 calc(50% - 8px)',

                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',

                  position: 'relative',

                  cursor: 'pointer',

                  border: '1px solid #333',

                  transition: 'all 0.3s ease',

                  overflow: 'hidden',

                  maxWidth: isDesktop ? '300px' : 'none',

                }}

                onMouseOver={(e) => {

                  e.currentTarget.style.transform = 'translateY(-4px)';

                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(230, 211, 163, 0.2)';

                  e.currentTarget.style.borderColor = '#E6D3A3';

                }}

                onMouseOut={(e) => {

                  e.currentTarget.style.transform = 'translateY(0)';

                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';

                  e.currentTarget.style.borderColor = '#333';

                }}

              >

                <OptimizedImage 

                  src={product.img} 

                  alt={product.name} 

                  style={{ 

                    width: '100%', 

                    height: isDesktop ? '280px' : '184px',

                    objectFit: 'cover'

                  }}

                />



                {/* BADGE POURCENTAGE */}

                {calculateDiscountPercentage(product) > 0 && (

                  <div

                    style={{

                      position: 'absolute',

                      top: '9px',

                      left: '6px',

                      backgroundColor: '#d9534f',

                      color: '#f0ebebff',

                      padding: '2px 6px',

                      borderRadius: '20px',

                      fontWeight: 700,

                      fontSize: '0.6rem',

                      fontFamily: 'Inter, sans-serif',

                    }}

                  >

                    -{calculateDiscountPercentage(product)}%

                  </div>

                )}



                {/* BOUTON FAVORIS AU-DESSUS DU PANIER - uniquement pour les utilisateurs connectés */}

                {isAuthenticated && (

                  <button

                    onClick={(e) => {

                      e.stopPropagation();

                      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

                      if (!favorites.find(fav => fav.id === product.id)) {

                        // Ajouter le produit au format attendu par Profile.jsx

                        const favoriteProduct = {

                          id: product.id,

                          name: product.name,

                          price: product.price,

                          image: product.img

                        };

                        favorites.push(favoriteProduct);

                        localStorage.setItem('favorites', JSON.stringify(favorites));

                        

                        // Émettre un événement pour mettre à jour Profile.jsx

                        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: favorites }));

                        

                        setShowToast(true);

                        setTimeout(() => setShowToast(false), 2000);

                      }

                    }}

                    style={{

                      position: 'absolute',

                      top: '45px',

                      right: '5px',

                      width: '48px',

                      height: '38px',

                      borderRadius: '12px',

                      backgroundColor: 'rgba(255,255,255,0.85)',

                      boxShadow: '0 8px 24px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.1)',

                      display: 'flex',

                      alignItems: 'center',

                      justifyContent: 'center',

                      cursor: 'pointer',

                      transition: 'all 0.3s ease',

                      border: '1px solid rgba(255,255,255,0.3)',

                      backdropFilter: 'blur(8px)',

                      WebkitBackdropFilter: 'blur(8px)',

                    }}

                    onMouseOver={(e) => {

                      e.currentTarget.style.transform = 'scale(1.05)';

                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.95)';

                      e.currentTarget.style.boxShadow = '0 12px 32px rgba(255,255,255,0.25), 0 6px 16px rgba(0,0,0,0.15)';

                    }}

                    onMouseOut={(e) => {

                      e.currentTarget.style.transform = 'scale(1)';

                      e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.85)';

                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.1)';

                    }}

                  >

                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#D4AF37">

                      <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z"/>

                    </svg>

                  </button>

                )}



                <button
                  data-translate="no" 
                  className="no-translate"
                  onClick={(e) => handleAddToCart(e, product)}

                  style={{

                    position: 'absolute',

                    top: '1px',

                    right: '5px',

                    width: '48px',

                    height: '38px',

                    borderRadius: '12px',

                    backgroundColor: '#cca042ff',

                    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',

                    display: 'flex',

                    alignItems: 'center',

                    justifyContent: 'center',

                    cursor: 'pointer',

                    transition: 'all 0.3s ease',

                    border: 'none',

                    color: '#FFFFFF',

                  }}

                  onMouseOver={(e) => {

                    e.currentTarget.style.transform = 'scale(1.05)';

                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';

                  }}

                  onMouseOut={(e) => {

                    e.currentTarget.style.transform = 'scale(1)';

                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.25)';

                  }}

                >

                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }} translate="no">

                    shopping_bag_speed

                  </span>

                </button>



                <div style={{ padding: isDesktop ? '16px 20px 20px 20px' : '12px 15px 16px 15px' }}>

                  {/* <p style={{ fontSize: '0.8rem', color: '#999', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>

                    {product.gender}

                  </p> */}

                  <h3 style={{ 

                    fontSize: isDesktop ? '1rem' : '0.9rem', 

                    marginBottom: '12px', 

                    color: '#000000', 

                    fontFamily: 'serif', 

                    letterSpacing: '0.5px', 

                    lineHeight: '1.3', 

                    whiteSpace: 'nowrap', 

                    overflow: 'hidden', 

                    textOverflow: 'ellipsis' 

                  }}>

                    {product.name}

                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                    <strong style={{ 

                      fontSize: isDesktop ? '1.2rem' : '1.1rem', 

                      color: '#000000', 

                      fontFamily: '"Inter Bold", sans-serif', 

                      fontWeight: 'bold' 

                    }}>

                      {formatPrice(product.price)}

                    </strong>

                    {console.log('DEBUG OPTICAL PRODUCT:', product.name, 'price:', product.price, 'originalPrice:', product.originalPrice, 'typeof originalPrice:', typeof product.originalPrice)}

                    {/* Test simple : afficher toujours si originalPrice existe */}

                    {product.originalPrice && (

                      <span style={{ textDecoration: 'line-through', color: '#666666', fontSize: '0.9rem' }}>

                        {formatPrice(product.originalPrice)}

                      </span>

                    )}

                  </div>



                  {/* GESTION DU STOCK */}

                  <div style={{ marginTop: '12px' }}>

                    {product.inStock ? (

                      <button

                        onClick={() => {

                          addToCart(

                            { id: product.id, name: product.name, price: product.price, images: [product.img], colors: product.colors },

                            null,

                            1,

                            color

                          );

                          // Naviguer vers le panier

                          window.location.href = '/cart';

                        }}

                        style={{

                          width: '100%',

                          padding: isDesktop ? '14px' : '12px',

                          backgroundColor: '#000000',

                          color: '#FFFFFF',

                          border: '1px solid #333333',

                          borderRadius: '8px',

                          fontSize: isDesktop ? '1rem' : '0.9rem',

                          fontWeight: '500',

                          fontFamily: 'Inter, sans-serif',

                          cursor: 'pointer',

                          transition: 'all 0.3s ease',

                          textTransform: 'uppercase',

                          letterSpacing: '0.5px', 

                          

                        }}

                        onMouseOver={(e) => {

                          e.currentTarget.style.backgroundColor = '#333333';

                          e.currentTarget.style.transform = 'translateY(-2px)';

                        }}

                        onMouseOut={(e) => {

                          e.currentTarget.style.backgroundColor = '#000000';

                          e.currentTarget.style.transform = 'translateY(0)';

                        }}

                      >

                        Acheter maintenant

                      </button>

                    ) : (

                      <div

                        style={{

                          width: '100%',

                          padding: isDesktop ? '14px' : '12px',

                          backgroundColor: '#333333',

                          color: '#999999',

                          border: '1px solid #444444',

                          borderRadius: '8px',

                          fontSize: isDesktop ? '1rem' : '0.9rem',

                          fontWeight: '500',

                          fontFamily: 'Inter, sans-serif',

                          textAlign: 'center',

                          textTransform: 'uppercase',

                          letterSpacing: '0.5px'

                        }}

                      >

                        Plus disponible

                      </div>

                    )}

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>



      {/* COMPOSANT DE PROGRESSION */}

      {filteredProducts.length > 0 && (

        <ProgressIndicator

          displayedCount={Math.min(displayedCount, filteredProducts.length)}

          totalCount={filteredProducts.length}

          onLoadMore={handleLoadMore}

        />

      )}



      {/* TOAST FAVORIS */}

      {showToast && (

        <div

          style={{

            position: 'fixed',

            bottom: '30px',

            left: '50%',

            transform: 'translateX(-50%)',

            backgroundColor: '#E6D3A3',

            color: '#1a1a1a',

            padding: '16px 24px',

            borderRadius: '30px',

            fontWeight: 600,

            boxShadow: '0 8px 24px rgba(230, 211, 163, 0.4)',

            fontFamily: 'Inter, sans-serif',

            letterSpacing: '1px',

            zIndex: 1000,

            whiteSpace: 'nowrap'

          }}

        >

          ➕🤍 Produit ajoute au favoris

        </div>

      )}



      {/* TOAST PANIER */}

      {showCartToast && (

        <div

          style={{

            position: 'fixed',

            bottom: '30px',

            left: '50%',

            transform: 'translateX(-50%)',

            backgroundColor: '#E6D3A3',

            color: '#1a1a1a',

            padding: '16px 24px',

            borderRadius: '30px',

            fontWeight: 600,

            boxShadow: '0 8px 24px rgba(230, 211, 163, 0.4)',

            fontFamily: 'Inter, sans-serif',

            letterSpacing: '1px',

            zIndex: 1000,

            whiteSpace: 'nowrap'

          }}

        >

          ➕🛒 Produit ajoute au panier

        </div>

      )}

    </main>

  );

};



export default OpticalPage;

