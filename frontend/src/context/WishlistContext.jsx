import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await api.get(`/wishlist`);
      setWishlist(res.data.map(item => item.product));
    } catch (err) {
      console.error("Failed to fetch wishlist", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = useCallback(async (product) => {
    if (!isAuthenticated) {
        window.location.assign('/auth');
        return;
    }
    
    const wasInWishlist = wishlist.some(p => p.id == product.id);
    
    // OPTIMISTIC UPDATE
    setWishlist(prev => {
        if (wasInWishlist) return prev.filter(p => p.id != product.id);
        return [...prev, product];
    });

    try {
      await api.post(`/wishlist/toggle/${product.id}`);
    } catch (err) {
      console.error("Failed to toggle wishlist", err);
      // REVERT on error
      setWishlist(prev => {
        if (wasInWishlist) return [...prev, product];
        return prev.filter(p => p.id != product.id);
      });
    }
  }, [isAuthenticated, wishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlist.some(p => p.id == productId);
  }, [wishlist]);

  const value = useMemo(() => ({
    wishlist, 
    toggleWishlist, 
    isInWishlist, 
    loading, 
    fetchWishlist
  }), [wishlist, toggleWishlist, isInWishlist, loading, fetchWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
