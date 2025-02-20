import React from 'react';
import { useNavigate } from 'react-router-dom';
import { collections } from '../data/collections';

const NewArrivalsPage = () => {
  const navigate = useNavigate();
  const newArrivals = collections.find(collection => collection.name === "New Arrivals");

  return (
    <div className="pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-secondary mb-12">New Arrivals</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {newArrivals?.watches.map((watch) => (
            <div key={watch.id} className="group">
              <div className="relative overflow-hidden">
                <img 
                  src={watch.image} 
                  alt={watch.name}
                  className="w-full h-80 object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition"></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-secondary px-3 py-1 text-primary text-sm font-semibold rounded">New</span>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-2xl font-serif text-white">{watch.name}</h3>
                <p className="text-secondary mt-2">${watch.price.toLocaleString()}</p>
                <p className="text-gray-light mt-2">{watch.description}</p>
                <button 
                  onClick={() => navigate(`/shop/${watch.id}`)}
                  className="mt-4 bg-secondary hover:bg-secondary-light text-primary px-6 py-2 rounded transition"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewArrivalsPage;