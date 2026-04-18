// 📍 Example: src/services/api.ts ou api.js

/**
 * Service pour communiquer avec l'API Laravel
 * ✅ Fonctionne en développement ET production
 * ✅ Gère l'authentification avec tokens
 * ✅ CORS compatible
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Configuration
const API_BASE_URL = IS_PRODUCTION 
  ? 'https://abc-informatique.com/api'
  : 'http://localhost:8000/api';

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

/**
 * Fonction générique pour faire des requêtes API
 */
export async function apiCall(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    token?: string;
  } = {}
) {
  const { method = 'GET', body, token } = options;

  const headers = { ...DEFAULT_HEADERS };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'include', // Pour les cookies CSRF si besoin
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // Gestion des erreurs HTTP
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

// ============================================================
// 🛍️ PRODUCTS API
// ============================================================

export const productsAPI = {
  /**
   * Récupérer tous les produits
   */
  getAll: () => apiCall('/products'),

  /**
   * Récupérer un produit par ID
   */
  getById: (id: number) => apiCall(`/products/${id}`),

  /**
   * Créer un produit (Admin only)
   */
  create: (data: any, token: string) =>
    apiCall('/products', {
      method: 'POST',
      body: data,
      token,
    }),

  /**
   * Mettre à jour un produit (Admin only)
   */
  update: (id: number, data: any, token: string) =>
    apiCall(`/products/${id}`, {
      method: 'PUT',
      body: data,
      token,
    }),

  /**
   * Supprimer un produit (Admin only)
   */
  delete: (id: number, token: string) =>
    apiCall(`/products/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// ============================================================
// 📦 ORDERS API
// ============================================================

export const ordersAPI = {
  /**
   * Récupérer toutes les commandes
   */
  getAll: () => apiCall('/orders'),

  /**
   * Récupérer une commande par ID
   */
  getById: (id: number) => apiCall(`/orders/${id}`),

  /**
   * Récupérer les commandes par statut
   */
  getByStatus: (status: string) => apiCall(`/orders/status/${status}`),

  /**
   * Créer une commande (public)
   */
  create: (data: any) =>
    apiCall('/orders', {
      method: 'POST',
      body: data,
    }),

  /**
   * Mettre à jour une commande (Admin only)
   */
  update: (id: number, data: any, token: string) =>
    apiCall(`/orders/${id}`, {
      method: 'PUT',
      body: data,
      token,
    }),

  /**
   * Supprimer une commande (Admin only)
   */
  delete: (id: number, token: string) =>
    apiCall(`/orders/${id}`, {
      method: 'DELETE',
      token,
    }),
};

// ============================================================
// 🔐 AUTH API
// ============================================================

export const authAPI = {
  /**
   * Se connecter avec email/password
   * Retourne un token d'authentification
   */
  login: (email: string, password: string) =>
    apiCall('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),

  /**
   * Récupérer les info du utilisateur actuel (Avec token)
   */
  getCurrentUser: (token: string) =>
    apiCall('/auth/me', {
      method: 'GET',
      token,
    }),

  /**
   * Se déconnecter (Avec token)
   */
  logout: (token: string) =>
    apiCall('/auth/logout', {
      method: 'POST',
      token,
    }),
};

// ============================================================
// 💾 STORAGE - Gestion des tokens localement
// ============================================================

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const storage = {
  setToken: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  getToken: () => localStorage.getItem(TOKEN_KEY),
  clearToken: () => localStorage.removeItem(TOKEN_KEY),

  setUser: (user: any) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
  getUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
  clearUser: () => localStorage.removeItem(USER_KEY),

  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

// ============================================================
// 🔄 Exemple d'utilisation dans un composant React
// ============================================================

/*

// 1️⃣ Afficher les produits
import { productsAPI } from '@/services/api';
import { useEffect, useState } from 'react';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getAll()
      .then(data => setProducts(data.products))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}

// 2️⃣ Se connecter
import { authAPI, storage } from '@/services/api';

export function LoginForm() {
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      storage.setToken(response.token);
      storage.setUser(response.user);
      console.log('✅ Connecté!');
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const email = (e.target as any).email.value;
      const password = (e.target as any).password.value;
      handleLogin(email, password);
    }}>
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Motdepasse" required />
      <button type="submit">Connexion</button>
    </form>
  );
}

// 3️⃣ Créer une commande
import { ordersAPI } from '@/services/api';

export function OrderForm() {
  const handleSubmit = async (formData: any) => {
    try {
      const response = await ordersAPI.create({
        customer_name: formData.name,
        customer_email: formData.email,
        items: formData.items,
        total: formData.total,
      });
      console.log('✅ Commande créée!', response);
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      // ... récupérer les données du formulaire
      handleSubmit({...});
    }}>
      {/* form inputs */}
    </form>
  );
}

*/
