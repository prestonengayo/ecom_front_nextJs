import React, { useState } from 'react';
import AddShoppingCartTwoToneIcon from '@mui/icons-material/AddShoppingCartTwoTone';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, description, price, image_url }) => {
  const { addToCart } = useCart();
  const [isModalOpen, setModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    addToCart({ id, title, price: price.toString(), quantity, image_url });
  };

  return (
    <>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <Image className="p-8 w-full h-48 rounded-t-lg" src={image_url} alt="product image" width={200} height={200}/>
        <div className="px-5 pb-5">
          <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{title}</h5>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            {description.substring(0, 100)}...
            <button onClick={handleModalOpen} className="text-blue-600 hover:underline ml-1">Détails</button>
          </p>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="bg-gray-300 text-gray-700 px-2 rounded"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                className="w-12 text-center bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                min="1"
              />
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="bg-gray-300 text-gray-700 px-2 rounded"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <AddShoppingCartTwoToneIcon />
            </button>
          </div>
          <span className="text-base font-bold text-gray-900 dark:text-white">{`$${price}`}</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white p-4 w-full max-w-xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-lg font-semibold">{title}</h3>
              <button onClick={handleModalClose} className="text-white close-modal font-medium">
                &times;
              </button>
            </div>
            <div className="overflow-y-auto max-h-96">
              <Image className="p-8 rounded-t-lg" width={200} height={200} src={image_url} alt="product image" />
              <p className="mt-4">{description}</p>
              <p className="mt-4 font-bold">{`$${price}`}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={handleModalClose} className="mr-2 px-4 py-2 bg-gray-200 rounded-lg text-emerald-950">Fermer</button>
              <button onClick={handleAddToCart} className="px-4 py-2 bg-blue-700 text-white rounded-lg"><AddShoppingCartTwoToneIcon /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
