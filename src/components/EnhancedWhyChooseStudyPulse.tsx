import React, { useState } from 'react';
import { Award, TrendingUp, Shield, Truck, Clock, Users, ChevronRight, ArrowRight, Check, Star } from 'lucide-react';

const EnhancedWhyChooseStudyPulse: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Lab-tested products with 99.9% purity guarantee and comprehensive quality control',
      stats: '99.9%',
      statsLabel: 'Purity Rate',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts and price match guarantee on all products',
      stats: '30%',
      statsLabel: 'Average Savings',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Express shipping worldwide with real-time tracking and discreet packaging',
      stats: '2-3',
      statsLabel: 'Days Delivery',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Secure Shopping',
      description: 'SSL encrypted transactions and buyer protection with secure payment gateways',
      stats: '100%',
      statsLabel: 'Secure Transactions',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Clock,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy with no questions asked and quick refunds',
      stats: '30',
      statsLabel: 'Day Returns',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Dedicated customer service team available round the clock for your assistance',
      stats: '24/7',
      statsLabel: 'Support Available',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white text-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 mb-6">
            <Star className="w-4 h-4" />
            <span className="text-sm font-medium">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Study Pulse</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the advantages that make us the preferred choice for premium research compounds and wellness products
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 cursor-pointer ${
                activeFeature === index ? 'ring-2 ring-blue-500' : ''
              }`}
              onMouseEnter={() => setActiveFeature(index)}
              onMouseLeave={() => setActiveFeature(-1)}
            >
              {/* Gradient Border Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}></div>
              
              <div className="relative z-10">
                {/* Icon and Stats */}
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">{feature.stats}</div>
                    <div className="text-sm text-gray-500">{feature.statsLabel}</div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Hover Arrow */}
                <div className="flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Trusted by Researchers Worldwide</h3>
            <p className="text-blue-100">Join thousands of satisfied customers who trust Study Pulse for their research needs</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '10,000+', label: 'Happy Customers' },
              { number: '50+', label: 'Countries Served' },
              { number: '99%', label: 'Satisfaction Rate' },
              { number: '24/7', label: 'Customer Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.number}</div>
                <div className="text-blue-100 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-blue-500/25">
            Get Started Today
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-gray-500 mt-4 text-sm">
            No commitment required • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default EnhancedWhyChooseStudyPulse;
