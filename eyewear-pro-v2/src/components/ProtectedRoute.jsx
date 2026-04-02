import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Si l'utilisateur n'est pas connecté, redirige vers /login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si l'utilisateur est connecté, affiche le contenu
    return children;
};

export default ProtectedRoute;
