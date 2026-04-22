import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: (product: Product) => void;
  onQuickView: (product: Product) => void;
  isWishlisted?: boolean;
  onToggleWishlist?: () => void;
  index?: number;
  isExiting?: boolean;
}

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-3 sm:p-4 md:p-5 shadow-lg border border-gray-100 h-full flex flex-col animate-pulse">
      {/* Image Placeholder with Shimmer */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-50 rounded-xl sm:rounded-2xl md:rounded-[2rem] overflow-hidden mb-3 sm:mb-4 md:mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer"></div>
      </div>

      <div className="flex-grow flex flex-col px-0.5 sm:px-1">
        {/* Category Placeholder */}
        <div className="h-2.5 sm:h-3 w-16 sm:w-20 bg-gray-100 rounded-full mb-2 sm:mb-4"></div>

        {/* Title Placeholder */}
        <div className="h-4 sm:h-6 w-full bg-gray-100 rounded-lg mb-1.5 sm:mb-2"></div>
        <div className="h-4 sm:h-6 w-2/3 bg-gray-100 rounded-lg mb-2 sm:mb-4"></div>

        {/* Bottom Section Placeholder */}
        <div className="flex items-center justify-between mt-auto pt-3 sm:pt-5 border-t border-gray-50">
          <div className="h-5 sm:h-7 w-16 sm:w-24 bg-gray-100 rounded-lg"></div>
          <div className="h-6 sm:h-9 w-20 sm:w-28 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onClick,
  onQuickView,
  isWishlisted = false,
  onToggleWishlist,
  index = 0,
  isExiting = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [addStatus, setAddStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (addStatus !== 'idle') return;

    setAddStatus('loading');
    setTimeout(() => {
      onAddToCart(product);
      setAddStatus('success');
      setTimeout(() => setAddStatus('idle'), 1500);
    }, 600);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(product);
  };

  // Determine badge type
  const getBadge = () => {
    if (product.isOutOfStock) return { text: 'Out of Stock', color: 'bg-zinc-800 text-white' };
    if (product.isComingSoon) return { text: 'Coming Soon', color: 'bg-indigo-500 text-white' };
    if (product.bestseller) return { text: 'Bestseller', color: 'bg-amber-500 text-white' };
    if (product.rating >= 4.5) return { text: 'Top Rated', color: 'bg-emerald-500 text-white' };
    return null;
  };

  const badge = getBadge();

  return (
    <article
      className={`group relative bg-white rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-2.5 sm:p-3 md:p-4 transition-all duration-500 transform flex flex-col h-full cursor-pointer border-2 border-transparent
        ${isExiting ? 'animate-slide-out-up pointer-events-none opacity-0' : 'animate-slide-up'}
        ${isHovered && !isExiting ? 'shadow-premium-hover border-brand-primary/10 -translate-y-2 scale-[1.01]' : 'shadow-premium'}
      `}
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !isExiting && onClick(product)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-amber-50/50 to-orange-50/50 mb-2.5 sm:mb-3 md:mb-4 p-2 sm:p-3 md:p-4 lg:p-6 transition-all duration-500 rounded-xl sm:rounded-2xl overflow-hidden">
        {/* Image */}
        <img
          src={product.image}
          alt={product.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-700 ease-out z-10 relative
            ${isHovered && !isExiting && !product.isOutOfStock ? 'scale-110 rotate-1' : 'scale-100'}
            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            ${product.isOutOfStock ? 'grayscale opacity-60' : ''}
          `}
        />

        {/* Floating "Add to Hive" Overlay - Always visible on mobile */}
        {!isExiting && (
          <div className={`absolute bottom-2 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isHovered || product.isOutOfStock || product.isComingSoon ? 'opacity-100 translate-y-0' : 'sm:opacity-0 sm:translate-y-3 sm:pointer-events-none opacity-100 translate-y-0'}`}>
            <button
              onClick={handleAddToCart}
              disabled={addStatus !== 'idle' || product.isOutOfStock || product.isComingSoon}
              className={`group/hive flex items-center gap-1.5 sm:gap-2 md:gap-2.5 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.18em] backdrop-blur-md shadow-xl sm:shadow-2xl transition-all duration-500 transform border w-max
                ${product.isOutOfStock || product.isComingSoon
                  ? 'bg-zinc-200/90 text-zinc-400 border-zinc-300 cursor-not-allowed shadow-none'
                  : addStatus === 'idle'
                    ? 'bg-brand-black/90 text-brand-primary border-brand-primary/20 shadow-brand-primary/10 hover:bg-brand-primary hover:text-white hover:border-white/20 hover:shadow-brand-primary/30 hover:scale-[1.03] active:scale-95'
                    : ''
                }
                ${addStatus === 'loading' ? 'bg-brand-dark/60 text-white cursor-wait border-white/10' : ''}
                ${addStatus === 'success' ? 'bg-brand-meadow text-white border-brand-meadow/50 shadow-brand-meadow/20 scale-[1.03]' : ''}
              `}
            >
              {addStatus === 'loading' ? (
                <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : addStatus === 'success' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                !(product.isOutOfStock || product.isComingSoon) && (
                  <div className="relative w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-500 group-hover/hive:buzz">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                      <path d="M12 2L4.5 20.29L5.21 21L12 18L18.79 21L19.5 20.29L12 2Z" fillOpacity="0.3" />
                      <path d="M12 4L6 18.5H18L12 4Z" />
                      <circle cx="12" cy="13" r="1.5" className="animate-pulse" />
                    </svg>
                  </div>
                )
              )}
              <span className="whitespace-nowrap">
                {product.isOutOfStock ? 'Sold Out' : product.isComingSoon ? 'Coming Soon' : addStatus === 'loading' ? 'Adding' : addStatus === 'success' ? 'Added!' : 'Add to Hive'}
              </span>
            </button>
          </div>
        )}

        {/* Subtle Depth Overlay on Hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent transition-opacity duration-700 z-20 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Top Left - Status Badge */}
        {badge && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 md:top-3 md:left-3 z-10">
            <span className={`${badge.color} text-[7px] sm:text-[8px] md:text-[10px] font-bold px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 rounded-full shadow-lg uppercase tracking-wider`}>
              {badge.text}
            </span>
          </div>
        )}

        {/* Top Right - Wishlist Action - Always visible on mobile */}
        {!isExiting && onToggleWishlist && (
          <div className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 md:top-3 md:right-3 z-30 transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'sm:opacity-0 sm:translate-x-4 sm:pointer-events-none opacity-100 translate-x-0'}`}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist();
              }}
              className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border shadow-lg
                ${isWishlisted
                  ? 'bg-rose-500 text-white border-rose-400 scale-110'
                  : 'bg-white/80 text-gray-400 border-white/50 hover:text-rose-500 hover:bg-white hover:border-rose-200'
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 stroke-2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
            </button>
          </div>
        )}

        {/* Bottom Left - Format Badge */}
        {product.format && (
          <div className="absolute bottom-1.5 left-1.5 sm:bottom-2 sm:left-2 md:bottom-3 md:left-3 z-10">
            <span className="bg-white/95 backdrop-blur-sm text-gray-700 text-[8px] sm:text-[9px] md:text-[10px] font-semibold px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 rounded-full shadow-sm border border-gray-100">
              {product.format}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col px-1 sm:px-2 md:px-3 pb-1 sm:pb-2 md:pb-3">
        {/* Category */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-1.5 md:mb-2.5">
          <span className="text-[8px] sm:text-[9px] md:text-[11px] font-black text-brand-secondary uppercase tracking-[0.15em] sm:tracking-[0.2em]">
            {product.category === 'Books' ? 'Educational Book' : product.category}
          </span>
          <div className="h-0.5 w-0.5 sm:h-1 sm:w-1 rounded-full bg-brand-primary/30" />
        </div>

        {/* Title */}
        <h3 className="text-brand-black font-black text-xs sm:text-sm md:text-base lg:text-lg leading-tight line-clamp-2 mb-0.5 sm:mb-1 md:mb-2 group-hover:text-brand-primary transition-colors">
          {product.title}
        </h3>

        {/* Author */}
        <p className="text-gray-400 text-[9px] sm:text-[10px] md:text-xs font-bold mb-2 sm:mb-3 md:mb-4 italic line-clamp-1">
          by {product.author}
        </p>

        {/* Price & Rating Row */}
        <div className="flex items-center justify-between mt-auto pt-1.5 sm:pt-2 md:pt-3 border-t border-gray-100">
          {/* Price */}
          <span className="text-sm sm:text-base md:text-lg font-black text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>

          {/* Rating */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 bg-amber-50 px-1.5 sm:px-2 md:px-2.5 py-0.5 sm:py-1 md:py-1.5 rounded-md sm:rounded-lg">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-amber-500 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-[10px] sm:text-xs md:text-sm font-bold text-gray-700">{product.rating}</span>
            <span className="text-[8px] sm:text-[10px] md:text-xs text-gray-400 hidden sm:inline">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;