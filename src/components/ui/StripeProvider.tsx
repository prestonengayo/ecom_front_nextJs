// src/components/StripeProvider.tsx
import React, { ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51PMT1o07J6CUXffxdzJVOpWZiQMfEXj7gXOCdZ4wYestgpN5r08tKJpeISw02B25hGqtZW1aggjC8Ewls1sfhic500Kb5yBBqe');

interface StripeProviderProps {
  children: ReactNode;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ children }) => {
  return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;
