// Script de test pour vérifier la connexion PocketBase et le chargement des produits
import PocketBase from 'pocketbase';

console.log('=== TEST DE CONNEXION POCKETBASE ===');

// URL depuis votre .env
const PB_URL = 'http://192.168.1.13:8090';
console.log('URL PocketBase:', PB_URL);

const pb = new PocketBase(PB_URL);

async function testConnection() {
    try {
        console.log('\n1. Test de connexion basique...');
        
        // Test de santé du serveur
        const healthResponse = await fetch(`${PB_URL}/api/health`);
        console.log('Health check status:', healthResponse.status);
        
        if (healthResponse.ok) {
            const healthData = await healthResponse.json();
            console.log('Health data:', healthData);
        }
        
        console.log('\n2. Test d\'authentification (guest)...');
        // Pas besoin d'authentification pour lire les produits publics
        
        console.log('\n3. Test de chargement des produits...');
        const products = await pb.collection('products').getFullList({
            sort: '-created'
        });
        
        console.log('✅ Succès! Nombre de produits trouvés:', products.length);
        
        if (products.length > 0) {
            console.log('\nPremier produit trouvé:');
            console.log('- ID:', products[0].id);
            console.log('- Nom:', products[0].name);
            console.log('- Prix:', products[0].price);
            console.log('- Image:', products[0].img);
        }
        
        console.log('\n4. Test avec filtres (comme dans SunglassesMobile)...');
        const filteredProducts = await pb.collection('products').getFullList({
            filter: 'type ~ "solaire"',
            sort: '-created'
        });
        
        console.log('✅ Produits solaires trouvés:', filteredProducts.length);
        
        console.log('\n=== TEST RÉUSSI ===');
        return { success: true, totalProducts: products.length, solarProducts: filteredProducts.length };
        
    } catch (error) {
        console.error('\n❌ ERREUR DÉTECTÉE:');
        console.error('Type:', error.constructor.name);
        console.error('Message:', error.message);
        console.error('Status:', error.status);
        console.error('URL:', error.url);
        
        // Analyse spécifique des erreurs
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            console.error('\n🔍 ANALYSE: Erreur de réseau - Possible causes:');
            console.error('- PocketBase n\'est pas démarré');
            console.error('- Adresse IP incorrecte');
            console.error('- Firewall bloquant la connexion');
            console.error('- Téléphone et PC sur des réseaux différents');
        } else if (error.status === 404) {
            console.error('\n🔍 ANALYSE: Collection "products" non trouvée');
        } else if (error.status >= 500) {
            console.error('\n🔍 ANALYSE: Erreur serveur PocketBase');
        }
        
        return { success: false, error: error.message };
    }
}

// Exécuter le test
testConnection().then(result => {
    console.log('\nRésultat final:', result);
}).catch(error => {
    console.error('Erreur critique:', error);
});
