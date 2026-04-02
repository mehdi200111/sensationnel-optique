import PocketBase from 'pocketbase';

async function testNewUrl() {
  console.log('=== TEST NOUVELLE URL POCKETBASE ===');
  console.log('URL testée: http://192.168.11.214:8090');
  
  try {
    const pb = new PocketBase('http://192.168.11.214:8090');
    
    // Test de connexion
    await pb.health.check();
    console.log('✅ PocketBase accessible');
    
    // Test des produits
    const products = await pb.collection('products').getFullList({ limit: 3 });
    console.log(`✅ ${products.length} produits trouvés`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - ${product.type} - ${product.gender}`);
    });
    
    console.log('\n✅ L\'URL fonctionne !');
    
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    
    console.log('\n=== SOLUTIONS ===');
    console.log('1. Vérifiez que PocketBase tourne sur cette machine');
    console.log('2. Essayez avec: http://localhost:8090');
    console.log('3. Ou: http://127.0.0.1:8090');
    console.log('4. Ou: http://192.168.1.13:8090');
  }
}

testNewUrl();
