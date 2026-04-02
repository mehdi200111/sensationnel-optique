import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import pb from '../pocketbase';

const AddReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // État pour le formulaire
  const [newReview, setNewReview] = useState({
    name: user ? (user.name || user.email) : '',
    rating: 5,
    productType: 'Lunettes de soleil femme',
    text: ''
  });

  // Préremplir la note si vient de la Home et mettre à jour le nom si l'utilisateur se connecte/déconnecte
  useEffect(() => {
    if (location.state && location.state.rating) {
      setNewReview(prev => ({
        ...prev,
        rating: location.state.rating
      }));
    }
    
    // Mettre à jour le nom si l'état de connexion change
    setNewReview(prev => ({
      ...prev,
      name: user ? (user.name || user.email) : ''
    }));
  }, [location.state, user]);

  // Gérer l'ajout d'un avis
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    // Validation complète des champs
    if (!newReview.name.trim()) {
      alert('Veuillez remplir votre nom.');
      return;
    }
    
    if (!newReview.text.trim()) {
      alert('Veuillez remplir votre avis.');
      return;
    }
    
    if (!newReview.productType) {
      alert('Veuillez sélectionner un type de produit.');
      return;
    }
    
    if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
      alert('Veuillez sélectionner une note valide (1-5).');
      return;
    }

    try {
      // Test de connexion PocketBase
      console.log('Tentative de connexion à PocketBase...');
      console.log('PocketBase URL:', pb.baseUrl);
      console.log('Utilisateur connecté:', pb.authStore.isValid);
      console.log('Utilisateur:', pb.authStore.model);
      
      // Créer l'avis dans PocketBase avec validation stricte
      const data = {
        name: newReview.name.trim(),
        rating: parseInt(newReview.rating), // Assurer que c'est un nombre entier
        productType: newReview.productType.trim(),
        text: newReview.text.trim(),
        approved: true // Auto-approuver
      };
      
      // Validation finale des données
      console.log('Données à envoyer:', data);
      
      // Vérification que tous les champs requis sont présents
      if (!data.name || !data.rating || !data.productType || !data.text) {
        throw new Error('Tous les champs obligatoires ne sont pas remplis');
      }
      
      // Vérification des types
      if (typeof data.rating !== 'number' || data.rating < 1 || data.rating > 5) {
        throw new Error('La note doit être un nombre entre 1 et 5');
      }
      
      const record = await pb.collection('avis').create(data);
      console.log('Avis créé avec succès:', record);
      
      // Message de confirmation élégant
      alert('Merci pour votre avis ! Il a été publié avec succès.');
      
      // Réinitialiser le formulaire
      setNewReview({
        name: user ? (user.name || user.email) : '',
        rating: 5,
        productType: 'Lunettes de soleil femme',
        text: ''
      });
      
      // Rediriger vers la page des avis
      navigate('/reviews');
    } catch (error) {
      console.error('Erreur détaillée lors de la création de l\'avis:', error);
      console.error('Message d\'erreur:', error.message);
      console.error('Status:', error.status);
      console.error('Data:', error.data);
      
      // Afficher les erreurs de validation spécifiques
      if (error.data && error.data.data) {
        const errors = Object.values(error.data.data);
        alert('Erreur de validation: ' + errors.join(', '));
      } else {
        alert('Erreur lors de la publication de votre avis: ' + error.message);
      }
    }
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (field, value) => {
    setNewReview(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
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
            fontSize: '1.8rem',
            margin: '0 0 15px 0',
            textShadow: 'none',
            marginTop: '70px'
          }}
        >
          Partager votre experience
        </h1>
        <p
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            textAlign: 'center',
            color: '#888888',
            fontSize: '1rem',
            lineHeight: '1.6',
            margin: '0',
            fontWeight: '400',
          }}
        >
          Votre avis compte énormément pour nous
        </p>
      </div>

      {/* Formulaire pour laisser un avis */}
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: '#252525',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid rgba(230, 211, 163, 0.2)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        }}
      >
        <h2
          style={{
            fontFamily: '"BBH Hegarty", sans-serif',
            fontWeight: 400,
            letterSpacing: '1px',
            color: '#E6D3A3',
            fontSize: '1.4rem',
            margin: '0 0 30px 0',
            textAlign: 'center',
          }}
        >
          Laisser un avis
        </h2>
        
        <form onSubmit={handleSubmitReview}>
          {/* Champ nom */}
          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                color: '#f2f2f2',
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontFamily: '"BBH Hegarty", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Nom *
            </label>
            <input
              type="text"
              value={newReview.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={user !== null}
              style={{
                width: '100%',
                padding: '15px 18px',
                backgroundColor: user ? '#0a0a0a' : '#1a1a1a',
                border: '1px solid rgba(230, 211, 163, 0.2)',
                borderRadius: '12px',
                color: user ? '#999' : '#f2f2f2',
                fontSize: '0.95rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                outline: 'none',
                transition: 'all 0.3s ease',
                cursor: user ? 'not-allowed' : 'text',
                opacity: user ? 0.7 : 1
              }}
              onFocus={(e) => {
                if (!user) {
                  e.target.style.borderColor = 'rgba(230, 211, 163, 0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(230, 211, 163, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!user) {
                  e.target.style.borderColor = 'rgba(230, 211, 163, 0.2)';
                  e.target.style.boxShadow = 'none';
                }
              }}
              placeholder="Votre nom complet"
            />
          </div>

          {/* Sélecteur de note */}
          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                color: '#f2f2f2',
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontFamily: '"BBH Hegarty", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Note
            </label>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                fontSize: '1.8rem',
                justifyContent: 'center',
              }}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => handleInputChange('rating', star)}
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    color: star <= newReview.rating ? '#E6D3A3' : '#444',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.3)';
                    e.target.style.color = '#E6D3A3';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.color = star <= newReview.rating ? '#E6D3A3' : '#444';
                  }}
                >
                  ⭐
                </span>
              ))}
            </div>
          </div>

          {/* Sélecteur de type de produit */}
          <div style={{ marginBottom: '25px' }}>
            <label
              style={{
                display: 'block',
                color: '#f2f2f2',
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontFamily: '"BBH Hegarty", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Type de produit
            </label>
            <select
              value={newReview.productType}
              onChange={(e) => handleInputChange('productType', e.target.value)}
              style={{
                width: '100%',
                padding: '15px 18px',
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(230, 211, 163, 0.2)',
                borderRadius: '12px',
                color: '#f2f2f2',
                fontSize: '0.95rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(230, 211, 163, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(230, 211, 163, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(230, 211, 163, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value="Lunettes de soleil femme">Lunettes de soleil femme</option>
              <option value="Lunettes optique femme">Lunettes optique femme</option>
              <option value="Lunettes de soleil homme">Lunettes de soleil homme</option>
              <option value="Lunettes optique homme">Lunettes optique homme</option>
              <option value="Verres_optique">Verres optique</option>
              <option value="Verres_solaire">Verres solaire</option>
            </select>
          </div>

          {/* Champ texte pour l'avis */}
          <div style={{ marginBottom: '30px' }}>
            <label
              style={{
                display: 'block',
                color: '#f2f2f2',
                marginBottom: '10px',
                fontSize: '0.95rem',
                fontFamily: '"BBH Hegarty", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Votre avis *
            </label>
            <textarea
              value={newReview.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              style={{
                width: '100%',
                minHeight: '140px',
                padding: '15px 18px',
                backgroundColor: '#1a1a1a',
                border: '1px solid rgba(230, 211, 163, 0.2)',
                borderRadius: '12px',
                color: '#f2f2f2',
                fontSize: '0.95rem',
                fontFamily: '"Cormorant Garamond", serif',
                outline: 'none',
                resize: 'vertical',
                transition: 'all 0.3s ease',
                lineHeight: '1.5',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(230, 211, 163, 0.5)';
                e.target.style.boxShadow = '0 0 0 3px rgba(230, 211, 163, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(230, 211, 163, 0.2)';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Partagez votre expérience avec nos produits..."
            />
          </div>

          {/* Bouton Publier l'avis */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '18px 30px',
              backgroundColor: '#E6D3A3',
              color: '#1a1a1a',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: '600',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: '"BBH Hegarty", sans-serif',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 25px rgba(230, 211, 163, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 35px rgba(230, 211, 163, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(230, 211, 163, 0.4)';
            }}
          >
            Publier l'avis
          </button>
        </form>
      </div>

      {/* Boutons secondaires */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '60px',
          marginBottom: '40px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={() => navigate('/reviews')}
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
          Voir tous les avis
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
    </div>
  );
};

export default AddReviewPage;
