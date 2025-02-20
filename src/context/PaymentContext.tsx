import React, { createContext, useContext } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

interface PaymentContextType {
  createPaymentIntent: (amount: number, currency: string) => Promise<{ clientSecret: string }>;
  processRefund: (paymentIntentId: string) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const createPaymentIntent = async (amount: number, currency: string) => {
    try {
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ amount, currency }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return await response.json();
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  };

  const processRefund = async (paymentIntentId: string) => {
    try {
      const response = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ paymentIntentId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Refund processing error:', error);
      throw error;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        createPaymentIntent,
        processRefund,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};