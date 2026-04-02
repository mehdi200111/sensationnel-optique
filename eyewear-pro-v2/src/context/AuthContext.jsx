import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/pocketbaseService';
import pb from '../pocketbase';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already authenticated
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);

        // Listen to auth changes
        const unsubscribe = authService.onAuthChange((token, record) => {
            console.log('AuthContext: onAuthChange appelé avec:', { 
                token: token ? 'token_present' : 'no_token', 
                record: record,
                recordType: typeof record,
                recordKeys: record ? Object.keys(record) : 'no_record'
            });
            
            if (record && typeof record === 'object') {
                console.log('AuthContext: Mise à jour user avec record valide');
                setUser(record);
                console.log('AuthContext: user mis à jour via onAuthChange:', record);
            } else {
                console.log('AuthContext: Record invalide, mise à null');
                setUser(null);
            }
            
            console.log('AuthContext: authService.isAuthenticated() après mise à jour:', authService.isAuthenticated());
        });

        return unsubscribe;
    }, []);

    const login = async (userData) => {
        setLoading(true);
        console.log('AuthContext: 1. login appelé avec:', userData);
        
        try {
            // Utilise authService.login pour l'authentification PocketBase
            const result = await authService.login(userData.email, userData.password);
            
            console.log('AuthContext: 2. Résultat de authService.login:', result);
            
            if (result.success) {
                console.log('AuthContext: 3. Connexion réussie, mise à jour user');
                
                // Force la mise à jour manuelle au cas où onAuthChange ne fonctionne pas
                if (result.data && result.data.record) {
                    console.log('AuthContext: 4. Mise à jour manuelle de user avec:', result.data.record);
                    setUser(result.data.record);
                    
                    // Petite attente pour s'assurer que l'état React est mis à jour
                    setTimeout(() => {
                        console.log('AuthContext: 5. État final - user:', result.data.record);
                        console.log('AuthContext: 5. État final - isAuthenticated:', !!result.data.record);
                    }, 50);
                }
                
                return result;
            } else {
                console.log('AuthContext: 3. Échec de connexion:', result.error);
                return result;
            }
        } catch (error) {
            console.error('AuthContext: 2. Erreur complète lors de la connexion:', error);
            console.error('AuthContext: 2. Error stack:', error.stack);
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (email, password, name) => {
        setLoading(true);
        console.log('=== AUTH CONTEXT REGISTER ===');
        console.log('AuthContext: Tentative d\'inscription avec:', { email, name });
        
        try {
            // Création de l'utilisateur dans PocketBase
            const userData = await pb.collection('users').create({
                email: email,
                password: password,
                passwordConfirm: password,
                name: name
            });
            
            console.log('AuthContext: Utilisateur créé avec succès:', userData);
            
            // Authentification automatique après création
            const authData = await pb.collection('users').authWithPassword(email, password);
            console.log('AuthContext: Utilisateur authentifié après inscription:', authData);
            
            // Mise à jour du state React
            setUser(authData.record);
            
            setLoading(false);
            return { success: true, data: userData };
        } catch (error) {
            console.error('AuthContext: Erreur lors de l\'inscription:', error?.data || error);
            setLoading(false);
            return { success: false, error: error?.data?.message || error.message };
        }
    };

    const logout = () => {
        console.log('=== AUTH CONTEXT LOGOUT ===');
        console.log('AuthContext: Déconnexion appelée');
        console.log('AuthContext: État avant logout - user:', user);
        
        // Effacer les favoris du localStorage lors de la déconnexion
        localStorage.removeItem('favorites');
        
        authService.logout();
        
        console.log('AuthContext: authService.logout() appelé');
        console.log('AuthContext: Favoris effacés du localStorage');
        console.log('AuthContext: Mise à jour de user à null...');
        setUser(null);
        
        console.log('AuthContext: User mis à null');
        console.log('AuthContext: Déconnexion terminée');
        console.log('==========================');
    };

    const value = {
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated: !!user && typeof user === 'object' && Object.keys(user).length > 0
    };

    // Debug: Log de l'état actuel du contexte
    console.log('AuthContext: État actuel:', {
        user: user,
        isAuthenticated: authService.isAuthenticated(),
        loading: loading,
        userIsNull: user === null,
        userIsObject: typeof user === 'object' && user !== null
    });

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
