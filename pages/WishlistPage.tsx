import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.tsx';
import ProductDetails from '../components/ProductDetails.tsx';
import CartDrawer from '../components/CartDrawer.tsx';
import CheckoutModal from '../components/CheckoutModal.tsx';
import QuickViewModal from '../components/QuickViewModal.tsx';
import InteractiveParticles from '../components/InteractiveParticles.tsx';
import RoamingBee from '../components/RoamingBee.tsx';
import { MOCK_PRODUCTS } from '../constants.ts';
import { Product, CartItem, User } from '../types';
import BeeCharacter from '../components/BeeCharacter.tsx';

interface WishlistPageProps {
  user: User | null;
}

const WishlistPage: React.FC<WishlistPageProps> = ({ user }) => {
  const products = MOCK_PRODUCTS;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const [wishlist, setWishlist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('singglebee_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  useEffect(() => {
    localStorage.setItem('singglebee_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

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

  const removeFromWishlist = (productId: number) => {
    setWishlist(prev => prev.filter(id => id !== productId));
  };

  const moveAllToCart = () => {
    const wishlistProducts = products.filter(p => wishlist.includes(p.id));
    
    setCart(prev => {
      const newCart = [...prev];
      wishlistProducts.forEach(product => {
        const existingInfo = newCart.find(item => item.id === product.id);
        if (existingInfo) {
          existingInfo.quantity += 1;
        } else {
          newCart.push({ ...product, quantity: 1 });
        }
      });
      return newCart;
    });

    setWishlist([]);
    localStorage.setItem('singglebee_wishlist', JSON.stringify([]));
    setIsCartOpen(true);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shippingFee = cartSubtotal > 0 && cartSubtotal < 1499 ? 50 : 0;
  const cartTotal = cartSubtotal + shippingFee;

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-primary selection:text-brand-black relative pt-20">
      <div className="fixed inset-0 honeycomb-pattern pointer-events-none -z-10"></div>

      <InteractiveParticles />
      <RoamingBee isCheckoutOpen={isCheckoutOpen} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-primary via-amber-300 to-brand-primary py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-2">My Wishlist ❤️</h1>
        <p className="text-brand-secondary font-bold text-sm md:text-base">
          {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved for later
        </p>
      </div>

      <div className="flex-1 container mx-auto px-4 py-8 max-w-screen-2xl">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-2xl font-black text-brand-secondary mb-2">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-6">Start adding products you love!</p>
            <a 
              href="/shop"
              className="inline-block py-3 px-6 bg-brand-primary hover:bg-brand-secondary text-brand-black font-black rounded-xl transition-all shadow-honey"
            >
              Browse Products 🛍️
            </a>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-2xl shadow-sm border border-brand-primary/10">
              <p className="font-bold text-gray-700">
                Move all items to cart or remove individually
              </p>
              <button
                onClick={moveAllToCart}
                className="py-2 px-6 bg-brand-primary hover:bg-brand-secondary text-brand-black font-black rounded-xl transition-all active:scale-[0.98]"
              >
                Move All to Cart 🛒
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onQuickView={setQuickViewProduct}
                  onViewDetails={setSelectedProduct}
                  isWishlisted={true}
                  onToggleWishlist={() => removeFromWishlist(product.id)}
                />
              ))}
            </div>
          </>
        )}
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

export default WishlistPage;
