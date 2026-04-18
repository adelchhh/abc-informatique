# ============================================================================
# Script de déploiement - Correction upload images (PowerShell)
# Utilisation: .\deploy_storage_fix.ps1 -ApiPath "C:\path\to\api"
# ============================================================================

param(
    [string]$ApiPath = ".",
    [string]$Domain = "abcinformatique.org"
)

Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "🚀 Déploiement - Correction Upload Images" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier artisan
if (-not (Test-Path "$ApiPath/artisan")) {
    Write-Host "❌ Erreur: artisan non trouvé dans $ApiPath" -ForegroundColor Red
    exit 1
}

Push-Location $ApiPath
Write-Host "📍 Répertoire: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Step 1: Créer les dossiers
Write-Host "Step 1️⃣: Créer les dossiers de stockage..." -ForegroundColor Green
if (-not (Test-Path "storage/app/public/products")) {
    New-Item -ItemType Directory -Path "storage/app/public/products" -Force | Out-Null
}
Write-Host "   ✅ Dossiers créés" -ForegroundColor Green
Write-Host ""

# Step 2: Créer le symlink (via artisan)
Write-Host "Step 2️⃣: Créer le symlink public/storage..." -ForegroundColor Green
php artisan storage:link | Select-Object -Index 0 | % { Write-Host "   $_" }
Write-Host "   ✅ Symlink créé" -ForegroundColor Green
Write-Host ""

# Step 3: Copier .htaccess
Write-Host "Step 3️⃣: Copier .htaccess dans storage/app/public..." -ForegroundColor Green
if (Test-Path "../storage-app-public-.htaccess") {
    Copy-Item "../storage-app-public-.htaccess" "storage/app/public/.htaccess" -Force
    Write-Host "   ✅ .htaccess copié" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Fichier storage-app-public-.htaccess non trouvé" -ForegroundColor Yellow
    Write-Host "       Créez manuellement: storage/app/public/.htaccess" -ForegroundColor Yellow
}
Write-Host ""

# Step 4: Vérifier la configuration
Write-Host "Step 4️⃣: Vérifier la configuration en cPanel..." -ForegroundColor Green
Write-Host "   À faire via SSH: php artisan storage:diagnose" -ForegroundColor Yellow
Write-Host "   Ou via API: GET https://$Domain/api/storage/diagnostics" -ForegroundColor Yellow
Write-Host ""

# Step 5: Afficher le résumé
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host "✅ Déploiement local terminé!" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Prochaines étapes en cPanel:" -ForegroundColor Yellow
Write-Host "   1. Uploader les fichiers modifiés via FTP/SFTP" -ForegroundColor White
Write-Host "   2. Se connecter en SSH" -ForegroundColor White
Write-Host "   3. Exécuter: php artisan storage:diagnose" -ForegroundColor White
Write-Host "   4. Vérifier le symlink: ls -la public_html/public/storage" -ForegroundColor White
Write-Host ""
Write-Host "📍 Fichiers à uploader:" -ForegroundColor Cyan
Write-Host "   backend/app/Console/Commands/DiagnoseStorage.php" -ForegroundColor White
Write-Host "   backend/app/Http/Controllers/Api/StorageDiagnosticsController.php" -ForegroundColor White
Write-Host "   backend/app/Http/Controllers/Api/ProductController.php (modifié)" -ForegroundColor White
Write-Host "   backend/routes/api.php (modifié)" -ForegroundColor White
Write-Host "   storage-app-public-.htaccess (copier en storage/app/public/.htaccess)" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Documentation:" -ForegroundColor Cyan
Write-Host "   - STORAGE_UPLOAD_FIX.md" -ForegroundColor White
Write-Host "   - STORAGE_USAGE_GUIDE.md" -ForegroundColor White
Write-Host "   - STORAGE_UPLOAD_IMPLEMENTATION.md" -ForegroundColor White
Write-Host ""

Pop-Location
