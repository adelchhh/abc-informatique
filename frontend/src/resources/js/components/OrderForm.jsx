import React, { useState, useEffect } from 'react';

const OrderForm = ({ product, onSubmit, onCancel }) => {
  // Scroll vers le haut quand le formulaire s'affiche
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    nom: '',
    telephone: '',
    wilaya: '',
    commune: '',
    note_client: '',
    quantité: product.orderQuantity || 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis';
    } else if (!/^[0-9+\s\-()]+$/.test(formData.telephone)) {
      newErrors.telephone = 'Le numéro de téléphone n\'est pas valide';
    } else if (formData.telephone.replace(/\D/g, '').length < 8) {
      newErrors.telephone = 'Le numéro doit contenir au moins 8 chiffres';
    }

    if (!formData.wilaya.trim()) {
      newErrors.wilaya = 'La wilaya est requise';
    } else if (formData.wilaya.length < 2) {
      newErrors.wilaya = 'La wilaya doit contenir au moins 2 caractères';
    }

    if (!formData.commune.trim()) {
      newErrors.commune = 'La commune est requise';
    } else if (formData.commune.length < 2) {
      newErrors.commune = 'La commune doit contenir au moins 2 caractères';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur du champ au moment de la correction
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation du formulaire
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        ...formData,
        product_id: product.id,
        quantité: formData.quantité,
        adresse: `${formData.wilaya}, ${formData.commune}`,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la création de la commande');
      }

      setSuccess(true);
      if (onSubmit) {
        onSubmit(data.data);
      }

      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setFormData({
          nom: '',
          telephone: '',
          wilaya: '',
          commune: '',
          note_client: '',
          quantité: product.orderQuantity || 1,
        });
        setSuccess(false);
        onCancel();
      }, 2500);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-8 text-center animate-slide-up">
        <div className="text-6xl mb-4 animate-bounce-subtle">OK</div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Commande confirmée!</h3>
        <p className="text-green-700 mb-4">
          Votre commande a été enregistrée avec succès.
        </p>
        <p className="text-sm text-green-600 mb-4">
          Notre équipe vous confirmera les détails de livraison par téléphone.
        </p>
        <div className="inline-flex gap-2 text-2xl justify-center mb-6">
          <span>T</span>
          <span>P</span>
          <span>OK</span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
        >
          ← Retour au Catalogue
        </button>
        <p className="text-xs text-gray-500 mt-4">Retour automatique dans quelques secondes...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-8 border border-gray-100 animate-slide-up">
      {/* Header avec bouton Retour */}
      <div className="mb-6 pb-6 border-b-2 border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Commande
          </h2>
          <p className="text-gray-600 text-sm">Complétez les détails de votre livraison</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg cursor-pointer"
          title="Retour au catalogue"
        >
          ← Continuer
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
          <div className="flex gap-3">
            <span className="text-red-600 text-xl">!</span>
            <div>
              <p className="font-semibold text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Résumé du produit */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5 mb-6 border border-blue-100">
        <p className="text-sm text-gray-600 mb-2">Vous commandez:</p>
        <div className="flex justify-between items-baseline gap-4">
          <div>
            <p className="font-bold text-lg text-gray-900">{product.nom}</p>
            <p className="text-sm text-gray-600 mt-1">{product.description}</p>
            <p className="text-sm text-blue-600 font-semibold mt-2">
              OK Quantité: {formData.quantité} {formData.quantité > 1 ? 'unités' : 'unité'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 mb-1">À l'unité:</p>
            <p className="text-xl font-bold text-blue-600 mb-3">
              {product.prix.toFixed(2)} DA
            </p>
            <div className="text-sm text-gray-600 mb-1">Total:</div>
            <p className="text-3xl font-bold text-green-600">
              {(product.prix * formData.quantité).toFixed(2)} DA
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Nom */}
        <div>
          <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.nom ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="Ahmed Chebli"
          />
          {errors.nom && <p className="text-red-600 text-sm mt-1">{errors.nom}</p>}
        </div>

        {/* Téléphone */}
        <div>
          <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2">
            Numéro de téléphone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="telephone"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
              errors.telephone ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
            }`}
            placeholder="+213 __ ___ ___"
          />
          {errors.telephone && <p className="text-red-600 text-sm mt-1">{errors.telephone}</p>}
        </div>

        {/* Adresse - Wilaya et Commune */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Wilaya */}
          <div>
            <label htmlFor="wilaya" className="block text-sm font-semibold text-gray-700 mb-2">
              Wilaya <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="wilaya"
              name="wilaya"
              value={formData.wilaya}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.wilaya ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Ex: Alger, Oran, Constantine..."
            />
            {errors.wilaya && <p className="text-red-600 text-sm mt-1">{errors.wilaya}</p>}
          </div>

          {/* Commune */}
          <div>
            <label htmlFor="commune" className="block text-sm font-semibold text-gray-700 mb-2">
              Commune <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="commune"
              name="commune"
              value={formData.commune}
              onChange={handleChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.commune ? 'border-red-400 bg-red-50' : 'border-gray-300 focus:border-blue-500'
              }`}
              placeholder="Ex: Alger Centre, Sidi Bel Abbès..."
            />
            {errors.commune && <p className="text-red-600 text-sm mt-1">{errors.commune}</p>}
          </div>
        </div>

        {/* Note client */}
        <div>
          <label htmlFor="note_client" className="block text-sm font-semibold text-gray-700 mb-2">
            Notes spéciales (optionnel)
          </label>
          <textarea
            id="note_client"
            name="note_client"
            value={formData.note_client}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
            placeholder="Précisions sur la livraison, demandes spéciales..."
          ></textarea>
          <p className="text-xs text-gray-500 mt-1">Étage, digicode, heure préférée...</p>
        </div>

        {/* Boutons */}
        <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
          >
            ← Continuer les achats
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 px-6 py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95'
            }`}
          >
            {loading ? (
              <>
                <span className="animate-spin">·</span> Envoi...
              </>
            ) : (
              <>
                <span>OK</span> Valider la commande
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Paiement à la livraison | Livraison rapide
        </p>
      </form>
    </div>
  );
};

export default OrderForm;
