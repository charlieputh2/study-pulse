import React from 'react';
import { ShoppingBag, DollarSign, Truck, Shield, RotateCcw, Headphones, HelpCircle } from 'lucide-react';

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

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-20">
          <div className="text-center mb-8 sm:mb-12"
               data-animate="animate-slide-right"
               data-delay="800"
             >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2 sm:px-0">
              Get answers to common questions about our products and services
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                   data-animate="animate-scale"
                   data-delay="900">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What payment methods do you accept?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We accept all major credit cards, debit cards, and secure online payment methods. All transactions are encrypted and processed through our secure payment gateway.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                   data-animate="animate-scale"
                   data-delay="1000">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      How long does shipping take?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Standard shipping typically takes 2-3 business days. Express shipping options are available for faster delivery. You'll receive tracking information once your order ships.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                   data-animate="animate-scale"
                   data-delay="1100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      What is your return policy?
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      We offer a 30-day return window for most products. Items must be in their original condition. Please contact our customer service team to initiate a return.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  View All FAQs
                  <HelpCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseStudyPulse;
