import PocketBase from 'pocketbase';

// Simuler exactement ce que fait votre frontend
const pb = new PocketBase('http://localhost:8090');

async function testFrontendConnection() {
  console.log('=== TEST CONNEXION FRONTEND ===');
  console.log('URL utilisée:', 'http://localhost:8090');
  
  try {
    // Test 1: Connexion de base
    await pb.health.check();
    console.log('✅ PocketBase accessible');
    
    // Test 2: Récupération de produits comme votre code
    const gender = 'homme';
    const productType = 'solaire';
    
    console.log('\n🔍 Test filtres:');
    console.log('- gender:', gender);
    console.log('- type:', productType);
    
    // Construire les filtres exactement comme votre code
    const filters = [];
    
    if (gender) {
      filters.push(pb.filter('gender ~ {:gender}', { gender }));
    }
    
    if (productType) {
      filters.push(pb.filter('type ~ {:type}', { type: productType }));
    }
    
    const options = {};
    if (filters.length > 0) {
      options.filter = filters.join(' && ');
    }
    
    console.log('Filtre généré:', options.filter);
    
    // Récupérer les produits
    const products = await pb.collection('products').getFullList(options);
    console.log(`✅ ${products.length} produits trouvés`);
    
    if (products.length > 0) {
      console.log('\n📦 Produits disponibles:');
      products.slice(0, 3).forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - ${product.price}€`);
      });
    }
    
    console.log('\n✅ CONNEXION FRONTEND FONCTIONNELLE');
    console.log('🚀 Redémarrez votre application React (npm run dev)');
    console.log('📂 Les produits devraient maintenant s\'afficher');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testFrontendConnection();
