import React, { useState } from 'react';
import { FaArrowLeft, FaShoppingCart, FaBox } from 'react-icons/fa';
import OrderForm from './OrderForm';
import Navbar from './Navbar';

const ProductDetail = ({ product, onBack, onOrderSubmit }) => {
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    if (value > 0 && value <= product.stock) {
      setOrderQuantity(value);
    }
  };

  const handleRetourCatalogue = () => {
    console.log('🔙 Retour au catalogue appelé');
    if (onBack) {
      onBack();
    } else {
      console.error('❌ onBack n\'est pas défini');
    }
  };

  if (!product) {
    return <div>Aucun produit trouvé</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
        {/* Bouton retour */}
        <button
          type="button"
          onClick={handleRetourCatalogue}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg mb-8 transition-all shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
        >
          <FaArrowLeft size={20} /> Retour au Catalogue
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Colonne Gauche - Images et Infos */}
          <div className="space-y-6">
            {/* Image principale */}
            <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
              {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                <img
                  src={`http://localhost:8000/storage/${product.images[selectedImageIndex]}`}
                  alt={product.nom}
                  className="w-full h-96 object-cover rounded-lg cursor-zoom-in"
                />
              ) : product.image ? (
                <img
                  src={`http://localhost:8000/storage/${product.image}`}
                  alt={product.nom}
                  className="w-full h-96 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded-lg text-gray-400 text-7xl">
                   
                </div>
              )}
              
              {/* Badge stock - SUPPRIMÉ */}
            </div>

            {/* Galerie d'images supplémentaires */}
            {product.images && Array.isArray(product.images) && product.images.length > 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Toutes les images ({product.images.length})</h3>
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImageIndex === index
                          ? 'border-blue-500 ring-2 ring-blue-300 shadow-lg'
                          : 'border-gray-200 hover:border-blue-500'
                      }`}
                    >
                      <img
                        src={`http://localhost:8000/storage/${image}`}
                        alt={`Image ${index + 1}`}
                        className={`w-full h-full object-cover transition-transform ${
                          selectedImageIndex === index ? 'scale-100' : 'hover:scale-110'
                        }`}
                      />
                      {selectedImageIndex === index && (
                        <div className="absolute inset-0 bg-blue-500 opacity-0"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Infos rapides */}
            <div className="bg-white rounded-lg p-6 shadow-md space-y-4">
              
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-gray-600 font-semibold">Catégorie:</span>
                <span className="font-bold">Électronique</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 font-semibold">Livraison:</span>
                <span className="font-bold">Rapide</span>
              </div>
            </div>
          </div>

          {/* Colonne Droite - Détails et Commande */}
          <div className="space-y-6">
            {/* Titre et Prix */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.nom}</h1>
              
              {/* Badge PROMO */}
              {product.is_promo && (
                <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm mb-4">
                  🎯 EN PROMOTION
                </div>
              )}
              
              <div className="mb-6 pb-6 border-b-2">
                <p className="text-sm text-gray-500 mb-2">Prix unitaire</p>
                {product.is_promo ? (
                  <div className="space-y-2">
                    <p className="text-lg text-gray-400 line-through">
                      {product.prix_original?.toFixed(2)} DA
                    </p>
                    <p className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                      {product.prix_promo?.toFixed(2)} DA
                    </p>
                    <p className="text-sm text-green-600 font-semibold">
                      Économisez {(product.prix_original - product.prix_promo).toFixed(2)} DA !
                    </p>
                  </div>
                ) : (
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {product.prix.toFixed(2)} DA
                  </p>
                )}
              </div>

              {product.description && (
                <div>
                  <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {product.description}
                  </p>
                </div>
              )}
            </div>

            {/* Formulaire de commande */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FaShoppingCart /> Commander ce produit
              </h2>

              {product.stock > 0 ? (
                <div className="space-y-4">
                  {/* Sélection quantité */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantité:
                    </label>
                    <div className="flex items-center gap-4">
                      <select
                        value={orderQuantity}
                        onChange={handleQuantityChange}
                        className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-semibold bg-white"
                      >
                        {[...Array(Math.min(10, product.stock))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 > 1 ? 'unités' : 'unité'}
                          </option>
                        ))}
                      </select>
                      <div className="text-right bg-blue-50 px-4 py-3 rounded-lg">
                        <p className="text-xs text-gray-600">Total:</p>
                        <p className="text-2xl font-bold text-blue-600">
                          {(
                            (product.is_promo ? product.prix_promo : product.prix) * orderQuantity
                          ).toFixed(2)} DA
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message info */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-blue-800 text-sm">
                    <p className="font-semibold">ℹ️ Paiement à la livraison</p>
                    <p>Payez directement au livreur lors de la réception de votre commande</p>
                  </div>

                  {/* OrderForm */}
                  <OrderForm
                    product={{ ...product, orderQuantity }}
                    onSubmit={onOrderSubmit}
                    onCancel={handleRetourCatalogue}
                  />
                </div>
              ) : (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-center">
                  <p className="text-4xl mb-3"> </p>
                  <p className="text-red-700 font-semibold mb-2">Produit indisponible</p>
                  <p className="text-red-600 text-sm">Ce produit est actuellement en rupture de stock.</p>
                  <button
                    type="button"
                    onClick={handleRetourCatalogue}
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-bold shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer"
                  >
                    ← Retour au Catalogue
                  </button>
                </div>
              )}
            </div>

            {/* Avantages */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-xl">OK</span> Nos garanties
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">OK</span>
                  <span>Livraison rapide en toute l'Algérie</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">OK</span>
                  <span>Paiement à la livraison, sans frais supplémentaires</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">OK</span>
                  <span>Produits neufs et authentiques garantis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">OK</span>
                  <span>Service client disponible 7j/7</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProductDetail;
