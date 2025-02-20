import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface WishlistContextType {
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wishlistId, setWishlistId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
      setWishlistId(null);
    }
  }, [user]);

  useEffect(() => {
    if (!user || !wishlistId) return;

    // Subscribe to wishlist changes
    const subscription = supabase
      .channel('wishlist_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlist_items',
          filter: `wishlist_id=eq.${wishlistId}`
        },
        () => {
          fetchWishlistItems();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, wishlistId]);

  const getOrCreateDefaultWishlist = async () => {
    try {
      // Call the stored function to get or create the default wishlist
      const { data: result, error: functionError } = await supabase
        .rpc('get_or_create_default_wishlist', {
          p_user_id: user!.id
        });

      if (functionError) throw functionError;
      return result;
    } catch (err) {
      console.error('Error getting/creating default wishlist:', err);
      throw err;
    }
  };

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get or create default wishlist
      const defaultWishlistId = await getOrCreateDefaultWishlist();
      setWishlistId(defaultWishlistId);

      // Fetch wishlist items
      const { data: items, error: itemsError } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('wishlist_id', defaultWishlistId);

      if (itemsError) throw itemsError;

      setWishlistItems(items?.map(item => item.product_id) || []);
    } catch (err) {
      console.error('Error fetching wishlist items:', err);
      setError('Failed to load wishlist items');
    } finally {
      setIsLoading(false);
    }
  };

  const addToWishlist = async (productId: number) => {
    if (!user || !wishlistId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if item already exists
      const { data: existingItem } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlistId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingItem) {
        // Item already in wishlist
        return;
      }

      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlistId,
          product_id: productId
        });

      if (error) throw error;
      
      // Update local state
      setWishlistItems(prev => [...prev, productId]);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user || !wishlistId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlistId)
        .eq('product_id', productId);

      if (error) throw error;

      // Update local state
      setWishlistItems(prev => prev.filter(id => id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      setError('Failed to remove item from wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount: wishlistItems.length,
        isInWishlist: (productId: number) => wishlistItems.includes(productId),
        addToWishlist,
        removeFromWishlist,
        isLoading,
        error
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};