import React, { useState, useEffect } from 'react';
import { Heart, ShoppingBag, Star, TrendingUp, Zap } from 'lucide-react';

interface ProductRecommendation {
  id: string;
  name: string;
  price: number;
  image?: string;
  rating: number;
  reviews: number;
  discount?: number;
  isTrending?: boolean;
  isNew?: boolean;
}

interface FlashSaleProduct {
  product_id: string;
  product_name: string;
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  stock_remaining: number;
  stock_original: number;
  expires_at: Date;
}

// ==========================================
// COMPONENT 1: Product Recommendations Card
// ==========================================
export const ProductRecommendationsSection: React.FC<{ recommendations?: ProductRecommendation[] }> = ({ 
  recommendations = [
    {
      id: '1',
      name: 'BPC-157 Injectable 10mg',
      price: 1500,
      rating: 4.9,
      reviews: 328,
      image: '/assets/products/bpc157.jpg',
      isTrending: true,
      discount: 15
    },
    {
      id: '2',
      name: 'Peptide Recovery Stack',
      price: 2200,
      rating: 4.8,
      reviews: 256,
      image: '/assets/products/recovery.jpg',
      isNew: true,
      discount: 20
    },
    {
      id: '3',
      name: 'Performance Blend Capsules',
      price: 980,
      rating: 4.7,
      reviews: 412,
      image: '/assets/products/blend.jpg',
      discount: 10
    }
  ]
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border-2 border-blue-200 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-orange-500" />
        <h3 className="text-2xl font-bold text-gray-900">Recommended For You</h3>
        <span className="ml-auto bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">PERSONALIZED</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105">
            {/* Product Image */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
              ) : (
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isTrending && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> TRENDING
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </span>
                )}
              </div>

              {/* Discount Badge */}
              {product.discount && (
                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg font-bold text-sm">
                  -{product.discount}%
                </div>
              )}

              {/* Heart Icon */}
              <button className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg">
                <Heart className="w-5 h-5 text-red-500" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-1">{product.name}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl font-bold text-blue-600">₱{product.price.toLocaleString()}</span>
                {product.discount && (
                  <span className="text-sm text-gray-500 line-through">₱{Math.round(product.price / (1 - product.discount / 100)).toLocaleString()}</span>
                )}
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-sm transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 2: Flash Sale Countdown Timer
// ==========================================
export const FlashSaleSection: React.FC<{ products?: FlashSaleProduct[] }> = ({ 
  products = [
    {
      product_id: 'flash1',
      product_name: 'Premium Research Grade Peptide',
      original_price: 2500,
      sale_price: 1499,
      discount_percentage: 40,
      stock_remaining: 3,
      stock_original: 20,
      expires_at: new Date(Date.now() + 3 * 3600000)
    },
    {
      product_id: 'flash2',
      product_name: 'Lab-Tested Compound Stack',
      original_price: 1800,
      sale_price: 899,
      discount_percentage: 50,
      stock_remaining: 2,
      stock_original: 15,
      expires_at: new Date(Date.now() + 5 * 3600000)
    }
  ]
}) => {
  const [timeLeft, setTimeLeft] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft: { [key: string]: string } = {};
      products.forEach(product => {
        const now = new Date();
        const diff = product.expires_at.getTime() - now.getTime();
        
        if (diff > 0) {
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          newTimeLeft[product.product_id] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          newTimeLeft[product.product_id] = 'EXPIRED';
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="bg-gradient-to-r from-red-600 via-red-500 to-orange-500 rounded-2xl p-6 sm:p-8 shadow-2xl border-4 border-red-700 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute animate-pulse top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute animate-pulse bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <Zap className="w-7 h-7 text-yellow-300 animate-bounce" />
          <h3 className="text-3xl font-black text-white">FLASH SALE!</h3>
          <span className="ml-auto bg-yellow-300 text-red-700 px-4 py-2 rounded-full text-sm font-bold animate-pulse">LIMITED TIME</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.product_id} className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold text-gray-900 text-sm">{product.product_name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-black text-green-600">₱{product.sale_price.toLocaleString()}</span>
                    <span className="text-lg text-gray-500 line-through">₱{product.original_price.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-lg">
                  -{product.discount_percentage}%
                </div>
              </div>

              {/* Stock Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Stock: {product.stock_remaining}/{product.stock_original}</span>
                  <span className="text-red-600 font-bold">{Math.round((product.stock_remaining / product.stock_original) * 100)}% LEFT</span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${(product.stock_remaining / product.stock_original) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Countdown */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-lg p-3 mb-3 text-center">
                <p className="text-xs text-gray-600 mb-1">Ends in:</p>
                <p className="text-2xl font-black text-red-600 font-mono">{timeLeft[product.product_id] || 'Loading...'}</p>
              </div>

              <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" /> BUY NOW
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 3: Mobile-Optimized Checkout Header
// ==========================================
export const CheckoutProgressHeader: React.FC<{ currentStep: number }> = ({ 
  currentStep = 2
}) => {
  const steps = ['Cart', 'Shipping', 'Payment', 'Confirm'];
  
  return (
    <div className="bg-white border-b-4 border-blue-600 sticky top-0 z-50 shadow-lg">
      {/* Progress Bar */}
      <div className="px-4 py-6 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              {/* Step Circle */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {index < currentStep ? '✓' : index + 1}
                </div>
                <p className={`text-xs sm:text-sm font-semibold mt-2 text-center ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Step Summary */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-sm font-semibold text-blue-900">
            {currentStep === 1 && '🛒 Review your cart items'}
            {currentStep === 2 && '🚚 Select shipping method'}
            {currentStep === 3 && '💳 Proceed to payment'}
            {currentStep === 4 && '✅ Confirm your order'}
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 4: Engagement Rewards Widget
// ==========================================
export const RewardsEngagementWidget: React.FC<{
  points?: number;
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  nextTierPoints?: number;
  actions?: { label: string; points: number; icon: string }[];
}> = ({
  points = 3250,
  tier = 'silver',
  nextTierPoints = 5000,
  actions = [
    { label: 'Review Product', points: 50, icon: '⭐' },
    { label: 'Share on Social', points: 100, icon: '📱' },
    { label: 'Refer Friend', points: 200, icon: '👥' },
    { label: 'Birthday Bonus', points: 500, icon: '🎂' }
  ]
}) => {
  const tierColors = {
    bronze: { bg: 'from-amber-600 to-amber-700', light: 'bg-amber-100', text: 'text-amber-900' },
    silver: { bg: 'from-gray-400 to-gray-600', light: 'bg-gray-100', text: 'text-gray-900' },
    gold: { bg: 'from-yellow-400 to-yellow-600', light: 'bg-yellow-100', text: 'text-yellow-900' },
    platinum: { bg: 'from-purple-500 to-purple-700', light: 'bg-purple-100', text: 'text-purple-900' }
  };

  const tierInfo = tierColors[tier];
  const progressToNext = (points / nextTierPoints) * 100;

  return (
    <div className={`bg-gradient-to-br ${tierInfo.bg} rounded-2xl p-6 sm:p-8 text-white shadow-2xl`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm opacity-90">Your Tier</p>
          <h3 className="text-3xl font-black uppercase tracking-wider">{tier}</h3>
        </div>
        <div className="text-5xl">
          {tier === 'bronze' && '🥉'}
          {tier === 'silver' && '🥈'}
          {tier === 'gold' && '🥇'}
          {tier === 'platinum' && '👑'}
        </div>
      </div>

      {/* Points Display */}
      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-4">
        <p className="text-sm opacity-90 mb-2">Loyalty Points</p>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-black">{points.toLocaleString()}</span>
          <span className="opacity-90 mb-1">/ {nextTierPoints.toLocaleString()}</span>
        </div>
        
        {/* Progress to Next Tier */}
        <div className="mt-4">
          <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressToNext}%` }}
            ></div>
          </div>
          <p className="text-xs opacity-90 mt-2">{Math.round(progressToNext)}% to next tier</p>
        </div>
      </div>

      {/* Tier Benefits */}
      <div className={`${tierInfo.light} ${tierInfo.text} rounded-lg p-3 mb-4 text-sm font-semibold`}>
        ✨ {tier === 'bronze' && '10% discount on all purchases'}
        {tier === 'silver' && 'Free shipping + 15% discount'}
        {tier === 'gold' && 'Free shipping + 20% discount + Priority support'}
        {tier === 'platinum' && 'Free shipping + 25% discount + VIP support + Exclusive products'}
      </div>

      {/* Action Items to Earn Points */}
      <div className="mt-4">
        <p className="text-sm font-semibold mb-3">Earn More Points:</p>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, idx) => (
            <button
              key={idx}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg p-3 text-left transition-all text-sm font-semibold hover:scale-105"
            >
              <p className="text-lg mb-1">{action.icon}</p>
              <p className="text-xs opacity-90">{action.label}</p>
              <p className="text-sm font-bold">+{action.points}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 5: Limited Stock Alert
// ==========================================
export const LimitedStockAlert: React.FC<{ stockPercent: number; productName: string }> = ({ 
  stockPercent = 15, 
  productName = "Premium Peptide Compound" 
}) => {
  if (stockPercent > 30) return null;

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl p-4 shadow-lg flex items-center gap-4 animate-pulse">
      <Zap className="w-6 h-6 flex-shrink-0 animate-bounce" />
      <div className="flex-1">
        <p className="font-bold text-sm">Only {stockPercent}% Left!</p>
        <p className="text-xs opacity-90">{productName} is almost out of stock</p>
      </div>
      <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap hover:bg-gray-100 transition-colors">
        Buy Now
      </button>
    </div>
  );
};

// ==========================================
// COMPONENT 6: Trust & Security Badges
// ==========================================
export const TrustBadges: React.FC = () => {
  const badges = [
    { icon: '🛡️', label: 'Secure Checkout', desc: '256-bit SSL' },
    { icon: '✅', label: 'Lab Verified', desc: '100% Tested' },
    { icon: '⚡', label: 'Fast Shipping', desc: '1-2 Days' },
    { icon: '💰', label: 'Money Back', desc: '30 Day Guarantee' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-6 border-y border-gray-200">
      {badges.map((badge, idx) => (
        <div key={idx} className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
          <p className="text-3xl mb-2">{badge.icon}</p>
          <p className="text-xs font-bold text-gray-900">{badge.label}</p>
          <p className="text-xs text-gray-600 mt-1">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductRecommendationsSection;
