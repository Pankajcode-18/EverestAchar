import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 bg-white p-6 sm:p-12 rounded-3xl border border-slate-200 shadow-premium">
        <div className="space-y-2 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Customer Privacy Protection</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">1. Information We Collect</h2>
            <p>
              When you place an order booking on <strong>Everest Nepali Achar</strong>, we collect your name, contact phone number, WhatsApp number, and doorstep delivery address to fulfill order packaging and dispatch from Kullu-Manali, Himachal Pradesh.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">2. How We Use Your Details</h2>
            <p>
              Your contact details are strictly used to confirm your pickle order request, provide live courier tracking, coordinate delivery, and answer customer support inquiries via WhatsApp or phone.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">3. Data Security & Confidentiality</h2>
            <p>
              We do not sell, rent, or trade your personal details to any third-party marketing companies. Data is protected with industry-standard encryption practices.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900">4. Contact & Founders</h2>
            <p>
              For any questions regarding your data, you can reach out directly to <strong>Sunita Kathayat & Tilak Sijapati</strong> at WhatsApp: <strong>+91 79915 02810</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
