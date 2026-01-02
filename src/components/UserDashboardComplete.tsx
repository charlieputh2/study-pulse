import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  LogOut,
  Menu,
  X,
  Home,
  User,
  ShoppingBag,
  Package,
  Heart,
  Settings,
  Edit3,
  ChevronRight,
  Clock,
  Mail,
  Grid3x3,
  Lock,
  Shield,
  Bell,
  AlertCircle,
  MapPin,
  Phone,
  Truck,
  CheckCircle,
  Trash2,
  TrendingUp,
  Calendar,
  Award,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  photo?: string;
  createdAt: string;
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip_code: string;
  shipping_country: string;
  shipping_location?: string;
  shipping_fee?: number;
  order_items: OrderItem[];
  total_price: number;
  payment_method_name?: string;
  order_status: string;
  payment_status: string;
  tracking_number?: string;
  shipping_note?: string;
  created_at: string;
  updated_at: string;
}

interface OrderItem {
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  variation?: string;
}

interface WishlistItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  image?: string;
  addedAt: string;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  section: string;
}

const UserDashboardComplete: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
  });

  // Settings state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadUserData();
    // Fetch wishlist on component mount so overview shows correct count
    const savedWishlist = localStorage.getItem('studyPulseWishlist') || '[]';
    setWishlist(JSON.parse(savedWishlist));
  }, [navigate]);

  useEffect(() => {
    if (activeSection === 'orders' && orders.length === 0) {
      fetchOrders();
    }
    // Always refresh wishlist when viewing overview or wishlist section
    if (activeSection === 'overview' || activeSection === 'wishlist') {
      const savedWishlist = localStorage.getItem('studyPulseWishlist') || '[]';
      setWishlist(JSON.parse(savedWishlist));
    }
  }, [activeSection]);

  const loadUserData = async () => {
    const savedUser = localStorage.getItem('studyPulseUser');
    if (!savedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setProfileForm({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
      });
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('studyPulseUser');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!user) return;
    setOrdersLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      } else {
        setOrders(data || []);
      }
    } catch (error) {
      console.error('Unexpected error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    setWishlistLoading(true);
    try {
      const savedWishlist = localStorage.getItem('studyPulseWishlist') || '[]';
      const parsedWishlist = JSON.parse(savedWishlist);
      setWishlist(parsedWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  }, []);

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

  const handleSaveProfile = async () => {
    try {
      const updatedUser: UserData = {
        ...(user as UserData),
        ...profileForm,
      };
      localStorage.setItem('studyPulseUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditingProfile(false);

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your profile has been updated successfully.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleRemoveFromWishlist = (itemId: string) => {
    const updatedWishlist = wishlist.filter(item => item.id !== itemId);
    setWishlist(updatedWishlist);
    localStorage.setItem('studyPulseWishlist', JSON.stringify(updatedWishlist));

    Swal.fire({
      icon: 'success',
      title: 'Removed from Wishlist',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'New passwords do not match.',
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      await Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters long.',
      });
      return;
    }

    await Swal.fire({
      icon: 'success',
      title: 'Password Changed',
      text: 'Your password has been changed successfully.',
      timer: 2000,
      showConfirmButton: false,
    });

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowChangePassword(false);
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
            <h2 className="text-2xl sm:text-3xl font-bold">Welcome back, {user.fullName.split(' ')[0]}</h2>
            <p className="text-blue-100 text-sm sm:text-base">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <ShoppingBag className="w-6 h-6" />, label: 'Total Orders', value: orders.length.toString(), color: 'blue' },
          { icon: <Heart className="w-6 h-6" />, label: 'Wishlist Items', value: wishlist.length.toString(), color: 'red' },
          { icon: <TrendingUp className="w-6 h-6" />, label: 'Total Spent', value: `₱${orders.reduce((sum, o) => sum + o.total_price, 0).toFixed(2)}`, color: 'green' },
          { icon: <Award className="w-6 h-6" />, label: 'Loyalty Points', value: (Math.floor(orders.reduce((sum, o) => sum + o.total_price, 0) * 10)).toString(), color: 'purple' },
        ].map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-xl p-4 sm:p-6 shadow-md border-l-4 border-${stat.color}-500`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className="text-4xl text-${stat.color}-500">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Recent Orders</h3>
          <button
            onClick={() => setActiveSection('orders')}
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold"
          >
            View All
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No orders yet. Start shopping!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.order_status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{order.order_items.length} item(s)</p>
                <p className="font-semibold text-gray-900">₱{order.total_price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { icon: <ShoppingBag className="w-6 h-6" />, label: 'Continue Shopping', action: () => navigate('/products') },
          { icon: <Package className="w-6 h-6" />, label: 'Track Orders', action: () => setActiveSection('orders') },
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
        {isEditingProfile ? 'Edit Profile' : 'My Profile'}
      </h3>

      {!isEditingProfile ? (
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
              <button
                onClick={() => setIsEditingProfile(true)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6">
            {[
              { icon: <Mail className="w-5 h-5" />, label: 'Email', value: user.email },
              { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: user.phone || 'Not provided' },
              { icon: <MapPin className="w-5 h-5" />, label: 'Address', value: user.address || 'Not provided' },
              { icon: <Calendar className="w-5 h-5" />, label: 'Member Since', value: new Date(user.createdAt).toLocaleDateString() },
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
      ) : (
        <div className="space-y-4">
          {[
            { label: 'Full Name', key: 'fullName', icon: <User className="w-5 h-5" /> },
            { label: 'Email', key: 'email', icon: <Mail className="w-5 h-5" />, type: 'email' },
            { label: 'Phone', key: 'phone', icon: <Phone className="w-5 h-5" /> },
            { label: 'Address', key: 'address', icon: <MapPin className="w-5 h-5" /> },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                {field.icon}
                {field.label}
              </label>
              <input
                type={field.type || 'text'}
                value={profileForm[field.key as keyof typeof profileForm]}
                onChange={(e) => setProfileForm({ ...profileForm, [field.key]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ))}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSaveProfile}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsEditingProfile(false)}
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Orders Section with Shopee-like Tracking
  const OrdersSection = () => (
    <div className="space-y-6">
      {selectedOrder ? (
        // Order Detail View
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-semibold"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
            Back to Orders
          </button>

          <div className="space-y-6">
            {/* Order Header */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Order #{selectedOrder.id.slice(0, 8).toUpperCase()}</h3>
                  <p className="text-gray-600">{new Date(selectedOrder.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`px-4 py-2 rounded-full font-semibold ${
                  selectedOrder.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                  selectedOrder.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  selectedOrder.order_status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedOrder.order_status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Order Timeline / Tracking */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Order Status Timeline
              </h4>
              <div className="space-y-4">
                {[
                  { status: 'confirmed', label: 'Order Confirmed', icon: <CheckCircle /> },
                  { status: 'processing', label: 'Processing', icon: <Clock /> },
                  { status: 'shipped', label: 'Shipped', icon: <Truck /> },
                  { status: 'delivered', label: 'Delivered', icon: <Package /> },
                ].map((step, idx) => {
                  const isCompleted = ['confirmed', 'processing', 'shipped', 'delivered'].indexOf(selectedOrder.order_status) >= idx;
                  return (
                    <div key={step.status} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                        </div>
                        {idx < 3 && <div className={`w-1 h-12 mt-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>}
                      </div>
                      <div className="pt-1">
                        <p className={`font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-600'}`}>{step.label}</p>
                        {isCompleted && (
                          <p className="text-sm text-gray-600">Completed on {new Date(selectedOrder.updated_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tracking Number */}
            {selectedOrder.tracking_number && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tracking Number</p>
                <p className="font-mono font-semibold text-gray-900">{selectedOrder.tracking_number}</p>
              </div>
            )}

            {/* Order Items */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
              <div className="space-y-4">
                {selectedOrder.order_items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    {item.product_image && (
                      <img src={item.product_image} alt={item.product_name} className="w-20 h-20 object-cover rounded-lg" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{item.product_name}</p>
                      {item.variation && <p className="text-sm text-gray-600">{item.variation}</p>}
                      <p className="text-sm text-gray-600 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₱{(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">₱{item.price.toFixed(2)}/item</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Shipping Address
              </h4>
              <p className="text-gray-900">{selectedOrder.customer_name}</p>
              <p className="text-gray-600">{selectedOrder.shipping_address}</p>
              <p className="text-gray-600">{selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip_code}</p>
              <p className="text-gray-600">{selectedOrder.shipping_country}</p>
              <p className="text-gray-600 mt-2">{selectedOrder.customer_phone}</p>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>₱{selectedOrder.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
                {selectedOrder.shipping_fee && (
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    <span>₱{selectedOrder.shipping_fee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg text-gray-900 border-t pt-2">
                  <span>Total</span>
                  <span>₱{selectedOrder.total_price.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Status */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-gray-600">Payment Status</p>
              <p className={`font-semibold mt-1 ${
                selectedOrder.payment_status === 'paid' ? 'text-green-700' :
                selectedOrder.payment_status === 'pending' ? 'text-yellow-700' :
                'text-red-700'
              }`}>
                {selectedOrder.payment_status.toUpperCase()}
              </p>
              {selectedOrder.payment_method_name && (
                <p className="text-sm text-gray-600 mt-2">Method: {selectedOrder.payment_method_name}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Orders List View
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
            My Orders
          </h3>

          {ordersLoading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
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
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                      order.order_status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.order_status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.order_status === 'confirmed' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.order_status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-gray-600">Items</p>
                      <p className="font-semibold text-gray-900">{order.order_items.length}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total</p>
                      <p className="font-semibold text-gray-900">₱{order.total_price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment</p>
                      <p className={`font-semibold ${order.payment_status === 'paid' ? 'text-green-700' : 'text-yellow-700'}`}>
                        {order.payment_status.toUpperCase()}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1 group">
                        Track <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div className="text-xs text-gray-600">
                      Tracking: <span className="font-mono font-semibold">{order.tracking_number}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // Wishlist Section
  const WishlistSection = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Heart className="w-6 h-6 text-red-600" />
        Wishlist
      </h3>

      {wishlistLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : wishlist.length === 0 ? (
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
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {item.image && (
                <img src={item.image} alt={item.product_name} className="w-full h-40 object-cover" />
              )}
              <div className="p-4">
                <p className="font-semibold text-gray-900 line-clamp-2">{item.product_name}</p>
                <p className="text-lg font-bold text-blue-600 mt-2">₱{item.price.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Added {new Date(item.addedAt).toLocaleDateString()}</p>

                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-sm font-semibold">
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Settings Section
  const SettingsSection = () => (
    <div className="space-y-6">
      {/* Account Settings */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Account Settings
        </h3>

        {!showChangePassword ? (
          <div className="space-y-4">
            {[
              { label: 'Change Password', icon: <Lock className="w-5 h-5" />, action: () => setShowChangePassword(true) },
              { label: 'Privacy Settings', icon: <Shield className="w-5 h-5" /> },
              { label: 'Notification Preferences', icon: <Bell className="w-5 h-5" /> },
              { label: 'Two-Factor Authentication', icon: <AlertCircle className="w-5 h-5" /> },
            ].map((setting, idx) => (
              <button
                key={idx}
                onClick={setting.action}
                className="w-full text-left flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 group-hover:text-blue-600">{setting.icon}</span>
                  <span className="font-medium text-gray-900 group-hover:text-blue-600">{setting.label}</span>
                </div>
                <ChevronRight className="text-gray-400 group-hover:text-blue-600" />
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleChangePassword}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                Save Password
              </button>
              <button
                onClick={() => setShowChangePassword(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl shadow-lg p-6 sm:p-8">
        <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Danger Zone
        </h3>
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors">
          Delete Account
        </button>
      </div>

      {/* Logout Button */}
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

export default UserDashboardComplete;
