import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptPrivacy: false
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Rediriger si déjà connecté
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Validation de l'email
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Validation du formulaire
    const validateForm = () => {
        const newErrors = {};
        
        // Validation du prénom
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        } else if (formData.firstName.trim().length < 2) {
            newErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
        }
        
        // Validation du nom
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        } else if (formData.lastName.trim().length < 2) {
            newErrors.lastName = 'Le nom doit contenir au moins 2 caractères';
        }
        
        // Validation de l'email
        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Veuillez entrer un email valide';
        }
        
        // Validation du mot de passe
        if (!formData.password.trim()) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }
        
        // Validation de la confirmation du mot de passe
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }
        
        // Validation de la politique de confidentialité
        if (!formData.acceptPrivacy) {
            newErrors.acceptPrivacy = 'Vous devez accepter la politique de confidentialité';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Gestion de la soumission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        
        try {
            const result = await register(
                formData.email,
                formData.password,
                `${formData.firstName} ${formData.lastName}`
            );
            
            if (result.success) {
                navigate('/login');
            } else {
                setErrors({
                    general: result.error || 'Une erreur est survenue lors de l\'inscription'
                });
            }
        } catch (error) {
            setErrors({
                general: 'Une erreur est survenue. Veuillez réessayer.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Gestion des changements dans le formulaire
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        
        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Vérifier si le formulaire est valide
    const isFormValid = 
        formData.firstName.trim() && 
        formData.lastName.trim() && 
        formData.email.trim() && 
        formData.password.trim() && 
        formData.confirmPassword.trim() && 
        formData.acceptPrivacy &&
        validateEmail(formData.email) &&
        formData.password === formData.confirmPassword &&
        formData.password.length >= 6;

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f5f5f5',
            padding: '20px',
            fontFamily: '"Syne", sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '450px'
            }}>
                {/* Logo/Titre */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>
                        Inscription
                    </h2>
                    <p style={{
                        color: '#666',
                        fontSize: '14px',
                        margin: 0
                    }}>
                        Créez votre compte EYEWEAR PRO
                    </p>
                </div>

                {/* Message d'erreur général */}
                {errors.general && (
                    <div style={{
                        backgroundColor: '#fee',
                        color: '#c53030',
                        padding: '12px',
                        borderRadius: '6px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        border: '1px solid #fed7d7',
                        textAlign: 'center'
                    }}>
                        {errors.general}
                    </div>
                )}

                {/* Formulaire */}
                <form onSubmit={handleSubmit}>
                    {/* Champs Nom et Prénom */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Prénom
                            </label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                placeholder="Jean"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    paddingLeft: '12px',
                                    border: errors.firstName ? '1px solid #e53e3e' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontFamily: 'Segoe UI, Roboto, sans-serif',
                                    color: '#333333',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    lineHeight: '1.4',
                                    verticalAlign: 'middle'
                                }}
                                disabled={isLoading}
                            />
                            {errors.firstName && (
                                <div style={{
                                    color: '#e53e3e',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {errors.firstName}
                                </div>
                            )}
                        </div>
                        
                        <div style={{ flex: 1 }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#555',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}>
                                Nom
                            </label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                placeholder="Dupont"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    paddingLeft: '12px',
                                    border: errors.lastName ? '1px solid #e53e3e' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    fontFamily: 'Segoe UI, Roboto, sans-serif',
                                    color: '#333333',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease',
                                    lineHeight: '1.4',
                                    verticalAlign: 'middle'
                                }}
                                disabled={isLoading}
                            />
                            {errors.lastName && (
                                <div style={{
                                    color: '#e53e3e',
                                    fontSize: '12px',
                                    marginTop: '4px'
                                }}>
                                    {errors.lastName}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Champ Email */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Adresse e-mail
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemple@email.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingLeft: '12px',
                                border: errors.email ? '1px solid #e53e3e' : '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'Segoe UI, Roboto, sans-serif',
                                color: '#333333',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                lineHeight: '1.4',
                                verticalAlign: 'middle'
                            }}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <div style={{
                                color: '#e53e3e',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {errors.email}
                            </div>
                        )}
                    </div>

                    {/* Champ Mot de passe */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingLeft: '12px',
                                border: errors.password ? '1px solid #e53e3e' : '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'Segoe UI, Roboto, sans-serif',
                                color: '#333333',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                lineHeight: '1.4',
                                verticalAlign: 'middle'
                            }}
                            disabled={isLoading}
                        />
                        {errors.password && (
                            <div style={{
                                color: '#e53e3e',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {errors.password}
                            </div>
                        )}
                    </div>

                    {/* Champ Confirmation Mot de passe */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px',
                                paddingLeft: '12px',
                                border: errors.confirmPassword ? '1px solid #e53e3e' : '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontFamily: 'Segoe UI, Roboto, sans-serif',
                                color: '#333333',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                                lineHeight: '1.4',
                                verticalAlign: 'middle'
                            }}
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && (
                            <div style={{
                                color: '#e53e3e',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {errors.confirmPassword}
                            </div>
                        )}
                    </div>

                    {/* Case à cocher Politique de confidentialité */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            color: '#555'
                        }}>
                            <input
                                type="checkbox"
                                name="acceptPrivacy"
                                checked={formData.acceptPrivacy}
                                onChange={handleChange}
                                style={{
                                    marginTop: '2px',
                                    cursor: 'pointer'
                                }}
                                disabled={isLoading}
                            />
                            <span>
                                J'accepte la{' '}
                                <Link 
                                    to="/privacy-policy" 
                                    style={{
                                        color: '#cca042',
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}
                                >
                                    politique de confidentialité
                                </Link>
                            </span>
                        </label>
                        {errors.acceptPrivacy && (
                            <div style={{
                                color: '#e53e3e',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>
                                {errors.acceptPrivacy}
                            </div>
                        )}
                    </div>

                    {/* Bouton d'inscription */}
                    <button
                        type="submit"
                        disabled={!isFormValid || isLoading}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: (!isFormValid || isLoading) ? '#ccc' : '#cca042',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '16px',
                            fontWeight: '600',
                            cursor: (!isFormValid || isLoading) ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                    >
                        {isLoading ? (
                            <>
                                <span style={{
                                    display: 'inline-block',
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #ffffff',
                                    borderRadius: '50%',
                                    borderTopColor: 'transparent',
                                    animation: 'spin 1s linear infinite'
                                }}></span>
                                Inscription en cours...
                            </>
                        ) : (
                            'S\'inscrire'
                        )}
                    </button>
                </form>

                {/* Lien connexion */}
                <div style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    Déjà un compte ?{' '}
                    <Link
                        to="/login"
                        style={{
                            color: '#cca042',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
                        Connectez-vous
                    </Link>
                </div>

                {/* Animation CSS */}
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default Register;
