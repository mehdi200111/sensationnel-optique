/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select3267281823",
    "maxSelect": 8,
    "name": "colors",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Noir",
      "Marron",
      "Blanc",
      "Bleu",
      "Or",
      "Écaille",
      "Rouge",
      "Argent",
      "Rose"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4092854851")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "select3267281823",
    "maxSelect": 8,
    "name": "colors",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "Noir",
      "Marron",
      "Blanc",
      "Bleu",
      "Or",
      "Écaille",
      "Rouge",
      "Argent"
    ]
  }))

  return app.save(collection)
})
