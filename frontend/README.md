# Frontend - ABC Informatique React App

## 📋 À propos

Ce dossier contient l'application React pour la plateforme e-commerce ABC Informatique.

## 🚀 Démarrage

### Installation des dépendances
```bash
npm install
```

### Démarrage du serveur de développement
```bash
npm run dev
```

Le serveur sera accessible à : **http://localhost:5173**

### Build pour production
```bash
npm run build
```

## 📁 Structure des Dossiers

```
frontend/
├── src/
│   └── resources/
│       ├── js/                   ← Code React
│       │   ├── main.jsx          ← Point d'entrée principal
│       │   ├── app.jsx           ← Composant principal
│       │   ├── bootstrap.js       ← Initialization
│       │   ├── components/        ← Composants réutilisables
│       │   │   ├── Navbar.jsx
│       │   │   ├── ClientPage.jsx          ← Page d'accueil
│       │   │   ├── ProductList.jsx         ← Catalogue produits
│       │   │   ├── ProductDetail.jsx       ← Fiche produit
│       │   │   ├── ProductManagement.jsx   ← Panel admin produits
│       │   │   ├── OrderForm.jsx           ← Formulaire commande
│       │   │   ├── LoginPage.jsx           ← Connexion admin
│       │   │   └── ...autres composants
│       │   └── i18n/              ← Traduction (optionnel)
│       └── css/                  ← Stylesheets
│           └── app.css           ← Styles globaux
├── public/
│   ├── images/                  ← Images (produits, catégories)
│   ├── videos/                  ← Vidéos (fond login)
│   └── ...assets
├── index.html                   ← Point d'entrée HTML
├── package.json                 ← Dépendances npm
├── package-lock.json
├── vite.config.js               ← Configuration Vite
├── tailwind.config.js           ← Configuration Tailwind CSS
├── node_modules/                ← Dépendances npm (ignoré en Git)
└── README.md                    ← Ce fichier
```

## 🎨 Composants Principaux

### Pages
- **ClientPage** (`components/ClientPage.jsx`) - Page d'accueil avec catégories et produits
- **ProductDetail** (`components/ProductDetail.jsx`) - Fiche produit détaillée
- **LoginPage** (`components/LoginPage.jsx`) - Formulaire de connexion admin

### Composants Admin
- **ProductManagement** (`components/ProductManagement.jsx`) - Gestion des produits
- **AdminPage** (`components/AdminPage.jsx`) - Dashboard admin

### Composants Réutilisables
- **Navbar** (`components/Navbar.jsx`) - Barre de navigation
- **ProductList** (`components/ProductList.jsx`) - Liste/grille de produits
- **OrderForm** (`components/OrderForm.jsx`) - Formulaire de commande

## 🔗 Communication avec le Backend

### Configuration API
Le backend est accessible via le proxy Vite configuré dans `vite.config.js`:

```javascript
proxy: {
    '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
    },
}
```

Cela signifie que :
- `fetch('/api/products')` → `http://localhost:8000/api/products`

### Appels API Typiques

```javascript
// GET - Récupérer les produits
const response = await fetch('/api/products');
const data = await response.json();

// POST - Créer une commande
const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(orderData)
});

// PUT - Mettre à jour un produit
const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${token}`
    },
    body: formData  // FormData pour les fichiers
});
```

## 🎯 Fonctionnalités

### Client
- ✅ Consulter le catalogue de produits
- ✅ Filtrer par catégorie et prix
- ✅ Voir les détails d'un produit
- ✅ Passer une commande
- ✅ Format de commande : nom, téléphone, wilaya, commune, note

### Admin
- ✅ Se connecter avec credentials
- ✅ Créer des produits (avec images multiples)
- ✅ Éditer des produits
- ✅ Supprimer des produits
- ✅ Gérer les promotions (prix original vs prix promo)
- ✅ Voir les commandes

## 🛠️ Configuration

### Vite Config (`vite.config.js`)
```javascript
{
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': './src/resources/js',  // Importer facilement : import MyComp from '@/components/MyComp'
        }
    },
    server: {
        port: 5173,
        proxy: {
            '/api': 'http://localhost:8000'
        }
    }
}
```

### Tailwind CSS (`tailwind.config.js`)
- Utilisation de la version Vite de Tailwind
- Personnalisation de couleurs et breakpoints
- Support du mode sombre (optionnel)

## 📦 Dépendances Principales

```json
{
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "vite": "^7.0.7",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "@vitejs/plugin-react": "^6.0.1",
    "axios": "^1.11.0",
    "react-router-dom": "^6.x.x",  // Si utilisé
    "react-icons": "^4.x.x"        // Icons (FaIcon, etc)
}
```

## 🎨 Styles & Design

- **CSS Framework** : Tailwind CSS 4
- **Color Scheme** : Prédéfini dans `tailwind.config.js`
- **Responsif** : Mobile-first approach
- **Icons** : React Icons (FaIcon, FaSearch, etc)

### Classes Tailwind Courantes
```jsx
<div className="flex items-center justify-between gap-4">
    <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 text-white px-4 py-2 rounded-lg">
        Action
    </button>
</div>
```

## 🔐 Authentification

### Login Admin
```javascript
const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
    })
});
const data = await response.json();
localStorage.setItem('token', data.token);
```

### Utiliser le token dans les requêtes
```javascript
const headers = {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Accept': 'application/json'
};
```

## 📝 Hooks React Utilisés

- `useState()` - État local des composants
- `useEffect()` - Effets secondaires (appels API)
- `useContext()` - Partage d'état global (si utilisé)
- `useNavigate()` - Navigation (React Router)

## 🚀 Déploiement

### Build
```bash
npm run build
```

Cela génère un dossier `dist/` avec les assets optimisés.

### Servir localement
```bash
npm run preview
```

## 🐛 Troubleshooting

### Erreur "Cannot find module '@/...'"
→ Vérifier l'alias dans `vite.config.js`

### API retourne 409/500
→ Vérifier les logs du backend : `storage/logs/laravel.log`

### Images ne s'affichent pas
→ S'assurer que les images sont dans `public/images/` ou `backend/public/storage/`

### Proxy API ne fonctionne pas
→ Vérifier que le backend est lancé sur le port 8000

## 📚 Ressources

- [Vite Docs](https://vitejs.dev/)
- [React Docs](https://react.dev/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Router Docs](https://reactrouter.com/)

---

**Contact** : lgsalah@gmail.com | 0795734327
