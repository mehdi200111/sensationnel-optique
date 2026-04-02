// pages/ContactMobile.jsx (Version Web/HTML)

import React, { useState } from 'react';
// Imports React Native (View, Text, ScrollView, TextInput, TouchableOpacity, Alert) supprimés.

function ContactMobile() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        // Empêche le rechargement de la page par le formulaire HTML standard
        e.preventDefault(); 
        
        if (!name || !email || !message) {
            // Utilisation de la fonction d'alerte native du navigateur
            window.alert('Erreur: Veuillez remplir tous les champs.');
            return;
        }
        
        // Logique d'envoi (API, e-mail, etc.)
        console.log('Formulaire soumis:', { name, email, message });
        
        // Simulation d'envoi réussi
        window.alert('Succès: Votre message a été envoyé ! Nous vous répondrons bientôt.');
        
        // Réinitialisation du formulaire
        setName('');
        setEmail('');
        setMessage('');
    };

    return (
        // <ScrollView> devient <section> ou <div> pour le conteneur principal
        <section className="contact-container"> 
            
            {/* Titres */}
            <h1 className="header-title">Contactez-Nous</h1>
            <p className="description">
                Nous sommes là pour répondre à toutes vos questions.
            </p>
            
            {/* Le formulaire est encapsulé dans une balise <form> */}
            <form className="contact-form" onSubmit={handleSubmit}>
                
                {/* Champ Nom */}
                <label className="label" htmlFor="name">Nom complet</label>
                <input
                    id="name"
                    className="input"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                
                {/* Champ Email */}
                <label className="label" htmlFor="email">Adresse e-mail</label>
                <input
                    id="email"
                    className="input"
                    type="email"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                
                {/* Champ Message */}
                <label className="label" htmlFor="message">Message</label>
                <textarea
                    id="message"
                    className="text-area" // Utilisation de <textarea> pour les champs multi-lignes
                    placeholder="Écrivez votre message ici..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4} // Simule numberOfLines={4}
                    required
                />
                
                {/* Bouton d'envoi : <TouchableOpacity> devient <button type="submit"> */}
                <button type="submit" className="button">
                    Envoyer le Message
                </button>
                
            </form>
            
        </section>
    );
}

// NOTE : Le bloc StyleSheet.create est ENTIÈREMENT SUPPRIMÉ
// Les styles (flex, couleur, padding) sont désormais définis dans un fichier CSS externe.

export default ContactMobile;