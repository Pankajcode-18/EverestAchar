import dotenv from 'dotenv';
import path from 'path';

// Load from project root .env first, then local server .env if present
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/everest_nepali_achar',
  JWT_SECRET: process.env.JWT_SECRET || 'everest_nepali_achar_jwt_secret_key_2026',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '',
  BUSINESS_PHONE: process.env.BUSINESS_PHONE || '+917991502810',
  BUSINESS_PHONE_2: process.env.BUSINESS_PHONE_2 || '+918219319253',
  BUSINESS_WHATSAPP: process.env.BUSINESS_WHATSAPP || '+917991502810',
  BUSINESS_WHATSAPP_2: process.env.BUSINESS_WHATSAPP_2 || '+918219319253',
  BUSINESS_OWNERS: process.env.BUSINESS_OWNERS || 'Sunita Kathayat & Tilak Sijapati',
};
