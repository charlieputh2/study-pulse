import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, Truck, Clock, MessageCircle } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface HeroProps {
  onShopAll: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopAll }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { siteSettings } = useSiteSettings();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Use settings or fallbacks if loading/missing
  const badgeText = siteSettings?.hero_badge_text || 'Premium Health & Wellness Store';
  const titlePrefix = siteSettings?.hero_title_prefix || 'Study';
  const titleHighlight = siteSettings?.hero_title_highlight || 'Pulse';
  const titleSuffix = siteSettings?.hero_title_suffix || 'Premium E-Commerce';
  const subtext = siteSettings?.hero_subtext || 'Trusted quality for modern health solutions.';
  const tagline = siteSettings?.hero_tagline || 'Premium products. Secure payments. Seamless experience.';
  const description = siteSettings?.hero_description || 'Study Pulse is a premium e-commerce platform offering carefully selected health, wellness, cosmetic, and medical-related products. Designed for convenience and reliability, our system provides fast ordering, secure payment processing, real-time order tracking, doctor appointment availability viewing, and accurate inventory management to ensure a smooth and professional shopping experience.';

  return (
    <div className="relative bg-[#FAFAFA] overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-gray-100/50 to-transparent pointer-events-none md:block hidden" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-theme-accent/5 rounded-full blur-3xl md:block hidden" />
      <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-50 rounded-full blur-3xl md:block hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20 lg:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-2 sm:px-0">

          {/* Text Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            {/* Badge */}
            <div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm mx-auto"
              data-animate="animate-scale"
              data-delay="200"
            >
              <span className="w-2 h-2 rounded-full bg-theme-accent animate-pulse" />
              <span className="text-xs font-bold tracking-wide uppercase text-gray-600">
                {badgeText}
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-theme-text leading-tight sm:leading-[1.1] tracking-tight">
                {titlePrefix} <span className="relative inline-block bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                  {titleHighlight}
                  <svg className="absolute w-full h-2 sm:h-3 -bottom-1 left-0 text-yellow-400/30 hidden sm:block" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5 L 100 0 Q 50 5 0 0 Z" fill="currentColor" />
                  </svg>
                </span>
                <br className="hidden sm:block" /> {titleSuffix}
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-gray-500 italic max-w-full sm:max-w-2xl mx-auto px-2 sm:px-0">
                {subtext}
              </p>
            </div>

            {/* Sub-headline/Tagline */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl shadow-soft border border-gray-100 max-w-full sm:max-w-xl mx-auto text-left">
              <div className="p-2 bg-theme-accent/10 rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-theme-accent" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wide mb-1">
                  Verified Excellence
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {tagline}
                </p>
              </div>
            </div>

            {/* Main Description */}
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-full sm:max-w-2xl mx-auto px-4 sm:px-0">
              {description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 justify-center px-4 sm:px-0">
              <button
                onClick={onShopAll}
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-navy-900 text-white rounded-xl font-bold shadow-lg shadow-navy-900/20 hover:shadow-xl hover:shadow-navy-900/30 hover:-translate-y-0.5 transition-all overflow-hidden text-sm sm:text-base w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  Shop All Products
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <a
                href="https://t.me/+9jU8Q-FgVms5NjA1?fbclid=IwY2xjawO93V9leHRuA2FlbQIxMABicmlkETE3UTRaaTlnWWtybmFHUmk0c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHoAHCIZXlUTXQo_N4JcXqhl4Vhr2QMV7i8hGSy8xK5Aj41j0Q9-jGc0oOgrY_aem_-joyjDXQFn63ofL_EP4cOQ"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#0088cc] to-[#0066aa] text-white rounded-xl font-bold shadow-lg shadow-[#0088cc]/20 hover:shadow-xl hover:shadow-[#0088cc]/30 hover:-translate-y-0.5 transition-all overflow-hidden text-sm sm:text-base w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Join Community
                </span>
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Truck className="w-4 h-4 text-green-500" />
                <span>Fast Shipping</span>
              </div>
              <div className="hidden sm:flex text-sm font-medium text-gray-500">
                <span className="w-1 h-4 bg-gray-200 mx-4 rounded-full" />
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>24/7 Support</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
