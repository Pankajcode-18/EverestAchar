import React from 'react';
import { PriceCalculator } from '../components/PriceCalculator';
import { Sparkles } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const PricingPage: React.FC = () => {
  const verifiedTariffs = [
    {
      name: 'Chicken Pickle (कुखुराको अचार)',
      nepali: 'नेपाली कुखुराको विशेष अचार',
      hp: '₹1,200/kg (Free Delivery)',
      delhi: '₹1,300/kg (Free Delivery)',
      outside: '1kg: ₹1,800 | 3kg+: ₹3,600 (Free Delivery)',
      tag: '🍗 Non-Veg Bestseller',
      highlight: true,
    },
    {
      name: 'Mutton Pickle (मटन अचार)',
      nepali: 'खसीको परम्परागत अचार',
      hp: '₹2,000/kg (Free Delivery)',
      delhi: '₹2,200/kg (Free Delivery)',
      outside: '1kg: ₹2,600 | 3kg+: ₹2,200/kg + ₹230/kg courier',
      tag: '🥩 Himalayan Specialty',
      highlight: true,
    },
    {
      name: 'Dalle Khursani Pickle (डल्ले खुर्सानी)',
      nepali: 'आगो जस्तै पिरो डल्ले खुर्सानी',
      hp: '₹1,000/kg (Free Delivery)',
      delhi: '₹1,100/kg (Free Delivery)',
      outside: '1kg: ₹1,500 | 3kg+: ₹3,000 (Free Delivery)',
      tag: '🌶️ Round Cherry Chili',
      highlight: true,
    },
    {
      name: 'Fish Pickle (माछा को अचार)',
      nepali: 'माछाको स्वादिलो अचार',
      hp: '₹1,400/kg (Free Delivery)',
      delhi: '₹1,400/kg (Free Delivery)',
      outside: '1kg: ₹1,800 | 3kg+: ₹1,400/kg + ₹230/kg courier',
      tag: '🐟 Boneless Fillet',
      highlight: false,
    },
    {
      name: 'Raw Garlic Pickle (काँचो लसुनको अचार)',
      nepali: 'काँचो लसुनको परम्परागत अचार',
      hp: '₹600/kg (Free Delivery)',
      delhi: '₹600/kg (Free Delivery)',
      outside: '₹600/kg + ₹200/kg courier charge',
      tag: '🧄 Pure Raw Garlic',
      highlight: false,
    },
    {
      name: 'Fried/Dried Garlic Pickle (तारेको लसुन)',
      nepali: 'भुटेको लसुनको क्रिस्पी अचार',
      hp: '₹700/kg (Free Delivery)',
      delhi: '₹800/kg (Free Delivery)',
      outside: '₹800/kg + ₹200/kg courier charge',
      tag: '🧄 Roasted Garlic',
      highlight: false,
    },
    {
      name: 'Himalayan Timur & Specialty Herbs',
      nepali: 'टिमुर, गुन्द्रुक, तामा र लप्सी',
      hp: 'Starting ₹600/kg',
      delhi: 'Starting ₹600/kg',
      outside: 'Starting ₹600/kg + courier charge',
      tag: '🌿 Traditional Mountain',
      highlight: false,
    },
  ];

  return (
    <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>100% Transparent Location-Based Pricing</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-serif font-extrabold text-slate-900">
            Everest Nepali Achar Tariff & Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every price is backed by our deterministic rules. No hidden packing fees. Free doorstep delivery in Himachal Pradesh and Delhi NCR.
          </p>
        </div>

        {/* Live Interactive Calculator */}
        <div className="max-w-4xl mx-auto">
          <PriceCalculator />
        </div>

        {/* Tariff Cards */}
        <div className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="font-serif font-bold text-lg sm:text-2xl text-slate-900">
              Verified Location Tariff Matrix
            </h2>
            <p className="text-xs text-slate-600">
              Official rates set by founders Sunita Kathayat & Tilak Sijapati
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {verifiedTariffs.map((t, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-4 sm:p-5 border shadow-sm space-y-3 ${
                  t.highlight ? 'border-rose-300 ring-1 ring-rose-200' : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2">
                  <div>
                    <span className="text-xs font-bold text-rose-700 font-nepali block">
                      {t.nepali}
                    </span>
                    <h3 className="font-serif font-bold text-sm text-slate-900">
                      {t.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full flex-shrink-0">
                    {t.tag}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  <div className="flex justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                    <span className="font-medium text-slate-600">📍 Himachal:</span>
                    <span className="font-bold text-slate-900">{t.hp}</span>
                  </div>

                  <div className="flex justify-between py-1 bg-slate-50 px-2.5 rounded-lg">
                    <span className="font-medium text-slate-600">📍 Delhi / CHD:</span>
                    <span className="font-bold text-slate-900">{t.delhi}</span>
                  </div>

                  <div className="py-1.5 bg-rose-50/50 px-2.5 rounded-lg border border-rose-100">
                    <span className="font-medium text-slate-600 block text-[11px]">📍 Outside Delhi (Other States):</span>
                    <span className="font-bold text-slate-900 text-[11px]">{t.outside}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WhatsApp Notice Banner */}
        <div className="bg-himalayan-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center space-y-3 border border-white/10 shadow-xl max-w-3xl mx-auto">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-white">
            Need a custom order or bulk party packaging?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            For unlisted sizes, wedding orders, or restaurant wholesale queries, chat directly with founders Sunita Kathayat & Tilak Sijapati.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="https://wa.me/917991502810?text=Namaste!%20I%20have%20a%20pricing%20inquiry%20for%20Everest%20Nepali%20Achar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-5 bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md"
            >
              <span>WhatsApp 1: +91 79915 02810</span>
            </a>
            <a
              href="https://wa.me/918219319253?text=Namaste!%20I%20have%20a%20pricing%20inquiry%20for%20Everest%20Nepali%20Achar."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 h-12 px-5 bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md"
            >
              <span>WhatsApp 2: +91 82193 19253</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
