import React from 'react';
import { ShieldCheck, Flame, Droplets, PackageCheck, Sparkles } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <Droplets className="w-6 h-6 text-emerald-600" />,
      title: 'Pure Cold-Pressed Mustard Oil',
      nepaliTitle: 'शुद्ध तोरीको तेल',
      description: 'Slow-tempered in 100% natural mustard oil without artificial preservatives or chemical colors.',
    },
    {
      icon: <Flame className="w-6 h-6 text-rose-600" />,
      title: 'Handpicked Himalayan Timur & Spices',
      nepaliTitle: 'अग्र्यानिक हिमाली टिमुर र मसला',
      description: 'Authentic wild-harvested Timur peppercorn and organic mountain spices giving distinct aroma.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Hygienic Traditional Preparation',
      nepaliTitle: 'सफा र शुद्ध परम्परागत विधि',
      description: 'Crafted in small batches under strict hygiene and traditional sun-curing processes in Kullu-Manali.',
    },
    {
      icon: <PackageCheck className="w-6 h-6 text-emerald-600" />,
      title: 'Airtight Leak-Proof Courier Packing',
      nepaliTitle: 'सुरक्षित डेलिभरी प्याकिङ',
      description: 'Double-sealed food grade containers delivered safely to your home anywhere across India.',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Why Everest Nepali Achar</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
            हाम्रो पहिचान, शुद्ध सामग्री र परम्परा
          </h2>
          <p className="text-xs sm:text-base text-slate-600">
            Taste the unmistakable authenticity of the Himalayas, prepared with motherly care by Sunita Kathayat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-xs">
                  {feat.icon}
                </div>
                <div>
                  <span className="text-xs font-nepali font-semibold text-rose-700 block">
                    {feat.nepaliTitle}
                  </span>
                  <h3 className="text-base font-serif font-bold text-slate-900 mt-0.5">
                    {feat.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
