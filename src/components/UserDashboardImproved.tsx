import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  LogOut,
  Menu,
  X,
  User,
  ShoppingBag,
  Package,
  Heart,
  Settings,
  Edit3,
  ChevronRight,
  Clock,
  Mail,
  Home,
  Grid3x3,
} from 'lucide-react';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  photo?: string;
  createdAt: string;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  section: string;
}

const UserDashboardImproved: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage
    const savedUser = localStorage.getItem('studyPulseUser');
    if (!savedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('studyPulseUser');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      localStorage.removeItem('studyPulseUser');
      
      await Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been successfully logged out.',
        timer: 2000,
        showConfirmButton: false,
      });

      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems: MenuItem[] = [
    {
      id: 'overview',
      icon: <Grid3x3 className="w-5 h-5" />,
      label: 'Overview',
      section: 'overview',
    },
    {
      id: 'profile',
      icon: <User className="w-5 h-5" />,
      label: 'My Profile',
      section: 'profile',
    },
    {
      id: 'orders',
      icon: <ShoppingBag className="w-5 h-5" />,
      label: 'My Orders',
      section: 'orders',
    },
    {
      id: 'wishlist',
      icon: <Heart className="w-5 h-5" />,
      label: 'Wishlist',
      section: 'wishlist',
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      section: 'settings',
    },
  ];

  // Overview Section
  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          {user.photo ? (
            <img src={user.photo} alt={user.fullName} className="w-16 h-16 rounded-full object-cover border-4 border-white" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.fullName.split(' ')[0]}! 👋</h2>
            <p className="text-blue-100 text-sm sm:text-base">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: '🛍️', label: 'Total Orders', value: '0', color: 'blue' },
          { icon: '❤️', label: 'Wishlist Items', value: '0', color: 'red' },
          { icon: '⭐', label: 'Loyalty Points', value: '0', color: 'yellow' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-${stat.color}-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: <ShoppingBag className="w-6 h-6" />, label: 'Continue Shopping', action: () => navigate('/products') },
          { icon: <Package className="w-6 h-6" />, label: 'View Orders', action: () => setActiveSection('orders') },
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={action.action}
            className="bg-white hover:bg-blue-50 border-2 border-blue-200 rounded-xl p-4 sm:p-6 transition-all duration-200 flex items-center gap-4 group"
          >
            <div className="text-blue-600 group-hover:text-blue-700">{action.icon}</div>
            <div className="text-left">
              <p className="font-semibold text-gray-900">{action.label}</p>
              <p className="text-xs text-gray-600 group-hover:text-blue-600">Click to proceed</p>
            </div>
            <ChevronRight className="ml-auto text-gray-400 group-hover:text-blue-600" />
          </button>
        ))}
      </div>
    </div>
  );

  // Profile Section
  const ProfileSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <User className="w-6 h-6 text-blue-600" />
        My Profile
      </h3>

      <div className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {user.photo ? (
            <img src={user.photo} alt={user.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-blue-200" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <User className="w-12 h-12 text-blue-600" />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-xl font-semibold text-gray-900">{user.fullName}</h4>
            <p className="text-gray-600">{user.email}</p>
            <button className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
          {[
            { icon: <Mail className="w-5 h-5" />, label: 'Email', value: user.email },
            { icon: <Clock className="w-5 h-5" />, label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString() },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-blue-600">{item.icon}</div>
              <div>
                <p className="text-sm text-gray-600">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Orders Section
  const OrdersSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-blue-600" />
        My Orders
      </h3>
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Start Shopping
        </button>
      </div>
    </div>
  );

  // Wishlist Section
  const WishlistSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-600" />
        Wishlist
      </h3>
      <div className="text-center py-12">
        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">Your wishlist is empty.</p>
        <button
          onClick={() => navigate('/products')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <ShoppingBag className="w-5 h-5" />
          Explore Products
        </button>
      </div>
    </div>
  );

  // Settings Section
  const SettingsSection = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Account Settings
        </h3>

        <div className="space-y-4">
          {[
            { label: 'Change Password', icon: '🔐' },
            { label: 'Privacy Settings', icon: '🔒' },
            { label: 'Notification Preferences', icon: '🔔' },
            { label: 'Delete Account', icon: '⚠️' },
          ].map((setting, idx) => (
            <button
              key={idx}
              className="w-full text-left flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{setting.icon}</span>
                <span className="font-medium text-gray-900 group-hover:text-blue-600">{setting.label}</span>
              </div>
              <ChevronRight className="text-gray-400 group-hover:text-blue-600" />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 cursor-pointer" onClick={() => navigate('/')}>
            <Home className="w-6 h-6 text-blue-600" />
            <span className="font-bold text-lg sm:text-xl text-gray-900 hidden sm:inline">Study Pulse</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`
              fixed inset-y-0 left-0 top-16 w-64 bg-white border-r border-gray-200 overflow-y-auto
              transform transition-transform lg:transform-none lg:relative lg:inset-auto lg:top-auto
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
              z-20 lg:z-0
            `}
          >
            <nav className="p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.section);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.section
                      ? 'bg-blue-100 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}

              {/* Mobile Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-6 flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors lg:hidden"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 w-full">
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'orders' && <OrdersSection />}
            {activeSection === 'wishlist' && <WishlistSection />}
            {activeSection === 'settings' && <SettingsSection />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardImproved;
