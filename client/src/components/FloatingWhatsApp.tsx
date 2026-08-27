import React from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const location = useLocation();

  // Hide on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-16 left-4 sm:bottom-6 sm:left-6 z-30 flex items-center group">
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Namaste!%20I%20would%20like%20to%20order%20Everest%20Nepali%20Achar.`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition-all duration-300 transform group-hover:scale-110 active:scale-95 border-2 border-white focus:outline-none focus:ring-4 focus:ring-emerald-400"
        aria-label="Direct WhatsApp Chat"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
        </span>
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
      <span className="hidden md:inline-block ml-3 px-3 py-1.5 bg-himalayan-950/90 text-white text-xs font-semibold rounded-lg shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm whitespace-nowrap">
        WhatsApp Order: +91 79915 02810 / 82193 19253
      </span>
    </aside>
  );
};
