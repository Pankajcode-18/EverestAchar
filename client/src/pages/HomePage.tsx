import React, { useState, useEffect } from 'react';
import { Hero } from '../components/Hero';
import { BrandIntro } from '../components/BrandIntro';
import { ProductCard } from '../components/ProductCard';
import { PriceCalculator } from '../components/PriceCalculator';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowToOrder } from '../components/HowToOrder';
import { Testimonials } from '../components/Testimonials';
import { Product } from '../types';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Flame } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/products?featured=true');
        if (res.data.success) {
          setFeaturedProducts(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching featured products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 overflow-x-hidden bg-slate-50">
      {/* 1. Hero Section */}
      <Hero
        onOpenChat={() => {
          const chatBtn = document.querySelector('button[aria-label="Open Everest AI Assistant"]') as HTMLButtonElement;
          if (chatBtn) chatBtn.click();
        }}
      />

      {/* 2. Brand Introduction */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <BrandIntro />
      </div>

      {/* 3. Featured Pickles Showcase */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-slate-900">
              Popular Everest Nepali Pickles
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Hand-tempered with wild mountain spices in Kullu-Manali
            </p>
          </div>

          <Link
            to="/achar"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-rose-700 hover:text-rose-800 self-start sm:self-auto py-1"
          >
            <span>View All 16+ Varieties</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <div className="w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading popular varieties...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Interactive Smart Price Calculator Section */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="mb-4 sm:mb-6 text-center max-w-2xl mx-auto space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200 text-emerald-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Instant Tariff Check</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
            Calculate Your Order Price
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Select any pickle and your state for guaranteed exact delivery calculation
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <PriceCalculator />
        </div>
      </section>

      {/* 5. Why Choose Us */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <WhyChooseUs />
      </div>

      {/* 6. How To Order (4 Simple Steps) */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <HowToOrder />
      </div>

      {/* 7. Real Customer Testimonials */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <Testimonials />
      </div>

      {/* 8. WhatsApp Direct CTA Banner */}
      <section className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-himalayan-950 via-himalayan-900 to-himalayan-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl text-center space-y-3 sm:space-y-4">
          <h3 className="text-xl sm:text-3xl font-serif font-extrabold text-white">
            Have questions about custom orders or delivery?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Connect directly with founders <strong>Sunita Kathayat & Tilak Sijapati</strong> on WhatsApp for instant assistance.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/917991502810?text=Namaste!%20I%20have%20a%20question%20about%20Everest%20Nepali%20Achar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-5 bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <span>WhatsApp: +91 79915 02810</span>
            </a>
            <a
              href="https://wa.me/918219319253?text=Namaste!%20I%20have%20a%20question%20about%20Everest%20Nepali%20Achar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-5 bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95"
            >
              <span>Call / WA: +91 82193 19253</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
