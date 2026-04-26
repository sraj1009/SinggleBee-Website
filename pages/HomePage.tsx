import React, { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard, { ProductSkeleton } from '../components/ProductCard.tsx';
import ProductDetails from '../components/ProductDetails.tsx';
import CartDrawer from '../components/CartDrawer.tsx';
import CheckoutModal from '../components/CheckoutModal.tsx';
import QuickViewModal from '../components/QuickViewModal.tsx';
import FilterSidebar from '../components/FilterSidebar.tsx';
import Hero from '../components/Hero.tsx';
import SupportPage, { SupportPageType } from '../components/SupportPage.tsx';
import AuthModal from '../components/AuthModal.tsx';
import InteractiveParticles from '../components/InteractiveParticles.tsx';
import RoamingBee from '../components/RoamingBee.tsx';
import AutoScrollProductBand from '../components/AutoScrollProductBand.tsx';
import TestimonialMarquee from '../components/TestimonialMarquee.tsx';
import { MOCK_PRODUCTS } from '../constants.ts';
import { Category, Product, CartItem, User } from '../types';
import BeeCharacter from '../components/BeeCharacter.tsx';

interface HomePageProps {
  user: User | null;
  onSignInClick: () => void;
  onSignOutClick: () => void;
  onNavigateToShop: (category?: Category) => void;
  onNavigateToContact: () => void;
  onNavigateToAbout: () => void;
  onNavigateToWishlist: () => void;
  onNavigateToSupport: (page: SupportPageType) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  user,
  onSignInClick,
  onSignOutClick,
  onNavigateToShop,
  onNavigateToContact,
  onNavigateToAbout,
  onNavigateToWishlist,
  onNavigateToSupport,
}) => {
  const products = MOCK_PRODUCTS;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('singglebee_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('singglebee_user');
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        // User is managed by App, this is just for cart/wishlist
      }
    } catch (e) {
      console.warn("Could not load user session", e);
    }
  }, []);

  // Auto-scroll testimonials for mobile
  useEffect(() => {
    const scrollContainer = testimonialRef.current;
    if (!scrollContainer) return;

    let interval: NodeJS.Timeout;
    const startAutoScroll = () => {
      interval = setInterval(() => {
        if (!scrollContainer) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }, 4000);
    };

    startAutoScroll();

    const handleInteraction = () => {
      clearInterval(interval);
      setTimeout(startAutoScroll, 8000);
    };

    scrollContainer.addEventListener('touchstart', handleInteraction);
    scrollContainer.addEventListener('wheel', handleInteraction);

    return () => {
      clearInterval(interval);
      if (scrollContainer) {
        scrollContainer.removeEventListener('touchstart', handleInteraction);
        scrollContainer.removeEventListener('wheel', handleInteraction);
      }
    };
  }, []);

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
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-primary selection:text-brand-black relative">
      <div className="fixed inset-0 honeycomb-pattern pointer-events-none -z-10"></div>

      <InteractiveParticles />
      <RoamingBee isCheckoutOpen={isCheckoutOpen} />

      {/* Hero Section */}
      <Hero
        onShopNow={() => onNavigateToShop(Category.ALL)}
        onExploreBooks={() => onNavigateToShop(Category.BOOKS)}
      />

      {/* Auto Scroll Product Band */}
      <AutoScrollProductBand
        products={products.filter(p => p.category === Category.BOOKS).slice(0, 10)}
        onProductClick={(product) => {
          setSelectedProduct(product);
        }}
        onViewAll={() => onNavigateToShop(Category.BOOKS)}
      />

      {/* Featured Categories / Collections would go here */}

      {/* Testimonials */}
      <div id="testimonials-section" ref={testimonialRef}>
        <TestimonialMarquee />
      </div>

      {/* Footer would be in the main App layout */}

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

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(userData) => {
          // Handled by parent
        }}
      />

      <BeeCharacter />
    </div>
  );
};

export default HomePage;
