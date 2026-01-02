import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UniqueMenuItemCard from './UniqueMenuItemCard';
import ProductDetailModal from './ProductDetailModal';
import Pagination from './Pagination';
import type { Product, ProductVariation, CartItem, ProductOption } from '../types';
import { Search, Package, Grid, List, X, Filter, ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../styles/animations.css';

interface ProductsProps {
  menuItems: Product[];
  addToCart: (product: Product, variation?: ProductVariation, option?: ProductOption, quantity?: number) => void;
  cartItems: CartItem[];
  updateQuantity: (index: number, quantity: number) => void;
}

const Products: React.FC<ProductsProps> = ({ menuItems, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating' | 'featured'>('name-asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  // Initialize with all filters closed
  const [showFilters, setShowFilters] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [withDiscountOnly, setWithDiscountOnly] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // 4x3 grid

  const categories = ['All', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  // Calculate max price safely - ensure it's a valid number
  const maxPrice = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.base_price || 0)) : 1000000;
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>([0, maxPrice]);

  const productsRef = useRef<HTMLDivElement | null>(null);

  useScrollAnimation();

  // CRITICAL: Prevent Advanced Filters from automatically opening on page load or scroll
  useEffect(() => {
    // Force filters to stay closed on initial mount
    setShowFilters(false);
    // Reset price range to ensure it matches maxPrice
    setLocalPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredAndSortedItems = menuItems
    .filter(item => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesPrice = (item.base_price || 0) >= localPriceRange[0] && (item.base_price || 0) <= localPriceRange[1];
      const matchesFeatured = !showFeaturedOnly || item.featured;
      const matchesStock = !inStockOnly || (item.stock_quantity > 0 && item.available);
      const matchesDiscount = !withDiscountOnly || (item.discount_active && item.discount_price);
      
      return matchesSearch && matchesCategory && matchesPrice && matchesFeatured && matchesStock && matchesDiscount;
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return (a.base_price || 0) - (b.base_price || 0);
        case 'price-desc':
          return (b.base_price || 0) - (a.base_price || 0);
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case 'rating':
          return 0;
        default:
          return 0;
      }
    });

  const clearAllFilters = () => {
    console.log('Clearing all filters');
    setSearchTerm('');
    setSelectedCategory('All');
    setSortOrder('name-asc');
    setShowFeaturedOnly(false);
    setInStockOnly(false);
    setWithDiscountOnly(false);
    setLocalPriceRange([0, maxPrice]);
    setShowFilters(false);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  const activeFiltersCount = [
    searchTerm,
    selectedCategory !== 'All',
    sortOrder !== 'name-asc',
    showFeaturedOnly,
    inStockOnly,
    withDiscountOnly,
    // Only count price range as a filter if it's been explicitly changed
    maxPrice > 0 && (localPriceRange[0] > 0 || localPriceRange[1] < maxPrice)
  ].filter(Boolean).length;

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOrder, showFeaturedOnly, inStockOnly, withDiscountOnly, localPriceRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(startIndex, endIndex);

  const handleAddToCart = (product: Product, variation?: ProductVariation, option?: ProductOption, quantity: number = 1) => {
    addToCart(product, variation, option, quantity);
  };

  const handleProductClick = (product: Product) => {
    console.log('Product clicked:', product.name);
    setSelectedProduct(product);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
  };

  return (
    <>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={closeProductModal}
          onAddToCart={handleAddToCart}
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section for Products Page */}
        <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
          {/* Background Pattern - Matching Footer */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white">
                Our Premium Products
              </h1>
              <p className="text-xl lg:text-2xl text-blue-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                Discover our scientifically formulated peptide solutions designed for research excellence
              </p>
              
              {/* Action Buttons - Better Aligned */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  to="/"
                  className="px-8 py-4 bg-white text-blue-900 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
                >
                  <span className="flex items-center gap-2">
                    Back to Home
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <div className="px-8 py-4 bg-blue-500/20 backdrop-blur-xl border-2 border-blue-400/30 rounded-xl font-medium">
                  <div className="flex items-center gap-3">
                    <Package className="w-6 h-6 text-blue-400" />
                    <div className="text-left">
                      <div className="text-2xl font-bold text-white">{menuItems.length}</div>
                      <div className="text-sm text-blue-300">Products Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12" ref={productsRef} id="products-section">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
              <div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Browse All Products
                </h2>
                <p className="text-gray-600 text-lg">
                  Find the perfect research solution for your needs
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm text-gray-500">
                    <span className="font-semibold text-blue-600">{filteredAndSortedItems.length}</span> of {menuItems.length} products
                  </span>
                  {activeFiltersCount > 0 && (
                    <span className="text-sm text-purple-600 font-medium">
                      {activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-xl p-1 border border-gray-200 shadow-sm">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white shadow-sm"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.slice(0, 6).map((category, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {category === 'All' ? (
                    <>
                      <span className="mr-1">🔍</span>
                      All Products
                    </>
                  ) : (
                    <>
                      <span className="mr-1">📁</span>
                      {category}
                    </>
                  )}
                </button>
              ))}
              
              {/* Advanced Filters Toggle */}
              <button
                id="advanced-filters-toggle"
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`filter-button px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
                aria-label="Toggle advanced filters"
                aria-expanded={showFilters}
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-6 transform transition-all duration-500 ease-out animate-slideDown">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all duration-200 hover:border-gray-400"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'All' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                      Sort By
                    </label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white transition-all duration-200 hover:border-gray-400"
                    >
                      <option value="name-asc">Name: A-Z</option>
                      <option value="name-desc">Name: Z-A</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="featured">Featured First</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      Price Range: ₱{localPriceRange[0].toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} - ₱{localPriceRange[1].toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={localPriceRange[1]}
                        onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider transition-all duration-200 hover:bg-gray-300"
                      />
                      <div className="flex justify-between text-xs text-gray-500 font-medium">
                        <span>₱0</span>
                        <span>₱{maxPrice.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div className="transform transition-all duration-300 hover:scale-105">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                      Quick Filters
                    </label>
                    <div className="space-y-3">
                      {[
                        { id: 'featured', label: 'Featured Only', checked: showFeaturedOnly, onChange: setShowFeaturedOnly, color: 'yellow' },
                        { id: 'stock', label: 'In Stock Only', checked: inStockOnly, onChange: setInStockOnly, color: 'green' },
                        { id: 'discount', label: 'With Discount', checked: withDiscountOnly, onChange: setWithDiscountOnly, color: 'red' }
                      ].map((filter) => (
                        <label key={filter.id} className="flex items-center group cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={filter.checked}
                              onChange={(e) => filter.onChange(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 border-2 rounded-md transition-all duration-200 ${
                              filter.checked 
                                ? `bg-${filter.color}-500 border-${filter.color}-500` 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}>
                              {filter.checked && (
                                <svg className="w-3 h-3 text-white mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </div>
                          <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                            {filter.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto border border-gray-100">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-12 h-12 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  {searchTerm
                    ? `No products match "${searchTerm}". Try adjusting your search terms.`
                    : activeFiltersCount > 0
                    ? 'No products match your current filters. Try adjusting your filter criteria.'
                    : 'No products available at the moment.'}
                </p>
                
                <div className="space-y-3">
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                    >
                      Clear Search
                    </button>
                  )}
                  {activeFiltersCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl"
                    >
                      Clear All Filters
                    </button>
                  )}
                  {(searchTerm || activeFiltersCount > 0) && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">or</p>
                      <button
                        onClick={() => {
                          clearAllFilters();
                          setSearchTerm('');
                        }}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm underline"
                      >
                        Show all products
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Product Grid */}
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {currentItems.map((product, index) => (
                  <div
                    key={product.id}
                    className="product-card animate-fadeIn relative"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <UniqueMenuItemCard
                      product={product}
                      addToCart={handleAddToCart}
                      onQuickView={handleProductClick}
                    />
                    
                    {/* Badges Container - Properly Positioned */}
                    <div className="absolute top-3 left-3 z-30 flex flex-col gap-2">
                      {/* Featured Badge */}
                      {product.featured && (
                        <span className="featured-badge">Featured</span>
                      )}
                    </div>
                    
                    {/* Right Side Badges */}
                    <div className="absolute top-3 right-3 z-30 flex flex-col gap-2 items-end">
                      {/* Discount Badge - Only show if valid discount > 0% */}
                      {product.discount_active && 
                       product.discount_price && 
                       product.base_price && 
                       product.discount_price < product.base_price && (
                        <span className="discount-badge">
                          {Math.round(((product.base_price - product.discount_price) / product.base_price) * 100)}% OFF
                        </span>
                      )}
                      
                      {/* Urgency Badge - Only show if low stock */}
                      {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                        <span className="urgent-badge">Only {product.stock_quantity} Left</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredAndSortedItems.length}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;
