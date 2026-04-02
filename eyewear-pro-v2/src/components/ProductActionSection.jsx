import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';

const ProductActionSection = ({ product, onSelectLenses, onImmediateAddToCart }) => {
    const { cartItems, addToCart, updateCartItemQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    const isAvailable = product && product.inStock;

    // Vérifie si le produit existe déjà dans le panier
    const cartIndex = cartItems.findIndex(
        item =>
            item.product.id === product.id &&
            item.color === (product.colors[0] || null) &&
            !item.lensDetails
    );

    // Synchroniser la quantité avec le panier si le produit est déjà présent
    useEffect(() => {
        if (cartIndex !== -1) {
            setQuantity(cartItems[cartIndex].quantity);
        }
    }, [cartIndex, cartItems]);

    const incrementQuantity = () => {
        setQuantity(q => {
            const newQty = q + 1 > 10 ? 10 : q + 1; // Limite à 10
            if (cartIndex !== -1) updateCartItemQuantity(cartIndex, newQty);
            return newQty;
        });
    };

    const decrementQuantity = () => {
        setQuantity(q => {
            const newQty = q - 1 < 1 ? 1 : q - 1; // Limite à 1 minimum
            if (cartIndex !== -1) updateCartItemQuantity(cartIndex, newQty);
            return newQty;
        });
    };

    const handleAddToCart = () => {
        if (!isAvailable) return;
        if (cartIndex !== -1) {
            updateCartItemQuantity(cartIndex, quantity);
        } else {
            addToCart(product, product.colors[0] || null, quantity, null);
        }
    };

    if (!product) return null;

    const isMobile = window.innerWidth <= 768;

    return (
        <div style={{
            margin: '30px -15px 0 -15px',
            padding: '30px 20px',
            background: '#FFFFFF',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            position: 'relative',
            zIndex: 2
        }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                {/* Sélecteur de Quantité */}
                <div style={{ 
                    display: 'flex', 
                    border: '1px solid #ccc', 
                    borderRadius: '4px', 
                    minWidth: '100px',
                    backgroundColor: '#fff'
                }}>
                    <button
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        style={{ 
                            padding: '12px 16px', 
                            border: 'none', 
                            background: 'none', 
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: quantity <= 1 ? '#ccc' : '#000'
                        }}
                    >
                        −
                    </button>
                    <span style={{ 
                        padding: '12px 0', 
                        width: '40px', 
                        textAlign: 'center',
                        fontSize: '16px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {quantity}
                    </span>
                    <button
                        onClick={incrementQuantity}
                        disabled={quantity >= 10}
                        style={{ 
                            padding: '12px 16px', 
                            border: 'none', 
                            background: 'none', 
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: quantity >= 10 ? '#ccc' : '#000'
                        }}
                    >
                        +
                    </button>
                </div>

                {/* Bouton Select Lenses */}
                <button
                    onClick={onSelectLenses}
                    disabled={!isAvailable}
                    style={{
                        flexGrow: 1,
                        padding: isMobile ? '14px 18px' : '16px 20px',
                        backgroundColor: isAvailable ? '#D4AF37' : '#444',
                        color: isAvailable ? '#000000ff': '#999',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: isMobile ? '14px' : '16px',
                        fontWeight: 'bold',
                        cursor: isAvailable ? 'pointer' : 'not-allowed',
                        fontFamily: '"BBH Hegarty", sans-serif',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        transition: 'all 0.3s ease',
                        boxShadow: isAvailable ? '0 4px 12px rgba(212, 175, 55, 0.25)' : 'none'
                    }}
                    onMouseEnter={(e) => {
                        if (isAvailable) {
                            e.currentTarget.style.backgroundColor = '#B8941F';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.35)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (isAvailable) {
                            e.currentTarget.style.backgroundColor = '#D4AF37';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.25)';
                        }
                    }}
                >
                    Choisir les verres et acheter
                </button>
            </div>

            {/* Bouton Ajouter au Panier */}
            <button
                onClick={() => onImmediateAddToCart(quantity)}
                disabled={!isAvailable}
                style={{
                    width: '100%',
                    padding: isMobile ? '16px' : '18px',
                    backgroundColor: isAvailable ? '#000000ff' : '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: 'bold',
                    cursor: isAvailable ? 'pointer' : 'not-allowed',
                    fontFamily: '"BBH Hegarty", sans-serif',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    transition: 'all 0.3s ease',
                    boxShadow: isAvailable ? '0 4px 15px rgba(0, 0, 0, 0.2)' : 'none'
                }}
                onMouseEnter={(e) => {
                    if (isAvailable) {
                        e.currentTarget.style.backgroundColor = '#333';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3)';
                    }
                }}
                onMouseLeave={(e) => {
                    if (isAvailable) {
                        e.currentTarget.style.backgroundColor = '#000000ff';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    }
                }}
            >
                {isAvailable ? 'ACHETER MAINTENANT' : 'Indisponible'}
            </button>
        </div>
    );
};

export default ProductActionSection;
