<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes (API MODE)
|--------------------------------------------------------------------------
|
| ⚡ OPTION 1 - API ONLY (MODE RECOMMANDÉ)
| 
| This application is built as a PURE API with a SEPARATE FRONTEND.
| - Backend: Laravel REST API (returns JSON)
| - Frontend: React/Vite (static HTML/JS/CSS - served separately)
| 
| ✅ No Blade views needed
| ✅ Clean API architecture
| ✅ Easy to deploy on cPanel
| ✅ Frontend can be on separate domain or subdirectory
|
*/

// ============================================================
// API ROOT ENDPOINT
// ============================================================

Route::get('/', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'API ABC Informatique fonctionne ✅',
        'version' => '1.0.0',
        'timestamp' => now(),
        'documentation' => 'Consultez /api pour la documentation complète',
    ], 200);
})->name('api.root');

// ============================================================
// HEALTH CHECK ENDPOINT
// ============================================================

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now(),
    ], 200);
})->name('health.check');

// ============================================================
// 404 HANDLER - Redirect to API documentation
// ============================================================

Route::fallback(function () {
    return response()->json([
        'status' => 'error',
        'message' => 'Endpoint not found. Please use the /api prefix for API endpoints.',
        'hint' => 'Example: GET /api/products',
    ], 404);
});
