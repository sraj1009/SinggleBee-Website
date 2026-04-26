import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx';
import AuthModal from './components/AuthModal.tsx';
import { Category, User } from './types';
import HomePage from './pages/HomePage.tsx';
import ShopPage from './pages/ShopPage.tsx';
import ContactPage from './pages/ContactPage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import WishlistPage from './pages/WishlistPage.tsx';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('singglebee_user');
      if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.warn("Could not load user session", e);
      localStorage.removeItem('singglebee_user');
    }
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setUser(userData);
    localStorage.setItem('singglebee_user', JSON.stringify(userData));
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('singglebee_user');
  };

  // Hide navbar and footer on certain routes if needed
  const showLayout = !location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-primary selection:text-brand-black relative">
      {showLayout && (
        <Navbar
          cartCount={0}
          onCartClick={() => navigate('/cart')}
          onSearch={(term) => {
            navigate(`/shop?search=${encodeURIComponent(term)}`);
          }}
          onCategorySelect={(cat) => {
            navigate(`/shop?category=${cat}`);
          }}
          onNavigateHome={() => navigate('/')}
          onNavigateTestimonials={() => navigate('/#testimonials')}
          onNavigateAbout={() => navigate('/about')}
          onNavigateTerms={() => navigate('/terms')}
          onNavigateContact={() => navigate('/contact')}
          onNavigateWishlist={() => navigate('/wishlist')}
          user={user}
          onSignInClick={() => setIsAuthOpen(true)}
          onSignOutClick={handleSignOut}
          onNavbarSearch={(term) => {
            navigate(`/shop?search=${encodeURIComponent(term)}`);
          }}
        />
      )}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={
            <HomePage
              user={user}
              onSignInClick={() => setIsAuthOpen(true)}
              onSignOutClick={handleSignOut}
              onNavigateToShop={(category) => {
                if (category) {
                  navigate(`/shop?category=${category}`);
                } else {
                  navigate('/shop');
                }
              }}
              onNavigateToContact={() => navigate('/contact')}
              onNavigateToAbout={() => navigate('/about')}
              onNavigateToWishlist={() => navigate('/wishlist')}
              onNavigateToSupport={(page) => navigate(`/support/${page}`)}
            />
          } />
          <Route path="/shop" element={
            <ShopPage
              user={user}
              onNavigateToContact={() => navigate('/contact')}
              onNavigateToAbout={() => navigate('/about')}
            />
          } />
          <Route path="/contact" element={
            <ContactPage
              onNavigateToShop={() => navigate('/shop')}
            />
          } />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/wishlist" element={
            <WishlistPage user={user} />
          } />
        </Routes>
      </main>

      {showLayout && <Footer />}

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
