import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function testNewLoginLogic() {
  console.log('=== TEST NOUVELLE LOGIQUE DE CONNEXION ===');
  
  // Test 1: Email existe et mot de passe correct
  console.log('\n1. Test: Email existe + mot de passe correct');
  try {
    const userRecord = await pb.collection('users').getFirstListItem(`email="test@example.com"`);
    console.log('✅ Étape 1 - Email trouvé:', userRecord.email);
    
    const authData = await pb.collection('users').authWithPassword('test@example.com', 'password123');
    console.log('✅ Étape 2 - Mot de passe correct');
    console.log('✅ Connexion réussie');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  // Test 2: Email n'existe pas
  console.log('\n2. Test: Email n\'existe pas');
  try {
    const userRecord = await pb.collection('users').getFirstListItem(`email="nonexistent@example.com"`);
    console.log('✅ Email trouvé:', userRecord.email);
  } catch (error) {
    if (error.status === 404) {
      console.log('✅ Étape 1 - Email non trouvé (comportement attendu)');
    } else {
      console.error('❌ Erreur inattendue:', error.message);
    }
  }
  
  // Test 3: Email existe mais mot de passe incorrect
  console.log('\n3. Test: Email existe + mot de passe incorrect');
  try {
    const userRecord = await pb.collection('users').getFirstListItem(`email="test@example.com"`);
    console.log('✅ Étape 1 - Email trouvé:', userRecord.email);
    
    const authData = await pb.collection('users').authWithPassword('test@example.com', 'wrongpassword');
    console.log('✅ Étape 2 - Mot de passe accepté');
  } catch (error) {
    if (error.status === 400) {
      console.log('✅ Étape 2 - Mot de passe incorrect (comportement attendu)');
    } else {
      console.error('❌ Erreur inattendue:', error.message);
    }
  }
  
  console.log('\n=== FIN DES TESTS ===');
}

testNewLoginLogic();
