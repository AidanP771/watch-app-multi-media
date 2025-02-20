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

  const getOrCreateDefaultWishlist = async () => {
    if (!user) return null;

    try {
      // Try to get existing default wishlist
      const { data: existingWishlist, error: fetchError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'Default')
        .maybeSingle();

      if (existingWishlist) {
        return existingWishlist;
      }

      // If no wishlist exists, create one
      const { data: newWishlist, error: createError } = await supabase
        .from('wishlists')
        .insert({
          user_id: user.id,
          name: 'Default',
          is_public: false
        })
        .select('id')
        .single();

      if (createError) throw createError;
      return newWishlist;
    } catch (err) {
      console.error('Error getting/creating wishlist:', err);
      return null;
    }
  };

  const fetchWishlistItems = async () => {
    try {
      const wishlist = await getOrCreateDefaultWishlist();
      if (!wishlist) return;

      const { data: items } = await supabase
        .from('wishlist_items')
        .select('product_id')
        .eq('wishlist_id', wishlist.id);

      setWishlistItems(items?.map(item => item.product_id) || []);
    } catch (err) {
      console.error('Error fetching wishlist items:', err);
    }
  };

  const addToWishlist = async (productId: number) => {
    if (!user) return;

    try {
      const wishlist = await getOrCreateDefaultWishlist();
      if (!wishlist) return;

      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          wishlist_id: wishlist.id,
          product_id: productId
        });

      if (error) throw error;
      setWishlistItems(prev => [...prev, productId]);
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  };

  const removeFromWishlist = async (productId: number) => {
    if (!user) return;

    try {
      const wishlist = await getOrCreateDefaultWishlist();
      if (!wishlist) return;

      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('wishlist_id', wishlist.id)
        .eq('product_id', productId);

      if (error) throw error;
      setWishlistItems(prev => prev.filter(id => id !== productId));
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