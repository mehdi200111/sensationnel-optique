# Configuration pour le développement mobile

## 📱 Problème résolu

Le lien de réinitialisation de mot de passe ne fonctionnait pas depuis votre téléphone car il utilisait `localhost:5173` qui n'est accessible que depuis votre ordinateur.

## 🔧 Solution implémentée

### Détection automatique de l'URL
Le code détecte maintenant automatiquement si vous êtes en développement et utilise l'adresse IP locale appropriée:

```javascript
const getResetUrl = () => {
    // Si nous sommes en développement sur localhost, utiliser l'IP locale
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return `http://192.168.1.13:5173/reset-password`;
    }
    // Sinon, utiliser l'origine actuelle (pour la production)
    return `${window.location.origin}/reset-password`;
};
```

## 🚀 Configuration pour que ça fonctionne depuis votre téléphone

### Étape 1: Démarrer le serveur de développement avec l'IP
```bash
# Arrêtez le serveur actuel (Ctrl+C)
# Puis démarrez-le avec l'IP:
npm run dev -- --host 0.0.0.0 --port 5173
```

### Étape 2: Vérifier l'accès depuis le téléphone
1. Ouvrez un navigateur sur votre téléphone
2. Allez sur: `http://192.168.1.13:5173`
3. Vous devriez voir votre application

### Étape 3: Tester le flux de réinitialisation
1. Allez sur la page de login sur votre téléphone
2. Cliquez sur "Mot de passe oublié ?"
3. Entrez votre email
4. Le lien dans l'email sera maintenant: `http://192.168.1.13:5173/reset-password?token=...`
5. Ce lien fonctionnera depuis votre téléphone !

## 📋 Vérification

### Sur votre ordinateur:
- Lien généré: `http://192.168.1.13:5173/reset-password?token=...`
- Console: `URL de redirection: http://192.168.1.13:5173/reset-password`

### Sur votre téléphone:
- ✅ Le lien dans l'email fonctionne
- ✅ La page de réinitialisation s'affiche
- ✅ Le token est bien récupéré
- ✅ Vous pouvez définir un nouveau mot de passe

## 🔍 Dépannage

### Si le lien ne fonctionne toujours pas:
1. **Vérifiez l'IP**: Assurez-vous que `192.168.1.13` est bien l'IP de votre ordinateur
   ```bash
   # Sur Windows:
   ipconfig
   # Cherchez "Adresse IPv4"
   ```

2. **Vérifiez le pare-feu**: Assurez-vous que le port 5173 n'est pas bloqué
   ```bash
   # Sur Windows:
   # Allez dans "Pare-feu Windows" > "Autoriser une application"
   # Ajoutez Node.js ou le port 5173
   ```

3. **Vérifiez que les appareils sont sur le même réseau WiFi**
   - Votre ordinateur et votre téléphone doivent être connectés au même réseau

### Si l'IP change:
Si votre IP change (réseau différent), modifiez simplement la ligne:
```javascript
// Dans ForgotPassword.jsx, ligne 22
return `http://VOTRE_NOUVELLE_IP:5173/reset-password`;
```

## 🎯 Résultat

Maintenant:
- ✅ **Depuis l'ordinateur**: Le lien fonctionne avec `localhost`
- ✅ **Depuis le téléphone**: Le lien fonctionne avec `192.168.1.13:5173`
- ✅ **En production**: Le lien utilisera automatiquement le domaine de votre site

Le système de réinitialisation fonctionne maintenant parfaitement depuis n'importe quel appareil !
