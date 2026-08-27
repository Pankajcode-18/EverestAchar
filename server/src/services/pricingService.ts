import { Product, IProduct } from '../models/Product';
import { ZoneType } from '../models/LocationZone';

export interface PriceCalculationInput {
  productId?: string;
  productSlug?: string;
  productName?: string;
  quantityKg: number;
  state?: string;
  city?: string;
  pincode?: string;
  zone?: ZoneType;
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

export class PricingService {
  /**
   * Automatically resolve geographic zone based on state, city, or pincode
   */
  public static resolveZone(state?: string, city?: string, pincode?: string, explicitZone?: ZoneType): ZoneType {
    if (explicitZone && ['himachal', 'delhiChandigarh', 'outside'].includes(explicitZone)) {
      return explicitZone;
    }

    const s = (state || '').toLowerCase().trim();
    const c = (city || '').toLowerCase().trim();
    const p = (pincode || '').trim();

    // Himachal Pradesh detection
    if (
      s.includes('himachal') ||
      s === 'hp' ||
      c.includes('manali') ||
      c.includes('kullu') ||
      c.includes('shimla') ||
      c.includes('dharamshala') ||
      c.includes('solan') ||
      c.includes('mandi') ||
      p.startsWith('17')
    ) {
      return 'himachal';
    }

    // Delhi detection
    if (
      s.includes('delhi') ||
      c.includes('delhi') ||
      c.includes('new delhi') ||
      p.startsWith('11')
    ) {
      return 'delhiChandigarh';
    }

    // Chandigarh detection
    if (
      s.includes('chandigarh') ||
      c.includes('chandigarh') ||
      c.includes('mohali') ||
      c.includes('panchkula') ||
      p.startsWith('160') ||
      p.startsWith('16')
    ) {
      return 'delhiChandigarh';
    }

    // Default to outside zone
    return 'outside';
  }

  public static getZoneDisplayName(zone: ZoneType): string {
    switch (zone) {
      case 'himachal':
        return 'Himachal Pradesh (Free Delivery)';
      case 'delhiChandigarh':
        return 'Delhi & Chandigarh (Free Delivery)';
      case 'outside':
        return 'Outside Delhi / Chandigarh (Other State)';
      default:
        return 'Other Location';
    }
  }

