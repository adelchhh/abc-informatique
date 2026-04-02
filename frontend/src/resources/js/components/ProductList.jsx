import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const ProductList = ({ onSelectProduct }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'Tous les produits', icon: ' ', image: null },
    { id: 'laptop', label: 'Ordinateurs Portables', icon: ' ', image: '/images/ordinateur.jpg' },
    { id: 'unité', label: 'Accessoires & Unités', icon: ' ', image: '/images/unité.jpg' },
    { id: 'imprimante', label: 'Imprimantes', icon: ' ', image: '/images/imprimante.jpg' },
    { id: 'modem', label: 'Modems & Routeurs', icon: ' ', image: '/images/modem.jpg' },
    { id: 'autre', label: 'Autre', icon: ' ', image: '/images/autre.jpg' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nom.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesPrice = true;
    if (priceFilter === 'low') matchesPrice = product.prix < 50000;
    else if (priceFilter === 'medium') matchesPrice = product.prix >= 50000 && product.prix < 100000;
    else if (priceFilter === 'high') matchesPrice = product.prix >= 100000;

    let matchesCategory = true;
    if (categoryFilter !== 'all') matchesCategory = product.category === categoryFilter;

    return matchesSearch && matchesPrice && matchesCategory;
  });

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

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 text-red-700">
        <div className="flex items-start gap-3">
          <span className="text-xl">!</span>
          <div>
            <p className="font-semibold">Erreur de chargement</p>
            <p className="text-sm mt-1">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-3 px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-semibold transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"> </span>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Price Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setPriceFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              priceFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Tous les prix
          </button>
          <button
            onClick={() => setPriceFilter('low')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              priceFilter === 'low'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Moins de 50000 DA
          </button>
          <button
            onClick={() => setPriceFilter('medium')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              priceFilter === 'medium'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            50000 - 100000 DA
          </button>
          <button
            onClick={() => setPriceFilter('high')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              priceFilter === 'high'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Plus de 100000 DA
          </button>
        </div>
      </div>

      {/* Category Filters - Premium Design */}
      <div className="mb-12 space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Catégories</h2>
          <p className="text-sm text-gray-600">Sélectionnez une catégorie</p>
        </div>
        
        <style>{`
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .category-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 16px;
            animation: slideInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          }

          @media (min-width: 640px) {
            .category-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }

          @media (min-width: 1024px) {
            .category-grid {
              grid-template-columns: repeat(6, 1fr);
            }
          }

          .category-card {
            position: relative;
            height: auto;
            border-radius: 16px;
            overflow: hidden;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
            transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
            border: 2px solid transparent;
            display: flex;
            flex-direction: column;
            background: white;
          }

          .category-image-wrapper {
            position: relative;
            width: 100%;
            padding-bottom: 100%;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            overflow: hidden;
            height: 0;
          }

          .category-image-inner {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .category-content {
            padding: 12px;
            text-align: center;
            background: white;
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .category-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          }

          .category-card.active {
            border-color: #7c3aed;
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
            box-shadow: 0 15px 40px rgba(124, 58, 237, 0.3);
          }

          .category-card.active .category-label,
          .category-card.active .category-icon {
            color: white;
          }

          .category-icon {
            position: relative;
            z-index: 2;
            font-size: 32px;
            margin-bottom: 0;
            transition: all 0.3s ease;
          }

          .category-label {
            position: relative;
            z-index: 2;
            font-size: 13px;
            font-weight: 700;
            text-align: center;
            color: #374151;
            line-height: 1.4;
            transition: all 0.3s ease;
            padding: 0 4px;
          }

          .category-card:hover .category-icon {
            transform: scale(1.2) rotate(5deg);
          }

          .category-card:hover .category-label {
            color: #7c3aed;
          }

          .category-card.active .category-image-wrapper {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          }

          .category-card.active .category-content {
            background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          }

          .category-card.active .category-label,
          .category-card.active .category-icon {
            color: white;
          }
        `}</style>

        <div className="category-grid">
          {categories.map(({ id, label, icon, image }) => (
            <button
              key={id}
              onClick={() => setCategoryFilter(id)}
              className={`category-card ${categoryFilter === id ? 'active' : ''}`}
            >
              {/* Image Section */}
              <div className="category-image-wrapper">
                <div 
                  className="category-image-inner"
                  style={image ? { backgroundImage: `url(${image})` } : {}}
                >
                  {image && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  )}
                  <div className="category-icon">{icon}</div>
                </div>
              </div>

              {/* Text Section */}
              <div className="category-content">
                <div className="category-label">{label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-3xl mb-2"> </p>
          <p className="text-gray-600 font-medium">Aucun produit ne correspond à votre recherche.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setPriceFilter('all');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4 font-medium">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}</p>
          
          {/* Premium Full Image Product Grid */}
          <style>{`
            @keyframes fadeInUp {
              from {
                opacity: 0;
                transform: translateY(24px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            @keyframes fadeInText {
              from {
                opacity: 0;
                transform: translateY(16px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            
            .product-card-full {
              animation: fadeInUp 0.6s ease-out forwards;
              opacity: 0;
              position: relative;
              height: 420px;
              border-radius: 16px;
              overflow: hidden;
              cursor: pointer;
              group: 'card';
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            
            .product-card-full:hover {
              transform: translateY(-16px);
              box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
            }
            
            .product-image-full {
              position: absolute;
              inset: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .product-card-full:hover .product-image-full {
              transform: scale(1.06);
            }
            
            /* Gradient Overlay */
            .overlay-gradient {
              position: absolute;
              inset: 0;
              background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.1) 0%,
                rgba(0, 0, 0, 0.3) 40%,
                rgba(0, 0, 0, 0.7) 85%,
                rgba(0, 0, 0, 0.95) 100%
              );
              transition: opacity 0.3s ease;
              z-index: 1;
            }
            
            .product-card-full:hover .overlay-gradient {
              background: linear-gradient(
                180deg,
                rgba(0, 0, 0, 0.15) 0%,
                rgba(0, 0, 0, 0.4) 40%,
                rgba(0, 0, 0, 0.8) 85%,
                rgba(0, 0, 0, 0.98) 100%
              );
            }
            
            /* Stock Badge */
            .stock-badge-full {
              position: absolute;
              top: 16px;
              right: 16px;
              z-index: 10;
              background: rgba(16, 185, 129, 0.95);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              padding: 10px 16px;
              border-radius: 24px;
              font-size: 12px;
              font-weight: 700;
              letter-spacing: 0.4px;
              color: white;
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
              border: 1px solid rgba(255, 255, 255, 0.2);
              text-transform: uppercase;
              display: flex;
              align-items: center;
              gap: 6px;
            }
            
            .stock-badge-full.out-stock {
              background: rgba(239, 68, 68, 0.95);
              box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
            }
            
            .product-card-full:hover .stock-badge-full {
              transform: translateY(-8px) scale(1.05);
            }
            
            /* Content Container */
            .product-content-overlay {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 2;
              padding: 32px 24px 24px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              height: 100%;
            }
            
            .product-title-full {
              font-size: 22px;
              font-weight: 700;
              color: #ffffff;
              letter-spacing: -0.4px;
              line-height: 1.3;
              margin-bottom: 12px;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              transition: all 0.3s ease;
              animation: fadeInText 0.6s ease-out 0.2s forwards;
              animation-fill-mode: both;
            }
            
            .product-card-full:hover .product-title-full {
              text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
              transform: translateY(-4px);
            }
            
            .product-price-full {
              display: flex;
              align-items: baseline;
              gap: 6px;
              margin-bottom: 20px;
              animation: fadeInText 0.6s ease-out 0.3s forwards;
              animation-fill-mode: both;
            }
            
            .price-value-full {
              font-size: 24px;
              font-weight: 800;
              color: #ffffff;
              letter-spacing: -0.5px;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              transition: transform 0.3s ease;
            }
            
            .product-card-full:hover .price-value-full {
              transform: scale(1.08);
              text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
            }
            
            .price-currency-full {
              font-size: 18px;
              color: rgba(255, 255, 255, 0.9);
              font-weight: 600;
              text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            }
            
            /* CTA Button Premium */
            .cta-button-premium {
              position: relative;
              overflow: hidden;
              background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
              border: none;
              border-radius: 12px;
              padding: 14px 28px;
              font-size: 15px;
              font-weight: 700;
              color: white;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
              letter-spacing: 0.3px;
              width: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              text-transform: uppercase;
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
              animation: fadeInText 0.6s ease-out 0.4s forwards;
              animation-fill-mode: both;
            }
            
            .cta-button-premium::before {
              content: '';
              position: absolute;
              inset: 0;
              background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
              opacity: 0;
              transition: opacity 0.3s ease;
              border-radius: 12px;
              z-index: -1;
            }
            
            .cta-button-premium:hover:not(:disabled) {
              transform: translateY(-4px) scale(1.05);
              box-shadow: 0 12px 32px rgba(124, 58, 237, 0.6);
              background: linear-gradient(135deg, #a855f7 0%, #d946ef 100%);
            }
            
            .cta-button-premium:hover:not(:disabled)::before {
              opacity: 1;
            }
            
            .cta-button-premium:active:not(:disabled) {
              transform: translateY(-2px) scale(0.97);
              box-shadow: 0 4px 12px rgba(124, 58, 237, 0.4);
            }
            
            .cta-button-premium:disabled {
              background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
              color: rgba(255, 255, 255, 0.7);
              cursor: not-allowed;
              box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
            }
            
            .cta-button-premium span {
              transition: transform 0.3s ease;
            }
            
            .cta-button-premium:hover:not(:disabled) span:first-child {
              transform: scale(1.2) rotate(20deg);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
              .product-card-full {
                height: 380px;
              }
              
              .product-title-full {
                font-size: 18px;
              }
              
              .price-value-full {
                font-size: 28px;
              }
            }
          `}</style>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="product-card-full"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                {/* Background Image */}
                {product.images && Array.isArray(product.images) && product.images.length > 0 ? (
                  <img
                    src={`http://localhost:8000/storage/${product.images[0]}`}
                    alt={product.nom}
                    className="product-image-full"
                  />
                ) : product.image ? (
                  <img
                    src={`http://localhost:8000/storage/${product.image}`}
                    alt={product.nom}
                    className="product-image-full"
                  />
                ) : (
                  <div className="product-image-full bg-gradient-to-br from-purple-300 via-pink-300 to-indigo-400 flex items-center justify-center text-7xl">
                     
                  </div>
                )}
                
                {/* Gradient Overlay */}
                <div className="overlay-gradient"></div>

                {/* PROMO Badge */}
                {product.is_promo && (
                  <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                    PROMO
                  </div>
                )}

                {/* Content Overlay */}
                <div className="product-content-overlay">
                  {/* Title */}
                  <h3 className="product-title-full">
                    {product.nom}
                  </h3>

                  {/* Price */}
                  <div className="product-price-full">
                    {product.is_promo ? (
                      <>
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-200 line-through">
                            {product.prix_original?.toFixed(2)} DA
                          </span>
                          <div className="flex items-baseline gap-1">
                            <span className="price-value-full">
                              {product.prix_promo?.toFixed(2)}
                            </span>
                            <span className="price-currency-full">DA</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="price-value-full">
                          {product.prix.toFixed(2)}
                        </span>
                        <span className="price-currency-full">DA</span>
                      </>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="cta-button-premium"
                  >
                    <span>Commander</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;
