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

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Get or create default wishlist
      const { data: wishlistId, error: wishlistError } = await supabase
        .rpc('get_or_create_default_wishlist', {
          p_user_id: user.id
        });

      if (wishlistError) throw wishlistError;

      // Fetch wishlist items
      const { data: items, error: itemsError } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('wishlist_id', wishlistId);

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
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get or create default wishlist
      const { data: wishlistId, error: wishlistError } = await supabase
        .rpc('get_or_create_default_wishlist', {
          p_user_id: user.id
        });

      if (wishlistError) throw wishlistError;

      // Check if item already exists
      const { data: existingItems, error: checkError } = await supabase
        .from('wishlist_items')
        .select('id')
        .eq('wishlist_id', wishlistId)
        .eq('product_id', productId);

      if (checkError) throw checkError;

      // Only add if item doesn't exist
      if (!existingItems?.length) {
        const { error: insertError } = await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: wishlistId,
            product_id: productId
          });

        if (insertError) throw insertError;
        
        // Update local state
        setWishlistItems(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
      setError('Failed to add item to wishlist');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get default wishlist
      const { data: wishlistId, error: wishlistError } = await supabase
        .rpc('get_or_create_default_wishlist', {
          p_user_id: user.id
        });

      if (wishlistError) throw wishlistError;

      const { error: deleteError } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlistId)
        .eq('product_id', productId);

      if (deleteError) throw deleteError;

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