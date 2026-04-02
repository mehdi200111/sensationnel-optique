import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import pb from '../pocketbase.js';

// Options pour les montures optiques - Design moderne e-commerce
const OPTICAL_LENS_OPTIONS = [
    // Section 1: Protection Lumière Bleue
    {
        section: 'Protection Lumière bleu',
        options: [
            { 
                type: 'Protection Anti-Lumière bleu Basic', 
                price: 0, 
                delay: 'FREE'
            },
            { 
                type: 'Protection Anti-Lumière bleu +', 
                price: 300, 
                delay: '300.00 dh'
            },
            { 
                type: 'Protection Anti-Lumière bleu PREMIUM', 
                price: 800, 
                delay: '800.00 dh'
            }
        ]
    },
    // Section 2: Protection Lumière Bleue + Correction
    {
        section: 'Protection Lumière bleu + Correction',
        options: [
            {
                type: ' Amincis Antireflet bleu ',
                subtitle: '(1.56 - Correction entre 0.25 et 1)',
                warranty: 'GARANTIE 1 AN',
                price: 300,
                delay: '300.00 dh'
            },
            {
                type: ' Super Amincis Antireflet bleu',
                subtitle: '(1.6 - Correction entre 1 et 3)',
                warranty: 'GARANTIE 1 AN',
                price: 500,
                delay: '500.00 dh'
            },
            {
                type: ' Ultra amincis Antireflet Bleu',
                subtitle: '(1.67 - correction de +/- 4 ou plus)',
                warranty: 'GARANTIE 1 AN',
                price: 800,
                delay: '800.00 dh'
            },
            
        ]
    },
    // Section 3: Options Premium
    {
        section: 'Options Premium',
        options: [
            {
                type: ' Verres PREMIUM amincis ',
                subtitle: 'Antireflet Bleu multicouches (1.56 - Correction entre 0.25 et 1)',
                warranty: 'GARANTIE 2 ANS',
                price: 500,
                delay: '500.00 dh'
            },
            {
                type: ' Verres PREMIUM Super Amincis ',
                subtitle: 'Antireflets Bleu multicouches (1.6 - Correction de +/- 3 ou plus)',
                warranty: 'GARANTIE 2 ANS',
                price: 800,
                delay: '800.00 dh'
            },
            {
                type: ' Verres PREMIUM Ultra amincis',
                subtitle: 'Antireflets Bleu multicouches (1.67 - correction de +/- 4 ou plus)',
                warranty: 'GARANTIE 2 ANS',
                price: 1500,
                delay: '1,500.00 dh',
                selected: true // Style spécial avec bordure bleue
            },
           
            {
                type: ' Verres 1.56 amincis photogris antireflet bleu',
                subtitle: '',
                warranty: '(2 ans garantie)',
                price: 500,
                delay: '500.00 dh'
            },
            {
                type: ' Verres 1.56 amincis photomarron antireflet bleu',
                subtitle: '',
                warranty: '(2 ans garantie)',
                price: 500,
                delay: '500.00 dh'
            },
        ]
    }
];

