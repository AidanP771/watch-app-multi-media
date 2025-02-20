import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface WatchListing {
  id: string;
  brand: string;
  model: string;
  reference_number: string;
  year: number;
  condition_rating: number;
  price: number;
  location: string;
  images: string[];
  views: number;
  created_at: string;
}

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings, setListings] = useState<WatchListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    brand: '',
    minCondition: '',
    location: ''
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price_high' | 'price_low' | 'views'>('newest');

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('watch_listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateListing = () => {
    if (!user) {
      setShowAuthAlert(true);
      setTimeout(() => {
        setShowAuthAlert(false);
        navigate('/login', { state: { from: '/marketplace/create' } });
      }, 2000);
      return;
    }
    navigate('/marketplace/create');
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.reference_number.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice = 
      (!filters.minPrice || listing.price >= parseInt(filters.minPrice)) &&
      (!filters.maxPrice || listing.price <= parseInt(filters.maxPrice));

    const matchesBrand = !filters.brand || listing.brand.toLowerCase() === filters.brand.toLowerCase();
    
    const matchesCondition = !filters.minCondition || listing.condition_rating >= parseInt(filters.minCondition);
    
    const matchesLocation = !filters.location || listing.location.toLowerCase().includes(filters.location.toLowerCase());

    return matchesSearch && matchesPrice && matchesBrand && matchesCondition && matchesLocation;
  });

  const sortedListings = [...filteredListings].sort((a, b) => {
    switch (sortBy) {
      case 'price_high':
        return b.price - a.price;
      case 'price_low':
        return a.price - b.price;
      case 'views':
        return b.views - a.views;
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif text-secondary">Watch Marketplace</h1>
          <button
            onClick={handleCreateListing}
            className="bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create Listing
          </button>
        </div>

        {/* Auth Alert */}
        {showAuthAlert && (
          <div className="fixed top-20 right-6 bg-primary-light border border-secondary rounded-lg p-4 shadow-lg animate-fade-in z-50">
            <div className="flex items-center gap-2 text-secondary">
              <AlertCircle className="w-5 h-5" />
              <p>Please sign in to create a listing</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-2 bg-primary-light text-white border border-gray-dark rounded focus:border-secondary outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-light" />
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              placeholder="Min Price"
              className="w-full px-4 py-2 bg-primary-light text-white border border-gray-dark rounded focus:border-secondary outline-none"
            />
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              placeholder="Max Price"
              className="w-full px-4 py-2 bg-primary-light text-white border border-gray-dark rounded focus:border-secondary outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-4 py-2 bg-primary-light text-white border border-gray-dark rounded focus:border-secondary outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="price_high">Price: High to Low</option>
            <option value="price_low">Price: Low to High</option>
            <option value="views">Most Viewed</option>
          </select>

          <button
            onClick={() => {/* Open filter modal */}}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-dark hover:border-secondary text-white rounded transition"
          >
            <Filter className="w-5 h-5" />
            More Filters
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 gap-2">
            <AlertCircle className="w-6 h-6" />
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => navigate(`/marketplace/${listing.id}`)}
                className="bg-primary-light rounded-lg overflow-hidden cursor-pointer group"
              >
                <div className="relative aspect-square">
                  <img
                    src={listing.images[0]}
                    alt={`${listing.brand} ${listing.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-primary-light px-2 py-1 rounded text-sm">
                    {listing.views} views
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-serif text-white group-hover:text-secondary transition">
                    {listing.brand} {listing.model}
                  </h3>
                  <p className="text-secondary mt-1">${listing.price.toLocaleString()}</p>
                  <div className="flex justify-between items-center mt-2 text-gray-light text-sm">
                    <span>Condition: {listing.condition_rating}/10</span>
                    <span>{listing.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketplacePage;