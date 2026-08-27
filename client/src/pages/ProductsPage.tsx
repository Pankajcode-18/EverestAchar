import React, { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';
import api from '../services/api';
import { Search, Sparkles } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVegFilter, setSelectedVegFilter] = useState<string>('all');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.get('/products');
        if (res.data.success) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nepaliName.includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' ? true : p.category === selectedCategory;

    const matchesVeg =
      selectedVegFilter === 'all' ? true : p.vegType === selectedVegFilter;

    return matchesSearch && matchesCategory && matchesVeg;
  });

  return (
    <div className="py-6 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 rounded-full border border-rose-200 text-rose-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Complete Himalayan Catalog</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-extrabold text-slate-900">
            Our Authentic Nepali Achar Collection
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            16 traditional varieties crafted in Kullu-Manali using cold-pressed mustard oil and mountain spices.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="space-y-3">
          {/* Full-width Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by English name, Nepali name, or ingredients (e.g. Chicken, डल्ले, Timur)..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 h-12"
            />
          </div>

          {/* Mobile Horizontal Scrolling Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedVegFilter('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 min-h-[40px] flex items-center ${
                selectedCategory === 'all' && selectedVegFilter === 'all'
                  ? 'bg-himalayan-900 text-white shadow-md ring-2 ring-rose-500'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Varieties ({products.length})
            </button>

            <button
              onClick={() => {
                setSelectedVegFilter('non-veg');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 min-h-[40px] flex items-center ${
                selectedVegFilter === 'non-veg'
                  ? 'bg-rose-700 text-white shadow-md ring-2 ring-rose-400'
                  : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              🍗 Non-Vegetarian ({products.filter((p) => p.vegType === 'non-veg').length})
            </button>

            <button
              onClick={() => {
                setSelectedVegFilter('veg');
                setSelectedCategory('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 min-h-[40px] flex items-center ${
                selectedVegFilter === 'veg'
                  ? 'bg-emerald-700 text-white shadow-md ring-2 ring-emerald-400'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              🌿 100% Vegetarian ({products.filter((p) => p.vegType === 'veg').length})
            </button>

            <button
              onClick={() => {
                setSelectedCategory('spicy-special');
                setSelectedVegFilter('all');
              }}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 min-h-[40px] flex items-center ${
                selectedCategory === 'spicy-special'
                  ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400'
                  : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              🌶️ Spicy Specials ({products.filter((p) => p.category === 'spicy-special').length})
            </button>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            Loading authentic pickle varieties...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs sm:text-sm space-y-2">
            <p>No pickle varieties match your search or filter.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedVegFilter('all');
              }}
              className="text-xs font-bold text-rose-700 underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
