import React, { useState } from 'react';
import { ChevronDown, CreditCard, Truck, Package, HelpCircle, Phone, Mail, Send, ArrowRight } from 'lucide-react';

interface CompactFAQProps {
  variant?: 'header' | 'footer';
  className?: string;
}

const CompactFAQ: React.FC<CompactFAQProps> = ({ variant = 'header', className = '' }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept credit cards, PayPal, GCash, Maya, and bank transfers.",
      icon: CreditCard,
      category: "Payment",
      color: "from-purple-500 to-pink-500"
    },
    {
      question: "How long does shipping take?",
      answer: "2-3 days Metro Manila, 3-5 days provincial, 7-14 days international.",
      icon: Truck,
      category: "Shipping",
      color: "from-blue-500 to-cyan-500"
    },
    {
      question: "What is your return policy?",
      answer: "30-day return window for products in original condition.",
      icon: Package,
      category: "Returns",
      color: "from-green-500 to-emerald-500"
    },
    {
      question: "Are your products lab-tested?",
      answer: "Yes! All products undergo third-party lab testing for 99%+ purity.",
      icon: HelpCircle,
      category: "Quality",
      color: "from-yellow-500 to-orange-500"
    },
    {
      question: "How do I track my order?",
      answer: "Visit our order tracking page and enter your order ID, email, or phone.",
      icon: Package,
      category: "Orders",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const displayFAQs = isExpanded ? faqs : faqs.slice(0, variant === 'header' ? 2 : 3);

  return (
    <div className={`${className}`}>
      {/* Header Version - Compact */}
      {variant === 'header' && (
        <div className="relative group">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
            <HelpCircle className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold">Quick FAQ</span>
            <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Dropdown Content */}
          <div className={`absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transition-all duration-300 z-50 ${
            isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}>
            <div className="p-4 max-h-96 overflow-y-auto">
              <div className="space-y-3">
                {displayFAQs.map((faq, index) => (
                  <div
                    key={index}
                    className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300"
                  >
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-8 h-8 bg-gradient-to-r ${faq.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <faq.icon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {faq.question}
                        </span>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {activeIndex === index && (
                      <div className="px-4 pb-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {faqs.length > displayFAQs.length && (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-base hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <span className="flex items-center justify-center gap-2">
                    <span>View All FAQs</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              )}
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <a
                    href="tel:+639123456789"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href="mailto:support@studypulse.com"
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Click outside to close */}
          {isExpanded && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsExpanded(false)}
            />
          )}
        </div>
      )}

      {/* Footer Version - Horizontal */}
      {variant === 'footer' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-gray-900">Quick Help</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {displayFAQs.map((faq, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-8 h-8 bg-gradient-to-r ${faq.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <faq.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                        activeIndex === index ? 'rotate-180' : ''
                      }`} />
                </button>
                
                {activeIndex === index && (
                  <div className="px-4 pb-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {faqs.length > displayFAQs.length && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-base hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center justify-center gap-2">
                <span>View All FAQs</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <a
              href="tel:+639123456789"
              className="group flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors"
            >
              <Phone className="w-4 h-4 group-hover:animate-bounce" />
              <span>Call Us</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="mailto:support@studypulse.com"
              className="group flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
            >
              <Mail className="w-4 h-4 group-hover:animate-pulse" />
              <span>Email Support</span>
              <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactFAQ;
