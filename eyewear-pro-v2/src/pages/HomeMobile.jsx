import React from 'react';
import HeroCarousel from '../components/HeroCarouselMobile.jsx';
import BestsellersSection from '../components/BestsellersSection.jsx';
import BeforeAfterSection from '../components/BeforeAfterSection.jsx';
import HomeFooterMobile from '../components/HomeFooterMobile.jsx';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <main
      style={{
       width: '105.6vw',
       marginLeft: '-4vw',
       display: 'flex',
       flexDirection: 'column',
       
      
       
      }}
    >
      {/* ================= HERO CAROUSEL ================= */}
      <section
        style={{
          width: '105.6vw',
          height: '500px',
          padding: 0,
          margin: -2,
          position: 'relative',
          zIndex: 1,
          
        }}
      >
        <HeroCarousel />
      </section>

      {/* ===== SÉPARATEUR PREMIUM ===== */}
      <section
        style={{
          padding: '25px 16px',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            fontSize: '1.05rem',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          <span
            style={{
              flex: 1,
              height: '6px',
              background: 'linear-gradient(to right, transparent, #bbb)',
            }}
          />
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 1000,
              fontStyle: 'normal',
              fontOpticalSizing: 'auto',
              color: '#0c0c0c',
            }}
          >
            👁️ Vision • Confort • Style 👓
          </span>
          <span
            style={{
              flex: 1,
              height: '6px',
              background: 'linear-gradient(to left, transparent, #bbb)',
            }}
          />
        </div>
      </section>

      {/* ================= SECTION COLLECTIONS ================= */}
      <section
        className="collections-section"
        style={{
          padding: '40px 16px',
          backgroundColor: '#FFFFFF',
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .collections-section {
              padding: 60px 40px !important;
              max-width: 1200px;
              margin: 0 auto;
            }
            
            .collections-section h2 {
              fontSize: 2rem !important;
              marginBottom: 50px !important;
            }
            
            .collections-grid {
              grid-template-columns: repeat(4, 1fr) !important;
              gap: 24px !important;
              max-width: 1200px;
              margin: 0 auto;
            }
            
            .collection-card {
              height: 300px !important;
              fontSize: 1rem !important;
            }
          }
          
          @media (min-width: 1024px) {
            .collections-section {
              padding: 80px 60px !important;
            }
            
            .collections-section h2 {
              fontSize: 2.5rem !important;
              marginBottom: 60px !important;
            }
            
            .collections-grid {
              gap: 30px !important;
            }
            
            .collection-card {
              height: 320px !important;
              fontSize: 1.1rem !important;
            }
          }
        `}</style>
        <h2
          style={{
            textAlign: 'center',
            fontFamily: '"BBH Hegarty", sans-serif',
            fontWeight: 400,
            letterSpacing: '1.5px',
            marginBottom: '30px',
            color: '#0c0c0c',
          }}
        >
          LISTE DES COLLECTIONS
        </h2>

        <div
          className="collections-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '18px',
          }}
        >
          <button
            style={collectionCard(
              'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766789732/Gemini_Generated_Image_6c2viz6c2viz6c2v_1_ribfx8.png'
            )}
            onClick={() => navigate('/sunglasses/femme')}
          >
            <span>LUNETTES DE SOLEIL<br />POUR FEMMES</span>
          </button>

          <button
            style={collectionCard(
              'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766789733/Gemini_Generated_Image_3y066g3y066g3y06_kkwxq5.png'
            )}
            onClick={() => navigate('/sunglasses/homme')}
          >
            <span>LUNETTES DE SOLEIL<br />POUR HOMMES</span>
          </button>

          <button
            style={collectionCard(
              'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766789733/Gemini_Generated_Image_sstoiqsstoiqssto_zpoxd1.png'
            )}
            onClick={() => navigate('/optical/femme')}
          >
            <span>CADRES<br />POUR FEMMES</span>
          </button>

          <button
            style={collectionCard(
              'https://res.cloudinary.com/dhpaxqja8/image/upload/v1766789732/Gemini_Generated_Image_q4po3mq4po3mq4po_e01khw.png'
            )}
            onClick={() => navigate('/optical/homme')}
          >
            <span>CADRES<br />POUR HOMMES</span>
          </button>
        </div>
      </section>

      {/* ================= BESTSELLERS ================= */}
      <BestsellersSection />

      {/* ================= CTA LUNETTES OPTIQUES ================= */}
      <section
        style={{
          width: '105.6vw',
          height: '900px',
          padding: '40px 0px 40px 0px',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 2,
          marginLeft: '-4vw',
          margin: -2,
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .cta-section {
              max-width: 1200px;
              margin: 0 auto !important;
              padding: 0 40px !important;
            }
            
            .cta-image {
              max-width: 800px !important;
              height: 500px !important;
              margin: 0 auto !important;
            }
            
            .cta-overlay {
              max-width: 800px !important;
              height: 350px !important;
              
            }
            
            .cta-title {
              font-size: 1.3rem !important;
            }
            
            .cta-subtitle {
              font-size: 0.9rem !important;
            }
          }
          
          @media (min-width: 1024px) {
            .cta-image {
              max-width: 900px !important;
              height: 500px !important;
            }
            
            .cta-overlay {
              max-width: 900px !important;
              height: 300px !important;
            }
            
            .cta-title {
              font-size: 1.5rem !important;
            }
            
            .cta-subtitle {
              font-size: 1rem !important;
            }
            
            .cta-overlay:nth-of-type(2) {
              bottom: -310px !important;
            }
            .cta-overlay:nth-of-type(1) {
              bottom: -310px !important;
            }
            .cta-overlay:nth-of-type(3) {
              bottom: -400px !important;
            }
          }
        `}</style>
        <div
          className="cta-section"
          style={{
            width: '100%',
            textAlign: 'left',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              className="cta-image"
              src="https://res.cloudinary.com/dhpaxqja8/image/upload/v1767130289/Gemini_Generated_Image_l5gmcsl5gmcsl5gm_xygsc8.png"
              alt="Lunettes optiques de précision"
              style={{
                width: '100%',
                maxWidth: '800px',
                height: '280px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                opacity: 1,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                objectFit: 'cover',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            />
            
            {/* Titre positionné par-dessus l'image en haut */}
            <h2
              className="cta-title"
              style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: '"BBH Hegarty", sans-serif',
                fontWeight: 400,
                letterSpacing: '1.5px',
                textAlign: 'center',
                color: '#dfc379ff',
                textTransform: 'uppercase',
                fontSize: '1.04rem',
                margin: '0 0 8px 0',
                zIndex: 10,
                textShadow: '1px 1px 3px rgba(255, 255, 255, 0.8)',
                whiteSpace: 'nowrap',
              }}
            >
              L'ART DU STYLE
            </h2>
            
            <p
              className="cta-subtitle"
              style={{
                position: 'absolute',
                top: '50px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'Arial, sans-serif',
                fontWeight: '700',
                letterSpacing: 'normal',
                textAlign: 'center',
                color: '#dfc379ff',
                fontSize: '0.78rem',
                margin: 0,
                zIndex: 10,
                textShadow: '1px 1px 3px rgba(255, 255, 255, 0.8)',
                fontStyle: 'italic',
                whiteSpace: 'nowrap',
              }}
            >
              Voyez la différence
            </p>

            {/* Deuxième photo */}
            <div
              className="cta-overlay"
              style={{
                position: 'absolute',
                bottom: '-290px',
                width: '100%',
                maxWidth: '800px',
                height: '280px',
                borderRadius: '15px',
                backgroundColor: '#0e0e0ead',
                boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
                zIndex: 5,
                overflow: 'hidden',
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <img
                src="https://res.cloudinary.com/dhpaxqja8/image/upload/v1767132340/Gemini_Generated_Image_95olil95olil95ol_nbxs1k.png"
                alt="Lunettes optiques design"
                style={{
                  width: '100%',
                  height: '280px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s ease',
                  opacity: 0.65,
                  objectFit: 'cover',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              
              {/* Titre et bouton pour la photo 2 - À L'INTÉRIEUR */}
              <h2
                className="cta-title"
                style={{
                  position: 'absolute',
                  top: '25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: '"BBH Hegarty", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '1.5px',
                  textAlign: 'center',
                  color: '#dfc379ff',
                  textTransform: 'uppercase',
                  fontSize: '1.04rem',
                  margin: 0,
                  zIndex: 10,
                  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
                }}
              >
                Jusqu'à 50% sur les lunettes de soleil
              </h2>
              
            </div>

            {/* Troisième photo */}
            <div
              className="cta-overlay"
              style={{
                position: 'absolute',
                bottom: '-580px',
                width: '100%',
                maxWidth: '800px',
                height: '280px',
                borderRadius: '15px',
                backgroundColor: '#0e0e0ead',
                zIndex: 5,
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'transform 0.3s ease',
                opacity: 1,
                left: '50%',
                transform: 'translateX(-50%)',
              }}
            >
              <img
                src="https://res.cloudinary.com/dhpaxqja8/image/upload/v1767139265/Gemini_Generated_Image_qpfvg4qpfvg4qpfv_lsieoo.png"
                alt="Lunettes collection exclusive"
                style={{
                  width: '100%',
                  height: '280px',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.3s ease',
                  opacity: 1,
                  objectFit: 'cover',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              
              {/* Titre et bouton pour la photo 3 - À L'INTÉRIEUR */}
              <h2
                className="cta-title"
                style={{
                  position: 'absolute',
                  top: '25px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: '"BBH Hegarty", sans-serif',
                  fontWeight: 400,
                  letterSpacing: '1.5px',
                  textAlign: 'center',
                  color: '#dfc379ff',
                  textTransform: 'uppercase',
                  fontSize: '1.04rem',
                  margin: '0 0 10px 0',
                  zIndex: 10,
                  textShadow: '2px 2px 4px rgba(255, 255, 255, 0.8)',
                  whiteSpace: 'nowrap',
                }}
              >
                Votre style, Notre collection
              </h2>
              
              <p
                className="cta-subtitle"
                style={{
                  position: 'absolute',
                  top: '58px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'Arial, sans-serif',
                  fontWeight: '700',
                  letterSpacing: 'normal',
                  textAlign: 'center',
                  color: '#dfc379ff',
                  fontSize: '0.78rem',
                  margin: 0,
                  zIndex: 10,
                  textShadow: '1px 1px 3px rgba(255, 255, 255, 0.8)',
                  fontStyle: 'italic',
                  whiteSpace: 'nowrap',
                }}
              >
                Verres de qualité, montures exceptionnelles.
              </p>
              
            </div>

          </div>
        </div>
      </section>

      {/* ================= SECTION AVANT/APRÈS ================= */}
      <section
        style={{
          width: '105.6vw',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 2,
          marginLeft: '-4vw',
          margin: -2,
        }}
      >
        <BeforeAfterSection />
      </section>

      {/* ================= AVIS CLIENTS ================= */}
      <section
        style={{
          width: '105.6vw',
          padding: '60px 0px 60px 0px',
          backgroundColor: '#FFFFFF',
          position: 'relative',
          zIndex: 2,
          marginLeft: '-4vw',
          margin: -2,
        }}
      >
        <div
          style={{
            width: '95%',
            textAlign: 'center',
            position: 'relative',
            marginLeft: '10px',
          }}
        >
          <h2
            style={{
              fontFamily: '"BBH Hegarty", sans-serif', // Même police que Bestsellers
              fontWeight: 400,
              letterSpacing: '1.3',
              textAlign: 'center',
              color: '#0c0c0c',
              textTransform: 'uppercase',
              margin: '0 0 20px 0',
              zIndex: 10,
              
            }}
          >
            Ce que nos clients disent de Sensationnel Optique
          </h2>

          <p
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
              textAlign: 'center',
              color: '#333333',
              fontSize: '1rem',
              lineHeight: '1.6',
              margin: '0 0 40px 0',
              maxWidth: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
              fontWeight: '400',
              letterSpacing: 'normal',
            }}
          >
            Découvrez les témoignages de clients satisfaits qui ont trouvé leur bonheur chez nous.
          </p>

          {/* Cartes d'avis */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '30px',
              maxWidth: '1200px',
              margin: '0 auto 40px auto',
              padding: '0 20px',
              justifyContent: 'center',
              alignItems: 'start',
              marginLeft: '15px'
            }}
          >
            {/* Avis 1 */}
            <div
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.backgroundColor = '#222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                <div 
                  style={{ 
                    fontSize: '1.2rem', 
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
                  ⭐⭐⭐⭐⭐
                </div>
                <div style={{ 
                  fontFamily: '"BBH Hegarty", sans-serif',
                  fontWeight: 600,
                  color: '#E6D3A3',
                  fontSize: '1rem',
                  marginBottom: '5px',
                  transition: 'color 0.3s ease'
                }}>
                  Hidaya raja
                </div>
                <div style={{ 
                  color: '#999',
                  fontSize: '0.8rem',
                  fontStyle: 'italic'
                }}>
                  Lunettes de soleil pour femmes
                </div>
              </div>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#f2f2f2',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                margin: 'auto 0 0 0',
                flexGrow: 1
              }}>
                Des lunettes magnifiques et de très grande qualité ! La livraison express en 24h a été un vrai plus.
              </p>
            </div>

            {/* Avis 2 */}
            <div
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.backgroundColor = '#222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                <div 
                  style={{ 
                    fontSize: '1.2rem', 
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
                  ⭐⭐⭐⭐⭐
                </div>
                <div style={{ 
                  fontFamily: '"BBH Hegarty", sans-serif',
                  fontWeight: 600,
                  color: '#E6D3A3',
                  fontSize: '1rem',
                  marginBottom: '5px',
                  transition: 'color 0.3s ease'
                }}>
                  Ahmed Benali
                </div>
                <div style={{ 
                  color: '#999',
                  fontSize: '0.8rem',
                  fontStyle: 'italic'
                }}>
                  Lunettes optiques pour hommes
                </div>
              </div>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#ffffff',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                margin: 'auto 0 0 0',
                flexGrow: 1
              }}>
                Un service client exceptionnel et des produits de qualité professionnelle les 6 mois de garantie m'ont vraiment rassuré je reviendrai sans hésiter pour ma prochaine paire
              </p>
            </div>

            {/* Avis 3 */}
            <div
              style={{
                backgroundColor: '#1a1a1a',
                borderRadius: '20px',
                padding: '25px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.4)';
                e.currentTarget.style.backgroundColor = '#222';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              <div style={{ marginBottom: '15px' }}>
                <div 
                  style={{ 
                    fontSize: '1.2rem', 
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
                  ⭐⭐⭐⭐⭐
                </div>
                <div style={{ 
                  fontFamily: '"BBH Hegarty", sans-serif',
                  fontWeight: 600,
                  color: '#E6D3A3',
                  fontSize: '1rem',
                  marginBottom: '5px',
                  transition: 'color 0.3s ease'
                }}>
                  Fatima Zahra
                </div>
                <div style={{ 
                  color: '#999',
                  fontSize: '0.8rem',
                  fontStyle: 'italic'
                }}>
                  Lunettes optique pour femmes
                </div>
              </div>
              <p style={{
                fontFamily: '"Cormorant Garamond", serif',
                color: '#f2f2f2',
                fontSize: '0.85rem',
                lineHeight: '1.6',
                margin: 'auto 0 0 0',
                flexGrow: 1
              }}>
                Des cadres élégants et confortables, j'apprécie particulièrement le fait que les produits soient vérifiés à la main. Le rapport qualité-prix est incroyable, merci Sensationnel Optique 
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
              maxWidth: '90%',
              margin: '0 auto',
            }}
          >
            <button
              style={{
                backgroundColor: '#070707',
                color: '#ffffff',
                border: '1px solid rgba(230, 211, 163, 0.35)',
                borderRadius: '30px',
                padding: '14px 24px',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
                fontFamily: '"BBH Hegarty", sans-serif',
                zIndex: 10,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 12px 25px rgba(230, 211, 163, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(230, 211, 163, 0.6)';
                e.currentTarget.style.backgroundColor = '#0a0a0a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                e.currentTarget.style.borderColor = 'rgba(230, 211, 163, 0.35)';
                e.currentTarget.style.backgroundColor = '#070707';
              }}
              onClick={() => navigate('/reviews')}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Voir tous les avis</span>
            </button>

            <button
              style={{
                backgroundColor: '#000000',
                color: '#f2f2f2',
                border: '1px solid rgba(242, 242, 242, 0.3)',
                borderRadius: '30px',
                padding: '14px 24px',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: '"BBH Hegarty", sans-serif',
                zIndex: 10,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(242, 242, 242, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(242, 242, 242, 0.6)';
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(242, 242, 242, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#000000';
                e.currentTarget.style.borderColor = 'rgba(242, 242, 242, 0.3)';
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onClick={() => navigate('/add-review')}
            >
              <span style={{ position: 'relative', zIndex: 1 }}>Ajouter votre avis</span>
            </button>

            {/* Bouton rapide pour laisser un avis */}
            <div
              style={{
                textAlign: 'center',
                marginTop: '10px',
              }}
            >
              <p
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                  color: '#999',
                  fontSize: '0.8rem',
                  margin: '0 0 15px 0',
                  fontStyle: 'italic',
                }}
              >
                Ou laissez un avis rapide :
              </p>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '8px',
                  marginBottom: '15px',
                }}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => navigate('/add-review', { state: { rating: star } })}
                    style={{
                      fontSize: '1.5rem',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease, color 0.2s ease',
                      color: '#E6D3A3',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      e.currentTarget.style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.color = '#E6D3A3';
                    }}
                  >
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </main>
  );
};

/* ===== STYLE DES CARTES COLLECTION ===== */
const collectionCard = (image) => ({
  height: '230px',
  borderRadius: '25px',
  backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${image})`,
  backgroundSize: 'cover',
  backgroundPosition: '50% 25%',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  color: '#f8f8f8ff',
  fontSize: '0.9rem',
  fontWeight: '700',
  textAlign: 'center',
  textTransform: 'uppercase',
  cursor: 'pointer',
  paddingBottom: '18px',
  border: '2px solid rgba(230, 211, 163, 0.4)',
  boxShadow: '0 0 15px rgba(230, 211, 163, 0.2)',
});

export default Home;
