import React from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';

interface WishlistButtonProps {
  productId: number;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({ productId }) => {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  const navigate = useNavigate();

  const handleToggleWishlist = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist(productId)) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (err) {
      console.error('Error toggling wishlist:', err);
    }
  };

  return (
    <button
      onClick={handleToggleWishlist}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 rounded font-semibold transition ${
        isInWishlist(productId)
          ? 'border border-secondary bg-secondary/10 text-secondary'
          : 'border border-gray-dark hover:border-secondary text-white'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart className={isInWishlist(productId) ? 'fill-secondary' : ''} />
      )}
      {isInWishlist(productId) ? 'In Wishlist' : 'Add to Wishlist'}
    </button>
  );
};

export default WishlistButton;