/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1375719092")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_cLbd3DMmgl` ON `commandes` (\n  `email`,\n  `prenom`,\n  `nom`,\n  `adresse`,\n  `codePostal`,\n  `ville`,\n  `telephone`,\n  `pays`,\n  `methodePaiement`,\n  `total`,\n  `produits`,\n  `statut`,\n  `dateCommande`\n)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_1375719092")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
