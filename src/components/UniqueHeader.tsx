import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Truck, Calendar, ClipboardList, Search, Bell, ChevronDown, Sparkles, Zap, Shield, User, Beaker, FileText, Calculator, TestTube, BookOpen } from 'lucide-react';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onMenuClick: () => void;
}

const UniqueHeader: React.FC<HeaderProps> = ({ cartItemsCount, onCartClick, onMenuClick }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('studyPulseUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-blue-100/80'
            : 'bg-white/90 backdrop-blur-lg shadow-sm border-b border-gray-200/80'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          {/* Top Bar - Unique Addition */}
          <div className="hidden lg:flex items-center justify-between py-2 text-xs text-gray-600 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-blue-500" />
                <span>Fast Shipping Worldwide</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-green-500" />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
                <span>Premium Quality</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>support@studypulse.com</span>
              <span>+1-234-567-8900</span>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo - Original Branding */}
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

            {/* Desktop Navigation - Unique Design */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                to="/"
                className="group relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1d4ed8] transition-all duration-300 rounded-xl hover:bg-blue-50"
              >
                <span className="relative z-10">Home</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              
              <Link
                to="/products"
                className="group relative px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1d4ed8] transition-all duration-300 rounded-xl hover:bg-blue-50"
              >
                <span className="relative z-10">Products</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              {/* Research Dropdown Menu */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1d4ed8] transition-all duration-300 rounded-xl hover:bg-blue-50">
                  <Beaker className="w-4 h-4" />
                  Research
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Research Dropdown Content */}
                <div className="absolute top-full left-0 mt-2 w-80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-4 space-y-2">
                    <Link
                      to="/research/studies"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Explore studies</div>
                        <div className="text-xs text-gray-500">Browse research database</div>
                      </div>
                    </Link>
                    <Link
                      to="/research/protocols"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <FileText className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium">View guidelines</div>
                        <div className="text-xs text-gray-500">Research protocols</div>
                      </div>
                    </Link>
                    <Link
                      to="/calculator"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <Calculator className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">Dosage tool</div>
                        <div className="text-xs text-gray-500">Calculate dosages</div>
                      </div>
                    </Link>
                    <Link
                      to="/lab-tests"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <TestTube className="w-5 h-5 text-orange-500" />
                      <div>
                        <div className="font-medium">Quality reports</div>
                        <div className="text-xs text-gray-500">Lab test results</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Dropdown Menu - Unique Feature */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#1d4ed8] transition-all duration-300 rounded-xl hover:bg-blue-50">
                  Services
                  <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                </button>
                
                {/* Dropdown Content */}
                <div className="absolute top-full left-0 mt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 p-4 space-y-2">
                    <Link
                      to="/appointments"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Appointments</div>
                        <div className="text-xs text-gray-500">Schedule consultation</div>
                      </div>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <ClipboardList className="w-5 h-5 text-purple-500" />
                      <div>
                        <div className="font-medium">Orders</div>
                        <div className="text-xs text-gray-500">View order history</div>
                      </div>
                    </Link>
                    <Link
                      to="/tracking"
                      className="flex items-center gap-3 p-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-all"
                    >
                      <Truck className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">Tracking</div>
                        <div className="text-xs text-gray-500">Real-time tracking</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Right Side Actions - Unique Design */}
            <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0">
              {/* User Profile/Login Button - Desktop */}
              {user ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hidden lg:flex items-center gap-3 px-4 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group hover:scale-105 cursor-pointer shadow-lg"
                  title="My Dashboard"
                  type="button"
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{user.fullName?.split(' ')[0]}</div>
                    <div className="text-xs opacity-90">Dashboard</div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Login button clicked');
                    window.location.href = '/login';
                  }}
                  className="hidden lg:flex items-center gap-2 px-3 h-12 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 transition-all duration-300 group hover:scale-105 cursor-pointer"
                  title="Login / Register"
                  type="button"
                >
                  <User className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}

              {/* Cart Button - Redesigned */}
              <button
                onClick={onCartClick}
                className="relative group"
              >
                <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105">
                  <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Search Button - Desktop */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications - Unique Feature */}
              <button className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300 relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Search Bar - Expandable */}
          {searchOpen && (
            <div className="hidden lg:block pb-4">
              <div className="relative max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search products, research, protocols..."
                  className="w-full px-12 py-3 bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#1d4ed8] focus:bg-white transition-all"
                  autoFocus
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Menu - Redesigned */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Sidebar Drawer - Unique Design */}
          <div
            className="absolute top-0 right-0 bottom-0 w-80 bg-gradient-to-b from-slate-900 to-blue-900 shadow-2xl border-l border-blue-400/20 flex flex-col transform transition-transform duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-6 border-b border-blue-400/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white border border-blue-100 shadow-sm">
                  <img
                    src="/logoo.jpg"
                    alt="Study Pulse"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="font-bold text-lg text-white">Study Pulse</span>
                  <p className="text-xs text-blue-300">Premium E-Commerce</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-blue-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-blue-400/20">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-xl border border-blue-400/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                <Link
                  to="/"
                  className="flex items-center gap-4 p-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Home</div>
                    <div className="text-xs text-blue-300">Welcome page</div>
                  </div>
                </Link>

                <Link
                  to="/products"
                  className="w-full flex items-center gap-4 p-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingCart className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">Products</div>
                    <div className="text-xs text-blue-300">Browse catalog</div>
                  </div>
                </Link>

                {/* Research Section - Mobile */}
                <div className="space-y-1">
                  <div className="flex items-center gap-4 p-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-all group">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Beaker className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">Research</div>
                      <div className="text-xs text-blue-300">Scientific resources</div>
                    </div>
                  </div>
                  
                  {/* Research Sub-items */}
                  <div className="ml-14 space-y-1">
                    <Link
                      to="/research/studies"
                      className="flex items-center gap-3 p-3 rounded-xl text-blue-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-sm text-white">Explore studies</div>
                        <div className="text-xs text-blue-400">Browse research database</div>
                      </div>
                    </Link>
                    <Link
                      to="/research/protocols"
                      className="flex items-center gap-3 p-3 rounded-xl text-blue-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <FileText className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="text-sm text-white">View guidelines</div>
                        <div className="text-xs text-blue-400">Research protocols</div>
                      </div>
                    </Link>
                    <Link
                      to="/calculator"
                      className="flex items-center gap-3 p-3 rounded-xl text-blue-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Calculator className="w-4 h-4 text-green-400" />
                      <div>
                        <div className="text-sm text-white">Dosage tool</div>
                        <div className="text-xs text-blue-400">Calculate dosages</div>
                      </div>
                    </Link>
                    <Link
                      to="/lab-tests"
                      className="flex items-center gap-3 p-3 rounded-xl text-blue-300 hover:bg-white/5 hover:text-white transition-all"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <TestTube className="w-4 h-4 text-orange-400" />
                      <div>
                        <div className="text-sm text-white">Quality reports</div>
                        <div className="text-xs text-blue-400">Lab test results</div>
                      </div>
                    </Link>
                  </div>
                </div>

                <Link
                  to="/appointments"
                  className="flex items-center gap-4 p-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Appointments</div>
                    <div className="text-xs text-blue-300">Book consultation</div>
                  </div>
                </Link>

                <Link
                  to="/orders"
                  className="flex items-center gap-4 p-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ClipboardList className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Orders</div>
                    <div className="text-xs text-blue-300">Order history</div>
                  </div>
                </Link>

                <Link
                  to="/tracking"
                  className="flex items-center gap-4 p-4 rounded-2xl text-blue-200 hover:bg-white/10 hover:text-white transition-all group"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-medium text-white">Tracking</div>
                    <div className="text-xs text-blue-300">Real-time tracking</div>
                  </div>
                </Link>
              </div>
            </nav>

            {/* Login/User Button - Mobile */}
            <div className="p-4 border-t border-blue-400/20">
              {user ? (
                <button
                  onClick={() => {
                    navigate('/dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{user.fullName}</div>
                    <div className="text-xs text-blue-300">My Dashboard</div>
                  </div>
                </button>
              ) : (
                <button
                  onClick={() => {
                    console.log('Mobile login button clicked');
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white transition-all group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">Login / Register</div>
                    <div className="text-xs text-blue-300">Access your account</div>
                  </div>
                </button>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-blue-400/20">
              <div className="text-center text-blue-300 text-sm">
                <p>© 2024 Study Pulse</p>
                <p className="text-xs mt-1">Research Excellence</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UniqueHeader;
