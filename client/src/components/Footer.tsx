import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Sparkles } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-himalayan-950 text-white border-t border-white/10 safe-area-pb">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Owners */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full border-2 border-rose-500 bg-himalayan-900 p-0.5 overflow-hidden flex-shrink-0">
                <img
                  src="/images/logo/logo.png"
                  alt="Everest Nepali Achar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div>
                <span className="font-serif font-extrabold text-lg text-white block leading-tight">
                  EVEREST नेपाली अचार
                </span>
                <span className="text-rose-400 text-xs font-nepali">
                  नेपाल की परंपरा, स्वाद में बेजोड़
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Authentic Himalayan homemade pickles crafted with pure cold-pressed mustard oil, wild Timur, and traditional Nepali tempering.
            </p>

            <div className="p-3 bg-himalayan-900/80 rounded-xl border border-white/10 text-xs text-slate-300 space-y-1">
              <div className="text-rose-400 font-bold">Founders & Owners:</div>
              <div>Sunita Kathayat & Tilak Sijapati</div>
              <div className="text-slate-400 text-[11px]">Kullu-Manali, Himachal Pradesh</div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-rose-400 uppercase tracking-wider">
              Explore Our Store
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/" className="hover:text-rose-300 transition-colors py-1 block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/achar" className="hover:text-rose-300 transition-colors py-1 block">
                  All 16+ Achar Varieties
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-rose-300 transition-colors py-1 block">
                  Smart Pricing & Location Tariff
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-rose-300 transition-colors py-1 block">
                  Photo & Packaging Gallery
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-rose-300 transition-colors py-1 block">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-rose-300 transition-colors py-1 block">
                  Contact & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Specialties */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-rose-400 uppercase tracking-wider">
              Signature Pickles
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/achar/chicken-pickle" className="hover:text-rose-300 transition-colors py-1 block">
                  🍗 Chicken Pickle (कुखुराको अचार)
                </Link>
              </li>
              <li>
                <Link to="/achar/mutton-pickle" className="hover:text-rose-300 transition-colors py-1 block">
                  🥩 Mutton Pickle (खसीको अचार)
                </Link>
              </li>
              <li>
                <Link to="/achar/dalle-khursani-pickle" className="hover:text-rose-300 transition-colors py-1 block">
                  🌶️ Dalle Khursani Pickle (डल्ले खुर्सानी)
                </Link>
              </li>
              <li>
                <Link to="/achar/fish-pickle" className="hover:text-rose-300 transition-colors py-1 block">
                  🐟 Fish Pickle (माछा को अचार)
                </Link>
              </li>
              <li>
                <Link to="/achar/garlic-pickle-raw" className="hover:text-rose-300 transition-colors py-1 block">
                  🧄 Raw Garlic Pickle (काँचो लसुन)
                </Link>
              </li>
              <li>
                <Link to="/achar/gundruk-pickle" className="hover:text-rose-300 transition-colors py-1 block">
                  🌿 Gundruk Pickle (गुन्द्रुक अचार)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Direct Actions */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-rose-400 uppercase tracking-wider">
              Direct Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold p-2 bg-himalayan-900 rounded-xl border border-emerald-500/30 transition-all"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>WhatsApp: +91 79915 02810</span>
              </a>

              <a
                href={`tel:+917991502810`}
                className="flex items-center gap-2 text-rose-300 hover:text-rose-200 p-2 bg-himalayan-900 rounded-xl border border-white/10 transition-all"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>Call: +91 79915 02810</span>
              </a>

              <a
                href={`tel:+918219319253`}
                className="flex items-center gap-2 text-rose-300 hover:text-rose-200 p-2 bg-himalayan-900 rounded-xl border border-white/10 transition-all"
              >
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>Call / WA: +91 82193 19253</span>
              </a>

              <div className="flex items-start gap-2 text-slate-400 p-2">
                <MapPin className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />
                <span>Kullu, Manali, Himachal Pradesh – 175131, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-himalayan-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} Everest Nepali Achar (एभरेस्ट नेपाली अचार). All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/privacy-policy" className="hover:text-rose-300 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-rose-300 transition-colors">
              Terms & Delivery
            </Link>
            <span>•</span>
            <Link to="/admin/login" className="hover:text-rose-300 transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
