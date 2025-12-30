import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, MessageCircle, Sparkles, TrendingUp, Users, Award, Zap, Globe, Heart, Star, FileText, Calculator, Beaker, ClipboardList } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface UniqueHeroProps {
  onShopAll: () => void;
}

const UniqueHero: React.FC<UniqueHeroProps> = ({ onShopAll }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic stats counter
  const [stats, setStats] = useState({ products: 0, customers: 0, countries: 0, satisfaction: 0 });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({ products: 150, customers: 5000, countries: 25, satisfaction: 98 });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const testimonials = [
    { text: "Study Pulse transformed my research workflow completely!", author: "Dr. Sarah Chen", role: "Research Scientist" },
    { text: "The quality and consistency are unmatched in the market.", author: "Prof. Michael Torres", role: "University Lab Director" },
    { text: "Exceptional service and premium products every time.", author: "Dr. Emily Watson", role: "Clinical Researcher" }
  ];

  const features = [
    { icon: ShieldCheck, title: "Lab Certified", description: "ISO 9001 certified facilities" },
    { icon: Zap, title: "Fast Shipping", description: "2-3 day delivery worldwide" },
    { icon: Users, title: "Expert Support", description: "24/7 scientific assistance" },
    { icon: Award, title: "Premium Quality", description: "99.9% purity guaranteed" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-bold text-blue-200">
                {siteSettings?.hero_badge_text || 'Premium Research Solutions'}
              </span>
            </div>

            {/* Main Title */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="text-white">{siteSettings?.hero_title_prefix || 'Scientific'}</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  {siteSettings?.hero_title_highlight || 'Excellence'}
                </span>
                <br />
                <span className="text-white">{siteSettings?.hero_title_suffix || 'Delivered'}</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-blue-200 italic">
                {siteSettings?.hero_subtext || 'Where precision meets innovation in research'}
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-2xl">
              {siteSettings?.hero_description || 'Study Pulse is your premier destination for cutting-edge research compounds, peptides, and scientific supplies. We empower researchers worldwide with laboratory-grade quality, unmatched reliability, and revolutionary solutions that advance scientific discovery.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onShopAll}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-3">
                  <Globe className="w-5 h-5" />
                  Explore Products
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              
              <a
                href="https://t.me/+9jU8Q-FgVms5NjA1?fbclid=IwY2xjawO93V9leHRuA2FlbQIxMABicmlkETE3UTRaaTlnWWtybmFHUmk0c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHoAHCIZXlUTXQo_N4JcXqhl4Vhr2QMV7i8hGSy8xK5Aj41j0Q9-jGc0oOgrY_aem_-joyjDXQFn63ofL_EP4cOQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all duration-300 hover:-translate-y-1"
              >
                <span className="flex items-center justify-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  Join Community
                </span>
              </a>
            </div>

            {/* Live Testimonial */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 italic mb-2">
                    "{testimonials[activeTestimonial].text}"
                  </p>
                  <div>
                    <p className="text-white font-semibold">{testimonials[activeTestimonial].author}</p>
                    <p className="text-gray-400 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Navigation Links */}
          <div className={`space-y-8 transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            
            {/* Navigation Links Grid */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { 
                  href: "/research", 
                  label: "Research", 
                  icon: Beaker, 
                  color: "from-blue-500 to-cyan-500",
                  description: "Explore studies"
                },
                { 
                  href: "/protocols", 
                  label: "Protocols", 
                  icon: ClipboardList, 
                  color: "from-purple-500 to-pink-500",
                  description: "View guidelines"
                },
                { 
                  href: "/calculator", 
                  label: "Calculator", 
                  icon: Calculator, 
                  color: "from-green-500 to-emerald-500",
                  description: "Dosage tool"
                },
                { 
                  href: "/coa", 
                  label: "Lab Tests", 
                  icon: FileText, 
                  color: "from-orange-500 to-red-500",
                  description: "Quality reports"
                }
              ].map((nav, index) => (
                <a
                  key={index}
                  href={nav.href}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 block"
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${nav.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <nav.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1 group-hover:text-blue-200 transition-colors">
                    {nav.label}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {nav.description}
                  </div>
                </a>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-5 h-5 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="text-white font-semibold">{feature.title}</h4>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Trust Indicators */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-8 py-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-gray-300">
            <ShieldCheck className="w-5 h-5 text-green-400" />
            <span className="font-medium">SSL Secured</span>
          </div>
          <div className="hidden sm:flex w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2 text-gray-300">
            <Truck className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Global Shipping</span>
          </div>
          <div className="hidden sm:flex w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-5 h-5 text-purple-400" />
            <span className="font-medium">24/7 Support</span>
          </div>
          <div className="hidden sm:flex w-px h-5 bg-white/20" />
          <div className="flex items-center gap-2 text-gray-300">
            <Award className="w-5 h-5 text-yellow-400" />
            <span className="font-medium">Award Winning</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniqueHero;
