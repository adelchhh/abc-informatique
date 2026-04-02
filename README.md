# ABC Informatique - E-Commerce Platform

## 📁 Structure du Projet

```
abc_informatique/
├── backend/          ← API Laravel (PHP)
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── public/       ← Fichiers statiques (images, vidéos)
│   ├── storage/      ← Logs et fichiers temporaires
│   ├── vendor/       ← Dépendances Composer
│   ├── artisan
│   ├── composer.json
│   ├── .env          ← Variables d'environnement
│   └── ...autres fichiers Laravel
│
└── frontend/         ← Application React + Vite
    ├── src/
    │   └── resources/
    │       ├── js/   ← Composants React
    │       └── css/  ← Stylesheets
    ├── public/       ← Assets (images, vidéos, etc)
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html
    └── node_modules/ ← Dépendances npm
```

## 🚀 Démarrage du Projet

### Prérequis
- PHP 8.1+ avec Composer
- Node.js 18+ avec npm
- SQLite (la base de données est incluse)

### 1. Démarrer le Backend (Terminal 1)
```bash
cd abc_informatique/backend
php artisan serve --port=8000
```
Le backend sera accessible à : **http://localhost:8000**

### 2. Démarrer le Frontend (Terminal 2)
```bash
cd abc_informatique/frontend
npm run dev
```
Le frontend sera accessible à : **http://localhost:5173**

## 📝 Configuration

### Variables d'environnement Backend (.env)
Fichier : `backend/.env`

Les paramètres importants :
- `APP_URL=http://localhost:8000`
- `API_URL=http://localhost:8000/api`
- CORS déjà configuré pour `http://localhost:5173`

### Vite Config Frontend
Fichier : `frontend/vite.config.js`

Le proxy API est configuré pour rediriger `/api/*` vers `http://localhost:8000`

## 🔗 Communication Backend-Frontend

- **Frontend** → appelle `/api/...` en local
- **Vite Proxy** → redirige vers `http://localhost:8000/api/...`
- **Backend** → traite les requêtes et retourne les données JSON

## 📦 Dépendances Principales

### Backend (Laravel)
- Laravel 11
- Sanctum (authentification API)
- SQLite Database

### Frontend (React)
- React 18
- Vite 7
- Tailwind CSS 4
- Axios

## 🛠️ Scripts Disponibles

### Backend
```bash
php artisan migrate              # Exécuter les migrations
php artisan tinker              # Console interactive
php artisan serve               # Démarrer le serveur dev
```

### Frontend
```bash
npm run dev                      # Démarrer Vite dev server
npm run build                    # Build pour production
```

## 🔐 Authentification

- Endpoint : `POST /api/login`
- Les tokens sont gérés avec Laravel Sanctum
- Token stocké dans les headers : `Authorization: Bearer {token}`

## 📧 Contact

Email: lgsalah@gmail.com
Téléphone: 0795734327

---

**Note** : Cette structure permet une séparation claire entre backend et frontend tout en conservant la flexibilité de développement.
