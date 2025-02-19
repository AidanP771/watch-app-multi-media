import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Watch, ShoppingCart, Menu, X } from 'lucide-react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const cartCount = 0; // This will be managed by a cart context later

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-finesse-black text-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-finesse-black/95 backdrop-blur-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center space-x-2">
              <Watch className="w-8 h-8 text-finesse-gold" />
              <span className="font-playfair text-2xl font-bold">Finesse</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/collections" 
                className={`font-raleway transition-colors ${isActive('/collections') ? 'text-finesse-gold' : 'hover:text-finesse-gold'}`}
              >
                Collections
              </Link>
              <Link 
                to="/about" 
                className={`font-raleway transition-colors ${isActive('/about') ? 'text-finesse-gold' : 'hover:text-finesse-gold'}`}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className={`font-raleway transition-colors ${isActive('/contact') ? 'text-finesse-gold' : 'hover:text-finesse-gold'}`}
              >
                Contact
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingCart className={`w-6 h-6 transition-colors ${isActive('/cart') ? 'text-finesse-gold' : 'hover:text-finesse-gold'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-finesse-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-finesse-black/95 z-40 md:hidden pt-20">
          <div className="flex flex-col items-center space-y-8 p-8">
            <Link 
              to="/collections" 
              className={`font-raleway text-xl ${isActive('/collections') ? 'text-finesse-gold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Collections
            </Link>
            <Link 
              to="/about" 
              className={`font-raleway text-xl ${isActive('/about') ? 'text-finesse-gold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`font-raleway text-xl ${isActive('/contact') ? 'text-finesse-gold' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/cart" 
              className="relative"
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className={`w-6 h-6 ${isActive('/cart') ? 'text-finesse-gold' : ''}`} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-finesse-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-finesse-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Watch className="w-6 h-6 text-finesse-gold" />
                <span className="font-playfair text-xl font-bold">Finesse</span>
              </div>
              <p className="font-raleway text-finesse-gray-400">
                Crafting exceptional timepieces since 1895.
              </p>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 font-raleway text-finesse-gray-400">
                <Link to="/collections" className="block hover:text-white">Collections</Link>
                <Link to="/about" className="block hover:text-white">About Us</Link>
                <Link to="/contact" className="block hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-playfair text-lg font-semibold mb-4">Newsletter</h4>
              <p className="font-raleway text-finesse-gray-400 mb-4">
                Subscribe to receive updates about new collections and exclusive offers.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="bg-finesse-gray-800 px-4 py-2 flex-1 font-raleway text-sm focus:outline-none focus:ring-1 focus:ring-finesse-gold"
                />
                <button className="bg-finesse-gold text-finesse-black px-4 py-2 font-raleway text-sm hover:bg-finesse-gold/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-finesse-gray-800 mt-12 pt-8 text-center font-raleway text-finesse-gray-400">
            <p>&copy; 2025 Finesse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}