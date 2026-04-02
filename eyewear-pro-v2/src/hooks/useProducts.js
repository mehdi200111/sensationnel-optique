import { useState, useEffect } from 'react';
import { productsApi } from '../services/pocketbaseService.js';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchProducts = async () => {
      try {
        if (cancelled) return;
        setLoading(true);
        setError(null);

        console.log('🔄 Récupération des produits avec filtres:', filters);
        
        const res = await productsApi.getShopList(filters);
        
        if (cancelled) return;

        if (res.success && res.data) {
          console.log('✅ Produits récupérés:', res.data.length, 'produits');
          setProducts(res.data);
        } else {
          console.log('⚠️ Aucun produit trouvé ou erreur:', res.error);
          setProducts([]);
        }
      } catch (err) {
        if (cancelled) return;
        console.error('❌ Erreur lors de la récupération des produits:', err);
        setError(err.message);
        setProducts([]);
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(filters)]);

  return { products, loading, error };
};
