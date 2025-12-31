import React, { useState } from 'react';
import { ChevronDown, CreditCard, Truck, Package, HelpCircle, Check, Star, ArrowRight, Phone, Mail, Clock, Shield, Zap, Globe, Award, Users, HeadphonesIcon, Send } from 'lucide-react';

const EnhancedFAQ: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const faqs = [
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, PayPal, GCash, Maya, and bank transfers. All transactions are encrypted and processed through our secure payment gateway with SSL encryption to ensure your financial information is protected. Your payment security is our top priority.",
      icon: CreditCard,
      category: "Payment",
      color: "from-purple-500 to-pink-500"
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping typically takes 2-3 business days within Metro Manila, 3-5 business days for provincial areas, and 7-14 business days for international orders. Express shipping options are available for next-day delivery. You'll receive real-time tracking information via email and SMS once your order ships.",
      icon: Truck,
      category: "Shipping",
      color: "from-blue-500 to-cyan-500"
    },
    {
      question: "What is your return policy?",
      answer: "We offer a comprehensive 30-day return window for most products in their original condition. Simply contact our customer service team to initiate a return. We'll provide you with a prepaid shipping label and process your refund within 5-7 business days. Your satisfaction is guaranteed!",
      icon: Package,
      category: "Returns",
      color: "from-green-500 to-emerald-500"
    },
    {
      question: "Are your products lab-tested and safe?",
      answer: "Absolutely! All our products undergo rigorous third-party lab testing to ensure 99%+ purity, quality, and safety. We provide certificates of analysis (COA) for all products, and our facilities follow strict GMP (Good Manufacturing Practice) guidelines. Your safety and satisfaction are our top priorities.",
      icon: Shield,
      category: "Quality",
      color: "from-yellow-500 to-orange-500"
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with tracking information and a direct link to monitor your package. You can also track your order by visiting our website's order tracking page and entering your order ID, email, or phone number. Real-time updates are available throughout the delivery process.",
      icon: Package,
      category: "Orders",
      color: "from-indigo-500 to-purple-500"
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide! International shipping rates and delivery times vary by destination. Customs and import duties may apply depending on your country's regulations. We provide all necessary documentation for international orders to ensure smooth customs clearance.",
      icon: Globe,
      category: "Shipping",
      color: "from-blue-500 to-cyan-500"
    }
  ];

  const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const getCategoryColor = (category: string) => {
    const categoryFAQ = faqs.find(faq => faq.category === category);
    return categoryFAQ?.color || 'from-gray-500 to-gray-600';
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
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <HelpCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold">Frequently Asked Questions</span>
            <Zap className="w-4 h-4 group-hover:animate-pulse" />
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Got Questions? <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-300%">We Have Answers</span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Find answers to common questions about our products, services, and policies
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              onMouseEnter={() => setHoveredCategory(category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`relative px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r text-white shadow-xl border-2 border-blue-300'
                  : 'bg-white text-gray-800 hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-xl'
              }`}
              style={{
                backgroundImage: selectedCategory === category ? `linear-gradient(to right, ${getCategoryColor(category).replace('from-', '').replace('to-', ', ')})` : 'none'
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                {category === 'All' ? (
                  <Star className="w-6 h-6 text-blue-600" />
                ) : (
                  faqs.find(f => f.category === category)?.icon && 
                  React.createElement(faqs.find(f => f.category === category)!.icon, { className: "w-6 h-6 text-blue-600" })
                )}
                <span className="font-medium text-blue-600">{category}</span>
              </span>
              {hoveredCategory === category && (
                <div className="absolute inset-0 rounded-full bg-blue-100 opacity-50 animate-pulse"
                />
              )}
              {selectedCategory === category && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full animate-ping shadow-lg" />
              )}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="max-w-5xl mx-auto space-y-6 mb-20">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden transform hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                style={{
                  backgroundImage: `linear-gradient(to right, ${faq.color.replace('from-', '').replace('to-', ', ')})`
                }}
              />
              <button
                onClick={() => toggleFAQ(index)}
                className="relative w-full px-8 py-8 text-left flex items-center justify-between hover:bg-gray-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center gap-6 flex-1">
                  <div className={`w-16 h-16 bg-gradient-to-r ${faq.color} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <faq.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {faq.question}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${faq.color} text-white shadow-md`}>
                        {faq.category}
                      </span>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>Quick answer</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                  activeIndex === index 
                    ? `bg-gradient-to-r ${faq.color} text-white rotate-180 shadow-lg` 
                    : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                }`}>
                  <ChevronDown className="w-6 h-6" />
                </div>
              </button>
              
              {activeIndex === index && (
                <div className="relative px-8 pb-8 border-t border-gray-100">
                  <div className="pt-6">
                    <p className="text-gray-700 text-lg leading-relaxed mb-6">{faq.answer}</p>
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${faq.color} text-white shadow-md animate-pulse`}>
                        <Check className="w-4 h-4" />
                        <span>Helpful answer</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Users className="w-4 h-4" />
                        <span>Found this helpful? Rate this answer</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 lg:p-12 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <HeadphonesIcon className="w-6 h-6" />
              <span className="text-lg font-bold">24/7 Customer Support</span>
            </div>
            
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Still Have Questions?</h3>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Can't find the answer you're looking for? Our customer support team is here to help you 24/7 with instant responses and expert assistance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a href="tel:+639123456789" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Phone className="w-5 h-5 group-hover:animate-bounce" />
                <span>Call Us Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="mailto:support@studypulse.com" className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-2xl hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <Mail className="w-5 h-5 group-hover:animate-pulse" />
                <span>Email Support</span>
                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Clock className="w-8 h-8 mb-3 text-yellow-300" />
                <h4 className="font-bold text-lg mb-2">Instant Response</h4>
                <p className="text-blue-100">Get answers within minutes, not hours</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Users className="w-8 h-8 mb-3 text-green-300" />
                <h4 className="font-bold text-lg mb-2">Expert Team</h4>
                <p className="text-blue-100">Knowledgeable support specialists</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <Award className="w-8 h-8 mb-3 text-purple-300" />
                <h4 className="font-bold text-lg mb-2">Satisfaction Guaranteed</h4>
                <p className="text-blue-100">We're here until you're satisfied</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-8 shadow-lg">
            <Star className="w-5 h-5" />
            <span className="font-bold">Trusted by Thousands</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-6 h-6 text-yellow-400 fill-current group-hover:animate-pulse" style={{ animationDelay: `${star * 0.1}s` }} />
                ))}
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">4.9/5</h4>
              <p className="text-gray-600">Customer Rating</p>
              <p className="text-sm text-gray-500 mt-2">Based on 2,500+ reviews</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">24/7 Support</h4>
              <p className="text-gray-600">Always Available</p>
              <p className="text-sm text-gray-500 mt-2">Instant response guaranteed</p>
            </div>
            
            <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">50+ Countries</h4>
              <p className="text-gray-600">Worldwide Shipping</p>
              <p className="text-sm text-gray-500 mt-2">Fast & secure delivery</p>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Shield className="w-4 h-4 text-green-500" />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md border border-gray-100">
              <Users className="w-4 h-4 text-purple-500" />
              <span>Expert Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedFAQ;
