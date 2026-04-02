@echo off
echo Démarrage du serveur de développement pour mobile...
echo.
echo ASSUREZ-VOUS QUE:
echo 1. Votre téléphone est connecté au même WiFi que votre ordinateur
echo 2. L'IP 192.168.1.13 est bien celle de votre ordinateur
echo 3. Le pare-feu Windows autorise le port 8090 (PocketBase) et 5173 (Vite)
echo.
echo Le serveur sera accessible sur: http://192.168.1.13:5173
echo PocketBase est accessible sur: http://192.168.1.13:8090
echo.
pause

npm run dev -- --host 0.0.0.0 --port 5173
