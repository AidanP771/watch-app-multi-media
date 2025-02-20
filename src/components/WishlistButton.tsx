import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: number;
  isInWishlist: boolean;
  onToggle: (isAdded: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, isInWishlist, onToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getOrCreateDefaultWishlist = async () => {
    try {
      // Try to get existing default wishlist
      const { data: existingWishlist, error: fetchError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user!.id)
        .eq('name', 'Default')
        .maybeSingle();

      if (existingWishlist) {
        return existingWishlist;
      }

      // If no wishlist exists, create one
      const { data: newWishlist, error: createError } = await supabase
        .from('wishlists')
        .insert({
          user_id: user!.id,
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

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);
    try {
      const wishlist = await getOrCreateDefaultWishlist();
      if (!wishlist) return;

      if (isInWishlist) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('wishlist_id', wishlist.id)
          .eq('product_id', productId);

        if (error) throw error;
        onToggle(false);
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            wishlist_id: wishlist.id,
            product_id: productId
          });

        if (error) throw error;
        onToggle(true);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded font-semibold transition ${
        isInWishlist
          ? 'border border-secondary bg-secondary/10 text-secondary'
          : 'border border-gray-dark hover:border-secondary text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart className={isInWishlist ? 'fill-secondary' : ''} />
      )}
      {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </button>
  );
};

export default WishlistButton;