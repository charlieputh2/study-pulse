import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, X, Upload, FileText, Clock, CreditCard } from 'lucide-react';
import Swal from 'sweetalert2';

interface PaymentValidatorProps {
  onPaymentVerified: (paymentData: PaymentData) => void;
  onCancel: () => void;
}

interface PaymentData {
  method: string;
  referenceNumber: string;
  amount: number;
  timestamp: string;
}

const PaymentValidator: React.FC<PaymentValidatorProps> = ({ onPaymentVerified, onCancel }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validatePayment = async () => {
    if (!paymentMethod || !referenceNumber || !amount || !paymentProof) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill all required fields and upload payment proof.',
        icon: 'warning',
      });
      return;
    }

    // Validate reference number format
    const referenceRegex = /^[A-Z0-9]{6,}$/;
    if (!referenceRegex.test(referenceNumber.toUpperCase())) {
      Swal.fire({
        title: 'Invalid Reference Number',
        text: 'Reference number should be at least 6 alphanumeric characters.',
        icon: 'error',
      });
      return;
    }

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Swal.fire({
        title: 'Invalid Amount',
        text: 'Please enter a valid amount.',
        icon: 'error',
      });
      return;
    }

    setIsValidating(true);

    // Simulate payment validation (in real app, this would call your backend)
    setTimeout(() => {
      const paymentData: PaymentData = {
        method: paymentMethod,
        referenceNumber: referenceNumber.toUpperCase(),
        amount: numAmount,
        timestamp: new Date().toISOString(),
      };

      // Basic security checks
      const suspiciousPatterns = [
        /TEST/i,
        /DEMO/i,
        /FAKE/i,
        /SAMPLE/i,
        /123456/,
        /111111/,
        /000000/,
      ];

      const isSuspicious = suspiciousPatterns.some(pattern => 
        pattern.test(referenceNumber) || 
        pattern.test(paymentMethod) ||
        numAmount < 100 // Very low amounts might be test payments
      );

      if (isSuspicious) {
        Swal.fire({
          title: 'Payment Verification Failed',
          text: 'This payment appears to be a test or suspicious. Please use a real payment.',
          icon: 'error',
        });
        setIsValidating(false);
        return;
      }

      // Check if file is actually an image
      if (!paymentProof.type.startsWith('image/')) {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Please upload a valid image file (JPG, PNG, etc.)',
          icon: 'error',
        });
        setIsValidating(false);
        return;
      }

      // Check file size (max 5MB)
      if (paymentProof.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please upload an image smaller than 5MB.',
          icon: 'error',
        });
        setIsValidating(false);
        return;
      }

      setIsValidating(false);
      onPaymentVerified(paymentData);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          title: 'Invalid File Type',
          text: 'Please upload an image file (JPG, PNG, etc.)',
          icon: 'error',
        });
        return;
      }

      // Validate file size
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: 'File Too Large',
          text: 'Please upload an image smaller than 5MB.',
          icon: 'error',
        });
        return;
      }

      setPaymentProof(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Secure Payment Verification</h2>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-1">Security Notice</h3>
                <p className="text-sm text-amber-700">
                  For your security, we verify all payments. Fake or test payments will be rejected. 
                  Only upload genuine payment screenshots.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select payment method</option>
              <option value="GCASH">GCash</option>
              <option value="MAYA">Maya</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="PAYMAYA">PayMaya</option>
            </select>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Reference Number *
            </label>
            <input
              type="text"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              placeholder="Enter reference number from payment app"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Found in your payment app after successful transaction
            </p>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amount Paid (₱) *
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount paid"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Payment Proof Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Payment Proof Screenshot *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
                id="payment-proof"
              />
              <label
                htmlFor="payment-proof"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                {paymentProof ? (
                  <>
                    <FileText className="w-12 h-12 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">{paymentProof.name}</p>
                      <p className="text-sm text-gray-500">
                        {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Upload payment screenshot</p>
                      <p className="text-sm text-gray-500">JPG, PNG, GIF up to 5MB</p>
                    </div>
                  </>
                )}
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Upload a clear screenshot showing the payment details, reference number, and amount
            </p>
          </div>

          {/* Validation Checklist */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Security Checklist
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Reference number is visible and clear</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Payment amount matches order total</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Payment method is clearly shown</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">•</span>
                <span>Timestamp is visible (within last 24 hours)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex gap-4">
            <button
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={validatePayment}
              disabled={isValidating}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validating...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Payment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentValidator;
