import React, { useState } from 'react';
import { useCart } from '../context/CartContext.jsx';

// Options de Verres
// Options pour les lunettes de soleil (existant)
const LENS_OPTIONS = [
    { type: 'Protection UV', price: 0, delay: 'Délai 2 jours de travail ouvrable.' },
    { type: 'Protection UV + Anti-reflets', price: 300, delay: 'Délai 3 jours de travail ouvrable.' },
    { type: 'Polarisé + Correction + UV420', price: 1200, delay: 'Délai 7 jours de travail ouvrable.' },
    { type: 'Polarisé + correction amincis + UV420', price: 1700, delay: 'Délai 7 jours de travail ouvrable' },
];

// Options pour les montures optiques (nouveau)
const OPTICAL_LENS_OPTIONS = [
    // Section 1: Protection Lumière Bleue
    {
        section: 'Protection Lumière bleue',
        options: [
            { 
                type: 'Protection Anti-Lumière bleue Basic', 
                price: 0, 
                delay: 'FREE',
                icon: '🔷'
            },
            { 
                type: 'Protection Anti-Lumière bleue +', 
                price: 300, 
                delay: '300.00 dh',
                icon: '🔷'
            },
            { 
                type: 'Protection Anti-Lumière bleue PREMIUM', 
                price: 800, 
                delay: '800.00 dh',
                icon: '🔷'
            }
        ]
    },
    // Section 2: Protection Lumière Bleue + Correction
    {
        section: 'Protection Lumière bleue + Correction',
        options: [
            {
                type: '1 - Amincis Antireflets bleue +300dhs',
                subtitle: '(1.56 - Correction entre 0.25 et 1)',
                warranty: 'GARANTIE 1 AN',
                price: 300,
                delay: '300.00 dh',
                icon: '🔷'
            },
            {
                type: '1 - Super Amincis Antireflets bleue+500dhs',
                subtitle: '(1.6 - Correction entre 1 et 3)',
                warranty: 'GARANTIE 1 AN',
                price: 500,
                delay: '500.00 dh',
                icon: '🔷'
            },
            {
                type: '1 - Ultra amincis Antireflets Bleue +800dhs',
                subtitle: '(1.67 - correction de +/- 4 ou plus)',
                warranty: 'GARANTIE 1 AN',
                price: 800,
                delay: '800.00 dh',
                icon: '🔷'
            },
            {
                type: '2 - Verres PREMIUM amincis +500dhs',
                subtitle: 'Antireflets Bleu multicouches (1.56 - Correction entre 0.25 et 1)',
                warranty: 'GARANTIE 2 ANS',
                price: 500,
                delay: '500.00 dh',
                icon: '🔷'
            }
        ]
    },
    // Section 3: Options additionnelles
    {
        section: 'Options Premium',
        options: [
            {
                type: '2 - Verres PREMIUM Super Amincis +800dhs',
                subtitle: 'Antireflets Bleu multicouches (1.6 - Correction de +/- 3 ou plus)',
                warranty: 'GARANTIE 2 ANS',
                price: 800,
                delay: '800.00 dh',
                icon: '🔷'
            },
            {
                type: '2 - Verres PREMIUM Ultra amincis +1500dh',
                subtitle: 'Antireflets Bleu multicouches (1.67 - correction de +/- 4 ou plus)',
                warranty: 'GARANTIE 2 ANS',
                price: 1500,
                delay: '1,500.00 dh',
                icon: '🔷',
                selected: true // Style spécial pour cette option
            },
            {
                type: 'Demander un devis',
                subtitle: 'Pour les grands mesures',
                warranty: '',
                price: 0,
                delay: 'FREE',
                icon: '🔷'
            },
            {
                type: '1 - Verres 1.56 amincis photogray antireflets bleue +500dh',
                subtitle: '',
                warranty: '(2 ans garantie)',
                price: 500,
                delay: '500.00 dh',
                icon: '🔷'
            }
        ]
    }
];

const DEFAULT_LENS_CHOICE = { 
    type: "Verres Standard (À définir)", 
    price: 0, 
    delay: 'N/A' 
};

