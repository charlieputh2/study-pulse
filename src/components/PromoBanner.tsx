import React from 'react';
import { Zap, X } from 'lucide-react';
import { useState } from 'react';

const PromoBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-center gap-4 relative">
          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute right-0 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close banner"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Promotion Content */}
          <div className="flex items-center gap-3 justify-center flex-1">
            <Zap className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm sm:text-base font-medium text-center">
              Limited Offer: New members get <strong>15% off</strong> on your first order
            </span>
            <button className="ml-2 px-3 py-1 bg-white text-blue-600 rounded-full text-xs sm:text-sm font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
