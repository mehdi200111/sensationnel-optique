import PocketBase from 'pocketbase';

// Test avec différentes URLs PocketBase
const urls = [
  'http://172.20.10.3:8090',  // URL dans .env
  'http://127.0.0.1:8090',    // Localhost
  'http://192.168.1.13:8090', // Ancienne URL
  'http://localhost:8090'     // Localhost alias
];

async function testAllUrls() {
  console.log('=== TEST COMPLET DE CONNEXION POCKETBASE ===\n');
  
  for (const url of urls) {
    console.log(`\n🔍 Test de connexion à: ${url}`);
    const pb = new PocketBase(url);
    
    try {
      // Test simple de health check
      console.log('1. Test de santé du serveur...');
      const healthResponse = await pb.send('/api/health', {
        method: 'GET'
      });
      console.log('✅ Serveur répond:', healthResponse);
      
      // Test d'accès à la collection products
      console.log('2. Test d\'accès aux produits...');
      const products = await pb.collection('products').getFirstListItem('', { skipTotal: true });
      console.log('✅ Produits accessibles, premier produit:', products.id);
      
      console.log(`✅ ${url} - CONNEXION RÉUSSIE`);
      break;
      
    } catch (error) {
      console.log(`❌ ${url} - ÉCHEC:`);
      console.log(`   Status: ${error.status || 'N/A'}`);
      console.log(`   Message: ${error.message || 'N/A'}`);
      
      if (error.originalError && error.originalError.code === 'UND_ERR_CONNECT_TIMEOUT') {
        console.log('   ⚠️  Timeout de connexion - PocketBase n\'est probablement pas démarré');
      } else if (error.status === 404) {
        console.log('   ⚠️  Serveur accessible mais API non trouvée');
      }
    }
  }
}

testAllUrls().catch(console.error);
