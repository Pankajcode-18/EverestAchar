import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';
import { useOrder } from '../context/OrderContext';

export const StickyMobileOrderBar: React.FC = () => {
  const location = useLocation();
  const { cartItems } = useOrder();

  // Hide on order confirmation or admin pages to avoid distraction
  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/order/confirmation')) {
    return null;
  }

  const isOrderPage = location.pathname === '/order';

  return (
    <aside aria-label="Quick mobile order and WhatsApp actions" className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2.5 shadow-2xl safe-area-pb">
      <div className="max-w-md mx-auto grid grid-cols-2 gap-2.5">
        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=Namaste!%20I%20would%20like%20to%20order%20Everest%20Nepali%20Achar.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 h-12 px-3 bg-emerald-700 active:bg-emerald-800 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          aria-label="Order on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">WhatsApp</span>
        </a>

        {/* Order Now / Review Order Button */}
        {isOrderPage ? (
          <a
            href="#order-form-bottom"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            }}
            className="flex items-center justify-center gap-2 h-12 px-3 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0 text-white" />
            <span className="truncate text-white font-extrabold">Review Order</span>
          </a>
        ) : (
          <Link
            to="/order"
            className="relative flex items-center justify-center gap-2 h-12 px-3 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition-transform active:scale-95"
          >
            <ShoppingBag className="w-5 h-5 flex-shrink-0 text-white" />
            <span className="truncate text-white font-extrabold">Order Now</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-rose-700 text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-rose-600 shadow">
                {cartItems.length}
              </span>
            )}
          </Link>
        )}
      </div>
    </aside>
  );
};
