# 🌸 Rosebella Perfections — Website

A full-stack React e-commerce website for Rosebella Perfections, featuring an elegant storefront, product catalog with WhatsApp ordering, event booking, and a Firebase-powered admin panel.

---

## 🚀 Quick Setup (5 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Plug In Your Firebase Config
Open `src/firebase/config.js` and replace the placeholder values:
```js
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
}
```
> Get this from **Firebase Console → Project Settings → Your Apps → SDK setup**

### 3. Add Your WhatsApp Number
Search for `260XXXXXXXXX` in the project and replace with your real number (include country code, no `+`):
- `src/context/CartContext.jsx` — line with `WHATSAPP_NUMBER`
- `src/pages/Booking.jsx` — line with `WHATSAPP_NUMBER`
- `src/components/Footer.jsx` — the WhatsApp link href
- `src/pages/Events.jsx` — the WhatsApp link href

### 4. Create Your Admin Account
In Firebase Console:
- Go to **Authentication → Users → Add User**
- Add your admin email and password
- Go to **Firestore Database → Create database** (start in test mode)
- Go to **Storage → Get started** (start in test mode)

### 5. Run the App
```bash
npm run dev
```

---

## 📁 Project Structure

```
src/
├── App.jsx                  # Router & layout
├── main.jsx                 # Entry point
├── index.css                # CSS variables, global styles
│
├── firebase/
│   └── config.js            # 🔥 PLUG YOUR CONFIG HERE
│
├── context/
│   └── CartContext.jsx      # Cart state + WhatsApp order
│
├── data/
│   └── products.js          # Default product catalog
│
├── components/
│   ├── Header.jsx           # Sticky nav + mobile menu
│   ├── Footer.jsx           # Footer (made by Trey)
│   ├── Hero.jsx             # Landing hero section
│   ├── ProductCard.jsx      # Reusable product card
│   ├── ProductShowcase.jsx  # Bento grid (5-product loop)
│   └── CartDrawer.jsx       # Slide-out cart → WhatsApp
│
└── pages/
    ├── Home.jsx             # Landing page
    ├── Catalog.jsx          # Shop with filters + cart
    ├── Events.jsx           # Event packages
    ├── Booking.jsx          # Booking form → WhatsApp
    └── admin/
        └── Admin.jsx        # Firebase admin panel
```

---

## 🛍️ Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Hero, services, bento showcase, testimonials |
| `/catalog` | Shop | Product grid with category filters & search |
| `/events` | Events | Event packages & how-it-works |
| `/booking` | Booking | Full booking form → WhatsApp |
| `/admin` | Admin | Firebase-powered product manager |

---

## 🎨 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--cream` | `#FFF8F0` | Background |
| `--pink` | `#FF1493` | Primary accent (logo colour) |
| `--rose-gold` | `#C9956C` | Secondary accent |
| `--text-dark` | `#2C1810` | Headings |
| `--font-display` | Playfair Display | Headings |
| `--font-body` | Cormorant Garamond | Body text |
| `--font-ui` | Montserrat | UI labels, buttons |

---

## 🛠️ Firebase Features Used

- **Firestore** — Product catalog storage
- **Storage** — Product image uploads
- **Auth** — Admin login (email/password)

### Firestore Security Rules (recommended)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Rules (recommended)
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{file} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📱 Mobile-First

Fully responsive across:
- iPhone SE → iPhone 15 Pro Max
- Android small (360px) → large (430px)
- Tablets and desktop

---

## 🔧 Build for Production

```bash
npm run build
npm run preview
```

Deploy the `dist/` folder to:
- **Vercel** (recommended — free, instant deploys)
- **Netlify**
- **Firebase Hosting**

---

## 💕 Made by Trey
