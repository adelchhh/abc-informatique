#!/bin/bash
# 🚀 Script de déploiement cPanel rapide
# À adapter selon tes chemins et identifiants

set -e

CPANEL_USER="ton_username"
CPANEL_HOST="abc-informatique.com"
BACKEND_DIR="/home/$CPANEL_USER/public_html/api"
FRONTEND_DIR="/home/$CPANEL_USER/public_html"

echo "🚀 Déploiement ABC Informatique - OPTION 1"
echo "=========================================="

# ============================================================
# BACKEND DEPLOYMENT
# ============================================================

echo "📦 Déploiement Backend..."

ssh $CPANEL_USER@$CPANEL_HOST << 'EOF'
    cd $BACKEND_DIR
    
    echo "⬇️  Mise à jour code..."
    git pull origin main || echo "❌ Git pull failed"
    
    echo "📥 Installation dépendances..."
    composer install --no-dev --optimize-autoloader
    
    echo "🔑 Génération clé..."
    php artisan key:generate --force
    
    echo "🗄️  Migrations..."
    php artisan migrate --force --no-interaction
    
    echo "📁 Permissions..."
    chmod -R 775 bootstrap/cache storage
    
    echo "✅ Backend OK!"
EOF

# ============================================================
# FRONTEND DEPLOYMENT
# ============================================================

echo "🎨 Build Frontend..."

# Supposant que tu as le projet localement
cd frontend
npm install
npm run build

echo "📤 Upload Frontend..."
scp -r dist/* $CPANEL_USER@$CPANEL_HOST:$FRONTEND_DIR/

echo "🌐 Configuration .htaccess..."
scp frontend-.htaccess $CPANEL_USER@$CPANEL_HOST:$FRONTEND_DIR/.htaccess

# ============================================================
# FINAL CHECKS
# ============================================================

echo ""
echo "✅ Déploiement terminé!"
echo ""
echo "🧪 Tests:"
echo "  Backend:  https://abc-informatique.com/api/"
echo "  Frontend: https://abc-informatique.com"
echo ""
echo "📋 Checklist:"
echo "  [ ] SSL certificat activé"
echo "  [ ] config/cors.php mis à jour avec les vrais domaines"
echo "  [ ] .env configuré avec DB correcte"
echo "  [ ] Permissions 775 sur bootstrap/cache et storage"
echo ""
