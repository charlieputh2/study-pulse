import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { useMenu } from '../hooks/useMenu';
import UniqueHeader from './UniqueHeader';
import Products from './Products';
import UniqueFooter from './UniqueFooter';
import FloatingCartButton from './FloatingCartButton';

const ProductsPage: React.FC = () => {
  const cart = useCart();
  const { menuItems } = useMenu();
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
        <Products
          menuItems={menuItems}
          addToCart={cart.addToCart}
          cartItems={cart.cartItems}
          updateQuantity={cart.updateQuantity}
        />
      </main>

      <UniqueFooter />
      
      <FloatingCartButton
        itemCount={cart.getTotalItems()}
        onCartClick={handleCartClick}
      />
    </div>
  );
};

export default ProductsPage;
