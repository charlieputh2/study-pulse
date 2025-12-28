import React from 'react';
import { ShoppingBag, DollarSign, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';

const WhyChooseStudyPulse: React.FC = () => {
  const features = [
    {
      icon: ShoppingBag,
      title: 'Wide Selection',
      description: 'Browse through thousands of products from trusted sellers'
    },
    {
      icon: DollarSign,
      title: 'Best Prices',
      description: 'Compare prices and get the best deals available online'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Quick shipping directly to your doorstep within 2-3 days'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'SSL encrypted checkout and buyer protection guarantee'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return window with no questions asked policy'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Dedicated customer service team always ready to help'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12"
             data-animate="animate-slide-right"
             data-delay="200"
           >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Why Choose Study Pulse?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
            Discover the advantages that make us the preferred choice for health and wellness products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative bg-white p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                data-animate="animate-scale"
                data-delay={index * 150}
              >
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
                    {feature.description}
                  </p>
                </div>
                
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-purple-50/0 group-hover:from-blue-50/50 group-hover:to-purple-50/50 rounded-2xl transition-all duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseStudyPulse;
