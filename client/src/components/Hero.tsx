import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Bot, MessageCircle, Sparkles, ShieldCheck, Truck, PackageCheck } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

interface HeroProps {
  onOpenChat?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenChat }) => {
  return (
    <section className="relative bg-gradient-to-b from-stone-100 via-rose-50/20 to-[#FAF7F2] text-stone-900 overflow-hidden pt-6 pb-12 sm:pt-12 sm:pb-20 border-b border-stone-200/80">
      {/* Background Subtle Warm Decorative Radiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-rose-200/30 via-stone-200/40 to-rose-200/30 rounded-full blur-3xl pointer-events-none opacity-60" />
      <div className="absolute -bottom-10 right-0 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: Main Brand Composition */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-rose-200/90 text-rose-900 text-xs sm:text-sm font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>100% Traditional Himalayan Recipe • Kullu-Manali</span>
            </div>

            {/* Brand Title */}
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-serif font-black text-stone-950 tracking-tight leading-[1.12]">
                EVEREST <span className="text-rose-700 font-nepali font-black block sm:inline">नेपाली अचार</span>
              </h1>
              <p className="text-xl xs:text-2xl sm:text-3xl text-rose-800 font-nepali font-extrabold tracking-wide">
                नेपाल की परंपरा, स्वाद में बेजोड़
              </p>
            </div>

            {/* Subtext Narrative */}
            <p className="text-sm sm:text-base md:text-lg text-stone-700 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Prepared in small, hygienic batches using pure cold-pressed mustard oil, wild Himalayan Timur, and authentic Nepali ancestral recipes by founders <strong className="text-stone-950 font-bold">Sunita Kathayat & Tilak Sijapati</strong> in Kullu-Manali.
            </p>

            {/* Mobile Hero Banner Image Placement */}
            <div className="lg:hidden my-4 relative max-w-md mx-auto">
              <div className="relative rounded-2xl overflow-hidden border-2 border-stone-200 shadow-xl bg-white aspect-[16/10]">
                <img
                  src="/images/banner/hero-banner.png"
                  alt="Everest Nepali Achar Traditional Pickles Display"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute bottom-2 left-2 right-2 p-2 bg-stone-950/90 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-white truncate">Sunita Kathayat & Tilak Sijapati</span>
                  <span className="text-rose-300 font-bold whitespace-nowrap ml-1">+91 79915 02810</span>
                </div>
              </div>
            </div>

            {/* Clean & High-Contrast Action Buttons */}
            <div className="pt-2 space-y-2.5 max-w-lg mx-auto lg:mx-0">
              {/* Row 1: Primary E-Commerce CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <Link
                  to="/order"
                  className="flex items-center justify-center gap-2.5 h-12 sm:h-14 px-6 font-black text-sm sm:text-base text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-xl sm:rounded-2xl shadow-lg shadow-rose-700/25 transition-all active:scale-95"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span className="text-white font-black">Order Fresh Pickles</span>
                </Link>

                <Link
                  to="/achar"
                  className="flex items-center justify-center gap-2.5 h-12 sm:h-14 px-6 font-extrabold text-sm sm:text-base text-stone-900 bg-white hover:bg-stone-50 active:bg-stone-100 rounded-xl sm:rounded-2xl border-2 border-stone-300 shadow-sm transition-all active:scale-95"
                >
                  <Eye className="w-5 h-5 text-rose-700" />
                  <span>Explore 16+ Varieties</span>
                </Link>
              </div>

              {/* Row 2: Direct Support & Live Tariff AI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Namaste!%20I%20would%20like%20to%20inquire%20about%20Everest%20Nepali%20Achar.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 px-4 font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl shadow-xs transition-all active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Founders</span>
                </a>

                <button
                  onClick={onOpenChat}
                  type="button"
                  className="flex items-center justify-center gap-2 h-11 px-4 font-bold text-xs sm:text-sm text-rose-900 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 rounded-xl border border-rose-200 shadow-xs transition-all active:scale-95"
                >
                  <Bot className="w-4 h-4 text-rose-700" />
                  <span>AI Price Tariff Guide</span>
                </button>
              </div>
            </div>

            {/* Trust Highlights Strip (3 Beautiful Clean Cards) */}
            <div className="pt-4 grid grid-cols-3 gap-2.5 border-t border-stone-200/90 max-w-xl mx-auto lg:mx-0 text-left text-xs">
              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs sm:text-sm">
                  <ShieldCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>100% Pure</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 leading-tight">Mustard Oil & Timur</div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs sm:text-sm">
                  <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Free Delivery</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 leading-tight">HP, Delhi & Chandigarh</div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-rose-700 font-bold text-xs sm:text-sm">
                  <PackageCheck className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>All India</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 leading-tight">Airtight Sealed Jars</div>
              </div>
            </div>
          </div>

          {/* Desktop Right Showcase Card */}
          <div className="hidden lg:flex lg:col-span-5 justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-300/30 to-amber-200/20 rounded-3xl filter blur-xl transform rotate-2"></div>
              <div className="relative rounded-3xl overflow-hidden border-2 border-stone-200/90 shadow-2xl bg-white">
                <img
                  src="/images/banner/hero-banner.png"
                  alt="Everest Nepali Achar Traditional Pickles Display"
                  className="w-full h-auto object-cover"
                />
                <div className="p-4 bg-stone-950 text-white flex items-center justify-between text-xs border-t border-stone-800">
                  <div>
                    <span className="font-bold text-white block text-sm">Sunita Kathayat & Tilak Sijapati</span>
                    <span className="text-[11px] text-stone-400">Founders • Kullu-Manali (HP)</span>
                  </div>
                  <a
                    href="tel:+917991502810"
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-extrabold rounded-lg text-xs whitespace-nowrap shadow-sm transition-all"
                  >
                    +91 79915 02810
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
