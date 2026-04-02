
// Dans App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Assurez-vous d'importer votre Provider
import { CartProvider } from './context/CartContext.jsx'; // 👈 Chemin à vérifier

// Importez vos composants de page/layout
import ResponsiveHeader from './components/ResponsiveHeader.jsx'; 
import SunglassesMobile from './pages/SunglassesMobile.jsx'; 
import OpticalMobile from './pages/OpticalMobile.jsx';
import ProductDetails from './pages/ProductDetailMobile.jsx'; 
import ProductDetailsOptical from './pages/ProductDetailMobileoptical.jsx'; 
import HomeMobile from './pages/HomeMobile.jsx';
import CartPage from './pages/CartPage.jsx';
import FooterMobile from './components/FooterMobile.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import StorePage from './pages/StorePage.jsx';

import ProductsPage from './pages/ProductsPage.jsx';
import AllProductsPage from './pages/AllProductsPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import AddReviewPage from './pages/AddReviewPage.jsx';
import LoginPage from './pages/Login.jsx';
import RegisterPage from './pages/Register.jsx';
import ProfilePage from './pages/Profile.jsx';
import ForgotPasswordPage from './pages/ForgotPassword.jsx';
import ResetPasswordPage from './pages/ResetPassword.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';

const App = () => {
    return (
        // 2. : Placez le CartProvider ici
        <CartProvider> 
            <AuthProvider> {/* Ajouter AuthProvider pour gérer l'authentification */}
                <Router scrollRestoration="manual">
                    <ScrollToTop />
                    
                    {/* Le Header peut maintenant accéder au CartContext et AuthContext */}
                    <ResponsiveHeader />

                   <Routes>
    <Route path="/" element={<HomeMobile />} /> 
    <Route path="/sunglasses/:gender" element={<SunglassesMobile />} />
    <Route path="/sunglasses/detail/:id" element={<ProductDetails />} />
    <Route path="/optical/detail/:id" element={<ProductDetailsOptical />} />
    <Route path="/Optical/:gender" element={<OpticalMobile />} />
    <Route path="/cart" element={<CartPage />} /> 
    <Route path="/checkout" element={<CheckoutPage />} />
    <Route path="/store" element={<StorePage />} />
    <Route path="/products" element={<AllProductsPage />} />
    <Route path="/reviews" element={<ReviewsPage />} />
    <Route path="/add-review" element={<AddReviewPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/profile" element={<ProfilePage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
              </Routes>

             <FooterMobile />
             <WhatsAppButton />
            </Router>
        </AuthProvider>
        </CartProvider>
    );
};

export default App;