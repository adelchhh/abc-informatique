import React, { useState } from 'react';

const OrderDetail = ({ order, onClose, onUpdate, onDelete, loading }) => {
  const [formData, setFormData] = useState({
    statut: order.statut,
    livreur_nom: order.livreur_nom || '',
    date_livraison: order.date_livraison ? order.date_livraison.split('T')[0] : '',
  });

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fonction pour ajouter le token aux headers
  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  });

  const handleDelete = async () => {
    // Vérifier que la commande est livrée
    if (order.statut !== 'livré') {
      alert('Seulement les commandes livrées peuvent être supprimées');
      return;
    }

    // Confirmation avant suppression
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la commande #${order.id} de ${order.nom}?\n\nCette action est irréversible!`)) {
      return;
    }

    setDeleting(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification introuvable.');
      }

      console.log('Envoi de la requête DELETE vers /api/orders/' + order.id);

      const response = await fetch(`https://abcinformatique.org/api/orders/${order.id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}`);
      }

      alert('Commande supprimée avec succès!');
      if (onDelete) {
        onDelete();
      } else {
        onClose();
      }
      // La liste se rafraîchira automatiquement via le callback
    } catch (err) {
      const errorMsg = err.message || 'Erreur lors de la suppression';
      console.error(' Erreur suppression:', err);
      setError(errorMsg);
      alert(` Erreur: ${errorMsg}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Token d\'authentification introuvable. Veuillez vous reconnecter.');
      }

      console.log('Envoi de la requête PUT vers /api/orders/' + order.id);
      console.log('Token:', token.substring(0, 20) + '...');
      console.log('Données:', formData);

      const response = await fetch(`https://abcinformatique.org/api/orders/${order.id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      });

      console.log('Réponse status:', response.status);
      console.log('Réponse ok:', response.ok);

      const data = await response.json();
      console.log('Réponse données:', data);

      if (!response.ok) {
        throw new Error(data.message || `Erreur ${response.status}: ${response.statusText}`);
      }

      if (onUpdate) {
        onUpdate(data.data);
      }

      alert('Commande mise à jour avec succès !');
    } catch (err) {
      const errorMsg = err.message || 'Erreur réseau inconnue';
      console.error(' Erreur complète:', err);
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'en_attente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmé':
        return 'bg-blue-100 text-blue-800';
      case 'livré':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-2xl border border-gray-100 overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Commande n° {order.id}</h2>
          <p className="text-blue-100 text-sm mt-1">Les modifications seront enregistrées automatiquement</p>
        </div>
        <button
          onClick={onClose}
          className="text-white text-3xl hover:opacity-70 transition-opacity"
        >
          X
        </button>
      </div>

      <div className="p-6">
        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex gap-3">
              <span className="text-red-600 text-xl"> </span>
              <div>
                <p className="font-semibold text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Informations client et produit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Informations client */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <span> </span> Informations Client
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Nom</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{order.nom}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Téléphone</p>
                <p className="font-mono text-blue-600 mt-1">{order.telephone}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Adresse</p>
                <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{order.adresse}</p>
              </div>
              {order.note_client && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Notes</p>
                  <p className="text-sm text-gray-700 mt-1 italic">&quot;{order.note_client}&quot;</p>
                </div>
              )}
            </div>
          </div>

          {/* Informations produit */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              <span> </span> Informations Produit
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Produit</p>
                <p className="text-lg font-bold text-gray-900 mt-1">{order.product_name}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Prix</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {Number(order.product_price ?? 0).toFixed(2)} DA
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Date de Commande</p>
                <p className="text-sm text-gray-700 mt-1">
                  {new Date(order.created_at).toLocaleDateString('fr-FR', {
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
        </div>

        {/* Formulaire de mise à jour */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-6">
          <h3 className="font-bold text-gray-900 mb-5 text-lg flex items-center gap-2">
            <span>Gérer la Commande</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Statut */}
            <div>
              <label htmlFor="statut" className="block text-sm font-bold text-gray-700 mb-2">
                Statut de la Commande
              </label>
              <select
                id="statut"
                name="statut"
                value={formData.statut}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-semibold text-gray-900"
              >
                <option value="en_attente">En attente</option>
                <option value="confirmé">OK Confirmé</option>
                <option value="livré"> Livré</option>
              </select>
            </div>

            {/* Livreur */}
            <div>
              <label htmlFor="livreur_nom" className="block text-sm font-bold text-gray-700 mb-2">
                Nom du Livreur (optionnel)
              </label>
              <input
                type="text"
                id="livreur_nom"
                name="livreur_nom"
                value={formData.livreur_nom}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Ahmed Chebbi, Salah Eddine..."
              />
            </div>

            {/* Date de livraison */}
            <div>
              <label
                htmlFor="date_livraison"
                className="block text-sm font-bold text-gray-700 mb-2"
              >
                Date de Livraison Estimée (optionnel)
              </label>
              <input
                type="date"
                id="date_livraison"
                name="date_livraison"
                value={formData.date_livraison}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            {/* Boutons */}
            <div className="flex justify-between gap-4 pt-4 border-t border-gray-300">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting || order.statut !== 'livré'}
                  className={`px-6 py-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 ${
                    order.statut !== 'livré'
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-50'
                      : deleting
                      ? 'bg-red-400 text-white cursor-not-allowed'
                      : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
                  }`}
                  title={order.statut !== 'livré' ? 'Seulement les commandes livrées peuvent être supprimées' : 'Supprimer cette commande'}
                >
                  {deleting ? (
                    <>
                      <span className="animate-spin">·</span> Suppression...
                    </>
                  ) : (
                    <>
                      <span> </span> Supprimer
                    </>
                  )}
                </button>
              </div>
              
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-bold transition-colors"
              >
                ← Fermer
              </button>
              <button
                type="submit"
                disabled={saving || loading}
                className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                  saving || loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95'
                }`}
              >
                {saving ? (
                  <>
                    <span className="animate-spin">·</span> Enregistrement...
                  </>
                ) : (
                  <>
                    <span>OK</span> Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Statut Actuel */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">STATUT ACTUEL</p>
          <div className="flex items-center gap-3">
            <span
              className={`px-5 py-2 rounded-full text-lg font-bold ${getStatusBadgeColor(
                formData.statut
              )}`}
            >
              {formData.statut === 'en_attente' && 'En attente'}
              {formData.statut === 'confirmé' && 'OK Confirmé'}
              {formData.statut === 'livré' && ' Livré'}
            </span>
            <p className="text-sm text-gray-700">
              {formData.livreur_nom && `Livreur : ${formData.livreur_nom}`}
              {formData.date_livraison && ` | Livraison le ${new Date(formData.date_livraison).toLocaleDateString('fr-FR')}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
