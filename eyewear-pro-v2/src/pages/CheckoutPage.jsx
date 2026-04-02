import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import pb from '../pocketbase';

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [showOrderSummary, setShowOrderSummary] = useState(false); // Pour le menu déroulant sur mobile
  
  // États pour le formulaire
  const [formData, setFormData] = useState({
    email: user?.email || '',
    prenom: user?.name?.split(' ')[0] || '',
    nom: user?.name?.split(' ').slice(1).join(' ') || '',
    adresse: '',
    codePostal: '',
    ville: '',
    telephone: '',
    pays: 'Maroc'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({});

  const totalGlobal = cartItems.reduce((acc, item) => {
    const framePrice = item.product?.price || 0;
    const lensesPrice = item.lensDetails?.lensTypeChoice?.price || 0;
    return acc + (framePrice + lensesPrice) * item.quantity;
  }, 0);

  // Fonction pour gérer les changements du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Fonction de validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.adresse.trim()) {
      newErrors.adresse = "L'adresse est obligatoire";
    }
    
    if (!formData.telephone.trim()) {
      newErrors.telephone = "Le numéro de téléphone est obligatoire";
    } else if (!/^[0-9+\s()-]*$/.test(formData.telephone.replace(/\s/g, ''))) {
      newErrors.telephone = "Le numéro de téléphone n'est pas valide";
    } else if (formData.telephone.replace(/\D/g, '').length < 10) {
      newErrors.telephone = "Le numéro de téléphone doit contenir au moins 10 chiffres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction pour sauvegarder la commande dans PocketBase
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valider le formulaire avant la soumission
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Préparer les données des produits
      const produitsData = cartItems.map(item => ({
        productId: item.product.id,
        nom: item.product.name,
        quantite: item.quantity,
        couleur: item.color,
        prixUnitaire: item.product.price,
        prixTotal: (item.product.price + (item.lensDetails?.lensTypeChoice?.price || 0)) * item.quantity,
        lentilles: item.lensDetails || null
      }));

      // Créer la commande dans PocketBase
      const commande = await pb.collection('commandes').create({
        email: user?.email || formData.email,
        prenom: user?.name?.split(' ')[0] || formData.prenom,
        nom: user?.name?.split(' ').slice(1).join(' ') || formData.nom,
        adresse: formData.adresse,
        codePostal: formData.codePostal,
        ville: formData.ville,
        telephone: formData.telephone,
        pays: formData.pays,
        methodePaiement: 'Paiement à la livraison',
        total: totalGlobal,
        produits: JSON.stringify(produitsData),
        statut: 'En attente'
      });

      console.log('✅ Commande sauvegardée:', commande);
      
      // Afficher la confirmation
      setShowConfirmation(true);
      
      // Redirection automatique après 5 secondes
      setTimeout(() => {
        window.location.href = '/';
      }, 5000);

    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily: '"Inter", sans-serif',
      }}
    >
      {/* TITRE DE LA PAGE */}
      <section
        style={{
          padding: '40px 16px 20px',
          backgroundColor: '#ffffff',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: '"BBH Hegarty", sans-serif',
            fontWeight: 600,
            letterSpacing: '1.5px',
            color: '#000000',
            fontSize: '2.5rem',
            marginBottom: '10px',
            textTransform: 'uppercase',
            marginTop: '70px'
          }}
        >
          Checkout
        </h1>
        <p
          style={{
            color: '#666',
            fontSize: '1.1rem',
            marginBottom: '20px',
            letterSpacing: '1px',
          }}
        >
          Finalisez votre commande
        </p>
      </section>

      {/* 2. RÉCAPITULATIF MOBILE (S'affiche uniquement sur petit écran) */}
      <div className="lg:hidden" style={styles.mobileSummaryHeader} onClick={() => setShowOrderSummary(!showOrderSummary)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#E6D3A3' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E6D3A3" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 01-8 0"/></svg>
          <span style={{ fontSize: '14px', fontFamily: '"BBH Hegarty", sans-serif', letterSpacing: '0.5px' }}>{showOrderSummary ? 'Cacher le detail' : 'Afficher Votre Commande'}</span>
          <svg style={{ transform: showOrderSummary ? 'rotate(180deg)' : 'none', transition: '0.3s' }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#E6D3A3" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      {/* ZONE CONTENU (GRID) */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10">
        
        {/* 3. COLONNE RÉCAPITULATIF (S'affiche en haut sur mobile si ouvert, à droite sur PC) */}
        <div style={{ 
          ...styles.summaryColumn, 
          display: showOrderSummary ? 'block' : 'none', // Géré par l'état sur mobile
        }} className="lg:block lg:order-2">
          <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{
                ...styles.productRow,
                alignItems: item.lensDetails?.lensTypeChoice ? 'center' : 'flex-start'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={styles.imgContainer}>
                    <img src={item.product.images?.[0]} alt="" style={styles.imgFit} />
                    <span style={styles.quantityBadge}>{item.quantity}</span>
                  </div>
                  <div>
                    <p style={styles.prodName}>{item.product.name}</p>
                    {item.product?.colors && item.product.colors.length > 0 ? (
                      <p style={styles.prodColor}>Couleurs : {item.product.colors.join(', ')}</p>
                    ) : (
                      <p style={styles.prodColor}>{item.color}</p>
                    )}
                    {item.lensDetails?.lensTypeChoice && (
                      <p style={{ 
                        margin: '2px 0 0 0', 
                        fontSize: '12px', 
                        color: '#E6D3A3',
                        fontFamily: 'sans-serif'
                      }}>
                        Verres : {item.lensDetails.lensTypeChoice.type}
                      </p>
                    )}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: item.lensDetails?.lensTypeChoice ? 'center' : 'flex-start',
                  gap: item.lensDetails?.lensTypeChoice ? '4px' : '0px'
                }}>
                  <span style={{
                    ...styles.prodPrice,
                    alignSelf: item.lensDetails?.lensTypeChoice ? 'center' : 'flex-start'
                  }}>{(item.product.price + (item.lensDetails?.lensTypeChoice?.price || 0)) * item.quantity}</span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#E6D3A3',
                    alignSelf: item.lensDetails?.lensTypeChoice ? 'center' : 'flex-start',
                    fontFamily: '"BBH Hegarty", sans-serif'
                  }}>MAD</span>
                </div>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.totalRow}><span>Total</span><span>{totalGlobal} MAD</span></div>
          </div>
        </div>

        {/* 4. COLONNE GAUCHE : FORMULAIRES (Toujours visible) */}
        <div style={styles.formColumn} className="lg:order-1">
          <div style={{ maxWidth: '550px', marginLeft: 'auto', padding: '0 20px' }}>
            <h2 style={styles.sectionTitle}>Contact</h2>
            {user ? (
              <div style={styles.inputFull}>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#555', 
                  borderRadius: '8px',
                  color: '#E6D3A3',
                  fontFamily: '"BBH Hegarty", sans-serif',
                  fontSize: '14px'
                }}>
                  {user.email}
                </div>
              </div>
            ) : (
              <input 
                type="email" 
                name="email"
                placeholder="Adresse e-mail (optionnel)" 
                style={styles.inputFull} 
                value={formData.email}
                onChange={handleInputChange}
              />
            )}
            
            <h2 style={styles.sectionTitle}>Livraison</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <select 
                name="pays"
                style={styles.inputFull}
                value={formData.pays}
                onChange={handleInputChange}
              >
                <option value="Maroc">Maroc</option>
                <option value="France">France</option>
                <option value="Espagne">Espagne</option>
              </select>
              <div style={styles.flexGap}>
                <input 
                  type="text" 
                  name="prenom"
                  placeholder="Prénom (optionnel)" 
                  style={styles.inputHalf}
                  value={formData.prenom}
                  onChange={handleInputChange}
                />
                <input 
                  type="text" 
                  name="nom"
                  placeholder="Nom" 
                  style={styles.inputHalf}
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <input 
                type="text" 
                name="adresse"
                placeholder="Adresse" 
                style={{
                  ...styles.inputFull,
                  border: errors.adresse ? '2px solid #dc3545' : styles.inputFull.border
                }}
                value={formData.adresse}
                onChange={handleInputChange}
                required
              />
              {errors.adresse && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '5px',
                  fontFamily: '"Inter", sans-serif'
                }}>
                  {errors.adresse}
                </div>
              )}
              <div style={styles.flexGap}>
                <input 
                  type="tel" 
                  name="codePostal"
                  placeholder="Code postal (facultatif)" 
                  style={styles.inputHalf}
                  value={formData.codePostal}
                  onChange={handleInputChange}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoComplete="postal-code"
                />
                <input 
                  type="text" 
                  name="ville"
                  placeholder="Ville" 
                  style={styles.inputHalf}
                  value={formData.ville}
                  onChange={handleInputChange}
                  required
                />
              </div>
              {errors.ville && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '5px',
                  fontFamily: '"Inter", sans-serif'
                }}>
                  {errors.ville}
                </div>
              )}
              <input 
                type="tel" 
                name="telephone"
                placeholder="Téléphone" 
                style={{
                  ...styles.inputFull,
                  border: errors.telephone ? '2px solid #dc3545' : styles.inputFull.border
                }}
                value={formData.telephone}
                onChange={handleInputChange}
                required
              />
              {errors.telephone && (
                <div style={{
                  color: '#dc3545',
                  fontSize: '12px',
                  marginTop: '5px',
                  fontFamily: '"Inter", sans-serif'
                }}>
                  {errors.telephone}
                </div>
              )}
            </div>

            <h2 style={styles.sectionTitle}>Paiement</h2>
            <div style={styles.paymentBox}>
              <div style={styles.paymentHeader}>
                <span style={{ fontWeight: '600', color: '#E6D3A3' }}>Paiement à la livraison</span>
                <div style={styles.radioChecked}></div>
              </div>
              <div style={styles.paymentContent}>Paiement cash lors de la reception</div>
            </div>

            <button 
              style={styles.finalButton}
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Traitement en cours...' : 'Valider le paiement'}
            </button>
          </div>
        </div>

      </div>
      {showConfirmation && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div 
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '12px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              textAlign: 'center'
            }}
          >
            <h3 
              style={{
                fontFamily: '"BBH Hegarty", sans-serif',
                fontSize: '20px',
                fontWeight: '600',
                color: '#E6D3A3',
                marginBottom: '15px',
                letterSpacing: '1px'
              }}
            >
              ✅ Commande confirmée
            </h3>
            
            <p 
              style={{
                fontFamily: '"BBH Hegarty", sans-serif',
                fontSize: '14px',
                color: '#fff',
                lineHeight: '1.5',
                marginBottom: '20px'
              }}
            >
              Merci pour votre commande.<br />
              Votre demande a été enregistrée avec succès.<br />
              Nos opticiens vous contacteront pour confirmer la livraison.
            </p>

            <button 
              onClick={() => setShowConfirmation(false)}
              style={{
                backgroundColor: '#cca042ff',
                color: '#6B6B6B',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: '"BBH Hegarty", sans-serif',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginTop: '20px'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

// STYLES ADAPTATIFS
const styles = {
  mobileSummaryHeader: {
    backgroundColor: '#2a2a2a', borderBottom: '1px solid #333', padding: '15px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
  },
  formColumn: { padding: '30px 0' },
  summaryColumn: { backgroundColor: '#2a2a2a', padding: '30px 20px', borderBottom: '1px solid #333' },
  sectionTitle: { 
    fontSize: '18px', 
    fontWeight: '600', 
    marginTop: '25px', 
    marginBottom: '15px',
    color: '#000000',
    fontFamily: '"BBH Hegarty", sans-serif',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  },
  inputFull: { 
    width: '100%', 
    padding: '12px', 
    border: '1px solid #555', 
    borderRadius: '8px', 
    fontSize: '16px', 
    boxSizing: 'border-box',
    backgroundColor: '#333',
    color: '#E6D3A3',
    fontFamily: '"Inter", sans-serif'
  },
  inputHalf: { 
    width: '100%', 
    padding: '12px', 
    border: '1px solid #555', 
    borderRadius: '8px', 
    fontSize: '16px', 
    boxSizing: 'border-box',
    backgroundColor: '#333',
    color: '#E6D3A3',
    fontFamily: '"Inter", sans-serif'
  },
  flexGap: { display: 'flex', gap: '10px' },
  paymentBox: { 
    border: '1px solid #555', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    marginTop: '10px',
    backgroundColor: '#2a2a2a'
  },
  paymentHeader: { 
    padding: '15px', 
    borderBottom: '1px solid #555', 
    backgroundColor: '#333', 
    display: 'flex', 
    justifyContent: 'space-between' 
  },
  paymentContent: { 
    padding: '20px', 
    textAlign: 'center', 
    backgroundColor: '#2a2a2a', 
    fontSize: '13px', 
    color: '#999',
    fontFamily: '"BBH Hegarty", sans-serif'
  },
  radioChecked: { 
    width: '16px', 
    height: '16px', 
    borderRadius: '50%', 
    border: '5px solid #E6D3A3', 
    backgroundColor: '#fff' 
  },
  finalButton: { 
    width: '100%', 
    backgroundColor: '#cca042ff', 
    color: '#ffffff', 
    padding: '18px', 
    border: 'none', 
    borderRadius: '12px', 
    fontWeight: '700', 
    fontSize: '16px', 
    marginTop: '30px', 
    cursor: 'pointer',
    fontFamily: '"BBH Hegarty", sans-serif',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
    transition: 'all 0.3s ease'
  },
  productRow: { 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#333',
    borderRadius: '8px',
    border: '1px solid #555'
  },
  imgContainer: { 
    width: '60px', 
    height: '60px', 
    backgroundColor: '#2a2a2a', 
    border: '1px solid #555', 
    borderRadius: '8px', 
    position: 'relative' 
  },
  imgFit: { width: '100%', height: '100%', objectFit: 'contain' },
  quantityBadge: { 
    position: 'absolute', 
    top: '-8px', 
    right: '-8px', 
    backgroundColor: '#E6D3A3', 
    color: '#1a1a1a', 
    fontSize: '11px', 
    width: '22px', 
    height: '22px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: '50%',
    fontFamily: '"BBH Hegarty", sans-serif',
    fontWeight: '700'
  },
  prodName: { 
    fontSize: '13px', 
    fontWeight: '600', 
    margin: 0,
    color: '#E6D3A3',
    fontFamily: 'serif'
  },
  prodColor: { 
    fontSize: '12px', 
    color: '#999', 
    margin: 0,
    fontFamily: 'sans-serif'
  },
  prodPrice: { 
    fontSize: '14px', 
    fontWeight: '600',
    color: '#E6D3A3',
    fontFamily: '"BBH Hegarty", sans-serif'
  },
  divider: { 
    borderTop: '1px solid #555', 
    margin: '20px 0' 
  },
  priceRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    fontSize: '13px', 
    marginBottom: '8px',
    color: '#999',
    fontFamily: '"BBH Hegarty", sans-serif'
  },
  totalRow: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    marginTop: '15px', 
    fontSize: '18px', 
    fontWeight: '800',
    color: '#E6D3A3',
    fontFamily: '"BBH Hegarty", sans-serif',
    letterSpacing: '0.5px'
  }
};

export default CheckoutPage;