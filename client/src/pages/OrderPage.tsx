import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Product, PriceCalculationResult } from '../types';
import api from '../services/api';
import {
  ShoppingBag,
  User,
  MapPin,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  QrCode,
  Copy,
  Check,
  Upload,
  Image as ImageIcon,
  X,
  CreditCard,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const OrderPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantityKg, setQuantityKg] = useState<number>(1);

  // Customer fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Address fields
  const [state, setState] = useState<string>('Delhi');
  const [city, setCity] = useState<string>('');
  const [pincode, setPincode] = useState<string>('');
  const [fullAddress, setFullAddress] = useState<string>('');
  const [landmark, setLandmark] = useState<string>('');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');

  // Payment fields
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI_QR');
  const [transactionId, setTransactionId] = useState<string>('');
  const [screenshotBase64, setScreenshotBase64] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [copiedUpiId, setCopiedUpiId] = useState<boolean>(false);
  const [copiedUpiNumber, setCopiedUpiNumber] = useState<boolean>(false);

  // Live calculation & submission states
  const [calculation, setCalculation] = useState<PriceCalculationResult | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Determine if all previous customer & delivery details have been entered
  const isDetailsComplete = Boolean(
    fullName.trim() &&
    phone.trim() &&
    whatsapp.trim() &&
    state.trim() &&
    city.trim() &&
    pincode.trim() &&
    fullAddress.trim() &&
    selectedProductId
  );

  // 1. Fetch products & check params
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setProducts(res.data.data);
          
          const paramProdId = searchParams.get('productId');
          const paramProdSlug = searchParams.get('product');
          const paramQty = searchParams.get('quantityKg');
          const paramZone = searchParams.get('zone');

          if (paramQty) setQuantityKg(parseFloat(paramQty));
          if (paramZone === 'himachal') setState('Himachal Pradesh');
          else if (paramZone === 'delhiChandigarh') setState('Delhi');

          if (paramProdId) {
            setSelectedProductId(paramProdId);
          } else if (paramProdSlug) {
            const matched = res.data.data.find((p: Product) => p.slug === paramProdSlug);
            if (matched) setSelectedProductId(matched._id);
            else if (res.data.data.length > 0) setSelectedProductId(res.data.data[0]._id);
          } else if (res.data.data.length > 0) {
            setSelectedProductId(res.data.data[0]._id);
          }
        }
      } catch (err) {
        console.error('Error fetching products for order page', err);
      }
    };
    loadProducts();
  }, [searchParams]);

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (!whatsapp || whatsapp === phone) {
      setWhatsapp(val);
    }
  };

  const handleCopyUpiId = () => {
    navigator.clipboard.writeText('sijapatisunita2@okicici');
    setCopiedUpiId(true);
    setTimeout(() => setCopiedUpiId(false), 2500);
  };

  const handleCopyUpiNumber = () => {
    navigator.clipboard.writeText('8219359881');
    setCopiedUpiNumber(true);
    setTimeout(() => setCopiedUpiNumber(false), 2500);
  };

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 8MB.');
      return;
    }

    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveScreenshot = () => {
    setScreenshotBase64('');
    setScreenshotFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    if (!selectedProductId) return;

    const performCalculation = async () => {
      try {
        const res = await api.post('/pricing/calculate', {
          productId: selectedProductId,
          quantityKg,
          state,
          city,
          pincode,
        });
        if (res.data.success) {
          setCalculation(res.data.data);
        }
      } catch (err) {
        console.error('Order price calculation error', err);
      }
    };

    performCalculation();
  }, [selectedProductId, quantityKg, state, city, pincode]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !whatsapp.trim()) {
      setErrorMessage('Please enter your full name, phone number, and WhatsApp number.');
      return;
    }

    if (!state.trim() || !city.trim() || !pincode.trim() || !fullAddress.trim()) {
      setErrorMessage('Please provide your complete delivery address including city and pincode.');
      return;
    }

    if (!selectedProductId) {
      setErrorMessage('Please select a pickle variety.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim() || undefined,
        },
        deliveryAddress: {
          state: state.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          fullAddress: fullAddress.trim(),
          landmark: landmark.trim() || undefined,
        },
        items: [
          {
            productId: selectedProductId,
            quantityKg,
            selectedSize: `${quantityKg} kg`,
          },
        ],
        payment: {
          method: paymentMethod,
          upiId: 'sijapatisunita2@okicici',
          upiNumber: '8219359881',
          beneficiaryName: 'Sunita Sijapati',
          bankName: 'UCO Bank 8837',
          transactionId: transactionId.trim() || undefined,
          screenshotBase64: screenshotBase64 || undefined,
        },
        specialInstructions: specialInstructions.trim() || undefined,
        source: 'website_form',
      };

      const res = await api.post('/orders', payload);
      if (res.data.success) {
        const orderId = res.data.data.orderId;
        navigate(`/order/confirmation/${orderId}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to submit order booking. Please try again or WhatsApp us directly.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedProduct = products.find((p) => p._id === selectedProductId);
  const upiIntentUrl = calculation
    ? `upi://pay?pa=sijapatisunita2@okicici&pn=Sunita%20Sijapati&am=${calculation.totalAmount}&cu=INR&tn=Everest%20Nepali%20Achar`
    : `upi://pay?pa=sijapatisunita2@okicici&pn=Sunita%20Sijapati&cu=INR&tn=Everest%20Nepali%20Achar`;

  return (
    <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-1.5 sm:space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Direct Kitchen Doorstep Booking</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900 leading-tight">
            Book Your Everest Nepali Achar
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Fill in your delivery address to receive transparent pricing and instant WhatsApp dispatch confirmation.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-3 sm:p-4 border border-slate-200 shadow-sm flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-600">
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-[10px]">1</span>
            <span className="hidden sm:inline">Pickle & Qty</span>
          </div>
          <div className="h-0.5 w-4 sm:w-10 bg-slate-200"></div>
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-[10px]">2</span>
            <span className="hidden sm:inline">Contact</span>
          </div>
          <div className="h-0.5 w-4 sm:w-10 bg-slate-200"></div>
          <div className="flex items-center gap-1.5 text-rose-700">
            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center font-black text-[10px]">3</span>
            <span className="hidden sm:inline">Address</span>
          </div>
          <div className="h-0.5 w-4 sm:w-10 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 ${isDetailsComplete ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${isDetailsComplete ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {isDetailsComplete ? '4' : '🔒'}
            </span>
            <span className="hidden sm:inline">{isDetailsComplete ? 'Pay via QR' : 'Payment (Locked)'}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-center gap-2.5 text-xs sm:text-sm">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Step 1: Pickle Selection */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-premium border border-slate-200 space-y-4">
              <h2 className="font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                <span>1. Select Pickle & Quantity</span>
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pickle Variety:
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white font-medium"
                >
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.nepaliName}) – ₹{p.startingPrice}/kg
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Quantity Required:
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[0.5, 1, 2, 3, 5].map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setQuantityKg(q)}
                      className={`h-11 rounded-xl text-xs font-bold border transition-all flex flex-col justify-center items-center ${
                        quantityKg === q
                          ? 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-300'
                          : 'bg-slate-50 text-slate-900 border-slate-200 active:bg-slate-100'
                      }`}
                    >
                      <span>{q === 0.5 ? '500g' : `${q}kg`}</span>
                      {q >= 3 && (
                        <span className={`text-[8px] block leading-tight font-bold ${quantityKg === q ? 'text-white' : 'text-slate-700'}`}>
                          Bulk
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 2: Customer Contact */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-premium border border-slate-200 space-y-4">
              <h2 className="font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                <span>2. Customer Contact Details</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Thapa / Anita Sharma"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Calling Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Number (For receipt) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="WhatsApp mobile number"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="For order receipt copy"
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Delivery Address */}
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-premium border border-slate-200 space-y-4">
              <h2 className="font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
                <span>3. Delivery Address</span>
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery State / Zone *
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white font-medium"
                  >
                    <option value="Himachal Pradesh">Himachal Pradesh (Free Delivery)</option>
                    <option value="Delhi">Delhi NCR (Free Delivery)</option>
                    <option value="Chandigarh">Chandigarh Tricity (Free Delivery)</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Other State">Other State</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Manali, Delhi, Mohali"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit PIN"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    House No. / Building / Street Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                    placeholder="House number, flat, building name, street, area..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="Nearby temple, school, shop..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-11 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Special Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Extra sealed, gift packaging..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-11 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: UPI QR & Online Payment */}
            {!isDetailsComplete ? (
              <div className="bg-slate-50/90 rounded-2xl sm:rounded-3xl p-5 sm:p-7 border-2 border-dashed border-slate-300 text-center space-y-3 shadow-xs">
                <div className="w-12 h-12 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-slate-800">
                    4. UPI Payment & QR Code (Locked)
                  </h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Please fill in your <strong>Contact Details (Step 2)</strong> and <strong>Delivery Address (Step 3)</strong> above. The verified Google Pay / PhonePe / Paytm payment QR Code and options will automatically appear here!
                  </p>
                </div>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-50 rounded-full border border-rose-200 text-rose-800 text-[11px] font-bold">
                    ⏳ Complete Steps 1, 2 & 3 above to unlock Payment & QR Code
                  </span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-premium border-2 border-emerald-500 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h2 className="font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-700" />
                    <span>4. Pay with UPI / GPay / PhonePe / Paytm / QR</span>
                  </h2>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Details Verified • Ready to Pay
                  </span>
                </div>

                {/* UPI QR & Payment Info Card */}
                <div className="bg-gradient-to-br from-slate-50 via-emerald-50/20 to-rose-50/20 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    {/* QR Image Preview */}
                    <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <div className="relative max-w-[190px] w-full">
                        <img
                          src="/images/payment/upi-qr-code.png"
                          alt="Everest Nepali Achar UPI QR Code - Sunita Sijapati"
                          className="w-full h-auto rounded-xl object-contain shadow-xs border border-slate-100"
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 mt-2 text-center">
                        Scan with Google Pay, PhonePe, Paytm or Any UPI App
                      </span>
                    </div>

                    {/* Beneficiary & Fast-Action Copy Controls */}
                    <div className="sm:col-span-7 space-y-2.5">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                          Beneficiary Name
                        </span>
                        <p className="font-serif font-extrabold text-base text-slate-900 leading-tight">
                          Sunita Sijapati
                        </p>
                        <p className="text-xs text-slate-600">
                          Bank: <strong>UCO Bank 8837</strong> • Everest Nepali Achar
                        </p>
                      </div>

                      {/* 1-Tap Copy UPI ID */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">UPI ID:</span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                            sijapatisunita2@okicici
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpiId}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-lg transition-colors"
                        >
                          {copiedUpiId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpiId ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* 1-Tap Copy GPay / PhonePe Mobile Number */}
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">GPay / PhonePe / Paytm No:</span>
                          <span className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                            8219359881
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUpiNumber}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 rounded-lg transition-colors"
                        >
                          {copiedUpiNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedUpiNumber ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>

                      {/* Mobile UPI Direct App Intent */}
                      <a
                        href={upiIntentUrl}
                        className="w-full flex items-center justify-center gap-2 h-11 px-3 bg-gradient-to-r from-emerald-700 to-emerald-800 active:from-emerald-800 active:to-emerald-900 text-white rounded-xl font-bold text-xs shadow-sm transition-transform active:scale-95"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{calculation?.totalAmount.toLocaleString('en-IN') || '...'} on UPI App</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Payment Proof Inputs */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Enter Payment ID or Upload Screenshot:
                    </span>
                  </div>

                  {/* Option 1: Transaction ID / UTR Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Option A: UPI Transaction ID / UTR / Reference No.
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. 423819234567 or UPI-UTR-12-digit"
                      className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm h-12 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white font-mono font-medium"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">
                      Available in your GPay / PhonePe / Paytm / Bank app receipt under "UPI Transaction ID" or "UTR".
                    </span>
                  </div>

                  {/* Option 2: Screenshot Upload */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Option B: Upload Payment Screenshot / Receipt Photo
                    </label>
                    
                    {!screenshotBase64 ? (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-colors space-y-2 group"
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotUpload}
                          className="hidden"
                        />
                        <div className="w-10 h-10 rounded-full bg-white shadow-xs border border-slate-200 text-emerald-700 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            Tap to Upload Payment Screenshot
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Supports PNG, JPG, JPEG, WEBP (Max 8MB)
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative p-3 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={screenshotBase64}
                            alt="Payment proof screenshot preview"
                            className="w-12 h-12 rounded-xl object-cover border border-emerald-400 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-emerald-900 block truncate">
                              {screenshotFileName || 'Payment Screenshot Attached'}
                            </span>
                            <span className="text-[10px] text-emerald-700">
                              ✓ Screenshot attached for kitchen order dispatch
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveScreenshot}
                          className="p-1.5 bg-white text-slate-600 hover:text-red-600 rounded-lg border border-slate-200 transition-colors"
                          title="Remove screenshot"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div id="order-form-bottom" className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-premium border-2 border-rose-500/80 sticky top-20 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                  Order Summary
                </h3>
                <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Live Tariff
                </span>
              </div>

              {/* Selected Product Card Preview */}
              {selectedProduct && (
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={selectedProduct.primaryImage || '/images/achar/chicken-achar.png'}
                    alt={selectedProduct.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[11px] sm:text-xs font-nepali font-bold text-rose-700 block truncate">
                      {selectedProduct.nepaliName}
                    </span>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 truncate">
                      {selectedProduct.name}
                    </h4>
                    <span className="text-xs text-slate-600">
                      Quantity: <strong>{quantityKg === 0.5 ? '500g' : `${quantityKg} kg`}</strong>
                    </span>
                  </div>
                </div>
              )}

              {/* Bill Breakdown */}
              {calculation ? (
                <div className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <div className="flex justify-between">
                    <span>Product Subtotal:</span>
                    <span className="font-semibold">₹{calculation.productTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Doorstep Delivery:</span>
                    <span className={`font-bold ${calculation.deliveryCharge === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {calculation.deliveryCharge === 0 ? 'FREE' : `+ ₹${calculation.deliveryCharge.toLocaleString('en-IN')}`}
                    </span>
                  </div>

                  <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-100 text-[11px] text-slate-700 leading-snug">
                    <span className="font-bold text-slate-900">Zone Applied: </span>
                    {calculation.zoneDisplayName} ({calculation.deliveryStatusText})
                  </div>

                  <div className="pt-3 border-t-2 border-dashed border-slate-300 flex items-baseline justify-between">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-slate-600 font-bold block">
                        Total Amount Payable
                      </span>
                      <span className="text-[10px] text-emerald-700 font-bold">
                        (Pay to 8219359881 / sijapatisunita2@okicici)
                      </span>
                    </div>
                    <span className="font-serif font-black text-2xl sm:text-3xl text-slate-900">
                      ₹{calculation.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400">
                  Calculating order total...
                </div>
              )}

              {/* Submit CTA */}
              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={submitting || !calculation}
                  className={`w-full flex items-center justify-center gap-2 h-12 sm:h-14 text-sm sm:text-base font-black text-white rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 ${
                    isDetailsComplete
                      ? 'bg-rose-700 hover:bg-rose-800 active:bg-rose-900'
                      : 'bg-slate-700 hover:bg-slate-800'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <span className="text-white font-black">
                    {submitting
                      ? 'Submitting Order & Payment...'
                      : !isDetailsComplete
                      ? 'Fill Delivery Details to Unlock QR & Confirm'
                      : 'Confirm Order & Dispatch Proof'}
                  </span>
                </button>

                <p className="text-[10px] sm:text-[11px] text-center text-slate-500 leading-tight">
                  🔒 Your order and UPI payment details will be instantly registered and sent to founders on WhatsApp.
                </p>
              </div>

              {/* Trust Badge */}
              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Founders: Sunita Kathayat & Tilak Sijapati</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
