// Exemple d'intégration i18n dans OpticalLensesModal.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext.jsx';
import pb from '../pocketbase.js';
import { useAppTranslation } from '../hooks/useTranslation.js';

// Utiliser le hook de traduction
const OpticalLensesModal = ({ product, onClose, onFinish, selectedColor: propSelectedColor }) => {
    const { t, isRTL } = useAppTranslation();
    const { addToCart } = useCart();

    // ... reste du code existant ...

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
                        {t('lenses.chooseYourLenses')}
                    </h2>
                    <p style={{
                        fontSize: isMobile ? '14px' : '16px',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontFamily: '"Syne", sans-serif',
                        marginBottom: '0',
                        marginTop: '8px',
                        letterSpacing: '0.5px'
                    }}>
                        {t('lenses.selectLensType')}
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
                            {t('lenses.addPrescription')}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '12px' : '16px' }}>
                            {/* Bouton Upload File */}
                            <button
                                onClick={() => {
                                    setPrescriptionMethod('Upload');
                                    setScreen('UPLOAD');
                                }}
                                style={optionButtonStyle}
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
                                className="flex items-center gap-4 p-4 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition-all"
                            >
                                <span style={iconStyle}>📄</span>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                        {t('lenses.uploadPrescription')}
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
                                style={optionButtonStyle}
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
                                className="flex items-center gap-4 p-4 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition-all"
                            >
                                <span style={iconStyle}>✏️</span>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                        {t('lenses.enterPrescription')}
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '12px' : '14px', 
                                        opacity: 0.7,
                                        fontFamily: '"Syne", sans-serif'
                                    }}>
                                        {t('prescription.enterValues')}
                                    </div>
                                </div>
                            </button>

                            {/* Bouton Email Later */}
                            <button
                                onClick={() => handleFinishSimple('Email Later')}
                                style={optionButtonStyle}
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
                                className="flex items-center gap-4 p-4 border-2 border-yellow-400 rounded-lg hover:bg-yellow-50 transition-all"
                            >
                                <span style={iconStyle}>✉️</span>
                                <div style={{ textAlign: 'left', flex: 1 }}>
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px', fontFamily: '"Syne", sans-serif' }}>
                                        {t('lenses.emailLater')}
                                    </div>
                                    <div style={{ 
                                        fontSize: isMobile ? '12px' : '14px', 
                                        opacity: 0.7,
                                        fontFamily: '"Syne", sans-serif'
                                    }}>
                                        {t('prescription.sendLaterDesc')}
                                    </div>
                                </div>
                            </button>
                        </div>
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
                        {title.includes('Droit') ? t('prescription.rightEye') : t('prescription.leftEye')}
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
                            className="w-full px-3 py-2 border border-yellow-400 rounded-md bg-gray-800 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">{t('lenses.sphere')}</option>
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
                            className="w-full px-3 py-2 border border-yellow-400 rounded-md bg-gray-800 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">{t('lenses.cylinder')}</option>
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
                            className="w-full px-3 py-2 border border-yellow-400 rounded-md bg-gray-800 text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        >
                            <option value="">{t('lenses.axis')}</option>
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
                            {t('prescription.title')}
                        </h2>
                        <p style={{
                            fontSize: isMobile ? '14px' : '16px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontFamily: '"Syne", sans-serif',
                            marginBottom: '0',
                            marginTop: '8px',
                            letterSpacing: '0.5px'
                        }}>
                            {t('prescription.subtitle')}
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
                                className="w-full py-4 px-8 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all transform hover:scale-105"
                            >
                                {t('prescription.continueToLenses')}
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
                                className="w-full py-4 px-8 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all"
                            >
                                {t('common.back')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ... reste du composant avec les autres méthodes de rendu
};

export default OpticalLensesModal;
