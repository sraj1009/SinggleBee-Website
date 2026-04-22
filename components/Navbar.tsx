
import React, { useState, useEffect, useRef } from 'react';
import { Category, User } from '../types';
import BeeCharacter from './BeeCharacter';
import brandLogo from '../assets/brand-logo.png';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch: (term: string) => void;
  onCategorySelect: (cat: Category) => void;
  onNavigateHome: () => void;
  onNavigateTestimonials: () => void;
  onNavigateAbout: () => void;
  onNavigateTerms: () => void;
  onNavigateContact: () => void;
  onNavigateWishlist: () => void;
  user: User | null;
  onSignInClick: () => void;
  onSignOutClick: () => void;
  onNavbarSearch: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onCartClick,
  onSearch,
  onCategorySelect,
  onNavigateHome,
  onNavigateTestimonials,
  onNavigateAbout,
  onNavigateTerms,
  onNavigateContact,
  onNavigateWishlist,
  user,
  onSignInClick,
  onSignOutClick,
  onNavbarSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  const navLinks = [
    { label: 'Home', icon: '🏠', action: onNavigateHome },
    { label: 'Shop', icon: '🛍️', action: () => onCategorySelect(Category.ALL) },
    { label: 'Wishlist', icon: '❤️', action: onNavigateWishlist },
    { label: 'Contact Us', icon: '📧', action: onNavigateContact },
    { label: 'About Us', icon: '📖', action: onNavigateAbout },
  ];

  const handleSearch = (term: string) => {
    if (onNavbarSearch) {
      onNavbarSearch(term);
    } else {
      onSearch(term);
    }
    setIsMobileSearchOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] font-sans">
      {/* Top Marquee */}
      <div className="bg-brand-black text-brand-primary text-[9px] sm:text-[10px] md:text-xs font-bold py-1 sm:py-1.5 overflow-hidden relative border-b border-white/10">
        <div className="w-full h-full flex items-center">
          <span className="whitespace-nowrap animate-marquee-one">
            🚚 Delivery is free for purchase above ₹1499 ✨ For outside India orders contact our whatsapp no. 9176008087 or gmail singglebee.rsventures@gmail.com ✨
          </span>
        </div>
      </div>

      <nav className={`w-full transition-all duration-500 ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-sm py-1.5 md:py-2 border-b border-brand-primary/5' : 'bg-transparent py-2 sm:py-3 md:py-6'}`}>
        <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-12 max-w-screen-2xl">
          <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-6">

            {/* Logo Container */}
            <div className="flex items-center cursor-pointer group shrink-0 relative" onClick={onNavigateHome}>
              <img
                src={brandLogo}
                alt="SINGGLEBEE Logo"
                className={`${scrolled ? 'h-10 sm:h-12 md:h-20' : 'h-12 sm:h-16 md:h-28'} w-auto transition-all duration-500 group-hover:scale-105`}
              />
            </div>

            {/* Centered Navigation - Desktop */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex items-center bg-white/60 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white/40 shadow-premium transition-all hover:bg-white/80 hover:shadow-honey">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={link.action}
                    className="px-4 py-2.5 rounded-2xl text-xs font-black text-brand-black transition-all hover:bg-brand-primary hover:text-brand-black whitespace-nowrap tracking-widest uppercase"
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-5 shrink-0">

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm text-brand-primary hover:bg-brand-primary hover:text-brand-black transition-all active:scale-95"
                aria-label="Search"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Search Desktop */}
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }} className="relative hidden xl:block group">
                <input
                  type="text"
                  className="w-64 pl-12 pr-6 py-3.5 rounded-2xl bg-white border-2 border-transparent focus:border-brand-primary outline-none text-sm font-bold shadow-premium transition-all focus:w-80"
                  placeholder="Search SinggleBee.com"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </form>

              {/* Profile / Account */}
              <div className="relative" ref={profileRef}>
                {user ? (
                  <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-white overflow-hidden bg-white shadow-honey active:scale-95 transition-all">
                    <img src={user.avatar} alt="Profile" className="w-full h-full rounded-lg sm:rounded-xl object-cover" />
                  </button>
                ) : (
                  <button onClick={onSignInClick} className="flex h-9 sm:h-10 md:h-14 px-3 sm:px-5 md:px-7 items-center justify-center bg-white rounded-xl sm:rounded-2xl border-2 border-amber-200 text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-800 hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm whitespace-nowrap">
                    Sign In
                  </button>
                )}

                {isProfileOpen && user && (
                  <div className="absolute top-full right-0 mt-3 sm:mt-5 w-56 sm:w-64 bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-honey-hover border border-brand-primary/5 overflow-hidden p-2 animate-slide-up origin-top-right">
                    <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-brand-light bg-brand-light/20 rounded-t-[1.5rem] sm:rounded-t-[2rem]">
                      <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest mb-1">Bee Account</p>
                      <p className="text-sm sm:text-base font-black text-brand-black truncate">{user.name}</p>
                    </div>
                    <button onClick={onSignOutClick} className="w-full text-left px-4 sm:px-6 py-3 sm:py-4 text-sm font-black text-brand-rose hover:bg-rose-50 transition-all flex items-center gap-3 rounded-b-[1.5rem] sm:rounded-b-[2rem]">
                      🚪 Log Out of Hive
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <button
                className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-14 md:h-14 flex-shrink-0 flex items-center justify-center rounded-xl sm:rounded-2xl bg-zinc-900 text-amber-400 shadow-lg hover:scale-105 active:scale-95 transition-all"
                onClick={onCartClick}
                aria-label="Open Cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 bg-rose-500 text-white text-[8px] sm:text-[10px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar - Expandable */}
          {isMobileSearchOpen && (
            <div className="xl:hidden mt-2 sm:mt-3 animate-slide-up">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSearch(searchTerm); }}
                className="relative"
              >
                <input
                  ref={mobileSearchRef}
                  type="text"
                  className="w-full pl-10 sm:pl-12 pr-12 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white border-2 border-brand-primary/20 focus:border-brand-primary outline-none text-sm font-bold shadow-honey transition-all"
                  placeholder="Search SinggleBee.com"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="h-4 w-4 sm:h-5 sm:w-5 absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-400"
                >
                  ✕
                </button>
              </form>
            </div>
          )}

          {/* Mobile Navigation - Compact pill bar */}
          <div className="lg:hidden mt-2 sm:mt-3 overflow-x-auto no-scrollbar -mx-3 sm:-mx-4 px-3 sm:px-4 pb-1 sm:pb-2">
            <div className="flex items-center gap-1 sm:gap-1.5 w-max mx-auto bg-gradient-to-r from-amber-50 to-orange-50 p-0.5 sm:p-1 rounded-full border border-amber-100 shadow-sm">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-semibold transition-all text-gray-700 hover:bg-white hover:shadow-sm active:bg-amber-100 whitespace-nowrap"
                >
                  {link.icon} {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Animation Styles */}
      <style>{`
        @keyframes marquee-one {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee-one {
          animation: marquee-one 30s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default Navbar;
