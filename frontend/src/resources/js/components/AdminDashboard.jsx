import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import ProductManagement from './ProductManagement';
import AdminManagement from './AdminManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fonction pour ajouter le token aux headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  });

  const handleLogout = async () => {
    try {
      // Appel API logout
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: getHeaders(),
      });
    } catch (err) {
      console.error('Erreur logout:', err);
    } finally {
      // Supprimer les données locales
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      // Rediriger vers login
      navigate('/login');
    }
  };
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'products' ou 'admins'
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    en_attente: 0,
    confirmé: 0,
    livré: 0,
  });

  useEffect(() => {
    // Récupérer le rôle de l'utilisateur
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserRole(user.role);
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des commandes');
      }

      const data = await response.json();
      const ordersData = data.data || [];
      setOrders(ordersData);

      // Calculer les statistiques
      const statsData = {
        total: ordersData.length,
        en_attente: ordersData.filter((o) => o.statut === 'en_attente').length,
        confirmé: ordersData.filter((o) => o.statut === 'confirmé').length,
        livré: ordersData.filter((o) => o.statut === 'livré').length,
      };
      setStats(statsData);

      // Si la commande sélectionnée a été mise à jour, la rafraîchir
      if (selectedOrder) {
        const updatedOrder = ordersData.find((o) => o.id === selectedOrder.id);
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderUpdate = (updatedOrder) => {
    // Mettre à jour la liste des commandes
    setOrders((prevOrders) => {
      const newOrders = prevOrders.map((order) => 
        order.id === updatedOrder.id ? updatedOrder : order
      );
      
      // Recalculer les statistiques avec la nouvelle liste
      const statsData = {
        total: newOrders.length,
        en_attente: newOrders.filter((o) => o.statut === 'en_attente').length,
        confirmé: newOrders.filter((o) => o.statut === 'confirmé').length,
        livré: newOrders.filter((o) => o.statut === 'livré').length,
      };
      setStats(statsData);
      
      return newOrders;
    });
    
    setSelectedOrder(updatedOrder);
    
    //  Rafraîchir complètement les données depuis la base de données pour éviter les désynchronisations
    setTimeout(() => {
      fetchOrders();
    }, 500);
  };

  const handleOrderDelete = () => {
    // Fermer le détail et rafraîchir immédiatement la liste
    setSelectedOrder(null);
    fetchOrders();
  };

  if (error && loading) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-md">
          <div className="text-red-600 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Erreur de connexion</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchOrders}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-semibold"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tableau de Bord</h1>
              <p className="text-blue-100">Gérez vos commandes et produits</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 font-semibold disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                Rafraîchir
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors flex items-center gap-2"
              >
                Magasin
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors flex items-center gap-2"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex gap-4 border-t border-blue-400 pt-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
              }`}
            >
              Commandes
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
              }`}
            >
              Produits
            </button>
            {userRole === 'super_admin' && (
              <button
                onClick={() => setActiveTab('admins')}
                className={`flex items-center gap-2 px-6 py-2 rounded-t-lg font-semibold transition-all ${
                  activeTab === 'admins'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                }`}
              >
                Administrateurs
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contenu principal - Onglet Commandes */}
        {activeTab === 'orders' && (
          <>
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Commandes Totales</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
              </div>
              <span className="text-5xl opacity-20"> </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500 hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">En Attente</p>
                <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.en_attente}</p>
              </div>
              <span className="text-5xl opacity-20">·</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600 hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Confirmées</p>
                <p className="text-4xl font-bold text-blue-600 mt-2">{stats.confirmé}</p>
              </div>
              <span className="text-5xl opacity-20">|</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500 hover:shadow-lg transition-shadow animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium"> Livrées</p>
                <p className="text-4xl font-bold text-green-600 mt-2">{stats.livré}</p>
              </div>
              <span className="text-5xl opacity-20"> </span>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrer les commandes</h2>
          <div className="flex gap-2 flex-wrap bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <button
              onClick={() => setFilterStatus(null)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === null
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
               Toutes
            </button>
            <button
              onClick={() => setFilterStatus('en_attente')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'en_attente'
                  ? 'bg-yellow-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En attente
            </button>
            <button
              onClick={() => setFilterStatus('confirmé')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'confirmé'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Confirmées
            </button>
            <button
              onClick={() => setFilterStatus('livré')}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filterStatus === 'livré'
                  ? 'bg-green-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Livrées
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <div className={`grid gap-8 ${selectedOrder ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} transition-all duration-300`}>
          {/* Liste des commandes */}
          <div className={selectedOrder ? 'lg:col-span-1' : 'lg:col-span-3'}>
            {loading && !orders.length ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="inline-flex items-center justify-center">
                  <div className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <p className="mt-4 text-gray-600 font-medium">Chargement des commandes...</p>
              </div>
            ) : (
              <OrderList
                orders={orders}
                onSelectOrder={setSelectedOrder}
                onRefresh={fetchOrders}
                filterStatus={filterStatus}
              />
            )}
          </div>

          {/* Détails de la commande */}
          {selectedOrder && (
            <div className="lg:col-span-2 animate-slide-up">
              <div className="sticky top-8">
                <OrderDetail
                  order={selectedOrder}
                  onClose={() => setSelectedOrder(null)}
                  onUpdate={handleOrderUpdate}
                  onDelete={handleOrderDelete}
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
        </>
        )}

        {/* Contenu principal - Onglet Produits */}
        {activeTab === 'products' && (
          <ProductManagement token={localStorage.getItem('auth_token')} />
        )}

        {/* Contenu principal - Onglet Administrateurs (Super Admin uniquement) */}
        {activeTab === 'admins' && userRole === 'super_admin' && (
          <AdminManagement token={localStorage.getItem('auth_token')} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
