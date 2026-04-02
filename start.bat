@echo off
REM Script pour démarrer à la fois le backend et le frontend

echo.
echo ====================================================
echo   ABC Informatique - E-Commerce Platform
echo   Démarrage des serveurs...
echo ====================================================
echo.

REM Vérifier que nous sommes dans le bon répertoire
if not exist "backend" (
    echo ERREUR: Le dossier 'backend' n'existe pas!
    echo Assurez-vous que ce script se trouve dans le dossier abc_informatique
    exit /b 1
)

if not exist "frontend" (
    echo ERREUR: Le dossier 'frontend' n'existe pas!
    echo Assurez-vous que ce script se trouve dans le dossier abc_informatique
    exit /b 1
)

REM Lancer le backend dans une nouvelle fenêtre
echo [1/2] Démarrage du Backend Laravel...
start "Backend Laravel - Port 8000" cmd /k "cd backend && php artisan serve --port=8000"
timeout /t 3 /nobreak

REM Lancer le frontend dans une nouvelle fenêtre
echo [2/2] Démarrage du Frontend Vite...
start "Frontend Vite - Port 5173" cmd /k "cd frontend && npm run dev"
timeout /t 2 /nobreak

echo.
echo ====================================================
echo   ✓ Les deux serveurs sont maintenant lancés!
echo ====================================================
echo.
echo   Backend  : http://localhost:8000
echo   Frontend : http://localhost:5173
echo.
echo   Appuyez sur Ctrl+C dans chaque fenêtre pour arrêter
echo ====================================================
echo.
