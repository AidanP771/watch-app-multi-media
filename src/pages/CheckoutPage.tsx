import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Check, ChevronRight } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import SuccessModal from '../components/SuccessModal';

type CheckoutStep = 'contact' | 'shipping' | 'billing' | 'payment' | 'review';

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface AddressInfo {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('contact');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState<AddressInfo>({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [billingAddress, setBillingAddress] = useState<AddressInfo>({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [useSameAddress, setUseSameAddress] = useState(true);
  const [cardholderName, setCardholderName] = useState('');

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 25;
  const tax = subtotal * 0.13;
  const total = subtotal + shipping + tax;

  const handleCustomerInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('shipping');
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('billing');
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    clearCart();
  };

  const handlePaymentError = (error: string) => {
    alert(error);
  };

  const steps = [
    { key: 'contact', label: 'Contact' },
    { key: 'shipping', label: 'Shipping' },
    { key: 'billing', label: 'Billing' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep === step.key
                ? 'bg-secondary text-primary'
                : 'bg-gray-dark text-gray-light'
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className="w-16 h-1 mx-2 bg-gray-dark" />
          )}
        </div>
      ))}
    </div>
  );

  const renderOrderSummary = () => (
    <div className="bg-primary-light rounded-lg p-6">
      <h3 className="text-xl font-serif text-white mb-4">Order Summary</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-light">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
        <div className="border-t border-gray-dark pt-4">
          <div className="flex justify-between text-gray-light">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-light mt-2">
            <span>Shipping</span>
            <span>${shipping.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-light mt-2">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-white font-semibold mt-4">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 px-6 pb-32 min-h-screen bg-primary">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-secondary mb-8">Checkout</h1>
        
        {renderStepIndicator()}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {currentStep === 'contact' && (
              <form onSubmit={handleCustomerInfoSubmit} className="space-y-6">
                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-2xl font-serif text-white mb-6">Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white mb-2">
                        First Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, firstName: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">
                        Last Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, lastName: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-white mb-2">
                        Email Address <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-white mb-2">
                        Phone Number (optional)
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
                >
                  Continue to Shipping <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {currentStep === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-2xl font-serif text-white mb-6">Shipping Address</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">
                        Street Address <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Street and number"
                        value={shippingAddress.street1}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, street1: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        value={shippingAddress.street2}
                        onChange={(e) => setShippingAddress(prev => ({ ...prev, street2: e.target.value }))}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white mb-2">
                          City <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">
                          State/Province <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">
                          ZIP/Postal Code <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                          className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">
                          Country <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={shippingAddress.country}
                          onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                          className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('contact')}
                    className="flex-1 border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
                  >
                    Continue to Billing <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {currentStep === 'billing' && (
              <form onSubmit={handleBillingSubmit} className="space-y-6">
                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-2xl font-serif text-white mb-6">Billing Information</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center text-white mb-6">
                        <input
                          type="checkbox"
                          checked={useSameAddress}
                          onChange={(e) => {
                            setUseSameAddress(e.target.checked);
                            if (e.target.checked) {
                              setBillingAddress(shippingAddress);
                            }
                          }}
                          className="mr-2"
                        />
                        Same as shipping address
                      </label>
                    </div>

                    {!useSameAddress && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white mb-2">
                            Street Address <span className="text-secondary">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Street and number"
                            value={billingAddress.street1}
                            onChange={(e) => setBillingAddress(prev => ({ ...prev, street1: e.target.value }))}
                            className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Apartment, suite, etc. (optional)"
                            value={billingAddress.street2}
                            onChange={(e) => setBillingAddress(prev => ({ ...prev, street2: e.target.value }))}
                            className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white mb-2">
                              City <span className="text-secondary">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={billingAddress.city}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, city: e.target.value }))}
                              className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-2">
                              State/Province <span className="text-secondary">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={billingAddress.state}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, state: e.target.value }))}
                              className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-2">
                              ZIP/Postal Code <span className="text-secondary">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={billingAddress.zipCode}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                              className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-white mb-2">
                              Country <span className="text-secondary">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={billingAddress.country}
                              onChange={(e) => setBillingAddress(prev => ({ ...prev, country: e.target.value }))}
                              className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-white mb-2">
                        Cardholder Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value)}
                        className="w-full px-4 py-2 bg-primary text-white border border-gray-dark rounded focus:border-secondary outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep('shipping')}
                    className="flex-1 border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition flex items-center justify-center gap-2"
                  >
                    Continue to Payment <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}

            {currentStep === 'payment' && (
              <div className="space-y-6">
                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-2xl font-serif text-white mb-6">Payment Details</h2>
                  <PaymentForm
                    amount={total * 100}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
                <button
                  onClick={() => setCurrentStep('billing')}
                  className="w-full border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition"
                >
                  Back
                </button>
              </div>
            )}

            {currentStep === 'review' && (
              <div className="space-y-6">
                <div className="bg-primary-light rounded-lg p-6">
                  <h2 className="text-2xl font-serif text-white mb-6">Order Review</h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-semibold mb-2">Contact Information</h3>
                      <p className="text-gray-light">{customerInfo.email}</p>
                      <p className="text-gray-light">{customerInfo.phone || 'No phone provided'}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Shipping Address</h3>
                      <p className="text-gray-light">
                        {customerInfo.firstName} {customerInfo.lastName}<br />
                        {shippingAddress.street1}<br />
                        {shippingAddress.street2 && <>{shippingAddress.street2}<br /></>}
                        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                        {shippingAddress.country}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-2">Billing Address</h3>
                      <p className="text-gray-light">
                        {useSameAddress ? 'Same as shipping address' : (
                          <>
                            {cardholderName}<br />
                            {billingAddress.street1}<br />
                            {billingAddress.street2 && <>{billingAddress.street2}<br /></>}
                            {billingAddress.city}, {billingAddress.state} {billingAddress.zipCode}<br />
                            {billingAddress.country}
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep('payment')}
                  className="w-full border border-gray-dark hover:border-secondary text-white px-6 py-3 rounded font-semibold transition"
                >
                  Back
                </button>
              </div>
            )}
          </div>

          <div className="md:col-span-1">
            {renderOrderSummary()}
          </div>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => navigate('/')}
        message="Thank you for your order! You will receive a confirmation email shortly."
      />
    </div>
  );
};

export default CheckoutPage;