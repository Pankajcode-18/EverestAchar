import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  X,
  Send,
  Bot,
  Sparkles,
  ArrowLeft,
  RefreshCw,
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  PhoneCall,
  CreditCard,
} from 'lucide-react';
import api from '../services/api';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  calculatedPrice?: any;
  suggestedActions?: { label: string; action: string; payload?: any }[];
  timestamp: string;
}

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Namaste! 🙏 Welcome to **Everest Nepali Achar (एभरेस्ट नेपाली अचार)**.\n\nI am your **AI Pickle & Live Tariff Guide**.\n\nAsk me any question or tap below to get instant exact prices for your city / state:`,
      suggestedActions: [
        { label: '🍗 Chicken Price in Delhi', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
        { label: '🏔️ Price in Himachal', action: 'send_text', payload: { text: 'What is the price of chicken achar in Himachal Pradesh?' } },
        { label: '🥩 Mutton Achar Price', action: 'send_text', payload: { text: 'What is the price of mutton achar in Delhi?' } },
        { label: '🌶️ Dalle Khursani Price', action: 'send_text', payload: { text: 'What is the price of Dalle Khursani pickle?' } },
        { label: '📦 3kg Bulk Offer (Free Delivery)', action: 'send_text', payload: { text: 'What is the 3kg bulk offer price for chicken achar?' } },
        { label: '💳 How to Pay (UPI/QR 8219359881)', action: 'send_text', payload: { text: 'How do I pay with QR code or GPay 8219359881?' } },
        { label: '📞 Contact Sunita & Tilak', action: 'send_text', payload: { text: 'Who are the founders and what is the contact number?' } },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [messages, isOpen]);

  // Hide floating button on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || loading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: Message = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));

      const res = await api.post('/chat', {
        message: textToSend,
        history,
      });

      if (res.data.success) {
        const botData = res.data.data;
        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botData.reply,
          calculatedPrice: botData.calculatedPrice,
          suggestedActions: botData.suggestedActions,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (error) {
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Namaste! Please chat directly with founders **Sunita Kathayat & Tilak Sijapati** on WhatsApp or Call (+91 79915 02810 / +91 82193 19253) for instant price confirmation.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string, payload?: any) => {
    if (action === 'send_text' && payload?.text) {
      handleSendMessage(payload.text);
    } else if (action === 'navigate_order') {
      setIsOpen(false);
      if (payload?.productSlug) {
        navigate(`/order?product=${payload.productSlug}&quantityKg=${payload.quantity || 1}`);
      } else {
        navigate('/order');
      }
    } else if (action === 'navigate_products') {
      setIsOpen(false);
      navigate('/achar');
    } else if (action === 'open_calculator') {
      setIsOpen(false);
      navigate('/pricing');
    } else if (action === 'open_whatsapp') {
      let waText = `Namaste Everest Nepali Achar! 🙏`;
      if (payload?.product) waText += ` I am inquiring about ${payload.product}.`;
      if (payload?.quantity) waText += ` Quantity: ${payload.quantity}kg.`;
      if (payload?.amount) waText += ` Calculated amount: ₹${payload.amount}.`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <aside aria-label="Everest AI Chatbot" className="fixed bottom-16 right-4 sm:bottom-6 sm:right-6 z-30">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white focus:outline-none focus:ring-4 focus:ring-rose-400"
            aria-label="Open Everest AI Assistant"
          >
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-rose-500"></span>
            </span>
            <Bot className="w-6 h-6 sm:w-7 sm:h-7 text-white transition-transform group-hover:rotate-12" />
          </button>
        )}
      </aside>

      {/* Chat Interface Modal */}
      {isOpen && (
        <section
          aria-label="Everest Achar AI Assistant Window"
          className="fixed inset-0 z-50 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[430px] sm:h-[620px] sm:max-h-[88vh] bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden sm:border sm:border-slate-200 animate-fadeIn"
        >
          {/* Header */}
          <header className="bg-gradient-to-r from-himalayan-950 via-himalayan-900 to-himalayan-950 text-white px-4 py-3 sm:py-3.5 flex items-center justify-between border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 -ml-1 text-slate-300 hover:text-white rounded-lg sm:hidden active:bg-white/10"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="w-9 h-9 rounded-full bg-rose-700 p-0.5 flex items-center justify-center flex-shrink-0 shadow-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 leading-tight">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">
                    Everest AI Assistant
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
                <p className="text-[10px] text-slate-300 truncate">
                  Sunita & Tilak • Kullu-Manali Live Tariff
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setMessages([
                    {
                      id: 'welcome-fresh',
                      sender: 'bot',
                      text: `Namaste! 🙏 Chat refreshed. How can I assist you with Everest Nepali Achar today?`,
                      suggestedActions: [
                        { label: '🍗 Chicken in Delhi', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
                        { label: '🏔️ Price in Himachal', action: 'send_text', payload: { text: 'What is the price of chicken achar in Himachal Pradesh?' } },
                        { label: '🥩 Mutton Pickle Price', action: 'send_text', payload: { text: 'What is the price of mutton achar in Delhi?' } },
                        { label: '💳 How to Pay (UPI/QR)', action: 'send_text', payload: { text: 'How do I pay with QR code or GPay 8219359881?' } },
                      ],
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    },
                  ])
                }
                title="Reset Chat"
                className="p-2 text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="hidden sm:inline-flex p-2 text-slate-300 hover:text-white rounded-lg transition-colors"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>

          {/* Quick Actions Scroll Bar */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar flex-shrink-0">
            <span className="text-[10px] font-bold uppercase text-slate-700 flex-shrink-0 tracking-wider">
              Popular:
            </span>
            <button
              onClick={() => handleSendMessage('What is the price of chicken achar in Delhi?')}
              className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full flex-shrink-0 whitespace-nowrap shadow-xs active:scale-95 transition-transform"
            >
              🍗 Chicken in Delhi
            </button>
            <button
              onClick={() => handleSendMessage('What is the price of chicken achar in Himachal Pradesh?')}
              className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full flex-shrink-0 whitespace-nowrap shadow-xs active:scale-95 transition-transform"
            >
              🏔️ Himachal (Free)
            </button>
            <button
              onClick={() => handleSendMessage('What is the price of mutton achar in Delhi?')}
              className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full flex-shrink-0 whitespace-nowrap shadow-xs active:scale-95 transition-transform"
            >
              🥩 Mutton Price
            </button>
            <button
              onClick={() => handleSendMessage('What is the price of Dalle Khursani pickle?')}
              className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full flex-shrink-0 whitespace-nowrap shadow-xs active:scale-95 transition-transform"
            >
              🌶️ Dalle Khursani
            </button>
            <button
              onClick={() => handleSendMessage('What is the 3kg bulk offer price for chicken achar?')}
              className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full flex-shrink-0 whitespace-nowrap shadow-xs active:scale-95 transition-transform"
            >
              📦 3kg Bulk Offer
            </button>
            <button
              onClick={() => handleSendMessage('How do I pay with QR code or GPay 8219359881?')}
              className="text-[11px] font-bold px-2.5 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full flex-shrink-0 whitespace-nowrap shadow-xs active:scale-95 transition-transform"
            >
              💳 How to Pay (UPI/QR)
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-slate-50/80">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[92%] sm:max-w-[88%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-himalayan-900 to-himalayan-950 text-white rounded-br-none'
                      : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="whitespace-pre-line font-normal">{msg.text}</div>

                  {/* Calculated Price Card if present */}
                  {msg.calculatedPrice && (
                    <div className="mt-3 p-3 sm:p-3.5 bg-gradient-to-br from-slate-50 to-rose-50/40 rounded-2xl border-2 border-rose-400/80 text-xs text-slate-800 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between border-b border-rose-200/80 pb-1.5">
                        <div>
                          <span className="font-nepali font-bold text-[11px] text-rose-700 block">
                            {msg.calculatedPrice.productNepaliName}
                          </span>
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900">
                            {msg.calculatedPrice.productName} ({msg.calculatedPrice.quantityKg === 0.5 ? '500g' : `${msg.calculatedPrice.quantityKg} kg`})
                          </h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total</span>
                          <span className="text-rose-700 font-serif font-black text-base sm:text-lg">
                            ₹{msg.calculatedPrice.totalAmount.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-white p-2 rounded-xl border border-slate-200">
                        <div>
                          <span className="text-[9px] text-slate-500 block">Location:</span>
                          <span className="font-bold text-slate-800 truncate block">{msg.calculatedPrice.zoneDisplayName}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-500 block">Delivery Fee:</span>
                          <span className={`font-bold ${msg.calculatedPrice.deliveryCharge === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                            {msg.calculatedPrice.deliveryCharge === 0 ? 'FREE' : `+ ₹${msg.calculatedPrice.deliveryCharge}`}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            navigate(`/order?productId=${msg.calculatedPrice.productId}&quantityKg=${msg.calculatedPrice.quantityKg}`);
                          }}
                          className="py-2 px-2 bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white font-bold rounded-xl text-center text-[11px] shadow-xs flex items-center justify-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Book Order Now</span>
                        </button>

                        <button
                          onClick={() => {
                            const waText = `Namaste! I want to order ${msg.calculatedPrice.productName} (${msg.calculatedPrice.quantityKg}kg) for ₹${msg.calculatedPrice.totalAmount} to ${msg.calculatedPrice.zoneDisplayName}.`;
                            window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank');
                          }}
                          className="py-2 px-2 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold rounded-xl text-center text-[11px] shadow-xs flex items-center justify-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Suggested Action Chips */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2 max-w-[95%]">
                    {msg.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(act.action, act.payload)}
                        className="text-[11px] font-bold px-3 py-1 bg-white hover:bg-rose-50 text-slate-800 border border-slate-300 rounded-full shadow-xs transition-transform active:scale-95"
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-700 p-3 bg-white rounded-2xl w-fit border border-slate-200 shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                <span className="font-semibold">Calculating exact tariff & formulating verified answer...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Touch-Friendly Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 sm:p-3 bg-white border-t border-slate-200 flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask for price with your city/state..."
              className="flex-1 px-4 py-2.5 sm:py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white transition-all text-slate-900 font-medium"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || loading}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-rose-700 text-white flex items-center justify-center hover:bg-rose-800 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm"
              aria-label="Send message"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </button>
          </form>
        </section>
      )}
    </>
  );
};
