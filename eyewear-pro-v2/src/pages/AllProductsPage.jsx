import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PocketBase from 'pocketbase';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    gender: '',
    type: '',
    bestseller: false
  });

  // Initialiser PocketBase directement
  const pb = new PocketBase(import.meta.env.VITE_PB_URL);

  // Récupérer tous les produits depuis PocketBase
  useEffect(() => {
    let cancelled = false;
    
    const fetchProducts = async () => {
      try {
        if (cancelled) return;
        setLoading(true);
        setError(null);
        
        console.log('📋 Récupération des produits depuis PocketBase...');
        console.log('🔗 URL PocketBase:', import.meta.env.VITE_PB_URL);
        
        // Construire les filtres
        let filterString = '';
        const filters = [];
        
        if (filter.gender) {
          filters.push(`gender ~ "${filter.gender}"`);
        }
        
        if (filter.type) {
          filters.push(`type ~ "${filter.type}"`);
        }
        
        if (filter.bestseller) {
          filters.push(`bestseller = true`);
        }
        
        if (filters.length > 0) {
          filterString = filters.join(' && ');
        }
        
        console.log('🔍 Filtre appliqué:', filterString || 'aucun');
        
        // Récupérer directement depuis PocketBase
        const records = await pb.collection('products').getFullList({
          filter: filterString,
          sort: '-created'
        });
        
        if (cancelled) return;
        
        console.log('✨ Données brutes reçues:', records.length, 'produits');

        if (!records || records.length === 0) {
          console.log('ℹ️ Aucun produit trouvé');
          if (cancelled) return;
          setProducts([]);
          setLoading(false);
          return;
        }

        // Formater les données
        const formattedProducts = records.map(record => {
          // Gérer les images
          let imageUrl = 'https://images.unsplash.com/photo-1511499767750-ae8a1eeaeeb?w=400&h=300&fit=crop';
          
          if (record.img) {
            imageUrl = pb.files.getURL(record, record.img);
          } else if (record.images && record.images.length > 0) {
            imageUrl = pb.files.getURL(record, record.images[0]);
          }
          
          return {
            id: record.id,
            name: record.name || 'Produit sans nom',
            image: imageUrl,
            price: record.price ? `${record.price} DH` : '0 DH',
            oldPrice: record.originalPrice && record.originalPrice !== record.price ? `${record.originalPrice} DH` : null,
            discount: record.promoPercentage && record.promoPercentage > 0 ? `-${record.promoPercentage}%` : null,
            category: record.gender || 'Lunettes',
            gender: Array.isArray(record.gender) ? record.gender : (record.gender ? [record.gender] : []),
            type: record.type || 'solaire',
            bestseller: record.bestseller || false,
            isNew: false
          };
        });

        if (cancelled) return;
        console.log(`✅ ${formattedProducts.length} produits formatés`);
        setProducts(formattedProducts);
      } catch (error) {
        if (cancelled) return;
        console.error('❌ Erreur lors du chargement des produits:', error);
        console.error('❌ Détails de l\'erreur:', {
          message: error.message,
          status: error.status,
          data: error.data
        });
        setError(`Erreur: ${error.message}`);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const handleProductClick = (productId) => {
    // Déterminer si c'est un produit solaire ou optique
    const product = products.find(p => p.id === productId);
    if (product?.type === 'solaire') {
      navigate(`/sunglasses/detail/${productId}`);
    } else {
      navigate(`/optical/detail/${productId}`);
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#0e0e0ead',
      padding: '20px 16px 60px 16px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
    },
    title: {
      fontFamily: '"BBH Hegarty", sans-serif',
      fontWeight: 400,
      letterSpacing: '1.5px',
      color: '#070707ff',
      textTransform: 'uppercase',
      fontSize: '2rem',
      margin: '0 0 20px 0',
    },
    filters: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      flexWrap: 'wrap',
      marginBottom: '30px',
    },
    filterButton: {
      backgroundColor: '#1a1a1a',
      color: '#f2f2f2',
      border: '1px solid rgba(242, 242, 242, 0.3)',
      borderRadius: '25px',
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    filterButtonActive: {
      backgroundColor: '#070707',
      color: '#E6D3A3',
      border: '1px solid rgba(230, 211, 163, 0.5)',
    },
    productsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    productCard: {
      backgroundColor: '#1a1a1a',
      borderRadius: '20px',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      height: '400px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    productImage: {
      width: '100%',
      height: '250px',
      objectFit: 'cover',
      backgroundColor: '#333',
    },
    productInfo: {
      padding: '15px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    productName: {
      fontFamily: '"BBH Hegarty", sans-serif',
      fontSize: '16px',
      fontWeight: 600,
      color: '#f2f2f2',
      margin: '0 0 10px 0',
      lineHeight: '1.3',
    },
    productPrice: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '8px',
    },
    currentPrice: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#E6D3A3',
    },
    oldPrice: {
      fontSize: '14px',
      color: '#999',
      textDecoration: 'line-through',
    },
    badge: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      backgroundColor: '#e21b1b',
      color: '#fff',
      fontSize: '11px',
      fontWeight: '700',
      padding: '5px 10px',
      borderRadius: '15px',
      textTransform: 'uppercase',
    },
    loading: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#f2f2f2',
      fontSize: '18px',
    },
    error: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#e21b1b',
      fontSize: '16px',
    },
    empty: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#999',
      fontSize: '16px',
    },
    debug: {
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000,
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          🔄 Chargement des produits...
        </div>
        <div style={styles.debug}>
          Debug: URL PB = {import.meta.env.VITE_PB_URL}<br/>
          Loading: {loading ? 'Yes' : 'No'}<br/>
          Products count: {products.length}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          ❌ Erreur: {error}
        </div>
        <div style={styles.debug}>
          Debug: URL PB = {import.meta.env.VITE_PB_URL}<br/>
          Error: {error}<br/>
          Check console for details
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Tous nos produits</h1>
        <p style={{ color: '#999', marginBottom: '30px' }}>
          {products.length} produit{products.length > 1 ? 's' : ''} disponible{products.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Filtres */}
      <div style={styles.filters}>
        <button
          style={{
            ...styles.filterButton,
            ...(filter.gender === '' ? styles.filterButtonActive : {})
          }}
          onClick={() => handleFilterChange({ gender: '' })}
        >
          Tous
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter.gender === 'homme' ? styles.filterButtonActive : {})
          }}
          onClick={() => handleFilterChange({ gender: 'homme' })}
        >
          Homme
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter.gender === 'femme' ? styles.filterButtonActive : {})
          }}
          onClick={() => handleFilterChange({ gender: 'femme' })}
        >
          Femme
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter.type === 'solaire' ? styles.filterButtonActive : {})
          }}
          onClick={() => handleFilterChange({ type: 'solaire' })}
        >
          Lunettes de soleil
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter.type === 'optique' ? styles.filterButtonActive : {})
          }}
          onClick={() => handleFilterChange({ type: 'optique' })}
        >
          Lunettes optiques
        </button>
        <button
          style={{
            ...styles.filterButton,
            ...(filter.bestseller ? styles.filterButtonActive : {})
          }}
          onClick={() => handleFilterChange({ bestseller: !filter.bestseller })}
        >
          Bestsellers
        </button>
      </div>

      {/* Grille de produits */}
      {products.length === 0 ? (
        <div style={styles.empty}>
          📦 Aucun produit trouvé pour ces critères
        </div>
      ) : (
        <div style={styles.productsGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              style={styles.productCard}
              onClick={() => handleProductClick(product.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {product.bestseller && (
                <div style={styles.badge}>Bestseller</div>
              )}
              {product.discount && (
                <div style={{
                  ...styles.badge,
                  top: product.bestseller ? '45px' : '10px',
                  backgroundColor: '#ff6b35'
                }}>
                  {product.discount}
                </div>
              )}
              
              <img
                src={product.image}
                alt={product.name}
                style={styles.productImage}
                onError={(e) => {
                  console.log('❌ Image error for:', product.name, 'URL:', product.image);
                  e.target.src = 'https://images.unsplash.com/photo-1511499767750-ae8a1eeaeeb?w=400&h=300&fit=crop';
                }}
              />
              
              <div style={styles.productInfo}>
                <div>
                  <h3 style={styles.productName}>
                    {product.name}
                  </h3>
                  <div style={styles.productPrice}>
                    <span style={styles.currentPrice}>
                      {product.price}
                    </span>
                    {product.oldPrice && (
                      <span style={styles.oldPrice}>
                        {product.oldPrice}
                      </span>
                    )}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    textTransform: 'capitalize'
                  }}>
                    {product.gender?.join(', ') || 'Unisex'} • {product.type}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Debug info */}
      <div style={styles.debug}>
        Debug: URL PB = {import.meta.env.VITE_PB_URL}<br/>
        Products: {products.length}<br/>
        Filter: {JSON.stringify(filter)}
      </div>
    </div>
  );
};

export default ProductsPage;
