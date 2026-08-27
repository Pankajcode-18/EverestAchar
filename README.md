# EVEREST नेपाली अचार — Smart Online Pickle Ordering Platform

An authentic, modern, production-grade **Nepali Pickle / Achar business website & ordering system** built using the **MERN Stack with TypeScript** and powered by **Google Gemini AI**.

**Business Owners:** Sunita Kathayat & Tilak Sijapati  
**Contact / WhatsApp:** [+91 79915 02810](https://wa.me/917991502810)  
**Location:** Kullu-Manali, Himachal Pradesh – 175131, India  
**Tagline:** *नेपाल की परंपरा, स्वाद में बेजोड़* (Flavors from the Himalayas)

---

## 🌟 Key Features

1. **Centralized Smart Pricing Engine:**
   - Real-time location-based pricing for **Himachal Pradesh**, **Delhi NCR & Chandigarh**, and **Outside Delhi / Other States**.
   - Handles product-specific courier tariffs, free delivery rules, and 3kg+ bulk discounts (e.g. Chicken ₹1,200–₹1,800, Mutton ₹2,000–₹2,600 + courier rules, Dalle Khursani ₹1,000–₹1,500, Fish, Raw/Fried Garlic).
2. **Authentic Nepali Pickles Catalog:**
   - 16 authentic varieties: *Chicken Pickle (कुखुराको अचार), Mutton Pickle (मटन अचार), Fish Pickle (माछा को अचार), Dalle Khursani (डल्ले खुर्सानी), Raw & Fried Garlic (लसुनको अचार), Gundruk (गुन्द्रुक), Timur (टिमुर), Tama (तामा), Lapsi (लप्सी), Khalpi (खल्पि), Til (तिल), Radish, Mango, Lemon, Mixed Veg*.
3. **Instant WhatsApp Order Handoff:**
   - Unique Order ID generation (`EVR-YYYYMMDD-XXX`).
   - Automatically generates a formatted WhatsApp confirmation message ready to send with 1 click.
4. **Everest Gemini AI Assistant:**
   - Floating interactive assistant with live business context.
   - Dynamic intent recognition and internal pricing calculation to prevent price hallucinations.
5. **Photo & Packaging Gallery:**
   - Categorized masonry gallery with high-resolution image lightboxes and video support.
6. **Admin Management Dashboard:**
   - Protected with JWT authentication (`admin@everestachar.com` / `admin12345`).
   - Manage orders (Pending ➔ Confirmed ➔ Preparing ➔ Dispatched ➔ Delivered), update prices per zone, and add new pickle varieties.

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios, React Router 7.
- **Backend:** Node.js, Express.js, TypeScript, MongoDB, Mongoose, Helmet, Express Rate Limit, JWT, Morgan, Zod.
- **AI Integration:** Google Gemini API (`@google/generative-ai`) via backend proxy.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI

### 2. Installation

Install dependencies across the root, server, and client:

```bash
npm run install:all
```

### 3. Environment Variables

Create `.env` in the root directory (or copy `.env.example`):

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/everest_nepali_achar
JWT_SECRET=everest_nepali_achar_jwt_secret_key_2026
GEMINI_API_KEY=your_gemini_api_key_here
BUSINESS_PHONE=+917991502810
BUSINESS_WHATSAPP=+917991502810
BUSINESS_OWNERS=Sunita Kathayat & Tilak Sijapati
```

### 4. Seed Database

Populate all 16 authentic Nepali pickles, pricing rules, location zones, business info, and initial admin account:

```bash
npm run seed
```

### 5. Running in Development

Start both the backend API server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api](http://localhost:5000/api)
- **Admin Login:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
  - *Email:* `admin@everestachar.com`
  - *Password:* `admin12345`

---

## 📦 Production Build

```bash
npm run build
```

---

## 📜 Business Information

- **Brand:** EVEREST नेपाली अचार (एभरेस्ट नेपाली अचार)
- **Founders:** Sunita Kathayat & Tilak Sijapati
- **WhatsApp / Phone:** +91 79915 02810
- **Location:** Kullu-Manali, Himachal Pradesh, India
