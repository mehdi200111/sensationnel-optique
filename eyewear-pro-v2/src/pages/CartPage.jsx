import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, updateCartItemQuantity } = useCart();
  const navigate = useNavigate();

  const totalGlobal = cartItems.reduce((acc, item) => {
    const framePrice = item.product?.price || 0;
    const lensesPrice = item.lensDetails?.lensTypeChoice?.price || 0;
    return acc + (framePrice + lensesPrice) * item.quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: '"BBH Hegarty", sans-serif',
        padding: '40px 20px'
      }}>
        <h2 style={{
          color: '#000000',
          fontSize: '2rem',
          marginBottom: '20px',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Votre panier est vide 
        </h2>
        <p style={{
          color: '#000000',
          fontSize: '1rem',
          marginBottom: '30px'
        }}>
          Ajoutez des lunettes pour commencer votre commande.
        </p>
        <Link 
          to="/"
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '30px',
            border: '2px solid #D4AF37',
            backgroundColor: '#D4AF37',
            color: '#000000',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            fontFamily: '"BBH Hegarty", sans-serif',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            display: 'inline-block',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#B8941F';
            e.currentTarget.style.color = '#000000';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#D4AF37';
            e.currentTarget.style.color = '#000000';
          }}
        >
          Retour a l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      padding: '40px 20px',
      fontFamily: '"BBH Hegarty", sans-serif'
    }}>
      <h1 style={{
        fontSize: '2rem',
        marginBottom: '40px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: '#000000',
        textAlign: 'center',
        marginTop: '70px'
      }}>
        Votre panier
      </h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto 0 auto'
      }}>
        {/* LISTE DES PRODUITS */}
        <div>
          
          {cartItems.map((item, index) => {
            const framePrice = item.product.price || 0;
            const lensesPrice = item.lensDetails?.lensTypeChoice?.price || 0;
            const lineTotal = (framePrice + lensesPrice) * item.quantity;

            return (
              <div 
                key={index} 
                style={{
                  display: 'flex',
                  gap: '20px',
                  padding: '15px',
                  backgroundColor: 'rgba(37, 37, 37, 0.8)',
                  borderRadius: '20px',
                  border: '1px solid rgba(230, 211, 163, 0.1)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  marginBottom: '20px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '100%',
                  boxSizing: 'border-box',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(230, 211, 163, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(230, 211, 163, 0.1)';
                }}
                onClick={() => {
                  // Déterminer le type de produit et naviguer vers la bonne page de détail
                  const productType = item.product.type || 'solaire';
                  if (productType === 'optique') {
                    navigate(`/optical/detail/${item.product.id}`);
                  } else {
                    navigate(`/sunglasses/detail/${item.product.id}`);
                  }
                }}
              >
                {/* Styles mobile uniquement pour améliorer la lisibilité */}
                <style>{`
                  @media (max-width: 768px) {
                    .cart-item {
                      flex-direction: column !important;
                      gap: 12px !important;
                      padding: 16px !important;
                      width: 100% !important;
                      max-width: 100vw !important;
                      left: 0 !important;
                      margin-left: 0 !important;
                      margin-right: 0 !important;
                    }
                    .cart-item-image {
                      width: 100% !important;
                      height: 200px !important;
                      minWidth: 100% !important;
                      maxWidth: 100% !important;
                      margin-top: 0 !important;
                    }
                    .cart-item-content {
                      width: 100% !important;
                      margin-left: 0 !important;
                    }
                    .cart-item-title {
                      font-size: 1.1rem !important;
                      margin-bottom: 10px !important;
                      white-space: normal !important;
                      margin-left: 0 !important;
                    }
                    .cart-item-price {
                      font-size: 1.3rem !important;
                      margin-bottom: 14px !important;
                      margin-left: 0 !important;
                    }
                    .cart-item-details {
                      margin-bottom: 16px !important;
                      margin-left: 0 !important;
                    }
                    .cart-item-details p {
                      font-size: 0.9rem !important;
                      margin-bottom: 6px !important;
                      margin-left: 0 !important;
                    }
                    .cart-item-actions {
                      flex-direction: column !important;
                      gap: 12px !important;
                      width: 100% !important;
                      margin-left: 0 !important;
                    }
                    .quantity-selector {
                      width: 100% !important;
                      max-width: 200px !important;
                      margin: 0 auto !important;
                      justify-content: center !important;
                    }
                    .delete-button {
                      position: static !important;
                      width: 100% !important;
                      height: auto !important;
                      padding: 10px !important;
                      border-radius: 8px !important;
                      margin-left: 0 !important;
                    }
                    .clear-cart-button {
                      margin: 20px 0 !important;
                      padding: 10px 20px !important;
                      font-size: 0.9rem !important;
                      width: 100% !important;
                      max-width: 100% !important;
                    }
                    .summary-section {
                      position: static !important;
                      margin-top: 25px !important;
                      width: 100% !important;
                      margin-left: 0 !important;
                    }
                    .summary-title {
                      font-size: 1rem !important;
                    }
                    .total-amount {
                      font-size: 1.8rem !important;
                    }
                    .checkout-button {
                      padding: 18px 20px !important;
                      font-size: 1rem !important;
                      white-space: normal !important;
                    }
                  }
                  @media (max-width: 480px) {
                    .cart-item {
                      padding: 12px !important;
                    }
                    .cart-item-image {
                      height: 150px !important;
                    }
                    .cart-item-title {
                      font-size: 1rem !important;
                    }
                    .cart-item-price {
                      font-size: 1.1rem !important;
                    }
                  }
                `}</style>
                
                {/* 1. PHOTO (À GAUCHE) */}
                <div className="cart-item-image" style={{ 
                  width: '160px', 
                  height: '160px', 
                  minWidth: '160px', 
                  maxWidth: '160px',  
                  overflow: 'hidden', 
                  position: 'center',
                  marginTop: '0',
                  flexShrink: 0
                }}>
                  <img
                    src={item.product.images?.[0] || "https://via.placeholder.com/150"}
                    alt={item.product.name}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'contain',
                      display:'block'
                    }}
                  />
                </div>

                {/* 2. LE BLOC À DROITE DE LA PHOTO */}
                <div className="cart-item-content" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  flexGrow: 1, 
                  justifyContent: 'space-between'
                }}>
                  
                  {/* Titre et prix */}
                  <div>
                    <h3 
                      className="cart-item-title" 
                      style={{ 
                        margin: '0 0 10px 0',
                        fontWeight: '600', 
                        fontSize: '1rem', 
                        color: '#E6D3A3', 
                        lineHeight: '1.2',
                        letterSpacing: '1px',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        fontFamily: 'serif'
                      }}
                    >
                      {item.product.name}
                    </h3>

                    <div className="cart-item-price" style={{ 
                      margin: '0 0 15px 0',
                      fontWeight: '700', 
                      fontSize: '1.3rem', 
                      color: '#f2f2f2', 
                      lineHeight: '1.2',
                      fontFamily: 'Inter, sans-serif'
                    }}>
                      {lineTotal} DH
                    </div>

                    {/* Détails (Verres) */}
                    <div className="cart-item-details" style={{ marginBottom: '15px' }}>
                      {item.lensDetails?.lensTypeChoice && (
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#ffffffff', fontFamily: 'sans-serif' }}>
                          Verres : {item.lensDetails.lensTypeChoice.type}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3. BLOC QUANTITÉ ET SUPPRIMER */}
                  <div className="cart-item-actions" style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                  }}>
                    {/* Sélecteur de quantité */}
                    <div className="quantity-selector" style={{ 
                      display: 'flex', 
                      border: '1px solid rgba(230, 211, 163, 0.3)', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(26, 26, 26, 0.8)',
                      overflow: 'hidden',
                      minWidth: '140px',
                      maxWidth: '140px',
                      flexShrink: 0
                    }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartItemQuantity(index, Math.max(1, item.quantity - 1));
                        }} 
                        style={{ 
                          padding: '10px 10px', 
                          border: 'none', 
                          background: 'none', 
                          cursor: 'pointer',
                          color: '#E6D3A3',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease',
                          minWidth: '40px',
                          minHeight: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(230, 211, 163, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        −
                      </button>
                      <span style={{ 
                        padding: '10px 10px', 
                        borderLeft: '1px solid rgba(230, 211, 163, 0.3)', 
                        borderRight: '1px solid rgba(230, 211, 163, 0.3)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        color: '#f2f2f2',
                        minWidth: '40px',
                        minHeight: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartItemQuantity(index, item.quantity + 1);
                        }} 
                        style={{ 
                          padding: '10px 14px', 
                          border: 'none', 
                          background: 'none', 
                          cursor: 'pointer',
                          color: '#E6D3A3',
                          fontSize: '1.1rem',
                          transition: 'all 0.3s ease',
                          minWidth: '40px',
                          minHeight: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(230, 211, 163, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* Bouton Supprimer - Icône poubelle en haut à droite */}
                    <button 
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(index);
                      }} 
                      style={{ 
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        width: '25px',
                        height: '25px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 68, 68, 0.1)',
                        border: '1px solid rgba(255, 68, 68, 0.2)',
                        color: '#ffffff',
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.2)';
                        e.currentTarget.style.color = '#ff4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.1)';
                        e.currentTarget.style.color = '#ffffff';
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* BOUTON VIDER LE PANIER - Couleur bandeau */}
          <button 
            className="clear-cart-button"
            onClick={clearCart} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#000000',
              backgroundColor: '#E6D3A3',
              border: '2px solid #E6D3A3', 
              borderRadius: '20px', 
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase', 
              letterSpacing: '0.5px',
              margin: '20px 0',
              width: '100%',
              maxWidth: '300px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.borderColor = '#D4AF37';
              e.currentTarget.style.color = '#000000';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#E6D3A3';
              e.currentTarget.style.borderColor = '#E6D3A3';
              e.currentTarget.style.color = '#000000';
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            Vider le panier
          </button>
        </div>

        {/* COLONNE RÉCAPITULATIF (DROITE) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          width: '100%',
          maxWidth: '100%'
        }}>
          <div className="summary-section" style={{
            backgroundColor: 'rgba(37, 37, 37, 0.8)',
            borderRadius: '10px',
            border: '1px solid rgba(230, 211, 163, 0.1)',
            padding: '20px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '10px 16px',
              backgroundColor: 'rgba(230, 211, 163, 0.1)',
              border: '1px solid rgba(230, 211, 163, 0.2)',
              borderRadius: '12px',
              marginBottom: '12px'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E6D3A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7"></path>
              </svg>
              <span style={{ 
                fontSize: '0.8rem', 
                fontWeight: '500', 
                color: '#E6D3A3',
                letterSpacing: '0.8px',
                whiteSpace: 'nowrap'
              }}>
                🚚 Livraison gratuite offerte
              </span>
            </div>

            <div style={{
              paddingTop: '12px',
              borderTop: '1px solid rgba(230, 211, 163, 0.2)',
              marginBottom: '15px'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline'
              }}>
                <span className="summary-title" style={{ 
                  fontSize: '0.9rem', 
                  color: '#999', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  Sous-total
                </span>
                <div style={{ textAlign: 'right' }}>
                  <span className="total-amount" style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '700', 
                    color: '#E6D3A3',
                    fontFamily: ' sans-serif'
                  }}>
                    {totalGlobal}
                  </span>
                  <span style={{ 
                    fontSize: '0.9rem', 
                    fontWeight: '700', 
                    marginLeft: '4px',
                    color: '#f2f2f2' ,
                    fontFamily: ' sans-serif'
                  }}>
                    DH
                  </span>
                </div>
              </div>
              <p style={{ 
                margin: '6px 0 0 0', 
                fontSize: '0.7rem', 
                color: '#999', 
                textAlign: 'center'
                
              }}>
                Taxes incluses et frais de port offerts
              </p>
            </div>

            <Link 
              to="/checkout"
              className="checkout-button"
              style={{
                textDecoration: 'none',
                backgroundColor: '#CCA042',
                color: '#ffffffff',
                padding: '16px 24px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease',
                boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
                fontWeight: '400',
                width: '100%',
                marginBottom: '16px',
                fontFamily: '"BBH Hegarty", sans-serif',
                fontSize: '0.9rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.35)';
              }}
            >
              <span style={{ 
                fontSize: '0.9rem', 
                fontWeight: '700', 
                letterSpacing: '1px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                Verifier la commande
              </span>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                transition: 'transform 0.3s ease'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;