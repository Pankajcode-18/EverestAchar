import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationPricingRule {
  basePricePerKg?: number;
  courierPerKg?: number;
  freeDelivery?: boolean;
  tier1KgPrice?: number;
  tier3KgPrice?: number;
  freeDeliveryThresholdKg?: number;
  notes?: string;
}

export interface IProduct extends Document {
  name: string;
  nepaliName: string;
  slug: string;
  category: 'veg' | 'non-veg' | 'spicy-special';
  vegType: 'veg' | 'non-veg';
  description: string;
  shortDescription: string;
  ingredients: string[];
  images: string[];
  primaryImage: string;
  availableSizes: string[];
  pricingRules: {
    himachal: ILocationPricingRule;
    delhiChandigarh: ILocationPricingRule;
    outside: ILocationPricingRule;
    priceOnRequest: boolean;
  };
  startingPrice: number;
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string;
  storageInstructions: string;
  shelfLife: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const LocationPricingRuleSchema = new Schema<ILocationPricingRule>(
  {
    basePricePerKg: { type: Number, default: 0 },
    courierPerKg: { type: Number, default: 0 },
    freeDelivery: { type: Boolean, default: false },
    tier1KgPrice: { type: Number },
    tier3KgPrice: { type: Number },
    freeDeliveryThresholdKg: { type: Number },
    notes: { type: String },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    nepaliName: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['veg', 'non-veg', 'spicy-special'],
      default: 'veg',
    },
    vegType: {
      type: String,
      required: true,
      enum: ['veg', 'non-veg'],
      default: 'veg',
    },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    ingredients: [{ type: String, required: true }],
    images: [{ type: String, required: true }],
    primaryImage: { type: String, required: true },
    availableSizes: [{ type: String, default: ['500g', '1kg', '2kg', '3kg'] }],
    pricingRules: {
      himachal: { type: LocationPricingRuleSchema, default: () => ({}) },
      delhiChandigarh: { type: LocationPricingRuleSchema, default: () => ({}) },
      outside: { type: LocationPricingRuleSchema, default: () => ({}) },
      priceOnRequest: { type: Boolean, default: false },
    },
    startingPrice: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    badge: { type: String },
    storageInstructions: {
      type: String,
      default: 'ठंडी और सूखी जगह पर रखें। खोलने के बाद रेफ्रिजरेट करें। (Store in a cool & dry place. Refrigerate after opening.)',
    },
    shelfLife: {
      type: String,
      default: 'Best within 12 months from packing date (12 महीने के भीतर उपयोग करें)',
    },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
