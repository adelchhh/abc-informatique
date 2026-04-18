import { useState, useEffect } from 'react';

/**
 * Custom hook pour récupérer les produits avec conversion des prix en nombres
 * Cela évite les erreurs .toFixed() sur les strings
 */
export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('https://abcinformatique.org/api/products', {
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
      
      // 🔧 CONVERSION DES PRIX EN NOMBRES - FAIT UNE SEULE FOIS ICI
      const productsWithNumberPrices = (data.data || []).map(product => ({
        ...product,
        prix: Number(product.prix) || 0,
        prix_original: Number(product.prix_original) || 0,
        prix_promo: Number(product.prix_promo) || 0,
      }));

      setProducts(productsWithNumberPrices);
    } catch (err) {
      setError(err.message);
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, error, fetchProducts };
};
