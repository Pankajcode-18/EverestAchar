import { Order } from '../types';

export const WHATSAPP_NUMBER = '917991502810';
export const WHATSAPP_NUMBER_2 = '918219319253';

export const PHONE_NUMBER_1 = '+91 79915 02810';
export const PHONE_NUMBER_2 = '+91 82193 19253';
export const PHONE_DISPLAY = '+91 79915 02810 / +91 82193 19253';

export const getWhatsAppDirectUrl = (customText?: string, targetNumber = WHATSAPP_NUMBER) => {
  const text = customText || 'Namaste Everest Nepali Achar! 🙏 I would like to inquire about your authentic Himalayan pickles.';
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
};

export const getProductInquiryWhatsAppUrl = (productName: string, nepaliName?: string, targetNumber = WHATSAPP_NUMBER) => {
  const text = `Namaste! 🙏 I am interested in ordering *${productName}* (${nepaliName || ''}) from Everest Nepali Achar. Please let me know the current batch availability and doorstep delivery details.`;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(text)}`;
};

export const generateWhatsAppOrderUrl = (order: Order, targetNumber = WHATSAPP_NUMBER) => {
  const itemsText = order.items
    .map((item) => `• ${item.name} (${item.nepaliName}): ${item.quantityKg} kg = ₹${item.itemTotal}`)
    .join('\n');

  const message = `Namaste Everest Nepali Achar! 🙏
I have placed an order booking on your website:

*Order ID:* ${order.orderId}
*Customer:* ${order.customer.fullName}
*Phone:* ${order.customer.phone}
*WhatsApp:* ${order.customer.whatsapp}

*Delivery Address:*
${order.deliveryAddress.fullAddress}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}
${order.deliveryAddress.landmark ? `Landmark: ${order.deliveryAddress.landmark}\n` : ''}
*Items:*
${itemsText}

*Delivery:* ₹${order.pricing.deliveryCharge} (${order.pricing.deliveryStatusText})
*Total Payable:* ₹${order.pricing.totalAmount}

Please confirm my order and share payment/dispatch tracking details. Thank you!`;

  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(message)}`;
};
