import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import pb from '../pocketbase';

const ReviewsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // État pour les avis
  const [reviews, setReviews] = useState([]);

  // Vérifier si l'utilisateur est administrateur
  const isAdmin = user && (user.email === 'admin@sensationnel-optique.com' || user.role === 'admin');

  // Fonction pour supprimer un avis depuis PocketBase
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) {
      try {
        // Supprimer l'avis de PocketBase
        await pb.collection('avis').delete(reviewId);
        
        // Recharger les avis
        loadReviews();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de l\'avis');
      }
    }
  };

  // Initialiser les avis au chargement
  useEffect(() => {
    loadReviews();
  }, []);

  // Fonction pour charger les avis depuis PocketBase
  const loadReviews = async () => {
    try {
      // Charger les avis depuis PocketBase
      const records = await pb.collection('avis').getFullList({
        sort: '-created'
      });

      // Ajouter les avis par défaut
      const defaultReviews = [
        {
          id: 'default-1',
          name: 'Hidaya raja',
          rating: 5,
          productType: 'Lunettes de soleil pour femmes',
          text: 'Des lunettes magnifiques et de très grande qualité ! La livraison express en 24h a été un vrai plus.'
        },
        {
          id: 'default-2',
          name: 'Ahmed Benali',
          rating: 5,
          productType: 'Lunettes optiques pour hommes',
          text: 'Un service client exceptionnel et des produits de qualité professionnelle les 6 mois de garantie m\'ont vraiment rassuré je reviendrai sans hésiter pour ma prochaine paire'
        },
        {
          id: 'default-3',
          name: 'Fatima Zahra',
          rating: 5,
          productType: 'Lunettes optique pour femmes',
          text: 'Des cadres élégants et confortables, j\'apprécie particulièrement le fait que les produits soient vérifiés à la main. Le rapport qualité-prix est incroyable, merci Sensationnel Optique'
        }
      ];
      
      // Combiner : nouveaux avis utilisateur en premier, puis avis par défaut
      const combinedReviews = [...records, ...defaultReviews];
      setReviews(combinedReviews);
    } catch (error) {
      console.error('Erreur lors du chargement des avis:', error);
      // En cas d'erreur, charger les avis par défaut uniquement
      const defaultReviews = [
        {
          id: 'default-1',
          name: 'Hidaya raja',
          rating: 5,
          productType: 'Lunettes de soleil pour femmes',
          text: 'Des lunettes magnifiques et de très grande qualité ! La livraison express en 24h a été un vrai plus.'
        },
        {
          id: 'default-2',
          name: 'Ahmed Benali',
          rating: 5,
          productType: 'Lunettes optiques pour hommes',
          text: 'Un service client exceptionnel et des produits de qualité professionnelle les 6 mois de garantie m\'ont vraiment rassuré je reviendrai sans hésiter pour ma prochaine paire'
        },
        {
          id: 'default-3',
          name: 'Fatima Zahra',
          rating: 5,
          productType: 'Lunettes optique pour femmes',
          text: 'Des cadres élégants et confortables, j\'apprécie particulièrement le fait que les produits soient vérifiés à la main. Le rapport qualité-prix est incroyable, merci Sensationnel Optique'
        }
      ];
      setReviews(defaultReviews);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#ffffff',
        fontFamily: '"BBH Hegarty", sans-serif',
        padding: '40px 20px',
      }}
    >
      {/* Titre de la page */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}
      >
        <h1
          style={{
            fontFamily: '"BBH Hegarty", sans-serif',
            fontWeight: 400,
            letterSpacing: '1.5px',
            textAlign: 'center',
            color: '#000000',
            textTransform: 'uppercase',
            fontSize: '2rem',
            margin: '0 0 15px 0',
            textShadow: 'none',
          }}
        >
          Voyez la difference
        </h1>
        <p
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            textAlign: 'center',
            color: '#888888',
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: '0',
            fontWeight: '400',
          }}
        >
          Ce que nos clients disent de nous
        </p>
      </div>

      {/* Message si aucun avis */}
      {reviews.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#252525',
            borderRadius: '20px',
            border: '1px solid rgba(230, 211, 163, 0.1)',
            maxWidth: '600px',
            margin: '0 auto 40px auto',
          }}
        >
          <p
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              color: '#f2f2f2',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              margin: 0,
            }}
          >
            Aucun avis pour le moment. Soyez le premier à partager votre expérience.
          </p>
        </div>
      )}

      {/* Liste des avis */}
      {reviews.length > 0 && (
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 20px'
          }}
        >
          <h2
            style={{
              fontFamily: '"BBH Hegarty", sans-serif',
              fontWeight: 400,
              letterSpacing: '1px',
              color: '#E6D3A3',
              fontSize: '1.5rem',
              margin: '0 0 40px 0',
              textAlign: 'center',
            }}
          >
            Tous les avis ({reviews.length})
            {isAdmin && (
              <span style={{
                fontSize: '0.8rem',
                color: '#dc3545',
                marginLeft: '10px',
                fontWeight: '600'
              }}>
                (Mode administrateur)
              </span>
            )}
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              padding: '0 20px',
              justifyContent: 'center',
              alignItems: 'start'
            }}
          >
            {reviews.map((review, index) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: '#252525',
                  borderRadius: '20px',
                  padding: '25px',
                  border: '1px solid rgba(230, 211, 163, 0.1)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  animation: index === 0 ? 'fadeInUp 0.6s ease-out' : 'fadeInUp 0.8s ease-out',
                  animationDelay: index === 0 ? '0s' : `${index * 0.1}s`,
                  animationFillMode: 'both',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
                  e.currentTarget.style.borderColor = 'rgba(230, 211, 163, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(230, 211, 163, 0.1)';
                }}
              >
                <div style={{ marginBottom: '15px', position: 'relative' }}>
                  {/* Bouton supprimer pour admin */}
                  {isAdmin && !review.id.toString().startsWith('default-') && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReview(review.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '-5px',
                        right: '-5px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#c82333';
                        e.target.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#dc3545';
                        e.target.style.transform = 'scale(1)';
                      }}
                      title="Supprimer cet avis"
                    >
                      ×
                    </button>
                  )}
                  
                  <div 
                    style={{ 
                      fontSize: '1.3rem', 
                      marginBottom: '8px',
                      transition: 'transform 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    {'⭐'.repeat(review.rating)}
                  </div>
                  <div style={{ 
                    fontFamily: '"BBH Hegarty", sans-serif',
                    fontWeight: 600,
                    color: '#E6D3A3',
                    fontSize: '1.1rem',
                    marginBottom: '5px',
                    transition: 'color 0.3s ease'
                  }}>
                    {review.name}
                  </div>
                  <div style={{ 
                    color: '#999',
                    fontSize: '0.8rem',
                    fontStyle: 'italic'
                  }}>
                    {review.productType}
                  </div>
                </div>
                <p style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  color: '#f2f2f2',
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  margin: 0,
                }}>
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons secondaires */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '60px',
          marginBottom: '40px',
          flexWrap: 'wrap',
          padding: '0 20px'
        }}
      >
        <button
          onClick={() => navigate('/add-review')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: '"BBH Hegarty", sans-serif',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#333333';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#000000';
          }}
        >
          Ajouter votre avis
        </button>
        
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#000000',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: '"BBH Hegarty", sans-serif',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#333333';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#000000';
          }}
        >
          Retour a l'accueil
        </button>
      </div>

      {/* Styles CSS pour les animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default ReviewsPage;
