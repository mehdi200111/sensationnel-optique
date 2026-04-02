import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import pb from '../pocketbase.js';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [tokenValid, setTokenValid] = useState(true);
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Récupérer le token depuis l'URL au chargement
    useEffect(() => {
        const urlToken = searchParams.get('token');
        console.log('Token récupéré depuis l\'URL:', urlToken); // Debug
        
        if (!urlToken) {
            setError('Lien de réinitialisation invalide.');
            setTokenValid(false);
        } else {
            setToken(urlToken);
        }
    }, [searchParams]);

    // Validation du mot de passe
    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Reset messages
        setMessage('');
        setError('');
        
        // Validation
        if (!password.trim()) {
            setError('Veuillez entrer un nouveau mot de passe');
            return;
        }
        
        if (!validatePassword(password)) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }
        
        if (!confirmPassword.trim()) {
            setError('Veuillez confirmer votre mot de passe');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        
        if (!token) {
            setError('Lien de réinitialisation invalide.');
            return;
        }
        
        setLoading(true);
        
        try {
            console.log('Tentative de réinitialisation avec token:', token); // Debug
            // Appel PocketBase pour confirmer la réinitialisation
            await pb.collection('users').confirmPasswordReset(token, password, password);
            console.log('Réinitialisation réussie'); // Debug
            
            setMessage('Votre mot de passe a été modifié avec succès.');
            
            // Rediriger vers login après 2 secondes
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            
        } catch (err) {
            console.error('Erreur lors de la réinitialisation du mot de passe:', err);
            
            // Gestion des erreurs spécifiques
            if (err.status === 400) {
                setError('Lien de réinitialisation invalide ou expiré.');
            } else if (err.status === 404) {
                setError('Lien de réinitialisation invalide.');
            } else {
                setError('Une erreur est survenue. Veuillez réessayer plus tard.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Si le token n'est pas valide, afficher une page d'erreur
    if (!tokenValid) {
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
                    boxSizing: 'border-box',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#333',
                        margin: '0 0 16px 0'
                    }}>
                        Lien invalide
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0 0 24px 0',
                        lineHeight: '1.5'
                    }}>
                        Ce lien de réinitialisation est invalide ou a expiré.
                    </p>
                    <button
                        onClick={() => navigate('/forgot-password')}
                        style={{
                            padding: '12px 24px',
                            backgroundColor: '#cca042',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#b89138';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = '#cca042';
                        }}
                    >
                        Demander un nouveau lien
                    </button>
                </div>
            </div>
        );
    }

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
                        Réinitialiser le mot de passe
                    </h1>
                    <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '0',
                        lineHeight: '1.5'
                    }}>
                        Entrez votre nouveau mot de passe
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
                            Nouveau mot de passe
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#333',
                            marginBottom: '8px'
                        }}>
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
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
                                Réinitialisation...
                            </>
                        ) : (
                            'Réinitialiser le mot de passe'
                        )}
                    </button>
                </form>

                {/* Lien retour */}
                <div style={{ textAlign: 'center', marginTop: '24px' }}>
                    <button
                        onClick={() => navigate('/login')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#cca042',
                            fontSize: '14px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            textDecoration: 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.textDecoration = 'none';
                        }}
                    >
                        ← Retour à la connexion
                    </button>
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

export default ResetPassword;
