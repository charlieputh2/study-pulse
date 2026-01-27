import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Beaker, 
  Shield, 
  Star,
  Users,
  Package,
  Heart,
  Target,
  TrendingUp,
  Truck,
  Award
} from 'lucide-react';
import { motion } from 'framer-motion';

const GeneralLanding: React.FC = () => {
  const products = [
    {
      name: "Tirzepatide",
      description: "Revolutionary dual GIP/GLP-1 receptor agonist for advanced metabolic research",
      image: "/TIRZEPATIDE1.png",
      link: "/tirzepatide",
      features: ["Dual Action Formula", "99.9% Purity", "Weekly Dosing", "Clinical Grade"],
      gradient: "from-blue-600 to-purple-600"
    },
    {
      name: "Semaglutide",
      description: "Premium GLP-1 receptor agonist for cutting-edge research applications",
      image: "/TIRZEPATIDE2.png",
      link: "/shop",
      features: ["High Purity", "Stable Formula", "Research Verified", "Fast Shipping"],
      gradient: "from-green-600 to-teal-600"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Pharmaceutical Grade",
      description: "All our peptides meet the highest purity standards"
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Worldwide Shipping",
      description: "Fast and discreet delivery to research institutions globally"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Expert Support",
      description: "Dedicated team of research professionals available 24/7"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Verified Quality",
      description: "Third-party tested and certified for research use"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              <Beaker className="w-4 h-4" />
              Premium Research Peptides
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Study Pulse
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}Research
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover our premium selection of research-grade peptides. 
              Manufactured to the highest standards with verified purity and potency for your research needs.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Browse All Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/coa"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                <Award className="w-5 h-5" />
                View Certificates
              </Link>
            </motion.div>

            <motion.div 
              className="flex items-center justify-center gap-8 text-sm text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Research Peptides
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our most sought-after compounds for cutting-edge metabolic research
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {products.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group"
              >
                <Link to={product.link}>
                  <div className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                    {/* Product Image */}
                    <div className="relative h-64 overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-10`}></div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className={`absolute top-4 right-4 bg-gradient-to-r ${product.gradient} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                        Featured
                      </div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="p-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{product.name}</h3>
                      <p className="text-gray-600 mb-6">{product.description}</p>
                      
                      {/* Features */}
                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {product.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                      
                      {/* CTA Button */}
                      <div className={`inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r ${product.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Study Pulse?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your trusted partner in advanced peptide research
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Advance Your Research?
            </h2>
            <p className="text-xl text-blue-100">
              Join thousands of researchers worldwide who trust our premium peptides for their studies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/shop"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <Beaker className="w-5 h-5" />
                Browse Products
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/calculator"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300"
              >
                Calculate Dosage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GeneralLanding;
