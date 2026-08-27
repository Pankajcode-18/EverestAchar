import React from 'react';
import { Star, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Rohan Sharma',
      location: 'Chandigarh',
      achar: 'Chicken Pickle (कुखुराको अचार)',
      text: 'The authentic flavor of Timur and cold-pressed mustard oil in the Chicken Achar is unmatched. Arrived in 2 days in airtight packing with zero oil leakage!',
      rating: 5,
    },
    {
      name: 'Pooja Thapa',
      location: 'Delhi NCR',
      achar: 'Dalle Khursani & Gundruk',
      text: 'Reminded me of my childhood home in Nepal. The Dalle pepper has the authentic spicy kick and the Gundruk recipe is pure Himalayan tradition.',
      rating: 5,
    },
    {
      name: 'Vikramjit Singh',
      location: 'Manali, HP',
      achar: 'Mutton Pickle (मटन अचार)',
      text: 'Super tender goat meat chunks, perfectly spiced and cured. We regularly order 3kg packs directly from Tilak Ji and Sunita Didi.',
      rating: 5,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-himalayan-950 text-white border-b border-white/10 rounded-3xl overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-ruby-950/80 px-3 py-1 rounded-full border border-ruby-500/40">
            Customer Appreciation
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-white">
            Loved Across Himachal, Delhi & All India
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Authentic feedback from Nepali food lovers and connoisseurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-himalayan-900/90 rounded-2xl p-6 border border-white/10 flex flex-col justify-between relative shadow-lg"
            >
              <Quote className="w-8 h-8 text-rose-500/20 absolute top-4 right-4" />
              
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-rose-500 text-rose-500" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-himalayan-800 mt-4 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-white">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.location}</p>
                </div>
                <span className="text-[10px] text-rose-300 font-medium px-2 py-0.5 bg-himalayan-800 rounded">
                  {rev.achar}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
