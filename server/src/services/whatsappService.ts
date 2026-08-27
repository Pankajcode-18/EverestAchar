import { IOrder } from '../models/Order';
import { ENV } from '../config/env';

export class WhatsAppService {
  private static cleanPhone(phone: string): string {
    return phone.replace(/[^0-9]/g, '');
  }

  public static generateOrderMessage(order: IOrder): string {
    const itemsList = order.items
      .map(
        (item) =>
          `• ${item.name} (${item.nepaliName}) - ${item.quantityKg} kg @ ₹${item.unitPrice.toLocaleString('en-IN')}/kg = ₹${item.itemTotal.toLocaleString('en-IN')}`
      )
      .join('\n');

    let paymentInfo = `💰 *Payment / Pricing Breakdown:*
• Product Subtotal: ₹${order.pricing.productTotal.toLocaleString('en-IN')}
• Delivery Charge: ${order.pricing.deliveryCharge === 0 ? 'FREE' : `₹${order.pricing.deliveryCharge.toLocaleString('en-IN')}`}
• *Total Payable:* ₹${order.pricing.totalAmount.toLocaleString('en-IN')}
• Delivery Status: ${order.pricing.deliveryStatusText}`;

    if (order.payment?.transactionId) {
      paymentInfo += `\n\n💳 *Online UPI Payment Details:*
• Mode: ${order.payment.method || 'UPI (GPay/PhonePe/Paytm)'}
• Paid To: ${order.payment.beneficiaryName} (${order.payment.upiNumber})
• UPI ID: ${order.payment.upiId}
• *UTR / Transaction ID:* ${order.payment.transactionId}
• Payment Status: ${order.paymentStatus}`;
    } else if (order.payment?.screenshotUrl) {
      paymentInfo += `\n\n💳 *Online UPI Payment Proof:*
• Screenshot: Attached / Uploaded to System
• Mode: ${order.payment.method || 'UPI (GPay/PhonePe/Paytm)'}
• Payment Status: ${order.paymentStatus}`;
    }

    const message = `🏔️ *EVEREST NEPALI ACHAR (नेपाली अचार)* 🏔️
*New Order Booking & Payment Confirmation*

🔖 *Order ID:* ${order.orderId}
👤 *Customer:* ${order.customer.fullName}
📞 *Phone:* ${order.customer.phone}
📱 *WhatsApp:* ${order.customer.whatsapp}

📦 *Items Ordered:*
${itemsList}

📍 *Delivery Location:*
${order.deliveryAddress.city}, ${order.deliveryAddress.state} - ${order.deliveryAddress.pincode}
🏠 *Full Address:*
${order.deliveryAddress.fullAddress}${order.deliveryAddress.landmark ? ` (Landmark: ${order.deliveryAddress.landmark})` : ''}

${paymentInfo}

📝 *Special Instructions:* ${order.specialInstructions || 'None'}

Please confirm receipt of payment and dispatch details. Thank you! 🙏`;

    return message;
  }

  public static generateWhatsAppUrl(order: IOrder, targetNumber = ENV.BUSINESS_WHATSAPP): string {
    const message = this.generateOrderMessage(order);
    const cleanedNumber = this.cleanPhone(targetNumber);
    return `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(message)}`;
  }

  public static generateDirectInquiryUrl(
    productName?: string,
    quantity?: string,
    location?: string,
    targetNumber = ENV.BUSINESS_WHATSAPP
  ): string {
    const cleanedNumber = this.cleanPhone(targetNumber);
    let msg = `Namaste Everest Nepali Achar! 🙏\nI would like to inquire about your authentic Himalayan pickles.`;
    if (productName) msg += `\nProduct: ${productName}`;
    if (quantity) msg += `\nQuantity: ${quantity}`;
    if (location) msg += `\nDelivery Location: ${location}`;
    msg += `\nPlease share availability and ordering details.`;
    return `https://wa.me/${cleanedNumber}?text=${encodeURIComponent(msg)}`;
  }
}
