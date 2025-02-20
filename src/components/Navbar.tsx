import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-secondary' : 'text-white hover:text-secondary-light';
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/collections', label: 'Collections' },
    { path: '/new-arrivals', label: 'New Arrivals' },
    { path: '/limited-edition', label: 'Limited Edition' },
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/inquiry', label: 'Contact Us' },
  ];

  const handleMobileAction = (action: () => void) => {
    action();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-primary py-4 px-6 fixed w-full z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link to="/" className="text-secondary font-serif text-2xl mr-12">Finesse</Link>
            <div className="hidden md:flex space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${isActive(link.path)} transition`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop Action Icons */}
          <div className="hidden md:flex items-center space-x-6">
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-secondary-light transition p-2 rounded-full hover:bg-primary-light"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 top-[72px] bg-primary transform transition-transform duration-300 ease-in-out md:hidden ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full overflow-y-auto">
            {/* Mobile Action Buttons */}
            <div className="flex items-center justify-around p-6 border-b border-gray-dark">
              <button
                onClick={() => handleMobileAction(() => setIsSearchOpen(true))}
                className="flex flex-col items-center gap-2 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                  <Search className="w-6 h-6" />
                </div>
                <span className="text-sm">Search</span>
              </button>
              <button
                onClick={() => handleMobileAction(() => navigate(user ? '/profile' : '/login'))}
                className="flex flex-col items-center gap-2 text-white"
              >
                <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <span className="text-sm">Account</span>
              </button>
              {user && (
                <button
                  onClick={() => handleMobileAction(() => navigate('/wishlist'))}
                  className="flex flex-col items-center gap-2 text-white"
                >
                  <div className="relative w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                    <Heart className="w-6 h-6" />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-primary w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <span className="text-sm">Wishlist</span>
                </button>
              )}
              <button
                onClick={() => handleMobileAction(() => navigate('/cart'))}
                className="flex flex-col items-center gap-2 text-white"
              >
                <div className="relative w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-secondary text-primary w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span className="text-sm">Cart</span>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <div className="p-6 space-y-4">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block text-lg ${isActive(link.path)} py-2 transition`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};

export default Navbar;