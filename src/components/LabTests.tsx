import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import UniqueHeader from './UniqueHeader';
import UniqueFooter from './UniqueFooter';
import FloatingCartButton from './FloatingCartButton';
import { TestTube, Shield, Award, FileText, Download, Eye, Search, Filter, Microscope, Zap, AlertCircle, CheckCircle, Clock, X } from 'lucide-react';
import { labTestService, LabTest, LabTestDetail, LabTestFilters } from '../services/labTestService';

const LabTests: React.FC = () => {
  const cart = useCart();
  const navigate = useNavigate();
  
  // State management
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<LabTestFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTest, setSelectedTest] = useState<LabTestDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleCartClick = () => {
    navigate('/?view=cart');
  };

  const handleMenuClick = () => {
    navigate('/');
  };

  // Fetch lab tests
  const fetchLabTests = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await labTestService.getLabTests({
        search: searchQuery || undefined,
        ...filters
      });
      
      if (error) throw error;
      setLabTests(data);
    } catch (err) {
      console.error('Error fetching lab tests:', err);
      setError('Failed to load lab tests. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  // Initial load and search/filter changes
  useEffect(() => {
    fetchLabTests();
  }, [fetchLabTests]);

  // Real-time updates
  useEffect(() => {
    const subscription = labTestService.subscribeToLabTests((payload) => {
      console.log('Lab test update received:', payload);
      
      // Refresh data when changes occur
      fetchLabTests();
      
      // Show notification for real-time updates
      if (payload.eventType === 'INSERT') {
        const newTest = payload.new as LabTest;
        // You could add a toast notification here
        console.log('New lab test added:', newTest.name);
      } else if (payload.eventType === 'UPDATE') {
        const updatedTest = payload.new as LabTest;
        console.log('Lab test updated:', updatedTest.name);
      }
    });

    return () => {
      labTestService.unsubscribeFromLabTests(subscription);
    };
  }, [fetchLabTests]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLabTests();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<LabTestFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  // View test details
  const viewTestDetails = async (testId: string) => {
    try {
      const { data, error } = await labTestService.getLabTestDetail(testId);
      
      if (error) throw error;
      if (data) {
        setSelectedTest(data);
        setShowDetailModal(true);
      }
    } catch (err) {
      console.error('Error fetching test details:', err);
      setError('Failed to load test details.');
    }
  };

  // Download report
  const downloadReport = async (testId: string) => {
    setDownloadingId(testId);
    
    try {
      const { error } = await labTestService.downloadReport(testId);
      
      if (error) throw error;
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download report.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Export all tests
  const exportAllTests = async () => {
    setExporting(true);
    
    try {
      const { error } = await labTestService.exportAllTests({
        search: searchQuery || undefined,
        ...filters
      });
      
      if (error) throw error;
    } catch (err) {
      console.error('Error exporting tests:', err);
      setError('Failed to export tests.');
    } finally {
      setExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4" />;
      case 'failed':
        return <X className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in_progress':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      <UniqueHeader
        cartItemsCount={cart.getTotalItems()}
        onCartClick={handleCartClick}
        onMenuClick={handleMenuClick}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-blue-500/20 backdrop-blur-xl border border-blue-400/30 rounded-full">
              <TestTube className="w-5 h-5 text-blue-400" />
              <span className="text-blue-300 font-medium">Quality Assurance</span>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Lab Test Results
            </h1>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive quality testing and analysis reports for all our products. 
              Full transparency in our commitment to excellence and safety.
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8">
              <div className="flex items-center gap-2 text-blue-300">
                <Shield className="w-5 h-5" />
                <span className="text-sm">ISO Certified Lab</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Award className="w-5 h-5" />
                <span className="text-sm">99.8% Average Purity</span>
              </div>
              <div className="flex items-center gap-2 text-blue-300">
                <Zap className="w-5 h-5" />
                <span className="text-sm">Real-time Testing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Section */}
        <div className="bg-gray-50 py-8 border-b">
          <div className="container mx-auto px-4">
            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search test results..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filters</span>
                  {Object.keys(filters).length > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={exportAllTests}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{exporting ? 'Exporting...' : 'Export All'}</span>
                </button>
              </div>
            </form>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => handleFilterChange({ status: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date From</label>
                    <input
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange({ dateFrom: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date To</label>
                    <input
                      type="date"
                      value={filters.dateTo || ''}
                      onChange={(e) => handleFilterChange({ dateTo: e.target.value || undefined })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 text-red-800">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Lab Tests Grid */}
        <div className="container mx-auto px-4 py-12">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading lab tests...</p>
            </div>
          ) : labTests.length === 0 ? (
            <div className="text-center py-12">
              <TestTube className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Lab Tests Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {labTests.map((test) => (
                <div key={test.id} className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 border-b border-gray-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <TestTube className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{test.name}</h3>
                          <p className="text-sm text-gray-500">{test.test_date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(test.status)}`}>
                        {getStatusIcon(test.status)}
                        {test.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed">{test.description}</p>
                  </div>

                  {/* Results */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Purity/Result</p>
                        <p className="text-xl font-bold text-gray-900">{test.purity_result}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Test Method</p>
                        <p className="text-sm font-semibold text-gray-900">{test.test_method}</p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {test.product_name && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Product</p>
                        <p className="text-sm font-medium text-gray-900">{test.product_name}</p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => viewTestDetails(test.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors group"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Report</span>
                      </button>
                      <button
                        onClick={() => downloadReport(test.id)}
                        disabled={downloadingId === test.id}
                        className="flex items-center justify-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                      >
                        {downloadingId === test.id ? (
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-6 px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full">
                <Microscope className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Quality Guarantee</span>
              </div>
              
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Third-Party Verified Quality
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                All our products undergo rigorous third-party laboratory testing to ensure 
                the highest standards of purity, safety, and efficacy.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  Request Full Report
                </button>
                <button className="px-8 py-4 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-400 transition-colors">
                  Learn About Testing
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      {showDetailModal && selectedTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowDetailModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedTest.name}</h2>
                  <p className="text-gray-600">Certificate: {selectedTest.certificate_number}</p>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Test Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Test Information</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Test Date</p>
                      <p className="font-medium">{selectedTest.test_date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedTest.status)}`}>
                        {getStatusIcon(selectedTest.status)}
                        {selectedTest.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lab</p>
                      <p className="font-medium">{selectedTest.lab_name}</p>
                    </div>
                    {selectedTest.technician_name && (
                      <div>
                        <p className="text-sm text-gray-500">Technician</p>
                        <p className="font-medium">{selectedTest.technician_name}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Results Summary</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Purity/Result</p>
                      <p className="text-xl font-bold text-green-600">{selectedTest.purity_result}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Test Method</p>
                      <p className="font-medium">{selectedTest.test_method}</p>
                    </div>
                    {selectedTest.product_name && (
                      <div>
                        <p className="text-sm text-gray-500">Product</p>
                        <p className="font-medium">{selectedTest.product_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              {selectedTest.results.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Detailed Results</h3>
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference Range</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedTest.results.map((result) => (
                          <tr key={result.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {result.parameter_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {result.parameter_value} {result.unit}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {result.reference_range}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                result.status === 'pass' ? 'text-green-600 bg-green-100' :
                                result.status === 'fail' ? 'text-red-600 bg-red-100' :
                                'text-yellow-600 bg-yellow-100'
                              }`}>
                                {result.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Images */}
              {selectedTest.images.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Test Images & Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTest.images.map((image) => (
                      <div key={image.id} className="bg-gray-50 rounded-xl p-4">
                        <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                          <FileText className="w-12 h-12 text-gray-400" />
                        </div>
                        <p className="font-medium text-gray-900">{image.image_type}</p>
                        <p className="text-sm text-gray-600">{image.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedTest.notes && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Notes</h3>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-gray-700">{selectedTest.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => downloadReport(selectedTest.id)}
                  disabled={downloadingId === selectedTest.id}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {downloadingId === selectedTest.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      <span>Download Full Report</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <UniqueFooter />
      
      <FloatingCartButton
        itemCount={cart.getTotalItems()}
        onCartClick={handleCartClick}
      />
    </div>
  );
};

export default LabTests;
