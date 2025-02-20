import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SuccessModal from '../components/SuccessModal';

interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const InquiryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { watch } = location.state || {};
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    // Here you would typically handle the form submission
  };

  const handleSuccess = () => {
    setShowSuccess(false);
    navigate(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="pt-24 px-6 min-h-screen bg-primary">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-serif text-secondary mb-8">Inquiry Form</h1>
        {watch && (
          <div className="mb-8 p-6 bg-primary-light rounded-lg">
            <h2 className="text-2xl font-serif text-white mb-2">{watch.name}</h2>
            {watch.subtitle && <p className="text-gray-light italic mb-2">{watch.subtitle}</p>}
            <p className="text-secondary">${watch.price.toLocaleString()}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-white mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-primary-light text-white border border-gray-dark focus:border-secondary outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-white mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-primary-light text-white border border-gray-dark focus:border-secondary outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-white mb-2">Phone (optional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded bg-primary-light text-white border border-gray-dark focus:border-secondary outline-none"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-white mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded bg-primary-light text-white border border-gray-dark focus:border-secondary outline-none resize-none"
            />
          </div>
          
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
            >
              Submit Inquiry
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-dark hover:bg-gray-medium text-white px-6 py-3 rounded font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccess}
        message="Thank you for your inquiry. Our team will contact you shortly."
      />
    </div>
  );
};

export default InquiryPage;