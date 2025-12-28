import React, { useState, useRef } from 'react';
import MenuItemCard from './MenuItemCard';
import Hero from './Hero';
import ProductDetailModal from './ProductDetailModal';
import Testimonials from './Testimonials';
import StayUpdated from './StayUpdated';
import WhyChooseStudyPulse from './WhyChooseStudyPulse';
import GoogleMapsSection from './GoogleMapsSection';
import type { Product, ProductVariation, CartItem } from '../types';
import { Search, Filter, Package } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MenuProps {
  menuItems: Product[];
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  cartItems: CartItem[];
  updateQuantity: (index: number, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ menuItems, addToCart, cartItems }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'purity'>('name');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const productsRef = useRef<HTMLDivElement | null>(null);

  useScrollAnimation();

  // Filter products based on search
  const filteredProducts = menuItems.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'price':
        return a.base_price - b.base_price;
      case 'purity':
        return b.purity_percentage - a.purity_percentage;
      default:
        return 0;
    }
  });

  const getCartQuantity = (productId: string, variationId?: string) => {
    return cartItems
      .filter(item =>
        item.product.id === productId &&
        (variationId ? item.variation?.id === variationId : !item.variation)
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  return (
    <>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, variation, quantity) => {
            addToCart(product, variation, quantity);
          }}
        />
      )}

      <div className="min-h-screen bg-theme-bg">
        <Hero
          onShopAll={() => {
            productsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8" ref={productsRef} id="products-section">
          {/* Search and Filter Controls */}
          <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-theme-accent focus:border-theme-accent transition-all bg-white hover:border-gray-300"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 sm:w-auto">
              <Filter className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'purity')}
                className="focus:outline-none bg-transparent font-medium text-theme-text text-xs sm:text-sm"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="purity">Sort by Purity</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center gap-2">
            <p className="text-gray-500 font-medium text-sm">
              Showing <span className="font-bold text-theme-text">{sortedProducts.length}</span> products
            </p>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="bg-white rounded-xl shadow-soft p-12 max-w-md mx-auto border border-gray-100">
                <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-theme-text mb-2">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery
                    ? `No products match "${searchQuery}".`
                    : 'No products available.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="btn-primary"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
                 data-animate="animate-fade-in"
               >
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  data-animate="animate-scale"
                  data-delay={index * 100}
                >
                  <MenuItemCard
                    product={product}
                    onAddToCart={addToCart}
                    cartQuantity={getCartQuantity(product.id)}
                    onProductClick={setSelectedProduct}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Testimonials Section */}
        <Testimonials />

        {/* Stay Updated Section */}
        <StayUpdated />

        {/* Why Choose Study Pulse Section */}
        <WhyChooseStudyPulse />

        {/* Google Maps Section */}
        <GoogleMapsSection />
      </div>
    </>
  );
};

export default Menu;
