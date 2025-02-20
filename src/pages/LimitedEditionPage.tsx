import React from 'react';
import { useNavigate } from 'react-router-dom';
import { collections } from '../data/collections';
import WatchCarousel from '../components/WatchCarousel';

const LimitedEditionPage = () => {
  const navigate = useNavigate();
  const limitedEdition = collections.find(collection => collection.name === "Limited Edition");

  return (
    <div className="pt-24 px-6 pb-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-secondary mb-8">Limited Edition</h1>
        <p className="text-gray-light mb-12 text-lg">Exclusive timepieces crafted in limited quantities for the most discerning collectors.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {limitedEdition?.watches.map((watch) => (
            <div 
              key={watch.id} 
              className="group cursor-pointer"
              onClick={() => navigate('/inquiry', { state: { watch } })}
            >
              <div className="relative overflow-hidden">
                {'additionalImages' in watch ? (
                  <WatchCarousel 
                    images={[watch.image, ...(watch.additionalImages || [])]} 
                    name={watch.name}
                  />
                ) : (
                  <div className="relative aspect-square">
                    <img 
                      src={watch.image} 
                      alt={watch.name}
                      className="w-full h-full object-cover object-center transform group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-accent px-3 py-1 text-white text-sm font-semibold rounded">Limited</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-serif text-white group-hover:text-secondary transition">{watch.name}</h3>
                {'subtitle' in watch && (
                  <p className="text-gray-light mt-1 italic">{watch.subtitle}</p>
                )}
                <p className="text-secondary mt-2">${watch.price.toLocaleString()}</p>
                <p className="text-gray-light mt-2">{watch.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LimitedEditionPage;