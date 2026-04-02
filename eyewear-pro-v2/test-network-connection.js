import PocketBase from 'pocketbase';

// Utiliser l'adresse IP de votre réseau
const pb = new PocketBase('http://192.168.2.83:8090');

async function testNetworkConnection() {
  console.log('=== TEST DE CONNEXION RÉSEAU ===\n');
  
  try {
    // 1. Test de connexion
    console.log('1. Connexion à PocketBase...');
    console.log('URL:', pb.baseUrl);
    
    // 2. Test simple de santé du serveur
    console.log('\n2. Test de santé du serveur...');
    const health = await pb.health.check();
    console.log('✅ Serveur PocketBase en ligne');
    
    // 3. Récupérer tous les produits
    console.log('\n3. Récupération de tous les produits...');
    const allProducts = await pb.collection('products').getFullList();
    console.log(`✅ Trouvé ${allProducts.length} produits au total`);
    
    if (allProducts.length > 0) {
      console.log('\n📋 Premier produit:');
      const firstProduct = allProducts[0];
      console.log('   ID:', firstProduct.id);
      console.log('   Nom:', firstProduct.name);
      console.log('   Prix:', firstProduct.price);
      console.log('   Bestseller:', firstProduct.bestseller);
      console.log('   Images:', firstProduct.images);
      console.log('   Image principale:', firstProduct.img);
      console.log('   Genre:', firstProduct.gender);
      console.log('   Type:', firstProduct.type);
    }
    
    // 4. Filtrer les bestsellers
    console.log('\n4. Filtrage des bestsellers...');
    const bestsellers = allProducts.filter(product => product.bestseller === true);
    console.log(`✅ ${bestsellers.length} produits bestsellers trouvés`);
    
    if (bestsellers.length > 0) {
      console.log('\n🌟 Premier bestseller:');
      console.log('   ID:', bestsellers[0].id);
      console.log('   Nom:', bestsellers[0].name);
      console.log('   Prix:', bestsellers[0].price);
    }
    
    // 5. Test avec filtre PocketBase
    console.log('\n5. Test avec filtre PocketBase...');
    const filteredBestsellers = await pb.collection('products').getFullList({
      filter: 'bestseller = true'
    });
    console.log(`✅ ${filteredBestsellers.length} bestsellers avec filtre`);
    
    console.log('\n✅ TEST TERMINÉ - SUCCÈS');
    
  } catch (error) {
    console.error('\n❌ ERREUR:', error.message);
    console.error('Status:', error.status);
    console.error('Data:', error.data);
    
    if (error.status === 404) {
      console.log('\n💡 La collection "products" n\'existe peut-être pas');
    } else if (error.status === 403) {
      console.log('\n💡 Problème de permissions - vérifie les règles d\'accès');
    } else if (error.status === 0) {
      console.log('\n💡 Impossible de se connecter au serveur PocketBase');
      console.log('   - Vérifie que PocketBase est démarré sur http://192.168.2.83:8090');
      console.log('   - Vérifie que le port 8090 est ouvert sur votre réseau');
      console.log('   - Vérifie l\'adresse IP de votre machine');
    }
  }
}

testNetworkConnection();
