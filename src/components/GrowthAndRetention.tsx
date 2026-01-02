import React, { useState } from 'react';
import { Copy, TrendingUp, Users, Facebook, Twitter, Mail } from 'lucide-react';
import Swal from 'sweetalert2';

// ==========================================
// COMPONENT 1: Referral Program
// ==========================================
export const ReferralProgramWidget: React.FC<{ userId?: string; userName?: string }> = ({ 
  userId = 'user123'
}) => {
  const referralLink = `https://studypulse.com?ref=${userId}`;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralData = {
    referred: 12,
    earned: 3600,
    nextReward: 500,
    nextReferralCount: 15
  };

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 sm:p-8 border-2 border-green-300 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-green-600" />
            Refer & Earn
          </h3>
          <p className="text-sm text-gray-600 mt-1">Get ₱300 for each friend who buys</p>
        </div>
        <div className="text-5xl">🎁</div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-green-600">{referralData.referred}</p>
          <p className="text-xs text-gray-600 mt-1">Friends Referred</p>
        </div>
        <div className="bg-white rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-blue-600">₱{referralData.earned.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">Earned So Far</p>
        </div>
      </div>

      {/* Next Reward */}
      <div className="bg-white rounded-xl p-4 mb-6">
        <p className="text-xs text-gray-600 mb-2">Next Bonus</p>
        <div className="flex items-end justify-between mb-2">
          <p className="text-2xl font-black text-green-600">₱{referralData.nextReward}</p>
          <p className="text-xs text-gray-600">{referralData.referred} / {referralData.nextReferralCount} referrals</p>
        </div>
        <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all"
            style={{ width: `${(referralData.referred / referralData.nextReferralCount) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Share Link */}
      <div className="bg-white rounded-xl p-4 mb-6 border-2 border-green-200">
        <p className="text-sm font-bold text-gray-900 mb-3">Your Referral Link:</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-1 px-4 py-3 bg-gray-100 rounded-lg text-sm font-mono border-none focus:outline-none cursor-pointer"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
          <Facebook className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Share</span>
        </button>
        <button className="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
          <Twitter className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Tweet</span>
        </button>
        <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg flex items-center justify-center gap-2 font-bold transition-colors">
          <Mail className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Email</span>
        </button>
      </div>

      {/* Referral Tiers */}
      <div className="mt-6 pt-6 border-t-2 border-green-300">
        <p className="text-sm font-bold text-gray-900 mb-4">Earn More with Tiers</p>
        <div className="space-y-3">
          {[
            { referrals: '1-5', bonus: '₱300/friend', level: 'Bronze' },
            { referrals: '6-15', bonus: '₱400/friend', level: 'Silver' },
            { referrals: '16-30', bonus: '₱500/friend', level: 'Gold' }
          ].map((tier, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-green-500">
              <div className="text-sm">
                <p className="font-bold text-gray-900">{tier.level}</p>
                <p className="text-xs text-gray-600">{tier.referrals} referrals</p>
              </div>
              <p className="font-bold text-green-600">{tier.bonus}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 2: Gamification Progress Tracker
// ==========================================
export const GamificationTracker: React.FC<{ 
  badges?: string[];
  achievements?: { name: string; icon: string; unlocked: boolean }[];
}> = ({ 
  badges = ['First Purchase', 'Product Reviewer', 'Wishlist Master', 'Loyalty Tier: Silver'],
  achievements = [
    { name: 'Welcome Purchase', icon: '🎉', unlocked: true },
    { name: 'Spend ₱5,000', icon: '💰', unlocked: true },
    { name: 'Write 5 Reviews', icon: '⭐', unlocked: false },
    { name: 'Refer 3 Friends', icon: '👥', unlocked: false },
    { name: 'Gold Tier Member', icon: '👑', unlocked: false },
    { name: 'VIP Lifetime', icon: '💎', unlocked: false }
  ]
}) => {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 border-2 border-purple-300">
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-purple-600" />
        Your Achievements
      </h3>

      {/* Current Badges */}
      <div className="mb-6">
        <p className="font-bold text-gray-900 mb-3">Current Badges</p>
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, idx) => (
            <span
              key={idx}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
            >
              ✓ {badge}
            </span>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {achievements.map((achievement, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl text-center transition-all cursor-pointer ${
              achievement.unlocked
                ? 'bg-white border-2 border-yellow-400 shadow-lg'
                : 'bg-gray-200/50 border-2 border-gray-300 opacity-50'
            }`}
          >
            <p className="text-3xl mb-2">{achievement.icon}</p>
            <p className="text-xs font-bold text-gray-900">{achievement.name}</p>
            {achievement.unlocked && (
              <p className="text-xs text-yellow-600 mt-2 font-bold">✓ Unlocked</p>
            )}
          </div>
        ))}
      </div>

      {/* Next Challenge */}
      <div className="mt-6 pt-6 border-t-2 border-purple-300 bg-white rounded-xl p-4">
        <p className="text-sm font-bold text-gray-900 mb-2">Next Challenge</p>
        <div className="space-y-2">
          <p className="text-sm text-gray-700">✓ Review 2 more products to unlock "Trusted Reviewer"</p>
          <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
            <div className="bg-purple-600 h-full" style={{ width: '60%' }}></div>
          </div>
          <p className="text-xs text-gray-600">3 of 5 reviews completed</p>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 3: Email Growth Campaign
