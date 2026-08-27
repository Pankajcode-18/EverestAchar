import { GoogleGenerativeAI } from '@google/generative-ai';
import { ENV } from '../config/env';
import { Product } from '../models/Product';
import { PricingService } from './pricingService';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggestedActions?: { label: string; action: string; payload?: Record<string, any> }[];
  calculatedPrice?: any;
  orderDraft?: {
    productName?: string;
    productSlug?: string;
    quantityKg?: number;
    location?: string;
    totalAmount?: number;
    readyToSubmit?: boolean;
  };
}

export class ChatService {
  private static getGenAI(): GoogleGenerativeAI | null {
    const key = ENV.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';
    if (!key) return null;
    return new GoogleGenerativeAI(key);
  }

  /**
   * System context injected into AI prompt
   */
  private static async getSystemPrompt(): Promise<string> {
    const products = await Product.find({ isAvailable: true }).select('name nepaliName slug category vegType ingredients startingPrice pricingRules');
    
    const productSummary = products
      .map(
        (p) =>
          `- ${p.name} (${p.nepaliName}) [${p.vegType.toUpperCase()}]: ${p.ingredients.join(', ')}. Base Starting: ₹${p.startingPrice}/kg. Slug: ${p.slug}`
      )
      .join('\n');

    return `You are "Everest Achar Assistant", the official expert AI customer assistant for Everest Nepali Achar (एभरेस्ट नेपाली अचार).

ABOUT THE BRAND & OWNERS:
- Founders & Owners: Sunita Kathayat & Tilak Sijapati.
- Kitchen & Production Location: Kullu & Manali, Himachal Pradesh, India.
- WhatsApp & Calling Numbers: +91 79915 02810 and +91 82193 19253.
- Tagline: "नेपाल की परंपरा, स्वाद में बेजोड़" (Nepalese Tradition, Unmatched Flavor).
- Authenticity: 100% pure cold-pressed mustard oil, authentic Himalayan spices, Timur (Szechuan pepper), Dalle Khursani chili. No artificial coloring or harmful chemical preservatives.
- Shelf Life: 9 to 12 months when stored in a cool, dry place with oil seal.

OFFICIAL VERIFIED PRICING & DELIVERY TARIFF RULES:
1. Non-Veg Pickles:
   - Chicken Pickle (कुखुराको अचार):
     • Himachal Pradesh: ₹1,200/kg (100% FREE Doorstep Delivery)
     • Delhi NCR & Chandigarh Tricity: ₹1,300/kg (100% FREE Delivery)
     • Outside Delhi / All Other States: 1kg = ₹1,800 (incl. air courier); 3kg+ Bulk Offer = ₹3,600 for 3kg (FREE Delivery everywhere in India!)
   - Mutton Pickle (मटन अचार - Tender Himalayan Meat):
     • Himachal Pradesh: ₹2,000/kg (Free Delivery)
     • Delhi & Chandigarh: ₹2,200/kg (Free Delivery)
     • Outside Delhi: 1kg = ₹2,600 (incl. delivery); 3kg+ = ₹2,200/kg + courier
   - Fish Pickle (माछा को अचार - Boneless River Fish):
     • Himachal: ₹1,400/kg (Free Delivery)
     • Delhi & Chandigarh: ₹1,400/kg (Free Delivery)
     • Outside Delhi: 1kg = ₹1,800 (incl. delivery)
   - Buff Pickle & Pork Pickle:
     • Starting ₹1,200 - ₹1,400/kg. Contact owners on WhatsApp for fresh seasonal batch availability.

2. Vegetarian Pickles:
   - Dalle Khursani Pickle (डल्ले खुर्सानी - Famous Round Red Hot Chili):
     • Himachal: ₹1,000/kg (Free Delivery)
     • Delhi & Chandigarh: ₹1,100/kg (Free Delivery)
     • Outside Delhi: 1kg = ₹1,500 (incl. delivery); 3kg+ Bulk Offer = ₹3,000 for 3kg (FREE Delivery)
   - Raw Garlic Pickle (काँचो लसुन): ₹600/kg (Free delivery in HP/Delhi/CHD)
   - Fried/Dried Garlic Pickle (सुकेको/फ्राई लसुन): Himachal ₹700/kg, Delhi/CHD ₹800/kg
   - Gundruk Pickle (गुन्द्रुक - Fermented Himalayan Greens): ₹600/kg
   - Timur Pickle (टिमुर - Zesty Szechuan Peppercorn): ₹650/kg
   - Tama Pickle (तामा - Bamboo Shoot): ₹600/kg
   - Lapsi Pickle (लप्सी - Himalayan Wild Hog Plum sweet-sour): ₹600/kg
   - Khalpi (Cucumber), Til (Sesame), Mango, Radish, Lemon, Mixed Veg: ₹500 - ₹650/kg.

PAYMENT DETAILS & VERIFICATION:
- Payment Method: Scan UPI QR Code on the /order checkout page before finalizing order.
- Beneficiary Name: Sunita Sijapati
- Bank Account: UCO Bank 8837
- UPI ID: sijapatisunita2@okicici
- Mobile / GPay / PhonePe / Paytm Number: 8219359881
- Verification: Customer enters their 12-digit UPI UTR / Transaction ID or uploads payment screenshot during checkout.

INSTRUCTIONS FOR RESPONDING:
1. When asked about ANY pickle price or location, DIRECTLY provide the exact calculated price breakdown first.
2. If location is mentioned (e.g. Delhi, Manali, Bangalore, etc.), show the exact rate and delivery status for that location.
3. If no location is mentioned, show the rate for Himachal (Free), Delhi/CHD (Free), and Outside Delhi (Courier / 3kg Free Bulk Offer).
4. Always invite the customer to click "Order Online" or contact WhatsApp (+91 79915 02810 / +91 82193 19253).
5. Keep tone warm, courteous, authentic (Namaste 🙏), and well-formatted in markdown.`;
  }

