import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook, 
  MessageCircle, 
  Shield, 
  FileText, 
  ChevronUp,
  Clock,
  Truck,
  Award,
  Globe,
  Zap,
  Heart,
  Send,
  ArrowRight
} from 'lucide-react';
import EmailSubscription from './EmailSubscription';

const UniqueFooter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          
          {/* Main Footer Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              
              {/* Brand Section */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-white border-2 border-blue-400/30 p-0.5">
                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center">
                      <img
                        src="/logoo.jpg"
                        alt="Study Pulse"
                        className="w-10 h-10 object-cover rounded-full"
                      />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Study Pulse</h4>
                    <p className="text-sm text-blue-300">Premium E-Commerce</p>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Your trusted partner for premium research compounds, peptides, and scientific supplies. 
                  Quality-tested products with worldwide delivery.
                </p>

                {/* Trust Badges */}
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-300">SSL Secured</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                    <Award className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-300">Certified</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-400" />
                  Quick Links
                </h4>
                <ul className="space-y-3">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '#products', label: 'Products' },
                    { href: '/appointments', label: 'Appointments' },
                    { href: '/orders', label: 'Orders' },
                    { href: '/tracking', label: 'Real-time Tracking' },
                    { href: '/calculator', label: 'Calculator' },
                    { href: '/coa', label: 'Lab Tests (COA)' },
                    { href: '/faq', label: 'FAQ' }
                  ].map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center gap-2 group"
                      >
                        <ChevronUp className="w-3 h-3 rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  Services
                </h4>
                <ul className="space-y-3">
                  {[
                    { icon: Truck, label: 'Fast Shipping Worldwide', desc: '2-3 days delivery' },
                    { icon: Clock, label: '24/7 Support', desc: 'Always here to help' },
                    { icon: Shield, label: 'Quality Guarantee', desc: '99.9% purity' },
                    { icon: Award, label: 'Expert Team', desc: 'Scientific professionals' }
                  ].map((service, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <service.icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{service.label}</div>
                        <div className="text-gray-400 text-xs">{service.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Email Subscription */}
              <div>
                <EmailSubscription />
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-blue-400/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>© 2024 Study Pulse</span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">All rights reserved</span>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <a
                    href="/privacy"
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" />
                    Privacy Policy
                  </a>
                  <a
                    href="/terms"
                    className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-4 h-4" />
                    Terms of Service
                  </a>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  Made with <Heart className="w-4 h-4 text-red-400" /> for Research
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center z-40 group"
        >
          <ChevronUp className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
        </button>
      )}
    </>
  );
};

export default UniqueFooter;
