import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface WishlistContextType {
  wishlistCount: number;
  isInWishlist: (productId: number) => boolean;
  addToWishlist: (productId: number) => Promise<void>;
  removeFromWishlist: (productId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    try {
      const { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user!.id)
        .eq('name', 'Default')
        .single();

      if (wishlist) {
        const { data: items } = await supabase
          .from('wishlist_items')
          .select('product_id')
          .eq('wishlist_id', wishlist.id);

        setWishlistItems(items?.map(item => item.product_id) || []);
      }
    } catch (err) {
      console.error('Error fetching wishlist items:', err);
    }
  };

  const addToWishlist = async (productId: number) => {
    if (!user) return;

    try {
      const { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'Default')
        .single();

      if (wishlist) {
        await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: wishlist.id,
            product_id: productId
          });

        setWishlistItems(prev => [...prev, productId]);
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;

    try {
      const { data: wishlist } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'Default')
        .single();

      if (wishlist) {
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('wishlist_id', wishlist.id)
          .eq('product_id', productId);

        setWishlistItems(prev => prev.filter(id => id !== productId));
      }
    } catch (err) {
      console.error('Error removing from wishlist:', err);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistCount: wishlistItems.length,
        isInWishlist: (productId: number) => wishlistItems.includes(productId),
        addToWishlist,
        removeFromWishlist,
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