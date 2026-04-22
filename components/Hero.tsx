
import React, { useState, useEffect, useRef } from 'react';
import InteractiveBee from './InteractiveBee';
import BeeCharacter from './BeeCharacter';

interface HeroProps {
  onShopNow: () => void;
}

interface FloatingAssetProps {
  icon: React.ReactNode;
  delay: number;
  scale: number;
  x: string;
  y: string;
  parallaxFactor: number;
  mousePos: { x: number; y: number };
  baseRotation?: number;
  floatDuration?: number;
  floatDistance?: number;
}

const FloatingAsset: React.FC<FloatingAssetProps> = ({
  icon, delay, scale, x, y, parallaxFactor, mousePos, baseRotation = 0, floatDuration = 5, floatDistance = 20
}) => {
  // Deep parallax: multiply mouse offset by a factor that creates a 3D depth illusion
  const transformX = mousePos.x * parallaxFactor;
  const transformY = mousePos.y * parallaxFactor;

  // Dynamic rotation: assets tilt slightly as if affected by the 'air' of the mouse movement
  const dynamicRotation = baseRotation + (transformX / 6);

  return (
    <div
      className="absolute pointer-events-none select-none transition-transform duration-1000 ease-out hidden sm:block"
      style={{
        left: x,
        top: y,
        fontSize: `${scale}rem`,
        transform: `translate(${transformX}px, ${transformY}px)`,
        opacity: Math.min(0.20, 0.03 + (parallaxFactor * 0.08)),
        zIndex: Math.floor(parallaxFactor * 10),
      }}
    >
      <div
        className="animate-float"
        style={{
          animationDelay: `${delay}ms`,
          animationDuration: `${floatDuration}s`,
          transform: `rotate(${dynamicRotation}deg)`,
        }}
      >
        {icon}
      </div>
    </div>
  );
};

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position relative to the center of the viewport
      const x = (e.clientX - window.innerWidth / 2) / 25;
      const y = (e.clientY - window.innerHeight / 2) / 25;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[420px] sm:min-h-[500px] md:min-h-[700px] flex flex-col items-center overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[5rem] mb-8 sm:mb-12 md:mb-24 shadow-premium border-4 sm:border-[6px] md:border-[10px] border-white bg-white transition-all hover:shadow-honey-hover"
    >
      {/* GLOW AND GROWTH ASSURED badge */}
      <div className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-16 z-40 inline-flex items-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 md:py-3 px-3 sm:px-5 md:px-8 rounded-full bg-brand-black/90 backdrop-blur-md border border-white/20 shadow-[0_0_35px_rgba(255,255,255,0.6)] group cursor-default transition-all hover:scale-105 whitespace-nowrap">
        <span className="group-hover:animate-buzz inline-block text-white text-xs sm:text-sm">✨</span>
        <span className="text-white text-[9px] sm:text-xs md:text-lg font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-[0.25em]">
          GLOW AND GROWTH ASSURED
        </span>
      </div>

      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 via-white to-brand-accent/30"></div>

        {/* Living Orbs - hidden on very small screens */}
        <div className="absolute top-0 right-0 w-[400px] sm:w-[600px] md:w-[800px] h-[400px] sm:h-[600px] md:h-[800px] bg-brand-primary/10 rounded-full blur-[100px] sm:blur-[140px] -mr-40 sm:-mr-60 md:-mr-80 -mt-20 sm:-mt-30 md:-mt-40 animate-float opacity-50 sm:opacity-70"></div>
        <div className="hidden sm:block absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-brand-secondary/5 rounded-full blur-[80px] md:blur-[120px] -ml-24 md:-ml-40 -mb-24 md:-mb-40"></div>

        {/* Layered Floating Assets - hidden on mobile for performance */}
        <FloatingAsset icon="📚" x="5%" y="15%" scale={3.5} delay={0} parallaxFactor={0.2} mousePos={mousePos} baseRotation={-15} floatDuration={8} />
        <FloatingAsset icon="🖋️" x="85%" y="75%" scale={2.8} delay={1500} parallaxFactor={0.15} mousePos={mousePos} baseRotation={10} floatDuration={9} />
        <FloatingAsset icon="📖" x="12%" y="70%" scale={3.2} delay={2200} parallaxFactor={0.25} mousePos={mousePos} baseRotation={5} floatDuration={7.5} />
        <FloatingAsset icon="🍯" x="80%" y="12%" scale={4.5} delay={500} parallaxFactor={0.6} mousePos={mousePos} baseRotation={12} floatDuration={6} />
        <FloatingAsset icon="🍎" x="18%" y="82%" scale={3} delay={3000} parallaxFactor={0.5} mousePos={mousePos} baseRotation={-20} floatDuration={5.5} />
        <FloatingAsset icon="🥨" x="72%" y="65%" scale={2.5} delay={1200} parallaxFactor={0.45} mousePos={mousePos} baseRotation={8} floatDuration={6.8} />
        <FloatingAsset icon={<BeeCharacter size="100%" />} x="45%" y="78%" scale={2.2} delay={1800} parallaxFactor={1.3} mousePos={mousePos} baseRotation={0} floatDuration={4} />
        <FloatingAsset icon="🍪" x="90%" y="40%" scale={2.5} delay={2500} parallaxFactor={1.1} mousePos={mousePos} baseRotation={-10} floatDuration={4.5} />
        <FloatingAsset icon="🌻" x="25%" y="8%" scale={3.5} delay={3500} parallaxFactor={0.9} mousePos={mousePos} baseRotation={15} floatDuration={5} />
      </div>

      {/* Decorative Honey Drip Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none opacity-30 sm:opacity-40">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 0H1440V40C1440 40 1320 120 1200 120C1080 120 960 40 840 40C720 40 600 120 480 120C360 120 240 40 120 40C0 40 0 0 0 0Z" fill="#FFC107" />
          <circle cx="240" cy="110" r="8" fill="#FFC107" className="animate-float" style={{ animationDuration: '3s' }} />
          <circle cx="720" cy="90" r="12" fill="#FFC107" className="animate-float" style={{ animationDuration: '4s', animationDelay: '1s' }} />
          <circle cx="1100" cy="115" r="6" fill="#FFC107" className="animate-float" style={{ animationDuration: '5s', animationDelay: '0.5s' }} />
        </svg>
      </div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-30 flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-12 py-16 sm:py-20 md:py-24 lg:py-0 h-full max-w-screen-2xl">

        {/* Left Side: Branding and Messaging */}
        <div className="w-full lg:max-w-2xl animate-slide-up text-center lg:text-left mt-6 sm:mt-8 lg:mt-0 px-1 sm:px-2 md:px-0">
          <h1 className="text-3xl sm:text-5xl md:text-7xl xl:text-9xl font-black text-brand-black mb-3 sm:mb-4 md:mb-10 leading-[1.1] md:leading-[0.9] tracking-tighter">
            Learn <br className="hidden sm:block" />& <span className="text-brand-secondary relative inline-block group">
              Buzz
              <svg className="absolute -bottom-0.5 sm:-bottom-1 md:-bottom-2 left-0 w-full h-1 sm:h-1.5 md:h-3 text-brand-primary/40 transition-transform duration-500 group-hover:scale-x-110" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="text-sm sm:text-lg md:text-2xl xl:text-3xl text-brand-black/80 font-bold mb-6 sm:mb-8 md:mb-14 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Curated books, delicious treats, and premium supplies.
            <br className="hidden sm:block" />
            <span className="text-brand-black/40 italic text-xs sm:text-sm md:text-base">Tap our busy bee to see the hive magic!</span>
          </p>

          <div className="flex justify-center lg:justify-start">
            <button
              onClick={onShopNow}
              className="w-full sm:w-auto bg-brand-black text-brand-primary font-black py-3.5 sm:py-5 md:py-7 px-8 sm:px-12 md:px-16 rounded-2xl sm:rounded-[2.5rem] shadow-[0_15px_40px_-10px_rgba(31,18,15,0.4)] hover:shadow-[0_30px_60px_-15px_rgba(255,193,7,0.4)] hover:scale-105 active:scale-95 transition-all text-base sm:text-lg md:text-2xl flex items-center justify-center gap-2 sm:gap-3 md:gap-4 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative z-10">Start Shopping</span>
              <span className="relative z-10 group-hover:rotate-12 transition-transform text-xl sm:text-2xl md:text-3xl">🍯</span>
            </button>
          </div>
        </div>

        {/* Right Side: Interactive Character */}
        <div className="relative animate-fade-in flex items-center justify-center w-full lg:w-1/2 mt-4 sm:mt-8 lg:mt-0">
          {/* Reactive Atmospheric Glows */}
          <div className="absolute w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] bg-brand-primary/25 rounded-full blur-[80px] sm:blur-[100px] md:blur-[120px] -z-10 animate-pulse"></div>
          <div className="absolute w-[120px] sm:w-[180px] md:w-[300px] h-[120px] sm:h-[180px] md:h-[300px] bg-brand-secondary/35 rounded-full blur-[50px] sm:blur-[60px] md:blur-[80px] -z-10"></div>

          {/* Character Container */}
          <div className="scale-50 sm:scale-65 md:scale-100 transition-transform duration-700 hover:scale-[1.05] will-change-transform origin-center">
            <InteractiveBee />
          </div>

          {/* Scroll hint */}
          <div className="absolute -bottom-8 sm:-bottom-12 md:-bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 sm:gap-2 md:gap-3">
            <span className="text-brand-black/30 font-black text-[8px] sm:text-[9px] md:text-[11px] uppercase tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.6em] animate-pulse whitespace-nowrap">
              Scroll to explore the hive
            </span>
            <div className="w-1 h-6 sm:h-8 md:w-1.5 md:h-10 bg-brand-primary/20 rounded-full relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-primary animate-bounce rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
