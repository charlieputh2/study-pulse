import React, { useEffect, useState } from 'react';
import { useCOAPageSetting } from '../hooks/useCOAPageSetting';
import { ShoppingCart, Menu, X, Calculator, FileText, HelpCircle, Truck, Calendar, ClipboardList } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { coaPageEnabled } = useCOAPageSetting();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 backdrop-blur transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 shadow-lg border-b border-blue-100/80'
            : 'bg-white/85 shadow-sm border-b border-gray-200/80'
        }`}
      >
        <div className="container mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between gap-3 md:gap-4">
            {/* Logo and Brand */}
            <button
              onClick={() => { onMenuClick(); setMobileMenuOpen(false); }}
              className="flex items-center space-x-3 hover:-translate-y-[1px] hover:opacity-100 transition-all duration-300 group min-w-0 flex-1 max-w-[calc(100%-140px)] sm:max-w-none sm:flex-initial"
            >
              <div className="relative flex-shrink-0 drop-shadow-sm">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-blue-100 shadow-md bg-white">
                  <img
                    src="/logoo.jpg"
                    alt="Study Pulse"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-left min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-extrabold text-[#1d4ed8] leading-tight whitespace-nowrap overflow-hidden text-ellipsis tracking-tight drop-shadow-sm">
                  Study Pulse
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 font-semibold flex items-center gap-1">
                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Premium E-Commerce
                  </span>
                </p>
              </div>
            </button>

            {/* Right Side Navigation */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Desktop Navigation - Progressive visibility */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2 2xl:gap-3">
                <a
                  href="/"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  Home
                </a>
                <button
                  onClick={onMenuClick}
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  Products
                </button>
                {/* Show on xl+ screens */}
                <a
                  href="/appointments"
                  className="hidden xl:flex text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  Appointments
                </a>
                <a
                  href="/orders"
                  className="hidden xl:flex text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  Orders
                </a>
                {/* Show on 2xl+ screens */}
                <a
                  href="/tracking"
                  className="hidden 2xl:flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50 whitespace-nowrap"
                >
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  <span>Tracking</span>
                </a>
                <button
                  onClick={() => {
                    // Scroll to products section
                    const productsSection = document.getElementById('products-section');
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="hidden 2xl:inline-flex items-center gap-2 bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px] whitespace-nowrap"
                >
                  Shop Now
                </button>
              </nav>

              {/* Cart Button */}
              <button
                onClick={onCartClick}
                className="relative p-2 text-theme-text hover:text-[#1d4ed8] transition-all duration-200 rounded-full hover:bg-blue-50"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute top-0 right-0 bg-theme-secondary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button - Show on smaller screens */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-theme-text hover:text-[#1d4ed8] transition-all duration-200 rounded-full hover:bg-blue-50"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer */}
          <div
            className="absolute top-0 right-0 bottom-0 w-[280px] bg-white shadow-2xl border-l-4 border-navy-900 flex flex-col animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
              <span className="font-bold text-lg text-navy-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-gray-500 hover:text-navy-900 transition-colors rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4 bg-white">
              <div className="flex flex-col space-y-2">
                <a
                  href="/"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 9.5l9-7 9 7V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>
                  </div>
                  Home
                </a>
                <button
                  onClick={() => {
                    onMenuClick();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                  </div>
                  Products
                </button>
                <a
                  href="/appointments"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <Calendar className="w-5 h-5 text-gold-500" />
                  </div>
                  Appointments
                </a>
                <a
                  href="/orders"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <ClipboardList className="w-5 h-5 text-gold-500" />
                  </div>
                  Orders
                </a>
                <a
                  href="/tracking"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <Truck className="w-5 h-5 text-gold-500" />
                  </div>
                  Real-time Tracking
                </a>
                
                {/* Shop Now button for mobile */}
                <button
                  onClick={() => {
                    // Scroll to products section
                    const productsSection = document.getElementById('products-section');
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1d4ed8] text-white text-sm font-semibold px-4 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px] mt-4"
                >
                  Shop Now
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
