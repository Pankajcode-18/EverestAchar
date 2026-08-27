import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { Order, IOrderItem, IOrderAddress, IOrderCustomer, IOrderPayment } from '../models/Order';
import { PricingService } from '../services/pricingService';
import { WhatsAppService } from '../services/whatsappService';
import { Product } from '../models/Product';

export class OrderController {
  private static async generateOrderId(): Promise<string> {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const datePrefix = `EVR-${yyyy}${mm}${dd}`;

    const count = await Order.countDocuments({
      orderId: new RegExp(`^${datePrefix}`),
    });

    const sequence = String(count + 1).padStart(3, '0');
    return `${datePrefix}-${sequence}`;
  }

  public static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        customer,
        deliveryAddress,
        items,
        payment,
        specialInstructions,
        source,
      }: {
        customer: IOrderCustomer;
        deliveryAddress: IOrderAddress;
        items: { productId: string; quantityKg: number; selectedSize?: string }[];
        payment?: {
          method?: string;
          upiId?: string;
          upiNumber?: string;
          beneficiaryName?: string;
          bankName?: string;
          transactionId?: string;
          screenshotBase64?: string;
          screenshotUrl?: string;
        };
        specialInstructions?: string;
        source?: 'website_form' | 'ai_chatbot' | 'whatsapp_direct';
      } = req.body;

      if (!customer?.fullName || !customer?.phone || !customer?.whatsapp) {
        res.status(400).json({ success: false, message: 'Full name, phone, and WhatsApp numbers are required.' });
        return;
      }

      if (!deliveryAddress?.fullAddress || !deliveryAddress?.city || !deliveryAddress?.state || !deliveryAddress?.pincode) {
        res.status(400).json({ success: false, message: 'Complete delivery address including state, city, and pincode is required.' });
        return;
      }

      if (!items || !items.length) {
        res.status(400).json({ success: false, message: 'At least one pickle item must be added to order.' });
        return;
      }

      const zone = PricingService.resolveZone(
        deliveryAddress.state,
        deliveryAddress.city,
        deliveryAddress.pincode,
        deliveryAddress.zone
      );
      deliveryAddress.zone = zone;

      const processedItems: IOrderItem[] = [];
      let totalProductAmount = 0;
      let totalDeliveryCharge = 0;
      const breakdownTexts: string[] = [];

      for (const itm of items) {
        const product = await Product.findById(itm.productId);
        if (!product) {
          res.status(400).json({ success: false, message: `Product with ID ${itm.productId} not found.` });
          return;
        }

        const priceCalc = await PricingService.calculatePrice({
          productId: product._id.toString(),
          quantityKg: itm.quantityKg,
          state: deliveryAddress.state,
          city: deliveryAddress.city,
          pincode: deliveryAddress.pincode,
          zone,
        });

        const itemTotal = priceCalc.productTotal;
        totalProductAmount += itemTotal;
        totalDeliveryCharge += priceCalc.deliveryCharge;
        breakdownTexts.push(`${product.name}: ${priceCalc.breakdownSummary}`);

        processedItems.push({
          productId: product._id,
          name: product.name,
          nepaliName: product.nepaliName,
          quantityKg: itm.quantityKg,
          unitPrice: priceCalc.unitPrice,
          itemTotal,
          selectedSize: itm.selectedSize || `${itm.quantityKg} kg`,
        });
      }

      const totalPayable = totalProductAmount + totalDeliveryCharge;
      const orderId = await OrderController.generateOrderId();

      // Handle payment screenshot if uploaded as base64
      let savedScreenshotUrl = payment?.screenshotUrl || '';
      if (payment?.screenshotBase64 && payment.screenshotBase64.startsWith('data:image')) {
        try {
          const uploadsDir = path.join(__dirname, '../../uploads/payment');
          if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
          }
          const matches = payment.screenshotBase64.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
          if (matches) {
            const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
            const buffer = Buffer.from(matches[2], 'base64');
            const fileName = `screenshot-${orderId}.${ext}`;
            const filePath = path.join(uploadsDir, fileName);
            fs.writeFileSync(filePath, buffer);
            savedScreenshotUrl = `/uploads/payment/${fileName}`;
          }
        } catch (imgErr) {
          console.error('Failed to save screenshot image:', imgErr);
        }
      }

      const orderPayment: IOrderPayment = {
        method: payment?.method || 'UPI_QR',
        upiId: payment?.upiId || 'sijapatisunita2@okicici',
        upiNumber: payment?.upiNumber || '8219359881',
        beneficiaryName: payment?.beneficiaryName || 'Sunita Sijapati',
        bankName: payment?.bankName || 'UCO Bank 8837',
        transactionId: payment?.transactionId || '',
        screenshotUrl: savedScreenshotUrl,
        status: 'Pending_Verification',
        paidAmount: totalPayable,
        paidAt: new Date(),
      };

      const hasProof = !!(orderPayment.transactionId || orderPayment.screenshotUrl);

      const newOrder = await Order.create({
        orderId,
        customer,
        items: processedItems,
        deliveryAddress,
        pricing: {
          productTotal: totalProductAmount,
          deliveryCharge: totalDeliveryCharge,
          discount: 0,
          totalAmount: totalPayable,
          deliveryStatusText: totalDeliveryCharge === 0 ? 'Free Delivery' : `₹${totalDeliveryCharge} Courier`,
          breakdownSummary: breakdownTexts.join(' | '),
        },
        payment: orderPayment,
        orderStatus: 'Pending',
        paymentStatus: hasProof ? 'Proof Submitted (Verification Pending)' : 'Pending Online Payment',
        specialInstructions,
        source: source || 'website_form',
      });

      const whatsappUrl = WhatsAppService.generateWhatsAppUrl(newOrder);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          order: newOrder,
          orderId: newOrder.orderId,
          whatsappUrl,
          whatsappMessage: WhatsAppService.generateOrderMessage(newOrder),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId } = req.params;
      const order = await Order.findOne({ orderId });
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      const whatsappUrl = WhatsAppService.generateWhatsAppUrl(order);
      res.json({
        success: true,
        data: {
          order,
          whatsappUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { status, search, page = '1', limit = '20' } = req.query;
      const query: Record<string, any> = {};

      if (status && status !== 'all') {
        query.orderStatus = status;
      }
      if (search) {
        const regex = new RegExp(String(search), 'i');
        query.$or = [
          { orderId: regex },
          { 'customer.fullName': regex },
          { 'customer.phone': regex },
          { 'customer.whatsapp': regex },
          { 'deliveryAddress.city': regex },
          { 'deliveryAddress.state': regex },
        ];
      }

      const pageNum = parseInt(String(page), 10) || 1;
      const limitNum = parseInt(String(limit), 10) || 20;
      const skip = (pageNum - 1) * limitNum;

      const [orders, total] = await Promise.all([
        Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        Order.countDocuments(query),
      ]);

      res.json({
        success: true,
        data: orders,
        pagination: {
          total,
          page: pageNum,
          pages: Math.ceil(total / limitNum),
          limit: limitNum,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { orderStatus, paymentStatus } = req.body;

      const updateData: Record<string, any> = {};
      if (orderStatus) updateData.orderStatus = orderStatus;
      if (paymentStatus) updateData.paymentStatus = paymentStatus;

      const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
      if (!updated) {
        res.status(404).json({ success: false, message: 'Order not found' });
        return;
      }

      res.json({ success: true, message: 'Order status updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
