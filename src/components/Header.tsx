import React, { useEffect, useState } from 'react';
import { useCOAPageSetting } from '../hooks/useCOAPageSetting';
import { ShoppingCart, Menu, X, MessageCircle, Calculator, FileText, HelpCircle, Truck, Calendar, ClipboardList } from 'lucide-react';

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
            <div className="flex items-center gap-2 md:gap-4 ml-auto">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1.5 lg:gap-3 xl:gap-4">
                <a
                  href="/"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  Home
                </a>
                <button
                  onClick={onMenuClick}
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  Products
                </button>
                <a
                  href="/research"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  Research
                </a>
                <a
                  href="/protocols"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  Protocols
                </a>
                <a
                  href="/appointments"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  Appointments
                </a>
                <a
                  href="/orders"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  Orders
                </a>
                <a
                  href="/tracking"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <Truck className="w-4 h-4" />
                  Real-time Tracking
                </a>
                <a
                  href="/calculator"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <Calculator className="w-4 h-4" />
                  Calculator
                </a>
                {coaPageEnabled && (
                  <a
                    href="/coa"
                    className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50"
                  >
                    <FileText className="w-4 h-4" />
                    Lab Tests
                  </a>
                )}
                <a
                  href="/faq"
                  className="text-sm font-semibold text-gray-700 hover:text-[#1d4ed8] transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <HelpCircle className="w-4 h-4" />
                  FAQ
                </a>
                <a
                  href="https://t.me/+9jU8Q-FgVms5NjA1?fbclid=IwY2xjawO93V9leHRuA2FlbQIxMABicmlkETE3UTRaaTlnWWtybmFHUmk0c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHoAHCIZXlUTXQo_N4JcXqhl4Vhr2QMV7i8hGSy8xK5Aj41j0Q9-jGc0oOgrY_aem_-joyjDXQFn63ofL_EP4cOQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-gray-700 hover:text-[#0088cc] transition-all duration-200 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-blue-50"
                >
                  <MessageCircle className="w-4 h-4" />
                  Join Community
                </a>
                <button
                  onClick={() => {
                    // Scroll to products section
                    const productsSection = document.getElementById('products-section');
                    if (productsSection) {
                      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="hidden lg:inline-flex items-center gap-2 bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1d4ed8] text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-[1px]"
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

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-theme-text hover:text-[#1d4ed8] transition-all duration-200 rounded-full hover:bg-blue-50"
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
        <div className="md:hidden fixed inset-0 z-[60]">
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
                  href="/research"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19.5V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v13.5l-5-2-5 2z" /></svg>
                  </div>
                  Research
                </a>
                <a
                  href="/protocols"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M6 4h9l3 3v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M9 13h6" /><path d="M9 17h6" /><path d="M9 9h3" /></svg>
                  </div>
                  Protocols
                </a>
                <a
                  href="/appointments"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <Calendar className="w-5 h-5 text-gold-500" />
                  </div>
                  Appointments
                </a>
                <a
                  href="/orders"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <ClipboardList className="w-5 h-5 text-gold-500" />
                  </div>
                  Orders
                </a>
                <a
                  href="/tracking"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <Truck className="w-5 h-5 text-gold-500" />
                  </div>
                  Real-time Tracking
                </a>
                <a
                  href="/calculator"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <Calculator className="w-5 h-5 text-gold-500" />
                  </div>
                  Peptide Calculator
                </a>
                <a
                  href="/coa"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <FileText className="w-5 h-5 text-gold-500" />
                  </div>
                  Lab Tests (COA)
                </a>
                <a
                  href="/faq"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <HelpCircle className="w-5 h-5 text-gold-500" />
                  </div>
                  FAQ
                </a>
                <a
                  href="https://t.me/+9jU8Q-FgVms5NjA1?fbclid=IwY2xjawO93V9leHRuA2FlbQIxMABicmlkETE3UTRaaTlnWWtybmFHUmk0c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHoAHCIZXlUTXQo_N4JcXqhl4Vhr2QMV7i8hGSy8xK5Aj41j0Q9-jGc0oOgrY_aem_-joyjDXQFn63ofL_EP4cOQ"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl text-left font-medium text-base text-navy-900 hover:bg-navy-50 hover:text-navy-900 transition-all group"
                >
                  <div className="p-2 rounded-lg bg-navy-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-navy-600 transition-all">
                    <MessageCircle className="w-5 h-5 text-gold-500" />
                  </div>
                  Join Community
                </a>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
