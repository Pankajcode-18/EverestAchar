import React from 'react';
import { ShoppingCart, MapPin, Calculator, Send } from 'lucide-react';

export const HowToOrder: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <ShoppingCart className="w-6 h-6 text-rose-600" />,
      title: 'Select Favorite Achar',
      nepaliTitle: 'अचार रोज्नुहोस्',
      desc: 'Pick from our authentic Chicken, Mutton, Fish, Dalle Khursani, Garlic, or Gundruk varieties.',
    },
    {
      step: '02',
      icon: <MapPin className="w-6 h-6 text-emerald-600" />,
      title: 'Enter Delivery City & State',
      nepaliTitle: 'स्थान छान्नुहोस्',
      desc: 'Select Himachal Pradesh, Delhi, Chandigarh, or your specific state/pincode.',
    },
    {
      step: '03',
      icon: <Calculator className="w-6 h-6 text-rose-600" />,
      title: 'Automatic Fair Calculation',
      nepaliTitle: 'मूल्य हेर्नुहोस्',
      desc: 'Our transparent pricing engine automatically applies free delivery or tiered courier rates.',
    },
    {
      step: '04',
      icon: <Send className="w-6 h-6 text-emerald-600" />,
      title: '1-Click WhatsApp Booking',
      nepaliTitle: 'अर्डर कन्फर्म गर्नुहोस्',
      desc: 'Receive your unique Order ID and instant WhatsApp dispatch confirmation with the owner.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Simple 4-Step Process
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
            How to Order Doorstep Pickles
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Easy online booking directly connected to our Kullu-Manali kitchen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((s, idx) => (
            <div
              key={idx}
              className="relative bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  {s.icon}
                </div>
                <span className="text-2xl font-serif font-black text-slate-700">
                  {s.step}
                </span>
              </div>

              <div>
                <span className="text-xs font-nepali font-bold text-rose-700 block">
                  {s.nepaliTitle}
                </span>
                <h3 className="text-base font-serif font-bold text-slate-900 mt-1 mb-2">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