const LensesModal = ({ product, onClose, onFinish, selectedColor: propSelectedColor }) => {
    const { addToCart } = useCart();

    const [screen, setScreen] = useState('METHOD_SELECT');
    const [prescriptionMethod, setPrescriptionMethod] = useState(null);
    const [lensTypeChoice, setLensTypeChoice] = useState(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');
    // Utiliser la couleur passée en prop, sinon la couleur par défaut du produit
    const [selectedColor, setSelectedColor] = useState(propSelectedColor || product?.colors?.[0] || 'Default');

    const formatPrice = (price) => {
        const p = parseFloat(price);
        if (isNaN(p)) return 'N/A';
        return `${p.toFixed(0)} DH`;
    };

    const handleFinishSimple = (method, data = null) => {
        if (method === 'Email Later') {
            // Pour Email Later, aller directement à l'écran de choix de verres
            setPrescriptionMethod('Email Later');
            setScreen('LENS_CHOICE');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsFileUploaded(true);
            setFileName(file.name);
        }
    };

    const handleFinalAddToCart = () => {
        if (!lensTypeChoice) return;

        const cartData = {
            product,
            color: selectedColor,
            quantity: 1,
            lensDetails: {
                lensTypeChoice,
                prescriptionMethod,
                uploadedFileName: fileName || null
            }
        };

        // Ajouter au panier avec les détails complets
        addToCart(
            cartData.product,
            cartData.color,
            cartData.quantity,
            cartData.lensDetails
        );

        // Fermer le modal et rediriger vers le panier
        if (onClose) onClose();
        
        // Redirection vers le panier
        window.location.href = '/cart';
    };

    // Vérifier si c'est une monture optique
    // Simple détection basée sur le nom du produit
    const isOpticalFrame = product && (
        product.name?.toLowerCase().includes('optique') || 
        product.name?.toLowerCase().includes('monture') ||
        product.name?.toLowerCase().includes('vue')
    );

    /* ---------------- OPTICAL LENS CHOICE ---------------- */
    const renderOpticalLensChoiceScreen = (isMobile, framePrice, lensesPrice, totalPrice) => {
        return (
            <div style={{ 
                padding: isMobile ? '20px' : '20px', 
                maxWidth: isMobile ? '100%' : '600px', 
                margin: '0 auto',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa',
                fontFamily: 'Arial, sans-serif'
            }}>
                {/* Bouton de fermeture pour mobile */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => setScreen(prescriptionMethod === 'Upload' ? 'UPLOAD' : 'MANUAL')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666',
                                marginRight: '10px'
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Section Protection Lumière bleue */}
                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{
                        fontSize: isMobile ? '1.2rem' : '1.3rem',
                        fontWeight: 'bold',
                        color: '#000000',
                        textAlign: 'left',
                        marginBottom: '10px'
                    }}>
                        Protection Lumière bleue
                    </h2>
                    
                    {/* Ligne de séparation */}
                    <div style={{
                        height: '1px',
                        backgroundColor: '#e0e0e0',
                        marginBottom: '20px'
                    }} />

                    {/* Options de Protection Lumière bleue */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {OPTICAL_LENS_OPTIONS[0].options.map((option, index) => {
                            const isSelected = lensTypeChoice?.type === option.type;
                            
                            return (
                                <div
                                    key={index}
                                    onClick={() => setLensTypeChoice(option)}
                                    style={{
                                        border: isSelected ? '2px solid #000' : '1px solid #e0e0e0',
                                        borderRadius: '12px',
                                        padding: isMobile ? '16px' : '18px',
                                        backgroundColor: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: isMobile ? '12px' : '15px',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    {/* Pictogramme verre */}
                                    <div style={{
                                        width: isMobile ? '40px' : '45px',
                                        height: isMobile ? '40px' : '45px',
                                        borderRadius: '50%',
                                        backgroundColor: '#f5f5f5',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        position: 'relative',
                                        flexShrink: 0
                                    }}>
                                        {/* Cercle blanc */}
                                        <div style={{
                                            width: isMobile ? '28px' : '32px',
                                            height: isMobile ? '28px' : '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e0e0e0',
                                            position: 'relative'
                                        }}>
                                            {/* Reflet noir en haut à gauche */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '6px',
                                                left: '8px',
                                                width: isMobile ? '6px' : '7px',
                                                height: isMobile ? '4px' : '5px',
                                                backgroundColor: '#333333',
                                                borderRadius: '50%',
                                                transform: 'rotate(-20deg)'
                                            }} />
                                        </div>
                                    </div>

                                    {/* Texte de l'option */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{
                                            fontSize: isMobile ? '14px' : '15px',
                                            color: '#000000',
                                            fontWeight: '500'
                                        }}>
                                            {option.type}
                                        </div>
                                    </div>

                                    {/* Prix */}
                                    <div style={{
                                        fontSize: isMobile ? '14px' : '15px',
                                        color: '#888888',
                                        fontWeight: '500',
                                        minWidth: isMobile ? '80px' : '100px',
                                        textAlign: 'right'
                                    }}>
                                        {option.delay}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Récapitulatif prix */}
                {lensTypeChoice && (
                    <div
                        style={{
                            marginTop: '30px',
                            padding: isMobile ? '18px' : '20px',
                            borderRadius: '14px',
                            background: '#fafafa',
                            border: '1px solid #eee'
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '8px',
                            fontSize: isMobile ? '16px' : '14px'
                        }}>
                            <span>Monture</span>
                            <strong>{formatPrice(framePrice)}</strong>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '8px',
                            fontSize: isMobile ? '16px' : '14px'
                        }}>
                            <span>Verres</span>
                            <strong>{formatPrice(lensesPrice)}</strong>
                        </div>

                        <hr style={{ margin: '10px 0' }} />

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            fontSize: isMobile ? '1.2rem' : '1.1rem',
                            fontWeight: 'bold'
                        }}>
                            <span>Total</span>
                            <strong>{formatPrice(totalPrice)}</strong>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleFinalAddToCart}
                    disabled={!lensTypeChoice}
                    style={{
                        marginTop: '25px',
                        width: '100%',
                        padding: isMobile ? '16px' : '14px',
                        backgroundColor: lensTypeChoice ? '#000' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: isMobile ? '16px' : '1rem',
                        fontWeight: 'bold',
                        cursor: lensTypeChoice ? 'pointer' : 'not-allowed'
                    }}
                >
                    ADD TO CART
                </button>

                <button
                    onClick={() => setScreen(prescriptionMethod === 'Upload' ? 'UPLOAD' : 'MANUAL')}
                    style={{
                        marginTop: '15px',
                        background: 'none',
                        border: 'none',
                        color: '#555',
                        cursor: 'pointer',
                        fontSize: isMobile ? '16px' : '14px'
                    }}
                >
                    ← Retour à la prescription
                </button>
            </div>
        );
    };
    const renderLensChoiceScreen = () => {
        const isMobile = window.innerWidth <= 768;
        
        const framePrice = product?.price || 0;
        const lensesPrice = lensTypeChoice?.price || 0;
        const totalPrice = framePrice + lensesPrice;

        // Si c'est une monture optique, utiliser les options optiques
        if (isOpticalFrame) {
            return renderOpticalLensChoiceScreen(isMobile, framePrice, lensesPrice, totalPrice);
        }

        // Sinon, utiliser l'interface existante pour les lunettes de soleil
        return (
            <div style={{ 
                padding: isMobile ? '20px' : '20px', 
                maxWidth: isMobile ? '100%' : '600px', 
                margin: '0 auto',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                {/* Bouton de fermeture pour mobile */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => setScreen(prescriptionMethod === 'Upload' ? 'UPLOAD' : 'MANUAL')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666',
                                marginRight: '10px'
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                <h1 style={{ 
                    fontSize: isMobile ? '1.4rem' : '1.5rem', 
                    marginTop: isMobile ? '0px' : '50px', 
                    marginBottom: '20px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    Choose Your Lenses
                </h1>

                <div style={{ 
                    marginBottom: '15px', 
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1.1rem' : '1rem',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    Lunette de soleil
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {LENS_OPTIONS.map(option => {
                        const isSelected = lensTypeChoice?.type === option.type;

                        return (
                            <div
                                key={option.type}
                                onClick={() => setLensTypeChoice(option)}
                                style={{
                                    padding: isMobile ? '18px' : '16px',
                                    border: isSelected ? '2px solid #000' : '1px solid #ddd',
                                    borderRadius: '14px',
                                    cursor: 'pointer',
                                    background: isSelected ? '#f7f7f7' : '#fff',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: isMobile ? 'flex-start' : 'center',
                                    flexDirection: isMobile ? 'column' : 'row'
                                }}
                            >
                                <div>
                                    <div style={{ 
                                        fontWeight: '600',
                                        fontSize: isMobile ? '15px' : '14px',
                                        marginBottom: isMobile ? '8px' : '0'
                                    }}>
                                        {option.type}
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '0.85rem' : '0.8rem', 
                                        color: '#666', 
                                        marginTop: '4px' 
                                    }}>
                                        {option.delay}
                                    </div>
                                </div>
                                <strong style={{ 
                                    fontSize: isMobile ? '16px' : '14px',
                                    marginTop: isMobile ? '8px' : '0'
                                }}>
                                    {formatPrice(option.price)}
                                </strong>
                            </div>
                        );
                    })}
                </div>

                {lensTypeChoice && (
                    <div
                        style={{
                            marginTop: '30px',
                            padding: isMobile ? '18px' : '16px',
                            borderRadius: '14px',
                            background: '#fafafa',
                            border: '1px solid #eee'
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '8px',
                            fontSize: isMobile ? '16px' : '14px'
                        }}>
                            <span>Monture</span>
                            <strong>{formatPrice(framePrice)}</strong>
                        </div>

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            marginBottom: '8px',
                            fontSize: isMobile ? '16px' : '14px'
                        }}>
                            <span>Verres</span>
                            <strong>{formatPrice(lensesPrice)}</strong>
                        </div>

                        <hr style={{ margin: '10px 0' }} />

                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            fontSize: isMobile ? '1.2rem' : '1.1rem',
                            fontWeight: 'bold'
                        }}>
                            <span>Total</span>
                            <strong>{formatPrice(totalPrice)}</strong>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleFinalAddToCart}
                    disabled={!lensTypeChoice}
                    style={{
                        marginTop: '25px',
                        width: '100%',
                        padding: isMobile ? '16px' : '14px',
                        backgroundColor: lensTypeChoice ? '#000' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: isMobile ? '16px' : '1rem',
                        fontWeight: 'bold',
                        cursor: lensTypeChoice ? 'pointer' : 'not-allowed'
                    }}
                >
                    ADD TO CART
                </button>

                <button
                    onClick={() => setScreen(prescriptionMethod === 'Upload' ? 'UPLOAD' : 'MANUAL')}
                    style={{
                        marginTop: '15px',
                        background: 'none',
                        border: 'none',
                        color: '#555',
                        cursor: 'pointer',
                        fontSize: isMobile ? '16px' : '14px'
                    }}
                >
                    ← Retour à la prescription
                </button>
            </div>
        );
    };

    /* ---------------- METHOD SELECT ---------------- */
    const renderMethodSelectScreen = () => {
        // Détecter si on est sur mobile
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Version mobile - une seule colonne
            return (
                <div style={{
                    minHeight: '100vh',
                    backgroundColor: '#f8f9fa',
                    padding: '20px'
                }}>
                    {/* Bouton de fermeture en haut */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Image du produit */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '30px'
                    }}>
                        <img
                            src={product.images?.[0] || product.image}
                            alt={product.name}
                            style={{
                                width: '250px',
                                height: '250px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                marginBottom: '15px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                maxWidth: '100%'
                            }}
                        />
                        <h2 style={{
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            color: '#000',
                            textAlign: 'center',
                            margin: 0
                        }}>
                            {product.name}
                        </h2>
                    </div>

                    {/* Titre */}
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        color: '#000',
                        marginBottom: '30px',
                        textAlign: 'center'
                    }}>
                        Add Your Prescription
                    </h1>

                    {/* Trois boutons d'options */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {/* Bouton Upload File */}
                        <button
                            onClick={() => {
                                setPrescriptionMethod('Upload');
                                setIsFileUploaded(false);
                                setFileName('');
                                setScreen('UPLOAD');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '18px 20px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        >
                            <span style={{
                                fontSize: '22px',
                                marginRight: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                📄
                            </span>
                            <span style={{
                                fontSize: '15px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                Upload File
                            </span>
                        </button>

                        {/* Bouton Enter Manually */}
                        <button
                            onClick={() => {
                                setPrescriptionMethod('Manual');
                                setScreen('MANUAL');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '18px 20px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        >
                            <span style={{
                                fontSize: '22px',
                                marginRight: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ✏️
                            </span>
                            <span style={{
                                fontSize: '15px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                Enter Manually
                            </span>
                        </button>

                        {/* Bouton Email Later */}
                        <button
                            onClick={() => handleFinishSimple('Email Later')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '18px 20px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                width: '100%'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        >
                            <span style={{
                                fontSize: '22px',
                                marginRight: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ✉️
                            </span>
                            <span style={{
                                fontSize: '15px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                Email Later
                            </span>
                        </button>
                    </div>
                </div>
            );
        }

        // Version desktop - deux colonnes (original)
        return (
            <div style={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                {/* Colonne gauche - Image du produit */}
                <div style={{
                    flex: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    backgroundColor: '#fff',
                    borderRight: '1px solid #e0e0e0'
                }}>
                    <img
                        src={product.images?.[0] || product.image}
                        alt={product.name}
                        style={{
                            width: '300px',
                            height: '300px',
                            objectFit: 'cover',
                            borderRadius: '12px',
                            marginBottom: '20px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                        }}
                    />
                    <h2 style={{
                        fontSize: '1.3rem',
                        fontWeight: '600',
                        color: '#000',
                        textAlign: 'center',
                        margin: 0
                    }}>
                        {product.name}
                    </h2>
                </div>

                {/* Colonne droite - Section de sélection */}
                <div style={{
                    flex: '1',
                    padding: '40px',
                    position: 'relative',
                    maxWidth: '500px'
                }}>
                    {/* Boutons de navigation */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        display: 'flex',
                        gap: '15px'
                    }}>
                        <button
                            onClick={() => setScreen('METHOD_SELECT')}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '18px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>

                    {/* Titre */}
                    <h1 style={{
                        fontSize: '1.8rem',
                        fontWeight: '600',
                        color: '#000',
                        marginTop: '60px',
                        marginBottom: '40px'
                    }}>
                        Add Your Prescription
                    </h1>

                    {/* Trois boutons d'options */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px'
                    }}>
                        {/* Bouton Upload File */}
                        <button
                            onClick={() => {
                                setPrescriptionMethod('Upload');
                                setIsFileUploaded(false);
                                setFileName('');
                                setScreen('UPLOAD');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '20px 24px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        >
                            <span style={{
                                fontSize: '24px',
                                marginRight: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                📄
                            </span>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                Upload File
                            </span>
                        </button>

                        {/* Bouton Enter Manually */}
                        <button
                            onClick={() => {
                                setPrescriptionMethod('Manual');
                                setScreen('MANUAL');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '20px 24px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        >
                            <span style={{
                                fontSize: '24px',
                                marginRight: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ✏️
                            </span>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                Enter Manually
                            </span>
                        </button>

                        {/* Bouton Email Later */}
                        <button
                            onClick={() => handleFinishSimple('Email Later')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '20px 24px',
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px',
                                backgroundColor: '#fff',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                                e.target.style.borderColor = '#000';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.backgroundColor = '#fff';
                                e.target.style.borderColor = '#e0e0e0';
                            }}
                        >
                            <span style={{
                                fontSize: '24px',
                                marginRight: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                ✉️
                            </span>
                            <span style={{
                                fontSize: '16px',
                                fontWeight: '500',
                                color: '#000'
                            }}>
                                Email Later
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    /* ---------------- UPLOAD ---------------- */
    const renderUploadScreen = () => {
        const isMobile = window.innerWidth <= 768;
        
        return (
            <div style={{ 
                padding: isMobile ? '20px' : '20px', 
                maxWidth: isMobile ? '100%' : '600px', 
                margin: '0 auto',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                {/* Bouton de fermeture pour mobile */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => setScreen('METHOD_SELECT')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666',
                                marginRight: '10px'
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}
                
                <h1 style={{ 
                    fontSize: isMobile ? '1.4rem' : '1.5rem', 
                    marginTop: isMobile ? '0px' : '50px', 
                    marginBottom: '15px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    Upload Prescription
                </h1>
                <p style={{ 
                    fontSize: isMobile ? '0.95rem' : '0.9rem', 
                    color: '#666', 
                    marginBottom: '25px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    Please upload your prescription as a PNG, JPG or PDF file.
                </p>

                <div
                    style={{
                        border: '2px dashed #ccc',
                        borderRadius: '14px',
                        padding: isMobile ? '20px' : '25px',
                        textAlign: 'center',
                        background: '#fafafa',
                        marginBottom: '30px'
                    }}
                >
                    <div style={{ fontSize: isMobile ? '1.8rem' : '2rem', marginBottom: '10px' }}>📎</div>
                    <input
                        type="file"
                        id="uploadFile"
                        style={{ display: 'none' }}
                        onChange={handleFileUpload}
                        onClick={(e) => (e.target.value = null)}
                    />
                    <label
                        htmlFor="uploadFile"
                        style={{
                            display: 'inline-block',
                            padding: isMobile ? '12px 20px' : '10px 18px',
                            borderRadius: '8px',
                            background: '#000',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: isMobile ? '16px' : '14px'
                        }}
                    >
                        Choose File
                    </label>
                    <div style={{ 
                        marginTop: '10px', 
                        fontSize: isMobile ? '0.9rem' : '0.85rem', 
                        color: '#555' 
                    }}>
                        {fileName || 'No file selected'}
                    </div>
                </div>

                <button
                    onClick={() => setScreen('LENS_CHOICE')}
                    disabled={!isFileUploaded}
                    style={{
                        width: '100%',
                        padding: isMobile ? '16px' : '14px',
                        background: isFileUploaded ? '#000' : '#ccc',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        marginBottom: '15px',
                        cursor: isFileUploaded ? 'pointer' : 'not-allowed',
                        fontSize: isMobile ? '16px' : '14px'
                    }}
                >
                    SAVE AND CONTINUE
                </button>

                <button
                    onClick={() => setScreen('METHOD_SELECT')}
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: '#555',
                        cursor: 'pointer',
                        fontSize: isMobile ? '16px' : '14px'
                    }}
                >
                    ← Retour
                </button>
            </div>
        );
    };

    /* ---------------- MANUAL ---------------- */
    const renderManualScreen = () => {
        const isMobile = window.innerWidth <= 768;
        
        const generateOptions = (start, end, step) => {
            const options = [];
            for (let i = start; i <= end; i += step) {
                options.push(i.toFixed(2));
            }
            return options;
        };

        // SPH: de 0 à +20 et de 0 à -20 (avec un seul zéro et signe + pour les positifs)
        const SPH_OPTIONS = [
            ...generateOptions(-20, -0.25, 0.25),
            0, // Un seul zéro
            ...generateOptions(0.25, 20, 0.25)
        ];

        // CYL: de 0 à -6 et de 0 à +6 (avec un seul zéro et signe + pour les positifs)
        const CYL_OPTIONS = [
            ...generateOptions(-6, -0.25, 0.25),
            0, // Un seul zéro
            ...generateOptions(0.25, 6, 0.25)
        ];

        // AXIS: de 0 à 180
        const AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => i);

        const selectStyle = {
            padding: isMobile ? '12px' : '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: isMobile ? '16px' : '0.9rem',
        };

        const formatNumber = (num) => {
            // S'assurer que num est un nombre
            const number = parseFloat(num);
            if (isNaN(number)) return '0.00';
            if (number === 0) return '0.00';
            return number > 0 ? `+${number.toFixed(2)}` : number.toFixed(2);
        };

        const renderEyeSection = (title) => (
            <div
                style={{
                    border: '1px solid #ddd',
                    borderRadius: '14px',
                    padding: isMobile ? '20px' : '16px',
                    marginBottom: '20px',
                }}
            >
                <h3 style={{ 
                    marginBottom: '15px', 
                    fontWeight: '600',
                    fontSize: isMobile ? '1.1rem' : '1rem'
                }}>
                    {title}
                </h3>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                        gap: isMobile ? '12px' : '12px',
                    }}
                >
                    <select style={selectStyle}>
                        <option>SPH</option>
                        {SPH_OPTIONS.map(v => (
                            <option key={v} value={v}>{formatNumber(v)}</option>
                        ))}
                    </select>

                    <select style={selectStyle}>
                        <option>CYL</option>
                        {CYL_OPTIONS.map(v => (
                            <option key={v} value={v}>{formatNumber(v)}</option>
                        ))}
                    </select>

                    <select style={selectStyle}>
                        <option>AXIS</option>
                        {AXIS_OPTIONS.map(v => (
                            <option key={v} value={v}>{v}°</option>
                        ))}
                    </select>
                </div>
            </div>
        );

        return (
            <div style={{ 
                padding: isMobile ? '20px' : '20px', 
                maxWidth: isMobile ? '100%' : '600px', 
                margin: '0 auto',
                minHeight: '100vh',
                backgroundColor: '#f8f9fa'
            }}>
                {/* Bouton de fermeture pour mobile */}
                {isMobile && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '20px'
                    }}>
                        <button
                            onClick={() => setScreen('METHOD_SELECT')}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666',
                                marginRight: '10px'
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1px solid #ddd',
                                backgroundColor: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                color: '#666'
                            }}
                        >
                            ×
                        </button>
                    </div>
                )}

                <h1 style={{ 
                    fontSize: isMobile ? '1.4rem' : '1.5rem', 
                    marginTop: isMobile ? '0px' : '50px', 
                    marginBottom: '25px',
                    textAlign: isMobile ? 'center' : 'left'
                }}>
                    Enter Your Prescription Manually
                </h1>

                {renderEyeSection('OD – Right Eye')}
                {renderEyeSection('OS – Left Eye')}

                <div
                    style={{
                        border: '2px dashed #ccc',
                        borderRadius: '14px',
                        padding: isMobile ? '20px' : '25px',
                        textAlign: 'center',
                        background: '#fafafa',
                        marginBottom: '30px',
                    }}
                >
                    <div style={{ fontSize: isMobile ? '1.8rem' : '2rem', marginBottom: '10px' }}>📎</div>

                    <input
                        type="file"
                        id="manualUpload"
                        style={{ display: 'none' }}
                    />

                    <label
                        htmlFor="manualUpload"
                        style={{
                            display: 'inline-block',
                            padding: isMobile ? '12px 20px' : '10px 18px',
                            borderRadius: '8px',
                            background: '#000',
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            fontSize: isMobile ? '16px' : '14px'
                        }}
                    >
                        Choose File
                    </label>

                    <div style={{ 
                        marginTop: '10px', 
                        fontSize: isMobile ? '0.9rem' : '0.85rem', 
                        color: '#555' 
                    }}>
                        Upload prescription image (optional)
                    </div>
                </div>

                <button
                    onClick={() => setScreen('LENS_CHOICE')}
                    style={{
                        width: '100%',
                        padding: isMobile ? '16px' : '15px',
                        backgroundColor: '#1e90ff',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: isMobile ? '16px' : '1rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginBottom: '15px',
                    }}
                >
                    SAVE AND CONTINUE
                </button>

                <button
                    onClick={() => setScreen('METHOD_SELECT')}
                    style={{
                        width: '100%',
                        background: 'none',
                        border: 'none',
                        color: '#555',
                        cursor: 'pointer',
                        fontSize: isMobile ? '16px' : '14px'
                    }}
                >
                    ← Retour
                </button>
            </div>
        );
    };

    // Render principal du composant
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            zIndex: 1000,
            overflow: 'auto'
        }}>
            {screen === 'METHOD_SELECT' && renderMethodSelectScreen()}
            {screen === 'UPLOAD' && renderUploadScreen()}
            {screen === 'MANUAL' && renderManualScreen()}
            {screen === 'LENS_CHOICE' && renderLensChoiceScreen()}
        </div>
    );
};

export default LensesModal;
