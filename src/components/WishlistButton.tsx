import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface WishlistButtonProps {
  productId: number;
  isInWishlist: boolean;
  onToggle: (isAdded: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId, isInWishlist, onToggle }) => {
  const { user } = useAuth();

  const handleToggleWishlist = async () => {
    if (!user) return;

    try {
      // Get default wishlist
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', 'Default')
        .single();

      if (wishlistError) throw wishlistError;

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
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={`flex items-center gap-2 px-6 py-3 rounded font-semibold transition ${
        isInWishlist
          ? 'border border-secondary bg-secondary/10 text-secondary'
          : 'border border-gray-dark hover:border-secondary text-white'
      }`}
    >
      <Heart className={isInWishlist ? 'fill-secondary' : ''} />
      {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
    </button>
  );
};

export default WishlistButton;