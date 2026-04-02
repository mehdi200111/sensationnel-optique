import PocketBase from 'pocketbase';
const pb = new PocketBase('http://192.168.1.13:8090');

async function checkUser() {
  try {
    console.log('Tentative de connexion avec test@example.com...');
    const authData = await pb.collection('users').authWithPassword('test@example.com', 'password123');
    console.log('✅ Connexion réussie:', authData.record.email);
    console.log('ID utilisateur:', authData.record.id);
  } catch (error) {
    console.log('❌ Erreur de connexion:', error.message);
    console.log('Status:', error.status);
    
    if (error.status === 400) {
      console.log('Création de l\'utilisateur de test...');
      try {
        const user = await pb.collection('users').create({
          email: 'test@example.com',
          password: 'password123',
          passwordConfirm: 'password123',
          name: 'Test User'
        });
        console.log('✅ Utilisateur créé:', user.id);
        
        // Test de connexion après création
        const authData = await pb.collection('users').authWithPassword('test@example.com', 'password123');
        console.log('✅ Connexion test réussie:', authData.record.email);
      } catch (createError) {
        console.log('❌ Erreur lors de la création:', createError.message);
      }
    }
  }
}

checkUser();
