import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Order, Product } from '../types';
import api from '../services/api';
import { LogOut, Package, RefreshCw, Eye, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../services/whatsapp';

export const AdminDashboardPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [loading, setLoading] = useState<boolean>(true);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const navigate = useNavigate();

  const token = localStorage.getItem('everest_admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [token, navigate]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, prodsRes] = await Promise.all([
        api.get('/orders', { headers: { Authorization: `Bearer ${token}` } }),
        api.get('/products'),
      ]);

      if (ordersRes.data.success) {
        setOrders(ordersRes.data.data);
      }
      if (prodsRes.data.success) {
        setProducts(prodsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await api.patch(
        `/orders/${orderId}/status`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus as any } : o))
        );
      }
    } catch (err) {
      console.error('Status update failed', err);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('everest_admin_token');
    localStorage.removeItem('everest_admin_user');
    navigate('/admin/login');
  };

  return (
    <div className="py-6 sm:py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6">
        {/* Top Header */}
        <div className="bg-himalayan-950 text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-white/10 shadow-xl">
          <div>
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              Founders Dashboard
            </span>
            <h1 className="text-xl sm:text-2xl font-serif font-extrabold text-white">
              Everest Nepali Achar Management
            </h1>
            <p className="text-xs text-slate-300">
              Sunita Kathayat & Tilak Sijapati • Kullu-Manali (+91 79915 02810)
            </p>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 bg-himalayan-900 hover:bg-himalayan-800 text-slate-200 rounded-xl border border-white/10"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-900/80 hover:bg-red-800 text-white text-xs font-bold rounded-xl border border-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-himalayan-950 text-rose-400 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Order Bookings ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'products'
                ? 'bg-himalayan-950 text-rose-400 shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Product Catalog ({products.length})
          </button>
        </div>

        {/* Orders Tab View */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs">
                No orders registered in system yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {orders.map((o) => (
                  <div
                    key={o._id}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {o.orderId}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(o.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-slate-900">{o.customer.fullName}</div>
                        <div className="text-slate-600">📱 {o.customer.phone}</div>
                        <div className="text-slate-600">📍 {o.deliveryAddress.city}, {o.deliveryAddress.state}</div>
                      </div>

                      {/* Items list */}
                      <div className="mt-3 pt-2 border-t border-slate-100 space-y-1">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="text-xs text-slate-700 flex justify-between">
                            <span>{it.name} ({it.quantityKg}kg)</span>
                            <span className="font-semibold">₹{it.itemTotal}</span>
                          </div>
                        ))}
                      </div>

                      {/* Payment Verification Info */}
                      {o.payment && (
                        <div className="mt-2.5 p-2 bg-emerald-50/60 rounded-xl border border-emerald-200 text-[11px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-emerald-900">💳 UPI Payment:</span>
                            <span className="text-[10px] bg-white text-emerald-800 font-bold px-1.5 py-0.5 rounded border border-emerald-300">
                              {o.paymentStatus || 'Submitted'}
                            </span>
                          </div>
                          {o.payment.transactionId && (
                            <div className="font-mono text-slate-800 truncate">
                              <strong>UTR:</strong> {o.payment.transactionId}
                            </div>
                          )}
                          {o.payment.screenshotUrl && (
                            <a
                              href={o.payment.screenshotUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold hover:underline"
                            >
                              <span>📷 View Payment Screenshot</span> →
                            </a>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500">Total:</span>
                        <span className="font-serif font-bold text-base text-slate-900">
                          ₹{o.pricing.totalAmount.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Status:</label>
                        <select
                          value={o.orderStatus}
                          disabled={updatingOrderId === o._id}
                          onChange={(e) => handleStatusChange(o._id, e.target.value)}
                          className="flex-1 text-xs font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="pt-1 flex gap-2">
                        <a
                          href={`https://wa.me/91${o.customer.whatsapp || o.customer.phone}?text=Namaste%20${encodeURIComponent(o.customer.fullName)}!%20Regarding%20your%20Everest%20Nepali%20Achar%20order%20(${o.orderId})...`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-center text-xs font-bold flex items-center justify-center gap-1 shadow-xs"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Customer</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Product Catalog Tab View */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-start gap-3"
              >
                <img
                  src={p.primaryImage || '/images/achar/chicken-achar.png'}
                  alt={p.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-nepali font-bold text-rose-700 block truncate">
                    {p.nepaliName}
                  </span>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 truncate">
                    {p.name}
                  </h4>
                  <div className="text-xs text-slate-600 mt-1">
                    Starting: <strong>₹{p.startingPrice}/kg</strong>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 inline-block ${
                    p.vegType === 'non-veg' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    {p.vegType === 'non-veg' ? 'Non-Veg' : '100% Veg'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
