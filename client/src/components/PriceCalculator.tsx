import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, ShoppingBag, MessageCircle, Sparkles, CheckCircle, Info } from 'lucide-react';
import { Product, PriceCalculationResult, ZoneType } from '../types';
import api from '../services/api';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

interface PriceCalculatorProps {
  initialProductId?: string;
  onProceedOrder?: (calcResult: PriceCalculationResult) => void;
}

export const PriceCalculator: React.FC<PriceCalculatorProps> = ({ initialProductId, onProceedOrder }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId || '');
  const [zone, setZone] = useState<ZoneType>('delhiChandigarh');
  const [stateName, setStateName] = useState<string>('Delhi');
  const [quantityKg, setQuantityKg] = useState<number>(1);
  const [calculation, setCalculation] = useState<PriceCalculationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setProducts(res.data.data);
          if (!selectedProductId && res.data.data.length > 0) {
            setSelectedProductId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error loading products for calculator', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (initialProductId) {
      setSelectedProductId(initialProductId);
    }
  }, [initialProductId]);

  useEffect(() => {
    if (!selectedProductId) return;

    const performCalculation = async () => {
      setLoading(true);
      try {
        const res = await api.post('/pricing/calculate', {
          productId: selectedProductId,
          quantityKg,
          zone,
          state: stateName,
        });
        if (res.data.success) {
          setCalculation(res.data.data);
        }
      } catch (err) {
        console.error('Price calculation failed', err);
      } finally {
        setLoading(false);
      }
    };

    performCalculation();
  }, [selectedProductId, zone, quantityKg, stateName]);

  const handleZoneChange = (z: ZoneType) => {
    setZone(z);
    if (z === 'himachal') setStateName('Himachal Pradesh');
    else if (z === 'delhiChandigarh') setStateName('Delhi');
    else setStateName('Other State');
  };

  const handleBookOrder = () => {
    if (calculation) {
      if (onProceedOrder) {
        onProceedOrder(calculation);
      } else {
        navigate(`/order?productId=${calculation.productId}&quantityKg=${calculation.quantityKg}&zone=${calculation.zone}`);
      }
    }
  };

  const handleWhatsAppBooking = () => {
    if (!calculation) return;
    const msg = `Namaste Everest Nepali Achar! 🙏\nI would like to order *${calculation.productName}* (${calculation.productNepaliName}):\n• Quantity: ${calculation.quantityKg} kg\n• Location: ${calculation.zoneDisplayName}\n• Calculated Total: ₹${calculation.totalAmount.toLocaleString('en-IN')}\n\nPlease confirm availability and dispatch details.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-premium border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-himalayan-950 via-himalayan-900 to-himalayan-950 text-white p-4 sm:p-6 border-b border-white/10">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="p-2 sm:p-2.5 rounded-xl bg-rose-700 text-white shadow-md flex-shrink-0">
            <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-base sm:text-xl text-white flex items-center gap-1.5 leading-tight">
              <span>Smart Order & Price Calculator</span>
              <Sparkles className="w-4 h-4 text-rose-400" />
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300">
              Select product, delivery zone & quantity for guaranteed exact rates
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Select Product */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Choose Achar Variety:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white text-xs sm:text-sm h-12"
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.nepaliName}) — {p.vegType === 'non-veg' ? '🍗 Non-Veg' : '🌿 Veg'}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Select Location Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Delivery Destination:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleZoneChange('himachal')}
                className={`p-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center min-h-[46px] flex flex-col justify-center items-center ${
                  zone === 'himachal'
                    ? 'bg-himalayan-900 text-white border-rose-500 shadow-md ring-2 ring-rose-500'
                    : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                }`}
              >
                <span>Himachal</span>
                <span className={`text-[9px] font-medium ${zone === 'himachal' ? 'text-rose-300' : 'text-slate-700'}`}>Free Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => handleZoneChange('delhiChandigarh')}
                className={`p-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center min-h-[46px] flex flex-col justify-center items-center ${
                  zone === 'delhiChandigarh'
                    ? 'bg-himalayan-900 text-white border-rose-500 shadow-md ring-2 ring-rose-500'
                    : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                }`}
              >
                <span>Delhi & CHD</span>
                <span className={`text-[9px] font-medium ${zone === 'delhiChandigarh' ? 'text-rose-300' : 'text-slate-700'}`}>Free Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => handleZoneChange('outside')}
                className={`p-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center min-h-[46px] flex flex-col justify-center items-center ${
                  zone === 'outside'
                    ? 'bg-himalayan-900 text-white border-rose-500 shadow-md ring-2 ring-rose-500'
                    : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                }`}
              >
                <span>Other State</span>
                <span className={`text-[9px] font-medium ${zone === 'outside' ? 'text-rose-300' : 'text-slate-700'}`}>Courier</span>
              </button>
            </div>
          </div>

          {/* 3. Select Quantity */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Quantity (kg):
              </label>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                Selected: {quantityKg === 0.5 ? '500g' : `${quantityKg} kg`}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[0.5, 1, 2, 3, 5].map((qty) => (
                <button
                  key={qty}
                  type="button"
                  onClick={() => setQuantityKg(qty)}
                  className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all text-center min-h-[44px] flex flex-col justify-center items-center ${
                    quantityKg === qty
                      ? 'bg-rose-700 text-white border-rose-800 shadow-md ring-2 ring-rose-300'
                      : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                  }`}
                >
                  <span className={quantityKg === qty ? 'text-white font-black' : 'text-slate-900 font-bold'}>
                    {qty === 0.5 ? '500g' : `${qty}kg`}
                  </span>
                  {qty >= 3 && (
                    <span className={`text-[8px] block leading-tight font-bold ${quantityKg === qty ? 'text-rose-100' : 'text-slate-700'}`}>
                      Bulk Offer
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Family size advice */}
            <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-700 flex items-start gap-2">
              <Info className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">Guide: </span>
                {quantityKg <= 1 && '500g–1kg is perfect for personal trial or 2–3 people.'}
                {quantityKg === 2 && '2kg is ideal for small to medium families.'}
                {quantityKg >= 3 && '3kg+ qualifies for bulk discount rates & free delivery outside Delhi!'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-50 to-rose-50/30 rounded-2xl p-4 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Calculated Breakdown
            </span>

            {calculation ? (
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between text-slate-700">
                    <span>Base Product Rate:</span>
                    <span className="font-semibold text-slate-900">₹{calculation.unitPrice}/kg</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Product Subtotal ({calculation.quantityKg}kg):</span>
                    <span className="font-semibold text-slate-900">₹{calculation.productTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between text-slate-700">
                    <span>Doorstep Courier:</span>
                    <span className={`font-bold ${calculation.deliveryCharge === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {calculation.deliveryCharge === 0 ? 'FREE' : `+ ₹${calculation.deliveryCharge.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  {calculation.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Bulk Discount Applied:</span>
                      <span>- ₹{calculation.discount}</span>
                    </div>
                  )}
                </div>

                {/* Delivery Zone Rule Notice */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span>📍 {calculation.zoneDisplayName}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {calculation.breakdownSummary}
                  </p>
                </div>

                {/* Final Total Amount */}
                <div className="p-3.5 bg-white rounded-xl border-2 border-rose-500 flex items-baseline justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                      Total Payable
                    </span>
                    <span className="text-xs font-bold text-emerald-700">
                      {calculation.deliveryStatusText}
                    </span>
                  </div>
                  <span className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                    ₹{calculation.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                Calculating latest verified pricing...
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleBookOrder}
              disabled={loading || !calculation}
              type="button"
              className="w-full flex items-center justify-center gap-2 h-12 text-sm font-extrabold text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="text-white font-extrabold">Proceed to Booking</span>
            </button>

            <button
              onClick={handleWhatsAppBooking}
              type="button"
              className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="text-white font-bold">Order via WhatsApp (+91 79915 02810 / 82193 19253)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
