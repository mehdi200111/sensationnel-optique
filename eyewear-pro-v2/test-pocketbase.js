// Test direct PocketBase - collez ceci dans la console F12
pb.collection('avis').create({
  name: 'Test User',
  rating: 5,
  productType: 'Verres_optique',
  text: 'Test depuis la console',
  approved: true
}).then(result => {
  console.log('✅ Succès:', result);
}).catch(error => {
  console.error('❌ Erreur:', error);
  console.error('Détails:', error.data);
});
