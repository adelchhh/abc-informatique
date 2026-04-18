import React, { useState, useEffect } from 'react';

const ProductRequestManagement = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Charger les demandes de produits
  useEffect(() => {
    fetchProductRequests();
  }, []);

  const fetchProductRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://abcinformatique.org/api/product-requests', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des demandes');
      }

      const data = await response.json();
      setRequests(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le statut
  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`https://abcinformatique.org/api/product-requests/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      // Mettre à jour la liste
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      alert('Erreur: ' + err.message);
      console.error('❌ Erreur:', err);
    }
  };

  // Supprimer une demande
  const deleteRequest = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) {
      return;
    }

    try {
      const response = await fetch(`https://abcinformatique.org/api/product-requests/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setRequests(requests.filter(req => req.id !== id));
      setSelectedRequest(null);
    } catch (err) {
      alert('Erreur: ' + err.message);
      console.error('❌ Erreur:', err);
    }
  };

  // Filtrer les demandes
  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  // Couleur du badge de statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'nouveau':
        return 'bg-yellow-100 text-yellow-800';
      case 'lu':
        return 'bg-blue-100 text-blue-800';
      case 'traité':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'nouveau':
        return '🆕 Nouveau';
      case 'lu':
        return '👁️ Lu';
      case 'traité':
        return '✅ Traité';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">⏳ Chargement...</div>;
  }

  return (
    <div className="p-6 bg-white rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">📦 Demandes de Produits</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">❌ {error}</p>
        </div>
      )}

      {/* Statistiques */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-800">{requests.length}</p>
        </div>
        <div className="p-4 bg-yellow-50 rounded-lg">
          <p className="text-gray-600 text-sm">Nouveau</p>
          <p className="text-2xl font-bold text-yellow-600">{requests.filter(r => r.status === 'nouveau').length}</p>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-gray-600 text-sm">Lu</p>
          <p className="text-2xl font-bold text-blue-600">{requests.filter(r => r.status === 'lu').length}</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-gray-600 text-sm">Traité</p>
          <p className="text-2xl font-bold text-green-600">{requests.filter(r => r.status === 'traité').length}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          Tous
        </button>
        <button
          onClick={() => setFilter('nouveau')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'nouveau'
              ? 'bg-yellow-600 text-white'
              : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
          }`}
        >
          🆕 Nouveaux
        </button>
        <button
          onClick={() => setFilter('lu')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'lu'
              ? 'bg-blue-600 text-white'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
        >
          👁️ Lus
        </button>
        <button
          onClick={() => setFilter('traité')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'traité'
              ? 'bg-green-600 text-white'
              : 'bg-green-100 text-green-800 hover:bg-green-200'
          }`}
        >
          ✅ Traités
        </button>
      </div>

      {/* Liste des demandes */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Aucune demande à afficher
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {request.prenom} {request.nom}
                  </h3>
                  <p className="text-sm text-gray-600">📱 {request.telephone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {getStatusLabel(request.status)}
                </span>
              </div>
              <p className="text-gray-700 mb-3 line-clamp-2">{request.description_produit}</p>
              <p className="text-xs text-gray-500">
                📅 {new Date(request.created_at).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Détails de la demande */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <h3 className="text-2xl font-bold text-gray-800">
                Demande #ID-{selectedRequest.id}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Informations du client */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">👤 Informations du client</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">Nom</p>
                    <p className="font-semibold text-gray-800">{selectedRequest.nom}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Prénom</p>
                    <p className="font-semibold text-gray-800">{selectedRequest.prenom}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Téléphone</p>
                    <p className="font-semibold text-gray-800">{selectedRequest.telephone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Envoyé le</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedRequest.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description du produit */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📦 Produit demandé</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800 whitespace-pre-wrap">
                    {selectedRequest.description_produit}
                  </p>
                </div>
              </div>

              {/* Statut */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">📊 Statut</h4>
                <div className="flex gap-2">
                  <select
                    value={selectedRequest.status}
                    onChange={(e) => {
                      updateStatus(selectedRequest.id, e.target.value);
                      setSelectedRequest({
                        ...selectedRequest,
                        status: e.target.value,
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="nouveau">🆕 Nouveau</option>
                    <option value="lu">👁️ Lu</option>
                    <option value="traité">✅ Traité</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => deleteRequest(selectedRequest.id)}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  🗑️ Supprimer
                </button>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRequestManagement;
