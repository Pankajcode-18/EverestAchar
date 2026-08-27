import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { PricingController } from '../controllers/pricingController';
import { OrderController } from '../controllers/orderController';
import { ChatController } from '../controllers/chatController';
import { GalleryController } from '../controllers/galleryController';
import { AuthController } from '../controllers/authController';
import { BusinessController } from '../controllers/businessController';
import { requireAuth } from '../middleware/authMiddleware';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', time: new Date().toISOString(), message: 'Everest Nepali Achar API is online' });
});

// Products
router.get('/products', ProductController.getAll);
router.get('/products/:slug', ProductController.getBySlug);
router.post('/products', requireAuth, ProductController.create);
router.put('/products/:id', requireAuth, ProductController.update);
router.delete('/products/:id', requireAuth, ProductController.delete);

// Pricing
router.post('/pricing/calculate', PricingController.calculate);
router.get('/pricing/zones', PricingController.getZones);

// Orders
router.post('/orders', OrderController.createOrder);
router.get('/orders', requireAuth, OrderController.getAllOrders);
router.get('/orders/single/:orderId', OrderController.getById);
router.get('/orders/:orderId', OrderController.getById);
router.patch('/orders/:id/status', requireAuth, OrderController.updateStatus);

// Chatbot (Gemini AI + Rule engine)
router.post('/chat', ChatController.sendMessage);

// Gallery
router.get('/gallery', GalleryController.getAll);
router.post('/gallery', requireAuth, GalleryController.create);
router.delete('/gallery/:id', requireAuth, GalleryController.delete);

// Auth
router.post('/auth/login', AuthController.login);
router.get('/auth/me', requireAuth, AuthController.me);

// Business Info
router.get('/business', BusinessController.getInfo);
router.put('/business', requireAuth, BusinessController.updateInfo);

export default router;
