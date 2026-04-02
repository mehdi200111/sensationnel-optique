import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.1.13:8090');

async function checkUsers() {
  try {
    console.log('=== VÉRIFICATION BASE DE DONNÉES UTILISATEURS ===');
    
    // Connexion avec le compte test pour accéder aux utilisateurs
    await pb.collection('users').authWithPassword('test@example.com', 'password123');
    
    // Récupérer tous les utilisateurs
    const users = await pb.collection('users').getFullList();
    
    console.log('Nombre d\'utilisateurs trouvés:', users.length);
    console.log('');
    
    users.forEach((user, index) => {
      console.log(`--- UTILISATEUR ${index + 1} ---`);
      console.log('ID:', user.id);
      console.log('Nom:', user.name);
      console.log('Email:', user.email);
      console.log('Email Visible:', user.emailVisibility);
      console.log('Avatar:', user.avatar || 'Non défini');
      console.log('Vérifié:', user.verified);
      console.log('Créé le:', user.created);
      console.log('Mis à jour le:', user.updated);
      console.log('');
    });
    
    console.log('=== CHAMPS DISPONIBLES DANS LA COLLECTION USERS ===');
    if (users.length > 0) {
      console.log('Champs disponibles:', Object.keys(users[0]));
    }
    
  } catch (error) {
    console.error('Erreur lors de la vérification:', error.message);
  }
}

checkUsers();
