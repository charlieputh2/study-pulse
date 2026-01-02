import React, { useState, useRef, useEffect } from 'react';
import UniqueMenuItemCard from './UniqueMenuItemCard';
import UniqueHero from './UniqueHero';
import ProductDetailModal from './ProductDetailModal';
import Testimonials from './Testimonials';
import EnhancedStayUpdated from './EnhancedStayUpdated';
import EnhancedWhyChooseStudyPulse from './EnhancedWhyChooseStudyPulse';
import EnhancedFAQ from './EnhancedFAQ';
import UniqueLocationSection from './UniqueLocationSection';
import Pagination from './Pagination';
import type { Product, ProductVariation, ProductOption, CartItem } from '../types';
import { Search, Package, Grid, List, X, Filter } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MenuProps {
  menuItems: Product[];
  addToCart: (product: Product, variation?: ProductVariation, option?: ProductOption, quantity?: number) => void;
  cartItems: CartItem[];
  updateQuantity: (index: number, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating' | 'featured'>('name-asc');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
    setSearchTerm('');
    setSelectedCategory('All');
    setSortOrder('name-asc');
    setShowFeaturedOnly(false);
    setInStockOnly(false);
    setWithDiscountOnly(false);
    setLocalPriceRange([0, maxPrice]);
    setCurrentPage(1); // Reset to first page when clearing filters
  };

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortOrder, showFeaturedOnly, inStockOnly, withDiscountOnly, localPriceRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedItems.slice(startIndex, endIndex);

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

  const handleAddToCart = (product: Product, variation?: ProductVariation, option?: ProductOption, quantity: number = 1) => {
    addToCart(product, variation, option, quantity);
  };

  const handleProductClick = (product: Product) => {
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
        <UniqueHero
          onShopAll={() => {
            productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12" ref={productsRef} id="products-section">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Premium Research Products
                </h1>
                <p className="text-gray-600 text-lg">
                  Discover our scientifically formulated peptide solutions
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
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  showFilters || activeFiltersCount > 0
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                }`}
              >
                <Filter className="w-4 h-4" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
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
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'All' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Sort By</label>
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value as any)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="name-asc">Name: A-Z</option>
                      <option value="name-desc">Name: Z-A</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="featured">Featured First</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price Range: ₱{localPriceRange[0]} - ₱{localPriceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={localPriceRange[1]}
                        onChange={(e) => setLocalPriceRange([localPriceRange[0], parseInt(e.target.value)])}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>₱0</span>
                        <span>₱{maxPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Filters */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Quick Filters</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={showFeaturedOnly}
                          onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">Featured Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={inStockOnly}
                          onChange={(e) => setInStockOnly(e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">In Stock Only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={withDiscountOnly}
                          onChange={(e) => setWithDiscountOnly(e.target.checked)}
                          className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-sm">With Discount</span>
                      </label>
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
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <UniqueMenuItemCard
                      product={product}
                      addToCart={handleAddToCart}
                      onQuickView={handleProductClick}
                    />
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

        <Testimonials />
        <EnhancedStayUpdated />
        <EnhancedWhyChooseStudyPulse />
        <EnhancedFAQ />
        <UniqueLocationSection />
      </div>
    </>
  );
};

export default Menu;
