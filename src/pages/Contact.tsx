import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["123 Luxury Avenue", "Geneva, Switzerland", "CH-1200"]
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+41 22 123 4567", "Monday to Friday", "9:00 AM - 6:00 PM CET"]
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["contact@finesse.com", "support@finesse.com"]
  },
  {
    icon: Clock,
    title: "Opening Hours",
    details: ["Monday - Friday: 9:00 AM - 6:00 PM", "Saturday: 10:00 AM - 4:00 PM", "Sunday: Closed"]
  }
];

export default function Contact() {
  return (
    <div className="bg-finesse-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-playfair text-4xl font-bold text-center mb-4">Contact Us</h1>
        <p className="text-finesse-gray-400 text-center font-raleway mb-12 max-w-2xl mx-auto">
          We're here to assist you with any questions about our timepieces, services, or boutiques. 
          Our team of experts is ready to provide you with exceptional service.
        </p>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-finesse-gray-900 p-6 rounded-sm">
              <info.icon className="w-8 h-8 text-finesse-gold mb-4" />
              <h3 className="font-playfair text-xl font-semibold mb-4">{info.title}</h3>
              <div className="space-y-2 font-raleway text-finesse-gray-400">
                {info.details.map((detail, idx) => (
                  <p key={idx}>{detail}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="bg-finesse-gray-900 p-8 rounded-sm">
          <h2 className="font-playfair text-2xl font-semibold mb-8">Send Us a Message</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-raleway text-sm mb-2">Name</label>
              <input 
                type="text" 
                className="w-full bg-finesse-gray-800 px-4 py-2 rounded-sm font-raleway text-white focus:outline-none focus:ring-2 focus:ring-finesse-gold"
              />
            </div>
            <div>
              <label className="block font-raleway text-sm mb-2">Email</label>
              <input 
                type="email" 
                className="w-full bg-finesse-gray-800 px-4 py-2 rounded-sm font-raleway text-white focus:outline-none focus:ring-2 focus:ring-finesse-gold"
              />
            </div>
            <div>
              <label className="block font-raleway text-sm mb-2">Phone</label>
              <input 
                type="tel" 
                className="w-full bg-finesse-gray-800 px-4 py-2 rounded-sm font-raleway text-white focus:outline-none focus:ring-2 focus:ring-finesse-gold"
              />
            </div>
            <div>
              <label className="block font-raleway text-sm mb-2">Subject</label>
              <input 
                type="text" 
                className="w-full bg-finesse-gray-800 px-4 py-2 rounded-sm font-raleway text-white focus:outline-none focus:ring-2 focus:ring-finesse-gold"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block font-raleway text-sm mb-2">Message</label>
              <textarea 
                rows={6}
                className="w-full bg-finesse-gray-800 px-4 py-2 rounded-sm font-raleway text-white focus:outline-none focus:ring-2 focus:ring-finesse-gold"
              ></textarea>
            </div>
            <div className="md:col-span-2">
              <button 
                type="submit"
                className="bg-finesse-gold text-finesse-black px-8 py-3 rounded-sm font-raleway font-medium hover:bg-finesse-gold/90 transition-colors"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}