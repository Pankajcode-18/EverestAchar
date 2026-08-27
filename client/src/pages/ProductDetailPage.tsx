import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Product, PriceCalculationResult, ZoneType } from '../types';
import api from '../services/api';
import { ShoppingBag, MessageCircle, ArrowLeft, ShieldCheck, Clock, Thermometer, Sparkles, Plus, Minus } from 'lucide-react';
import { getProductInquiryWhatsAppUrl } from '../services/whatsapp';
import { useOrder } from '../context/OrderContext';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  // Live calculation state for this product
  const [zone, setZone] = useState<ZoneType>('delhiChandigarh');
  const [stateName, setStateName] = useState<string>('Delhi');
  const [quantityKg, setQuantityKg] = useState<number>(1);
  const [calculation, setCalculation] = useState<PriceCalculationResult | null>(null);

  const navigate = useNavigate();
  const { setSelectedProduct } = useOrder();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.data);
          setSelectedImage(res.data.data.primaryImage || res.data.data.images[0]);
        }
      } catch (err) {
        console.error('Error fetching product details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  // Recalculate price when zone or quantity changes
  useEffect(() => {
    if (!product) return;

    const performCalc = async () => {
      try {
        const res = await api.post('/pricing/calculate', {
          productId: product._id,
          quantityKg,
          zone,
          state: stateName,
        });
        if (res.data.success) {
          setCalculation(res.data.data);
        }
      } catch (err) {
        console.error('Price calculation failed', err);
      }
    };

    performCalc();
  }, [product, zone, quantityKg, stateName]);

  if (loading) {
    return (
      <div className="py-20 max-w-7xl mx-auto px-4 text-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs sm:text-sm text-slate-600">Loading authentic Himalayan pickle details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Product Not Found</h2>
        <p className="text-xs text-slate-600">The pickle variety you are looking for is currently unavailable or has been moved.</p>
        <Link to="/achar" className="inline-block px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold">
          Back to Achar Catalog
        </Link>
      </div>
    );
  }

  const isNonVeg = product.vegType === 'non-veg';

  const handleProceedOrder = () => {
    setSelectedProduct(product);
    navigate(`/order?productId=${product._id}&quantityKg=${quantityKg}&zone=${zone}`);
  };

  const handleZoneSelect = (z: ZoneType) => {
    setZone(z);
    if (z === 'himachal') setStateName('Himachal Pradesh');
    else if (z === 'delhiChandigarh') setStateName('Delhi');
    else setStateName('Other State');
  };

  const handleQuantityAdjust = (delta: number) => {
    const nextQty = Math.max(0.5, quantityKg + delta);
    setQuantityKg(nextQty);
  };

  return (
    <div className="py-6 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/achar"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-rose-700 transition-colors p-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Achar Varieties</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10">
          {/* Left Column: Image & Authenticity */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-premium border-2 border-slate-200 bg-white">
              <img
                src={selectedImage}
                alt={`${product.name} - ${product.nepaliName}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/banner/packaging-banner.jpg';
                }}
              />

              {/* Veg / Non-Veg Indicator */}
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md flex items-center gap-1.5 text-[11px] font-bold border border-slate-100">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isNonVeg ? 'bg-red-600' : 'bg-emerald-600'
                  }`}
                />
                <span className={isNonVeg ? 'text-red-700' : 'text-emerald-700'}>
                  {isNonVeg ? 'Non-Veg' : '100% Veg'}
                </span>
              </div>

              {product.badge && (
                <div className="absolute top-3 right-3 bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-extrabold shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{product.badge}</span>
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === img
                        ? 'border-rose-500 ring-2 ring-rose-300'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Title, Live Price Controls, CTAs & Product Info */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <span className="text-rose-700 font-nepali font-bold text-xl sm:text-2xl block">
                {product.nepaliName}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-slate-900 mt-0.5">
                {product.name}
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {product.description}
            </p>

            {/* Mobile-First Touch Price & Order Box */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-rose-500/80 shadow-premium space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                    Live Doorstep Price Estimator
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    Instant price for your location & quantity
                  </p>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Live Tariff
                </span>
              </div>

              {/* 1. Location selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Delivery Destination:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleZoneSelect('himachal')}
                    className={`p-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center min-h-[44px] flex flex-col justify-center items-center ${
                      zone === 'himachal'
                        ? 'bg-himalayan-900 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                    }`}
                  >
                    <span>Himachal</span>
                    <span className={`text-[9px] font-medium ${zone === 'himachal' ? 'text-rose-300' : 'text-slate-700'}`}>Free Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleZoneSelect('delhiChandigarh')}
                    className={`p-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center min-h-[44px] flex flex-col justify-center items-center ${
                      zone === 'delhiChandigarh'
                        ? 'bg-himalayan-900 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                    }`}
                  >
                    <span>Delhi & CHD</span>
                    <span className={`text-[9px] font-medium ${zone === 'delhiChandigarh' ? 'text-rose-300' : 'text-slate-700'}`}>Free Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleZoneSelect('outside')}
                    className={`p-2 rounded-xl text-[11px] sm:text-xs font-bold border transition-all text-center min-h-[44px] flex flex-col justify-center items-center ${
                      zone === 'outside'
                        ? 'bg-himalayan-900 text-white border-rose-500 shadow-sm'
                        : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                    }`}
                  >
                    <span>Other State</span>
                    <span className={`text-[9px] font-medium ${zone === 'outside' ? 'text-rose-300' : 'text-slate-700'}`}>Courier</span>
                  </button>
                </div>
              </div>

              {/* 2. Large Touch-Friendly Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Quantity:
                </label>
                <div className="flex items-center gap-3">
                  {/* Stepper [-] 1 kg [+] */}
                  <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1 shadow-inner">
                    <button
                      type="button"
                      onClick={() => handleQuantityAdjust(-0.5)}
                      disabled={quantityKg <= 0.5}
                      className="w-10 h-10 rounded-xl bg-white text-slate-900 font-black flex items-center justify-center shadow-xs disabled:opacity-40 active:scale-95 text-base"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-16 text-center font-serif font-black text-sm text-slate-900">
                      {quantityKg === 0.5 ? '500g' : `${quantityKg} kg`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityAdjust(1)}
                      className="w-10 h-10 rounded-xl bg-white text-slate-900 font-black flex items-center justify-center shadow-xs active:scale-95 text-base"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick pills */}
                  <div className="flex flex-wrap gap-1">
                    {[1, 2, 3, 5].map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantityKg(q)}
                        className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          quantityKg === q
                            ? 'bg-rose-600 text-white border-rose-700'
                            : 'bg-white text-slate-900 border-slate-200'
                        }`}
                      >
                        {q}kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Calculation Output Banner */}
              {calculation && (
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <div className="flex justify-between items-baseline font-bold">
                    <span className="text-slate-700">Calculated Total:</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-slate-900">
                      ₹{calculation.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-600 leading-snug">
                    {calculation.breakdownSummary}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    ✓ {calculation.deliveryStatusText}
                  </div>
                </div>
              )}

              {/* Large Touch Action CTAs */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedOrder}
                  type="button"
                  className="w-full flex items-center justify-center gap-2 h-12 text-sm sm:text-base font-extrabold text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  <span className="text-white font-extrabold">Book This Order Now</span>
                </button>

                <a
                  href={getProductInquiryWhatsAppUrl(product.name, product.nepaliName)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 h-11 text-xs font-bold text-white bg-emerald-700 active:bg-emerald-800 rounded-xl transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order via WhatsApp (+91 79915 02810)</span>
                </a>
              </div>
            </div>

            {/* Ingredients */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Authentic Ingredients:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {product.ingredients.map((ing, i) => (
                  <span
                    key={i}
                    className="text-xs bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                  >
                    {ing}
                  </span>
                ))}
              </div>
            </div>

            {/* Storage & Shelf Life */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                <Thermometer className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Storage Instructions:</span>
                  <span className="text-slate-600">{product.storageInstructions}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 block">Shelf Life:</span>
                  <span className="text-slate-600">{product.shelfLife}</span>
                </div>
              </div>
            </div>

            {/* Authenticity Guarantee Card */}
            <div className="p-3.5 bg-himalayan-950 text-white rounded-2xl border border-white/10 flex items-center gap-3 text-xs">
              <ShieldCheck className="w-6 h-6 text-rose-400 flex-shrink-0" />
              <div>
                <span className="font-bold block">100% Himalayan Authenticity Guarantee</span>
                <span className="text-[11px] text-slate-300">
                  Made by Sunita Kathayat & Tilak Sijapati • Kullu-Manali
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
