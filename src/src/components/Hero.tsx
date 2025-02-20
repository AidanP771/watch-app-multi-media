import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      <div className="relative h-full flex items-center justify-center">
        <div className="text-center max-w-3xl px-6">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6">
            Timeless Elegance
          </h1>
          <p className="text-xl text-gray-200 mb-8">
            Discover our collection of luxury timepieces crafted with precision and sophistication
          </p>
          <button 
            onClick={() => navigate('/collections')}
            className="bg-secondary hover:bg-secondary-light text-primary px-8 py-3 rounded-md text-lg font-semibold transition"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;