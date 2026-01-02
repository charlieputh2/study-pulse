import React from 'react';
import { Check, Crown, Zap, Gift } from 'lucide-react';

const PremiumSection: React.FC = () => {
  const features = [
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'Premium Membership',
      description: 'Unlock exclusive benefits and early access to new products',
      price: '₱499/month',
      benefits: [
        'Priority customer support',
        'Exclusive member pricing',
        'Free shipping on all orders',
        'Early access to new products'
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Loyalty Rewards',
      description: 'Earn points on every purchase and redeem for discounts',
      price: 'Free to join',
      benefits: [
        '1 point per ₱10 spent',
        'Redeem points for discounts',
        'Birthday month bonus',
        'Referral rewards'
      ]
    },
    {
      icon: <Gift className="w-8 h-8" />,
      title: 'Bulk Order Discount',
      description: 'Save more when you order in larger quantities',
      price: 'Volume discounts',
      benefits: [
        '10%+ off on bulk orders',
        'Custom packaging available',
        'Dedicated account manager',
        'Flexible payment terms'
      ]
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Maximize Your Value
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Exclusive premium features designed to enhance your shopping experience and deliver maximum savings
          </p>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <div className="text-blue-600">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>
              <p className="text-xl font-bold text-blue-600 mb-6">
                {feature.price}
              </p>

              {/* Benefits List */}
              <ul className="space-y-3 mb-8">
                {feature.benefits.map((benefit, bidx) => (
                  <li key={bidx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                Learn More
              </button>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <p className="text-blue-100">Active Members</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">₱500M+</div>
              <p className="text-blue-100">Total Orders Processed</p>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">98%</div>
              <p className="text-blue-100">Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
