import React, { useState } from 'react';
import Header from '../components/layout/Header';
import { useCart } from '../context/CartContext';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/ui/CheckoutForm';
import CloseIcon from '@mui/icons-material/Close';

// Configurer Stripe
const stripePromise = loadStripe('pk_test_51PMT1o07J6CUXffxdzJVOpWZiQMfEXj7gXOCdZ4wYestgpN5r08tKJpeISw02B25hGqtZW1aggjC8Ewls1sfhic500Kb5yBBqe');

const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calcul du prix total
  const totalPrice = cart.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0);

  const handleQuantityChange = (id: number, quantity: number) => {
    if (quantity >= 1) {
      updateQuantity(id, quantity);
    }
  };

  const handlePayClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <main>
      <Header />
      <div className="container mx-auto mt-8 max-w-2xl p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Mon panier</h2>
        {cart.length === 0 ? (
          <p className="mt-4 text-gray-600 dark:text-gray-400">Votre panier est vide.</p>
        ) : (
          <ul className="mt-4">
            {cart.map(item => (
              <li key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                <img src={item.image_url} alt={item.title} className="w-16 h-16 rounded" />
                <div className="flex-1 ml-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.price} x {item.quantity} = ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="bg-gray-300 text-gray-700 px-2 rounded"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                      className="w-12 text-center bg-gray-50 border mx-2 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                      min="1"
                    />
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="bg-gray-300 text-gray-700 px-2 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        {cart.length > 0 && (
          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handlePayClick}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Payer
            </button>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">
              Total: ${totalPrice.toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed dark:text-white inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-white pt-3 pb-8 pr-8 pl-8 w-full max-w-md bg-white border border-gray-200 rounded-lg shadow dark:text-white dark:bg-gray-800 dark:border-gray-700 mx-4 sm:mx-auto">
          <button
            onClick={handleModalClose}
            className="mt-2 mb-4 mr-4 text-gray-400 hover:text-gray-600"
          >
            <CloseIcon />
          </button>
          <Elements stripe={stripePromise}>
            <CheckoutForm onClose={handleModalClose} clearCart={clearCart} />
          </Elements>
        </div>
      </div>
      
      )}
    </main>
  );
};

export default Cart;
