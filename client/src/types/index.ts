export type ZoneType = 'himachal' | 'delhiChandigarh' | 'outside';

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export interface LocationPricingRule {
  basePricePerKg?: number;
  courierPerKg?: number;
  freeDelivery?: boolean;
  tier1KgPrice?: number;
  tier3KgPrice?: number;
  freeDeliveryThresholdKg?: number;
  notes?: string;
}

export interface Product {
  _id: string;
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
    himachal: LocationPricingRule;
    delhiChandigarh: LocationPricingRule;
    outside: LocationPricingRule;
    priceOnRequest: boolean;
  };
  startingPrice: number;
  isAvailable: boolean;
  isFeatured: boolean;
  badge?: string;
  storageInstructions: string;
  shelfLife: string;
  displayOrder: number;
}

export interface LocationZone {
  _id: string;
  zoneKey: ZoneType;
  displayName: string;
  nepaliDisplayName: string;
  states: string[];
  cities: string[];
  pincodePrefixes: string[];
  description: string;
  deliveryHighlights: string;
}

export interface PriceCalculationResult {
  productId: string;
  productName: string;
  productNepaliName: string;
  quantityKg: number;
  zone: ZoneType;
  zoneDisplayName: string;
  unitPrice: number;
  productTotal: number;
  courierChargePerKg: number;
  deliveryCharge: number;
  discount: number;
  totalAmount: number;
  deliveryStatusText: string;
  breakdownSummary: string;
  priceOnRequest: boolean;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  nepaliName: string;
  quantityKg: number;
  unitPrice: number;
  itemTotal: number;
  selectedSize?: string;
}

export interface OrderPayment {
  method: string;
  upiId: string;
  upiNumber: string;
  beneficiaryName: string;
  bankName: string;
  transactionId?: string;
  screenshotUrl?: string;
  status: 'Pending_Verification' | 'Verified_Paid' | 'Failed';
  paidAmount?: number;
  paidAt?: string;
}

export interface Order {
  _id: string;
  orderId: string;
  customer: {
    fullName: string;
    phone: string;
    whatsapp: string;
    email?: string;
  };
  items: OrderItem[];
  deliveryAddress: {
    zone: ZoneType;
    state: string;
    city: string;
    pincode: string;
    fullAddress: string;
    landmark?: string;
  };
  pricing: {
    productTotal: number;
    deliveryCharge: number;
    discount: number;
    totalAmount: number;
    deliveryStatusText: string;
    breakdownSummary: string;
  };
  payment?: OrderPayment;
  orderStatus: OrderStatus;
  paymentStatus: string;
  specialInstructions?: string;
  source: 'website_form' | 'ai_chatbot' | 'whatsapp_direct';
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  nepaliTitle?: string;
  image: string;
  category: 'all' | 'veg' | 'non-veg' | 'packaging' | 'culture' | 'behind_the_scenes';
  description: string;
  displayOrder: number;
  featured: boolean;
}

export interface BusinessInfo {
  brandName: string;
  brandNepaliName: string;
  tagline: string;
  nepaliTagline: string;
  owners: string;
  phone: string;
  whatsapp: string;
  email?: string;
  address: {
    town: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
  };
  faqs: {
    question: string;
    nepaliQuestion?: string;
    answer: string;
    nepaliAnswer?: string;
    category: string;
  }[];
}
