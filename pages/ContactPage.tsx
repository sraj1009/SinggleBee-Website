import React, { useState } from 'react';
import InteractiveParticles from '../components/InteractiveParticles.tsx';
import RoamingBee from '../components/RoamingBee.tsx';
import BeeCharacter from '../components/BeeCharacter.tsx';

interface ContactPageProps {
  onNavigateToShop: () => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onNavigateToShop }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light font-sans selection:bg-brand-primary selection:text-brand-black relative pt-20">
      <div className="fixed inset-0 honeycomb-pattern pointer-events-none -z-10"></div>

      <InteractiveParticles />
      <RoamingBee isCheckoutOpen={false} />

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-primary via-amber-300 to-brand-primary py-12 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-brand-black mb-2">Contact Us</h1>
        <p className="text-brand-secondary font-bold text-sm md:text-base">
          We'd love to hear from you! 🐝
        </p>
      </div>

      <div className="flex-1 container mx-auto px-4 py-12 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-black text-brand-secondary mb-6">Get in Touch</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                Have questions about our products? Need help with an order? 
                Or just want to say hello? We're here to help!
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-brand-primary/10">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-2xl shrink-0">
                  📧
                </div>
                <div>
                  <h3 className="font-black text-brand-secondary mb-1">Email Us</h3>
                  <p className="text-sm text-gray-600">singglebee.rsventures@gmail.com</p>
                  <p className="text-xs text-gray-500 mt-1">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-brand-primary/10">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-2xl shrink-0">
                  📱
                </div>
                <div>
                  <h3 className="font-black text-brand-secondary mb-1">WhatsApp</h3>
                  <p className="text-sm text-gray-600">+91 97608 08087</p>
                  <p className="text-xs text-gray-500 mt-1">For outside India orders</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-brand-primary/10">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-2xl shrink-0">
                  🚚
                </div>
                <div>
                  <h3 className="font-black text-brand-secondary mb-1">Shipping Info</h3>
                  <p className="text-sm text-gray-600">Free delivery for orders above ₹1499</p>
                  <p className="text-xs text-gray-500 mt-1">Ships across India</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-brand-primary/10">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-2xl shrink-0">
                  ⏰
                </div>
                <div>
                  <h3 className="font-black text-brand-secondary mb-1">Business Hours</h3>
                  <p className="text-sm text-gray-600">Monday - Saturday: 9 AM - 6 PM IST</p>
                  <p className="text-xs text-gray-500 mt-1">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-honey p-6 md:p-8 border border-brand-primary/10">
            <h2 className="text-2xl font-black text-brand-secondary mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-bold">
                🎉 Thank you! Your message has been sent successfully. We'll get back to you soon!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-black text-brand-secondary mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary outline-none transition-all font-bold text-gray-700"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-black text-brand-secondary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary outline-none transition-all font-bold text-gray-700"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-black text-brand-secondary mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary outline-none transition-all font-bold text-gray-700"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-black text-brand-secondary mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-brand-primary outline-none transition-all font-bold text-gray-700 resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-brand-primary hover:bg-brand-secondary text-brand-black font-black rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-honey hover:shadow-honey-hover active:scale-[0.98]"
              >
                {isSubmitting ? 'Sending...' : 'Send Message 🐝'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <BeeCharacter />
    </div>
  );
};

export default ContactPage;
