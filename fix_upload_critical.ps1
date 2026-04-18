# ============================================================================
# Script de diagnostic et correction - Upload images FIX CRITIQUE
# Usage: .\fix_upload_critical.ps1
# ============================================================================

Write-Host "🔍 DIAGNOSTIC UPLOAD IMAGES - CRITICAL FIX" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que artisan existe
if (-not (Test-Path "artisan")) {
    Write-Host "❌ Erreur: artisan non trouvé." -ForegroundColor Red
    Write-Host "   Exécutez ce script depuis le répertoire backend" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Vérifier configuration Laravel" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray
try {
    php artisan config:show filesystems.disks.public 2>$null | Select-Object -First 20
}
catch {
    Write-Host "⚠️  Commande échouée, continuant..." -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 2: Créer les dossiers de stockage" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray
$dirs = @(
    "storage/app/public/products",
    "storage/app/private"
)

foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✅ Créé: $dir" -ForegroundColor Green
    } else {
        Write-Host "✅ Existe: $dir" -ForegroundColor Green
    }
}
Write-Host ""

Write-Host "Step 3: Vérifier l'accès au disque" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray

$productsDir = "storage/app/public/products"
if (Test-Path $productsDir) {
    if ((Get-Item $productsDir).GetAccessControl().Access) {
        Write-Host "✅ Dossier products existe et est accessible" -ForegroundColor Green
        
        # Test d'écriture
        $testFile = Join-Path $productsDir ".write_test"
        try {
            New-Item -Path $testFile -ItemType File -Force | Out-Null
            Remove-Item $testFile -Force
            Write-Host "✅ Test d'écriture réussi" -ForegroundColor Green
        }
        catch {
            Write-Host "❌ Impossible d'écrire dans le dossier!" -ForegroundColor Red
        }
    }
} else {
    Write-Host "❌ Dossier products NOT found!" -ForegroundColor Red
}
Write-Host ""

Write-Host "Step 4: Créer/vérifier le symlink" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray
Write-Host "Exécution: php artisan storage:link" -ForegroundColor Gray
php artisan storage:link
Write-Host ""

Write-Host "Step 5: Vérifier le symlink" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray
if (Test-Path "public/storage") {
    $storageLink = Get-Item "public/storage"
    if ($storageLink.LinkType) {
        Write-Host "✅ public/storage est un symlink" -ForegroundColor Green
        Write-Host "   Target: $($storageLink.Target)" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  public/storage existe mais n'est pas un symlink" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ public/storage n'existe pas" -ForegroundColor Red
}
Write-Host ""

Write-Host "Step 6: Vérifier la configuration .env" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray
$envFile = ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile | Select-String "FILESYSTEM_DISK"
    if ($envContent) {
        Write-Host $envContent -ForegroundColor Gray
        if ($envContent -match "FILESYSTEM_DISK=local") {
            Write-Host "⚠️  FILESYSTEM_DISK=local (OK car store() spécifie 'public')" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  FILESYSTEM_DISK non trouvé dans .env" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Fichier .env non trouvé" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "Step 7: Diagnostique détaillé" -ForegroundColor Green
Write-Host "---" -ForegroundColor Gray
php artisan storage:diagnose
Write-Host ""

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "✅ VÉRIFICATION COMPLÈTE" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Yellow
Write-Host "1. Uploader le nouveau ProductController.php" -ForegroundColor White
Write-Host "2. Uploader le nouveau filesystems.php" -ForegroundColor White
Write-Host "3. Uploader le nouveau ProductManagement.jsx" -ForegroundColor White
Write-Host "4. Tester un upload depuis le panel admin" -ForegroundColor White
Write-Host "5. Vérifier les logs:" -ForegroundColor White
Write-Host "   Get-Content storage/logs/laravel.log -Tail 50 | Select-String StoreProduct" -ForegroundColor Gray
Write-Host ""
Write-Host "Si toujours des problèmes:" -ForegroundColor Yellow
Write-Host "1. Vérifier console navigateur (F12 > Console)" -ForegroundColor White
Write-Host "2. Vérifier réseau (F12 > Network > POST /api/products)" -ForegroundColor White
Write-Host "3. Consulter CRITICAL_UPLOAD_FIX.md pour le troubleshooting" -ForegroundColor White
