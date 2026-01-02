import React, { useState } from 'react';
import { 
  ShoppingBag, CheckCircle2,
  Truck, Lock, CreditCard,
  ArrowRight, X, Percent
} from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
  icon: string;
  badge?: string;
}

export const MobileOptimizedCheckout: React.FC<{ 
  items?: CartItem[];
  subtotal?: number;
}> = ({ 
  items = [
    { id: '1', name: 'BPC-157 10mg', price: 1200, quantity: 1 },
    { id: '2', name: 'Peptide Stack', price: 1800, quantity: 1 }
  ],
  subtotal = 3000
}) => {
  const [step, setStep] = useState(1);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [selectedShipping, setSelectedShipping] = useState('express');

  const shippingMethods: ShippingMethod[] = [
    { 
      id: 'standard', 
      name: 'Standard Delivery', 
      price: 0, 
      days: '5-7 business days',
      icon: '📦',
      badge: 'FREE'
    },
    { 
      id: 'express', 
      name: 'Express Delivery', 
      price: 150, 
      days: 'Next day',
      icon: '🚚',
      badge: 'FASTEST'
    },
    { 
      id: 'priority', 
      name: 'Priority 2-Hour', 
      price: 299, 
      days: 'Within 2 hours',
      icon: '⚡',
      badge: 'SAME DAY'
    }
  ];

  const coupons = {
    'WELCOME20': { discount: 20, minSpend: 0 },
    'PEPTIDE30': { discount: 30, minSpend: 2000 },
    'SAVE50': { discount: 50, minSpend: 3000 }
  };

  const shippingPrice = shippingMethods.find(m => m.id === selectedShipping)?.price || 0;
  const couponDiscount = appliedCoupon && coupons[appliedCoupon as keyof typeof coupons] 
    ? (coupons[appliedCoupon as keyof typeof coupons].discount * subtotal) / 100 
    : 0;
  const total = subtotal - couponDiscount + shippingPrice;

  const applyCoupon = () => {
    if (coupons[couponInput as keyof typeof coupons]) {
      setAppliedCoupon(couponInput);
      setCouponInput('');
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen pb-20">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-white border-b-4 border-blue-600 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-black text-gray-900">Checkout</h1>
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
              {items.length} items
            </span>
          </div>

          {/* Step Indicator */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className="flex-1">
                <div className={`h-2 rounded-full transition-all ${
                  s <= step ? 'bg-blue-600' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* ORDER SUMMARY - Always Visible */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              Order Summary
            </h3>
            <button className="text-blue-600 text-sm font-semibold">Edit</button>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-4 pb-4 border-b border-gray-200 max-h-32 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-gray-900">₱{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            {appliedCoupon && (
              <div className="flex justify-between text-green-600 font-semibold bg-green-50 -mx-4 px-4 py-2 rounded">
                <span>Discount ({appliedCoupon}):</span>
                <span>-₱{couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span className={shippingPrice === 0 ? 'text-green-600 font-bold' : ''}>
                {shippingPrice === 0 ? 'FREE' : `₱${shippingPrice.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between font-black text-lg pt-2 border-t-2 border-gray-200">
              <span>Total:</span>
              <span className="text-blue-600">₱{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: APPLY COUPON */}
        <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 ${step >= 1 ? 'border-blue-600' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Percent className="w-5 h-5 text-green-600" />
              Apply Coupon
            </h3>
            {step > 1 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>

          {!appliedCoupon ? (
            <div>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg font-semibold text-center uppercase focus:outline-none focus:border-blue-600"
                />
                <button
                  onClick={applyCoupon}
                  disabled={!couponInput}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-bold transition-colors"
                >
                  Apply
                </button>
              </div>
              <p className="text-xs text-gray-600">Try: WELCOME20, PEPTIDE30, SAVE50</p>
            </div>
          ) : (
            <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-bold text-green-900">{appliedCoupon} Applied!</p>
                <p className="text-sm text-green-700">Save ₱{couponDiscount.toLocaleString()}</p>
              </div>
              <button
                onClick={() => setAppliedCoupon(null)}
                className="text-green-600 hover:text-green-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* STEP 2: SELECT SHIPPING */}
        <div className={`bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 ${step >= 2 ? 'border-blue-600' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" />
              Delivery Method
            </h3>
            {step > 2 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
          </div>

          <div className="space-y-3">
            {shippingMethods.map(method => (
              <label
                key={method.id}
                className={`block cursor-pointer p-4 rounded-xl border-2 transition-all ${
                  selectedShipping === method.id
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <input
                      type="radio"
                      name="shipping"
                      value={method.id}
                      checked={selectedShipping === method.id}
                      onChange={() => setSelectedShipping(method.id)}
                      className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 flex items-center gap-2">
                        {method.icon} {method.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{method.days}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {method.badge && (
                      <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded mb-1">
                        {method.badge}
                      </span>
                    )}
                    <p className={`font-bold ${method.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
                      {method.price === 0 ? 'FREE' : `₱${method.price.toLocaleString()}`}
                    </p>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={() => setStep(3)}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Continue to Payment <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 3: PAYMENT METHOD */}
        {step >= 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 border-2 border-blue-600">
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Payment Method
            </h3>

            <div className="space-y-3">
              {['credit_card', 'debit_card', 'wallet', 'cod'].map(method => (
                <label
                  key={method}
                  className="block cursor-pointer p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" name="payment" className="w-5 h-5 accent-blue-600" />
                    <span className="font-semibold text-gray-900">
                      {method === 'credit_card' && '💳 Credit/Debit Card'}
                      {method === 'debit_card' && '🏦 Debit Card'}
                      {method === 'wallet' && '📱 E-Wallet'}
                      {method === 'cod' && '🚚 Cash on Delivery'}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={() => setStep(4)}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Place Order <CheckCircle2 className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 4: ORDER CONFIRMATION */}
        {step >= 4 && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 border-2 border-green-500">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">✅</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Order Confirmed!</h3>
              <p className="text-gray-600">Your order #ORD-2024-001234 has been placed</p>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              <p className="text-xl font-bold text-blue-600">Tomorrow by 6 PM</p>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-colors mb-3">
              Track Your Order
            </button>
            <button className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-xl font-bold transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </div>

      {/* Bottom Action Button - Always Sticky */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-blue-600 px-4 py-3 shadow-2xl">
          <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all active:scale-95">
            <Lock className="w-5 h-5" />
            {step === 1 && 'Continue to Shipping'}
            {step === 2 && 'Proceed to Payment'}
            {step === 3 && 'Confirm & Place Order'}
          </button>
        </div>
      )}
    </div>
  );
};

// Mobile-First Product Comparison
export const MobileProductComparison: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 text-center">
        <h3 className="text-xl font-black mb-2">Choose Your Perfect Peptide</h3>
        <p className="text-sm opacity-90">Compare features and benefits</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left p-4 font-bold">Feature</th>
              <th className="text-center p-4 font-bold">Standard</th>
              <th className="text-center p-4 font-bold">Premium</th>
              <th className="text-center p-4 font-bold">Elite</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: 'Purity %', standard: '95%', premium: '99%', elite: '99.9%' },
              { feature: 'Quantity', standard: '10mg', premium: '20mg', elite: '50mg' },
              { feature: 'Price', standard: '₱499', premium: '₱899', elite: '₱1,499' },
              { feature: 'Shipping', standard: '✓', premium: '✓ Free', elite: '✓ Express' },
              { feature: 'Lab Test', standard: '✓', premium: '✓ Included', elite: '✓ Included' }
            ].map((row, idx) => (
              <tr key={idx} className={idx % 2 ? 'bg-gray-50' : ''}>
                <td className="p-4 font-semibold text-gray-900">{row.feature}</td>
                <td className="p-4 text-center">{row.standard}</td>
                <td className="p-4 text-center font-bold text-blue-600">{row.premium}</td>
                <td className="p-4 text-center font-bold text-purple-600">{row.elite}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 space-y-2">
        {['standard', 'premium', 'elite'].map(tier => (
          <button key={tier} className={`w-full py-3 rounded-lg font-bold transition-all ${
            tier === 'premium' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'border-2 border-gray-300 hover:border-gray-400 text-gray-900'
          }`}>
            {tier === 'standard' && 'Add Standard to Cart'}
            {tier === 'premium' && 'Select Premium (POPULAR)'}
            {tier === 'elite' && 'Choose Elite'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileOptimizedCheckout;
