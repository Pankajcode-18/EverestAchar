import React from 'react';
import { Sparkles, ShieldCheck, Heart, Droplets, Flame, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const AboutUsPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Heritage & Tradition</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-serif font-extrabold text-slate-900">
            Our Story — नेपाल की परंपरा, स्वाद में बेजोड़
          </h1>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            Preserving the timeless art of traditional Nepali pickle making amidst the serene valleys of Kullu-Manali, Himachal Pradesh.
          </p>
        </div>

        {/* Founders Spotlight Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-premium border border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-himalayan-950">
            <img
              src="/images/owners/business-owners-card.png"
              alt="Founders Sunita Kathayat & Tilak Sijapati"
              className="w-full h-auto object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/banner/packaging-banner.jpg';
              }}
            />
            <div className="p-4 bg-himalayan-950 text-white text-xs">
              <span className="font-serif font-bold text-rose-400 block text-sm">
                Sunita Kathayat & Tilak Sijapati
              </span>
              <span className="text-slate-300">Founders • Everest Nepali Achar</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <h2 className="text-xl sm:text-3xl font-serif font-extrabold text-slate-900">
              A Passion Born from Authentic Mountain Roots
            </h2>
            <p className="text-xs sm:text-base text-slate-700 leading-relaxed">
              <strong>Everest Nepali Achar (एभरेस्ट नेपाली अचार)</strong> was created with a heartfelt desire to bring the genuine, robust tastes of Nepal to pickle lovers across India.
            </p>
            <p className="text-xs sm:text-base text-slate-700 leading-relaxed">
              Founded and managed by <strong>Sunita Kathayat & Tilak Sijapati</strong>, our kitchen is nestled in Kullu-Manali, Himachal Pradesh. We handcraft authentic Non-Vegetarian specialties like tender Chicken & succulent Mutton pickles, alongside iconic Nepali vegetarian treasures like fiery Dalle Khursani, wild Himalayan Timur, fermented Gundruk, and slow-tempered Garlic achar.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block">🏔️ Pristine Kitchen</span>
                <span className="text-slate-600">Kullu-Manali, Himachal Pradesh</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block">❤️ Small Batch Care</span>
                <span className="text-slate-600">Traditional hand-tempering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Our 4 Core Pillars */}
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-serif font-bold text-slate-900">
              Our Core Principles & Quality Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">100% Pure Mustard Oil</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We only use pure cold-pressed mustard oil to ensure natural preservation without synthetic additives.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">Authentic Timur & Spices</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Directly sourced wild Himalayan Timur, yellow mustard, and traditional roasted fenugreek seeds.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">Hygiene & Freshness</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prepared with the same care and cleanliness as a family meal, following proper sterilization.
              </p>
            </div>

            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">Customer Trust</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We treat every customer with respect, ensuring fair prices and safe doorstep transit.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-gradient-to-r from-himalayan-950 via-himalayan-900 to-himalayan-950 text-white rounded-3xl p-6 sm:p-8 text-center space-y-3 sm:space-y-4 border border-white/10 shadow-xl">
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">Want to talk to the founders?</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Sunita Kathayat and Tilak Sijapati are always happy to answer your questions or assist with special family orders.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <a
              href="https://wa.me/917991502810?text=Namaste!%20I%20would%20like%20to%20know%20more%20about%20Everest%20Nepali%20Achar."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp 1: +91 79915 02810</span>
            </a>
            <a
              href="https://wa.me/918219319253?text=Namaste!%20I%20would%20like%20to%20know%20more%20about%20Everest%20Nepali%20Achar."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-full shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp 2: +91 82193 19253</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
