import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import pb from '../pocketbase.js';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Validation de l'email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Fonction pour obtenir l'URL de réinitialisation correcte
    const getResetUrl = () => {
        // Si nous sommes en développement sur localhost, utiliser l'IP locale
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return `http://192.168.1.13:5173/reset-password`;
        }
        // Sinon, utiliser l'origine actuelle (pour la production)
        return `${window.location.origin}/reset-password`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset messages
        setMessage('');
        setError('');
        
        // Validation
        if (!email.trim()) {
            setError('Veuillez entrer votre email');
            return;
        }
        
        if (!validateEmail(email)) {
            setError('Veuillez entrer un email valide');
            return;
        }
        
        setLoading(true);
        
        try {
    const resetUrl = getResetUrl();
    console.log('Envoi de l\'email de réinitialisation à:', email);
    console.log('URL de redirection:', resetUrl);
    
    // IMPORTANT : passer redirectUrl dans un objet
    await pb.collection('users').requestPasswordReset(email, { redirectUrl: resetUrl });
    
    console.log('Email de réinitialisation envoyé avec succès');
    setMessage('Un email de réinitialisation vous a été envoyé.');
    setEmail('');
    
    setTimeout(() => {
        navigate('/login');
    }, 3000);
            
        } catch (err) {
            console.error('Erreur lors de la demande de réinitialisation:', err);
            
            // Gestion des erreurs spécifiques
            if (err.status === 400) {
                setError('Cet email n\'existe pas dans notre base de données.');
            } else if (err.status === 404) {
                setError('Utilisateur non trouvé.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer plus tard.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            fontFamily: '"Inter", sans-serif'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                width: '100%',
                maxWidth: '400px',
                boxSizing: 'border-box'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#333',
                        margin: '0 0 8px 0'
                    }}>
                        Mot de passe oublié
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0',
                        lineHeight: '1.5'
                    }}>
                        Entrez votre email pour recevoir un lien de réinitialisation
                    </p>
                </div>

                {/* Message de succès */}
                {message && (
                    <div style={{
                        backgroundColor: '#d4edda',
                        border: '1px solid #c3e6cb',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        color: '#155724',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}

                {/* Message d'erreur */}
                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        border: '1px solid #f5c6cb',
                        borderRadius: '8px',
                        padding: '12px',
                        marginBottom: '20px',
                        color: '#721c24',
                        fontSize: '14px',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="votre@email.com"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '8px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease',
                                backgroundColor: loading ? '#f9f9f9' : '#fff'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = '#cca042';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = '#ddd';
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: loading ? '#ccc' : '#cca042',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#b89138';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.target.style.backgroundColor = '#cca042';
                            }
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #ffffff',
                                    borderTop: '2px solid transparent',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                Envoi en cours...
                            </>
                        ) : (
                            'Envoyer'
                        )}
                    </button>
                </form>

                {/* Lien retour */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Link
                        to="/login"
                        style={{
                            color: '#cca042',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.textDecoration = 'none';
                        }}
                    >
                        ← Retour à la connexion
                    </Link>
                </div>

                {/* CSS pour l'animation du spinner */}
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default ForgotPassword;
