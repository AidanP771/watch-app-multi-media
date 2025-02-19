import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const watches = [
  {
    id: 1,
    name: "Chronograph Master",
    price: 12500,
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    description: "Swiss-made automatic chronograph"
  },
  {
    id: 2,
    name: "Royal Oak Elite",
    price: 35000,
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
    description: "18k gold case with sapphire crystal"
  },
  {
    id: 3,
    name: "Nautilus Prime",
    price: 45000,
    image: "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&q=80&w=800",
    description: "Perpetual calendar complication"
  },
  {
    id: 4,
    name: "Grand Tourbillon",
    price: 85000,
    image: "https://images.unsplash.com/photo-1639037687665-37ff6c49494c?auto=format&fit=crop&q=80&w=800",
    description: "Flying tourbillon with moonphase"
  }
];

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?auto=format&fit=crop&q=80&w=1920" 
            alt="Luxury Watch"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-finesse-black/90 to-finesse-black/50"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6">
              Timeless Elegance
            </h1>
            <p className="font-raleway text-lg md:text-xl text-gray-300 mb-8">
              Discover our collection of exceptional timepieces that blend artistry with precision engineering.
            </p>
            <Link 
              to="/collections"
              className="bg-finesse-gold text-finesse-black px-8 py-3 rounded-sm font-raleway font-medium hover:bg-finesse-gold/90 transition-colors flex items-center space-x-2 w-fit"
            >
              <span>Explore Collection</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Watches */}
      <section className="py-20 bg-gradient-to-b from-finesse-black to-finesse-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-16">
            Featured Timepieces
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {watches.map((watch) => (
              <div key={watch.id} className="group">
                <div className="relative overflow-hidden mb-4">
                  <img 
                    src={watch.image} 
                    alt={watch.name}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-finesse-black/20 group-hover:bg-finesse-black/0 transition-colors"></div>
                </div>
                <h3 className="font-playfair text-xl font-semibold mb-2">{watch.name}</h3>
                <p className="text-finesse-gray-400 font-raleway mb-3">{watch.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-finesse-gold font-playfair text-lg">
                    ${watch.price.toLocaleString()}
                  </span>
                  <button 
                    className="bg-finesse-green px-4 py-2 rounded-sm font-raleway text-sm hover:bg-finesse-green/90 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}