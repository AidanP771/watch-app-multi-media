import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Share2, Check } from 'lucide-react';
import { collections } from '../data/collections';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SharePopup from '../components/SharePopup';
import WishlistButton from '../components/WishlistButton';

const ShopPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { items, addToCart } = useCart();
  
  // Check if item is already in cart
  const isInCart = items.some(item => item.id.toString() === id);

  // Find the watch in all collections
  const watch = collections
    .flatMap(collection => collection.watches)
    .find(watch => watch.id.toString() === id);

  useEffect(() => {
    if (user && watch) {
      checkWishlistStatus();
    }
  }, [user, watch]);

  const checkWishlistStatus = async () => {
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
          .select('id')
          .eq('wishlist_id', wishlist.id)
          .eq('product_id', watch!.id)
          .single();

        setIsInWishlist(!!items);
      }
    } catch (err) {
      console.error('Error checking wishlist status:', err);
    }
  };

  if (!watch) {
    return (
      <div className="pt-24 px-6 min-h-screen bg-primary">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-serif text-secondary">Product Not Found</h1>
          <button
            onClick={() => navigate('/new-arrivals')}
            className="mt-8 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded transition"
          >
            Return to New Arrivals
          </button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const handleAddToCart = () => {
    if (isInCart) {
      navigate('/cart');
    } else {
      addToCart({
        id: watch.id,
        name: watch.name,
        price: watch.price,
        quantity: quantity,
        image: watch.image
      });
    }
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={watch.image}
              alt={watch.name}
              className="w-full h-[600px] object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-secondary px-3 py-1 text-primary text-sm font-semibold rounded">
                New Arrival
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <h1 className="text-4xl font-serif text-white">{watch.name}</h1>
            <p className="text-3xl text-secondary">${watch.price.toLocaleString()}</p>
            
            <div className="border-t border-gray-dark pt-6">
              <p className="text-gray-light">{watch.description}</p>
            </div>

            {!isInCart && (
              <div className="border-t border-gray-dark pt-6">
                <label htmlFor="quantity" className="block text-white mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-24 px-3 py-2 bg-primary-light text-white border border-gray-dark rounded focus:border-secondary outline-none"
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="border-t border-gray-dark pt-6 space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
              >
                {isInCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Go to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="flex gap-4">
                <WishlistButton
                  productId={watch.id}
                  isInWishlist={isInWishlist}
                  onToggle={setIsInWishlist}
                />
                <button 
                  onClick={() => setShowShareMenu(true)}
                  className="flex-1 border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            <div className="border-t border-gray-dark pt-6">
              <h3 className="text-xl font-serif text-white mb-4">Product Details</h3>
              <ul className="space-y-2 text-gray-light">
                <li>• Swiss-made automatic movement</li>
                <li>• Sapphire crystal with anti-reflective coating</li>
                <li>• Water resistant to 100 meters</li>
                <li>• 5-year international warranty</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <SharePopup
        isOpen={showShareMenu}
        onClose={() => setShowShareMenu(false)}
        title={`Check out the ${watch.name} at Finesse Luxury Timepieces!`}
        url={window.location.href}
      />
    </div>
  );
};

export default ShopPage;