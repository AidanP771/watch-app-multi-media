import React from 'react';
import { useNavigate } from 'react-router-dom';
import { collections } from '../data/collections';
import WatchCarousel from './WatchCarousel';

const FeaturedProducts = () => {
  const navigate = useNavigate();
  
  const featuredWatches = collections.map(collection => ({
    id: collection.watches[0].id,
    name: collection.watches[0].name,
    price: collection.watches[0].price,
    image: collection.watches[0].image,
    description: collection.watches[0].description,
    collection: collection.name
  }));

  const artistCollaboration = collections
    .find(c => c.name === "Limited Edition")
    ?.watches.find(w => w.name === "Artist Collaboration");

  const handleWatchClick = (watchId: number) => {
    navigate(`/shop/${watchId}`);
  };

  return (
    <section className="bg-primary-light py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-serif text-secondary mb-8 sm:mb-12 text-center">
          Featured Timepieces
        </h2>
        
        {/* Artist Collaboration Feature */}
        {artistCollaboration && (
          <div className="mb-16 cursor-pointer" onClick={() => navigate('/limited-edition')}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative">
                <WatchCarousel 
                  images={[artistCollaboration.image, ...(artistCollaboration.additionalImages || [])]}
                  name={artistCollaboration.name}
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm text-secondary-light mb-2">Limited Edition</p>
                <h3 className="text-2xl font-serif text-white mb-3">{artistCollaboration.name}</h3>
                <p className="text-gray-light mb-4">{artistCollaboration.subtitle}</p>
                <p className="text-secondary text-xl mb-4">${artistCollaboration.price.toLocaleString()}</p>
                <p className="text-gray-light">{artistCollaboration.description}</p>
                <button
                  className="mt-6 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate('/inquiry', { state: { watch: artistCollaboration } });
                  }}
                >
                  Inquire Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular Featured Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredWatches.map((watch) => (
            <div 
              key={watch.id} 
              className="group cursor-pointer"
              onClick={() => handleWatchClick(watch.id)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={watch.image} 
                  alt={watch.name}
                  className="w-full aspect-square object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-secondary-light mb-1">{watch.collection}</p>
                <h3 className="text-xl font-serif text-white group-hover:text-secondary transition line-clamp-1">
                  {watch.name}
                </h3>
                <p className="text-secondary mt-2">${watch.price.toLocaleString()}</p>
                <p className="text-gray-light mt-1 text-sm line-clamp-2">{watch.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;