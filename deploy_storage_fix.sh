#!/bin/bash

# ============================================================================
# Script de déploiement - Correction upload images
# Utilisation: ssh cpanel_user@domain.com < deploy_storage_fix.sh
# ============================================================================

set -e  # Exit on error

echo "=========================================="
echo "🚀 Déploiement - Correction Upload Images"
echo "=========================================="
echo ""

# Déterminer le répertoire API
API_DIR="${1:-.}"
if [ ! -f "$API_DIR/artisan" ]; then
    echo "❌ Erreur: artisan non trouvé dans $API_DIR"
    exit 1
fi

cd "$API_DIR"
echo "📍 Répertoire: $(pwd)"
echo ""

# Step 1: Créer les dossiers
echo "Step 1️⃣: Créer les dossiers de stockage..."
mkdir -p storage/app/public/products
echo "   ✅ Dossiers créés"
echo ""

# Step 2: Définir les permissions
echo "Step 2️⃣: Définir les permissions..."
chmod -R 775 storage/
chmod -R 775 bootstrap/cache
find storage -type f -exec chmod 664 {} \;
find bootstrap/cache -type f -exec chmod 664 {} \;
echo "   ✅ Permissions appliquées (775)"
echo ""

# Step 3: Créer le symlink
echo "Step 3️⃣: Créer le symlink public/storage..."
php artisan storage:link
echo "   ✅ Symlink créé"
echo ""

# Step 4: Copier .htaccess
echo "Step 4️⃣: Copier .htaccess dans storage/app/public..."
if [ -f "../storage-app-public-.htaccess" ]; then
    cp ../storage-app-public-.htaccess storage/app/public/.htaccess
    chmod 644 storage/app/public/.htaccess
    echo "   ✅ .htaccess copié"
else
    echo "   ⚠️  Fichier storage-app-public-.htaccess non trouvé"
    echo "       Créez manuellement: storage/app/public/.htaccess"
fi
echo ""

# Step 5: Vérifier la configuration
echo "Step 5️⃣: Vérifier la configuration..."
php artisan storage:diagnose
echo ""

# Step 6: Afficher le résumé
echo "=========================================="
echo "✅ Déploiement réussi!"
echo "=========================================="
echo ""
echo "📝 Prochaines étapes:"
echo "   1. Vérifier: php artisan storage:diagnose"
echo "   2. Tester API: curl https://domain.com/api/storage/diagnostics"
echo "   3. Faire un test d'upload via le panel admin"
echo ""
echo "📍 Fichiers créés/modifiés:"
echo "   - app/Console/Commands/DiagnoseStorage.php ✨ NOUVEAU"
echo "   - app/Http/Controllers/Api/StorageDiagnosticsController.php ✨ NOUVEAU"
echo "   - app/Http/Controllers/Api/ProductController.php 🔧 MODIFIÉ"
echo "   - routes/api.php 🔧 MODIFIÉ"
echo ""
echo "🔗 Documentation:"
echo "   - STORAGE_UPLOAD_FIX.md"
echo "   - STORAGE_USAGE_GUIDE.md"
echo "   - STORAGE_UPLOAD_IMPLEMENTATION.md"
echo ""
