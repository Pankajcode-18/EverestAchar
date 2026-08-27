import { Request, Response, NextFunction } from 'express';
import { BusinessInfo } from '../models/BusinessInfo';

export class BusinessController {
  public static async getInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let info = await BusinessInfo.findOne();
      if (!info) {
        info = await BusinessInfo.create({
          brandName: 'EVEREST नेपाली अचार',
          brandNepaliName: 'एभरेस्ट नेपाली अचार',
          tagline: 'नेपाल की परंपरा, स्वाद में बेजोड़',
          nepaliTagline: 'स्वाद नेपाल का, भरोसा हमारा',
          owners: 'Sunita Kathayat & Tilak Sijapati',
          phone: '+91 79915 02810',
          whatsapp: '+91 79915 02810',
          address: {
            town: 'Kullu, Manali',
            district: 'Kullu',
            state: 'Himachal Pradesh',
            pincode: '175131',
            country: 'India',
          },
          faqs: [
            {
              question: 'Do you deliver outside Himachal Pradesh?',
              nepaliQuestion: 'के तपाईं हिमाचल प्रदेश बाहिर पनि डेलिभरी गर्नुहुन्छ?',
              answer: 'Yes! We deliver across India including Delhi NCR, Chandigarh Tricity, Punjab, Mumbai, Bangalore, and all other states via express courier.',
              nepaliAnswer: 'हजुर! हामी दिल्ली, चण्डीगढ र भारतभर कुरियर मार्फत डेलिभरी गर्छौं।',
              category: 'Delivery',
            },
            {
              question: 'How can I place an order?',
              nepaliQuestion: 'मैले अर्डर कसरी गर्ने?',
              answer: 'You can select your favorite pickle on this website, choose your location, get the exact price, and submit the booking. You will instantly receive a WhatsApp confirmation link to connect with our team.',
              nepaliAnswer: 'वेबसाइटमा आफ्नो मनपर्ने अचार रोज्नुहोस् र अर्डर गर्नुहोस् वा ह्वाट्सएप मार्फत सिधै सम्पर्क गर्नुहोस्।',
              category: 'Ordering',
            },
            {
              question: 'Are there discounts or free delivery on bulk orders?',
              nepaliQuestion: 'के ठूलो अर्डरमा फ्री डेलिभरी पाइन्छ?',
              answer: 'Yes! For example, 3kg or more Chicken Pickle or Dalle Khursani Pickle outside Delhi comes with FREE courier delivery and bulk discount pricing.',
              nepaliAnswer: 'हजुर, ३ केजी वा सोभन्दा बढी अर्डर गर्दा फ्री डेलिभरी र विशेष छुट उपलब्ध छ।',
              category: 'Pricing',
            },
            {
              question: 'Who are the founders of Everest Nepali Achar?',
              nepaliQuestion: 'एभरेस्ट नेपाली अचारका संस्थापक को हुन्?',
              answer: 'Everest Nepali Achar is lovingly founded and run by Sunita Kathayat & Tilak Sijapati based in Kullu-Manali, Himachal Pradesh, carrying forward authentic Nepali Himalayan recipes.',
              nepaliAnswer: 'एभरेस्ट नेपाली अचार सुनिता कठायत र तिलक सिजापति द्वारा कुल्लु-मनालीमा सञ्चालन गरिन्छ।',
              category: 'About',
            },
          ],
        });
      }
      res.json({ success: true, data: info });
    } catch (error) {
      next(error);
    }
  }

  public static async updateInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updated = await BusinessInfo.findOneAndUpdate({}, req.body, {
        new: true,
        upsert: true,
      });
      res.json({ success: true, message: 'Business info updated', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
