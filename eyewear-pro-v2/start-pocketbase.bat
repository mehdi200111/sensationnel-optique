@echo off
echo Démarrage de PocketBase...
echo.
echo PocketBase va démarrer sur http://127.0.0.1:8090
echo.
echo Ouvre ton navigateur sur http://127.0.0.1:8090/_/ pour accéder à l'admin
echo.
echo Les produits seront disponibles sur http://127.0.0.1:8090/api/collections/products/records
echo.
echo Appuie sur Ctrl+C pour arrêter PocketBase
echo.

pocketbase.exe serve --http=0.0.0.0:8090

pause
