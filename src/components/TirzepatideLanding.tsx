import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Shield, 
  Truck, 
  Beaker, 
  Award,
  Star,
  Users,
  Clock,
  Package,
  Heart,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TermsModal from './TermsModal';
import AdvancedCarousel from './AdvancedCarousel';
import ScrollAnimation from './ScrollAnimation';
import ParallaxSection from './ParallaxSection';

const TirzepatideLanding: React.FC = () => {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const productImages = [
    '/TIRZEPATIDE1.png',
    '/TIRZEPATIDE2.png'
  ];

  const proofImages = [
    '/proofandlegitmacy3.jfif',
    '/proofandlegitmacy1.jfif',
    '/proofandlegitmacy.jfif',
    '/proofandlegitmacy8.png',
    '/proofandlegitmacy7.png',
    '/proofandlegitmacy6.png',
    '/proofandlegitmacy5.png'
  ];

  const feedbackImages = [
    '/feedback.jfif',
    '/feedback3.jfif',
    '/feedback4.jfif',
    '/feedback5.jfif',
    '/feedback6.png',
    '/feedback7.png',
    '/feedbak1.jfif',
    '/feedback3.png'
  ];

  const protocolImages = [
    '/protocols1.jfif',
    '/protocols.jfif'
  ];

  useEffect(() => {
    // Check if terms have been accepted in this session
    const termsAccepted = sessionStorage.getItem('tirzepatide-terms-accepted');
    if (!termsAccepted) {
      setShowTermsModal(true);
      setHasAcceptedTerms(false);
    } else {
      setHasAcceptedTerms(true);
    }

    // Auto-rotate images only on desktop
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      // Adjust auto-rotation based on screen size if needed
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAcceptTerms = () => {
    setHasAcceptedTerms(true);
    setShowTermsModal(false);
    sessionStorage.setItem('tirzepatide-terms-accepted', 'true');
  };

  const handleDeclineTerms = () => {
    setShowTermsModal(false);
    // Redirect away or show alternative content
    window.location.href = '/home';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev: number) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev: number) => (prev - 1 + productImages.length) % productImages.length);
  };
  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Dual Action Formula",
      description: "Targets both GIP and GLP-1 receptors for enhanced efficacy"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Superior Weight Loss",
      description: "Clinical studies show up to 22% body weight reduction"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Cardiovascular Benefits",
      description: "Improves cardiovascular health markers"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Once Weekly Dosing",
      description: "Convenient weekly administration schedule"
    }
  ];

  const features = [
    "Pharmaceutical Grade Purity",
    "Rigorous Third-Party Testing",
    "Stability Guaranteed",
    "Fast Worldwide Shipping",
    "Discreet Packaging",
    "24/7 Customer Support"
  ];

  const specifications = [
    { label: "Purity", value: "≥99%" },
    { label: "Form", value: "Lyophilized Powder" },
    { label: "Storage", value: "-20°C" },
    { label: "Reconstitution", value: "Bacteriostatic Water" },
    { label: "Administration", value: "Subcutaneous Injection" },
    { label: "Frequency", value: "Once Weekly" }
  ];

  return (
    <>
      <TermsModal
        isOpen={showTermsModal}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
      
      {hasAcceptedTerms && (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <ParallaxSection className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50" speed={0.3}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="slideLeft" delay={0.2}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    <Beaker className="w-4 h-4" />
                    Premium Research Peptide
                  </motion.div>
                  <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Tirzepatide
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                      {" "}Advanced
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Revolutionary dual GIP/GLP-1 receptor agonist for advanced metabolic research. 
                    Experience the next generation in peptide science with our pharmaceutical-grade formulation.
                  </p>
                </div>
                
                <ScrollAnimation animation="fadeUp" delay={0.4}>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to="/shop"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        Order Now
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link 
                        to="/coa"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
                      >
                        <Award className="w-5 h-5" />
                        View COA
                      </Link>
                    </motion.div>
                  </div>
                </ScrollAnimation>

                <ScrollAnimation animation="fadeUp" delay={0.6}>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span>10,000+ Researchers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span>Certified Quality</span>
                    </div>
                  </div>
                </ScrollAnimation>
              </div>
            </ScrollAnimation>

            {/* Product Image Carousel */}
            <ScrollAnimation animation="slideRight" delay={0.3}>
              <div className="relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-3xl transform rotate-3"
                  animate={{ rotate: [3, 5, 3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Image Carousel */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={productImages[currentImageIndex]}
                        alt={`Tirzepatide Product ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                      />
                    </AnimatePresence>
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                    
                    {/* Navigation Buttons */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {productImages.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex 
                              ? 'bg-white w-8' 
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* Product Info Badge */}
                  <motion.div 
                    className="absolute top-4 right-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    99.9% Pure
                  </motion.div>
                </motion.div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </ParallaxSection>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Tirzepatide?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Backed by cutting-edge research and manufactured to the highest standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className={`group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 animate-stagger animate-stagger-${index + 1}`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
              <Package className="w-4 h-4" />
              Product Gallery
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Premium Tirzepatide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pharmaceutical-grade formulation with verified purity and potency
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {productImages.map((image, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={image}
                    alt={`Tirzepatide Product View ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {index === 0 ? 'Front View' : 'Detail View'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {index === 0 
                          ? 'Professional packaging with clear labeling and dosage information'
                          : 'High-quality vial with secure sealing for maximum potency preservation'
                        }
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          {index === 0 ? '10mg Vial' : 'Laboratory Grade'}
                        </span>
                        <button
                          onClick={() => setCurrentImageIndex(index)}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                        >
                          <ZoomIn className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Gallery Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Packaging</h3>
              <p className="text-gray-600 text-sm">Tamper-evident seals ensure product integrity</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lab Verified</h3>
              <p className="text-gray-600 text-sm">Third-party tested for purity and potency</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Climate Controlled</h3>
              <p className="text-gray-600 text-sm">Optimal storage conditions maintained</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Premium Quality Assurance
              </h2>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              <Link 
                to="/coa"
                className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                View Certificate of Analysis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="border-b border-gray-100 pb-3">
                    <p className="text-sm text-gray-500 mb-1">{spec.label}</p>
                    <p className="font-semibold text-gray-900">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <Package className="w-12 h-12 mx-auto text-blue-200" />
              <h3 className="text-2xl font-bold">99.9% Purity</h3>
              <p className="text-blue-100">Pharmaceutical grade quality guaranteed</p>
            </div>
            <div className="space-y-4">
              <Truck className="w-12 h-12 mx-auto text-blue-200" />
              <h3 className="text-2xl font-bold">Fast Shipping</h3>
              <p className="text-blue-100">Worldwide delivery in 3-7 business days</p>
            </div>
            <div className="space-y-4">
              <Shield className="w-12 h-12 mx-auto text-blue-200" />
              <h3 className="text-2xl font-bold">100% Authentic</h3>
              <p className="text-blue-100">Verified by third-party laboratories</p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof of Legitimacy Section */}
      <ParallaxSection className="py-20 bg-gradient-to-br from-gray-50 to-blue-50" speed={0.3}>
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeUp" delay={0.2}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Proof of Legitimacy
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Verified Authenticity & Quality
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Real certificates, lab results, and customer testimonials proving our commitment to quality
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="scale" delay={0.4}>
            <AdvancedCarousel
              images={proofImages}
              title=""
              autoPlay={true}
              interval={3000}
              showThumbnails={true}
              telegramLink="https://t.me/+fB0r-4GxkA85N2Y1"
            />
          </ScrollAnimation>
        </div>
      </ParallaxSection>

      {/* Feedbacks Section */}
      <ParallaxSection className="py-20 bg-white" speed={0.2}>
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideRight" delay={0.2}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4" />
                Customer Feedbacks
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Real Customer Experiences
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                See what our satisfied customers have to say about our products and service
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="fadeUp" delay={0.4}>
            <AdvancedCarousel
              images={feedbackImages}
              title=""
              autoPlay={true}
              interval={3500}
              showThumbnails={true}
              telegramLink="https://t.me/+fB0r-4GxkA85N2Y1"
            />
          </ScrollAnimation>
        </div>
      </ParallaxSection>

      {/* Peptides & Protocols Section */}
      <ParallaxSection className="py-20 bg-gradient-to-br from-blue-50 to-purple-50" speed={0.4}>
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="slideLeft" delay={0.2}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                <Beaker className="w-4 h-4" />
                Peptides & Protocols
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Research Protocols & Guidelines
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Expert-curated protocols and peptide research guidelines for optimal results
              </p>
            </div>
          </ScrollAnimation>

          <ScrollAnimation animation="rotate" delay={0.4}>
            <AdvancedCarousel
              images={protocolImages}
              title=""
              autoPlay={true}
              interval={4000}
              showThumbnails={false}
              telegramLink="https://t.me/+fB0r-4GxkA85N2Y1"
            />
          </ScrollAnimation>

          <ScrollAnimation animation="fadeUp" delay={0.6}>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="https://t.me/+fB0r-4GxkA85N2Y1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5" />
                Peptides Tips & Protocols
                <ExternalLink className="w-4 h-4" />
              </motion.a>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/protocols"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <Beaker className="w-5 h-5" />
                  View All Protocols
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </ScrollAnimation>
        </div>
      </ParallaxSection>

      {/* Telegram Community Section */}
      <ParallaxSection 
        className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
        speed={0.5}
        bgImage="/TIRZEPATIDE1.png"
        overlay={true}
      >
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fadeUp" delay={0.2}>
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Join Our Research Community
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Connect with researchers, share experiences, and get expert advice in our Telegram community
              </p>
            </div>
          </ScrollAnimation>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                href: "https://t.me/+fB0r-4GxkA85N2Y1",
                icon: MessageCircle,
                title: "Main Group",
                description: "Join the community",
                delay: 0.3
              },
              {
                href: "https://web.telegram.org/a/#-1003174284544_2",
                icon: Shield,
                title: "Proofs",
                description: "View legitimacy proofs",
                delay: 0.4
              },
              {
                href: "https://web.telegram.org/a/#-1003174284544_7",
                icon: Star,
                title: "Feedbacks",
                description: "Customer reviews",
                delay: 0.5
              },
              {
                href: "https://web.telegram.org/a/#-1003174284544_5",
                icon: Beaker,
                title: "Protocols",
                description: "Research guidelines",
                delay: 0.6
              }
            ].map((item, index) => (
              <ScrollAnimation key={index} animation="scale" delay={item.delay}>
                <motion.a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 text-center group block"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-8 h-8 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-blue-100 text-sm">{item.description}</p>
                </motion.a>
              </ScrollAnimation>
            ))}
          </div>

          <ScrollAnimation animation="fadeUp" delay={0.7}>
            <div className="mt-12 text-center">
              <motion.a
                href="https://web.telegram.org/a/#-1003174284544_3"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Target className="w-5 h-5" />
                Research Area
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </ScrollAnimation>
        </div>
      </ParallaxSection>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Ready to Advance Your Research?
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of researchers worldwide who trust our premium peptides for their studies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Beaker className="w-5 h-5" />
                Order Tirzepatide Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                Calculate Dosage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
      )}
    </>
  );
};

export default TirzepatideLanding;
