import React from "react";
import { Filter } from "lucide-react";

const collections = [
  {
    id: 1,
    name: "Classic Collection",
    watches: [
      {
        id: 101,
        name: "Chronograph Master",
        price: 12500,
        image:
          "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
        description: "Swiss-made automatic chronograph",
      },
      {
        id: 102,
        name: "Royal Oak Elite",
        price: 35000,
        image:
          "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
        description: "18k gold case with sapphire crystal",
      },
    ],
  },
  {
    id: 2,
    name: "Luxury Collection",
    watches: [
      {
        id: 201,
        name: "Nautilus Prime",
        price: 45000,
        image:
          "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&q=80&w=800",
        description: "Perpetual calendar complication",
      },
      {
        id: 202,
        name: "Grand Tourbillon",
        price: 85000,
        image:
          "https://img.chrono24.com/images/uhren/38666043-93ql3j6crzpsesah9vvy4dmb-Zoom.jpg",
        description: "Flying tourbillon with moonphase",
      },
    ],
  },
  {
    id: 3,
    name: "Sport Collection",
    watches: [
      {
        id: 301,
        name: "Diver Pro",
        price: 8500,
        image:
          "https://images.unsplash.com/photo-1623998021446-45cd9b269056?auto=format&fit=crop&q=80&w=800",
        description: "Professional diving watch with 300m water resistance",
      },
      {
        id: 302,
        name: "Racing Chronograph",
        price: 15000,
        image:
          "https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=800",
        description: "Precision racing chronograph with tachymeter",
      },
    ],
  },
];

export default function Collections() {
  return (
    <div className="bg-finesse-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-playfair text-4xl font-bold">Our Collections</h1>
          <button className="flex items-center space-x-2 bg-finesse-gray-800 px-4 py-2 rounded-sm hover:bg-finesse-gray-700 transition-colors">
            <Filter className="w-5 h-5" />
            <span className="font-raleway">Filter</span>
          </button>
        </div>

        <div className="space-y-16">
          {collections.map((collection) => (
            <div key={collection.id}>
              <h2 className="font-playfair text-2xl font-semibold mb-8 text-finesse-gold">
                {collection.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collection.watches.map((watch) => (
                  <div key={watch.id} className="group">
                    <div className="relative overflow-hidden mb-4">
                      <img
                        src={watch.image}
                        alt={watch.name}
                        className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-finesse-black/20 group-hover:bg-finesse-black/0 transition-colors"></div>
                    </div>
                    <h3 className="font-playfair text-xl font-semibold mb-2">
                      {watch.name}
                    </h3>
                    <p className="text-finesse-gray-400 font-raleway mb-3">
                      {watch.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-finesse-gold font-playfair text-lg">
                        ${watch.price.toLocaleString()}
                      </span>
                      <button className="bg-finesse-green px-4 py-2 rounded-sm font-raleway text-sm hover:bg-finesse-green/90 transition-colors">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
