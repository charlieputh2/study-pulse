import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Mail, 
  Clock, 
  Building, 
  Globe, 
  Send,
  ArrowRight,
  Star,
  Shield,
  Users,
  Zap
} from 'lucide-react';

const UniqueLocationSection: React.FC = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6">
              <MapPin className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-200">Visit Our Location</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Find Us in the Heart of
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Quezon City
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Visit our headquarters and experience premium service in person. We're conveniently located in Metro Manila with easy access from all major areas.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
            
            {/* Enhanced Map Section */}
            <div className="space-y-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Interactive Map
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Live Location</span>
                  </div>
                </div>
                
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3860.8172439367!2d121.0509385!3d14.6487853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397ba0942ef7375:0x4a9a32d9fe083d40!2sQuezon+City,+Metro+Manila!5e0!3m2!1sen!2sph!4v1234567890"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full min-h-[400px] lg:min-h-[450px]"
                    title="Study Pulse Location - Quezon City"
                    onLoad={() => setMapLoaded(true)}
                  />
                  
                  {/* Map Overlay */}
                  {!mapLoaded && (
                    <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-300">Loading map...</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Study+Pulse+Quezon+City+Metro+Manila"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-300 hover:text-blue-200 transition-colors text-sm"
                  >
                    <Navigation className="w-4 h-4" />
                    View on Google Maps
                  </a>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Real-time traffic</span>
                  </div>
                </div>
              </div>

              {/* Location Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <Building className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-green-300">Easy Access</span>
                  </div>
                  <p className="text-xs text-gray-400">Major roads nearby</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-blue-300">Secure Area</span>
                  </div>
                  <p className="text-xs text-gray-400">Safe neighborhood</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-purple-300">Friendly Staff</span>
                  </div>
                  <p className="text-xs text-gray-400">Always ready to help</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-orange-400" />
                    </div>
                    <span className="text-sm font-medium text-orange-300">Fast Service</span>
                  </div>
                  <p className="text-xs text-gray-400">Quick assistance</p>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Section */}
            <div className="space-y-6">
              {/* Main Contact Card */}
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Get in Touch</h3>
                    <p className="text-gray-300">We're here to help you</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <MapPin className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">Address</h4>
                        <p className="text-gray-300 leading-relaxed">
                          BATASAN HILLS<br />
                          QUEZON CITY, Metro Manila<br />
                          Philippines
                        </p>
                        <a
                          href="https://www.google.com/maps/dir/?api=1&destination=Study+Pulse+Quezon+City"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-blue-300 hover:text-blue-200 transition-colors text-sm"
                        >
                          <Navigation className="w-4 h-4" />
                          Get Directions
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Phone className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">Phone</h4>
                        <a
                          href="tel:+639303582023"
                          className="text-gray-300 hover:text-white transition-colors text-lg"
                        >
                          +63 930 358 2023
                        </a>
                        <p className="text-gray-400 text-sm mt-1">Available 24/7 for emergencies</p>
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="group">
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-2">Email</h4>
                        <a
                          href="mailto:studypulse2022@gmail.com"
                          className="text-gray-300 hover:text-white transition-colors text-lg break-all"
                        >
                          studypulse2022@gmail.com
                        </a>
                        <p className="text-gray-400 text-sm mt-1">Quick response guaranteed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">Business Hours</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span>Monday - Friday</span>
                      <span className="text-blue-300">9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Saturday</span>
                      <span className="text-blue-300">9:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Sunday</span>
                      <span className="text-red-400">Closed</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <a
                  href="tel:+639303582023"
                  className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-green-500/25"
                >
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">Call Now</span>
                </a>
                <a
                  href="mailto:studypulse2022@gmail.com"
                  className="group flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/25"
                >
                  <Mail className="w-5 h-5" />
                  <span className="font-semibold">Email Us</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-white">Why Visit Us?</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">See products in person</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Expert consultation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Immediate pickup available</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">Build personal relationships</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueLocationSection;
