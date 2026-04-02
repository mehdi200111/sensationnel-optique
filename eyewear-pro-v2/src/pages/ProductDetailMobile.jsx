import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import pb from '../pocketbase.js';
import ProductActionBar from '../components/ProductActionBar.jsx';
import ProductActionSection from '../components/ProductActionSection.jsx';
import OpticalLensesModal from '../components/OpticalLensesModal.jsx';
import SunglassLensesModal from '../components/SunglassLensesModal.jsx';
import BestsellersSection from '../components/BestsellersSection.jsx';
import { availableColors, productsData } from '../data/Products.js';
import { productsApi, productsService } from '../services/pocketbaseService.js';
import OptimizedImage from '../components/OptimizedImage.jsx';
import CarouselOptimizedImage from '../components/CarouselOptimizedImage.jsx';

// Import Google Fonts
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800;900&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);            

const CASH_ON_DELIVERY_IMAGE_URL = 'https://res.cloudinary.com/dhpaxqja8/image/upload/v1765923109/delivry_image_qyaatf.png'; 

const ProductDetailMobile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart(); 

    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLensesModalOpen, setIsLensesModalOpen] = useState(false); 
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);
    const [openAccordion, setOpenAccordion] = useState(null); 
    const [activeTab, setActiveTab] = useState('description'); 

    const formatPrice = (price) => {
        const p = parseFloat(price);
        if (isNaN(p)) return 'N/A';
        return `${p.toFixed(0)} DH`;
    };

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setIsLoading(true);
            let res;
            
            try {
                // Essayer d'abord par ID PocketBase, sinon par legacyId
                if (id.includes('kdml') || id.includes('fuak') || id.includes('jdz') || id.includes('656')) {
                    // ID PocketBase - utiliser le service normalisé
                    const res = await productsService.getById(id);
                    if (res.success) {
                        // Normaliser manuellement les données comme dans productsApi
                        const colors = Array.isArray(res.data?.colors) ? res.data.colors : (typeof res.data?.colors === 'string' ? [res.data?.colors] : []);
                        const images = Array.isArray(res.data?.images)
                            ? res.data?.images
                            : (typeof res.data?.images === 'string' && res.data?.images ? [res.data?.images] : []);

                        // Extraire la première valeur des tableaux gender et type
                        const gender = Array.isArray(res.data?.gender) ? res.data.gender[0] : res.data?.gender;
                        const type = Array.isArray(res.data?.type) ? res.data.type[0] : res.data?.type;

                        const toPublicUrl = (value) => {
                            if (!value) return '';
                            if (typeof value !== 'string') return '';
                            if (/^https?:\/\//i.test(value)) return value;
                            return `${import.meta.env.VITE_PB_URL}/api/files/${res.data.collectionId}/${res.data.id}/${value}`;
                        };

                        const img = toPublicUrl(res.data?.img) || toPublicUrl(images[0]);
                        const imageUrls = images.map(toPublicUrl).filter(Boolean);

                        const normalizedData = {
                            id: res.data?.legacyId ?? res.data?.id,
                            pbId: res.data?.id,
                            legacyId: res.data?.legacyId,
                            name: res.data?.name,
                            img,
                            images: imageUrls.length ? imageUrls : (img ? [img] : []),
                            price: res.data?.price,
                            originalPrice: res.data?.originalPrice,
                            promoPercentage: res.data?.promoPercentage,
                            colors,
                            gender: typeof gender === 'string' ? gender.toLowerCase() : gender,
                            type: type,
                            description: res.data?.description,
                            correctionInfo: res.data?.correctionInfo,
                            inStock: res.data?.inStock,
                            stockCount: res.data?.stockCount,
                        };
                        
                        res.data = normalizedData;
                    }
                    setProduct(res.data);
                    setLoadError(res.success ? '' : (res.error || 'Failed to load product'));
                } else {
                    // Legacy ID numérique
                    res = await productsApi.getByLegacyId(id);
                    setProduct(res.success ? res.data : null);
                    setLoadError(res.success ? '' : (res.error || 'Failed to load product'));
                }
            } catch (error) {
                console.log('PocketBase error, using mock data:', error);
                // Utiliser les données mock en cas d'erreur
                const mockProduct = productsData.find(p => p.id.toString() === id);
                if (mockProduct) {
                    setProduct(mockProduct);
                    setLoadError('');
                } else {
                    setProduct(null);
                    setLoadError('Product not found in mock data');
                }
            }
            setIsLoading(false);
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const [selectedColor, setSelectedColor] = useState(null);
    const colorObjects = useMemo(() => {
        if (!product?.colors) return [];

        return product.colors
            .map(colorName =>
                availableColors.find(c => c.name === colorName)
            )
            .filter(Boolean);
    }, [product]);

    useEffect(() => {
        if (product && product.colors.length > 0) {
            if (!selectedColor || !product.colors.includes(selectedColor)) {
                setSelectedColor(product.colors[0]);
            }
        }
    }, [product, selectedColor]);

    const nextSlide = () => { 
        if (!product?.images?.length) return;
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    };
    const prevSlide = () => { 
        if (!product?.images?.length) return;
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
    };

    const handleAddToCart = ({ quantity, isImmediatePurchase = false, lensDetails = null }) => { 
        if (!product || !product.inStock) return;

        if (isImmediatePurchase) {
            addToCart(product, selectedColor, quantity, null); 
            navigate('/cart'); // REDIRECTION PANIER
            return;
        }

        if (lensDetails) {
            addToCart(product, selectedColor, quantity, lensDetails);
            setIsLensesModalOpen(false); 
            navigate('/cart'); // REDIRECTION PANIER
        } else {
            addToCart(product, selectedColor, quantity, null);
            navigate('/cart'); // REDIRECTION PANIER
            setIsCartOpen(true);
        }
    };

    if (isLoading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
                Loading...
            </div>
        );
    }

    if (!product) { 
        return (
            <div style={{ padding: '20px', textAlign: 'center', minHeight: '100vh' }}>
                <h1 style={{ color: '#dc3545' }}>{loadError || `Produit Non Trouvé (ID: ${id}) 😔`}</h1>
                <button onClick={() => navigate('/')} style={{ marginTop: '20px', padding: '10px 20px' }}>
                    Retour à la liste
                </button>
            </div>
        );
    }

    const currentImage = product.images[currentImageIndex];

    return (
        <div style={{ padding: '0', backgroundColor: '#FFFFFF', minHeight: '100vh', paddingBottom: '80px' }}>
            {/* CARROUSEL */}
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '400px',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    backgroundColor: '#f5f5f5',
                    margin: '0 0 30px 0'
                }}
                onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
                onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
                onTouchEnd={() => {
                    if (touchStart - touchEnd > 50) nextSlide();
                    if (touchEnd - touchStart > 50) prevSlide();
                    setTouchStart(null);
                    setTouchEnd(null);
                }}
            >
                <CarouselOptimizedImage
                    src={currentImage || `https://via.placeholder.com/400x400.png?text=${encodeURIComponent(product.name)}`}
                    alt={`${product.name} ${currentImageIndex + 1}`}
                    style={{ width: '100%', height: '100%' }}
                    preloadImages={product.images || []}
                />

                <div
                    style={{
                        position: 'absolute',
                        bottom: '15px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: '8px',
                    }}
                >
                    {product.images.map((_, idx) => (
                        <span
                            key={`${product.id}-dot-${idx}`}
                            onClick={() => setCurrentImageIndex(idx)}
                            style={{
                                width: currentImageIndex === idx ? '12px' : '8px',
                                height: currentImageIndex === idx ? '12px' : '8px',
                                borderRadius: '50%',
                                backgroundColor: currentImageIndex === idx ? '#28a745' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                            }}
                        />
                    ))}
                </div>
            </div> {/* Ajout de la balise de fermeture pour le carrousel */}
            <div style={{ 
                padding: '15px',
                background: '#FFFFFF',
                color: '#000000',
                margin: '0 15px'
            }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '4px', color: '#000000' }}>{product.name}</h1>

                {/* PRIX + PROMO */}
                <p style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#000000', marginBottom: '15px' }}>
                    {formatPrice(product.price)}
                    {product.originalPrice && (
                        <>
                            <span style={{ textDecoration: 'line-through', color: '#ccc', marginLeft: '8px' }}>
                                {formatPrice(product.originalPrice)}
                            </span>
                        {product.promoPercentage && (
                            <span style={{
                                backgroundColor: '#d9534f',
                                color: '#fff',
                                padding: '2px 6px',
                                marginLeft: '8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                            }}>
                                Promo {product.promoPercentage}%
                            </span>
                        )}
                    </>
                )}
            </p>
{/* COULEURS DISPONIBLES */}
{colorObjects.length > 0 && (
    <div style={{ marginBottom: '20px' }}>
        <div style={{ fontWeight: '500', marginBottom: '8px', color: '#000000' }}>
            Couleur{product.colors.length > 1 ? 's' : ''} : <strong style={{ color: '#000000' }}>
                {product.colors.length > 1 
                    ? product.colors.join(' et ') 
                    : selectedColor
                }
            </strong>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
            {colorObjects.map(color => (
                <div
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: color.hex,
                        border:
                            selectedColor === color.name
                                ? '2px solid #000'
                                : color.border || '1px solid #ccc',
                        cursor: 'pointer',
                        boxShadow:
                            selectedColor === color.name
                                ? '0 0 0 2px rgba(0,0,0,0.15)'
                                : 'none',
                        transition: 'all 0.2s ease'
                    }}
                    title={color.name}
                />
            ))}
        </div>
    </div>
)}

                {/* SECTION ACTIONS PRODUIT */}
                <ProductActionSection 
                    product={product} 
                    onSelectLenses={() => setIsLensesModalOpen(true)}
                    onImmediateAddToCart={(quantity) => handleAddToCart({ quantity, isImmediatePurchase: true })}
                />

                {/* POURQUOI CHOISIR NOS LUNETTES */}
                <div style={{ 
                    margin: '20px -15px', 
                    padding: '40px 20px',
                    background: '#FFFFFF',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                    position: 'relative',
                    zIndex: 2
                }}>
                    <h3 style={{ 
                        fontSize: '1.3rem',
                        fontWeight: '800',
                        marginBottom: '20px',
                        color: '#000000',
                        fontFamily: '"Syne", sans-serif',
                        letterSpacing: '1.5px',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        margin: '0 0 30px 0'
                    }}>
                        Pourquoi choisir nos lunettes ?
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        <div style={{
                            padding: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                            color: '#000000',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '0.5px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🛡️</div>
                            <div style={{ 
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontSize: '1.1rem'
                            }}>
                                Qualité Supérieure
                            </div>
                            <div style={{ 
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '8px',
                                fontSize: '1rem'
                            }}>
                                Protection Maximale
                            </div>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#ffffff' }}>
                                Garantie 6 mois. Verres anti-UV.
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                            color: '#000000',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '0.5px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💎</div>
                            <div style={{ 
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '12px',
                                fontSize: '1.1rem'
                            }}>
                                Prix Exceptionnels
                            </div>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#ffffff' }}>
                                Lunettes de luxe pas cher.
                            </div>
                        </div>

                        <div style={{
                            padding: '20px',
                            backgroundColor: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.15)',
                            borderRadius: '12px',
                            color: '#000000',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '0.5px',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🛍️</div>
                            <div style={{ 
                                fontWeight: 'bold', 
                                color: '#000000', 
                                marginBottom: '12px',
                                fontSize: '1.1rem'
                            }}>
                                Shopping Simplifié
                            </div>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.4', color: '#ffffff' }}>
                                Livraison gratuite, échange gratuit ou remboursement.
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCORDÉONS ANIMÉS */}
                <div style={{ marginBottom: '20px' }}>
                    {/* Shipping Information */}
                    <div style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                            onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                textAlign: 'left',
                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            Shipping Information
                            <span style={{ fontSize: '1.2rem', color: '#666' }}>
                                {openAccordion === 'shipping' ? '−' : '+'}
                            </span>
                        </button>
                        <div
                            style={{
                                maxHeight: openAccordion === 'shipping' ? '500px' : '0',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease',
                                backgroundColor: '#fff',
                                padding: openAccordion === 'shipping' ? '12px 15px' : '0 15px',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                <li>Livraison partout au Maroc via Amana ou nos livreurs.</li>
                                <li>Délai de 1 à 2 jours ouvrables (hors week-end) pour les grandes villes.</li>
                                <li>Livraison plus longue possible en zones rurales ou petites villes.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Échanges & Retours */}
                    <div style={{ border: '1px solid #ccc', borderRadius: '6px', overflow: 'hidden' }}>
                        <button
                            onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                textAlign: 'left',
                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}
                        >
                            Échanges & Retours
                            <span style={{ fontSize: '1.2rem', color: '#666' }}>
                                {openAccordion === 'returns' ? '−' : '+'}
                            </span>
                        </button>
                        <div
                            style={{
                                maxHeight: openAccordion === 'returns' ? '500px' : '0',
                                overflow: 'hidden',
                                transition: 'max-height 0.3s ease',
                                backgroundColor: '#fff',
                                padding: openAccordion === 'returns' ? '12px 15px' : '0 15px',
                                fontSize: '0.95rem',
                                lineHeight: '1.5'
                            }}
                        >
                            <ul style={{ paddingLeft: '15px', margin: 0 }}>
                                <li>Retours & échanges gratuits sous 14 jours</li>
                                <li>Livreurs passent chez vous pour l'échange</li>
                                <li>Délai : 1 à 2 semaines ouvrables</li>
                                <li>Verres correcteurs : échange/retour possible mais payant</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* IMAGE PAIEMENT À LA LIVRAISON */}
                <div style={{ textAlign: 'center', margin: '20px 0' }}>
                    <OptimizedImage 
                        src={CASH_ON_DELIVERY_IMAGE_URL} 
                        alt="Paiement à la livraison / Cash on delivery" 
                        style={{ maxWidth: '80%', height: 'auto', display: 'block', margin: '0 auto' }}
                    />
                </div>

                {/* BARRE D'ONGLETS */}
                <div style={{ marginTop: '30px', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <button
                            onClick={() => setActiveTab('description')}
                            style={{
                                flex: 1,
                                padding: '12px 0',
                                border: 'none',
                                borderBottom: activeTab === 'description' ? '3px solid #285ba7ff' : '3px solid transparent',
                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                fontWeight: activeTab === 'description' ? '600' : '500',
                                cursor: 'pointer'
                            }}
                        >
                            Description
                        </button>
                        <button
                            onClick={() => setActiveTab('correction')}
                            style={{
                                flex: 1,
                                padding: '12px 0',
                                border: 'none',
                                borderBottom: activeTab === 'correction' ? '3px solid #285ba7ff' : '3px solid transparent',
                                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                                fontWeight: activeTab === 'correction' ? '600' : '500',
                                cursor: 'pointer'
                            }}
                        >
                            Lunettes avec correction
                        </button>
                    </div>

                    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                        {activeTab === 'description' && (
                            <div>
                                <p style={{ color: '#333', lineHeight: '1.6' }}>{product.description || "Aucune description disponible."}</p>
                            </div>
                        )}
                        {activeTab === 'correction' && (
                            <div>
                                <p style={{ color: '#333', lineHeight: '1.6' }}>{product.correctionInfo || "Informations sur les lunettes avec correction non disponibles."}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ESPACEMENT AVANT BESTSELLERS */}
            <div style={{ height: '40px' }}></div>

            {/* ================= MEILLEURES VENTES ================= */}
            <BestsellersSection 
                onImmediateAddToCart={(quantity) => handleAddToCart({ quantity, isImmediatePurchase: true })}
                onSelectLenses={() => setIsLensesModalOpen(true)}
            />

            {/* POURQUOI CHOISIR SENSATIONNEL OPTIQUE */}  
<div
  style={{
    marginTop: '30px',
    margin: '30px -15px 0 -15px',
    padding: '40px 20px',
    background: '#FFFFFF',
    border: '1px solid #e0e0e0',
    borderRadius: '12px',
    position: 'relative',
    zIndex: 2
  }}
>
  <h3
    style={{
      fontSize: '1.3rem',
      fontWeight: '800',
      marginBottom: '20px',
      color: '#000000',
      fontFamily: '"Syne", sans-serif',
      letterSpacing: '1.5px',
      textAlign: 'center',
      textTransform: 'uppercase',
      margin: '0 0 30px 0'
    }}
  >
    Pourquoi choisir Sensationnel optique ?!
  </h3>

  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    fontSize: '1.05rem',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    fontWeight: 500,
    marginBottom: '30px'
  }}>
    <span
      style={{
        flex: 1,
        height: '6px',
        background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3))',
      }}
    />
    <span
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 1000,
        fontStyle: 'normal',
        fontOpticalSizing: 'auto',
        color: '#000000',
      }}
    >
      👁️ Vision • Confort • Style 👓
    </span>
    <span
      style={{
        flex: 1,
        height: '6px',
        background: 'linear-gradient(to left, transparent, rgba(255,255,255,0.3))',
      }}
    />
  </div>

  <p style={{ 
    marginBottom: '20px', 
    fontSize: '0.95rem',
    color: '#000000',
    fontFamily: '"Syne", sans-serif',
    letterSpacing: '0.5px',
    textAlign: 'center'
  }}>
    Produit de qualité supérieure à prix cassé. Ne nous croyez pas sur parole.
    Essayez vous même, c'est <strong style={{ color: '#000000' }}>GRATUIT</strong> !
  </p>

  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
    maxWidth: '800px',
    margin: '0 auto 30px auto'
  }}>
    <div style={{
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(230, 211, 163, 0.3)',
      borderRadius: '12px',
      color: '#000000',
      fontFamily: '"BBH Hegarty", sans-serif',
      letterSpacing: '0.5px',
      
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🚚</div>
      <div style={{ fontWeight: 'bold', color: '#000000', marginBottom: '5px', fontFamily: '"Syne", sans-serif' }}>Livraison Express</div>
      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: '"Syne", sans-serif' }}>Gratuite sous 24 à 48H partout au Maroc</div>
    </div>

    <div style={{
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(230, 211, 163, 0.3)',
      borderRadius: '12px',
      color: '#000000',
      fontFamily: '"BBH Hegarty", sans-serif',
      letterSpacing: '0.5px'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔁</div>
      <div style={{ fontWeight: 'bold', color: '#000000', marginBottom: '5px', fontFamily: '"Syne", sans-serif' }}>Échanges gratuits</div>
      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: '"Syne", sans-serif' }}>Sans frais sous 14 jours</div>
    </div>

    <div style={{
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(230, 211, 163, 0.3)',
      borderRadius: '12px',
      color: '#000000',
      fontFamily: '"BBH Hegarty", sans-serif',
      letterSpacing: '0.5px'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🛡️</div>
      <div style={{ fontWeight: 'bold', color: '#000000', marginBottom: '5px', fontFamily: '"Syne", sans-serif' }}>Garantie 6 Mois</div>
      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: '"Syne", sans-serif' }}>Protection totale sur vos lunettes</div>
    </div>

    <div style={{
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(230, 211, 163, 0.3)',
      borderRadius: '12px',
      color: '#000000',
      fontFamily: '"BBH Hegarty", sans-serif',
      letterSpacing: '0.5px'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🏭</div>
      <div style={{ fontWeight: 'bold', color: '#000000', marginBottom: '5px', fontFamily: '"Syne", sans-serif' }}>Import Direct</div>
      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: '"Syne", sans-serif' }}>De l'usine fabricante</div>
    </div>

    <div style={{
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(230, 211, 163, 0.3)',
      borderRadius: '12px',
      color: '#000000',
      fontFamily: '"BBH Hegarty", sans-serif',
      letterSpacing: '0.5px'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔍</div>
      <div style={{ fontWeight: 'bold', color: '#000000', marginBottom: '5px', fontFamily: '"Syne", sans-serif' }}>Vérification Manuelle</div>
      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: '"Syne", sans-serif' }}>Contrôlée par nos soins</div>
    </div>

    <div style={{
      padding: '15px',
      backgroundColor: 'rgba(0, 0, 0, 0.45)',
      border: '1px solid rgba(230, 211, 163, 0.3)',
      borderRadius: '12px',
      color: '#000000',
      fontFamily: '"BBH Hegarty", sans-serif',
      letterSpacing: '0.5px'
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>📦</div>
      <div style={{ fontWeight: 'bold', color: '#000000', marginBottom: '5px', fontFamily: '"Syne", sans-serif' }}>Stock Renouvelé</div>
      <div style={{ fontSize: '0.9rem', color: '#ffffff', fontFamily: '"Syne", sans-serif' }}>Nouveaux produits chaque mois</div>
    </div>
  </div>

  <div style={{
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(230, 211, 163, 0.05)',
    border: '1px solid rgba(230, 211, 163, 0.2)',
    borderRadius: '12px',
    margin: '20px 0'
}}>
<p style={{ 
    marginBottom: '15px', 
    fontSize: '0.95rem',
    color: '#000000',
    fontFamily: '"Syne", sans-serif',
    letterSpacing: '0.5px',
    textAlign: 'center'
}}>
    Une expérience d'achat très fluide et <strong style={{ color: '#E6D3A3' }}>SANS RISQUE</strong>.
    Vous serez satisfaits ou bien satisfaits !
</p>

<p style={{ 
    fontSize: '0.95rem', 
    fontWeight: '500',
    color: '#000000',
    fontFamily: '"BBH Hegarty", sans-serif',
    letterSpacing: '0.5px',
    marginBottom: '15px'
}}>
    Qu'attendez-vous pour passer votre commande ?
</p>

<p
  style={{
    fontSize: '0.85rem',
    color: '#000000',
    fontFamily: '"Syne", sans-serif',
    letterSpacing: '0.5px',
    marginTop: '15px'
  }}
>
    NB : Si vous avez des doutes, des questions ou des suggestions,
    nous vous prions de nous contacter par WhatsApp en cliquant sur l'icône verte
    en bas à droite de votre écran.
</p>
</div>
</div>

            {/* LENSES MODAL - Détecte le type de produit par l'URL */}
            {isLensesModalOpen && (
                // Détection par URL (plus fiable car basé sur la navigation)
                (() => {
                    const pathname = window.location.pathname;
                    const isOptical = pathname.includes('/Optical/') || pathname.includes('/optical/');
                    return isOptical ? (
                        <OpticalLensesModal
                            product={product}
                            selectedColor={selectedColor}
                            onClose={() => setIsLensesModalOpen(false)} 
                            onFinish={({ quantity, prescriptionMethod, lensTypeChoice }) => {
                                handleAddToCart({ quantity, lensDetails: { prescriptionMethod, lensTypeChoice } });
                            }}
                        />
                    ) : (
                        <SunglassLensesModal
                            product={product}
                            selectedColor={selectedColor}
                            onClose={() => setIsLensesModalOpen(false)} 
                            onFinish={({ quantity, prescriptionMethod, lensTypeChoice }) => {
                                handleAddToCart({ quantity, lensDetails: { prescriptionMethod, lensTypeChoice } });
                            }}
                        />
                    );
                })()
            )}
        </div>
    );
};

export default ProductDetailMobile;