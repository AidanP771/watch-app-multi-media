import React from 'react';
import { Clock, Package, CreditCard, Truck, AlertCircle } from 'lucide-react';

interface WatchDetails {
  brand: string;
  model: string;
  condition: string;
  year: number;
  case: {
    material: string;
    size: number;
  };
  movement: string;
  includedItems: string[];
  location: string;
  price: number;
  paymentMethods: string[];
  shipping: {
    domestic: string;
    international: string;
  };
  images: string[];
  features: string[];
  serviceHistory: string[];
  defects: string[];
}

const watchDetails: WatchDetails = {
  brand: "Patek Philippe",
  model: "Nautilus 5711/1A-014",
  condition: "New",
  year: 2023,
  case: {
    material: "Stainless Steel",
    size: 40
  },
  movement: "Automatic",
  includedItems: [
    "Original Box",
    "Certificate of Authenticity",
    "Manual",
    "All Original Links",
    "Warranty Card"
  ],
  location: "New York, NY",
  price: 185000,
  paymentMethods: [
    "Bank Wire",
    "Escrow",
    "Cryptocurrency (BTC/ETH)"
  ],
  shipping: {
    domestic: "Free Insured Shipping",
    international: "Available (Cost Varies)"
  },
  images: [
    "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1526045431048-f857369baa09?auto=format&fit=crop&q=80&w=800"
  ],
  features: [
    "Olive Green Dial",
    "Date Display",
    "Luminescent Hands and Hour Markers",
    "Water Resistant to 120m",
    "Power Reserve: 45 hours",
    "Screw-Down Crown"
  ],
  serviceHistory: [
    "Factory New - No Service History Required"
  ],
  defects: []
};

const WatchListing: React.FC = () => {
  return (
    <div className="min-h-screen bg-primary py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg">
              <img 
                src={watchDetails.images[0]} 
                alt={`${watchDetails.brand} ${watchDetails.model}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {watchDetails.images.slice(1).map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img 
                    src={image} 
                    alt={`${watchDetails.brand} ${watchDetails.model} view ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Watch Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif text-white mb-2">
                {watchDetails.brand} {watchDetails.model}
              </h1>
              <p className="text-3xl text-secondary">
                ${watchDetails.price.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Condition</h3>
                <p className="text-gray-light">{watchDetails.condition}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Year</h3>
                <p className="text-gray-light">{watchDetails.year}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Case</h3>
                <p className="text-gray-light">
                  {watchDetails.case.material}, {watchDetails.case.size}mm
                </p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Movement</h3>
                <p className="text-gray-light">{watchDetails.movement}</p>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Features</h3>
              <ul className="text-gray-light space-y-1">
                {watchDetails.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-secondary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-2">Included Items</h3>
              <ul className="text-gray-light space-y-1">
                {watchDetails.includedItems.map((item, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {watchDetails.defects.length > 0 && (
              <div>
                <h3 className="text-white font-semibold mb-2">Known Defects</h3>
                <ul className="text-gray-light space-y-1">
                  {watchDetails.defects.map((defect, index) => (
                    <li key={index} className="flex items-center gap-2 text-red-500">
                      <AlertCircle className="w-4 h-4" />
                      {defect}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-gray-dark pt-6 space-y-4">
              <div>
                <h3 className="text-white font-semibold mb-2">Payment Methods</h3>
                <ul className="text-gray-light space-y-1">
                  {watchDetails.paymentMethods.map((method, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-secondary" />
                      {method}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Shipping</h3>
                <ul className="text-gray-light space-y-1">
                  <li className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-secondary" />
                    Domestic: {watchDetails.shipping.domestic}
                  </li>
                  <li className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-secondary" />
                    International: {watchDetails.shipping.international}
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Location</h3>
                <p className="text-gray-light">{watchDetails.location}</p>
              </div>
            </div>

            <button className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition">
              Contact Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchListing;