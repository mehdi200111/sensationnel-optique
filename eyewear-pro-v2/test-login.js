import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testLogin() {
  console.log('=== TEST DE CONNEXION AVEC BASE DE DONNÉES ===');
  
  // Test 1: Connexion avec identifiants valides
  console.log('\n1. Test avec identifiants valides (test@example.com / password123):');
  try {
    const authData = await pb.collection('users').authWithPassword('test@example.com', 'password123');
    console.log('✅ Connexion réussie:', authData);
    console.log('✅ Utilisateur connecté:', authData.record.email);
    console.log('✅ Token généré:', authData.token ? 'OUI' : 'NON');
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    console.error('❌ Status:', error.status);
  }
  
  // Test 2: Connexion avec email invalide
  console.log('\n2. Test avec email invalide (wrong@example.com / password123):');
  try {
    const authData = await pb.collection('users').authWithPassword('wrong@example.com', 'password123');
    console.log('✅ Connexion réussie:', authData);
  } catch (error) {
    console.error('❌ Erreur attendue:', error.message);
    console.error('❌ Status:', error.status);
  }
  
  // Test 3: Connexion avec mot de passe invalide
  console.log('\n3. Test avec mot de passe invalide (test@example.com / wrongpassword):');
  try {
    const authData = await pb.collection('users').authWithPassword('test@example.com', 'wrongpassword');
    console.log('✅ Connexion réussie:', authData);
  } catch (error) {
    console.error('❌ Erreur attendue:', error.message);
    console.error('❌ Status:', error.status);
  }
  
  // Test 4: Vérification de l'utilisateur dans la base
  console.log('\n4. Vérification des utilisateurs dans la base:');
  try {
    const users = await pb.collection('users').getFullList();
    console.log('✅ Nombre d\'utilisateurs trouvés:', users.length);
    users.forEach((user, index) => {
      console.log(`   Utilisateur ${index + 1}:`, user.email, '| Vérifié:', user.verified);
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération:', error.message);
  }
  
  console.log('\n=== FIN DES TESTS ===');
}

testLogin();
