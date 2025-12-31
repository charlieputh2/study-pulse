import React, { useState } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Shield, Zap, Heart } from 'lucide-react';
import Swal from 'sweetalert2';

const EmailSubscription: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#fef3c7',
        iconColor: '#f59e0b'
      });
      return;
    }

    if (!validateEmail(email)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#fee2e2',
        iconColor: '#ef4444'
      });
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await fetch('/api/email/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubscribed(true);
        setEmail('');
        
        Swal.fire({
          icon: 'success',
          title: 'Successfully Subscribed!',
          html: `
            <div style="text-align: left;">
              <p style="margin-bottom: 15px;">Thank you for subscribing to Study Pulse newsletter!</p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                <h4 style="margin: 0 0 10px 0; color: #065f46;">✨ What you'll receive:</h4>
                <ul style="margin: 0; padding-left: 20px; color: #065f46;">
                  <li>Exclusive member-only discounts</li>
                  <li>First access to new arrivals</li>
                  <li>Latest research updates</li>
                  <li>Special promotions and deals</li>
                </ul>
              </div>
              <p style="margin: 0; font-size: 14px; color: #64748b;">Check your email for confirmation.</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Great!',
          confirmButtonColor: '#10b981',
          background: '#ffffff',
          iconColor: '#10b981'
        });
      } else {
        Swal.fire({
          icon: data.message.includes('already subscribed') ? 'info' : 'error',
          title: data.message.includes('already subscribed') ? 'Already Subscribed' : 'Subscription Failed',
          text: data.message,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
          background: data.message.includes('already subscribed') ? '#dbeafe' : '#fee2e2',
          iconColor: data.message.includes('already subscribed') ? '#3b82f6' : '#ef4444'
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Network Error',
        text: 'Failed to subscribe. Please try again later.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#fee2e2',
        iconColor: '#ef4444'
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isSubscribed) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-green-800 mb-2">Successfully Subscribed!</h4>
        <p className="text-green-600 text-sm">
          Thank you for joining our newsletter. Check your email for confirmation.
        </p>
        <button
          onClick={() => setIsSubscribed(false)}
          className="mt-4 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
        >
          Subscribe another email
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-xl p-6 border border-blue-400/20">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Mail className="w-5 h-5 text-blue-400" />
          Stay Connected
        </h3>
        <p className="text-blue-200 text-sm leading-relaxed">
          Get Exclusive Offers & Updates
        </p>
        <p className="text-blue-300 text-xs mt-2">
          Subscribe to receive special deals, new product announcements, and wellness tips
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-center gap-2 text-blue-200">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-xs">Exclusive Deals</span>
        </div>
        <div className="flex items-center gap-2 text-blue-200">
          <Shield className="w-4 h-4 text-green-400" />
          <span className="text-xs">Privacy First</span>
        </div>
        <div className="flex items-center gap-2 text-blue-200">
          <Heart className="w-4 h-4 text-red-400" />
          <span className="text-xs">New Arrivals</span>
        </div>
        <div className="flex items-center gap-2 text-blue-200">
          <CheckCircle className="w-4 h-4 text-blue-400" />
          <span className="text-xs">Unsubscribe Anytime</span>
        </div>
      </div>

      {/* Subscription Form */}
      <form onSubmit={handleSubscribe} className="space-y-4">
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="w-full px-4 py-3 pl-12 bg-white/10 backdrop-blur-sm border border-blue-400/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all"
            disabled={isSubscribing}
          />
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
        </div>

        <button
          type="submit"
          disabled={isSubscribing}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubscribing ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Subscribing...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Subscribe
            </>
          )}
        </button>
      </form>

      {/* Privacy Note */}
      <div className="mt-4 text-center">
        <p className="text-blue-300 text-xs">
          <Shield className="w-3 h-3 inline mr-1" />
          Your data is safe. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

export default EmailSubscription;