  /**
   * Helper: Parse intent for price calculations
   */
  private static parsePriceQuery(message: string): { productName?: string; quantityKg?: number; location?: string } | null {
    const text = message.toLowerCase();
    let productName: string | undefined;
    let quantityKg: number | undefined;
    let location: string | undefined;

    // Detect products
    if (text.includes('chicken') || text.includes('kukhura') || text.includes('कुखुरा') || text.includes('चिकन')) productName = 'chicken-pickle';
    else if (text.includes('mutton') || text.includes('मटन') || text.includes('खसी')) productName = 'mutton-pickle';
    else if (text.includes('fish') || text.includes('macha') || text.includes('माछा') || text.includes('मछली')) productName = 'fish-pickle';
    else if (text.includes('buff') || text.includes('राँगा') || text.includes('बफ')) productName = 'buff-pickle';
    else if (text.includes('pork') || text.includes('सुँगुर') || text.includes('पोर्क')) productName = 'pork-pickle';
    else if (text.includes('dalle') || text.includes('khursani') || text.includes('डल्ले') || text.includes('मिर्च') || text.includes('chili')) productName = 'dalle-khursani-pickle';
    else if (text.includes('fried garlic') || text.includes('dry garlic') || text.includes('सुकेको लसुन')) productName = 'fried-garlic-pickle';
    else if (text.includes('garlic') || text.includes('lasun') || text.includes('लसुन')) productName = 'raw-garlic-pickle';
    else if (text.includes('gundruk') || text.includes('गुन्द्रुक')) productName = 'gundruk-pickle';
    else if (text.includes('timur') || text.includes('टिमुर') || text.includes('तिमुर') || text.includes('szechuan')) productName = 'timur-pickle';
    else if (text.includes('tama') || text.includes('तामा') || text.includes('bamboo')) productName = 'tama-pickle';
    else if (text.includes('lapsi') || text.includes('लप्सी') || text.includes('hog plum')) productName = 'lapsi-pickle';
    else if (text.includes('khalpi') || text.includes('काक्रो') || text.includes('खल्पि') || text.includes('cucumber')) productName = 'khalpi-pickle';
    else if (text.includes('til') || text.includes('तिल') || text.includes('sesame')) productName = 'til-pickle';
    else if (text.includes('mango') || text.includes('आम') || text.includes('aam')) productName = 'mango-pickle';
    else if (text.includes('radish') || text.includes('मूला') || text.includes('mula')) productName = 'radish-pickle';
    else if (text.includes('lemon') || text.includes('कागती') || text.includes('kagati')) productName = 'lemon-pickle';
    else if (text.includes('mixed') || text.includes('मिक्स')) productName = 'mixed-veg-pickle';

    // Detect quantity
    if (text.includes('500g') || text.includes('500 gm') || text.includes('half kg') || text.includes('0.5') || text.includes('आधा किलो')) {
      quantityKg = 0.5;
    } else {
      const kgMatch = text.match(/(\d+(\.\d+)?)\s*(kg|kilo|kilogram|किलो|केजी)/i);
      if (kgMatch) {
        quantityKg = parseFloat(kgMatch[1]);
      } else {
        const numMatch = text.match(/\b([1-9]|10)\b/);
        if (numMatch && (text.includes('kg') || text.includes('pack') || text.includes('order') || text.includes('jar'))) {
          quantityKg = parseFloat(numMatch[1]);
        }
      }
    }

    // Detect location
    if (text.includes('himachal') || text.includes('hp') || text.includes('manali') || text.includes('kullu') || text.includes('shimla') || text.includes('dharamshala') || text.includes('solan') || text.includes('mandi')) {
      location = 'Himachal Pradesh';
    } else if (text.includes('delhi') || text.includes('ncr') || text.includes('new delhi') || text.includes('noida') || text.includes('gurgaon') || text.includes('gurugram') || text.includes('ghaziabad') || text.includes('faridabad')) {
      location = 'Delhi';
    } else if (text.includes('chandigarh') || text.includes('mohali') || text.includes('panchkula') || text.includes('tricity')) {
      location = 'Chandigarh';
    } else if (text.includes('outside') || text.includes('punjab') || text.includes('mumbai') || text.includes('bangalore') || text.includes('bengaluru') || text.includes('up') || text.includes('uttar pradesh') || text.includes('bihar') || text.includes('haryana') || text.includes('rajasthan') || text.includes('maharashtra') || text.includes('karnataka') || text.includes('kolkata') || text.includes('west bengal') || text.includes('hyderabad') || text.includes('chennai') || text.includes('pune')) {
      location = 'Outside Delhi/Chandigarh';
    }

    if (productName || location || quantityKg) {
      return { productName, quantityKg: quantityKg || 1, location: location || 'Delhi' };
    }
    return null;
  }

