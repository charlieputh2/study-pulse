import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, Sparkles, Heart, Star, Camera, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import UniqueHeader from './UniqueHeader';
import UniqueFooter from './UniqueFooter';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();
  const { register, loading } = useAuth();

  // Photo handling functions
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Please select an image under 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, or GIF)');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if user is already logged in - but allow access to register page
  useEffect(() => {
    const savedUser = localStorage.getItem('studyPulseUser');
    if (savedUser) {
      // User is already logged in, but don't auto-redirect
      // Let the user decide if they want to register a new account
      console.log('User already logged in, but staying on register page');
    }
  }, []);

  // Password strength calculator
  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      return;
    }

    try {
      const result = await register(email, password, fullName);
      
      if (result.success) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2';
        notification.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L21 7"/>
          </svg>
          <span>Account created successfully! Welcome to Study Pulse, ${fullName}!</span>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
        
        // Navigate to login page after successful registration
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
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
          {/* Professional Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl mb-8 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl overflow-hidden">
              <img
                src="/logoo.jpg"
                alt="Study Pulse"
                className="w-20 h-20 object-cover rounded-2xl"
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-green-800 to-emerald-900 bg-clip-text text-transparent mb-4">
              Create Account
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-md mx-auto leading-relaxed">
              Join thousands of researchers accessing premium peptide solutions worldwide
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

          {/* Register Card */}
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

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Photo Upload Section */}
              <div className="text-center mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Profile Photo (Optional)
                </label>
                <div className="relative inline-block">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-24 h-24 mx-auto cursor-pointer group"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full rounded-2xl object-cover border-4 border-green-500 shadow-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl border-4 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-green-400 hover:bg-green-50 transition-all group-hover:scale-105">
                        <Camera className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium">Upload Photo</span>
                        <Upload className="w-4 h-4 text-gray-400 absolute bottom-2 right-2" />
                      </div>
                    )}
                    {photoPreview && (
                      <button
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    JPG, PNG or GIF (Max 5MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg"
                  placeholder="Juan Dela Cruz"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg"
                  placeholder="juan@example.com"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Password *
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 inline mr-2" />
                  Confirm Password *
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-lg"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-3">Password Strength</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength === 0 ? 'text-red-500' :
                      passwordStrength <= 25 ? 'text-orange-500' :
                      passwordStrength <= 50 ? 'text-yellow-500' :
                      passwordStrength <= 75 ? 'text-blue-500' : 'text-green-500'
                    }`}>
                      {passwordStrength === 0 ? 'Very Weak' :
                       passwordStrength <= 25 ? 'Weak' :
                       passwordStrength <= 50 ? 'Fair' :
                       passwordStrength <= 75 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength === 0 ? 'bg-red-500' :
                        passwordStrength <= 25 ? 'bg-orange-500' :
                        passwordStrength <= 50 ? 'bg-yellow-500' :
                        passwordStrength <= 75 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    ></div>
                  </div>
                </div>
                <ul className="text-xs text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {password.length >= 8 && <span className="text-white text-xs">✓</span>}
                    </div>
                    At least 8 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      password.length >= 12 ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {password.length >= 12 && <span className="text-white text-xs">✓</span>}
                    </div>
                    12+ characters (recommended)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {/[A-Z]/.test(password) && <span className="text-white text-xs">✓</span>}
                    </div>
                    One uppercase letter
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      /[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {/[0-9]/.test(password) && <span className="text-white text-xs">✓</span>}
                    </div>
                    One number
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      password !== confirmPassword ? 'bg-gray-300' : 'bg-green-500'
                    }`}>
                      {password !== confirmPassword ? '' : <span className="text-white text-xs">✓</span>}
                    </div>
                    Passwords match
                  </li>
                </ul>
              </div>

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
                />
                <label htmlFor="terms" className="text-sm text-gray-700 ml-2">
                  I agree to the{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 underline transition-colors">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-green-600 hover:text-green-700 underline transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <a 
                  href="/login" 
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  Sign In
                </a>
              </p>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-3 text-sm flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-500" />
                Why Join Study Pulse?
              </h3>
              <ul className="text-sm text-green-800 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Save your information for faster checkout</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Track your orders and delivery status</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Access exclusive member benefits</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Get personalized recommendations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>Receive special offers and discounts</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Real Footer - Ensure it's outside main and properly positioned */}
      <UniqueFooter />
    </div>
  );
};

export default RegisterPage;
