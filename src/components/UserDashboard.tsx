import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  ShoppingBag, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  Edit3, 
  Camera,
  MapPin,
  Calendar,
  CreditCard,
  Star,
  Bell,
  HelpCircle,
  Clock,
  Search,
  ShoppingCart,
  Menu,
  X,
  Home,
  Grid3x3,
  UserCircle,
  TrendingUp,
  Plus,
  Minus,
  Mail,
  Phone,
  Shield,
  Zap,
  Award
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Product, ProductVariation, ProductOption } from '../types';

// Product Card Component - Mobile App Style with Full Functionality
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(product.variations?.[0]);
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(product.options?.[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const displayPrice = selectedOption 
    ? (selectedOption.final_price || (selectedVariation ? selectedVariation.price : product.base_price) + selectedOption.price_adjustment)
    : selectedVariation 
      ? selectedVariation.price 
      : product.base_price;
  const displayOriginalPrice = selectedVariation ? selectedVariation.discount_price : product.discount_price;
  const hasDiscount = displayOriginalPrice && displayOriginalPrice > displayPrice;

  const handleAddToCart = () => {
    // This will be connected to the cart system
    console.log('Adding to cart:', {
      product,
      variation: selectedVariation,
      option: selectedOption,
      quantity
    });
    // TODO: Integrate with actual cart system
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart!',
      text: `${product.name} has been added to your cart.`,
      timer: 2000,
      showConfirmButton: false
    });
    setQuantity(1);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    // TODO: Integrate with actual wishlist system
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="relative">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.name}
            className="w-full h-36 sm:h-40 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-36 sm:h-40 lg:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
            Featured
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -{Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)}%
          </div>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      <div className="p-3 sm:p-4">
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Product Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            {product.category}
          </span>
          {product.purity_percentage && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
              {product.purity_percentage}% Purity
            </span>
          )}
        </div>

        {/* Variations */}
        {product.variations && product.variations.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Size:</label>
            <div className="flex gap-1">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation)}
                  className={`flex-1 px-2 py-1 text-xs font-medium rounded-lg border transition-all duration-200 ${
                    selectedVariation?.id === variation.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {variation.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        {product.options && product.options.length > 0 && (
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Type:</label>
            <select
              value={selectedOption?.id || ''}
              onChange={(e) => {
                const option = product.options?.find(opt => opt.id === e.target.value);
                setSelectedOption(option);
              }}
              className="w-full px-2 py-1 text-xs border border-gray-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            >
              {product.options?.map((option) => {
                const optionPrice = option.final_price || (selectedVariation ? selectedVariation.price : product.base_price) + option.price_adjustment;
                return (
                  <option key={option.id} value={option.id}>
                    {option.name} - ₱{optionPrice.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </option>
                );
              })}
            </select>
          </div>
        )}

        {/* Price and Actions */}
        <div className="space-y-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              ₱{displayPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {hasDiscount && displayOriginalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                ₱{displayOriginalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Browser Component - Mobile App Style
const ProductBrowser: React.FC<{ products: Product[]; loading: boolean }> = ({ products, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price-low':
        return (a.discount_active && a.discount_price ? a.discount_price : a.base_price) - 
               (b.discount_active && b.discount_price ? b.discount_price : b.base_price);
      case 'price-high':
        return (b.discount_active && b.discount_price ? b.discount_price : b.base_price) - 
               (a.discount_active && a.discount_price ? a.discount_price : a.base_price);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Search and Filters - Mobile App Style */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="name">Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Grid3x3 className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-gray-900">
              All Products ({filteredProducts.length})
            </h3>
          </div>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Featured Products Component - Mobile App Style
const FeaturedProducts: React.FC<{ products: Product[]; loading: boolean }> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading featured products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 lg:p-8 border border-yellow-200">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
          </div>
          <div>
            <h3 className="text-xl lg:text-2xl font-bold text-gray-900">Featured Products</h3>
            <p className="text-gray-600 text-sm lg:text-base">Hand-picked premium research products</p>
          </div>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Star className="w-10 h-10 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">No featured products available</p>
          <p className="text-gray-400 text-sm mt-2">Check back soon for new featured items!</p>
        </div>
      )}
    </div>
  );
};

// Profile Section Component - Mobile App Style
const ProfileSection: React.FC<{ user: any; onEdit: () => void }> = ({ user, onEdit }) => {
  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
              {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">{user.fullName}</h2>
              <p className="text-gray-500 text-sm lg:text-base">{user.email}</p>
              <div className="flex items-center mt-2">
                <span className="flex items-center text-xs text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-current mr-1" />
                  Premium Member
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Profile Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Full Name</span>
            </div>
            <p className="text-gray-900 font-medium">{user.fullName}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Email</span>
            </div>
            <p className="text-gray-900 font-medium">{user.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Phone</span>
            </div>
            <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-700">Address</span>
            </div>
            <p className="text-gray-900 font-medium">{user.address || 'Not provided'}</p>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8">
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-6">Account Statistics</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
            <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">12</h4>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Total Orders</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 lg:w-8 lg:h-8 text-red-600" />
            </div>
            <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">8</h4>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Wishlist Items</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
            <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">3</h4>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Saved Addresses</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            </div>
            <h4 className="text-2xl lg:text-3xl font-bold text-gray-900">2024</h4>
            <p className="text-xs lg:text-sm text-gray-500 mt-1">Member Since</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  });

  // Fetch products from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // First fetch products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Then fetch variations and options separately if needed
      const { data: variations, error: variationsError } = await supabase
        .from('product_variations')
        .select('*');

      const { data: options, error: optionsError } = await supabase
        .from('product_options')
        .select('*');

      if (variationsError) throw variationsError;
      if (optionsError) throw optionsError;

      // Combine the data
      const productsWithRelations = (products || []).map(product => ({
        ...product,
        variations: variations?.filter(v => v.product_id === product.id) || [],
        options: options?.filter(o => o.product_id === product.id) || []
      }));

      setProducts(productsWithRelations);
      
      // Filter featured products
      const featured = productsWithRelations.filter(product => product.featured);
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error fetching products:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load products',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('studyPulseUser');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setEditForm({
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('studyPulseUser');
        navigate('/');
      }
    });
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated!',
      text: 'Your profile has been updated successfully.',
      timer: 2000,
      showConfirmButton: false
    });
    setIsEditing(false);
    setUser({ ...user, ...editForm });
  };

  // Mobile bottom navigation items
  const bottomNavItems = [
    { id: 'overview', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Grid3x3 },
    { id: 'featured', label: 'Featured', icon: Star },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ];

  // Desktop sidebar menu items
  const sidebarMenuItems = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'products', label: 'Browse Products', icon: Package },
    { id: 'featured', label: 'Featured Products', icon: Star },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AccountOverview user={user} onEdit={() => setIsEditing(true)} featuredProducts={featuredProducts} setActiveTab={setActiveTab} />;
      case 'products':
        return <ProductBrowser products={products} loading={loading} />;
      case 'featured':
        return <FeaturedProducts products={featuredProducts} loading={loading} />;
      case 'profile':
        return <ProfileSection user={user} onEdit={() => setIsEditing(true)} />;
      case 'orders':
        return <OrderHistory />;
      case 'wishlist':
        return <Wishlist />;
      case 'addresses':
        return <AddressManagement />;
      case 'payment':
        return <PaymentMethods />;
      case 'settings':
        return <AccountSettings />;
      default:
        return <AccountOverview user={user} onEdit={() => setIsEditing(true)} featuredProducts={featuredProducts} setActiveTab={setActiveTab} />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">My Account</h1>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                Active
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative bg-white w-80 h-full shadow-xl">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <nav className="p-4 space-y-2">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            {/* User Profile Card */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{user.fullName}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex justify-center mt-2">
                <span className="flex items-center text-xs text-yellow-600">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1">Premium Member</span>
                </span>
              </div>
            </div>

            {/* Sidebar Menu */}
            <nav className="space-y-2">
              {sidebarMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-gray-50 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-6xl mx-auto p-4 lg:p-8">
            {isEditing ? (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.fullName}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

// Account Overview Component - Mobile App Style with Real Data
const AccountOverview: React.FC<{ user: any; onEdit: () => void; featuredProducts: Product[]; setActiveTab: (tab: string) => void }> = ({ user, onEdit, featuredProducts, setActiveTab }) => {
  // const [cartCount, setCartCount] = useState(0);
  // const [wishlistCount, setWishlistCount] = useState(0);

  // Calculate real stats from products
  const totalProducts = featuredProducts.length;
  const inStockProducts = featuredProducts.filter(p => p.stock_quantity > 0).length;
  const avgPrice = featuredProducts.length > 0 
    ? featuredProducts.reduce((sum, p) => sum + (p.discount_price || p.base_price), 0) / featuredProducts.length 
    : 0;

  const stats = [
    { 
      label: 'Available Products', 
      value: inStockProducts.toString(), 
      icon: Package, 
      color: 'blue',
      subtitle: `${totalProducts} total`
    },
    { 
      label: 'Avg Price', 
      value: `₱${avgPrice.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
      icon: TrendingUp, 
      color: 'green',
      subtitle: 'Per unit'
    },
    { 
      label: 'Categories', 
      value: Array.from(new Set(featuredProducts.map(p => p.category))).length.toString(), 
      icon: Grid3x3, 
      color: 'purple',
      subtitle: 'Available'
    },
    { 
      label: 'Member Since', 
      value: '2024', 
      icon: Calendar, 
      color: 'orange',
      subtitle: 'Premium'
    }
  ];

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Card - Mobile App Style */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold mb-2">Welcome back, {user.fullName}!</h2>
            <p className="text-blue-100 text-sm lg:text-base">Manage your account and explore {totalProducts} premium products</p>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full">
                <Shield className="w-3 h-3" />
                <span>Verified Account</span>
              </div>
              <div className="flex items-center gap-1 text-xs bg-white/20 px-3 py-1 rounded-full">
                <Award className="w-3 h-3" />
                <span>Premium Member</span>
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-0">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl lg:text-3xl font-bold">{user.fullName?.charAt(0)?.toUpperCase() || 'U'}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onEdit}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-colors font-medium"
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-colors font-medium"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Shop Now</span>
          </button>
        </div>
      </div>

      {/* Stats Grid - Mobile App Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-4 lg:p-6 shadow-sm border border-gray-100">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-xs lg:text-sm text-gray-500 mt-1">{stat.label}</p>
              {stat.subtitle && (
                <p className="text-xs text-gray-400">{stat.subtitle}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Featured Products - Mobile App Style */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-base lg:text-lg font-bold text-gray-900">Featured Products</h3>
              <p className="text-xs text-gray-500">{inStockProducts} available</p>
            </div>
          </div>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            See All
          </button>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {featuredProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No featured products available</p>
            <p className="text-gray-400 text-sm mt-2">Check back soon for new items!</p>
          </div>
        )}
      </div>

      {/* Quick Actions - Mobile App Style */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-base lg:text-lg font-bold text-gray-900">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('products')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Package className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-xs font-medium text-gray-700">Browse All</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ShoppingBag className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-xs font-medium text-gray-700">My Orders</span>
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Heart className="w-6 h-6 text-red-600 mb-2" />
            <span className="text-xs font-medium text-gray-700">Wishlist</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className="flex flex-col items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-xs font-medium text-gray-700">Settings</span>
          </button>
        </div>
      </div>

      {/* Recent Activity - Mobile App Style */}
      <div className="bg-white rounded-2xl shadow-sm p-4 lg:p-6">
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-base lg:text-lg font-bold text-gray-900">Recent Activity</h3>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Welcome to Dashboard</p>
                <p className="text-xs text-gray-500">Just now</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              New
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">Profile Updated</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Updated
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const OrderHistory = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Order History</h2>
    <p className="text-gray-500">Your order history will appear here.</p>
  </div>
);

const Wishlist = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">My Wishlist</h2>
    <p className="text-gray-500">Your wishlist items will appear here.</p>
  </div>
);

const AddressManagement = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Management</h2>
    <p className="text-gray-500">Manage your shipping addresses here.</p>
  </div>
);

const PaymentMethods = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Methods</h2>
    <p className="text-gray-500">Manage your payment methods here.</p>
  </div>
);

const AccountSettings = () => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
    <p className="text-gray-500">Manage your account settings here.</p>
  </div>
);

export default UserDashboard;
