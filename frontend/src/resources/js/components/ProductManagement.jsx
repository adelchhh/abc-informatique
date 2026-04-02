import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCheck } from 'react-icons/fa';

const ProductManagement = ({ token }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    category: 'autre',
    description: '',
    prix: '',
    stock: '',
    isPromo: false,
    prixOriginal: '',
    prixPromo: '',
    images: [], // Nouvelles images à ajouter (fichiers)
    imagePreviews: [], // Aperçus des nouvelles images
    existingImages: [], // Images existantes du produit
    existingImagePreviews: [], // Aperçus des images existantes
    imagesToRemove: [], // IDs des images à supprimer
  });

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
  });

  // Charger les produits au démarrage
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:8000/api/products', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des produits');
      }

      const data = await response.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const selectedFiles = Array.from(files);
      
      // Validation: minimum 1, maximum 5 images
      if (selectedFiles.length < 1) {
        alert('Veuillez sélectionner au moins 1 image');
        return;
      }
      if (selectedFiles.length > 5) {
        alert('Vous pouvez sélectionner maximum 5 images');
        return;
      }

      // Traiter les fichiers sélectionnés
      const newImages = selectedFiles;
      const newPreviews = [];
      let processedCount = 0;

      selectedFiles.forEach((file, index) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews[index] = reader.result;
          processedCount++;

          // Quand tous les fichiers sont chargés
          if (processedCount === selectedFiles.length) {
            setFormData((prev) => ({
              ...prev,
              images: newImages,
              imagePreviews: newPreviews,
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    } else if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nom || !formData.prix || !formData.stock) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Valider les champs promo si la promotion est activée
    if (formData.isPromo) {
      if (!formData.prixOriginal || !formData.prixPromo) {
        alert('Veuillez remplir les prix original et promo');
        return;
      }
      if (parseFloat(formData.prixPromo) >= parseFloat(formData.prixOriginal)) {
        alert('Le prix promo doit être inférieur au prix original');
        return;
      }
    }

    // Valider que la catégorie n'est pas "autre"
    if (formData.category === 'autre') {
      alert('Veuillez sélectionner une catégorie spécifique (ne pas laisser "Autre")');
      return;
    }

    // Valider les images
    const totalImages = formData.existingImages.length + formData.images.length;
    if (totalImages === 0) {
      alert('Veuillez sélectionner au moins 1 image');
      return;
    }
    if (totalImages > 5) {
      alert('Maximum 5 images par produit');
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:8000/api/products/${editingId}`
        : 'http://localhost:8000/api/products';

      const method = editingId ? 'PUT' : 'POST';

      // Créer FormData pour l'upload d'images
      const formDataToSend = new FormData();
      formDataToSend.append('nom', formData.nom);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('prix', formData.prix);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('is_promo', formData.isPromo ? 1 : 0);
      formDataToSend.append('prix_original', formData.prixOriginal || '');
      formDataToSend.append('prix_promo', formData.prixPromo || '');
      
      // Pour les PUT avec FormData, Laravel nécessite _method
      if (editingId) {
        formDataToSend.append('_method', 'PUT');
        
        // Ajouter les images existantes à garder
        if (formData.existingImages && formData.existingImages.length > 0) {
          formData.existingImages.forEach((image, index) => {
            formDataToSend.append(`existingImages[${index}]`, image.path);
          });
        }
        
        // Ajouter les indices des images à supprimer
        if (formData.imagesToRemove && formData.imagesToRemove.length > 0) {
          formDataToSend.append('imagesToRemove', JSON.stringify(formData.imagesToRemove));
        }
      }
      
      // Ajouter les nouvelles images
      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((image) => {
          formDataToSend.append('images[]', image);
        });
        console.log(`Envoi de ${formData.images.length} images`);
      }
      
      console.log('Données FormData à envoyer - nom:', formData.nom, 'prix:', formData.prix, 'stock:', formData.stock, 'is_promo:', formData.isPromo, 'images:', formData.images.length);

      const headers = {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(url, {
        method: editingId ? 'POST' : 'POST', // Toujours POST avec _method pour FormData
        headers,
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Erreur API complète:', data);
        
        // Si c'est une erreur de validation, afficher les erreurs
        if (data.errors) {
          const errorMessages = Object.entries(data.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          throw new Error(`Erreurs de validation:\n${errorMessages}`);
        }
        
        throw new Error(data.message || data.error || `Erreur: ${response.status}`);
      }

      setSuccessMessage(
        editingId
          ? 'Produit mis à jour avec succès!'
          : 'Produit créé avec succès!'
      );

      setTimeout(() => setSuccessMessage(''), 3000);

      // Réinitialiser le formulaire
      setFormData({ 
        nom: '', 
        category: 'autre', 
        description: '', 
        prix: '', 
        stock: '', 
        isPromo: false,
        prixOriginal: '',
        prixPromo: '',
        images: [], 
        imagePreviews: [],
        existingImages: [],
        existingImagePreviews: [],
        imagesToRemove: [],
      });
      setShowForm(false);
      setEditingId(null);

      // Recharger les produits
      fetchProducts();
    } catch (err) {
      console.error('Erreur détaillée:', err);
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    
    // Récupérer les images existantes du produit
    const existingImages = [];
    const existingImagePreviews = [];
    
    // Si le produit a des images existantes
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      product.images.forEach((img, index) => {
        existingImages.push({ path: img, id: index }); // Stocker le chemin
        existingImagePreviews.push(`http://localhost:8000/storage/${img}`);
      });
    } else if (product.image) {
      // Sinon si c'est une seule image (legacy)
      existingImages.push({ path: product.image, id: 0 });
      existingImagePreviews.push(`http://localhost:8000/storage/${product.image}`);
    }
    
    setFormData({
      nom: product.nom,
      category: product.category || 'autre',
      description: product.description || '',
      prix: product.prix,
      stock: product.stock,
      isPromo: product.is_promo || false,
      prixOriginal: product.prix_original || '',
      prixPromo: product.prix_promo || '',
      images: [], // Nouvelles images à ajouter
      imagePreviews: [], // Aperçus des nouvelles images
      existingImages: existingImages, // Images existantes
      existingImagePreviews: existingImagePreviews, // Aperçus des images existantes
      imagesToRemove: [], // Pas d'images à supprimer au départ
    });
    setShowForm(true);
  };

  const handleDelete = async (id, nom) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer "${nom}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression');
      }

      setSuccessMessage(`Produit "${nom}" supprimé avec succès!`);
      setTimeout(() => setSuccessMessage(''), 3000);

      fetchProducts();
    } catch (err) {
      alert(`Erreur: ${err.message}`);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ nom: '', category: 'autre', description: '', prix: '', stock: '', isPromo: false, prixOriginal: '', prixPromo: '', images: [], imagePreviews: [], existingImages: [], existingImagePreviews: [], imagesToRemove: [] });
  };

  // Supprimer une image existante
  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
      existingImagePreviews: prev.existingImagePreviews.filter((_, i) => i !== index),
      imagesToRemove: [...prev.imagesToRemove, index], // Marquer comme à supprimer
    }));
  };

  // Supprimer une nouvelle image sélectionnée
  const removeNewImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const filteredProducts = products.filter((product) =>
    product.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center">
          <div className="h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Produits</h2>
          <p className="text-gray-600 mt-1">Total: {products.length} produit(s)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
        >
          <FaPlus /> Ajouter un produit
        </button>
      </div>

      {/* Message de succès */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4 text-green-700 animate-pulse">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {editingId ? ' Modifier le produit' : ' Nouveau produit'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom du produit *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Ex: Ordinateur Portable Dell"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                  required
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catégorie * (Obligatoire - Ne pas laisser "Autre")
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:border-blue-500 focus:outline-none font-medium bg-white ${
                    formData.category === 'autre' 
                      ? 'border-orange-400 bg-orange-50' 
                      : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="autre"> Autre (Sélectionnez une catégorie)</option>
                  <option value="laptop"> Ordinateurs Portables</option>
                  <option value="unité"> Accessoires & Unités</option>
                  <option value="imprimante"> Imprimantes</option>
                  <option value="modem"> Modems & Routeurs</option>
                </select>
                {formData.category === 'autre' && (
                  <p className="text-orange-600 text-xs mt-2 font-semibold">Veuillez sélectionner une catégorie spécifique</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Prix (DA) *
                </label>
                <input
                  type="text"
                  name="prix"
                  value={formData.prix}
                  onChange={handleInputChange}
                  placeholder="Ex: 125000, 125,50 ou 125 000"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                  required
                />
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Ex: 25"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                  required
                />
              </div>

              {/* En promotion */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isPromo"
                  name="isPromo"
                  checked={formData.isPromo}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
                <label htmlFor="isPromo" className="text-sm font-semibold text-gray-700 cursor-pointer">
                   Ce produit est en promotion
                </label>
              </div>
            </div>

            {/* Champs Prix Promotion (visibles seulement si isPromo est coché) */}
            {formData.isPromo && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-5 rounded-lg border-2 border-yellow-300">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Prix original (barré) *
                  </label>
                  <input
                    type="text"
                    name="prixOriginal"
                    value={formData.prixOriginal}
                    onChange={handleInputChange}
                    placeholder="Ex: 150000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                    required={formData.isPromo}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nouveau prix (promo) *
                  </label>
                  <input
                    type="text"
                    name="prixPromo"
                    value={formData.prixPromo}
                    onChange={handleInputChange}
                    placeholder="Ex: 120000"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                    required={formData.isPromo}
                  />
                </div>
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez le produit..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
                rows="3"
              ></textarea>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Images du produit (1-5 images)
              </label>
              <div className="flex-1">
                <input
                  type="file"
                  name="images"
                  onChange={handleInputChange}
                  accept="image/*"
                  multiple
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF (5 images max, pas de limite de taille)</p>
              </div>
              
              {/* Images existantes du produit */}
              {formData.existingImagePreviews && formData.existingImagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-blue-600">
                    Images existantes ({formData.existingImagePreviews.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.existingImagePreviews.map((preview, index) => (
                      <div
                        key={`existing-${index}`}
                        className="relative group rounded-lg overflow-hidden border-2 border-green-300 bg-green-50"
                      >
                        <img
                          src={preview}
                          alt={`Image existante ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Nouvelles images sélectionnées */}
              {formData.imagePreviews && formData.imagePreviews.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3 text-orange-600">
                    Nouvelles images ({formData.imagePreviews.length})
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {formData.imagePreviews.map((preview, index) => (
                      <div
                        key={`new-${index}`}
                        className="relative group rounded-lg overflow-hidden border-2 border-orange-300 bg-orange-50"
                      >
                        <img
                          src={preview}
                          alt={`Nouvelle image ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Message si aucune image */}
              {formData.existingImagePreviews.length === 0 && formData.imagePreviews.length === 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                  <p className="text-sm text-yellow-700">Aucune image sélectionnée. Veuillez en ajouter au moins une.</p>
                </div>
              )}
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
              >
                <FaCheck /> {editingId ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                <FaTimes /> Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recherche */}
      <div className="mb-6">
        <input
          type="text"
          placeholder=" Rechercher un produit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-medium"
        />
      </div>

      {/* Liste des produits */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <div className="text-4xl mb-3"> </div>
          <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border-l-4 border-blue-500"
            >
              {/* Image du produit */}
              {product.image ? (
                <div className="w-full h-48 overflow-hidden bg-gray-100">
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    alt={product.nom}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <span className="text-4xl opacity-50"> </span>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {product.nom}
                </h3>

                {product.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">PRIX</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {product.prix.toFixed(2)} DA
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs font-semibold">STOCK</p>
                      <p
                        className={`text-2xl font-bold ${
                          product.stock > 10 ? 'text-green-600' : 'text-orange-600'
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(product)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors"
                  >
                    <FaEdit /> Éditer
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.nom)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
                  >
                    <FaTrash /> Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
