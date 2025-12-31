import React, { useState } from 'react';
import { Mail, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

interface PasswordRecoveryProps {
  onBack: () => void;
}

const PasswordRecovery: React.FC<PasswordRecoveryProps> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/email/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setStep('otp');
        Swal.fire({
          icon: 'success',
          title: 'OTP Sent!',
          html: `
            <div style="text-align: left;">
              <p style="margin-bottom: 15px;">A 6-digit OTP has been sent to:</p>
              <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                <strong style="color: #1e40af;">${data.email}</strong>
              </div>
              <p style="margin: 0; font-size: 14px; color: #64748b;">Check your email and enter the code below.</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #ef4444;">⚠️ Code expires in 10 minutes</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Got it',
          confirmButtonColor: '#3b82f6',
          background: '#ffffff',
          iconColor: '#3b82f6'
        });
      } else {
        setError(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otp.trim() || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/email/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          html: `
            <div style="text-align: center;">
              <div style="width: 60px; height: 60px; background: #d1fae5; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                <svg width="30" height="30" fill="#065f46" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </div>
              <p style="margin-bottom: 15px;">Your password has been reset successfully!</p>
              <p style="margin: 0; font-size: 14px; color: #64748b;">You can now login with your new password.</p>
            </div>
          `,
          showConfirmButton: true,
          confirmButtonText: 'Go to Login',
          confirmButtonColor: '#10b981',
          background: '#ffffff',
          iconColor: '#10b981'
        }).then(() => {
          onBack();
        });
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    
    // Length
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    
    // Complexity
    if (/[A-Z]/.test(password)) strength += 12.5;
    if (/[0-9]/.test(password)) strength += 12.5;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    return Math.min(strength, 100);
  };

  const passwordStrength = calculatePasswordStrength(newPassword);

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-gray-100 hover:shadow-3xl transition-all duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>
        
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 rounded-3xl shadow-2xl mb-6 transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
          <Mail className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-4">
          Password Recovery
        </h2>
        
        <p className="text-gray-600 text-lg">
          {step === 'email' && 'Enter your email to receive a password reset code'}
          {step === 'otp' && 'Enter the 6-digit code sent to your email'}
          {step === 'reset' && 'Create your new password'}
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step === 'email' ? 'bg-blue-600 text-white' : 
            step === 'otp' || step === 'reset' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {step === 'email' ? '1' : '✓'}
          </div>
          <div className={`w-12 h-1 transition-all ${
            step === 'otp' || step === 'reset' ? 'bg-green-600' : 'bg-gray-300'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step === 'otp' ? 'bg-blue-600 text-white' : 
            step === 'reset' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            {step === 'otp' ? '2' : step === 'reset' ? '✓' : '2'}
          </div>
          <div className={`w-12 h-1 transition-all ${
            step === 'reset' ? 'bg-green-600' : 'bg-gray-300'
          }`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
            step === 'reset' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800 text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Step 1: Email Input */}
      {step === 'email' && (
        <form onSubmit={handleSendOTP} className="space-y-6">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending OTP...
              </>
            ) : (
              <>
                <Mail className="w-5 h-5 mr-2" />
                Send Reset Code
              </>
            )}
          </button>
        </form>
      )}

      {/* Step 2: OTP Verification */}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg text-center text-2xl font-mono"
              placeholder="000000"
              maxLength={6}
              required
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
              placeholder="Enter new password"
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
              Confirm New Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-lg"
              placeholder="Confirm new password"
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

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700">Password Strength</span>
                <span className={`text-xs font-medium ${
                  passwordStrength <= 25 ? 'text-red-500' :
                  passwordStrength <= 50 ? 'text-orange-500' :
                  passwordStrength <= 75 ? 'text-yellow-500' : 'text-green-500'
                }`}>
                  {passwordStrength <= 25 ? 'Weak' :
                   passwordStrength <= 50 ? 'Fair' :
                   passwordStrength <= 75 ? 'Good' : 'Strong'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength <= 25 ? 'bg-red-500' :
                    passwordStrength <= 50 ? 'bg-orange-500' :
                    passwordStrength <= 75 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength}%` }}
                ></div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] text-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Reset Password
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep('email')}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Didn't receive the code? Try again
            </button>
          </div>
        </form>
      )}

      {/* Security Tips */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm flex items-center gap-2">
          🔒 Security Tips
        </h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Never share your OTP code with anyone</li>
          <li>• Study Pulse staff will never ask for your OTP</li>
          <li>• Use a strong password with letters, numbers, and symbols</li>
          <li>• This OTP code expires in 10 minutes</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordRecovery;
