import React, { useState } from 'react';
import type { Product, ProductVariation } from '../types';
import { ShoppingCart, Heart, Eye, Star, Zap, Shield, Award, TrendingUp, ChevronDown, Plus, Minus, Sparkles } from 'lucide-react';

interface MenuItemCardProps {
  product: Product;
  addToCart: (product: Product, variation?: ProductVariation, quantity?: number) => void;
  onQuickView?: (product: Product) => void;
}

const UniqueMenuItemCard: React.FC<MenuItemCardProps> = ({ product, addToCart, onQuickView }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(product.variations?.[0]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, selectedVariation, quantity);
    setQuantity(1); // Reset quantity after adding to cart
  };

  const displayPrice = selectedVariation ? selectedVariation.price : product.base_price;
  const displayOriginalPrice = selectedVariation ? selectedVariation.discount_price : product.discount_price;
  const hasDiscount = displayOriginalPrice && displayOriginalPrice > displayPrice;

  return (
    <div 
      className="relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-gray-100 flex flex-col transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image with Enhanced Design */}
      <div className="relative w-full h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6 rounded-t-3xl">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-2xl"></div>
        </div>
        
        <img
          src={product.image_url || '/assets/logo.jpeg'}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-all duration-700 group-hover:scale-110 relative z-10"
        />

        {/* Enhanced Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2 z-20">
          {product.featured && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow-lg">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          )}
          {hasDiscount && (
            <div className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg">
              {Math.round(((displayOriginalPrice! - displayPrice) / displayOriginalPrice!) * 100)}% OFF
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className={`absolute top-3 right-3 flex flex-col space-y-2 z-20 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 group"
          >
            <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 group-hover:text-red-500'}`} />
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all duration-300 hover:scale-110"
            >
              <Eye className="w-4 h-4 text-gray-600 hover:text-blue-500" />
            </button>
          )}
        </div>

        {/* Stock Indicator */}
        <div className="absolute bottom-3 left-3 z-20">
          <div className="flex items-center gap-1 px-2 py-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            In Stock
          </div>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col">
        {/* Product Name and Category */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight flex-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium text-gray-700">4.8</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {product.category}
            </span>
            {product.purity_percentage && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                {product.purity_percentage}% Purity
              </span>
            )}
          </div>
        </div>

        {/* Product Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Unique Features */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Shield className="w-3 h-3 text-green-500" />
            <span>Lab Tested</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Zap className="w-3 h-3 text-blue-500" />
            <span>Fast Ship</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Award className="w-3 h-3 text-purple-500" />
            <span>Premium</span>
          </div>
        </div>

        {/* Variations */}
        {product.variations && product.variations.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Size:</label>
            <div className="flex gap-2">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation)}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-xl border transition-all duration-200 ${
                    selectedVariation?.id === variation.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {variation.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {displayPrice}
            </span>
            {hasDiscount && displayOriginalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {displayOriginalPrice}
                </span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                  Save {displayOriginalPrice - displayPrice}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center border-0 focus:ring-0 text-gray-900 font-medium"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group"
          >
            <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span>Add to Cart</span>
            <TrendingUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniqueMenuItemCard;
