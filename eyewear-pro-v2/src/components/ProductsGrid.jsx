import React from 'react';
import { useProducts } from '../hooks/useProducts.js';

const ProductsGrid = ({ filters = {} }) => {
  const { products, loading, error } = useProducts(filters);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Chargement des produits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
        <div>Erreur: {error}</div>
        <div>Vérifiez votre connexion PocketBase</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Aucun produit trouvé</div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem',
      padding: '2rem'
    }}>
      {products.map((product) => (
        <div
          key={product.id}
          style={{
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'white',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          {/* Image */}
          <div style={{ height: '200px', backgroundColor: '#f5f5f5' }}>
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#999'
              }}>
                Pas d'image
              </div>
            )}
          </div>

          {/* Infos */}
          <div style={{ padding: '1rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
              {product.name}
            </h3>
            
            <div style={{ marginBottom: '0.5rem' }}>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  marginRight: '0.5rem'
                }}>
                  {product.originalPrice} DH
                </span>
              )}
              <span style={{ fontWeight: 'bold', color: '#333' }}>
                {product.price} DH
              </span>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '0.5rem' }}>
                <small>Couleurs: {product.colors.join(', ')}</small>
              </div>
            )}

            {product.gender && (
              <div style={{ marginBottom: '0.5rem' }}>
                <small>Genre: {Array.isArray(product.gender) ? product.gender.join(', ') : product.gender}</small>
              </div>
            )}

            {product.type && (
              <div style={{ marginBottom: '1rem' }}>
                <small>Type: {product.type}</small>
              </div>
            )}

            <button
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
              onClick={() => {
                // Naviguer vers la page de détail
                window.location.href = `/detail/${product.id}`;
              }}
            >
              Voir les détails
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsGrid;
