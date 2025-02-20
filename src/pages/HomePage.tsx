import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';

const HomePage = () => {
  return (
    <>
      <Hero />
      <section className="watch bg-primary py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-serif text-secondary mb-12 text-center">Precision Machinery</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="relative overflow-hidden rounded-lg">
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-[400px] object-cover"
              >
                <source src="/src/assets/vid.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-serif text-white mb-6">Crafted with Excellence</h3>
              <p className="text-gray-light mb-8 text-lg leading-relaxed">
                Every timepiece is a testament to precision engineering and meticulous craftsmanship. 
                Our master watchmakers combine traditional techniques with cutting-edge technology to 
                create watches that are both works of art and marvels of mechanical innovation.
              </p>
              <ul className="space-y-4 text-gray-light">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                  Swiss-made automatic movements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                  Hand-finished components
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                  Precision-tested chronometers
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-secondary rounded-full mr-3"></span>
                  Advanced complications
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <FeaturedProducts />
    </>
  );
};

export default HomePage;