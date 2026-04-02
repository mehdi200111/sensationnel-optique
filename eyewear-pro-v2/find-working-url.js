import PocketBase from 'pocketbase';

const urls = [
  'http://localhost:8090',
  'http://127.0.0.1:8090',
  'http://192.168.1.13:8090',
  'http://192.168.11.214:8090'
];

async function findWorkingUrl() {
  console.log('=== RECHERCHE URL FONCTIONNELLE POCKETBASE ===');
  
  for (const url of urls) {
    console.log(`\n🔍 Test: ${url}`);
    
    try {
      const pb = new PocketBase(url);
      await pb.health.check();
      
      // Test des produits
      const products = await pb.collection('products').getFullList({ limit: 1 });
      
      console.log(`✅ FONCTIONNE - ${products.length} produits trouvés`);
      console.log(`\n📋 METTRE À JOUR .ENV AVEC:`);
      console.log(`VITE_PB_URL=${url}`);
      
      return url;
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
    }
  }
  
  console.log('\n❌ AUCUNE URL NE FONCTIONNE');
  console.log('\n🚀 DÉMARREZ POCKETBASE:');
  console.log('1. cd eyewear-pro-v2');
  console.log('2. pocketbase.exe serve');
  console.log('3. Relancez ce test');
}

findWorkingUrl();
