# 🚀 AgriConnect Deployment Guide (डिप्लॉयमेंट गाइड)

AgriConnect एक आधुनिक Fullstack MERN (MongoDB, Express, React + Vite, Node.js) डिजिटल कृषि प्लेटफॉर्म है। इसे आप आसानी से किसी भी फ्री या प्रोडक्शन क्लाउड पर डिप्लॉय कर सकते हैं।

---

## विकल्प 1: Render.com पर 1-सर्विस फुलस्टैक डिप्लॉय (सबसे आसान व अनुशंसित - 100% Free)

Render पर आप पूरे प्रोजेक्ट (Frontend + Backend) को एक ही फ्री Web Service पर चला सकते हैं:

### चरण:
1. **GitHub पर कोड पुश करें**:
   ```bash
   git init
   git add .
   git commit -m "AgriConnect Fullstack Platform ready for production"
   git branch -M main
   git remote add origin https://github.com/<your-username>/agriconnect.git
   git push -u origin main
   ```

2. **MongoDB Atlas (फ्री डेटाबेस)**:
   - [MongoDB Cloud Atlas](https://www.mongodb.com/cloud/atlas) पर मुफ्त अकाउंट बनाएं।
   - एक फ्री M0 क्लस्टर बनाएं।
   - Database User (username & password) बनाएं और Network Access में `0.0.0.0/0` (Allow Anywhere) सेट करें।
   - Connection String कॉपी करें (उदा. `mongodb+srv://user:pass@cluster0.mongodb.net/agriconnect?retryWrites=true&w=majority`).

3. **Render पर New Web Service बनाएं**:
   - [Render.com](https://render.com) पर जाएं और **New Web Service** चुनें।
   - अपनी GitHub रिपॉजिटरी कनेक्ट करें।
   - सेटिंग्स दर्ज करें:
     - **Name**: `agriconnect`
     - **Environment**: `Node`
     - **Build Command**: `npm run render-build`
     - **Start Command**: `npm start`
   - **Environment Variables (Add Environment Variable)**:
     - `NODE_ENV` = `production`
     - `PORT` = `5000`
     - `MONGODB_URI` = *आपकी MongoDB Atlas connection string*
     - `JWT_SECRET` = *कोई भी मजबूत सीक्रेट की (उदा: `agriconnect_prod_jwt_super_key_2026`)*
   - **Create Web Service** पर क्लिक करें। 

4. **डेटाबेस सीडिंग (सैंपल फसलें व भारतीय किसान/खरीदार लोड करना)**:
   - Render डैशबोर्ड में **Shell** टैब पर जाएं और रन करें:
     ```bash
     npm run seed
     ```
   - आपकी लाइव वेबसाइट पर 25+ भारतीय फसलें, रमेश कुमार (किसान), अमित शर्मा (खरीदार), और एडमिन डेटा लोड हो जाएगा!

---

## विकल्प 2: Vercel (Frontend) + Render (Backend)

यदि आप Frontend को Vercel की सुपर-फास्ट CDN पर और Backend को Render/Railway पर अलग-अलग चलाना चाहते हैं:

### Backend (Render):
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Env Vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`

### Frontend (Vercel):
- Root Directory: `frontend`
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_URL` = `https://your-backend-service.onrender.com`

---

## विकल्प 3: Docker & Docker Compose (VPS / Local Server / Cloud Run)

प्रोजेक्ट में पहले से ही प्रोडक्शन-रेडी `Dockerfile` और `docker-compose.yml` शामिल है।

### केवल एक कमांड में रन करें:
```bash
docker compose up --build -d
```
यह स्वचालित रूप से MongoDB और AgriConnect ऐप दोनों कंटेनर बनाकर `http://localhost:5000` पर लाइव कर देगा।

---

## 🔒 सुरक्षा एवं प्रोडक्शन विशेषताएं (Security & Production Features Included)

1. **Helmet HTTP Headers**: सुरक्षित हैडर्स और XSS/Clickjacking सुरक्षा।
2. **Rate Limiting**: ब्रूट-फोर्स और DDoS अटैक से बचाव (15 मिनट में अधिकतम ऑथेंटिकेशन लिमिट)।
3. **NoSQL Injection Sanitization**: रिक्वेस्ट बॉडी और पैरामीटर्स में अनधिकृत `$gt`, `$ne` इनपुट को स्वचालित रूप से निष्प्रभावी करना।
4. **JWT Bearer Auth + Demo Fallback**: बिना रुकावट तेज डेमो टेस्टिंग और प्रोडक्शन टोकन ऑथेंटिकेशन।
5. **Clean Account Isolation**: नए किसान/खरीदार को बिल्कुल स्वच्छ (0 डेटा) प्रोफाइल मिलती है, जबकि डेमो प्रोफाइल्स में समृद्ध डेटा प्री-लोडेड रहता है।
