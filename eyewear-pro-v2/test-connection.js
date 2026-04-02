import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.1.17:8090');

async function testConnection() {
  console.log('=== TEST DE CONNEXION POCKETBASE ===');
  console.log('URL PocketBase:', 'http://192.168.1.17:8090');
  
  try {
    console.log('1. Test de connexion avec test@example.com...');
    const authData = await pb.collection('users').authWithPassword('test@example.com', 'password123');
    console.log('✅ Connexion réussie:', authData);
    console.log('✅ Token:', authData.token);
    console.log('✅ User:', authData.record);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
    console.error('❌ Status:', error.status);
    console.error('❌ Message:', error.message);
    console.error('❌ Data:', error.data);
  }
}

testConnection();
