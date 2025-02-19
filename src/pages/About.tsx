import React from 'react';
import { Clock, Award, Shield, Users } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: "Heritage Since 1895",
    description: "Over a century of watchmaking excellence, combining tradition with innovation."
  },
  {
    icon: Award,
    title: "Swiss Precision",
    description: "Each timepiece is crafted with meticulous attention to detail by master horologists."
  },
  {
    icon: Shield,
    title: "Lifetime Warranty",
    description: "Our commitment to quality is backed by a comprehensive lifetime warranty."
  },
  {
    icon: Users,
    title: "Expert Service",
    description: "Dedicated team of specialists providing personalized customer service."
  }
];

export default function About() {
  return (
    <div className="bg-finesse-black min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1495856458515-0637185db551?auto=format&fit=crop&q=80&w=1920" 
            alt="Watchmaking"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-finesse-black/70 to-finesse-black"></div>
        </div>
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <h1 className="font-playfair text-5xl font-bold mb-6">
              Our Legacy of Excellence
            </h1>
            <p className="font-raleway text-xl text-gray-300">
              For over a century, Finesse has been at the forefront of luxury watchmaking, 
              creating timepieces that combine traditional craftsmanship with contemporary design.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <feature.icon className="w-12 h-12 text-finesse-gold mx-auto mb-4" />
              <h3 className="font-playfair text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="font-raleway text-finesse-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-finesse-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 font-raleway text-finesse-gray-300">
                <p>
                  Founded in 1895 in the heart of Switzerland's watchmaking region, 
                  Finesse began as a small family workshop dedicated to creating 
                  exceptional timepieces.
                </p>
                <p>
                  Through generations, we have maintained our commitment to excellence, 
                  combining traditional craftsmanship with innovative technology to create 
                  watches that are both beautiful and precise.
                </p>
                <p>
                  Today, Finesse stands as a symbol of luxury and precision in the 
                  watchmaking industry, continuing our legacy of creating timepieces 
                  that are treasured for generations.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=600" 
                alt="Watchmaking Craft"
                className="w-full h-64 object-cover"
              />
              <img 
                src="https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=600" 
                alt="Watch Workshop"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}