  /**
   * Process incoming chat conversation
   */
  public static async processMessage(
    message: string,
    history: ChatMessage[] = []
  ): Promise<ChatResponse> {
    const trimmed = message.trim();
    const query = this.parsePriceQuery(trimmed);
    let calculatedPrice: any = null;

    // If a product is detected or user is asking for price
    if (query && query.productName) {
      try {
        calculatedPrice = await PricingService.calculatePrice({
          productSlug: query.productName,
          quantityKg: query.quantityKg || 1,
          state: query.location || 'Delhi',
        });
      } catch (err) {
        // Fallback gracefully
      }
    }

    // Check if Gemini API is available
    const genAI = this.getGenAI();
    if (genAI) {
      try {
        const systemPrompt = await this.getSystemPrompt();
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        let contextualExtra = '';
        if (calculatedPrice) {
          contextualExtra = `\n[VERIFIED PRICING ENGINE CALCULATION FOR THIS QUERY:
- Product: ${calculatedPrice.productName} (${calculatedPrice.productNepaliName})
- Quantity: ${calculatedPrice.quantityKg} kg
- Location / Zone: ${calculatedPrice.zoneDisplayName}
- Unit Base Rate: ₹${calculatedPrice.unitPrice}/kg
- Product Subtotal: ₹${calculatedPrice.productTotal}
- Delivery Fee: ₹${calculatedPrice.deliveryCharge} (${calculatedPrice.deliveryStatusText})
- Total Amount Payable: ₹${calculatedPrice.totalAmount}
IMPORTANT INSTRUCTION: Answer the user's question directly with these exact numbers first. Do NOT start with a generic greeting.]`;
        }

        const formattedHistory = history.map((h) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        }));

        const chat = model.startChat({
          history: [
            {
              role: 'user',
              parts: [{ text: `System Instructions for Everest Achar AI:\n${systemPrompt}` }],
            },
            {
              role: 'model',
              parts: [{ text: 'Namaste! I am the Everest Nepali Achar AI. I will answer customer questions directly with exact prices, location delivery rules, and ordering steps.' }],
            },
            ...formattedHistory,
          ],
        });

        const result = await chat.sendMessage(`${trimmed}${contextualExtra}`);
        const replyText = result.response.text();

        return {
          reply: replyText,
          calculatedPrice,
          suggestedActions: [
            { label: '🛒 Book Order Now', action: 'navigate_order', payload: { productSlug: calculatedPrice?.productId || query?.productName, quantity: query?.quantityKg } },
            { label: '💬 Order on WhatsApp', action: 'open_whatsapp', payload: { product: calculatedPrice?.productName || query?.productName, amount: calculatedPrice?.totalAmount } },
            { label: '📋 View All Achar', action: 'navigate_products' },
            { label: '💳 How to Pay (UPI/QR)', action: 'send_text', payload: { text: 'How do I pay with QR code or GPay 8219359881?' } },
          ],
        };
      } catch (err) {
        console.warn('Gemini API call failed, using intelligent rule fallback:', (err as Error).message);
      }
    }

    // Intelligent Deterministic Fallback when Gemini key is not configured or in offline mode
    return this.getDeterministicFallback(trimmed, query, calculatedPrice);
  }

  private static getDeterministicFallback(
    message: string,
    query: any,
    calculatedPrice: any
  ): ChatResponse {
    const text = message.toLowerCase();

    // 1. If we have a calculated price result
    if (calculatedPrice) {
      const reply = `Namaste! 🙏 Here is the verified price for **${calculatedPrice.productName} (${calculatedPrice.productNepaliName})**:\n\n` +
        `• **Selected Location:** ${calculatedPrice.zoneDisplayName}\n` +
        `• **Quantity:** ${calculatedPrice.quantityKg === 0.5 ? '500g' : `${calculatedPrice.quantityKg} kg`}\n` +
        `• **Product Rate:** ₹${calculatedPrice.unitPrice.toLocaleString('en-IN')}/kg\n` +
        `• **Doorstep Delivery:** **${calculatedPrice.deliveryStatusText}**\n` +
        `• **Total Payable:** **₹${calculatedPrice.totalAmount.toLocaleString('en-IN')}**\n\n` +
        `📦 *Other Location Rates for ${calculatedPrice.productName}:*\n` +
        `• **Himachal Pradesh:** FREE Delivery\n` +
        `• **Delhi NCR & Chandigarh:** FREE Delivery\n` +
        `• **Outside Delhi / Other States:** Courier delivery (Or FREE delivery on 3kg+ bulk order!)\n\n` +
        `Would you like to place your order now?`;

      return {
        reply,
        calculatedPrice,
        suggestedActions: [
          { label: '🛒 Place This Order', action: 'navigate_order', payload: { productSlug: calculatedPrice.productId, quantity: calculatedPrice.quantityKg } },
          { label: '💬 Order on WhatsApp', action: 'open_whatsapp', payload: { product: calculatedPrice.productName, quantity: calculatedPrice.quantityKg, amount: calculatedPrice.totalAmount } },
          { label: '📦 Check 3kg Bulk Offer', action: 'send_text', payload: { text: `What is the 3kg bulk offer price for ${calculatedPrice.productName}?` } },
          { label: '💳 Payment Options (QR)', action: 'send_text', payload: { text: 'How do I pay with QR code or GPay 8219359881?' } },
        ],
      };
    }

    // 2. UPI / QR Payment Question
    if (text.includes('pay') || text.includes('qr') || text.includes('upi') || text.includes('gpay') || text.includes('phonepe') || text.includes('paytm') || text.includes('8219359881')) {
      return {
        reply: `💳 **How to Pay for Your Everest Nepali Achar:**\n\n` +
          `We support 100% direct Indian UPI payment with instant verification:\n\n` +
          `• **Beneficiary Name:** Sunita Sijapati\n` +
          `• **UPI ID:** \`sijapatisunita2@okicici\`\n` +
          `• **GPay / PhonePe / Paytm No.:** \`8219359881\`\n` +
          `• **Bank Account:** UCO Bank 8837\n\n` +
          `🔒 **Payment Verification Steps:**\n` +
          `1. Go to the [Order Page](/order) and fill your delivery address.\n` +
          `2. Scan the official QR code or pay to **8219359881**.\n` +
          `3. Enter your 12-digit UPI UTR / Transaction ID or upload payment screenshot.\n` +
          `4. You will instantly receive an order receipt sent to owners on WhatsApp!`,
        suggestedActions: [
          { label: '🛒 Go to Order Page', action: 'navigate_order' },
          { label: '💬 Confirm on WhatsApp', action: 'open_whatsapp' },
        ],
      };
    }

    // 3. Founders & Contact Inquiry
    if (text.includes('owner') || text.includes('founder') || text.includes('who') || text.includes('sunita') || text.includes('tilak') || text.includes('contact') || text.includes('phone') || text.includes('number') || text.includes('call')) {
      return {
        reply: `🏔️ **Everest Nepali Achar Founders & Contact Details:**\n\n` +
          `Owned & lovingly handcrafted by **Sunita Kathayat & Tilak Sijapati** from Kullu-Manali, Himachal Pradesh.\n\n` +
          `📞 **WhatsApp & Calling Support:**\n` +
          `• Primary Line 1: **+91 79915 02810**\n` +
          `• Support Line 2: **+91 82193 19253**\n` +
          `• Payment Line: **8219359881** (Sunita Sijapati)\n` +
          `• Location: Kullu-Manali, Himachal Pradesh\n\n` +
          `Feel free to call or WhatsApp us anytime for customized bulk packaging, restaurant supply, or fresh dispatch!`,
        suggestedActions: [
          { label: '💬 Chat on WhatsApp', action: 'open_whatsapp' },
          { label: '🍗 View Chicken Pickle', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
          { label: '📋 View All Varieties', action: 'navigate_products' },
        ],
      };
    }

    // 4. Shelf life & Preservation
    if (text.includes('shelf') || text.includes('expiry') || text.includes('how long') || text.includes('preserve') || text.includes('store') || text.includes('storage')) {
      return {
        reply: `🌿 **Shelf Life & Storage Instructions:**\n\n` +
          `• **Shelf Life:** 9 to 12 Months from the date of preparation.\n` +
          `• **Natural Preservation:** Prepared with pure cold-pressed mustard oil, Himalayan Timur, and natural spices (zero chemical preservatives).\n` +
          `• **Storage Tips:** Store in a cool, dry place. Keep the achar submerged under its natural mustard oil layer. Always use a clean, dry spoon. Refrigeration is optional but recommended after opening for long-lasting freshness.`,
        suggestedActions: [
          { label: '🍗 Order Fresh Chicken Achar', action: 'navigate_order' },
          { label: '🌶️ Order Dalle Khursani', action: 'send_text', payload: { text: 'What is the price of Dalle Khursani pickle?' } },
        ],
      };
    }

    // 5. Bulk orders & 3kg discount offer
    if (text.includes('bulk') || text.includes('3kg') || text.includes('discount') || text.includes('wholesale') || text.includes('offer')) {
      return {
        reply: `🎉 **Everest Achar 3kg Bulk Savings Offer:**\n\n` +
          `Ordering 3kg or more gives you guaranteed wholesale pricing & free shipping:\n\n` +
          `• **Chicken Pickle 3kg Bulk:** ₹3,600 (₹1,200/kg with FREE Delivery all over India!)\n` +
          `• **Dalle Khursani 3kg Bulk:** ₹3,000 (₹1,000/kg with FREE Delivery all over India!)\n` +
          `• **Mutton Pickle 3kg:** ₹2,200/kg + standard courier\n\n` +
          `Ideal for family gatherings, festivals, hostels, or long-term kitchen supply!`,
        suggestedActions: [
          { label: '🛒 Book 3kg Chicken Bulk', action: 'navigate_order', payload: { productSlug: 'chicken-pickle', quantity: 3 } },
          { label: '💬 WhatsApp Bulk Inquiry', action: 'open_whatsapp', payload: { product: '3kg Bulk Order' } },
        ],
      };
    }

    // 6. Greetings
    if (text.includes('hello') || text.includes('hi') || text.includes('namaste') || text.includes('hey')) {
      return {
        reply: `Namaste! 🙏 Welcome to **Everest Nepali Achar (एभरेस्ट नेपाली अचार)**.\n\n` +
          `Owned & lovingly prepared by **Sunita Kathayat & Tilak Sijapati** from Kullu-Manali, Himachal Pradesh.\n\n` +
          `How can I assist you today? You can ask me:\n` +
          `• *"What is the price of chicken achar in Delhi / Himachal?"*\n` +
          `• *"How much for 2kg mutton achar in Mumbai?"*\n` +
          `• *"What are the delivery charges in my state?"*\n` +
          `• *"How to pay using QR code / 8219359881?"*\n` +
          `• *"Show me all vegetarian and non-veg pickles"*`,
        suggestedActions: [
          { label: '🍗 Chicken Achar in Delhi', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
          { label: '🥩 Mutton Achar Price', action: 'send_text', payload: { text: 'What is the price of mutton achar in Chandigarh?' } },
          { label: '🌶️ Dalle Khursani Price', action: 'send_text', payload: { text: 'What is the price of Dalle Khursani pickle?' } },
          { label: '💳 How to Pay (UPI/QR)', action: 'send_text', payload: { text: 'How do I pay with QR code or GPay 8219359881?' } },
        ],
      };
    }

    // 7. Asking about available pickles
    if (text.includes('what achar') || text.includes('which pickle') || text.includes('menu') || text.includes('varieties') || text.includes('list') || text.includes('products') || text.includes('catalog')) {
      return {
        reply: `We offer 16+ traditional authentic Nepali Pickles prepared with pure mustard oil and Himalayan spices:\n\n` +
          `🍗 **Non-Vegetarian Specialties:**\n` +
          `• **Chicken Pickle (कुखुराको अचार)** — ₹1,200/kg (HP) • ₹1,300/kg (Delhi/CHD Free Delivery)\n` +
          `• **Mutton Pickle (मटन अचार)** — Rich tender Himalayan mutton (₹2,000–₹2,200/kg)\n` +
          `• **Fish Pickle (माछा को अचार)** — Authentic boneless river fish (₹1,400/kg)\n` +
          `• **Buff & Pork Pickles** — Available on fresh seasonal batch request\n\n` +
          `🌿 **Vegetarian Specialties:**\n` +
          `• **Dalle Khursani (डल्ले खुर्सानी)** — Famous round fiery cherry pepper (₹1,000–₹1,100/kg)\n` +
          `• **Raw & Fried Garlic (लसुनको अचार)** — ₹600–₹800/kg\n` +
          `• **Gundruk Achar (गुन्द्रुक)** — Traditional fermented leafy green recipe (₹600/kg)\n` +
          `• **Timur Achar (टिमुर)** — Himalayan Szechuan peppercorn (₹650/kg)\n` +
          `• **Tama (Bamboo Shoot), Lapsi (Hog Plum), Khalpi (Cucumber), Til (Sesame), Mango, Radish, Lemon**`,
        suggestedActions: [
          { label: '🍗 Chicken in Delhi', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
          { label: '🌶️ Dalle Khursani Price', action: 'send_text', payload: { text: 'What is the price of Dalle Khursani pickle?' } },
          { label: '📋 View All Varieties', action: 'navigate_products' },
          { label: '💬 WhatsApp +91 79915 02810', action: 'open_whatsapp' },
        ],
      };
    }

    // 8. Delivery inquiry
    if (text.includes('deliver') || text.includes('courier') || text.includes('shipping') || text.includes('reach') || text.includes('location') || text.includes('address')) {
      return {
        reply: `Yes, we deliver doorstep across all of India! 🚚\n\n` +
          `• **Himachal Pradesh (Manali, Kullu, Shimla, etc.):** 100% FREE Doorstep Delivery\n` +
          `• **Delhi NCR & Chandigarh Tricity:** 100% FREE Delivery on all popular pickles\n` +
          `• **Outside Delhi / Other States (UP, Punjab, Maharashtra, Karnataka, WB, etc.):** Courier delivery (Or FREE delivery on 3kg+ bulk orders!)\n\n` +
          `Tell me which pickle variety and your city/state, and I'll calculate the exact amount for you!`,
        suggestedActions: [
          { label: '🍗 Chicken in Delhi', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
          { label: '🏔️ Price in Himachal', action: 'send_text', payload: { text: 'What is the price of chicken achar in Himachal Pradesh?' } },
          { label: '🛒 Order Online', action: 'navigate_order' },
        ],
      };
    }

    // 9. Default polite response with WhatsApp option
    return {
      reply: `Namaste! 🙏 For any specific questions about our authentic Nepali pickles, custom packages, or fast dispatch from Kullu-Manali, you can order directly on this website or chat with founders **Sunita Kathayat & Tilak Sijapati**:\n\n` +
        `📞 **WhatsApp & Call:** +91 79915 02810 / +91 82193 19253\n` +
        `💳 **UPI Payment:** 8219359881 (sijapatisunita2@okicici)\n` +
        `🏔️ *नेपाल की परंपरा, स्वाद में बेजोड़*`,
      suggestedActions: [
        { label: '🍗 Chicken Price in Delhi', action: 'send_text', payload: { text: 'What is the price of chicken achar in Delhi?' } },
        { label: '🥩 Mutton Price', action: 'send_text', payload: { text: 'What is the price of mutton achar in Delhi?' } },
        { label: '📋 View All Achar', action: 'navigate_products' },
        { label: '💬 Chat on WhatsApp', action: 'open_whatsapp' },
      ],
    };
  }
}
