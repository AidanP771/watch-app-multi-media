import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';
import SuccessModal from './SuccessModal';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setEmail('');
  };

  return (
    <>
      <footer className="bg-primary-light mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="text-white font-serif text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/collections" className="text-gray-light hover:text-secondary transition">
                    Collections
                  </Link>
                </li>
                <li>
                  <Link to="/new-arrivals" className="text-gray-light hover:text-secondary transition">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link to="/limited-edition" className="text-gray-light hover:text-secondary transition">
                    Limited Edition
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-light hover:text-secondary transition">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-white font-serif text-lg mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-light">
                <li>Toronto, ON, L6R 0A0</li>
                <li>Tel: (555) 123-4567</li>
                <li>Email: contact@finesse.com</li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-white font-serif text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-light hover:text-secondary transition"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-light hover:text-secondary transition"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-6 h-6" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-light hover:text-secondary transition"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className="text-white font-serif text-lg mb-4">Newsletter</h3>
              <p className="text-gray-light mb-4">Subscribe to receive updates about new collections and exclusive offers.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-primary text-white border border-gray-dark rounded-l focus:outline-none focus:border-secondary"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary-light text-primary px-4 py-2 rounded-r transition flex items-center"
                    aria-label="Subscribe to newsletter"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-dark text-center text-gray-light">
            <p>&copy; {new Date().getFullYear()} Finesse. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Thank you for subscribing to our newsletter!"
      />
    </>
  );
};

export default Footer;