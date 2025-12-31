import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Calculator, TestTube, Beaker, Search, ArrowRight, CheckCircle, ChevronRight, Microscope, FlaskConical, Award, Globe, Clock, Zap } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { discountTiers, discountTerms, categories } from '../data/researchProtocols';

const Research: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const researchTools = [
    {
      id: 'studies',
      title: 'Explore Studies',
      description: 'Browse our comprehensive research database with peer-reviewed studies and clinical trials.',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      features: ['500+ Studies', 'Peer-Reviewed', 'Updated Weekly'],
      link: '/studies',
      stats: { count: '500+', label: 'Studies' }
    },
    {
      id: 'protocols',
      title: 'View Guidelines',
      description: 'Detailed protocols and dosage guidelines for research applications.',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      features: ['Step-by-Step', 'Safety Guidelines', 'Best Practices'],
      link: '/protocols',
      stats: { count: '50+', label: 'Protocols' }
    },
    {
      id: 'calculator',
      title: 'Dosage Tool',
      description: 'Advanced dosage calculator with precision measurements and safety checks.',
      icon: Calculator,
      color: 'from-green-500 to-emerald-500',
      features: ['Accurate Calculations', 'Safety Limits', 'Multiple Units'],
      link: '/calculator',
      stats: { count: '10K+', label: 'Calculations' }
    },
    {
      id: 'lab-tests',
      title: 'Quality Reports',
      description: 'Lab test results and quality assurance reports for all products.',
      icon: TestTube,
      color: 'from-orange-500 to-red-500',
      features: ['COA Reports', 'Purity Tests', 'Quality Assured'],
      link: '/lab-tests',
      stats: { count: '100%', label: 'Tested' }
    }
  ];

  const handleCardClick = (toolId: string, link: string) => {
    setActiveSection(toolId);
    setTimeout(() => {
      navigate(link);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Header
        cartItemsCount={0}
        onCartClick={() => navigate('/')}
        onMenuClick={() => navigate('/')}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 container mx-auto px-4 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-sm mb-8">
                <Microscope className="w-6 h-6" />
                <span className="text-lg font-bold">Research Portal</span>
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                Research & <span className="text-transparent bg-clip-text bg-white">Development</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Advanced research tools, studies, and protocols for scientific exploration and development
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Peer-Reviewed</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span>Certified Quality</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                  <Globe className="w-5 h-5 text-blue-300" />
                  <span>Global Standards</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Research Tools Grid */}
        <section className="container mx-auto px-4 py-16 lg:py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Research <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Tools</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional tools and resources for research, development, and quality assurance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {researchTools.map((tool) => (
              <a
                key={tool.id}
                href={tool.link}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden border-2 border-transparent hover:border-blue-400 block ${
                  activeSection === tool.id ? 'ring-4 ring-blue-500 ring-opacity-50 border-blue-500' : ''
                }`}
                onMouseEnter={() => setHoveredCard(tool.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={(e) => {
                  e.preventDefault();
                  handleCardClick(tool.id, tool.link);
                }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Active State Background */}
                {activeSection === tool.id && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-10`}></div>
                )}
                
                {/* Header */}
                <div className="relative p-6 pb-4">
                  {/* Clickable Indicator */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors z-10">
                    <ChevronRight className="w-3 h-3 text-white" />
                  </div>
                  
                  <div className={`w-16 h-16 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <tool.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {tool.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {tool.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {tool.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Footer */}
                <div className="relative px-6 py-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{tool.stats.count}</div>
                      <div className="text-xs text-gray-500">{tool.stats.label}</div>
                    </div>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${tool.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <ArrowRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                {/* Hover Effect Border */}
                <div className={`absolute inset-0 rounded-2xl border-2 transition-all duration-300 ${
                  hoveredCard === tool.id ? 'border-blue-400 shadow-blue-200' : 'border-transparent'
                }`}></div>
                
                {/* Active Indicator */}
                {activeSection === tool.id && (
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-green-500 rounded-full animate-ping shadow-lg"></div>
                )}
              </a>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
                <div className="text-gray-600">Research Studies</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
                <div className="text-gray-600">Protocols</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">10K+</div>
                <div className="text-gray-600">Calculations</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TestTube className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">100%</div>
                <div className="text-gray-600">Quality Tested</div>
              </div>
            </div>
          </div>
        </section>

        {/* Discount Policy Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold mb-4">
                  <Award className="w-4 h-4" />
                  <span>Pulse Discount Policy</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Eligibility</h2>
                <p className="text-gray-600 max-w-2xl">
                  Dynamic discount ladder with shipping perks. All tiers are stack-aware and easy to update.
                </p>
              </div>
              <div className="mt-6 lg:mt-0">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg">
                  <Clock className="w-5 h-5" />
                  <span>Updated as policies change</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Discount Tiers</h3>
                <div className="space-y-3">
                  {discountTiers.map((tier) => (
                    <div
                      key={tier.threshold}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white grid place-items-center font-bold shadow-lg">
                        ₱
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-blue-800">{tier.threshold}</p>
                        <p className="text-gray-700">{tier.offer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h3>
                <ul className="space-y-3">
                  {discountTerms.map((term, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold mb-4">
                  <FlaskConical className="w-4 h-4" />
                  <span>Product Categories</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Research Categories</h2>
                <p className="text-gray-600">Browse our comprehensive product categories for research applications.</p>
              </div>
              <div className="mt-6 lg:mt-0">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  <Search className="w-4 h-4" />
                  <span>Tap to explore in Protocols</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((category) => (
                <div
                  key={category}
                  className="group p-4 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Beaker className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Research;
