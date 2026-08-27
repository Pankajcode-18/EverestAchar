import mongoose, { Schema, Document } from 'mongoose';
import { ZoneType } from './LocationZone';

export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  nepaliName: string;
  quantityKg: number;
  unitPrice: number;
  itemTotal: number;
  selectedSize?: string;
}

export interface IOrderCustomer {
  fullName: string;
  phone: string;
  whatsapp: string;
  email?: string;
}

export interface IOrderAddress {
  zone: ZoneType;
  state: string;
  city: string;
  pincode: string;
  fullAddress: string;
  landmark?: string;
}

export interface IOrderPricing {
  productTotal: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  deliveryStatusText: string;
  breakdownSummary: string;
}

export interface IOrderPayment {
  method: string;
  upiId: string;
  upiNumber: string;
  beneficiaryName: string;
  bankName: string;
  transactionId?: string;
  screenshotUrl?: string;
  status: 'Pending_Verification' | 'Verified_Paid' | 'Failed';
  paidAmount?: number;
  paidAt?: Date;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface IOrder extends Document {
  orderId: string;
  customer: IOrderCustomer;
  items: IOrderItem[];
  deliveryAddress: IOrderAddress;
  pricing: IOrderPricing;
  payment?: IOrderPayment;
  orderStatus: OrderStatus;
  paymentStatus: string;
  specialInstructions?: string;
  source: 'website_form' | 'ai_chatbot' | 'whatsapp_direct';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    nepaliName: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    itemTotal: { type: Number, required: true },
    selectedSize: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    customer: {
      fullName: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      whatsapp: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
    },
    items: [OrderItemSchema],
    deliveryAddress: {
      zone: {
        type: String,
        required: true,
        enum: ['himachal', 'delhiChandigarh', 'outside'],
      },
      state: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      pincode: { type: String, required: true, trim: true },
      fullAddress: { type: String, required: true, trim: true },
      landmark: { type: String, trim: true },
    },
    pricing: {
      productTotal: { type: Number, required: true },
      deliveryCharge: { type: Number, required: true },
      discount: { type: Number, default: 0 },
      totalAmount: { type: Number, required: true },
      deliveryStatusText: { type: String, required: true },
      breakdownSummary: { type: String, required: true },
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Confirmed', 'Preparing', 'Dispatched', 'Delivered', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
    payment: {
      method: { type: String, default: 'UPI_QR' },
      upiId: { type: String, default: 'sijapatisunita2@okicici' },
      upiNumber: { type: String, default: '8219359881' },
      beneficiaryName: { type: String, default: 'Sunita Sijapati' },
      bankName: { type: String, default: 'UCO Bank 8837' },
      transactionId: { type: String, trim: true },
      screenshotUrl: { type: String },
      status: {
        type: String,
        enum: ['Pending_Verification', 'Verified_Paid', 'Failed'],
        default: 'Pending_Verification',
      },
      paidAmount: { type: Number },
      paidAt: { type: Date },
    },
    paymentStatus: {
      type: String,
      default: 'Payment Verification Pending',
    },
    specialInstructions: { type: String },
    source: {
      type: String,
      enum: ['website_form', 'ai_chatbot', 'whatsapp_direct'],
      default: 'website_form',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
