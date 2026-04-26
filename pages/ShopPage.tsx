import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard, { ProductSkeleton } from '../components/ProductCard.tsx';
import ProductDetails from '../components/ProductDetails.tsx';
import CartDrawer from '../components/CartDrawer.tsx';
import CheckoutModal from '../components/CheckoutModal.tsx';
import QuickViewModal from '../components/QuickViewModal.tsx';
import FilterSidebar from '../components/FilterSidebar.tsx';
import AuthModal from '../components/AuthModal.tsx';
import InteractiveParticles from '../components/InteractiveParticles.tsx';
import RoamingBee from '../components/RoamingBee.tsx';
import { MOCK_PRODUCTS } from '../constants.ts';
import { Category, Product, CartItem, User } from '../types';
import BeeCharacter from '../components/BeeCharacter.tsx';

interface ShopPageProps {
  user: User | null;
  initialCategory?: Category;
  onNavigateToContact: () => void;
  onNavigateToAbout: () => void;
}

const ShopPage: React.FC<ShopPageProps> = ({
  user,
  initialCategory = Category.ALL,
  onNavigateToContact,
  onNavigateToAbout,
}) => {
  const products = MOCK_PRODUCTS;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('singglebee_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating' | 'newest'>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const allProductsRef = useRef<HTMLDivElement>(null);

  // Initial Load Simulation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Update category when initialCategory prop changes
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Simple relevance scoring for search
  const calculateRelevance = (product: Product, query: string): number => {
    const q = query.toLowerCase();
    const title = product.title.toLowerCase();
    const author = product.author?.toLowerCase() || '';
    const desc = product.description.toLowerCase();
    let score = 0;

    if (title === q) score += 100;
    if (title.includes(q)) score += 50;
    if (author.includes(q)) score += 40;
    if (desc.includes(q)) score += 20;

    const queryWords = q.split(/\s+/).filter(w => w.length > 2);
    const titleWords = title.split(/\s+/);
    const authorWords = author.split(/\s+/);

    for (const qWord of queryWords) {
      if (titleWords.some(tw => tw.startsWith(qWord))) score += 15;
      if (titleWords.some(tw => tw.includes(qWord))) score += 8;
      if (authorWords.some(aw => aw.startsWith(qWord))) score += 10;
      if (authorWords.some(aw => aw.includes(qWord))) score += 5;
      if (product.language?.toLowerCase().includes(qWord.toLowerCase())) score += 60;
    }

    if (q.length >= 3 && q.length <= 10) {
      for (const tw of titleWords) {
        if (tw.length >= 3) {
          let matches = 0;
          const shorter = q.length < tw.length ? q : tw;
          const longer = q.length >= tw.length ? q : tw;
          for (let i = 0; i < shorter.length; i++) {
            if (longer.includes(shorter[i])) matches++;
          }
          const similarity = matches / longer.length;
          if (similarity >= 0.6) score += Math.round(similarity * 10);
        }
      }
    }

    return score;
  };

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedLanguage) {
      result = result.filter(p => p.language === selectedLanguage);
    }

    const booksCategories = [Category.BOOKS, Category.POEM_BOOK, Category.STORY_BOOK];

    if (selectedCategory !== Category.ALL) {
      result = result.filter(product => {
        if (selectedCategory === Category.BOOKS) {
          return booksCategories.includes(product.category);
        }
        return product.category === selectedCategory;
      });
    }

    result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);

    if (minRating !== null) {
      result = result.filter(product => product.rating >= minRating);
    }

    if (searchQuery.trim()) {
      const scoredProducts = result.map(product => ({
        product,
        score: calculateRelevance(product, searchQuery)
      }));

      result = scoredProducts
        .filter(sp => sp.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(sp => sp.product);
    }

    if (!searchQuery.trim()) {
      switch (sortBy) {
        case 'price-low':
          result = [...result].sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          result = [...result].sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result = [...result].sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result = [...result].sort((a, b) => b.id - a.id);
          break;
        default:
          result = [...result].sort((a, b) => a.id - b.id);
          break;
      }
    }

    result = [...result].sort((a, b) => {
      const aUnavailable = a.isComingSoon || a.isOutOfStock;
      const bUnavailable = b.isComingSoon || b.isOutOfStock;
      if (aUnavailable === bUnavailable) return 0;
      return aUnavailable ? 1 : -1;
    });

    return result;
  }, [products, selectedCategory, searchQuery, priceRange, minRating, sortBy, selectedLanguage]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(item => item.id !== id));
  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => {
      const newWishlist = prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId];
      localStorage.setItem('singglebee_wishlist', JSON.stringify(newWishlist));
      return newWishlist;
    });
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = cartSubtotal > 0 && cartSubtotal < 1499 ? 50 : 0;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-primary selection:text-brand-black relative pt-20">
      <div className="fixed inset-0 honeycomb-pattern pointer-events-none -z-10"></div>

      <InteractiveParticles />
      <RoamingBee isCheckoutOpen={isCheckoutOpen} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-primary via-amber-300 to-brand-primary py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-2">
          {selectedCategory === Category.ALL ? 'All Products' : 
           selectedCategory === Category.BOOKS ? 'Books Collection' :
           selectedCategory === Category.TOYS ? 'Toys & Games' :
           selectedCategory === Category.CLOTHING ? 'Clothing' :
           selectedCategory === Category.HOME_DECOR ? 'Home Decor' : 'Shop'}
        </h1>
        <p className="text-brand-secondary font-bold text-sm md:text-base">
          Discover amazing products at great prices
        </p>
      </div>

      <div className="flex flex-1 container mx-auto px-4 py-8 max-w-screen-2xl gap-6">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-72 shrink-0">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minRating={minRating}
            onMinRatingChange={setMinRating}
            selectedLanguage={selectedLanguage}
            onLanguageSelect={setSelectedLanguage}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden w-full mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full py-3 px-4 bg-white rounded-xl border-2 border-brand-primary text-brand-primary font-bold hover:bg-brand-primary hover:text-white transition-all"
          >
            {isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'} 🔧
          </button>
        </div>

        {/* Mobile Filter Sidebar */}
        {isMobileFilterOpen && (
          <div className="lg:hidden w-full mb-6">
            <FilterSidebar
              selectedCategory={selectedCategory}
              onCategorySelect={(cat) => {
                setSelectedCategory(cat);
                setIsMobileFilterOpen(false);
              }}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              selectedLanguage={selectedLanguage}
              onLanguageSelect={setSelectedLanguage}
            />
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          <div ref={allProductsRef}>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <ProductSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🐝</div>
                <h3 className="text-2xl font-black text-brand-secondary mb-2">No Products Found</h3>
                <p className="text-gray-500">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-300 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onQuickView={setQuickViewProduct}
                    onViewDetails={setSelectedProduct}
                    isWishlisted={wishlist.includes(product.id)}
                    onToggleWishlist={toggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        subtotal={cartSubtotal}
        shipping={shippingFee}
        total={cartTotal}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={cartTotal}
        user={user}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(quickViewProduct.id)}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onQuickView={setQuickViewProduct}
        />
      )}

      <BeeCharacter />
    </div>
  );
};

export default ShopPage;
