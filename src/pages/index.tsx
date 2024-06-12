import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import ProductCard from '../components/ui/ProductCard';

interface Product {
  id: number;
  name: string;
  brand: string;
  description: string;
  color: string;
  gearbox: string;
  price: string;
  engine_type: string;
  image: string | null;
}

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingState, setLoadingState] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetch('https://ecom-back.shop/products/')
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        const initialLoadingState = data.reduce((acc: { [key: number]: boolean }, product: Product) => {
          acc[product.id] = true;
          return acc;
        }, {});
        setLoadingState(initialLoadingState);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleImageLoad = (id: number) => {
    setLoadingState(prevState => ({
      ...prevState,
      [id]: false,
    }));
  };

  return (
    <main>
      <Header />
      <div className="container px-4 py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mx-auto">
        {products.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            title={product.name}
            description={product.description}
            price={parseFloat(product.price)}
            image_url={product.image || 'https://via.placeholder.com/150'}
          />
        ))}
      </div>
    </main>
  );
}

export default Home;
