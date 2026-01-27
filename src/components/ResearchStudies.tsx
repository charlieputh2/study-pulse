import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Calendar, 
  User, 
  BookOpen, 
  Download,
  Eye,
  Share2,
  Heart,
  Bookmark,
  TrendingUp,
  Clock,
  Users,
  Award,
  Beaker,
  Target,
  ChevronRight,
  ExternalLink,
  Star,
  MessageCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Study {
  id: string;
  title: string;
  description: string;
  authors: string[];
  date: string;
  category: string;
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
  image: string;
  pdfUrl?: string;
  externalUrl?: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const ResearchStudies: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [savedStudies, setSavedStudies] = useState<string[]>([]);
  const [likedStudies, setLikedStudies] = useState<string[]>([]);

  const studies: Study[] = [
    {
      id: '1',
      title: 'Dual GIP/GLP-1 Receptor Agonism: A Comprehensive Review',
      description: 'An in-depth analysis of tirzepatide\'s mechanism of action, clinical efficacy, and potential applications in metabolic research.',
      authors: ['Dr. Sarah Johnson', 'Dr. Michael Chen'],
      date: '2024-01-15',
      category: 'Clinical Research',
      readTime: 15,
      views: 15420,
      likes: 892,
      featured: true,
      image: '/TIRZEPATIDE1.png',
      pdfUrl: '#',
      tags: ['Tirzepatide', 'GIP', 'GLP-1', 'Metabolic'],
      difficulty: 'Advanced'
    },
    {
      id: '2',
      title: 'Peptide Stability and Storage Protocols',
      description: 'Best practices for maintaining peptide integrity during storage and handling in laboratory environments.',
      authors: ['Dr. Emily Rodriguez'],
      date: '2024-01-10',
      category: 'Laboratory Protocols',
      readTime: 8,
      views: 8750,
      likes: 456,
      featured: false,
      image: '/TIRZEPATIDE2.png',
      pdfUrl: '#',
      tags: ['Storage', 'Stability', 'Peptides'],
      difficulty: 'Intermediate'
    },
    {
      id: '3',
      title: 'Comparative Analysis of GLP-1 Receptor Agonists',
      description: 'Side-by-side comparison of different GLP-1 receptor agonists including efficacy, safety profiles, and research applications.',
      authors: ['Dr. James Wilson', 'Dr. Lisa Park'],
      date: '2024-01-08',
      category: 'Comparative Studies',
      readTime: 12,
      views: 12300,
      likes: 678,
      featured: true,
      image: '/TIRZEPATIDE1.png',
      externalUrl: '#',
      tags: ['GLP-1', 'Comparison', 'Efficacy'],
      difficulty: 'Advanced'
    },
    {
      id: '4',
      title: 'Introduction to Peptide Research Methodology',
      description: 'A beginner\'s guide to peptide research methodologies, experimental design, and data analysis.',
      authors: ['Dr. Robert Taylor'],
      date: '2024-01-05',
      category: 'Educational',
      readTime: 20,
      views: 18900,
      likes: 1203,
      featured: false,
      image: '/TIRZEPATIDE2.png',
      pdfUrl: '#',
      tags: ['Methodology', 'Beginner', 'Research'],
      difficulty: 'Beginner'
    },
    {
      id: '5',
      title: 'Advanced Peptide Synthesis Techniques',
      description: 'Cutting-edge methods for peptide synthesis, purification, and quality control in research applications.',
      authors: ['Dr. Amanda Foster'],
      date: '2024-01-03',
      category: 'Laboratory Protocols',
      readTime: 18,
      views: 9800,
      likes: 543,
      featured: false,
      image: '/TIRZEPATIDE1.png',
      pdfUrl: '#',
      tags: ['Synthesis', 'Purification', 'Quality Control'],
      difficulty: 'Advanced'
    }
  ];

  const categories = ['All', 'Clinical Research', 'Laboratory Protocols', 'Comparative Studies', 'Educational'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'readTime', label: 'Read Time' }
  ];

  const filteredAndSortedStudies = studies
    .filter(study => {
      const matchesSearch = study.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           study.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || study.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'All' || study.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesDifficulty;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.likes - a.likes;
        case 'views':
          return b.views - a.views;
        case 'readTime':
          return a.readTime - b.readTime;
        case 'latest':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const toggleSave = (studyId: string) => {
    setSavedStudies(prev => 
      prev.includes(studyId) 
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId]
    );
  };

  const toggleLike = (studyId: string) => {
    setLikedStudies(prev => 
      prev.includes(studyId) 
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-700';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'Advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const featuredStudies = studies.filter(study => study.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              <BookOpen className="w-4 h-4" />
              Research Library
            </motion.div>
            
            <motion.h1 
              className="text-4xl lg:text-5xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Research Studies & Papers
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Access cutting-edge research papers, clinical studies, and educational resources in peptide science
            </motion.p>
          </div>
        </div>
      </section>

      {/* Featured Studies */}
      {featuredStudies.length > 0 && (
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Award className="w-6 h-6 text-yellow-500" />
              <h2 className="text-2xl font-bold text-gray-900">Featured Studies</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {featuredStudies.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Link to={`/research/study/${study.id}`}>
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex gap-6">
                        <img
                          src={study.image}
                          alt={study.title}
                          className="w-32 h-32 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{study.title}</h3>
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{study.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {study.views.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {study.likes}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {study.readTime} min
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters and Search */}
      <section className="py-8 bg-gray-50 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search studies, papers, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(diff => (
                  <option key={diff} value={diff}>{diff} Level</option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>Sort by {option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Studies Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredAndSortedStudies.length} Studies Found
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedStudies.map((study, index) => (
              <motion.div
                key={study.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Study Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Difficulty Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(study.difficulty)}`}>
                        {study.difficulty}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => toggleSave(study.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Bookmark className={`w-4 h-4 ${savedStudies.includes(study.id) ? 'text-blue-600 fill-current' : 'text-gray-600'}`} />
                      </button>
                      <button
                        onClick={() => toggleLike(study.id)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                      >
                        <Heart className={`w-4 h-4 ${likedStudies.includes(study.id) ? 'text-red-600 fill-current' : 'text-gray-600'}`} />
                      </button>
                    </div>
                  </div>

                  {/* Study Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded">
                        {study.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(study.date).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link to={`/research/study/${study.id}`}>
                        {study.title}
                      </Link>
                    </h3>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {study.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {study.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {study.tags.length > 3 && (
                        <span className="text-xs text-gray-500">+{study.tags.length - 3} more</span>
                      )}
                    </div>

                    {/* Authors */}
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {study.authors.join(', ')}
                      </span>
                    </div>

                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {study.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {study.readTime} min
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {study.pdfUrl && (
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {study.externalUrl && (
                          <a
                            href={study.externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          to={`/research/study/${study.id}`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAndSortedStudies.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No studies found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Stay Updated with Latest Research
            </h2>
            <p className="text-xl text-blue-100">
              Get notified about new studies and research papers in your field of interest
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl">
                <MessageCircle className="w-5 h-5" />
                Subscribe to Updates
              </button>
              <Link
                to="/research"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all duration-300"
              >
                <Beaker className="w-5 h-5" />
                Browse All Research
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchStudies;
