import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { useOrder } from '../context/OrderContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  const { setSelectedProduct } = useOrder();

  const isNonVeg = product.vegType === 'non-veg';

  const handleOrderClick = () => {
    setSelectedProduct(product);
    navigate(`/order?product=${product.slug}`);
  };

  return (
    <div className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-premium hover:shadow-premium-hover transition-all duration-300 border border-slate-200 flex flex-col justify-between">
      {/* Image Container with Badges */}
      <div>
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          <img
            src={product.primaryImage || (product.images && product.images[0]) || '/images/achar/chicken-achar.png'}
            alt={`${product.name} - ${product.nepaliName}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/banner/packaging-banner.jpg';
            }}
          />

          {/* Veg / Non-Veg Indicator Icon */}
          <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1.5 text-[10px] sm:text-xs font-bold border border-slate-100">
            <span
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${
                isNonVeg ? 'bg-red-600' : 'bg-emerald-600'
              }`}
            />
            <span className={isNonVeg ? 'text-red-700' : 'text-emerald-700'}>
              {isNonVeg ? 'Non-Veg' : '100% Veg'}
            </span>
          </div>

          {/* Custom Badge */}
          {product.badge && (
            <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-ruby-700 to-rose-600 text-white px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" />
              <span className="truncate max-w-[110px]">{product.badge}</span>
            </div>
          )}

          {/* Sizes Tag */}
          <div className="absolute bottom-2 left-2.5 bg-himalayan-950/85 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-medium border border-white/10">
            Sizes: {product.availableSizes ? product.availableSizes.slice(0, 3).join(', ') : '500g, 1kg+'}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-3.5 sm:p-5 space-y-2">
          <div>
            <span className="text-rose-700 font-nepali font-bold text-base sm:text-lg block leading-snug">
              {product.nepaliName}
            </span>
            <h3 className="text-slate-900 font-serif font-bold text-sm sm:text-base leading-tight">
              {product.name}
            </h3>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Ingredients */}
          <div className="pt-1 flex flex-wrap gap-1">
            {product.ingredients.slice(0, 3).map((ing, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-medium"
              >
                {ing}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Card Footer: Price & Touch CTAs */}
      <div className="p-3.5 sm:p-5 pt-0">
        <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between mb-3">
          <div>
            <span className="text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-wider block">Starting Rate</span>
            <span className="text-base sm:text-lg font-serif font-bold text-slate-900">
              {product.pricingRules?.priceOnRequest ? (
                <span className="text-xs text-rose-700 font-medium">On Request</span>
              ) : (
                <>₹{product.startingPrice.toLocaleString('en-IN')}<span className="text-[11px] font-normal text-slate-500">/kg</span></>
              )}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Free Delivery in HP/Delhi
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/achar/${product.slug}`}
            className="flex items-center justify-center gap-1 h-11 px-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl border border-slate-200 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </Link>

          <button
            onClick={handleOrderClick}
            type="button"
            className="flex items-center justify-center gap-1 h-11 px-2 text-xs font-extrabold text-white bg-rose-700 hover:bg-rose-800 active:bg-rose-900 rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span className="text-white font-extrabold">Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
