import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2, Shield, Sparkles, Heart, Star, Camera, Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  // Photo handling functions
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image under 5MB',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          background: '#fee2e2',
          iconColor: '#ef4444'
        });
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select an image file (JPG, PNG, or GIF)',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          background: '#fee2e2',
          iconColor: '#ef4444'
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhoto(null);
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
    setIsLoading(true);

    // Validation
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // Send as JSON to avoid FormData issues
      const userData = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        confirmPassword: confirmPassword,
        acceptTerms: acceptTerms.toString()
      };
      
      console.log('Sending user data:', { ...userData, password: '***', confirmPassword: '***' });

      // Show loading notification
      Swal.fire({
        title: 'Creating Account...',
        html: `
          <div style="text-align: center;">
            <div class="loader"></div>
            <p style="color: #6b7280; margin-top: 1rem;">Setting up your account...</p>
            <div style="margin-top: 1rem; font-size: 0.875rem; color: #64748b;">
              ${photo ? '<p>📷 Uploading profile photo...</p>' : '<p>📝 Processing your information...</p>'}
            </div>
          </div>
        `,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
        backdrop: 'rgba(0,0,0,0.5)',
      });

      // API call to register user with timeout and retry
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
          
          // Use Render backend for production, localhost for development
          const isDevelopment = import.meta.env.DEV || window.location.hostname === 'localhost';
          const apiUrl = isDevelopment 
            ? '/api/users/register' 
            : 'https://study-pulse-b7du.onrender.com/api/users/register';
          
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          console.log('Registration response status:', response.status);
          console.log('Registration response headers:', response.headers);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('Registration error response:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }

          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            console.error('JSON parsing error:', jsonError);
            throw new Error('Invalid server response');
          }

          if (data.success) {
            // Store user in localStorage
            localStorage.setItem('studyPulseUser', JSON.stringify(data.user));
            
            // Send welcome email in background (don't wait for it)
            // Email is now handled asynchronously in the backend to avoid blocking registration

            // Show success notification
            await Swal.fire({
              icon: 'success',
              title: 'Account Created Successfully',
              html: `
                <div style="text-align: center; animation: fadeIn 0.5s;">
                  <p style="color: #374151; margin-bottom: 0.5rem; font-size: 1.1rem;">
                    Welcome to Study Pulse, <strong style="color: #10b981;">${fullName}</strong>!
                  </p>
                  <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                    <p style="color: #059669; font-size: 0.9rem;"> Account created successfully</p>
                    <p style="color: #059669; font-size: 0.9rem;"> Welcome email will be sent shortly</p>
                    <p style="color: #059669; font-size: 0.9rem;"> Ready to shop</p>
                    ${photo ? '<p style="color: #059669; font-size: 0.9rem;"> Profile photo uploaded</p>' : ''}
                  </div>
                  <p style="color: #6b7280; font-size: 0.875rem;">Redirecting to login page...</p>
                </div>
              `,
              timer: 2000,
              timerProgressBar: true,
              confirmButtonColor: '#10b981',
              backdrop: 'rgba(0,0,0,0.5)',
              showClass: {
                popup: 'animate__animated animate__fadeInDown'
              },
              hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
              }
            });
            
            // Navigate to login page after successful registration
            setTimeout(() => navigate('/login'), 2000);
            break; // Exit retry loop on success
          } else {
            setError(data.message || 'Registration failed');
            await Swal.fire({
              icon: 'error',
              title: ' Registration Failed',
              text: data.message || 'Unable to create your account. Please try again.',
              confirmButtonColor: '#ef4444',
              backdrop: 'rgba(0,0,0,0.5)',
              showClass: {
                popup: 'animate__animated animate__shakeX'
              }
            });
            break; // Exit retry loop on failure
          }
        } catch (fetchError: any) {
          console.error('Fetch error (attempt', retryCount + 1, '):', fetchError);
          if (retryCount === maxRetries) {
            // Final attempt failed, show error
            Swal.close();
            let errorMessage = 'Registration failed. Please try again.';
            
            if (fetchError?.name === 'AbortError') {
              errorMessage = 'Request timed out. Please check your connection and try again.';
            } else if (fetchError?.message && fetchError.message.includes('Failed to fetch')) {
              errorMessage = 'Network error. Please check your internet connection.';
            } else if (fetchError?.message) {
              errorMessage = fetchError.message;
            }
            
            setError(errorMessage);
            await Swal.fire({
              icon: 'error',
              title: ' Error',
              text: errorMessage,
              confirmButtonColor: '#ef4444',
              backdrop: 'rgba(0,0,0,0.5)',
            });
          } else {
            // Retry after delay
            retryCount++;
            if (retryCount <= maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      Swal.close();
      
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message && error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      await Swal.fire({
        icon: 'error',
        title: '❌ Error',
        text: errorMessage,
        confirmButtonColor: '#ef4444',
        backdrop: 'rgba(0,0,0,0.5)',
      });
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
              >
                {isLoading ? (
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
