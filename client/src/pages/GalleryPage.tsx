import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import api from '../services/api';
import { GalleryLightbox } from '../components/GalleryLightbox';
import { Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      try {
        const res = await api.get('/gallery');
        if (res.data.success) {
          setItems(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load gallery items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories = [
    { key: 'all', label: 'All Photos' },
    { key: 'packaging', label: 'Packaging & Labels' },
    { key: 'behind_the_scenes', label: 'Kitchen & Shelves' },
    { key: 'non-veg', label: 'Chicken & Mutton' },
    { key: 'veg', label: 'Dalle & Veg Achar' },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Kitchen & Packaging Moments</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
            Everest Nepali Achar Photo Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Real photos of our pickles, traditional preparation, airtight jars, and authentic mountain spices from Kullu-Manali.
          </p>
        </div>

        {/* Mobile Horizontal Scroll Category Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 min-h-[40px] flex items-center ${
                activeCategory === cat.key
                  ? 'bg-himalayan-900 text-white shadow-md ring-2 ring-rose-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-600">Loading authentic photo gallery...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs sm:text-sm">
            No media found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {filteredItems.map((item, idx) => (
              <div
                key={item._id || idx}
                onClick={() => setLightboxIndex(idx)}
                className="group relative rounded-2xl overflow-hidden shadow-premium bg-white border border-slate-200 cursor-pointer aspect-square"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/banner/packaging-banner.jpg';
                  }}
                />

                {/* Overlay with Title */}
                <div className="absolute inset-0 bg-gradient-to-t from-himalayan-950/90 via-himalayan-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white">
                  <span className="text-[10px] font-bold text-rose-400 font-nepali block truncate">
                    {item.nepaliTitle || 'एभरेस्ट नेपाली अचार'}
                  </span>
                  <h4 className="font-serif font-bold text-xs leading-tight truncate">
                    {item.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Component */}
        {lightboxIndex !== null && (
          <GalleryLightbox
            items={filteredItems}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(newIdx) => setLightboxIndex(newIdx)}
          />
        )}
      </div>
    </div>
  );
};
