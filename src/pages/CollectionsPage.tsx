import React from 'react';
import { useNavigate } from 'react-router-dom';
import { collections } from '../data/collections';

const CollectionsPage = () => {
  const navigate = useNavigate();

  const handleWatchClick = (watchId: number) => {
    navigate(`/shop/${watchId}`);
  };

  return (
    <div className="pt-20">
      {collections.map((collection) => (
        <section key={collection.id} className="py-16 bg-primary-light">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-serif text-secondary mb-12">{collection.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collection.watches.map((watch) => (
                <div key={watch.id} className="group">
                  <div 
                    className="cursor-pointer"
                    onClick={() => handleWatchClick(watch.id)}
                  >
                    <div className="relative overflow-hidden">
                      <img 
                        src={watch.image} 
                        alt={watch.name}
                        className="w-full h-96 object-cover transform group-hover:scale-105 transition duration-500"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                    </div>
                    <div className="mt-6">
                      <h3 className="text-2xl font-serif text-white hover:text-secondary transition">{watch.name}</h3>
                      <p className="text-secondary mt-2">${watch.price.toLocaleString()}</p>
                      <p className="text-gray-light mt-2">{watch.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
};

export default CollectionsPage;