import React, { useState, useEffect } from 'react';
import { User, Settings, ShoppingBag, Heart, LogOut, Camera, AlertCircle, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface Profile {
  name: string;
  avatar_url: string | null;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, signOut, updateProfile } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('name, avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditName(data?.name || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateProfile({ name: editName });
      setProfile(prev => ({ ...prev!, name: editName }));
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
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
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg flex items-center gap-2 text-green-500">
            <Check className="w-5 h-5" />
            <p>{success}</p>
          </div>
        )}

        <div className="bg-primary-light rounded-lg p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-secondary" />
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary-light transition"
                aria-label="Change profile picture"
              >
                <Camera className="w-4 h-4 text-primary" />
              </button>
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                    placeholder="Enter your name"
                  />
                  <div className="flex gap-4">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isLoading}
                      className="bg-secondary hover:bg-secondary-light text-primary px-4 py-2 rounded font-semibold transition disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditName(profile?.name || '');
                      }}
                      className="border border-gray-dark hover:border-secondary text-white px-4 py-2 rounded font-semibold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl font-serif text-white">{profile?.name || 'Your Profile'}</h1>
                  <p className="text-gray-light">{user.email}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-2 text-secondary hover:text-secondary-light transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
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

            <button
              onClick={handleSignOut}
              className="p-6 bg-primary rounded-lg hover:bg-primary-light transition group"
            >
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

export default ProfilePage;