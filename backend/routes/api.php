<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// ============================================================
// ROUTES AUTHENTIFICATION (Publiques)
// ============================================================

Route::prefix('auth')->group(function () {
    // Connexion - Génère un token
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
});

// ============================================================
// ROUTES PUBLIQUES (Accessible à tous)
// ============================================================

// Produits - GET uniquement (public)
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('products.index');
    Route::get('/{id}', [ProductController::class, 'show'])->where('id', '[0-9]+')->name('products.show');
});

// Commandes - GET et POST uniquement (public)
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/status/{status}', [OrderController::class, 'getByStatus'])->name('orders.byStatus');
    Route::post('/', [OrderController::class, 'store'])->name('orders.store');
    Route::get('/{id}', [OrderController::class, 'show'])->where('id', '[0-9]+')->name('orders.show');
});

// ============================================================
// ROUTES PROTÉGÉES (Authentifiées - Nécessite token)
// ============================================================

Route::middleware('auth:sanctum')->group(function () {
    // Authentification
    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me'])->name('auth.me');
        Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');
    });

    // ============================================================
    // ROUTES PROTÉGÉES ADMIN (Authentifiées + Admin)
    // ============================================================

    Route::middleware('isadmin')->group(function () {
        // Produits - CRUD complet (Admin)
        Route::prefix('products')->group(function () {
            Route::post('/', [ProductController::class, 'store'])->name('products.store');
            Route::put('/{id}', [ProductController::class, 'update'])->where('id', '[0-9]+')->name('products.update');
            Route::delete('/{id}', [ProductController::class, 'destroy'])->where('id', '[0-9]+')->name('products.destroy');
        });

        // Commandes - Modifications (Admin)
        Route::prefix('orders')->group(function () {
            Route::put('/{id}', [OrderController::class, 'update'])->where('id', '[0-9]+')->name('orders.update');
            Route::delete('/{id}', [OrderController::class, 'destroy'])->where('id', '[0-9]+')->name('orders.destroy');
        });
    });

    // ============================================================
    // ROUTES PROTÉGÉES SUPER ADMIN (Authentifiées + Super Admin)
    // ============================================================

    Route::middleware('issuperadmin')->group(function () {
        // Gestion des administrateurs
        Route::prefix('users')->group(function () {
            Route::post('/create-admin', [UserController::class, 'createAdmin'])->name('users.createAdmin');
            Route::get('/admins', [UserController::class, 'getAdmins'])->name('users.getAdmins');
            Route::delete('/{id}', [UserController::class, 'deleteUser'])->where('id', '[0-9]+')->name('users.delete');
        });
    });
});
