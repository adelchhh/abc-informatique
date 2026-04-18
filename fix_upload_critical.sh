#!/bin/bash

# ============================================================================
# Script de diagnostic et correction - Upload images cPanel
# Usage: bash fix_upload_critical.sh
# ============================================================================

echo "🔍 DIAGNOSTIC UPLOAD IMAGES - CRITIQUE FIX"
echo "============================================"
echo ""

# Vérifier que artisan existe
if [ ! -f "artisan" ]; then
    echo "❌ Erreur: artisan non trouvé. Exécutez ce script depuis le répertoire backend"
    exit 1
fi

echo "Step 1: Vérifier configuration Laravel"
echo "---"
# Vérifier la configuration
php artisan config:show filesystems.disks.public 2>/dev/null | head -20 || echo "⚠️ Commande échouée, continuant..."
echo ""

echo "Step 2: Créer les dossiers de stockage"
echo "---"
mkdir -p storage/app/public/products
mkdir -p storage/app/private
echo "✅ Créé: storage/app/public/products"
echo "✅ Créé: storage/app/private"
echo ""

echo "Step 3: Corriger les permissions"
echo "---"
chmod -R 775 storage/
chmod -R 775 bootstrap/cache
find storage -type f -exec chmod 664 {} \;
find storage -type d -exec chmod 775 {} \;
find bootstrap/cache -type f -exec chmod 664 {} \;
find bootstrap/cache -type d -exec chmod 775 {} \;
echo "✅ Permissions corrigées (775 dossiers / 664 fichiers)"
echo ""

echo "Step 4: Vérifier l'accès au disque"
echo "---"
if [ -w "storage/app/public/products" ]; then
    echo "✅ Dossier products est accessible en écriture"
    
    # Test d'écriture
    touch storage/app/public/products/.write_test
    if [ -f "storage/app/public/products/.write_test" ]; then
        rm storage/app/public/products/.write_test
        echo "✅ Test d'écriture réussi"
    else
        echo "❌ Impossible d'écrire dans le dossier!"
    fi
else
    echo "❌ Dossier products NOT writable"
    ls -la storage/app/public/ | grep products
fi
echo ""

echo "Step 5: Créer/vérifier le symlink"
echo "---"
php artisan storage:link
echo ""

echo "Step 6: Vérifier le symlink"
echo "---"
if [ -L "public/storage" ]; then
    echo "✅ public/storage est un symlink"
    ls -la public/ | grep storage
else
    echo "❌ public/storage n'existe pas ou n'est pas un symlink"
    ls -la public/ | grep storage || echo "   (absent)"
fi
echo ""

echo "Step 7: Vérifier la configuration .env"
echo "---"
if grep -q "FILESYSTEM_DISK" .env; then
    FILESYSTEM_DISK=$(grep FILESYSTEM_DISK .env | cut -d'=' -f2)
    echo "FILESYSTEM_DISK=$FILESYSTEM_DISK"
    
    if [ "$FILESYSTEM_DISK" = "local" ]; then
        echo "⚠️  FILESYSTEM_DISK=local (ne pose pas problème car store() spécifie 'public')"
    fi
else
    echo "⚠️  FILESYSTEM_DISK non trouvé dans .env"
fi
echo ""

echo "Step 8: Diagnostique détaillé"
echo "---"
php artisan storage:diagnose 2>/dev/null || echo "⚠️ Commande non disponible"
echo ""

echo "=========================================="
echo "✅ FIX APPLIQUÉ"
echo "=========================================="
echo ""
echo "Prochaines étapes:"
echo "1. Uploader le nouveau code ProductController.php"
echo "2. Uploader le nouveau code ProductManagement.jsx"
echo "3. Tester un upload depuis le panel admin"
echo "4. Vérifier les logs: tail -50 storage/logs/laravel.log"
echo ""
echo "Si still problèmes:"
echo "1. Vérifier les logs du navigateur (F12 > Console)"
echo "2. Vérifier les réponses API (F12 > Network)"
echo "3. Vérifier: cat storage/logs/laravel.log | grep StoreProduct"
echo ""