// ==========================================
export const EmailSubscriptionBanner: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (email) {
      await Swal.fire({
        title: 'Welcome!',
        text: 'Check your email for exclusive deals and first access to flash sales!',
        icon: 'success',
        timer: 3000
      });
      setSubscribed(true);
    }
  };

  if (subscribed) {
    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl p-6 sm:p-8 text-center shadow-xl">
        <p className="text-4xl mb-2">✅</p>
        <p className="text-xl font-bold mb-2">You're Subscribed!</p>
        <p className="opacity-90">Expect exclusive deals and early access to flash sales</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 sm:p-8 shadow-xl overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute animate-pulse top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl sm:text-3xl font-black mb-2">Get Exclusive Deals</h3>
        <p className="text-sm opacity-90 mb-4">Join 50,000+ customers receiving special offers and flash sale alerts</p>

        <div className="flex gap-2 mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-300"
          />
          <button
            onClick={handleSubscribe}
            disabled={!email}
            className="bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 text-blue-900 px-6 py-3 rounded-lg font-bold transition-colors"
          >
            Subscribe
          </button>
        </div>

        <p className="text-xs opacity-75">✓ No spam • ✓ Unsubscribe anytime • ✓ 20% welcome discount</p>
      </div>
    </div>
  );
};

// ==========================================
// COMPONENT 4: Countdown Deal Timer
// ==========================================
export const CountdownDealTimer: React.FC<{ expiresAt?: Date }> = ({ 
  expiresAt = new Date(Date.now() + 24 * 3600000)
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else {
        setTimeLeft('EXPIRED');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return (
    <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl p-4 sm:p-6 flex items-center gap-4 shadow-lg">
      <div className="text-3xl">⏱️</div>
      <div className="flex-1">
        <p className="text-sm opacity-90">Deal Expires In:</p>
        <p className="text-2xl sm:text-3xl font-black font-mono">{timeLeft || 'Loading...'}</p>
      </div>
      <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition-colors whitespace-nowrap">
        Shop Now
      </button>
    </div>
  );
};

// ==========================================
// COMPONENT 5: Customer Testimonials
// ==========================================
export const CustomerTestimonials: React.FC = () => {
  const testimonials = [
    {
      name: 'Maria R.',
      location: 'Quezon City',
      rating: 5,
      text: 'Best quality peptides I\'ve found. Super fast delivery!',
      saved: '₱2,450',
      image: '👩'
    },
    {
      name: 'Carlos T.',
      location: 'Manila',
      rating: 5,
      text: 'Highly recommend. Great customer service and excellent products.',
      saved: '₱1,800',
      image: '👨'
    },
    {
      name: 'Anna L.',
      location: 'Cebu',
      rating: 5,
      text: 'Lab verified products with real results. Worth every peso!',
      saved: '₱3,200',
      image: '👩'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border-2 border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-6">What Customers Say</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-l-4 border-blue-600">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{testimonial.image}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{testimonial.name}</p>
                <p className="text-xs text-gray-600">{testimonial.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(testimonial.rating)].map((_, i) => (
                <span key={i} className="text-lg">⭐</span>
              ))}
            </div>

            <p className="text-sm text-gray-700 mb-3">"{testimonial.text}"</p>

            <div className="bg-white rounded-lg p-2 text-center border-2 border-green-500">
              <p className="text-xs text-gray-600">Saved</p>
              <p className="text-lg font-bold text-green-600">{testimonial.saved}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 mb-4">⭐⭐⭐⭐⭐ 4.8/5 rating from 5,234+ verified buyers</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors">
          See All Reviews
        </button>
      </div>
    </div>
  );
};

export default ReferralProgramWidget;
