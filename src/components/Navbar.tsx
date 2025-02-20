import React, { useState } from 'react';
import { Search, ShoppingCart, User, Heart } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import SearchModal from './SearchModal';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-secondary' : 'text-white hover:text-secondary-light';
  };

  return (
    <>
      <nav className="bg-primary py-4 px-6 fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <Link to="/" className="text-secondary font-serif text-2xl">Finesse</Link>
            <div className="hidden md:flex space-x-8">
              <Link to="/" className={`${isActive('/')} transition`}>Home</Link>
              <Link to="/collections" className={`${isActive('/collections')} transition`}>Collections</Link>
              <Link to="/new-arrivals" className={`${isActive('/new-arrivals')} transition`}>New Arrivals</Link>
              <Link to="/limited-edition" className={`${isActive('/limited-edition')} transition`}>Limited Edition</Link>
              <Link to="/marketplace" className={`${isActive('/marketplace')} transition`}>Marketplace</Link>
              <Link to="/inquiry" className={`${isActive('/inquiry')} transition`}>Contact Us</Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="text-white hover:text-secondary-light transition p-2 rounded-full hover:bg-primary-light"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <Link
              to={user ? "/profile" : "/login"}
              className="text-white hover:text-secondary-light transition p-2 rounded-full hover:bg-primary-light"
              aria-label="Account"
            >
              <User className="w-5 h-5" />
            </Link>
            {user && (
              <Link
                to="/wishlist"
                className="relative text-white hover:text-secondary-light transition p-2 rounded-full hover:bg-primary-light"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-secondary text-primary w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => navigate('/cart')}
              className="relative text-white hover:text-secondary-light transition p-2 rounded-full hover:bg-primary-light"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;