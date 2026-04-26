import React from 'react';
import InteractiveParticles from '../components/InteractiveParticles.tsx';
import RoamingBee from '../components/RoamingBee.tsx';
import BeeCharacter from '../components/BeeCharacter.tsx';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-primary selection:text-brand-black relative pt-20">
      <div className="fixed inset-0 honeycomb-pattern pointer-events-none -z-10"></div>

      <InteractiveParticles />
      <RoamingBee isCheckoutOpen={false} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-primary via-amber-300 to-brand-primary py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-2">About SinggleBee</h1>
        <p className="text-brand-secondary font-bold text-sm md:text-base">
          Your trusted partner for quality products 🐝
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        {/* Story Section */}
        <div className="bg-white rounded-3xl shadow-honey p-8 md:p-12 mb-8 border border-brand-primary/10">
          <div className="text-center mb-10">
            <div className="text-6xl mb-4">🍯</div>
            <h2 className="text-3xl md:text-4xl font-black text-brand-secondary mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Welcome to <strong className="text-brand-primary">SinggleBee</strong>, your one-stop destination for 
              carefully curated products that bring joy and value to your life. Like a busy bee collecting the finest 
              nectar, we search far and wide to bring you exceptional books, toys, clothing, home decor, and more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 bg-brand-light/50 rounded-2xl">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-black text-brand-secondary mb-2">Quality First</h3>
              <p className="text-sm text-gray-600">Every product is carefully selected to meet our high standards</p>
            </div>
            <div className="text-center p-6 bg-brand-light/50 rounded-2xl">
              <div className="text-4xl mb-3">💛</div>
              <h3 className="font-black text-brand-secondary mb-2">Customer Love</h3>
              <p className="text-sm text-gray-600">Your satisfaction is our top priority, always</p>
            </div>
            <div className="text-center p-6 bg-brand-light/50 rounded-2xl">
              <div className="text-4xl mb-3">🚚</div>
              <h3 className="font-black text-brand-secondary mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick and reliable shipping across India</p>
            </div>
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gradient-to-br from-brand-primary to-amber-300 rounded-3xl shadow-honey p-8 md:p-12 mb-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-brand-black mb-6">Our Mission</h2>
          <p className="text-brand-black/90 leading-relaxed max-w-3xl mx-auto text-lg font-bold">
            To make quality products accessible to everyone while providing an exceptional 
            shopping experience. We believe in building lasting relationships with our customers 
            through trust, transparency, and outstanding service.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="bg-white rounded-3xl shadow-honey p-8 md:p-12 mb-8 border border-brand-primary/10">
          <h2 className="text-3xl font-black text-brand-secondary mb-8 text-center">Why Choose SinggleBee?</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl shrink-0">
                ✨
              </div>
              <div>
                <h3 className="font-black text-brand-secondary mb-1">Curated Selection</h3>
                <p className="text-sm text-gray-600">Handpicked products that meet our quality standards</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl shrink-0">
                💰
              </div>
              <div>
                <h3 className="font-black text-brand-secondary mb-1">Best Prices</h3>
                <p className="text-sm text-gray-600">Competitive pricing without compromising quality</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl shrink-0">
                🔒
              </div>
              <div>
                <h3 className="font-black text-brand-secondary mb-1">Secure Shopping</h3>
                <p className="text-sm text-gray-600">Safe and secure payment options</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl shrink-0">
                📞
              </div>
              <div>
                <h3 className="font-black text-brand-secondary mb-1">Dedicated Support</h3>
                <p className="text-sm text-gray-600">Responsive customer service team ready to help</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl shrink-0">
                🎁
              </div>
              <div>
                <h3 className="font-black text-brand-secondary mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-600">Free delivery on orders above ₹1499</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-xl shrink-0">
                ❤️
              </div>
              <div>
                <h3 className="font-black text-brand-secondary mb-1">Customer First</h3>
                <p className="text-sm text-gray-600">Your satisfaction drives everything we do</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center py-8">
          <p className="text-gray-700 mb-4 font-bold">Ready to explore our collection?</p>
          <a 
            href="/shop"
            className="inline-block py-4 px-8 bg-brand-primary hover:bg-brand-secondary text-brand-black font-black rounded-xl transition-all shadow-honey hover:shadow-honey-hover active:scale-[0.98]"
          >
            Start Shopping 🛍️
          </a>
        </div>
      </div>

      <BeeCharacter />
    </div>
  );
};

export default AboutPage;
