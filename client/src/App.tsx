import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { OrderProvider } from './context/OrderContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Chatbot } from './components/Chatbot';
import { StickyMobileOrderBar } from './components/StickyMobileOrderBar';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { PricingPage } from './pages/PricingPage';
import { OrderPage } from './pages/OrderPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { GalleryPage } from './pages/GalleryPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <OrderProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen relative selection:bg-rose-600 selection:text-white">
          <Navbar />
          <main className="flex-grow pb-16 lg:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/achar" element={<ProductsPage />} />
              <Route path="/achar/:slug" element={<ProductDetailPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/order/confirmation/:orderId" element={<OrderConfirmationPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <StickyMobileOrderBar />
          <FloatingWhatsApp />
          <Chatbot />
        </div>
      </Router>
    </OrderProvider>
  );
};

export default App;
