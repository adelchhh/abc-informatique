@echo off
:: 🏃 Script pour lancer le projet localement (Windows)
:: Lancement Backend + Frontend

setlocal enabledelayedexpansion

echo.
echo 🚀 ABC Informatique - Lancement Développement (Windows)
echo ====================================================
echo.

:: Check prerequisites
echo 📋 Vérification prérequis...

php -v >nul 2>&1
if errorlevel 1 (
    echo ❌ PHP non trouvé - installe PHP ou ajoute-le au PATH
    pause
    exit /b 1
)
echo ✅ PHP ok

node -v >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non trouvé - installe Node.js
    pause
    exit /b 1
)
echo ✅ Node.js ok

composer --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Composer non trouvé - installe Composer
    pause
    exit /b 1
)
echo ✅ Composer ok

echo.

:: ============================================================
:: BACKEND SETUP
:: ============================================================

echo 📦 Configuration Backend...
cd backend

if not exist ".env" (
    echo   Création .env...
    copy .env.example .env >nul
    php artisan key:generate
    echo   ⚠️  Édite .env avec ta configuration DB
)

echo   📥 Installation dépendances...
call composer install >nul 2>&1

echo   🗄️  Migrations...
php artisan migrate 2>nul

echo ✅ Backend ok
cd ..

:: ============================================================
:: FRONTEND SETUP
:: ============================================================

echo.
echo 🎨 Configuration Frontend...
cd frontend

echo   📥 Installation dépendances...
call npm install >nul 2>&1

echo ✅ Frontend ok
cd ..

:: ============================================================
:: RUN DEVELOPMENT SERVERS
:: ============================================================

echo.
echo 🚀 Lancement des serveurs...
echo.
echo   Terminal 1: Backend (php artisan serve)
echo   Terminal 2: Frontend (npm run dev)
echo.

:: Launch Backend in new window
start "ABC Backend - Port 8000" cmd /k "cd backend && php artisan serve"

:: Wait a second for backend to start
timeout /t 2 /nobreak >nul

:: Launch Frontend in new window
start "ABC Frontend - Port 5173" cmd /k "cd frontend && npm run dev"

:: ============================================================
:: INFO
:: ============================================================

echo.
echo ✅ Tout est prêt!
echo.
echo 📍 URLs disponibles:
echo    Backend API:    http://localhost:8000
echo    Frontend:       http://localhost:5173
echo.
echo 📋 Endpoints utiles:
echo    GET  http://localhost:8000/api/products
echo    GET  http://localhost:8000/api/orders
echo    POST http://localhost:8000/api/auth/login
echo.
echo 🧪 Test rapide (PowerShell):
echo    curl http://localhost:8000/
echo.
echo 📖 Documentation:
echo    - API_CONFIG.md
echo    - CPANEL_DEPLOYMENT.md
echo    - FRONTEND_API_EXAMPLE.ts
echo.
echo ⚡ Pro tip: Les deux terminals resteront ouverts. Ferme-les pour arrêter les serveurs.
echo.
