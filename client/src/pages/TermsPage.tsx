import React from 'react';
import { Truck } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-premium">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
            <Truck className="w-4 h-4 text-emerald-600" />
            <span>Ordering, Dispatch & Delivery Policies</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
            Terms & Delivery Policy
          </h1>
          <p className="text-xs text-slate-500">Everest Nepali Achar • Kullu-Manali, Himachal Pradesh</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">1. Order Confirmation & Payment</h2>
            <p>
              Placing an order on this website generates a formal booking request with an official Order ID (e.g. <code>EVR-YYYYMMDD-XXX</code>). Final confirmation, batch dispatch schedules, and payment coordination are conducted directly between customer and owners (Sunita Kathayat & Tilak Sijapati) via WhatsApp or phone.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">2. Delivery Zones & Courier Timing</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li><strong>Himachal Pradesh:</strong> Free delivery on standard orders. Typically delivered within 24-48 hours.</li>
              <li><strong>Delhi NCR & Chandigarh:</strong> Free delivery on popular non-veg and Dalle pickles. Delivered in 2-4 business days.</li>
              <li><strong>Other Indian States:</strong> Dispatched via express courier with airtight leak-proof packaging. Bulk orders (3kg+) of select items receive FREE delivery.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">3. Packaging & Quality Guarantee</h2>
            <p>
              All pickles are prepared using natural cold-pressed mustard oil and mountain spices. Jars are double-sealed to avoid leakage. If a package arrives damaged during transit, please share a photo on WhatsApp (+91 79915 02810) immediately for prompt resolution.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">4. Cancellation Policy</h2>
            <p>
              You can cancel or modify your order booking before it has been dispatched by texting us on WhatsApp.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
