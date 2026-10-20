# AgriConnect — Farmer-to-Buyer Marketplace (MERN + ML Fullstack)

AgriConnect is an end-to-end fullstack MERN + Machine Learning agricultural marketplace platform designed to directly connect farmers to commercial buyers, eliminating unnecessary middlemen commissions, providing transparent price discovery, and integrating predictive ML decision tools.

---

## 📸 9 Screen Layout (Exact Match to Reference Design)

The system is built to match the reference design in full working condition:

| Screen # | Page Name | Route | Description & Features |
|---|---|---|---|
| **1** (Top-Left) | **Home Page** | `/` | Hero section with smiling farmer, search bar, 4 feature cards (*Direct Trade, Fair Prices, Fresh Produce, Trusted Community*), Browse by Category cards (*Grains, Vegetables, Fruits, Pulses, Oilseeds, Spices*), and featured fresh produce. |
| **2** (Top-Center) | **Products Marketplace** | `/products` | Filter sidebar with Category checkboxes, Price slider (₹0–₹200), State dropdown, In Stock & Near Me options. Grid listing with Organic Rice (₹28/kg), Fresh Tomato (₹18/kg), Potato (₹22/kg), Onion (₹20/kg), Green Chilli (₹32/kg), Alphonso Mango (₹60/kg). |
| **3** (Top-Right) | **Product Detail & Negotiation** | `/products/:id` | Image gallery (main + 3 thumbnails), verified farmer badge, harvest date, grade, quantity selector, total price calculation, **[Add to Cart]** and **[Negotiate Price]** interactive bidding modal, About Farmer card, and verified reviews. |
| **4** (Middle-Left) | **Farmer Dashboard** | `/farmer-dashboard` | Dark green sidebar, `+ Add New Product` button, 4 stat cards (*12 Active Products, 35 Total Orders, ₹48,350 Total Earnings, 4.8 Rating*), and Recent Orders table (*Amit Sharma, Karan Mehta, Priya Verma, Rohit Singh*). |
| **5** (Middle-Center) | **Buyer Dashboard** | `/buyer-dashboard` | Dark green sidebar, top search bar, 4 stat cards (*5 Total Orders, 2 Ongoing, 3 Completed, 12 Saved*), My Orders table with direct status tracking (*In Transit, Delivered, Pending*). |
| **6** (Middle-Right) | **Admin Dashboard** | `/admin-dashboard` | Dark green sidebar, 4 stat cards (*245 Registered Farmers, 178 Registered Buyers, 1,250 Total Products, 320 Total Orders*), Pending Verifications table with live **[Verify]** and **[Reject]** actions. |
| **7** (Bottom-Left) | **Price Trend Analysis (ML)** | `/price-trends` | Interactive Recharts area chart with historical price curves and regression smoothing, peak detection (Aug 2026: ₹24/kg), Current Price ₹18/kg (+12%), Highest Price ₹36/kg, and Lowest Price ₹12/kg. |
| **8** (Bottom-Center) | **Demand Prediction (ML)** | `/demand-prediction` | Bar chart of predicted demand (*Nov: 1,200 MT, Dec: 1,450 MT, Jan: 1,600 MT*) with insights on expected 35% growth, best selling window, and regional demand hot-spots. |
| **9** (Bottom-Right) | **Crop Recommendation (ML)** | `/crop-recommendation` | Soil-type and seasonal agro-climatic classifier: State, Soil Type (*Black Soil, Alluvial, Red, etc.*), Season (*Kharif, Rabi, Zaid*). Generates ranked recommendations (*Soybean 92%, Cotton 88%, Maize 84%*). |

---

## ⚡ Quick 1-Click Persona Demo Access

Use the **"Switch Role"** pill in the top navigation bar or quick buttons on the Login page to immediately switch perspectives:

- **Farmer Persona**: Ramesh Kumar (`ramesh@farmer.com` / `password123`) — Verified organic farmer in Nashik, Maharashtra.
- **Buyer Persona**: Amit Sharma (`amit@buyer.com` / `password123`) — Wholesale distributor in Delhi.
- **Admin Persona**: Administrator (`admin@agriconnect.com` / `password123`) — Verification and platform governance.

---

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, REST APIs.
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts for dynamic visual charts, React Router.
- **Machine Learning**: 
  - Price Trend Analysis engine & Python analytical script (`backend/ml/ml_predict.py`)
  - Demand Forecasting regression model (`backend/ml/mlService.js`)
  - Crop Suitability classifier based on soil, state, and seasonal climate

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- MongoDB running on `mongodb://127.0.0.1:27017`

### 1. Backend Server
```bash
cd backend
npm install
npm run seed     # Populates database with the exact reference image data
npm start        # Runs on http://localhost:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

Open your browser at **`http://localhost:5173`**.
