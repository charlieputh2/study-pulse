import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import UniqueHeader from './UniqueHeader';
import Orders from './Orders';
import UniqueFooter from './UniqueFooter';
import FloatingCartButton from './FloatingCartButton';

const OrdersPage: React.FC = () => {
  const cart = useCart();
  const navigate = useNavigate();

  const handleCartClick = () => {
    // Navigate to home page with cart state
    navigate('/?view=cart');
  };

  const handleMenuClick = () => {
    // Navigate back to home
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      <UniqueHeader
        cartItemsCount={cart.getTotalItems()}
        onCartClick={handleCartClick}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-grow">
        <Orders />
      </main>

      <UniqueFooter />
      
      <FloatingCartButton
        itemCount={cart.getTotalItems()}
        onCartClick={handleCartClick}
      />
    </div>
  );
};

export default OrdersPage;
