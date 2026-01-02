import React from 'react';
import { Shield, Lock, TrendingUp, Users, Award, MapPin } from 'lucide-react';

const TrustSecuritySection: React.FC = () => {
  const trustPoints = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Bank-Level Security',
      description: 'SSL encrypted transactions and secure data storage'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Privacy Protected',
      description: 'Your personal information is never shared with third parties'
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'Quality Verified',
      description: 'All products meet international quality and purity standards'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Transparent Pricing',
      description: 'No hidden fees. What you see is what you pay'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Expert Support',
      description: '24/7 customer support team available in multiple languages'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: 'Fast Delivery',
      description: 'Nationwide shipping with real-time tracking'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trust & Security
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your safety and satisfaction are our top priorities. We maintain the highest standards in every transaction
          </p>
        </div>

        {/* Trust Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustPoints.map((point, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-600 flex items-center justify-center text-white mb-6">
                {point.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Compliance Info */}
        <div className="mt-16 bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <p className="text-gray-700 mb-4">
            All transactions are secure and compliant with international e-commerce standards
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <div className="text-sm font-semibold text-gray-700">
              SSL Certified
            </div>
            <div className="text-sm font-semibold text-gray-700">
              PCI DSS Compliant
            </div>
            <div className="text-sm font-semibold text-gray-700">
              GDPR Privacy Protected
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Money-Back Guarantee
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSecuritySection;
