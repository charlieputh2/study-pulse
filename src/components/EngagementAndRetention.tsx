import React, { useState } from 'react';
import { X, Eye, Heart } from 'lucide-react';
import Swal from 'sweetalert2';

// ==========================================
// COMPONENT 1: Exit Intent Popup (Anti-Abandon)
// ==========================================
export const ExitIntentPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [email, setEmail] = useState('');

  const handleSaveCart = async () => {
    if (email) {
      await Swal.fire({
        title: 'Cart Saved!',
        text: 'We\'ve sent a reminder link to your email. Your cart will be available for 7 days.',
        icon: 'success',
        timer: 2000
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-bounce-in">
        <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white p-6 text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <p className="text-3xl mb-2">⏰</p>
          <h2 className="text-2xl font-black">Wait! Don't Go!</h2>
          <p className="text-sm opacity-90 mt-2">We have an exclusive offer for you</p>
        </div>

        <div className="p-6">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-yellow-900 mb-2">Save your cart and get</p>
            <p className="text-3xl font-black text-yellow-600">20% OFF</p>
            <p className="text-xs text-yellow-700 mt-1">on your next purchase</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter your email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>

          <button
            onClick={handleSaveCart}
            disabled={!email}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 rounded-lg font-bold transition-all mb-3"
          >
            Save Cart & Get Discount
          </button>

          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-900 font-semibold py-2 transition-colors"
          >
            I'll Shop Later
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            ✓ No spam • ✓ Easy unsubscribe • ✓ Free shipping on next order
          </p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 2: Product Review Widget
// ==========================================
export const ProductReviewWidget: React.FC<{ 
  productId?: string;
  averageRating?: number;
  totalReviews?: number;
}> = ({ 
  averageRating = 4.6,
  totalReviews = 1243
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userReview, setUserReview] = useState({ rating: 5, comment: '', verified: true });

  const reviews = [
    { name: 'John D.', rating: 5, verified: true, comment: 'Best peptide I\'ve used. Fast shipping!', date: '2 weeks ago' },
    { name: 'Sarah M.', rating: 5, verified: true, comment: 'Excellent quality. Highly recommend.', date: '1 month ago' },
    { name: 'Mike T.', rating: 4, verified: true, comment: 'Good product, could be cheaper', date: '1 month ago' }
  ];

  const ratingDistribution = [
    { stars: 5, count: 823, percent: 66 },
    { stars: 4, count: 315, percent: 25 },
    { stars: 3, count: 78, percent: 6 },
    { stars: 2, count: 20, percent: 2 },
    { stars: 1, count: 7, percent: 1 }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Customer Reviews</h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-2xl ${i < Math.floor(averageRating) ? '⭐' : '☆'}`}></span>
              ))}
            </div>
            <div>
              <p className="font-black text-xl text-gray-900">{averageRating}</p>
              <p className="text-xs text-gray-600">{totalReviews.toLocaleString()} reviews</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition-colors"
        >
          Write Review
        </button>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2 mb-6 pb-6 border-b-2 border-gray-200">
        {ratingDistribution.map(item => (
          <div key={item.stars} className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-600 w-16">{item.stars}⭐</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div className="bg-yellow-400 h-full transition-all" style={{ width: `${item.percent}%` }}></div>
            </div>
            <span className="text-sm text-gray-600 w-16 text-right">{item.count}</span>
          </div>
        ))}
      </div>

      {/* Top Reviews */}
      <div className="space-y-4">
        <h4 className="font-bold text-gray-900">Top Reviews</h4>
        {reviews.map((review, idx) => (
          <div key={idx} className="border-l-4 border-green-500 pl-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <div>
                <p className="font-bold text-gray-900">{review.name}</p>
                <p className="text-xs text-gray-600">{review.date}</p>
              </div>
              {review.verified && (
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                  ✓ Verified
                </span>
              )}
            </div>
            <p className="text-sm mb-2">{'⭐'.repeat(review.rating)}</p>
            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="bg-blue-600 text-white p-6 text-center">
              <h3 className="text-2xl font-black">Share Your Experience</h3>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="font-bold text-gray-900 mb-3">Rate this product:</p>
                <div className="flex gap-2 justify-center text-4xl">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() => setUserReview({ ...userReview, rating: star })}
                      className="cursor-pointer transition-transform hover:scale-125"
                    >
                      {star <= userReview.rating ? '⭐' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={userReview.comment}
                onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                placeholder="Share your experience with this product..."
                maxLength={500}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 mb-3 resize-none"
              />

              <p className="text-xs text-gray-600 mb-4">{userReview.comment.length}/500</p>

              <button
                onClick={() => {
                  setIsOpen(false);
                  Swal.fire({ title: 'Thank You!', text: 'Your review has been published', icon: 'success', timer: 2000 });
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold transition-colors"
              >
                Post Review
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-2 text-gray-600 hover:text-gray-900 font-semibold py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// COMPONENT 3: Social Proof Notifications
// ==========================================
export const SocialProofNotification: React.FC = () => {
  const [visible, setVisible] = useState(true);

  const notifications = [
    { type: 'purchase', text: 'Sarah just bought BPC-157 10mg', time: '2 min ago' },
    { type: 'review', text: 'Miguel left a 5⭐ review', time: '5 min ago' },
    { type: 'popular', text: '🔥 Peptide Stack is trending (234 bought today)', time: '10 min ago' }
  ];

  if (!visible) return null;

  return (
    <div className="fixed top-4 right-4 w-80 max-w-sm bg-white rounded-xl shadow-2xl border-l-4 border-green-500 p-4 animate-slide-in z-40">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-green-600" />
          <span className="font-bold text-gray-900">Social Proof</span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {notifications.map((notif, idx) => (
          <div key={idx} className="text-sm text-gray-700 pb-2 border-b border-gray-100 last:border-0">
            <p className="font-semibold">{notif.text}</p>
            <p className="text-xs text-gray-500">{notif.time}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-3 text-center">✓ Real purchases from real customers</p>
    </div>
  );
};

// ==========================================
// COMPONENT 4: Bundle Deal Widget
// ==========================================
export const BundleDealWidget: React.FC = () => {


  const bundles = [
    {
      id: 1,
      name: 'Starter Bundle',
      items: ['BPC-157 10mg', 'Peptide Stack', 'Lab Guide'],
      originalPrice: 4500,
      bundlePrice: 3299,
      savings: 1201,
      savings_percent: 27,
      popular: false
    },
    {
      id: 2,
      name: 'Power Bundle',
      items: ['BPC-157 20mg', 'Recovery Stack', 'Premium Guide', 'Priority Support'],
      originalPrice: 7200,
      bundlePrice: 4899,
      savings: 2301,
      savings_percent: 32,
      popular: true
    },
    {
      id: 3,
      name: 'Elite Bundle',
      items: ['Premium Peptide', 'Elite Stack', 'Full Lab Report', 'VIP Support', 'Free Shipping'],
      originalPrice: 12000,
      bundlePrice: 7499,
      savings: 4501,
      savings_percent: 38,
      popular: false
    }
  ];

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-300">
      <h3 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-2">
        <Heart className="w-6 h-6 text-purple-600" />
        Smart Bundles
      </h3>
      <p className="text-gray-600 text-sm mb-6">Save more when you buy together</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bundles.map(bundle => (
          <div
            key={bundle.id}
            className={`relative p-4 rounded-xl cursor-pointer transition-all transform hover:scale-105 ${
              bundle.popular
                ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                : 'bg-white border-2 border-gray-200 hover:border-purple-400'
            }`}
          >
            {bundle.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <h4 className={`font-bold text-lg mb-3 ${bundle.popular ? 'text-white' : 'text-gray-900'}`}>
              {bundle.name}
            </h4>

            <ul className={`text-sm space-y-1 mb-4 ${bundle.popular ? 'text-white/90' : 'text-gray-700'}`}>
              {bundle.items.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-lg">✓</span> {item}
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between mb-3 pb-3 border-t border-opacity-20 border-white">
              <div>
                <p className={`text-xs opacity-75 ${bundle.popular ? 'text-white' : 'text-gray-600'}`}>
                  Was {bundle.originalPrice.toLocaleString()}
                </p>
                <p className={`text-2xl font-black ${bundle.popular ? 'text-white' : 'text-blue-600'}`}>
                  ₱{bundle.bundlePrice.toLocaleString()}
                </p>
              </div>
              <div className={`text-center px-3 py-2 rounded-lg ${
                bundle.popular
                  ? 'bg-white/20'
                  : 'bg-green-100'
              }`}>
                <p className={`text-xs font-bold ${bundle.popular ? 'text-white' : 'text-green-700'}`}>
                  Save
                </p>
                <p className={`text-xl font-black ${bundle.popular ? 'text-white' : 'text-green-600'}`}>
                  {bundle.savings_percent}%
                </p>
              </div>
            </div>

            <button className={`w-full py-2.5 rounded-lg font-bold transition-all ${
              bundle.popular
                ? 'bg-white text-blue-600 hover:bg-gray-100'
                : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}>
              Add Bundle
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 5: Seasonal Campaign Banner
// ==========================================
export const SeasonalCampaignBanner: React.FC = () => {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white rounded-xl p-6 shadow-2xl overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute animate-pulse top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div className="absolute animate-pulse bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold opacity-90 mb-1">🎉 NEW YEAR MEGA SALE</p>
          <h2 className="text-3xl sm:text-4xl font-black mb-2">UP TO 50% OFF!</h2>
          <p className="text-sm opacity-90">Limited time offer on premium peptides</p>
          <div className="flex gap-3 mt-4">
            <button className="bg-white text-red-600 px-6 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Shop Now
            </button>
            <button className="border-2 border-white text-white px-6 py-2 rounded-lg font-bold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        <div className="text-6xl hidden sm:block animate-bounce">🎊</div>

        <button
          onClick={() => setClosed(true)}
          className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
