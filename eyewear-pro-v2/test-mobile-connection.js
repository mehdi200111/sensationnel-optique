// Test script pour vérifier la connectivité PocketBase depuis mobile
import PocketBase from 'pocketbase';

async function testConnection() {
    console.log('Test de connexion PocketBase...');
    
    // Tester avec l'IP locale correcte
    const pbLocal = new PocketBase('http://192.168.1.61:8090');
    
    try {
        console.log('1. Test avec IP locale (192.168.1.61:8090)...');
        const health = await pbLocal.health.check();
        console.log('✅ Connexion réussie avec IP locale:', health);
    } catch (error) {
        console.log('❌ Erreur avec IP locale:', error.message);
    }
    
    // Tester avec localhost
    const pbLocalhost = new PocketBase('http://localhost:8090');
    
    try {
        console.log('2. Test avec localhost (localhost:8090)...');
        const health = await pbLocalhost.health.check();
        console.log('✅ Connexion réussie avec localhost:', health);
    } catch (error) {
        console.log('❌ Erreur avec localhost:', error.message);
    }
    
    // Tester les produits avec la bonne IP
    try {
        console.log('3. Test récupération produits...');
        const products = await pbLocal.collection('products').getFullList();
        console.log(`✅ ${products.length} produits trouvés`);
        
        if (products.length > 0) {
            console.log('Premier produit:', {
                id: products[0].id,
                name: products[0].name,
                price: products[0].price
            });
        }
    } catch (error) {
        console.log('❌ Erreur récupération produits:', error.message);
    }
}

testConnection().catch(console.error);
