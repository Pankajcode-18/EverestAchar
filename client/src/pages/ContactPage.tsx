import React, { useState } from 'react';
import { MessageCircle, MapPin, Sparkles, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do you deliver outside Himachal Pradesh?',
      nepaliQ: 'के तपाईं हिमाचल प्रदेश बाहिर पनि डेलिभरी गर्नुहुन्छ?',
      a: 'Yes! We deliver across Delhi NCR, Chandigarh Tricity, Punjab, Haryana, Mumbai, Bangalore, and all other Indian states via express courier.',
    },
    {
      q: 'How can I place an order?',
      nepaliQ: 'मैले अर्डर कसरी गर्ने?',
      a: 'You can use the online Order Booking form on this website or simply send a WhatsApp message to +91 79915 02810 or +91 82193 19253 with your selected pickle and address.',
    },
    {
      q: 'Can I order multiple kilograms or bulk for events?',
      nepaliQ: 'के ठूलो परिमाणमा अर्डर गर्न मिल्छ?',
      a: 'Yes, 3kg+ orders of Chicken and Dalle Khursani pickles receive special bulk rates and FREE courier delivery outside Delhi.',
    },
    {
      q: 'How is delivery calculated?',
      nepaliQ: 'डेलिभरी शुल्क कसरी गणना हुन्छ?',
      a: 'Himachal Pradesh, Delhi, and Chandigarh enjoy FREE delivery on standard orders. Outside states have transparent flat courier charges calculated automatically by our system.',
    },
    {
      q: 'Can I contact the owner directly?',
      nepaliQ: 'के म सिधै सञ्चालकसँग कुरा गर्न सक्छु?',
      a: 'Yes! Founders Sunita Kathayat & Tilak Sijapati are directly reachable at +91 79915 02810 and +91 82193 19253 via phone call and WhatsApp.',
    },
  ];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Namaste Everest Nepali Achar! 🙏\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Connect with Us</span>
          </div>
          <h1 className="text-2xl sm:text-5xl font-serif font-extrabold text-slate-900">
            Contact Everest Nepali Achar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            We are always here to assist with your pickle cravings, location queries, and custom bookings.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Phone & WhatsApp */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">WhatsApp & Calling</span>
              <h3 className="text-sm sm:text-base font-serif font-bold text-slate-900 mt-1 leading-tight">
                +91 79915 02810 <br />
                <span className="text-rose-700">+91 82193 19253</span>
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Direct lines to founders Sunita Kathayat & Tilak Sijapati for instant orders and assistance.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <a
                href="https://wa.me/917991502810"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <span>WhatsApp 1</span> →
              </a>
              <a
                href="https://wa.me/918219319253"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                <span>WhatsApp 2</span> →
              </a>
            </div>
          </div>

          {/* Card 2: Kitchen Location */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Our Location</span>
              <h3 className="text-base font-serif font-bold text-slate-900 mt-1">
                Kullu, Manali, Himachal Pradesh
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Pincode: 175131, India. Dispatching daily across the nation.
            </p>
            <span className="inline-block text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
              Himalayan High Altitude Kitchen
            </span>
          </div>

          {/* Card 3: Founders & Brand */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Business Owners</span>
              <h3 className="text-base font-serif font-bold text-slate-900 mt-1">
                Sunita Kathayat & Tilak Sijapati
              </h3>
            </div>
            <p className="text-xs text-slate-600">
              Traditional recipes, 100% pure mustard oil, and authentic mountain care.
            </p>
            <span className="inline-block text-xs text-slate-500 font-bold">
              EVEREST नेपाली अचार
            </span>
          </div>
        </div>

        {/* Contact Form & FAQs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Direct Inquiry Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-premium space-y-5">
            <h2 className="font-serif font-bold text-xl text-slate-900">
              Send a Direct Message
            </h2>
            <p className="text-xs text-slate-600">
              Fill in your inquiry below and connect directly with our WhatsApp support.
            </p>

            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Sharma"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Your contact number"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Question or Custom Order *</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Which pickle variety and quantity do you need? What is your delivery city?"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                <Send className="w-4 h-4 text-white" />
                <span className="text-white font-bold">Send to WhatsApp (+91 79915 02810)</span>
              </button>
            </form>
          </div>

          {/* FAQs Accordion */}
          <div className="lg:col-span-6 space-y-4">
            <h2 className="font-serif font-bold text-xl text-slate-900 mb-2">
              Frequently Asked Questions (प्रायः सोधिने प्रश्नहरू)
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = expandedFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between gap-3 focus:outline-none hover:bg-slate-50"
                    >
                      <div>
                        <span className="text-xs font-nepali font-semibold text-rose-700 block">
                          {faq.nepaliQ}
                        </span>
                        <h4 className="font-serif font-bold text-sm text-slate-900">
                          {faq.q}
                        </h4>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
