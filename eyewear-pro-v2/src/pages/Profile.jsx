import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { historiqueCommandesService } from '../services/pocketbaseService';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [activeTab, setActiveTab] = useState('orders');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // États pour les différentes sections
    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        birthDate: ''
    });
    
    const [wishlist, setWishlist] = useState([]);
    
    // Synchroniser les favoris depuis localStorage et écouter les mises à jour
    useEffect(() => {
        // Charger les favoris au montage SEULEMENT si utilisateur connecté
        if (user) {
            const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (savedFavorites.length > 0) {
                setWishlist(savedFavorites);
            }
        }
        
        // Écouter les mises à jour des favoris SEULEMENT si utilisateur connecté
        const handleFavoritesUpdate = (event) => {
            if (user) {
                setWishlist(event.detail);
            }
        };
        
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
        
        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
        };
    }, [user]);
    
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    
    const [orders, setOrders] = useState([]);

    // Récupérer l'historique des commandes depuis PocketBase
    useEffect(() => {
        const fetchHistoriqueCommandes = async () => {
            if (user) {
                setIsLoading(true);
                try {
                    const result = await historiqueCommandesService.getUserHistoriqueCommandes();
                    if (result.success) {
                        console.log('Données brutes de l\'API:', result.data);
                        
                        // Transformer les données des commandes au format attendu
                        const formattedOrders = result.data.map(commande => {
                            // Parser le JSON des produits avec gestion d'erreur robuste
                            let parsedItems = [];
                            
                            if (Array.isArray(commande.produits)) {
                                parsedItems = commande.produits;
                            } else if (typeof commande.produits === 'string') {
                                try {
                                    parsedItems = JSON.parse(commande.produits);
                                } catch (e) {
                                    console.error('Erreur parsing produits:', e);
                                }
                            }
                            
                            return {
                                id: commande.id,
                                order_id: commande.id,
                                date: new Date(commande.dateCommande).toLocaleDateString('fr-FR'),
                                status: commande.statut,
                                total: commande.total,
                                items: parsedItems, // ← PRODUITS PocketBase
                                user_name: commande.prenom && commande.nom ? 
                                    `${commande.prenom} ${commande.nom}` : 
                                    commande.email || 'Utilisateur inconnu'
                            };
                        });
                        
                        console.log('Données formatées:', formattedOrders);
                        setOrders(formattedOrders);
                        
                        // Calculer les points de fidélité (1 point par 1 DH dépensé)
                        const totalConfirmedOrders = formattedOrders
                            .filter(order => order.status === 'Confirmée')
                            .reduce((sum, order) => sum + (order.total || 0), 0);
                        
                        // 1 point par 1 DH dépensé
                        const calculatedPoints = Math.floor(totalConfirmedOrders);
                        setLoyaltyPoints(calculatedPoints);
                        
                    } else {
                        console.error('Erreur API:', result.error);
                        // Ne pas afficher de message d'erreur à l'utilisateur
                    }
                } catch (error) {
                    console.error('Erreur catch:', error);
                    // Ne pas afficher de message d'erreur à l'utilisateur
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchHistoriqueCommandes();
    }, [user]);

    // Styles
    const containerStyle = {
        minHeight: '100vh',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        fontFamily: '"Syne", sans-serif'
    };

    const profileContainerStyle = {
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        overflow: 'hidden'
    };

    const headerStyle = {
        background: 'linear-gradient(135deg, #cca042 0%, #b8941f 100%)',
        color: 'white',
        padding: '20px 15px',
        textAlign: 'center'
    };

    const tabsContainerStyle = {
        display: 'flex',
        overflowX: 'auto',
        borderBottom: '1px solid #e9ecef',
        backgroundColor: '#f8f9fa',
        whiteSpace: 'nowrap',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
    };

    const tabStyle = (isActive) => ({
        padding: '12px 15px',
        cursor: 'pointer',
        border: 'none',
        backgroundColor: isActive ? '#cca042' : 'transparent',
        color: isActive ? 'white' : '#495057',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        fontSize: '14px',
        minWidth: '80px',
        flexShrink: 0
    });

    const contentStyle = {
        padding: '20px 15px'
    };

    const sectionStyle = {
        marginBottom: '25px'
    };

    const sectionTitleStyle = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '15px',
        borderBottom: '2px solid #cca042',
        paddingBottom: '8px'
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 10px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        marginBottom: '12px',
        boxSizing: 'border-box',
        minHeight: '44px'
    };

    const buttonStyle = {
        backgroundColor: '#cca042',
        color: 'white',
        border: 'none',
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        minHeight: '44px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
    };

    const messageStyle = (type) => ({
        padding: '12px',
        borderRadius: '6px',
        marginBottom: '15px',
        backgroundColor: type === 'success' ? '#d4edda' : '#f8d7da',
        color: type === 'success' ? '#155724' : '#721c24',
        border: `1px solid ${type === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
        fontSize: '14px'
    });

    // Gestionnaires d'événements
    const handlePersonalInfoUpdate = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // Simuler une mise à jour API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Informations mises à jour avec succès!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Erreur lors de la mise à jour' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleWishlistRemove = (id) => {
        // Supprimer du state local
        setWishlist(wishlist.filter(item => item.id !== id));
        
        // Supprimer du localStorage et émettre l'événement de mise à jour
        const updatedFavorites = wishlist.filter(item => item.id !== id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: updatedFavorites }));
    };

    // Mettre à jour le statut d'une commande dans l'historique
    const handleUpdateStatut = async (commandeId, nouveauStatut) => {
        setIsLoading(true);
        try {
            const result = await historiqueCommandesService.updateStatut(commandeId, nouveauStatut);
            if (result.success) {
                // Mettre à jour l'état local
                setOrders(prevOrders => 
                    prevOrders.map(order => 
                        order.id === commandeId 
                            ? { ...order, status: nouveauStatut }
                            : order
                    )
                );
                setMessage({ 
                    type: 'success', 
                    text: `Statut de la commande mis à jour: ${nouveauStatut}` 
                });
            } else {
                console.error('Erreur update API:', result.error);
                setMessage({ 
                    type: 'error', 
                    text: `Erreur lors de la mise à jour: ${result.error || 'Erreur inconnue'}` 
                });
            }
        } catch (error) {
            console.error('Erreur update catch:', error);
            // Gestion spécifique des erreurs de mise à jour
            let errorMessage = 'Erreur lors de la mise à jour du statut';
            
            if (error.status === 404) {
                errorMessage = 'Commande non trouvée. Elle peut avoir été supprimée.';
            } else if (error.status === 403) {
                errorMessage = 'Permission refusée pour modifier cette commande.';
            } else if (error.status === 400) {
                errorMessage = 'Données invalides. Vérifiez le format de la requête.';
            } else if (error.status >= 500) {
                errorMessage = 'Erreur serveur lors de la mise à jour. Veuillez réessayer.';
            }
            
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Fonction de test pour simuler différents cas d'erreur (à désactiver en production)
    const testErrorCases = () => {
        console.log('🧪 Test des cas d\'erreur activé');
        
        // Test 1: Erreur de chargement des commandes
        setTimeout(() => {
            setMessage({ 
                type: 'error', 
                text: 'Test: Erreur de connexion à la base de données (code: DB_CONNECTION_FAILED)' 
            });
        }, 1000);

        // Test 2: Erreur de mise à jour de statut
        setTimeout(() => {
            setMessage({ 
                type: 'error', 
                text: 'Test: Permission refusée pour modifier cette commande (code: PERMISSION_DENIED)' 
            });
        }, 3000);

        // Test 3: Erreur de parsing JSON
        setTimeout(() => {
            setMessage({ 
                type: 'error', 
                text: 'Test: Format des données invalides (code: INVALID_JSON_FORMAT)' 
            });
        }, 5000);

        // Test 4: Succès pour vérifier la réinitialisation
        setTimeout(() => {
            setMessage({ 
                type: 'success', 
                text: 'Test: Opération réussie - les messages fonctionnent correctement' 
            });
        }, 7000);
    };

    // Fonction pour effacer les messages
    const clearMessages = () => {
        setMessage({ type: '', text: '' });
    };

    // Rendu du contenu selon l'onglet actif
    const renderContent = () => {
        switch (activeTab) {
            
            case 'orders':
                return (
                    <div>
                        <h2 style={sectionTitleStyle}>Historique des Commandes</h2>
                        
                                                
                        {message.text && (
                            <div style={messageStyle(message.type)}>
                                {message.text}
                            </div>
                        )}
                        {isLoading ? (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p>Chargement de l'historique des commandes...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                                <p style={{ color: '#666' }}>Aucune commande dans l'historique</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <h4 style={{ margin: '0', color: '#333' }}>Commande #{order.order_id || order.id}</h4>
                                            <p style={{ margin: '5px 0', color: '#666' }}>Date: {order.date}</p>
                                        </div>
                                        <div style={{ textAlign: 'right', minWidth: '120px' }}>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                backgroundColor: 
                                                    order.status === 'Expédiée' ? '#ff9800' : 
                                                    order.status === 'Confirmée' ? '#28a745' : '#fff3cd',
                                                color: 
                                                    order.status === 'Expédiée' ? '#fff' : 
                                                    order.status === 'Confirmée' ? '#fff' : '#856404',
                                                whiteSpace: 'nowrap',
                                                display: 'inline-block'
                                            }}>
                                                {order.status}
                                            </span>
                                            <p style={{ margin: '5px 0', fontWeight: '600', color: '#333' }}>{order.total}DH</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h5 style={{ margin: '0 0 10px 0', color: '#555', fontSize: '14px' }}>Produits commandés:</h5>
                                        {order.items.length > 0 ? (
                                            order.items.map((item, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        padding: '6px 0',
                                                        borderBottom: '1px solid #f0f0f0',
                                                    }}
                                                >
                                                    <div>
                                                        <strong>
                                                            {item.quantite}x {item.nom}
                                                        </strong>
                                                    </div>

                                                    {item.couleur && (
                                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                                            Couleur : {item.couleur}
                                                        </div>
                                                    )}

                                                    {item.lentilles?.lensTypeChoice?.type && (
                                                        <div style={{ fontSize: '14px', color: '#666' }}>
                                                            Lentilles : {item.lentilles.lensTypeChoice.type}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{ fontStyle: 'italic', color: '#999' }}>
                                                Aucun produit trouvé
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                );

            case 'wishlist':
                return (
                    <div>
                        <h2 style={sectionTitleStyle}>Ma Liste de Souhaits</h2>
                        {!user ? (
                            <div style={{ 
                                padding: '40px', 
                                textAlign: 'center', 
                                backgroundColor: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef',
                                color: '#6c757d',
                                fontFamily: '"Montserrat", sans-serif'
                            }}>
                                Veuillez vous connecter pour voir vos favoris
                            </div>
                        ) : (
                            <>
                                {wishlist.length === 0 ? (
                                    <div style={{ 
                                        padding: '40px', 
                                        textAlign: 'center', 
                                        backgroundColor: '#f8f9fa',
                                        borderRadius: '8px',
                                        border: '1px solid #e9ecef',
                                        color: '#6c757d',
                                        fontFamily: '"Montserrat", sans-serif'
                                    }}>
                                        Vous n'avez pas encore de favoris
                                    </div>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                                        {wishlist.map(item => (
                                            <div key={item.id} style={{
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                padding: '15px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onClick={() => window.location.href = `/sunglasses/detail/${item.id}`}
                                            onMouseOver={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
                                            }}
                                            onMouseOut={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                                            }}>
                                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
                                                <h4 style={{ margin: '10px 0', color: '#333', fontSize: '16px' }}>{item.name}</h4>
                                                <p style={{ margin: '10px 0', fontWeight: '600', color: '#cca042', fontSize: '18px' }}>{item.price}DH</p>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(
                                                                {
                                                                    id: item.id,
                                                                    name: item.name,
                                                                    price: item.price,
                                                                    images: [item.image]
                                                                },
                                                                null,
                                                                1,
                                                                null
                                                            );
                                                        }}
                                                        style={{...buttonStyle, width: '100%', padding: '12px'}}
                                                    >
                                                        Ajouter au panier
                                                    </button>
                                                    <button 
                                                        style={{...buttonStyle, backgroundColor: '#dc3545', width: '100%', padding: '12px'}}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleWishlistRemove(item.id);
                                                        }}
 eq                                                    >
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );

            case 'loyalty':
                return (
                    <div>
                        <h2 style={sectionTitleStyle}>Programme de Fidélité</h2>
                        <div style={{
                            background: 'linear-gradient(135deg, #cca042 0%, #b8941f 100%)',
                            color: 'white',
                            padding: '30px',
                            borderRadius: '8px',
                            textAlign: 'center',
                            marginBottom: '30px',
                            
                        }}>
                            <h3 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Vos Points de Fidélité</h3>
                            <p style={{ margin: '0', fontSize: '36px', fontWeight: 'bold' }}>{loyaltyPoints} points</p>
                            <p style={{ margin: '10px 0 0 0' }}>Équivalent à {(loyaltyPoints * 0.1).toFixed(2)}DH de réduction</p>
                        </div>
                        
                                            </div>
                );

            default:
                return null;
        }
    };

    if (!user) {
        return (
            <div style={containerStyle}>
                <div style={profileContainerStyle}>
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <h2>Vous devez être connecté pour accéder à votre profil</h2>
                        <Link to="/login" style={buttonStyle}>Se connecter</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={profileContainerStyle}>
                {/* Header */}
                <div style={headerStyle}>
                    <h1 style={{ margin: '0', fontSize: '22px' }}>Mon Compte</h1>
                    <p style={{ margin: '8px 0 0 0', opacity: 0.9, fontSize: '14px' }}>Bienvenue, {user.name || user.email}</p>
                </div>

                {/* Navigation par onglets */}
                <div style={tabsContainerStyle}>
                    <button style={tabStyle(activeTab === 'orders')} onClick={() => setActiveTab('orders')}>
                        Commandes
                    </button>
                    <button 
                        style={{...tabStyle(activeTab === 'wishlist'), position: 'relative'}} 
                        onClick={() => setActiveTab('wishlist')}
                    >
                        Favoris
                        {wishlist.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-4px',
                                right: '-4px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                backgroundColor: '#ff4444',
                                color: 'white',
                                fontSize: '11px',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid white'
                            }}>
                                {wishlist.length > 99 ? '99+' : wishlist.length}
                            </span>
                        )}
                    </button>
                    <button style={tabStyle(activeTab === 'loyalty')} onClick={() => setActiveTab('loyalty')}>
                        Fidélité
                    </button>
                </div>

                {/* Contenu */}
                <div style={contentStyle}>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Profile;
