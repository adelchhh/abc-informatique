Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  ABC Informatique - E-Commerce Platform" -ForegroundColor Green
Write-Host "  Demarrage des serveurs..." -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

if (-not (Test-Path "backend")) {
    Write-Host "ERREUR: Le dossier backend n'existe pas!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "frontend")) {
    Write-Host "ERREUR: Le dossier frontend n'existe pas!" -ForegroundColor Red
    exit 1
}

Write-Host "[1/2] Demarrage du Backend Laravel..." -ForegroundColor Cyan
$backendPath = Join-Path (Get-Location) "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $backendPath; php artisan serve --port=8000" -WindowStyle Normal
Start-Sleep -Seconds 3

Write-Host "[2/2] Demarrage du Frontend Vite..." -ForegroundColor Cyan
$frontendPath = Join-Path (Get-Location) "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $frontendPath; npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  OK Les deux serveurs sont maintenant lancees!" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Backend  : http://localhost:8000" -ForegroundColor Yellow
Write-Host "  Frontend : http://localhost:5173" -ForegroundColor Yellow
Write-Host ""
