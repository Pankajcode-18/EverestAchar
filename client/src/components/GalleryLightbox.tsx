import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryLightboxProps {
  items?: GalleryItem[];
  currentIndex?: number;
  onNavigate?: (newIndex: number) => void;
  item?: GalleryItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex = 0,
  onNavigate,
  item,
  onClose,
  onPrev,
  onNext,
}) => {
  const currentItem = items && items.length > 0 ? items[currentIndex] : item;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, items]);

  if (!currentItem) return null;

  const handlePrev = () => {
    if (onPrev) {
      onPrev();
    } else if (items && onNavigate) {
      const nextIdx = (currentIndex - 1 + items.length) % items.length;
      onNavigate(nextIdx);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (items && onNavigate) {
      const nextIdx = (currentIndex + 1) % items.length;
      onNavigate(nextIdx);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      {/* Close Button - large touch target */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white flex items-center justify-center transition-colors shadow-lg"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev / Next controls */}
      <button
        onClick={handlePrev}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white flex items-center justify-center transition-colors shadow-lg"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white flex items-center justify-center transition-colors shadow-lg"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Content Modal */}
      <div className="max-w-4xl w-full max-h-[92vh] flex flex-col items-center justify-center">
        <div className="relative max-h-[70vh] sm:max-h-[75vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-rose-500/40 shadow-2xl bg-black">
          {currentItem.image.endsWith('.mp4') ? (
            <video
              src={currentItem.image}
              controls
              autoPlay
              className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full rounded-2xl"
            />
          ) : (
            <img
              src={currentItem.image}
              alt={currentItem.title}
              className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-2xl"
            />
          )}
        </div>

        {/* Caption */}
        <div className="mt-3 sm:mt-4 text-center text-white space-y-0.5 sm:space-y-1 max-w-xl px-2">
          {currentItem.nepaliTitle && (
            <span className="text-rose-400 font-nepali font-bold text-base sm:text-lg block">
              {currentItem.nepaliTitle}
            </span>
          )}
          <h3 className="font-serif font-bold text-sm sm:text-base">
            {currentItem.title}
          </h3>
          {currentItem.description && (
            <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-2">
              {currentItem.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