  /**
   * Calculate precise price according to business rules
   */
  public static async calculatePrice(input: PriceCalculationInput): Promise<PriceCalculationResult> {
    let product: IProduct | null = null;

    if (input.productId) {
      product = await Product.findById(input.productId);
    } else if (input.productSlug) {
      const slugLower = input.productSlug.toLowerCase().trim();
      product = await Product.findOne({
        $or: [
          { slug: slugLower },
          { slug: `${slugLower}-pickle` },
          { slug: new RegExp(slugLower, 'i') },
          { name: new RegExp(slugLower, 'i') },
        ],
      });
    } else if (input.productName) {
      const nameTrimmed = input.productName.trim();
      const regex = new RegExp(nameTrimmed, 'i');
      product = await Product.findOne({
        $or: [{ name: regex }, { nepaliName: regex }, { slug: regex }],
      });
    }

    if (!product) {
      throw new Error(`Product not found with provided identifiers.`);
    }

    const zone = this.resolveZone(input.state, input.city, input.pincode, input.zone);
    const quantityKg = Math.max(0.25, Number(input.quantityKg) || 1);
    const zoneDisplayName = this.getZoneDisplayName(zone);

    // If marked as price on request
    if (product.pricingRules.priceOnRequest) {
      return {
        productId: product._id.toString(),
        productName: product.name,
        productNepaliName: product.nepaliName,
        quantityKg,
        zone,
        zoneDisplayName,
        unitPrice: 0,
        productTotal: 0,
        courierChargePerKg: 0,
        deliveryCharge: 0,
        discount: 0,
        totalAmount: 0,
        deliveryStatusText: 'Price available on request via WhatsApp',
        breakdownSummary: 'Please contact us on WhatsApp (+91 79915 02810) for custom quantity and fresh batch pricing.',
        priceOnRequest: true,
      };
    }

    let unitPrice = 0;
    let productTotal = 0;
    let deliveryCharge = 0;
    let courierChargePerKg = 0;
    let discount = 0;
    let totalAmount = 0;
    let deliveryStatusText = 'Free Delivery';
    let breakdownSummary = '';

    const slug = product.slug.toLowerCase();

    // 1. CHICKEN PICKLE (कुखुराको अचार)
    if (slug.includes('chicken') || slug.includes('kukhura')) {
      if (zone === 'himachal') {
        unitPrice = 1200;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Himachal Pradesh';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else if (zone === 'delhiChandigarh') {
        unitPrice = 1300;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Delhi & Chandigarh';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else {
        // Outside Delhi
        if (quantityKg === 1) {
          totalAmount = 1800;
          unitPrice = 1800;
          productTotal = 1800;
          deliveryCharge = 0; // included
          deliveryStatusText = 'Delivery Included in Total';
          breakdownSummary = `1 kg Special Package: ₹1,800 (including Doorstep Delivery)`;
        } else if (quantityKg >= 3) {
          unitPrice = 1200; // ₹3,600 for 3kg
          productTotal = unitPrice * quantityKg;
          deliveryCharge = 0;
          totalAmount = productTotal;
          deliveryStatusText = 'Free Delivery for 3kg+ Orders!';
          breakdownSummary = `Bulk Offer: ₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery outside Delhi)`;
        } else {
          // 2kg outside
          unitPrice = 1500;
          productTotal = unitPrice * quantityKg;
          deliveryCharge = 0;
          totalAmount = productTotal;
          deliveryStatusText = 'Delivery Included';
          breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Delivery Included)`;
        }
      }
    }
    // 2. DALLE KHURSANI PICKLE (डल्ले खुर्सानीको अचार)
    else if (slug.includes('dalle') || slug.includes('khursani')) {
      if (zone === 'himachal') {
        unitPrice = 1000;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Himachal Pradesh';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else if (zone === 'delhiChandigarh') {
        unitPrice = 1100;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Delhi & Chandigarh';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else {
        // Outside Delhi
        if (quantityKg === 1) {
          totalAmount = 1500;
          unitPrice = 1500;
          productTotal = 1500;
          deliveryCharge = 0;
          deliveryStatusText = 'Delivery Included';
          breakdownSummary = `1 kg Special Package: ₹1,500 (including Doorstep Delivery)`;
        } else if (quantityKg >= 3) {
          unitPrice = 1000; // ₹3,000 for 3kg
          productTotal = unitPrice * quantityKg;
          deliveryCharge = 0;
          totalAmount = productTotal;
          deliveryStatusText = 'Free Delivery for 3kg+ Orders!';
          breakdownSummary = `Bulk Offer: ₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
        } else {
          unitPrice = 1300;
          productTotal = unitPrice * quantityKg;
          deliveryCharge = 0;
          totalAmount = productTotal;
          deliveryStatusText = 'Delivery Included';
          breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Delivery Included)`;
        }
      }
    }
    // 3. RAW GARLIC PICKLE (काँचो लसुनको अचार)
    else if (slug.includes('raw-garlic') || (slug.includes('garlic') && !slug.includes('fried') && !slug.includes('dry'))) {
      if (zone === 'himachal' || zone === 'delhiChandigarh') {
        unitPrice = 600;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else {
        unitPrice = 600;
        courierChargePerKg = 200;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = courierChargePerKg * quantityKg;
        totalAmount = productTotal + deliveryCharge;
        deliveryStatusText = `₹${courierChargePerKg}/kg Courier Charge`;
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg (₹${productTotal}) + Courier ₹${deliveryCharge} = ₹${totalAmount.toLocaleString('en-IN')}`;
      }
    }
    // 4. FRIED / DRIED GARLIC PICKLE (सुकेको/फ्राई लसुनको अचार)
    else if (slug.includes('fried-garlic') || slug.includes('dry-garlic')) {
      if (zone === 'himachal') {
        unitPrice = 700;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Himachal';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else if (zone === 'delhiChandigarh') {
        unitPrice = 800;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Delhi & Chandigarh';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else {
        unitPrice = 800;
        courierChargePerKg = 200;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = courierChargePerKg * quantityKg;
        totalAmount = productTotal + deliveryCharge;
        deliveryStatusText = `₹${courierChargePerKg}/kg Courier Charge`;
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg (₹${productTotal}) + Courier ₹${deliveryCharge} = ₹${totalAmount.toLocaleString('en-IN')}`;
      }
    }
    // 5. MUTTON PICKLE (मटन अचार)
    else if (slug.includes('mutton')) {
      if (zone === 'himachal') {
        unitPrice = 2000;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Himachal';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else if (zone === 'delhiChandigarh') {
        unitPrice = 2200;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = 'Free Delivery in Delhi & Chandigarh';
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else {
        // Outside Delhi/Chandigarh
        if (quantityKg === 1) {
          unitPrice = 2600;
          productTotal = 2600;
          deliveryCharge = 0; // all inclusive
          totalAmount = 2600;
          deliveryStatusText = 'Delivery Included in ₹2,600';
          breakdownSummary = `1 kg Special Package: ₹2,600 (including Doorstep Delivery)`;
        } else {
          // 2kg or >= 3kg: ₹2,200/kg + ₹230/kg courier
          unitPrice = 2200;
          courierChargePerKg = 230;
          productTotal = unitPrice * quantityKg;
          deliveryCharge = courierChargePerKg * quantityKg;
          totalAmount = productTotal + deliveryCharge;
          deliveryStatusText = `₹${courierChargePerKg}/kg Courier Added`;
          breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg (₹${productTotal.toLocaleString('en-IN')}) + ₹${courierChargePerKg}/kg Courier (₹${deliveryCharge.toLocaleString('en-IN')}) = ₹${totalAmount.toLocaleString('en-IN')}`;
        }
      }
    }
    // 6. FISH PICKLE (माछा को अचार)
    else if (slug.includes('fish') || slug.includes('macha')) {
      if (zone === 'himachal' || zone === 'delhiChandigarh') {
        unitPrice = 1400;
        productTotal = unitPrice * quantityKg;
        deliveryCharge = 0;
        totalAmount = productTotal;
        deliveryStatusText = `Free Delivery in ${zone === 'himachal' ? 'Himachal' : 'Delhi & Chandigarh'}`;
        breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg = ₹${totalAmount.toLocaleString('en-IN')} (Free Delivery)`;
      } else {
        // Outside Delhi/Chandigarh
        if (quantityKg === 1) {
          unitPrice = 1800;
          productTotal = 1800;
          deliveryCharge = 0; // all inclusive
          totalAmount = 1800;
          deliveryStatusText = 'Delivery Included in ₹1,800';
          breakdownSummary = `1 kg Special Package: ₹1,800 (including Doorstep Delivery)`;
        } else {
          // >= 2kg outside: ₹1,400/kg + ₹230/kg courier
          unitPrice = 1400;
          courierChargePerKg = 230;
          productTotal = unitPrice * quantityKg;
          deliveryCharge = courierChargePerKg * quantityKg;
          totalAmount = productTotal + deliveryCharge;
          deliveryStatusText = `₹${courierChargePerKg}/kg Courier Added`;
          breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg (₹${productTotal.toLocaleString('en-IN')}) + ₹${courierChargePerKg}/kg Courier (₹${deliveryCharge.toLocaleString('en-IN')}) = ₹${totalAmount.toLocaleString('en-IN')}`;
        }
      }
    }
    // 7. OTHER PRODUCTS / DYNAMIC PRICING RULES FROM DB
    else {
      const zoneRule = product.pricingRules[zone] || product.pricingRules.himachal;
      unitPrice = zoneRule.basePricePerKg || product.startingPrice || 600;
      courierChargePerKg = zoneRule.courierPerKg || (zone === 'outside' ? 150 : 0);
      
      productTotal = unitPrice * quantityKg;
      deliveryCharge = zoneRule.freeDelivery ? 0 : courierChargePerKg * quantityKg;
      totalAmount = productTotal + deliveryCharge;

      deliveryStatusText = deliveryCharge === 0 ? 'Free Delivery' : `₹${deliveryCharge} Courier`;
      breakdownSummary = `₹${unitPrice.toLocaleString('en-IN')}/kg × ${quantityKg} kg ${deliveryCharge > 0 ? `+ Courier ₹${deliveryCharge}` : '(Free Delivery)'} = ₹${totalAmount.toLocaleString('en-IN')}`;
    }

    return {
      productId: product._id.toString(),
      productName: product.name,
      productNepaliName: product.nepaliName,
      quantityKg,
      zone,
      zoneDisplayName,
      unitPrice,
      productTotal,
      courierChargePerKg,
      deliveryCharge,
      discount,
      totalAmount,
      deliveryStatusText,
      breakdownSummary,
      priceOnRequest: false,
    };
  }
}
