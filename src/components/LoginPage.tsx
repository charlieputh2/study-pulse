import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, Sparkles, Heart, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UniqueHeader from './UniqueHeader';
import UniqueFooter from './UniqueFooter';
import PasswordRecovery from './PasswordRecovery';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordRecovery, setShowPasswordRecovery] = useState(false);

  const navigate = useNavigate();
  const { login, loading } = useAuth();

  // Check if user is already logged in - redirect to dashboard
  useEffect(() => {
    const savedUser = localStorage.getItem('studyPulseUser');
    if (savedUser) {
      // User is already logged in, redirect to dashboard
      console.log('User already logged in, redirecting to dashboard');
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const result = await login(email, password);
      
      if (result.success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L21 7"/>
          </svg>
          <span>Login successful! Welcome back, ${result.user?.fullName || result.user?.email}!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col">
      {/* Real Header */}
      <UniqueHeader 
        cartItemsCount={0} 
        onCartClick={() => {}} 
        onMenuClick={() => navigate('/')}
      />

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-lg mx-auto">
          {showPasswordRecovery ? (
            <PasswordRecovery onBack={() => setShowPasswordRecovery(false)} />
          ) : (
            <>
              {/* Professional Hero Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl overflow-hidden">
                  <img
                    src="/logoo.jpg"
                    alt="Study Pulse"
                    className="w-20 h-20 object-cover rounded-2xl"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
                  Welcome Back
                </h1>
                <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                  Access your premium research solutions and continue your scientific journey
                </p>
                <div className="flex justify-center gap-3 mt-6">
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 rounded-full">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">Secure</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Premium</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 rounded-full">
                    <Star className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-700">Professional</span>
                  </div>
                </div>
              </div>

              {/* Login Card */}
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                {/* Error Alert */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-red-800 text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                      placeholder="juan@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Lock className="w-4 h-4 inline mr-2" />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-4 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPasswordRecovery(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5 mr-2" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Register Link */}
                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <a 
                      href="/register" 
                      className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                    >
                      Create Account
                    </a>
                  </p>
                </div>

                {/* Benefits */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    Why Login?
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                      <span>Save your information for faster checkout</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                      <span>Track your orders and delivery status</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                      <span>Access exclusive member benefits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                      <span>Get personalized recommendations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                      <span>Receive special offers and discounts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Real Footer - Ensure it's outside main and properly positioned */}
      <UniqueFooter />
    </div>
  );
};

export default LoginPage;
