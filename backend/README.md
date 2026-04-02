# Backend - ABC Informatique API

## 📋 À propos

Ce dossier contient l'API REST Laravel pour la plateforme e-commerce ABC Informatique.

## 🚀 Démarrage

### Installation des dépendances
```bash
composer install
```

### Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### Démarrage du serveur
```bash
php artisan serve --port=8000
```

Le serveur sera accessible à : **http://localhost:8000**

## 📁 Structure des Dossiers

```
backend/
├── app/
│   ├── Console/              ← Commandes Artisan
│   ├── Http/
│   │   ├── Controllers/      ← Contrôleurs (ProductController, etc)
│   │   ├── Middleware/       ← Middleware (Auth, CORS, etc)
│   │   └── Requests/         ← Form Requests (validation)
│   └── Models/               ← Modèles Eloquent (User, Product, Order)
├── config/                   ← Fichiers de configuration
│   ├── app.php
│   ├── cors.php              ← ⭐ CORS doit accepter http://localhost:5173
│   └── ...
├── database/
│   ├── migrations/           ← Migrations de schéma DB
│   ├── seeders/              ← Seeders pour données test
│   └── schema.sql            ← Dump du schéma SQL
├── routes/
│   ├── api.php               ← Routes API (endpoints REST)
│   └── web.php               ← Routes Web (si nécessaire)
├── storage/                  ← Logs et fichiers temporaires
├── public/
│   ├── images/               ← Images des produits
│   ├── videos/               ← Vidéos
│   └── storage/              ← Fichiers uploadés
├── tests/                    ← Tests unitaires/feature
├── vendor/                   ← Dépendances Composer
├── artisan                   ← CLI Laravel
├── composer.json
═.env                         ← Variables d'environnement
└── .env.example
```

## 🔌 Endpoints API Principaux

### Authentification
- `POST /api/login` - Connexion admin
- `POST /api/logout` - Déconnexion

### Produits
- `GET /api/products` - Lister tous les produits
- `GET /api/products/{id}` - Détail d'un produit
- `POST /api/products` - Créer un produit (Admin)
- `PUT /api/products/{id}` - Mettre à jour un produit (Admin)
- `DELETE /api/products/{id}` - Supprimer un produit (Admin)

### Commandes
- `POST /api/orders` - Créer une commande
- `GET /api/orders` - Lister les commandes (Admin)
- `GET /api/orders/{id}` - Détail d'une commande

### Utilisateurs
- `GET /api/users` - Lister les utilisateurs (Admin)
- `POST /api/users` - Créer un utilisateur (Admin)

## 🔐 Authentification

Le backend utilise **Laravel Sanctum** pour l'authentification API.

### Token Bearer
```bash
Authorization: Bearer {token}
```

### Endpoints publics
- `GET /api/products` - Accessible sans token
- `POST /api/orders` - Accessible sans token

### Endpoints protégés
- Routes commençant par `/admin/*` - Nécessitent token + rôle admin

## 📦 Dépendances Principales

```json
{
    "laravel/framework": "^11.0",
    "laravel/sanctum": "^4.0",
    "laravel/tinker": "^2.0"
}
```

## 🧪 Tests

```bash
# Exécuter tous les tests
php artisan test

# Exécuter un fichier de test spécifique
php artisan test tests/Feature/ProductTest.php

# Avec journalisation détaillée
php artisan test --verbose
```

## 🔧 Commandes Utiles

```bash
# Créer un utilisateur admin
php artisan tinker
>>> User::create(['name' => 'Admin', 'email' => 'admin@example.com', 'password' => bcrypt('admin123'), 'role' => 'admin'])

# Afficher les routes
php artisan route:list

# Vérifier la journalisation
tail -f storage/logs/laravel.log

# Exécuter les migrations
php artisan migrate

# Revenir aux migrations précédentes
php artisan migrate:rollback

# Compléter les migrations + seeders
php artisan migrate:fresh --seed
```

## ⚙️ Configuration CORS

Le fichier `config/cors.php` doit inclure le frontend:

```php
'allowed_origins' => [
    'http://localhost:5173',  // ✓ Frontend Vite
    'http://localhost:8000',
    'http://127.0.0.1:8000',
],
```

## 🗄️ Base de Données

- **Type** : SQLite
- **Chemin** : `database/database.sqlite`
- **Driver** : `sqlite`

### Schéma Principal
- `users` - Utilisateurs (admin/client)
- `products` - Produits avec images et promotion
- `orders` - Commandes des clients
- `personal_access_tokens` - Tokens Sanctum

## 📝 Logging

Les logs Laravel se trouvent dans :
```bash
storage/logs/laravel.log
```

Consultez les logs pour débugger :
```bash
tail -f storage/logs/laravel.log
```

## 🐛 Troubleshooting

### Erreur "CORS policy blocked"
→ Vérifier `config/cors.php` accepte `http://localhost:5173`

### Grosse erreur 500
→ Vérifier `storage/logs/laravel.log` pour plus de détails

### Base de données vide
→ Exécuter `php artisan migrate`

### Token invalide
→ S'assurer que le token est correct et passé dans le header `Authorization: Bearer {token}`

---

**Contact** : lgsalah@gmail.com | 0795734327
