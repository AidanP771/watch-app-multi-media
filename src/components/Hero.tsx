import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh]">
      <video 
        autoPlay 
        muted 
        loop 
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/src/assets/vid.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/50"></div>
      
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif text-white mb-4 sm:mb-6">
            Timeless Elegance
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-6 sm:mb-8 px-4">
            Discover our collection of luxury timepieces crafted with precision and sophistication
          </p>
          <button 
            onClick={() => navigate('/collections')}
            className="bg-secondary hover:bg-secondary-light text-primary px-6 sm:px-8 py-3 rounded-md text-base sm:text-lg font-semibold transition"
          >
            Explore Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;