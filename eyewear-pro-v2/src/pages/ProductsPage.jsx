import React, { useState, useEffect } from 'react';
import { productsService, productsApi } from '../services/pocketbaseService';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        console.log('Début récupération produits...');
        console.log('URL PocketBase:', import.meta.env.VITE_PB_URL);
        
        const result = await productsService.getFullList();
        
        console.log('Résultat brut:', result);
        
        if (result.success) {
            console.log('Données reçues:', result.data);
            console.log('Type de données:', typeof result.data);
            console.log('Est un tableau?', Array.isArray(result.data));
            
            // Normaliser les produits pour avoir les bonnes propriétés
            const normalizedProducts = result.data.map(product => ({
                id: product.id,
                name: product.name || 'Product Name',
                price: product.price || 0,
                description: product.description || 'No description available',
                img: product.img || '',
                images: product.images || [],
                gender: product.gender || '',
                colors: product.colors || [],
                inStock: product.inStock !== false,
                stockCount: product.stockCount || 0,
                originalPrice: product.originalPrice || 0,
                promoPercentage: product.promoPercentage || 0
            }));
            
            setProducts(normalizedProducts);
            setError('');
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleCreateProduct = async (productData) => {
        const result = await productsService.create(productData);
        if (result.success) {
            setProducts([...products, result.data]);
            return true;
        } else {
            setError(result.error);
            return false;
        }
    };

    const handleUpdateProduct = async (id, productData) => {
        const result = await productsService.update(id, productData);
        if (result.success) {
            setProducts(products.map(p => p.id === id ? result.data : p));
            return true;
        } else {
            setError(result.error);
            return false;
        }
    };

    const handleDeleteProduct = async (id) => {
        const result = await productsService.delete(id);
        if (result.success) {
            setProducts(products.filter(p => p.id !== id));
            return true;
        } else {
            setError(result.error);
            return false;
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: '"BBH Hegarty", sans-serif'
            }}>
                <div style={{
                    textAlign: 'center',
                    color: '#E6D3A3'
                }}>
                    <div style={{
                        fontSize: '1.5rem',
                        marginBottom: '20px',
                        letterSpacing: '1px'
                    }}>
                        Loading Products
                    </div>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(230, 211, 163, 0.3)',
                        borderTop: '3px solid #E6D3A3',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                </div>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                minHeight: '100vh',
                backgroundColor: '#1a1a1a',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: '"BBH Hegarty", sans-serif',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: 'rgba(244, 67, 54, 0.1)',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    borderRadius: '12px',
                    padding: '30px',
                    textAlign: 'center',
                    maxWidth: '500px'
                }}>
                    <h2 style={{
                        color: '#ff4444',
                        fontSize: '1.5rem',
                        marginBottom: '15px',
                        letterSpacing: '1px'
                    }}>
                        Error Loading Products
                    </h2>
                    <p style={{
                        color: '#f2f2f2',
                        fontSize: '1rem',
                        lineHeight: '1.5',
                        marginBottom: '20px'
                    }}>
                        {error}
                    </p>
                    <button 
                        onClick={fetchProducts}
                        style={{
                            backgroundColor: '#E6D3A3',
                            color: '#1a1a1a',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '12px 24px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(230, 211, 163, 0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#1a1a1a',
            padding: '40px 20px',
            fontFamily: '"BBH Hegarty", sans-serif'
        }}>
            <h1 style={{
                color: '#E6D3A3',
                fontSize: '2rem',
                textAlign: 'center',
                marginBottom: '40px',
                letterSpacing: '2px',
                textTransform: 'uppercase'
            }}>
                Products Management
            </h1>
            
            {error && (
                <div style={{
                    backgroundColor: '#ff4444',
                    color: 'white',
                    padding: '15px',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    Error: {error}
                </div>
            )}
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {products.map(product => (
                    <div key={product.id} style={{
                        backgroundColor: '#252525',
                        border: '1px solid rgba(230, 211, 163, 0.2)',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        transition: 'transform 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}>
                        {product.img && (
                            <img 
                                src={product.img} 
                                alt={product.name}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    marginBottom: '15px'
                                }}
                            />
                        )}
                        <h3 style={{
                            color: '#E6D3A3',
                            fontSize: '1.2rem',
                            marginBottom: '10px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {product.name}
                        </h3>
                        <p style={{
                            color: '#f2f2f2',
                            fontSize: '1.1rem',
                            marginBottom: '8px',
                            fontWeight: 'bold'
                        }}>
                            Price: ${product.price}
                        </p>
                        {product.originalPrice && product.originalPrice > product.price && (
                            <p style={{
                                color: '#999',
                                fontSize: '0.9rem',
                                textDecoration: 'line-through',
                                marginBottom: '8px'
                            }}>
                                Original: ${product.originalPrice}
                            </p>
                        )}
                        <p style={{
                            color: '#ccc',
                            fontSize: '0.9rem',
                            marginBottom: '10px',
                            lineHeight: '1.4'
                        }}>
                            {product.description}
                        </p>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '15px'
                        }}>
                            <span style={{
                                color: product.inStock ? '#4CAF50' : '#f44336',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                style={{
                                    backgroundColor: '#ff4444',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '8px 16px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    transition: 'background-color 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#cc0000';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#ff4444';
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;
