import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import UniqueHeader from './components/UniqueHeader';
import Menu from './components/Menu';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import FloatingCartButton from './components/FloatingCartButton';
import UniqueFooter from './components/UniqueFooter';
import AdminDashboard from './components/AdminDashboard';
import Research from './components/Research';
import Protocols from './components/Protocols';
import COA from './components/COA';
import FAQ from './components/FAQ';
import PeptideCalculator from './components/PeptideCalculator';
import OrderTrackingPage from './components/OrderTrackingPage';
import SmartGuide from './components/SmartGuide';
import ArticleDetail from './components/ArticleDetail';
import TestConnection from './components/TestConnection';
import OrdersPage from './components/OrdersPage';
import ProductsPage from './components/ProductsPage';
import { useMenu } from './hooks/useMenu';
// import { useCOAPageSetting } from './hooks/useCOAPageSetting';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get('view');
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout'>(viewParam === 'cart' ? 'cart' : 'menu');
  
  React.useEffect(() => {
    if (viewParam === 'cart') {
      setCurrentView('cart');
    } else if (viewParam === 'checkout') {
      setCurrentView('checkout');
    } else {
      setCurrentView('menu');
    }
  }, [viewParam]);
  
  const handleViewChange = (view: 'menu' | 'cart' | 'checkout') => {
    setCurrentView(view);
    // Update URL
    const newParams = new URLSearchParams(searchParams);
    if (view === 'menu') {
      newParams.delete('view');
    } else {
      newParams.set('view', view);
    }
    window.history.pushState({}, '', `/?${newParams.toString()}`);
    // Scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      <UniqueHeader
        cartItemsCount={cart.getTotalItems()}
        onCartClick={() => handleViewChange('cart')}
        onMenuClick={() => handleViewChange('menu')}
      />

      <main className="flex-grow">
        {currentView === 'menu' && (
          <Menu
            menuItems={menuItems}
            addToCart={cart.addToCart}
            cartItems={cart.cartItems}
            updateQuantity={cart.updateQuantity}
          />
        )}

        {currentView === 'cart' && (
          <Cart
            cartItems={cart.cartItems}
            updateQuantity={cart.updateQuantity}
            removeFromCart={cart.removeFromCart}
            clearCart={cart.clearCart}
            getTotalPrice={cart.getTotalPrice}
            onContinueShopping={() => handleViewChange('menu')}
            onCheckout={() => handleViewChange('checkout')}
          />
        )}

        {currentView === 'checkout' && (
          <Checkout
            cartItems={cart.cartItems}
            totalPrice={cart.getTotalPrice()}
            onBack={() => handleViewChange('cart')}
          />
        )}
      </main>

      {currentView === 'menu' && (
        <>
          <FloatingCartButton
            itemCount={cart.getTotalItems()}
            onCartClick={() => handleViewChange('cart')}
          />
          <UniqueFooter />
        </>
      )}
    </div>
  );
}


function App() {
  //   const { coaPageEnabled } = useCOAPageSetting();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/coa" element={<COA />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/calculator" element={<PeptideCalculator />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/tracking" element={<OrderTrackingPage />} />
        <Route path="/smart-guide" element={<SmartGuide />} />
        <Route path="/articles/:id" element={<ArticleDetail />} />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/research" element={<Research />} />
        <Route path="/protocols" element={<Protocols />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
