import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const BrandIntro: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Packaging & Owners image */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden shadow-premium border border-slate-200">
              <img
                src="/images/owners/business-owners-card.png"
                alt="Sunita Kathayat and Tilak Sijapati - Everest Nepali Achar"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/banner/packaging-banner.jpg';
                }}
              />
              <div className="p-4 bg-himalayan-950 text-white flex items-center justify-between text-xs">
                <div>
                  <p className="font-serif font-bold text-rose-400">Sunita Kathayat & Tilak Sijapati</p>
                  <p className="text-slate-300">Founders • Kullu, Manali (Himachal Pradesh)</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-700 text-white rounded font-medium">
                  Authentic
                </span>
              </div>
            </div>
          </div>

          {/* Right: Story narrative */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Our Himalayan Tradition</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 leading-tight">
              स्वाद नेपाल का, भरोसा हमारा <br />
              <span className="text-rose-700 text-xl sm:text-3xl font-nepali font-bold">
                (Authentic Taste of Nepal with Complete Trust)
              </span>
            </h2>

            <p className="text-slate-700 leading-relaxed text-xs sm:text-base">
              At <strong>Everest Nepali Achar</strong>, every bottle carries the warmth of genuine Himalayan heritage. Prepared in pristine Kullu-Manali by founders <strong>Sunita Kathayat & Tilak Sijapati</strong>, our recipes honor authentic Nepali culinary traditions handed down through generations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Pure Mountain Spices</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Authentic Timur, roasted mustard oil, and mountain garlic.</p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <Heart className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Handcrafted in Small Batches</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Ensuring maximum freshness, hygiene, and authentic taste.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-rose-700 transition-colors group"
              >
                <span>Read the full story of Everest Nepali Achar</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
