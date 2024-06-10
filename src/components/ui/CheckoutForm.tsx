import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface CheckoutFormProps {
  onClose: () => void;
  clearCart: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose, clearCart }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCart();
  const { isAuthenticated, refreshToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); 

  
  const cardStyle = {
    style: {
      base: {
        color: '#ffffff',
        '::placeholder': {
          color: '#aab7c4', 
        },
      },
      invalid: {
        color: '#fa755a', 
      },
    },
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("Card element not found");
      setLoading(false);
      return;
    }




    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || 'An unexpected error occurred');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('access');
    const userId = localStorage.getItem('user_id');

    if (!token || !userId) {
      setError("L'utilisateur n'est pas connecté");
      setLoading(false);
      return;
    }

    // Map cart items to the correct format
    const formattedCart = cart.map(item => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url, 
    }));

    const createOrder = async (accessToken: string) => {
      const response = await fetch('http://52.178.106.108:8000/create-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ payment_method: paymentMethod?.id, cart: formattedCart, userId }),
      });

      return response;
    };

    let response = await createOrder(token);

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        const newToken = localStorage.getItem('access');
        response = await createOrder(newToken!);
      } else {
        setError('Failed to refresh access token');
        setLoading(false);
        return;
      }
    }

    const paymentResult = await response.json();

    if (paymentResult.error) {
      setError(paymentResult.error || 'An unexpected error occurred');
      setLoading(false);
    } else {
      const clientSecret = paymentResult.client_secret;
      if (!clientSecret) {
        setError('Failed to get client secret');
        setLoading(false);
        return;
      }

      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Jenny Rosen', 
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message || 'An unexpected error occurred');
        setLoading(false);
      } else {
        setError(null);
        clearCart(); 
        setSuccessMessage('Paiement réussi !'); 
        setTimeout(() => {
          onClose(); 
          setSuccessMessage(null);
        }, 3000);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className='text-white dark:text-white'>
        <CardElement options={cardStyle} />
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-4"
        >
          {loading ? 'Traitements...' : 'Payer'}
        </button>
      </form>
      {successMessage && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
          {successMessage}
        </div>
      )}
    </>
  );
};

export default CheckoutForm;
