import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

interface PaymentFormProps {
  onSubmit: () => void;
}

interface ValidationState {
  cardNumber: boolean;
  expiry: boolean;
  cvc: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onSubmit }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isValid, setIsValid] = useState<ValidationState>({
    cardNumber: true,
    expiry: true,
    cvc: true
  });
  const [showAlert, setShowAlert] = useState(false);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g) || [];
    return groups.join(' ').substr(0, 19);
  };

  // Format expiry date with slash
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.substr(0, 2) + '/' + numbers.substr(2, 2);
    }
    return numbers;
  };

  // Luhn algorithm for card number validation
  const isValidCardNumber = (number: string) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length !== 16) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  // Validate expiry date
  const isValidExpiry = (value: string) => {
    const [month, year] = value.split('/');
    if (!month || !year) return false;

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    const expiryMonth = parseInt(month, 10);
    const expiryYear = parseInt(year, 10);

    if (expiryMonth < 1 || expiryMonth > 12) return false;
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;

    return true;
  };

  // Validate CVC
  const isValidCVC = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits.length === 3;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setIsValid(prev => ({ ...prev, cardNumber: isValidCardNumber(formatted) }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    setIsValid(prev => ({ ...prev, expiry: isValidExpiry(formatted) }));
  };

  const handleCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 3);
    setCvc(value);
    setIsValid(prev => ({ ...prev, cvc: isValidCVC(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white mb-2">
          Card Number <span className="text-secondary">*</span>
        </label>
        <input
          type="text"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="1234 5678 9012 3456"
          className={`w-full px-4 py-2 bg-primary text-white border ${
            isValid.cardNumber ? 'border-gray-dark' : 'border-red-500'
          } rounded focus:border-secondary outline-none`}
          maxLength={19}
        />
        {!isValid.cardNumber && cardNumber && (
          <p className="text-red-500 text-sm mt-1">Please enter a valid card number</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white mb-2">
            Expiry Date <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            value={expiry}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            className={`w-full px-4 py-2 bg-primary text-white border ${
              isValid.expiry ? 'border-gray-dark' : 'border-red-500'
            } rounded focus:border-secondary outline-none`}
            maxLength={5}
          />
          {!isValid.expiry && expiry && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid expiry date</p>
          )}
        </div>

        <div>
          <label className="block text-white mb-2">
            CVC <span className="text-secondary">*</span>
          </label>
          <input
            type="password"
            value={cvc}
            onChange={handleCVCChange}
            placeholder="123"
            className={`w-full px-4 py-2 bg-primary text-white border ${
              isValid.cvc ? 'border-gray-dark' : 'border-red-500'
            } rounded focus:border-secondary outline-none`}
            maxLength={3}
          />
          {!isValid.cvc && cvc && (
            <p className="text-red-500 text-sm mt-1">Please enter a valid CVC</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
      >
        Pay Now
      </button>

      {showAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-primary-light p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-6 h-6 text-secondary" />
              <h3 className="text-xl font-serif text-white">Payment Processing</h3>
            </div>
            <p className="text-gray-light mb-6">
              This feature is to be handled by Stripe API integration. The form submission has been disabled for demonstration purposes.
            </p>
            <button
              onClick={() => setShowAlert(false)}
              className="w-full bg-secondary hover:bg-secondary-light text-primary px-6 py-3 rounded font-semibold transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

export default PaymentForm;