const OpticalLensesModal = ({ product, onClose, onFinish, selectedColor: propSelectedColor }) => {
    const { addToCart } = useCart();

    // Cacher le header lorsque le modal est ouvert
    useEffect(() => {
        const header = document.querySelector('header');
        const headerMobile = document.querySelector('[data-header-mobile="true"]');
        
        // Sauvegarder les styles originaux avant de cacher
        const originalHeaderDisplay = header ? header.style.display : '';
        const originalHeaderMobileDisplay = headerMobile ? headerMobile.style.display : '';
        
        // Cacher le header
        if (header) {
            header.style.display = 'none';
        }
        if (headerMobile) {
            headerMobile.style.display = 'none';
        }

        // Restaurer le header à la fermeture du modal avec les styles originaux
        const cleanup = () => {
            if (header) {
                header.style.display = originalHeaderDisplay;
            }
            if (headerMobile) {
                headerMobile.style.display = originalHeaderMobileDisplay;
            }
        };

        // Ajouter un écouteur d'événement pour la fermeture du modal
        const handleModalClose = (e) => {
            if (e.key === 'Escape') {
                cleanup();
            }
        };

        document.addEventListener('keydown', handleModalClose);
        
        return cleanup;
    }, []);

    // Structure de données du produit actuel
    const currentProduct = {
        id: product?.id || 'unknown',
        name: product?.name || 'Produit inconnu',
        price: product?.price || 0,
        imageUrl: product?.images?.[0] || '/images/placeholder.jpg'
    };

    const [screen, setScreen] = useState('METHOD_SELECT');
    const [prescriptionMethod, setPrescriptionMethod] = useState(null);
    const [lensTypeChoice, setLensTypeChoice] = useState(null);
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [fileName, setFileName] = useState('');
    const [uploadedFileId, setUploadedFileId] = useState(null);
    const [selectedColor, setSelectedColor] = useState(propSelectedColor || product?.colors?.[0] || 'Default');

    // États pour la prescription manuelle
    const [manualPrescription, setManualPrescription] = useState({
        rightEye: { sph: '', cyl: '', axis: '' },
        leftEye: { sph: '', cyl: '', axis: '' }
    });

    const formatPrice = (price) => {
        const p = parseFloat(price);
        if (isNaN(p)) return 'N/A';
        return `${p.toFixed(0)} DH`;
    };

    // Fonction pour sauvegarder la prescription manuelle dans PocketBase
    const saveManualPrescriptionToPocketBase = async () => {
        try {
            const prescriptionData = {
                right_eye_sph: manualPrescription.rightEye.sph,
                right_eye_cyl: manualPrescription.rightEye.cyl,
                right_eye_axis: manualPrescription.rightEye.axis,
                left_eye_sph: manualPrescription.leftEye.sph,
                left_eye_cyl: manualPrescription.leftEye.cyl,
                left_eye_axis: manualPrescription.leftEye.axis,
                product_id: product?.id || '',
                product_name: product?.name || '',
                user_email: pb.authStore.model?.email || 'anonymous',
                created: new Date().toISOString()
            };

            console.log('💾 Sauvegarde de la prescription:', prescriptionData);

            const record = await pb.collection('prescriptions_man2').create(prescriptionData);
            console.log('✅ Prescription sauvegardée avec succès:', record);
            return record;
        } catch (error) {
            console.error('❌ Erreur lors de la sauvegarde de la prescription:', error);
            // Ne pas bloquer le processus si la sauvegarde échoue
            return null;
        }
    };

    const handleFinishSimple = (method, data = null) => {
        if (method === 'Email Later') {
            setPrescriptionMethod('Email Later');
            setScreen('LENS_CHOICE');
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Créer un enregistrement dans la collection prescriptions2
                const formData = new FormData();
                formData.append('prescriptions2', file);
                
                const record = await pb.collection('prescriptions2').create(formData);
                
                setIsFileUploaded(true);
                setFileName(file.name);
                setUploadedFileId(record.id);
                
                console.log('Fichier uploadé avec succès:', record);
            } catch (error) {
                console.error('Erreur lors de l\'upload du fichier:', error);
                // En cas d'erreur, on continue quand même pour l'expérience utilisateur
                setIsFileUploaded(true);
                setFileName(file.name);
            }
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
                uploadedFileName: fileName || null,
                uploadedFileId: uploadedFileId || null
            }
        };

        addToCart(
            cartData.product,
            cartData.color,
            cartData.quantity,
            cartData.lensDetails
        );

        // Appeler onClose pour restaurer le header
        if (onClose) onClose();
        window.location.href = '/cart';
    };

    const generateOptions = (start, end, step) => {
        const options = [];
        for (let i = start; i <= end; i += step) {
            options.push(i.toFixed(2));
        }
        return options;
    };

    const SPH_OPTIONS = [
        ...generateOptions(-20, -0.25, 0.25),
        0,
        ...generateOptions(0.25, 20, 0.25)
    ];

    const CYL_OPTIONS = [
        ...generateOptions(-6, -0.25, 0.25),
        0,
        ...generateOptions(0.25, 6, 0.25)
    ];

    const AXIS_OPTIONS = Array.from({ length: 181 }, (_, i) => i);

    const formatNumber = (num) => {
        const number = parseFloat(num);
        if (isNaN(number)) return '0.00';
        if (number === 0) return '0.00';
        return number > 0 ? `+${number.toFixed(2)}` : number.toFixed(2);
    };

    const isMobile = window.innerWidth <= 768;

    // Styles modernes et responsives
    const modalContainerStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: isMobile ? '10px' : '20px'
    };

    const modalContentStyle = {
        backgroundColor: '#FFFFFF',
        borderRadius: isMobile ? '16px' : '24px',
        maxWidth: isMobile ? '100%' : '1200px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(230, 211, 163, 0.2)'
    };

    const headerStyle = {
        background: 'linear-gradient(135deg, #E6D3A3 0%, #D4AF37 100%)',
        padding: isMobile ? '20px' : '30px',
        borderRadius: isMobile ? '16px 16px 0 0' : '24px 24px 0 0',
        textAlign: 'center',
        position: 'relative'
    };

    const closeButtonStyle = {
        position: 'absolute',
        top: isMobile ? '15px' : '20px',
        right: isMobile ? '15px' : '20px',
        width: isMobile ? '36px' : '44px',
        height: isMobile ? '36px' : '44px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        border: '2px solid #FFFFFF',
        color: '#FFFFFF',
        fontSize: isMobile ? '18px' : '22px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        fontFamily: '"Syne", sans-serif'
    };

    const sectionTitleStyle = {
        fontSize: isMobile ? '1.2rem' : '1.5rem',
        fontWeight: '800',
        color: '#1a1a1a',
        fontFamily: '"Syne", sans-serif',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        marginBottom: isMobile ? '20px' : '30px'
    };

    const renderMethodSelectScreen = () => (
        <div style={modalContainerStyle}>
            <div style={modalContentStyle}>
                {/* Header moderne */}
                <div style={headerStyle}>
                    <button
                        onClick={onClose}
                        style={closeButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E6D3A3';
                            e.currentTarget.style.color = '#1a1a1a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = '#FFFFFF';
                        }}
                    >
                        ✕
                    </button>
                    <h2 style={sectionTitleStyle}>
                        Personnalisez vos lunettes
                    </h2>
                    <p style={{
                        fontSize: isMobile ? '14px' : '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontFamily: '"Syne", sans-serif',
                        marginBottom: '0',
                        marginTop: '8px',
                        letterSpacing: '0.5px'
                    }}>
                        Choisissez votre méthode de prescription
                    </p>
                </div>

                {/* Corps du modal */}
                <div style={{ 
                    padding: isMobile ? '20px' : '40px',
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? '20px' : '60px',
                    alignItems: 'center'
                }}>
                    {/* Colonne gauche - Image et infos produit */}
                    <div style={{ 
                        flex: 1, 
                        textAlign: 'center',
                        maxWidth: isMobile ? '100%' : '350px'
                    }}>
                        <div style={{
                            backgroundColor: '#F8F9FA',
                            borderRadius: isMobile ? '12px' : '16px',
                            padding: isMobile ? '20px' : '30px',
                            marginBottom: '20px'
                        }}>
                            <img 
                                src={currentProduct.imageUrl}
                                alt={currentProduct.name}
                                style={{ 
                                    maxWidth: '100%',
                                    maxHeight: isMobile ? '200px' : '250px',
                                    objectFit: 'contain',
                                    borderRadius: '8px'
                                }} 
                            />
                        </div>
                        <h4 style={{ 
                            fontSize: isMobile ? '1.1rem' : '1.3rem',
                            color: '#1a1a1a',
                            fontWeight: '600',
                            fontFamily: '"Playfair Display", serif',
                            letterSpacing: '0.3px',
                            marginBottom: '8px',
                            textTransform: 'uppercase'
                        }}>
                            {currentProduct.name}
                        </h4>
                        <h3 style={{ 
                            fontSize: isMobile ? '1.4rem' : '1.6rem',
                            color: '#1a1a1a',
                            fontWeight: '300',
                            fontFamily: '"Playfair Display", serif',
                            letterSpacing: '1px',
                            marginBottom: '0px'
                        }}>
                            {formatPrice(currentProduct.price)}
                        </h3>
                    </div>

                    {/* Colonne droite - Options de prescription */}
                    <div style={{ 
                        flex: 1.2, 
                        maxWidth: isMobile ? '100%' : '450px'
                    }}>
                        <h3 style={{
                            fontSize: isMobile ? '1.1rem' : '1.3rem',
                            color: '#1a1a1a',
                            fontWeight: '700',
                            fontFamily: '"Syne", sans-serif',
                            marginBottom: isMobile ? '20px' : '30px',
                            textAlign: 'center',
                            letterSpacing: '1px'
                        }}>
                            Ajouter votre ordonnance
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
                            {/* Bouton Upload File */}
                            <button
                                onClick={() => {
                                    setPrescriptionMethod('Upload');
                                    setScreen('UPLOAD');
                                }}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '18px 24px' : '24px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    border: '2px solid #E6D3A3',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '16px' : '20px',
                                    transition: 'all 0.3s ease',
                                    marginBottom: isMobile ? '12px' : '16px',
                                    fontFamily: '"Syne", sans-serif',
                                    fontSize: isMobile ? '16px' : '18px',
                                    fontWeight: '700',
                                    color: '#1a1a1a',
                                    letterSpacing: '1px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E6D3A3';
                                    e.currentTarget.style.color = '#FFFFFF';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 211, 163, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    e.currentTarget.style.color = '#1a1a1a';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ 
                                    fontSize: isMobile ? '28px' : '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    📄
                                </span>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                        Télécharger un fichier
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '12px' : '14px', 
                                        opacity: 0.7,
                                        fontFamily: '"Syne", sans-serif'
                                    }}>
                                        PNG, JPG ou PDF
                                    </div>
                                </div>
                            </button>

                            {/* Bouton Enter Manually */}
                            <button
                                onClick={() => {
                                    setPrescriptionMethod('Manual');
                                    setScreen('MANUAL');
                                }}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '18px 24px' : '24px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    border: '2px solid #E6D3A3',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '16px' : '20px',
                                    transition: 'all 0.3s ease',
                                    marginBottom: isMobile ? '12px' : '16px',
                                    fontFamily: '"Syne", sans-serif',
                                    fontSize: isMobile ? '16px' : '18px',
                                    fontWeight: '700',
                                    color: '#1a1a1a',
                                    letterSpacing: '1px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E6D3A3';
                                    e.currentTarget.style.color = '#FFFFFF';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 211, 163, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    e.currentTarget.style.color = '#1a1a1a';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ 
                                    fontSize: isMobile ? '28px' : '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    ✏️
                                </span>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                        Saisir manuellement
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '12px' : '14px', 
                                        opacity: 0.7,
                                        fontFamily: '"Syne", sans-serif'
                                    }}>
                                        Entrer vos valeurs de prescription
                                    </div>
                                </div>
                            </button>

                            {/* Bouton Email Later */}
                            <button
                                onClick={() => handleFinishSimple('Email Later')}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '18px 24px' : '24px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    border: '2px solid #E6D3A3',
                                    backgroundColor: '#FFFFFF',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '16px' : '20px',
                                    transition: 'all 0.3s ease',
                                    marginBottom: isMobile ? '12px' : '16px',
                                    fontFamily: '"Syne", sans-serif',
                                    fontSize: isMobile ? '16px' : '18px',
                                    fontWeight: '700',
                                    color: '#1a1a1a',
                                    letterSpacing: '1px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#E6D3A3';
                                    e.currentTarget.style.color = '#FFFFFF';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 211, 163, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                                    e.currentTarget.style.color = '#1a1a1a';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <span style={{ 
                                    fontSize: isMobile ? '28px' : '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    ✉️
                                </span>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                        Envoyer plus tard
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '12px' : '14px', 
                                        opacity: 0.7,
                                        fontFamily: '"Syne", sans-serif'
                                    }}>
                                        Je vous enverrai mon ordonnance par email
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderUploadScreen = () => (
        <div style={modalContainerStyle}>
            <div style={modalContentStyle}>
                {/* Header moderne */}
                <div style={headerStyle}>
                    <button
                        onClick={() => setScreen('METHOD_SELECT')}
                        style={{
                            ...closeButtonStyle,
                            left: isMobile ? '15px' : '20px',
                            right: 'auto'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E6D3A3';
                            e.currentTarget.style.color = '#1a1a1a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = '#FFFFFF';
                        }}
                    >
                        ←
                    </button>
                    <button
                        onClick={onClose}
                        style={closeButtonStyle}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#E6D3A3';
                            e.currentTarget.style.color = '#1a1a1a';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.color = '#FFFFFF';
                        }}
                    >
                        ✕
                    </button>
                    <h2 style={sectionTitleStyle}>
                        Upload Prescription
                    </h2>
                    <p style={{
                        fontSize: isMobile ? '14px' : '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontFamily: '"Syne", sans-serif',
                        marginBottom: '0',
                        marginTop: '8px',
                        letterSpacing: '0.5px'
                    }}>
                        Please upload your prescription as a PNG, JPG or PDF file.
                    </p>
                </div>

                {/* Corps du modal */}
                <div style={{ 
                    padding: isMobile ? '20px' : '40px',
                    textAlign: 'center'
                }}>
                    {/* Zone de téléchargement moderne */}
                    <div style={{
                        border: '2px dashed #E6D3A3',
                        borderRadius: isMobile ? '16px' : '20px',
                        padding: isMobile ? '40px 20px' : '60px 40px',
                        backgroundColor: '#F8F9FA',
                        marginBottom: '30px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#E6D3A3';
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#F8F9FA';
                        e.currentTarget.style.borderColor = '#E6D3A3';
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                    onClick={() => document.getElementById('uploadFile').click()}
                    >
                        <input
                            type="file"
                            id="uploadFile"
                            style={{ display: 'none' }}
                            onChange={handleFileUpload}
                            onClick={(e) => (e.target.value = null)}
                            accept=".png,.jpg,.jpeg,.pdf"
                        />
                        
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '20px'
                        }}>
                            <div style={{
                                width: isMobile ? '60px' : '80px',
                                height: isMobile ? '60px' : '80px',
                                borderRadius: '50%',
                                backgroundColor: 'rgba(230, 211, 163, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '10px'
                            }}>
                                <span style={{ fontSize: isMobile ? '30px' : '40px' }}>📎</span>
                            </div>
                            
                            <div>
                                <div style={{
                                    fontSize: isMobile ? '16px' : '20px',
                                    fontWeight: 'bold',
                                    color: '#1a1a1a',
                                    fontFamily: '"Syne", sans-serif',
                                    marginBottom: '8px',
                                    letterSpacing: '0.5px'
                                }}>
                                    {fileName || 'Choose a file'}
                                </div>
                                <div style={{
                                    fontSize: isMobile ? '12px' : '14px',
                                    color: '#666',
                                    fontFamily: '"Syne", sans-serif',
                                    opacity: 0.8
                                }}>
                                    PNG, JPG or PDF
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bouton d'action */}
                    <button
                        onClick={() => setScreen('LENS_CHOICE')}
                        disabled={!isFileUploaded}
                        style={{
                            width: '100%',
                            padding: isMobile ? '18px 24px' : '24px 32px',
                            borderRadius: isMobile ? '12px' : '16px',
                            backgroundColor: isFileUploaded ? '#D4AF37' : '#E9ECEF',
                            color: isFileUploaded ? '#FFFFFF' : '#6C757D',
                            border: 'none',
                            fontSize: isMobile ? '16px' : '18px',
                            fontWeight: '700',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '1px',
                            cursor: isFileUploaded ? 'pointer' : 'not-allowed',
                            transition: 'all 0.3s ease',
                            textTransform: 'uppercase',
                            boxShadow: isFileUploaded ? '0 8px 25px rgba(212, 175, 55, 0.3)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (isFileUploaded) {
                                e.currentTarget.style.backgroundColor = '#B8941F';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 35px rgba(212, 175, 55, 0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (isFileUploaded) {
                                e.currentTarget.style.backgroundColor = '#D4AF37';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
                            }
                        }}
                    >
                        {isFileUploaded ? '✓ File uploaded' : 'Choose a file'}
                    </button>

                    {/* Texte informatif */}
                    <div style={{
                        marginTop: '30px',
                        padding: '20px',
                        backgroundColor: 'rgba(230, 211, 163, 0.05)',
                        borderRadius: '12px',
                        border: '1px solid rgba(230, 211, 163, 0.2)'
                    }}>
                        <p style={{
                            fontSize: isMobile ? '13px' : '15px',
                            color: '#666',
                            fontFamily: '"Syne", sans-serif',
                            lineHeight: '1.5',
                            margin: '0'
                        }}>
                            <strong style={{ color: '#1a1a1a' }}>Accepted formats:</strong> PNG, JPG, JPEG, PDF<br/>
                            <strong style={{ color: '#1a1a1a' }}>Maximum size:</strong> 10MB<br/>
                            <strong style={{ color: '#1a1a1a' }}>Required quality:</strong> Clear and readable
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderManualScreen = () => {
        const selectStyle = {
            padding: isMobile ? '12px' : '10px',
            borderRadius: '8px',
            border: '1px solid #E6D3A3',
            fontSize: isMobile ? '16px' : '0.9rem',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            color: '#E6D3A3',
            fontFamily: '"Syne", sans-serif'
        };

        const renderEyeSection = (title) => {
            const isRightEye = title.includes('Droit');
            const eyeData = isRightEye ? manualPrescription.rightEye : manualPrescription.leftEye;
            
            return (
                <div
                    style={{
                        border: '1px solid #E6D3A3',
                        borderRadius: '14px',
                        padding: isMobile ? '20px' : '24px',
                        marginBottom: '20px',
                        backgroundColor: '#FFFFFF'
                    }}
                >
                    <h3 style={{ 
                        marginBottom: '15px', 
                        fontWeight: '600',
                        fontSize: isMobile ? '1.1rem' : '1rem',
                        color: '#1a1a1a',
                        fontFamily: '"Syne", sans-serif',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
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
                        <select 
                            style={selectStyle}
                            value={eyeData.sph}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setManualPrescription(prev => ({
                                    ...prev,
                                    [isRightEye ? 'rightEye' : 'leftEye']: {
                                        ...prev[isRightEye ? 'rightEye' : 'leftEye'],
                                        sph: newValue
                                    }
                                }));
                            }}
                        >
                            <option value="">SPH</option>
                            {SPH_OPTIONS.map(v => (
                                <option key={v} value={v}>{formatNumber(v)}</option>
                            ))}
                        </select>

                        <select 
                            style={selectStyle}
                            value={eyeData.cyl}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setManualPrescription(prev => ({
                                    ...prev,
                                    [isRightEye ? 'rightEye' : 'leftEye']: {
                                        ...prev[isRightEye ? 'rightEye' : 'leftEye'],
                                        cyl: newValue
                                    }
                                }));
                            }}
                        >
                            <option value="">CYL</option>
                            {CYL_OPTIONS.map(v => (
                                <option key={v} value={v}>{formatNumber(v)}</option>
                            ))}
                        </select>

                        <select 
                            style={selectStyle}
                            value={eyeData.axis}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setManualPrescription(prev => ({
                                    ...prev,
                                    [isRightEye ? 'rightEye' : 'leftEye']: {
                                        ...prev[isRightEye ? 'rightEye' : 'leftEye'],
                                        axis: newValue
                                    }
                                }));
                            }}
                        >
                            <option value="">AXIS</option>
                            {AXIS_OPTIONS.map(v => (
                                <option key={v} value={v}>{v}°</option>
                            ))}
                        </select>
                    </div>
                </div>
            );
        };

        return (
            <div style={modalContainerStyle}>
                <div style={modalContentStyle}>
                    {/* Header moderne */}
                    <div style={headerStyle}>
                        <button
                            onClick={() => setScreen('METHOD_SELECT')}
                            style={{
                                ...closeButtonStyle,
                                left: isMobile ? '15px' : '20px',
                                right: 'auto'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E6D3A3';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.color = '#FFFFFF';
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={closeButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E6D3A3';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.color = '#FFFFFF';
                            }}
                        >
                            ✕
                        </button>
                        <h2 style={sectionTitleStyle}>
                            Saisir votre prescription manuellement
                        </h2>
                        <p style={{
                            fontSize: isMobile ? '14px' : '16px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Syne", sans-serif',
                            marginBottom: '0',
                            marginTop: '8px',
                            letterSpacing: '0.5px'
                        }}>
                            Entrez vos valeurs de prescription pour chaque œil
                        </p>
                    </div>

                    {/* Corps du modal */}
                    <div style={{ 
                        padding: isMobile ? '20px' : '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            marginBottom: '30px',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '1.1rem' : '1rem',
                            textAlign: 'center',
                            color: '#1a1a1a',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '1px'
                        }}>
                            Montures Optiques
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '30px' }}>
                            {renderEyeSection('OD – Œil Droit')}
                            {renderEyeSection('OS – Œil Gauche')}
                        </div>

                        {/* Boutons d'action */}
                        <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px' }}>
                            <button
                                onClick={async () => {
                                    // Sauvegarder la prescription dans PocketBase avant de continuer
                                    await saveManualPrescriptionToPocketBase();
                                    setScreen('LENS_CHOICE');
                                }}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '16px 24px' : '18px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    backgroundColor: '#D4AF37',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: isMobile ? '16px' : '18px',
                                    fontWeight: '700',
                                    fontFamily: '"Syne", sans-serif',
                                    letterSpacing: '1px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#B8941F';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(212, 175, 55, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
                                }}
                            >
                                Continuer vers les verres
                            </button>
                            <button
                                onClick={() => setScreen('METHOD_SELECT')}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '16px 24px' : '18px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    backgroundColor: '#D4AF37',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: isMobile ? '14px' : '16px',
                                    fontWeight: '600',
                                    fontFamily: '"Syne", sans-serif',
                                    letterSpacing: '0.5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#B8941F';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(212, 175, 55, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
                                }}
                            >
                                ← Retour à la prescription
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderLensChoiceScreen = () => {
        const framePrice = product?.price || 0;
        const lensesPrice = lensTypeChoice?.price || 0;
        const totalPrice = framePrice + lensesPrice;

        return (
            <div style={modalContainerStyle}>
                <div style={modalContentStyle}>
                    {/* Header moderne */}
                    <div style={headerStyle}>
                        <button
                            onClick={() => setScreen(
                                prescriptionMethod === 'Email Later' ? 'METHOD_SELECT' :
                                prescriptionMethod === 'Upload' ? 'UPLOAD' : 'MANUAL'
                            )}
                            style={{
                                ...closeButtonStyle,
                                left: isMobile ? '15px' : '20px',
                                right: 'auto'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E6D3A3';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.color = '#FFFFFF';
                            }}
                        >
                            ←
                        </button>
                        <button
                            onClick={onClose}
                            style={closeButtonStyle}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#E6D3A3';
                                e.currentTarget.style.color = '#1a1a1a';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.color = '#FFFFFF';
                            }}
                        >
                            ✕
                        </button>
                        <h2 style={sectionTitleStyle}>
                            Choose Your Lenses
                        </h2>
                        <p style={{
                            fontSize: isMobile ? '14px' : '16px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Syne", sans-serif',
                            marginBottom: '0',
                            marginTop: '8px',
                            letterSpacing: '0.5px'
                        }}>
                            Sélectionnez le type de verres pour vos montures optiques
                        </p>
                    </div>

                    {/* Corps du modal */}
                    <div style={{
                        padding: isMobile ? '20px' : '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            fontSize: isMobile ? '1.1rem' : '1rem',
                            textAlign: 'center',
                            color: '#1a1a1a',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '1px'
                        }}>
                            Montures Optiques
                        </div>

                        {/* Sections de verres optiques avec style moderne */}
                        {OPTICAL_LENS_OPTIONS.map((section, sectionIndex) => (
                            <div key={sectionIndex} style={{ marginBottom: isMobile ? '30px' : '40px' }}>
                                <h3 style={{
                                    fontSize: isMobile ? '1.2rem' : '1.3rem',
                                    fontWeight: 'bold',
                                    marginBottom: isMobile ? '15px' : '20px',
                                    color: '#1a1a1a',
                                    textAlign: 'left',
                                    fontFamily: '"Syne", sans-serif',
                                    letterSpacing: '0.5px',
                                    textTransform: 'uppercase'
                                }}>
                                    {section.section}
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
                                    {section.options.map((option, optionIndex) => {
                                        const isSelected = lensTypeChoice?.type === option.type;
                                        
                                        return (
                                            <div
                                                key={optionIndex}
                                                onClick={() => setLensTypeChoice(option)}
                                                style={{
                                                    padding: isMobile ? '18px 24px' : '24px 32px',
                                                    borderRadius: isMobile ? '12px' : '16px',
                                                    border: isSelected ? '2px solid #E6D3A3' : '2px solid #E6D3A3',
                                                    cursor: 'pointer',
                                                    background: isSelected ? 'rgba(0, 0, 0, 0.45)' : '#FFFFFF',
                                                    backdropFilter: isSelected ? 'blur(10px)' : 'none',
                                                    WebkitBackdropFilter: isSelected ? 'blur(10px)' : 'none',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    transition: 'all 0.3s ease',
                                                    fontFamily: '"Syne", sans-serif',
                                                    fontSize: isMobile ? '16px' : '18px',
                                                    fontWeight: '600',
                                                    color: isSelected ? '#FFFFFF' : '#1a1a1a',
                                                    letterSpacing: '0.5px'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = '#E6D3A3';
                                                    e.currentTarget.style.color = isSelected ? '#1a1a1a' : '#FFFFFF';
                                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(230, 211, 163, 0.3)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isSelected) {
                                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                                        e.currentTarget.style.color = '#1a1a1a';
                                                        e.currentTarget.style.transform = 'translateY(0)';
                                                        e.currentTarget.style.boxShadow = 'none';
                                                    }
                                                }}
                                            >
                                                <div style={{ textAlign: 'left', flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                                        {option.type}
                                                    </div>
                                                    {option.subtitle && (
                                                        <div style={{
                                                            fontSize: isMobile ? '12px' : '14px',
                                                            opacity: 0.7,
                                                            fontFamily: '"Syne", sans-serif',
                                                            marginBottom: '4px'
                                                        }}>
                                                            {option.subtitle}
                                                        </div>
                                                    )}
                                                    {option.warranty && (
                                                        <div style={{
                                                            fontSize: isMobile ? '11px' : '12px',
                                                            opacity: 0.8,
                                                            fontFamily: '"Syne", sans-serif',
                                                            fontWeight: '600',
                                                            marginBottom: '4px'
                                                        }}>
                                                            {option.warranty}
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        fontSize: isMobile ? '12px' : '14px',
                                                        opacity: 0.7,
                                                        fontFamily: '"Syne", sans-serif'
                                                    }}>
                                                        {option.delay}
                                                    </div>
                                                </div>
                                                <strong style={{
                                                    fontSize: isMobile ? '16px' : '18px',
                                                    color: isSelected ? '#FFFFFF' : '#1a1a1a',
                                                    fontFamily: '"Syne", sans-serif',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    {formatPrice(option.price)}
                                                </strong>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Section récapitulatif */}
                        {lensTypeChoice && (
                            <div style={{
                                marginTop: '30px',
                                padding: isMobile ? '18px 24px' : '24px 32px',
                                borderRadius: isMobile ? '12px' : '16px',
                                background: 'rgba(0, 0, 0, 0.45)',
                                backdropFilter: 'blur(10px)',
                                WebkitBackdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px',
                                    fontSize: isMobile ? '16px' : '14px',
                                    fontFamily: '"Syne", sans-serif'
                                }}>
                                    <span style={{ color: '#1a1a1a' }}>Monture</span>
                                    <strong style={{ color: '#1a1a1a', fontFamily: '"Syne", sans-serif' }}>{formatPrice(framePrice)}</strong>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '8px',
                                    fontSize: isMobile ? '16px' : '14px',
                                    fontFamily: '"Syne", sans-serif'
                                }}>
                                    <span style={{ color: '#1a1a1a' }}>Verres</span>
                                    <strong style={{ color: '#1a1a1a', fontFamily: '"Syne", sans-serif' }}>{formatPrice(lensesPrice)}</strong>
                                </div>
                                <hr style={{ margin: '10px 0', borderColor: 'rgba(255,255,255,0.15)' }} />
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    fontSize: isMobile ? '1.2rem' : '1.1rem',
                                    fontWeight: 'bold',
                                    color: '#1a1a1a',
                                    fontFamily: '"Syne", sans-serif',
                                    letterSpacing: '1px'
                                }}>
                                    <span>Total</span>
                                    <strong>{formatPrice(totalPrice)}</strong>
                                </div>
                            </div>
                        )}

                        {/* Boutons d'action */}
                        <div style={{ display: 'flex', gap: isMobile ? '12px' : '16px', marginTop: '30px' }}>
                            <button
                                onClick={() => setScreen(
                                    prescriptionMethod === 'Email Later' ? 'METHOD_SELECT' :
                                    prescriptionMethod === 'Upload' ? 'UPLOAD' : 'MANUAL'
                                )}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '16px 24px' : '18px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    backgroundColor: '#D4AF37',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: isMobile ? '14px' : '16px',
                                    fontWeight: '600',
                                    fontFamily: '"Syne", sans-serif',
                                    letterSpacing: '0.5px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    boxShadow: '0 8px 25px rgba(212, 175, 55, 0.3)'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#B8941F';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(212, 175, 55, 0.4)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#D4AF37';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
                                }}
                            >
                                ← Retour à la prescription
                            </button>
                            <button
                                onClick={handleFinalAddToCart}
                                disabled={!lensTypeChoice}
                                style={{
                                    width: '100%',
                                    padding: isMobile ? '16px 24px' : '18px 32px',
                                    borderRadius: isMobile ? '12px' : '16px',
                                    backgroundColor: lensTypeChoice ? '#D4AF37' : '#E9ECEF',
                                    color: lensTypeChoice ? '#FFFFFF' : '#6C757D',
                                    border: 'none',
                                    fontSize: isMobile ? '16px' : '18px',
                                    fontWeight: '700',
                                    fontFamily: '"Syne", sans-serif',
                                    letterSpacing: '1px',
                                    cursor: lensTypeChoice ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.3s ease',
                                    textTransform: 'uppercase',
                                    boxShadow: lensTypeChoice ? '0 8px 25px rgba(212, 175, 55, 0.3)' : 'none'
                                }}
                                onMouseEnter={(e) => {
                                    if (lensTypeChoice) {
                                        e.currentTarget.style.backgroundColor = '#B8941F';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                        e.currentTarget.style.boxShadow = '0 12px 35px rgba(212, 175, 55, 0.4)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (lensTypeChoice) {
                                        e.currentTarget.style.backgroundColor = '#D4AF37';
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(212, 175, 55, 0.3)';
                                    }
                                }}
                            >
                                {lensTypeChoice ? '✓ Ajouter au panier' : 'Choisir une option'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'auto'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                maxWidth: '100%',
                maxHeight: '100%',
                overflow: 'auto',
                position: 'relative'
            }}>
                {screen === 'METHOD_SELECT' && renderMethodSelectScreen()}
                {screen === 'UPLOAD' && renderUploadScreen()}
                {screen === 'MANUAL' && renderManualScreen()}
                {screen === 'LENS_CHOICE' && renderLensChoiceScreen()}
            </div>
        </div>
    );
};

export default OpticalLensesModal;
