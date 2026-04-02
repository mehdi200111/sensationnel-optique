import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    
    const { login, isAuthenticated } = useAuth();
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
        
        if (!email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Veuillez entrer un email valide';
        }
        
        if (!password.trim()) {
            newErrors.password = 'Le mot de passe est requis';
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
            const result = await login({ email, password });
            
            if (result.success) {
                navigate('/profile');
            } else {
                setErrors({ general: result.error || 'Identifiants incorrects' });
            }
        } catch (error) {
            setErrors({ general: 'Une erreur est survenue. Veuillez réessayer.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Vérification si le formulaire est valide
    const isFormValid = email.trim() && password.trim() && validateEmail(email);

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
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{
                        color: '#333',
                        fontWeight: '600',
                        fontSize: '24px',
                        marginBottom: '8px'
                    }}>Connexion</h2>
                    <p style={{
                        color: '#666',
                        fontSize: '14px',
                        margin: 0
                    }}>Accédez à votre compte EYEWEAR PRO</p>
                </div>

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
                    }}>{errors.general}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Adresse e-mail</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (errors.email) {
                                    setErrors(prev => ({ ...prev, email: '' }));
                                }
                            }}
                            placeholder="exemple@email.com"
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: errors.email ? '1px solid #e53e3e' : '1px solid #ddd',
                                borderRadius: '6px',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                                outline: 'none',
                                transition: 'border-color 0.3s ease'
                            }}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <div style={{
                                color: '#e53e3e',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>{errors.email}</div>
                        )}
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>Mot de passe</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    if (errors.password) {
                                        setErrors(prev => ({ ...prev, password: '' }));
                                    }
                                }}
                                placeholder="••••••••"
                                style={{
                                    width: '100%',
                                    padding: '12px 40px 12px 12px',
                                    border: errors.password ? '1px solid #e53e3e' : '1px solid #ddd',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                    outline: 'none',
                                    transition: 'border-color 0.3s ease'
                                }}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#666',
                                    fontSize: '16px',
                                    padding: '0'
                                }}
                                disabled={isLoading}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && (
                            <div style={{
                                color: '#e53e3e',
                                fontSize: '12px',
                                marginTop: '4px'
                            }}>{errors.password}</div>
                        )}
                    </div>

                    <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: '#cca042',
                                textDecoration: 'none',
                                fontSize: '14px',
                                fontWeight: '500'
                            }}
                        >
                            Mot de passe oublié ?
                        </Link>
                    </div>

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
                            justifyContent: 'center'
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
                                Connexion en cours...
                            </>
                        ) : (
                            'Se connecter'
                        )}
                    </button>
                </form>

                <div style={{
                    textAlign: 'center',
                    marginTop: '24px',
                    fontSize: '14px',
                    color: '#666'
                }}>
                    Pas encore de compte ?{' '}
                    <Link
                        to="/register"
                        style={{
                            color: '#cca042',
                            textDecoration: 'none',
                            fontWeight: '600'
                        }}
                    >
                        S'inscrire
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;