import React, { useState } from 'react';
import { X, Package, Beaker, ShoppingCart, Plus, Minus, Sparkles, Heart } from 'lucide-react';
import type { Product, ProductVariation, ProductOption } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, variation?: ProductVariation, option?: ProductOption, quantity?: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onAddToCart }) => {
  // Select first available variation, or first variation if all are out of stock
  const getFirstAvailableVariation = () => {
    if (!product.variations || product.variations.length === 0) return undefined;
    const available = product.variations.find(v => v.stock_quantity > 0);
    return available || product.variations[0];
  };

  // Select first available option, or first option if all are out of stock
  const getFirstAvailableOption = () => {
    if (!product.options || product.options.length === 0) return undefined;
    const available = product.options.find(o => o.available !== false && o.stock_quantity > 0);
    return available || product.options.find(o => o.available !== false) || product.options[0];
  };

  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    getFirstAvailableVariation()
  );
  const [selectedOption, setSelectedOption] = useState<ProductOption | undefined>(
    getFirstAvailableOption()
  );
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Check if product is in wishlist on mount
  React.useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('studyPulseWishlist') || '[]');
    const isInWishlist = wishlist.some((item: any) => item.product_id === product.id);
    setIsWishlisted(isInWishlist);
  }, [product.id]);

  const hasDiscount = product.discount_active && product.discount_price;
  const currentPrice = selectedOption 
    ? (selectedOption.final_price || (selectedVariation?.price || (hasDiscount ? product.discount_price! : product.base_price)) + selectedOption.price_adjustment)
    : selectedVariation?.price || (hasDiscount ? product.discount_price! : product.base_price);
  const showPurity = Boolean(product.purity_percentage);

  // Check if product has any available stock
  const hasAnyStock = product.variations && product.variations.length > 0
    ? product.variations.some(v => v.stock_quantity > 0)
    : product.stock_quantity > 0;

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  const handleAddToCart = () => {
    onAddToCart(product, selectedVariation, selectedOption, quantity);
    onClose();
  };

  const handleWishlistToggle = () => {
    const wishlist = JSON.parse(localStorage.getItem('studyPulseWishlist') || '[]');
    const exists = wishlist.findIndex((item: any) => item.product_id === product.id);

    if (exists >= 0) {
      // Remove from wishlist
      wishlist.splice(exists, 1);
      setIsWishlisted(false);
    } else {
      // Add to wishlist
      wishlist.push({
        id: `${Date.now()}-${product.id}`,
        product_id: product.id,
        product_name: product.name,
        price: currentPrice,
        image: product.image_url,
        addedAt: new Date().toISOString()
      });
      setIsWishlisted(true);
    }

    localStorage.setItem('studyPulseWishlist', JSON.stringify(wishlist));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden my-2 sm:my-8">
        {/* Header */}
        <div className="bg-navy-900 text-white p-3 sm:p-4 md:p-6 relative border-b-2 border-navy-900/30">
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 md:top-4 md:right-4 flex gap-2">
            <button
              onClick={handleWishlistToggle}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-red-400"
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-white/10 rounded-lg transition-colors text-white hover:text-gold-400"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
            </button>
          </div>
          <div className="pr-10 sm:pr-12">
            <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1.5 sm:mb-2 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{product.name}</h2>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-wrap">
              {showPurity && (
                <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold bg-gold-500/20 backdrop-blur-sm border border-navy-900/40 text-gold-300">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-0.5 sm:mr-1" />
                  {product.purity_percentage}% Pure
                </span>
              )}
              {product.featured && (
                <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold bg-gold-500/20 backdrop-blur-sm border border-navy-900/40 text-gold-300">
                  ⭐ Featured
                </span>
              )}
              {hasDiscount && (
                <span className="inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold bg-gold-500/20 backdrop-blur-sm border border-navy-900/40 text-gold-300">
                  🎉 Sale
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-280px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            {/* Left Column */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Product Image */}
              {product.image_url && (
                <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl overflow-hidden border-2 border-navy-700/30 shadow-lg">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2">
                  <Beaker className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-600" />
                  Product Description
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed">{product.description}</p>
              </div>

              {/* Complete Set Inclusions */}
              {product.inclusions && product.inclusions.length > 0 && (
                <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-navy-700/30 shadow-sm">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                    <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-600" />
                    Complete Set Includes
                  </h3>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {product.inclusions.map((item, index) => (
                      <li key={index} className="text-[11px] sm:text-xs md:text-sm text-gray-700 flex items-start gap-1.5 sm:gap-2">
                        <span className="text-gold-600 font-bold mt-0.5">✓</span>
                        <span className="flex-1">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Scientific Details */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-navy-700/30">
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-1.5 sm:gap-2">
                  <Beaker className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-600" />
                  Scientific Information
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {showPurity && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-[11px] sm:text-xs md:text-sm">Purity:</span>
                      <span className="font-semibold text-gold-600 text-[11px] sm:text-xs md:text-sm">{product.purity_percentage}%</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-[11px] sm:text-xs md:text-sm">Storage:</span>
                    <span className="font-medium text-gray-700 text-[11px] sm:text-xs md:text-sm">{product.storage_conditions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 text-[11px] sm:text-xs md:text-sm">Stock:</span>
                    <span className={`font-medium text-[11px] sm:text-xs md:text-sm ${(product.variations && product.variations.length > 0
                      ? product.variations.some(v => v.stock_quantity > 0)
                      : product.stock_quantity > 0)
                      ? 'text-gold-600'
                      : 'text-red-600'
                      }`}>
                      {product.variations && product.variations.length > 0
                        ? product.variations.reduce((sum, v) => sum + v.stock_quantity, 0)
                        : product.stock_quantity} units
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Purchase Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Price */}
              <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border-2 border-navy-700/30 shadow-lg">
                <div className="text-center mb-3 sm:mb-4">
                  {hasDiscount ? (
                    <>
                      {/* Original Price - Strikethrough */}
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 line-through font-medium">
                          ₱{product.base_price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                          {Math.round((1 - product.discount_price! / product.base_price) * 100)}% OFF
                        </span>
                      </div>
                      {/* Sale Price - Prominent Green */}
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-green-600 mb-2">
                        ₱{currentPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                      </div>
                      <div className="inline-block bg-green-100 text-green-800 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-bold border border-green-200">
                        You Save ₱{(product.base_price - product.discount_price!).toLocaleString('en-PH', { minimumFractionDigits: 0 })}!
                      </div>
                    </>
                  ) : (
                    <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gold-600">
                      ₱{currentPrice.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                    </div>
                  )}
                </div>

                {/* Size Selection */}
                {product.variations && product.variations.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                      Select Size:
                    </label>
                    <select
                      value={selectedVariation?.id || ''}
                      onChange={(e) => {
                        const variation = product.variations?.find(v => v.id === e.target.value);
                        if (variation && variation.stock_quantity > 0) {
                          setSelectedVariation(variation);
                        }
                      }}
                      className="w-full px-2.5 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 border-2 border-navy-700/30 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-navy-900 bg-white text-gray-900 font-medium text-xs sm:text-sm md:text-base shadow-sm hover:border-navy-900 transition-colors"
                    >
                      {product.variations.map((variation) => {
                        const isOutOfStock = variation.stock_quantity === 0;
                        return (
                          <option
                            key={variation.id}
                            value={variation.id}
                            disabled={isOutOfStock}
                            className={isOutOfStock ? 'line-through text-gray-400 italic' : ''}
                          >
                            {variation.name} - ₱{variation.price.toLocaleString('en-PH')}
                            {isOutOfStock ? ' (Out of Stock)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    {selectedVariation && selectedVariation.stock_quantity === 0 && (
                      <p className="text-xs text-red-600 mt-1.5 font-semibold">
                        ⚠️ This size is currently out of stock. Please select another size.
                      </p>
                    )}
                  </div>
                )}

                {/* Package Options Selection - Compact Dropdown */}
                {product.options && product.options.length > 0 && (
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                      Select Package:
                    </label>
                    <div className="relative">
                      <select
                        value={selectedOption?.id || ''}
                        onChange={(e) => {
                          const option = product.options?.find(o => o.id === e.target.value);
                          if (option && option.stock_quantity > 0) {
                            setSelectedOption(option);
                          }
                        }}
                        className="w-full px-3 py-2.5 sm:px-4 sm:py-3 text-sm font-medium rounded-lg sm:rounded-xl border-2 border-navy-700/30 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all appearance-none cursor-pointer hover:border-navy-900"
                      >
                        {product.options
                          .filter(option => option.available !== false && option.stock_quantity > 0)
                          .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
                          .map((option) => {
                            const optionPrice = option.final_price || (selectedVariation?.price || product.base_price) + option.price_adjustment;
                            return (
                              <option key={option.id} value={option.id}>
                                {option.name} - ₱{optionPrice.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                              </option>
                            );
                          })}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 pointer-events-none">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                    {selectedOption && selectedOption.description && (
                      <div className="mt-2 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200">
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{selectedOption.description}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-semibold text-purple-600">
                            Selected: {selectedOption.name}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            Stock: {selectedOption.stock_quantity} units
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-3 sm:mb-4">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5 sm:mb-2">
                    Quantity:
                  </label>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <button
                      onClick={decrementQuantity}
                      className="p-2 sm:p-2.5 md:p-3 bg-white border-2 border-navy-700/30 hover:bg-gold-50 hover:border-navy-900 rounded-lg sm:rounded-xl transition-all shadow-sm"
                      disabled={!product.available}
                    >
                      <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-600" />
                    </button>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 min-w-[40px] sm:min-w-[50px] md:min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={incrementQuantity}
                      className="p-2 sm:p-2.5 md:p-3 bg-white border-2 border-navy-700/30 hover:bg-gold-50 hover:border-navy-900 rounded-lg sm:rounded-xl transition-all shadow-sm"
                      disabled={!product.available}
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gold-600" />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-r from-gray-900 to-black rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 mb-3 sm:mb-4 border-2 border-navy-900/30 shadow-md">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300 font-medium text-xs sm:text-sm md:text-base">Total:</span>
                    <span className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-400">
                      ₱{(currentPrice * quantity).toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available || !hasAnyStock || (selectedVariation && selectedVariation.stock_quantity === 0) || (!selectedVariation && product.stock_quantity === 0)}
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white py-2.5 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base md:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all flex items-center justify-center gap-1.5 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-navy-900/20 hover:border-navy-900/40"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  {!product.available
                    ? 'Unavailable'
                    : (!hasAnyStock || (selectedVariation && selectedVariation.stock_quantity === 0) || (!selectedVariation && product.stock_quantity === 0)
                      ? 'Out of Stock'
                      : 'Add to Cart')}
                </button>
              </div>

              {/* Stock Alert */}
              {product.available && (product.variations && product.variations.length > 0
                ? product.variations.some(v => v.stock_quantity > 0 && v.stock_quantity < 10)
                : product.stock_quantity < 10 && product.stock_quantity > 0) && (
                  <div className="bg-gold-50 border border-navy-700 sm:border-2 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <p className="text-xs sm:text-sm text-gold-800 font-semibold flex items-center gap-1.5 sm:gap-2">
                      <span className="text-base sm:text-lg md:text-xl">⚠️</span>
                      Low stock! Only {product.variations && product.variations.length > 0
                        ? product.variations.reduce((sum, v) => sum + v.stock_quantity, 0)
                        : product.stock_quantity} units left
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

