import React from 'react';
import { MessageCircle, Heart, HelpCircle, Calculator, FileText, Truck, Phone, MapPin, Facebook, Shield } from 'lucide-react';
import { useCOAPageSetting } from '../hooks/useCOAPageSetting';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { coaPageEnabled } = useCOAPageSetting();

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-8">

          {/* Brand Section */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-100">
              <img
                src="/logoo.jpg"
                alt="Study Pulse"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <div className="font-bold text-theme-text text-lg tracking-tight">
                Study Pulse
              </div>
              <div className="text-xs text-gray-500">Fast orders • Secure payments • Real-time tracking</div>
            </div>
          </div>

          {/* Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-3">Quick Links</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <a href="/" className="hover:text-theme-accent transition-colors">Home</a>
                <a href="/products" className="hover:text-theme-accent transition-colors">Products</a>
                <a href="/appointments" className="hover:text-theme-accent transition-colors">Appointments</a>
                <a href="/orders" className="hover:text-theme-accent transition-colors">Orders</a>
                <a href="/tracking" className="hover:text-theme-accent transition-colors flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Real-time Tracking
                </a>
                <a href="/calculator" className="hover:text-theme-accent transition-colors flex items-center gap-2">
                  <Calculator className="w-4 h-4" /> Calculator
                </a>
                {coaPageEnabled && (
                  <a href="/coa" className="hover:text-theme-accent transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Lab Tests (COA)
                  </a>
                )}
                <a href="/faq" className="hover:text-theme-accent transition-colors flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> FAQ
                </a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-3">Contact</h3>
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-theme-accent mt-1" />
                  <span>BATASAN HILLS QUEZON CITY &amp; BRGY. IV MARIA AURORA-AURORA</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-theme-accent" />
                  <a href="mailto:Studypulse2022@gmail.com" className="hover:text-theme-accent transition-colors">
                    Studypulse2022@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-theme-accent" />
                  <a href="tel:+639303582023" className="hover:text-theme-accent transition-colors">
                    0930 358 2023
                  </a>
                </div>
              </div>
            </div>

            {/* Social & Legal */}
            <div>
              <h3 className="text-sm font-semibold text-theme-text mb-3">Connect</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-600">
                <a
                  href="https://web.facebook.com/profile.php?id=61552985195839&_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-theme-accent transition-colors flex items-center gap-2"
                >
                  <Facebook className="w-4 h-4" /> Facebook Page
                </a>
                <a
                  href="https://m.me/ch/AbZ5ZnRxCZkOhMiQ/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-theme-accent transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" /> Community Chat
                </a>
                <a href="/privacy" className="hover:text-theme-accent transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy & Terms
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-100 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {currentYear} Study Pulse Philippines. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Quality assured • Secure transactions • Fast delivery
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
