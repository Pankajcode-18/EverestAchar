import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Order } from '../types';
import api from '../services/api';
import { CheckCircle2, MessageCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import { generateWhatsAppOrderUrl, WHATSAPP_NUMBER } from '../services/whatsapp';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.data.order || res.data.data);
        }
      } catch (err) {
        console.error('Error fetching order receipt', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCopyOrderId = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="py-20 text-center bg-slate-50 min-h-screen">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-slate-600">Generating official booking receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 max-w-md mx-auto text-center px-4 bg-slate-50 min-h-screen space-y-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-600">We could not locate this order booking. Please contact us on WhatsApp directly.</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Contact WhatsApp (+91 79915 02810)</span>
        </a>
      </div>
    );
  }

  const whatsappUrl = generateWhatsAppOrderUrl(order);

  return (
    <div className="py-8 sm:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
        {/* Success Header */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center shadow-premium border-2 border-emerald-500/80 space-y-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
              🎉 Booking Request Received
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 pt-2">
              Dhanyawad, {order.customer.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Your Everest Nepali Achar booking has been registered in our kitchen queue. Please send the 1-click confirmation to our WhatsApp below.
            </p>
          </div>

          {/* Order ID Tag */}
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-xl px-4 py-2 text-xs sm:text-sm font-mono font-bold text-slate-900">
            <span>Order ID: <strong>{order.orderId}</strong></span>
            <button
              onClick={handleCopyOrderId}
              className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
              title="Copy Order ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Primary Mobile Action: WhatsApp 1-Click Send */}
          <div className="pt-2 max-w-md mx-auto space-y-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-14 px-6 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-lg transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Send Order Confirmation on WhatsApp</span>
            </a>

            <p className="text-[10px] text-slate-500">
              ⚡ Tapping the button opens WhatsApp with your pre-formatted order receipt directly to founders Sunita Kathayat & Tilak Sijapati.
            </p>
          </div>
        </div>

        {/* Receipt Details Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-premium border border-slate-200 space-y-5">
          <h2 className="font-serif font-bold text-base sm:text-lg text-slate-900 border-b border-slate-100 pb-3">
            Official Booking Summary
          </h2>

          {/* Items */}
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm"
              >
                <div>
                  <span className="font-nepali font-bold text-rose-700 text-xs block">
                    {item.nepaliName}
                  </span>
                  <h4 className="font-serif font-bold text-slate-900">
                    {item.name}
                  </h4>
                  <span className="text-slate-600 text-xs">
                    Quantity: <strong>{item.quantityKg} kg</strong> (₹{item.unitPrice}/kg)
                  </span>
                </div>
                <div className="font-serif font-bold text-slate-900 text-sm sm:text-base">
                  ₹{item.itemTotal.toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          {/* Delivery & Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Customer Details</span>
              <p className="text-slate-800 font-bold">{order.customer.fullName}</p>
              <p className="text-slate-600">Phone: {order.customer.phone}</p>
              <p className="text-slate-600">WhatsApp: {order.customer.whatsapp}</p>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Delivery Destination</span>
              <p className="text-slate-800">{order.deliveryAddress.fullAddress}</p>
              <p className="text-slate-600">{order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}</p>
              {order.deliveryAddress.landmark && (
                <p className="text-slate-500">Landmark: {order.deliveryAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Online Payment Summary Block */}
          {order.payment && (
            <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-emerald-200/80 pb-1.5">
                <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <span>💳 UPI Payment Information</span>
                </span>
                <span className="px-2 py-0.5 bg-emerald-700 text-white rounded font-bold text-[10px]">
                  {order.paymentStatus || 'Proof Submitted'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                <div>
                  <span className="text-[10px] text-slate-500 block">Paid To:</span>
                  <span className="font-bold text-slate-900">{order.payment.beneficiaryName || 'Sunita Sijapati'}</span>
                  <span className="text-[11px] text-slate-600 block">UPI: {order.payment.upiId} ({order.payment.upiNumber})</span>
                </div>

                {order.payment.transactionId && (
                  <div>
                    <span className="text-[10px] text-slate-500 block">UPI Ref / UTR Transaction ID:</span>
                    <span className="font-mono font-bold text-xs text-slate-900 bg-white px-2 py-1 rounded border border-emerald-200 inline-block mt-0.5">
                      {order.payment.transactionId}
                    </span>
                  </div>
                )}
              </div>

              {order.payment.screenshotUrl && (
                <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-3">
                  <img
                    src={order.payment.screenshotUrl}
                    alt="Payment proof screenshot"
                    className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shadow-xs"
                  />
                  <div>
                    <span className="font-bold text-emerald-900 text-xs block">Payment Screenshot Attached</span>
                    <span className="text-[11px] text-emerald-700">Sent directly to founders for verification</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Totals */}
          <div className="space-y-1.5 text-xs sm:text-sm border-t border-slate-100 pt-3">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span>₹{order.pricing.productTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Delivery Charge:</span>
              <span className={order.pricing.deliveryCharge === 0 ? 'text-emerald-700 font-bold' : ''}>
                {order.pricing.deliveryCharge === 0 ? 'FREE' : `₹${order.pricing.deliveryCharge}`}
              </span>
            </div>
            <div className="pt-2 border-t flex justify-between font-serif font-black text-lg sm:text-xl text-slate-900">
              <span>Total Payable:</span>
              <span>₹{order.pricing.totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-rose-700 p-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
