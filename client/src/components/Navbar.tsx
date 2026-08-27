import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Phone, Sparkles, MessageCircle, ChevronRight } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useOrder();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const totalCartCount = cartItems.length;

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Achar', path: '/achar', subtitle: '16+ Veg & Non-Veg' },
    { name: 'Smart Pricing', path: '/pricing', subtitle: 'Location Tariff' },
    { name: 'Photo Gallery', path: '/gallery', subtitle: 'Packaging & Shelves' },
    { name: 'About Us', path: '/about', subtitle: 'Founders & Heritage' },
    { name: 'Contact', path: '/contact', subtitle: '+91 79915 02810 / 82193 19253' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-stone-200'
          : 'bg-white py-2.5 sm:py-3 border-b border-stone-200'
      }`}
    >
      {/* Top micro announcement bar */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-900 text-white text-[11px] sm:text-xs py-1.5 px-3 text-center font-medium tracking-wide flex items-center justify-center gap-1.5 shadow-inner">
        <Sparkles className="w-3.5 h-3.5 text-rose-200 animate-pulse" />
        <span className="font-nepali font-semibold truncate">नेपाल की परंपरा, स्वाद में बेजोड़ • Kullu-Manali (HP)</span>
        <span className="hidden md:inline font-bold">| WhatsApp & Call: +91 79915 02810 / +91 82193 19253</span>
      </div>

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 mt-1">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-rose-600 shadow-md bg-stone-900 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
              <img
                src="/images/logo/logo.png"
                alt="Everest Nepali Achar Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-black text-xl sm:text-2xl text-stone-950 tracking-wide">
                  EVEREST
                </span>
                <span className="text-rose-700 font-nepali font-black text-lg sm:text-2xl">
                  नेपाली अचार
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-stone-600 font-medium tracking-wide hidden xs:block">
                Authentic Taste from Kullu-Manali, Himalayas
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors relative py-1.5 ${
                  isActive(link.path)
                    ? 'text-rose-700 font-extrabold'
                    : 'text-stone-700 hover:text-rose-700'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-rose-700 rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 rounded-full border border-stone-300 shadow-xs transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-rose-700" />
              <span>Call Us</span>
            </a>

            <Link
              to="/order"
              className="relative flex items-center gap-2 px-5 py-2.5 text-sm font-black text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-full shadow-md shadow-rose-700/20 transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-white font-black">Order Now</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-stone-900 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border border-white shadow">
                  {totalCartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Right Controls: Cart + Hamburger */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <Link
              to="/order"
              className="relative p-2.5 text-rose-700 bg-rose-50 active:bg-rose-100 rounded-full border border-rose-200"
              aria-label="Order Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-700 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 text-stone-800 hover:text-rose-700 active:bg-stone-100 rounded-xl focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center border border-stone-200"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6 text-rose-700" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {isOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-stone-200 space-y-2 animate-fadeIn bg-white rounded-2xl p-3 shadow-lg">
            <div className="grid grid-cols-1 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-rose-50 text-rose-700 font-bold border-l-4 border-rose-700'
                      : 'text-stone-800 hover:bg-stone-50 hover:text-rose-700'
                  }`}
                >
                  <div>
                    <span className="block text-sm font-bold leading-tight">{link.name}</span>
                    <span className="block text-[11px] text-stone-500 font-medium">{link.subtitle}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400" />
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 space-y-2">
              <Link
                to="/order"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 h-12 text-sm font-black text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-xl shadow-md text-center active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span className="text-white font-black">Place Order / Booking</span>
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=Namaste!%20I%20would%20like%20to%20order%20Everest%20Nepali%20Achar.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold text-white bg-emerald-700 active:bg-emerald-800 rounded-xl text-center shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: +91 79915 02810</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
