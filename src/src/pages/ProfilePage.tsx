import React from 'react';
import { User, Settings, ShoppingBag, Heart, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  // Simulating authentication check
  const isAuthenticated = false; // This would normally come from your auth context/state

  if (!isAuthenticated) {
    return (
      <div className="pt-24 px-6 min-h-screen bg-primary">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary-light rounded-lg p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-secondary" />
            </div>
            <h1 className="text-3xl font-serif text-white mb-4">Welcome to Finesse</h1>
            <p className="text-gray-light mb-8">Please log in or create an account to access your profile</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-secondary hover:bg-secondary-light text-primary px-8 py-3 rounded font-semibold transition"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="border border-secondary hover:bg-secondary/10 text-secondary px-8 py-3 rounded font-semibold transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary-light rounded-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
              <User className="w-10 h-10 text-secondary" />
            </div>
            <div>
              <h1 className="text-3xl font-serif text-white">My Profile</h1>
              <p className="text-gray-light">Manage your account settings and preferences</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="p-6 bg-primary rounded-lg hover:bg-primary-light transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition">
                  <Settings className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Account Settings</h3>
                  <p className="text-gray-light text-sm">Update your personal information</p>
                </div>
              </div>
            </button>

            <button className="p-6 bg-primary rounded-lg hover:bg-primary-light transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition">
                  <ShoppingBag className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Order History</h3>
                  <p className="text-gray-light text-sm">View your past purchases</p>
                </div>
              </div>
            </button>

            <button className="p-6 bg-primary rounded-lg hover:bg-primary-light transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition">
                  <Heart className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Wishlist</h3>
                  <p className="text-gray-light text-sm">Manage your saved items</p>
                </div>
              </div>
            </button>

            <button className="p-6 bg-primary rounded-lg hover:bg-primary-light transition group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition">
                  <LogOut className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <h3 className="text-white font-semibold">Sign Out</h3>
                  <p className="text-gray-light text-sm">Log out of your account</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage