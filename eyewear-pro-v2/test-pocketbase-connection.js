// Script de test pour vérifier la connexion PocketBase et le système de reset password
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.1.13:8090');

async function testPocketBaseConnection() {
    try {
        console.log('🔍 Test de connexion à PocketBase...');
        
        // Test de connexion basique
        const health = await pb.send('/api/health', {
            method: 'GET'
        });
        console.log('✅ Connexion PocketBase réussie:', health);
        
        // Test de la collection users
        try {
            const users = await pb.collection('users').getFirstListItem('', { skipTotal: 1 });
            console.log('✅ Collection "users" accessible');
        } catch (err) {
            console.log('⚠️ Collection "users" non trouvée ou vide:', err.message);
        }
        
        console.log('\n📋 Configuration requise pour PocketBase:');
        console.log('1. Allez dans: http://192.168.1.8:8090/_/');
        console.log('2. Settings > Mail');
        console.log('3. Configurez un service SMTP (ex: Gmail, SendGrid, etc.)');
        console.log('4. Activez "Enable email sending"');
        console.log('5. Configurez "Reset password redirect URL" si nécessaire');
        
        console.log('\n🔧 Test du flux de réinitialisation:');
        console.log('1. Ouvrez l\'application React');
        console.log('2. Allez sur /login');
        console.log('3. Cliquez sur "Mot de passe oublié ?"');
        console.log('4. Entrez un email existant');
        console.log('5. Vérifiez la console pour les logs');
        console.log('6. Vérifiez votre boîte mail');
        console.log('7. Cliquez sur le lien reçu');
        console.log('8. Vérifiez que le token est bien récupéré');
        console.log('9. Entrez un nouveau mot de passe');
        console.log('10. Vérifiez la réinitialisation');
        
    } catch (error) {
        console.error('❌ Erreur de connexion à PocketBase:', error);
        console.log('\n🔧 Vérifiez que:');
        console.log('1. PocketBase est bien démarré sur http://192.168.1.13:8090');
        console.log('2. L\'adresse IP est correcte');
        console.log('3. Le port 8090 est accessible');
    }
}

testPocketBaseConnection();
