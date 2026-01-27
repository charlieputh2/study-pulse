import React from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, Link } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import { AuthProvider } from './hooks/useAuth';
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
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import UserDashboardComplete from './components/UserDashboardComplete';
import LabTests from './components/LabTests';
import TirzepatideLanding from './components/TirzepatideLanding';
import TirzepatideLandingPage from './components/TirzepatideLandingPage';
import GeneralLanding from './components/GeneralLanding';
import ResearchStudies from './components/ResearchStudies';
import { useMenu } from './hooks/useMenu';
// import { useCOAPageSetting } from './hooks/useCOAPageSetting';

function MainApp() {
  const cart = useCart();
  const { menuItems } = useMenu();
  const [searchParams] = useSearchParams();
  const viewParam = searchParams.get('view');
  const [currentView, setCurrentView] = React.useState<'menu' | 'cart' | 'checkout'>('menu');
  
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
    // Update URL - keep it on /shop route
    const newParams = new URLSearchParams(searchParams);
    if (view === 'menu') {
      newParams.delete('view');
    } else {
      newParams.set('view', view);
    }
    window.history.pushState({}, '', `/shop${newParams.toString() ? '?' + newParams.toString() : ''}`);
    // Scroll to top when changing views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      {/* Store Indicator */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 text-center text-sm">
        <div className="container mx-auto flex items-center justify-center gap-2">
          <Link to="/" className="hover:text-blue-200 transition-colors">← Back to Landing</Link>
          <span className="text-blue-200">|</span>
          <span className="font-medium">Study Pulse Store</span>
        </div>
      </div>
      
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<GeneralLanding />} />
          <Route path="/landing" element={<TirzepatideLanding />} />
          <Route path="/shop" element={<MainApp />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/user-dashboard" element={<UserDashboardComplete />} />
          <Route path="/coa" element={<COA />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/calculator" element={<PeptideCalculator />} />
          <Route path="/track-order" element={<OrderTrackingPage />} />
          <Route path="/tracking" element={<OrderTrackingPage />} />
          <Route path="/smart-guide" element={<SmartGuide />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/test-connection" element={<TestConnection />} />
          <Route path="/research" element={<Research />} />
          <Route path="/research/studies" element={<ResearchStudies />} />
          <Route path="/protocols" element={<Protocols />} />
          <Route path="/research/protocols" element={<Protocols />} />
          <Route path="/lab-tests" element={<LabTests />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/tirzepatide" element={<TirzepatideLandingPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboardComplete />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
