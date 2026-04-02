# Configuration du système de réinitialisation de mot de passe

## 📋 Vue d'ensemble

Le système de réinitialisation de mot de passe est maintenant configuré pour fonctionner avec votre application React et PocketBase.

## 🔧 Modifications apportées

### 1. **ForgotPassword.jsx**
- ✅ Ajout de l'URL de redirection personnalisée
- ✅ Le lien généré pointe maintenant vers: `${window.location.origin}/reset-password`
- ✅ Logs de debug pour vérifier l'envoi

### 2. **ResetPassword.jsx**
- ✅ Récupération du token depuis l'URL (`?token=...`)
- ✅ Validation du token et affichage d'erreur si invalide
- ✅ Appel à `pb.collection('users').confirmPasswordReset()`
- ✅ Logs de debug pour suivre le processus

### 3. **App.jsx**
- ✅ Routes ajoutées: `/forgot-password` et `/reset-password`

## 🚀 Flux complet

1. **Utilisateur clique sur "Mot de passe oublié ?"** → `/forgot-password`
2. **Saisit son email** → `pb.collection('users').requestPasswordReset(email, resetUrl)`
3. **Reçoit un email** avec lien: `http://localhost:5173/reset-password?token=abc123`
4. **Clique sur le lien** → Page `/reset-password` avec token
5. **Saisit nouveau mot de passe** → `pb.collection('users').confirmPasswordReset(token, password, password)`
6. **Redirection vers** `/login`

## 🔍 Tests à effectuer

### Étape 1: Vérifier PocketBase
```bash
# Test de connexion
node test-pocketbase-connection.js
```

### Étape 2: Configuration SMTP PocketBase
1. Allez sur: http://192.168.1.13:8090/_/
2. Settings > Mail
3. Configurez un service SMTP:
   - **Service**: Gmail, SendGrid, ou autre
   - **Host**: smtp.gmail.com (pour Gmail)
   - **Port**: 587
   - **Username**: votre-email@gmail.com
   - **Password**: votre mot de passe d'application
   - **From email**: votre-email@gmail.com
   - **From name**: EYEWEAR PRO
4. Activez "Enable email sending"
5. Testez l'envoi

### Étape 3: Test du flux
1. Démarrez l'application React: `npm run dev`
2. Allez sur http://localhost:5173/login
3. Cliquez sur "Mot de passe oublié ?"
4. Entrez un email existant dans votre base
5. **Vérifiez la console** pour les logs:
   ```
   Envoi de l'email de réinitialisation à: email@test.com
   URL de redirection: http://localhost:5173/reset-password
   Email de réinitialisation envoyé avec succès
   ```
6. Vérifiez votre boîte mail
7. Cliquez sur le lien reçu
8. **Vérifiez la console**:
   ```
   Token récupéré depuis l'URL: abc123...
   ```
9. Entrez un nouveau mot de passe (min 6 caractères)
10. **Vérifiez la console**:
    ```
    Tentative de réinitialisation avec token: abc123...
    Réinitialisation réussie
    ```
11. Vérifiez la redirection vers `/login`

## 🐛 Dépannage

### Problème: Email non reçu
- Vérifiez la configuration SMTP dans PocketBase
- Vérifiez les spams
- Vérifiez la console pour les erreurs

### Problème: Lien invalide
- Vérifiez que le token est bien dans l'URL: `?token=...`
- Vérifiez la console pour "Token récupéré depuis l'URL"

### Problème: Réinitialisation échoue
- Vérifiez que le token n'a pas expiré
- Vérifiez la console pour les erreurs PocketBase
- Assurez-vous que l'utilisateur existe bien

## 📝 Notes importantes

- **URL personnalisée**: Le lien pointe maintenant vers votre app React et non la page par défaut de PocketBase
- **Sécurité**: Les tokens ont une durée de validité limitée
- **Logs**: Des logs de debug sont ajoutés pour faciliter le dépannage
- **Validation**: Mot de passe minimum 6 caractères requis

## 🎯 Résultat attendu

Une fois configuré, le système permettra aux utilisateurs de:
- ✅ Demander une réinitialisation par email
- ✅ Recevoir un lien sécurisé vers votre app React
- ✅ Définir un nouveau mot de passe
- ✅ Se reconnecter avec le nouveau mot de passe

Le flux est maintenant entièrement intégré à votre application React!
