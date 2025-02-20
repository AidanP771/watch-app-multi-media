import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Trash2, AlertCircle, Search, ArrowUpDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import SharePopup from './SharePopup';

interface WishlistItem {
  id: string;
  product_id: number;
  notes: string | null;
  created_at: string;
}

interface Wishlist {
  id: string;
  name: string;
  is_public: boolean;
  items: WishlistItem[];
}

const WishlistPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showShareMenu, setShowShareMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      // First, get or create default wishlist
      let { data: wishlists, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user!.id)
        .eq('name', 'Default')
        .single();

      if (wishlistError && wishlistError.code === 'PGRST116') {
        // Create default wishlist if it doesn't exist
        const { data: newWishlist, error: createError } = await supabase
          .from('wishlists')
          .insert({
            user_id: user!.id,
            name: 'Default',
            is_public: false
          })
          .select()
          .single();

        if (createError) throw createError;
        wishlists = newWishlist;
      } else if (wishlistError) {
        throw wishlistError;
      }

      // Then get wishlist items
      const { data: items, error: itemsError } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('wishlist_id', wishlists.id);

      if (itemsError) throw itemsError;

      setWishlist({
        ...wishlists,
        items: items || []
      });
    } catch (err) {
      console.error('Error fetching wishlist:', err);
      setError('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setWishlist(prev => prev ? {
        ...prev,
        items: prev.items.filter(item => item.id !== itemId)
      } : null);
    } catch (err) {
      console.error('Error removing item from wishlist:', err);
    }
  };

  const toggleWishlistPrivacy = async () => {
    if (!wishlist) return;

    try {
      const { error } = await supabase
        .from('wishlists')
        .update({ is_public: !wishlist.is_public })
        .eq('id', wishlist.id);

      if (error) throw error;

      setWishlist(prev => prev ? {
        ...prev,
        is_public: !prev.is_public
      } : null);
    } catch (err) {
      console.error('Error updating wishlist privacy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-white">My Wishlist</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleWishlistPrivacy}
            className={`text-sm px-3 py-1 rounded-full transition ${
              wishlist?.is_public
                ? 'bg-secondary/20 text-secondary'
                : 'bg-gray-dark text-gray-light'
            }`}
          >
            {wishlist?.is_public ? 'Public' : 'Private'}
          </button>
          <button
            onClick={() => setShowShareMenu(true)}
            className="text-gray-light hover:text-white transition"
            aria-label="Share wishlist"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search and Sort */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search wishlist..."
            className="w-full pl-10 pr-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'price')}
            className="flex-1 px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
          >
            <option value="date">Sort by Date Added</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <button
            onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="px-3 py-2 bg-primary text-white border border-gray-dark rounded hover:border-secondary transition"
          >
            <ArrowUpDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlist?.items.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-12 h-12 mx-auto mb-4 text-gray-light" />
          <p className="text-gray-light">Your wishlist is empty</p>
          <button
            onClick={() => navigate('/collections')}
            className="mt-4 bg-secondary hover:bg-secondary-light text-primary px-6 py-2 rounded transition"
          >
            Browse Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist?.items.map((item) => {
            const product = collections
              .flatMap(collection => collection.watches)
              .find(watch => watch.id === item.product_id);

            if (!product) return null;

            return (
              <div key={item.id} className="bg-primary rounded-lg overflow-hidden group">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-red-500 rounded-full flex items-center justify-center transition"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-serif text-white">{product.name}</h3>
                  <p className="text-secondary mt-1">${product.price.toLocaleString()}</p>
                  <button
                    onClick={() => navigate(`/shop/${product.id}`)}
                    className="mt-4 w-full bg-secondary hover:bg-secondary-light text-primary px-4 py-2 rounded transition"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Popup */}
      <SharePopup
        isOpen={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        title="Check out my wishlist on Finesse!"
        url={`${window.location.origin}/wishlist/${wishlist?.id}`}
      />
    </div>
  );
};

export default WishlistPage;