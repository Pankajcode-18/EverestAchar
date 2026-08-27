import mongoose, { Schema, Document } from 'mongoose';

export interface IFaq {
  question: string;
  nepaliQuestion?: string;
  answer: string;
  nepaliAnswer?: string;
  category: string;
}

export interface IBusinessInfo extends Document {
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
  faqs: IFaq[];
}

const FaqSchema = new Schema<IFaq>(
  {
    question: { type: String, required: true },
    nepaliQuestion: { type: String },
    answer: { type: String, required: true },
    nepaliAnswer: { type: String },
    category: { type: String, default: 'General' },
  },
  { _id: false }
);

const BusinessInfoSchema = new Schema<IBusinessInfo>(
  {
    brandName: { type: String, default: 'EVEREST नेपाली अचार' },
    brandNepaliName: { type: String, default: 'एभरेस्ट नेपाली अचार' },
    tagline: { type: String, default: 'नेपाल की परंपरा, स्वाद में बेजोड़' },
    nepaliTagline: { type: String, default: 'स्वाद नेपाल का, भरोसा हमारा' },
    owners: { type: String, default: 'Sunita Kathayat & Tilak Sijapati' },
    phone: { type: String, default: '+91 79915 02810 / +91 82193 19253' },
    whatsapp: { type: String, default: '+91 79915 02810 / +91 82193 19253' },
    email: { type: String, default: '' },
    address: {
      town: { type: String, default: 'Kullu, Manali' },
      district: { type: String, default: 'Kullu' },
      state: { type: String, default: 'Himachal Pradesh' },
      pincode: { type: String, default: '175131' },
      country: { type: String, default: 'India' },
    },
    faqs: [FaqSchema],
  },
  { timestamps: true }
);

export const BusinessInfo = mongoose.model<IBusinessInfo>('BusinessInfo', BusinessInfoSchema);
