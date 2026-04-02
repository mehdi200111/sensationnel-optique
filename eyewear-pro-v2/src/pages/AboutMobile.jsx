// pages/AboutMobile.jsx (Version Web/HTML)

import React from 'react';
// Imports React Native (View, Text, StyleSheet, ScrollView) supprimés.

function AboutMobile() {
    
    return (
        // <ScrollView> (RN) devient <main> ou <section> (HTML)
        <main className="about-container"> 
            
            {/* <h2> devient <Text> */}
            <h1 className="header-title">À Propos de Notre Boutique</h1>
            
            {/* <div> devient <View> */}
            <section className="section">
                
                <h2 className="subtitle">Notre Mission</h2>
                <p className="paragraph">
                    Chez OpticShop, notre mission est de fournir des lunettes de haute qualité, 
                    stylées et abordables pour tous. Nous croyons que la protection solaire et 
                    la correction visuelle ne devraient jamais compromettre votre style.
                </p>
            </section>
            
            <section className="section">
                <h2 className="subtitle">Notre Histoire</h2>
                <p className="paragraph">
                    Fondée en 2020 par une équipe d'opticiens passionnés, notre boutique en ligne 
                    a commencé par une simple idée : rendre le choix de lunettes simple et agréable. 
                    Aujourd'hui, nous sommes fiers de servir des milliers de clients satisfaits 
                    partout dans le monde.
                </p>
            </section>

            <section className="section">
                <h2 className="subtitle">La Qualité Avant Tout</h2>
                <p className="paragraph">
                    Chaque paire de lunettes est rigoureusement sélectionnée pour sa durabilité 
                    et son confort. Que vous cherchiez des solaires tendance ou des montures 
                    optiques classiques, nous garantissons des verres de qualité supérieure et 
                    une protection UV maximale.
                </p>
            </section>

        </main>
    );
}

// NOTE : Le bloc StyleSheet.create est ENTIÈREMENT SUPPRIMÉ. 
// Les styles sont appliqués via CSS.

export default AboutMobile;