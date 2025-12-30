import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CreditCard, Truck, Package, MessageCircle, HelpCircle, Check, Star, ArrowRight } from 'lucide-react';

const EnhancedFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, and secure online payment methods. All transactions are encrypted and processed through our secure payment gateway with SSL encryption to ensure your financial information is protected.",
      icon: CreditCard,
      category: "Payment"
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 2-3 business days within the continental US. Express shipping options are available for 1-2 day delivery. International shipping varies by location but usually takes 7-14 business days. You'll receive tracking information once your order ships, so you can monitor your package every step of the way.",
      icon: Truck,
      category: "Shipping"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a comprehensive 30-day return window for most products. Items must be in their original condition and packaging. Simply contact our customer service team to initiate a return. We'll provide you with a prepaid shipping label and process your refund within 5-7 business days of receiving the returned item.",
      icon: Package,
      category: "Returns"
    },
    {
      question: "Are your products lab-tested and safe?",
      answer: "Absolutely! All our products undergo rigorous third-party lab testing to ensure purity, quality, and safety. We provide certificates of analysis (COA) for all products, and our facilities follow strict GMP (Good Manufacturing Practice) guidelines. Your safety and satisfaction are our top priorities.",
      icon: Check,
      category: "Quality"
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with tracking information and a link to monitor your package. You can also track your order by logging into your account on our website or using our mobile app. Real-time updates are available throughout the delivery process.",
      icon: Package,
      category: "Orders"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by destination. Customs and import duties may apply depending on your country's regulations. We provide all necessary documentation for international orders to ensure smooth customs clearance.",
      icon: Truck,
      category: "Shipping"
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 mb-6">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">We Have Answers</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our products, services, and policies
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <faq.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{faq.question}</h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {faq.category}
                    </span>
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  activeIndex === index 
                    ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white rotate-180' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>
              
              {activeIndex === index && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="pt-4">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    <div className="mt-4 flex items-center gap-2 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Helpful answer</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-3xl p-8 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-green-100 mb-6">
              Can't find the answer you're looking for? Our customer support team is here to help you 24/7
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-3 px-6 py-3 bg-white text-green-600 font-bold rounded-xl hover:bg-green-50 transition-colors">
                <MessageCircle className="w-5 h-5" />
                Live Chat Support
              </button>
              <button className="inline-flex items-center gap-3 px-6 py-3 bg-green-700 text-white font-bold rounded-xl hover:bg-green-800 transition-colors">
                <ArrowRight className="w-5 h-5" />
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>4.9/5 Customer Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>24/7 Support Available</span>
            </div>
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              <span>Fast Worldwide Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFAQ;
