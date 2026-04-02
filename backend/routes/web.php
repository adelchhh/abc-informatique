<?php

use Illuminate\Support\Facades\Route;

// ============================================================
// ROUTES PUBLIQUES
// ============================================================

// Page d'accueil avec la liste des produits et formulaire de commande
Route::get('/', function () {
    return view('client');
})->name('home');

// ============================================================
// ROUTES ADMIN
// ============================================================

// Dashboard admin pour gérer les commandes
Route::get('/admin', function () {
    return view('admin');
})->name('admin.dashboard');

// À ajouter : middleware d'authentification admin
// Route::middleware(['auth', 'admin'])->group(function () {
//     Route::get('/admin', function () {
//         return view('admin');
//     })->name('admin.dashboard');
// });
