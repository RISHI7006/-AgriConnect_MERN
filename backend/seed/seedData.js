const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Negotiation = require('../models/Negotiation');
const Review = require('../models/Review');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agriconnect';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for re-seeding 26 crops & Indian personas...');

    await User.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Negotiation.deleteMany({});
    await Review.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Authentic Indian Farmers
    const ramesh = await User.create({
      name: 'Ramesh Kumar',
      email: 'ramesh@farmer.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 98234 11029',
      location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' },
      isVerified: true,
      verificationStatus: 'verified',
      verificationDoc: 'Ramesh_Kumar_Kisan_Credit_Card.pdf',
      rating: 4.8,
      reviewCount: 120,
      avatar: '/images/ramesh.jpg',
      bio: 'Award-winning organic horticulturist growing Grade-A fresh tomatoes, onions, garlic and table grapes in fertile Nashik soil.'
    });

    const suresh = await User.create({
      name: 'Suresh Yadav',
      email: 'suresh@farmer.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 94150 82741',
      location: { city: 'Varanasi', state: 'Uttar Pradesh', address: 'Village Shivpur, Harahua Block, Varanasi - 221003' },
      isVerified: true,
      verificationStatus: 'verified',
      verificationDoc: 'Suresh_Yadav_Land_Extract.pdf',
      rating: 4.7,
      reviewCount: 85,
      avatar: '/images/suresh.jpg',
      bio: 'Specialized cultivator of certified high-starch Agra potatoes, cauliflower, and Rabi wheat grains.'
    });

    const sunita = await User.create({
      name: 'Sunita Devi',
      email: 'sunita@farmer.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 97551 34982',
      location: { city: 'Bhopal', state: 'Madhya Pradesh', address: 'Gram Berasia Road, FPO Krishi Parisar, Bhopal - 462038' },
      isVerified: false,
      verificationStatus: 'pending',
      verificationDoc: 'Sunita_Devi_Kisan_ID.pdf',
      rating: 4.9,
      reviewCount: 94,
      avatar: '/images/sunita.jpg',
      bio: 'President of Women Farmers Producer Cooperative growing organic pulses, turmeric, and Alphonso mangoes.'
    });

    const anil = await User.create({
      name: 'Anil Patel',
      email: 'anil@farmer.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 99252 64819',
      location: { city: 'Anand', state: 'Gujarat', address: 'Survey No. 89, Borsad Chokdi, Anand - 388001' },
      isVerified: true,
      verificationStatus: 'verified',
      verificationDoc: 'Anil_Patel_APMC_Card.pdf',
      rating: 4.6,
      reviewCount: 60,
      avatar: '/images/anil.jpg',
      bio: 'Gujarat agricultural innovator utilizing drip irrigation for cumin (jeera), groundnut, and long-staple cotton.'
    });

    const rajesh = await User.create({
      name: 'Rajesh Choudhary',
      email: 'rajesh@farmer.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 94140 55432',
      location: { city: 'Jaipur', state: 'Rajasthan', address: 'Dhani Bassi, Chomu Tehsil, Jaipur - 303702' },
      isVerified: true,
      verificationStatus: 'verified',
      rating: 4.8,
      reviewCount: 72,
      avatar: '/images/rajesh.jpg',
      bio: 'Rajasthan mustard, bajra, and organic pulse producer promoting water-efficient dryland farming.'
    });

    const harpreet = await User.create({
      name: 'Harpreet Singh',
      email: 'harpreet@farmer.com',
      password: hashedPassword,
      role: 'farmer',
      phone: '+91 98141 77654',
      location: { city: 'Ludhiana', state: 'Punjab', address: 'VPO Sahnewal, GT Road, Ludhiana - 141120' },
      isVerified: true,
      verificationStatus: 'verified',
      rating: 4.9,
      reviewCount: 140,
      avatar: '/images/harpreet.jpg',
      bio: 'Certified master farmer harvesting export quality Sharbati wheat, Basmati paddy, and mustard seeds.'
    });

    // 2. Authentic Indian Buyers
    const amit = await User.create({
      name: 'Amit Sharma',
      email: 'amit@buyer.com',
      password: hashedPassword,
      role: 'buyer',
      phone: '+91 98110 54321',
      location: { city: 'Delhi', state: 'Delhi', address: 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033' },
      isVerified: true,
      verificationStatus: 'verified',
      rating: 4.9,
      reviewCount: 42,
      avatar: '/images/amit.jpg',
      bio: 'Wholesale mandi trader sourcing farm-gate fresh produce for Delhi NCR supermarket chains.'
    });

    const karan = await User.create({
      name: 'Karan Mehta',
      email: 'karan@buyer.com',
      password: hashedPassword,
      role: 'buyer',
      phone: '+91 98200 99887',
      location: { city: 'Mumbai', state: 'Maharashtra', address: 'Gala 402, APMC Fruit & Veg Market, Vashi, Navi Mumbai - 400703' },
      isVerified: true,
      avatar: '/images/karan.jpg',
      bio: 'APMC Mumbai registered wholesale distributor supplying hotels, retail chains and restaurants.'
    });

    const priya = await User.create({
      name: 'Priya Verma',
      email: 'priya@buyer.com',
      password: hashedPassword,
      role: 'buyer',
      phone: '+91 97400 11223',
      location: { city: 'Bangalore', state: 'Karnataka', address: 'Building 12, Yeshwanthpur Agro Logistics Hub, Bangalore - 560022' },
      isVerified: true,
      avatar: '/images/priya.jpg',
      bio: 'Procurement Director for organic retail hypermarkets across Karnataka and South India.'
    });

    const rohit = await User.create({
      name: 'Rohit Singh',
      email: 'rohit@buyer.com',
      password: hashedPassword,
      role: 'buyer',
      phone: '+91 95599 33445',
      location: { city: 'Lucknow', state: 'Uttar Pradesh', address: 'Shed 8, Naveen Galla Mandi, Sitapur Road, Lucknow - 226020' },
      isVerified: true,
      avatar: '/images/rohit.jpg',
      bio: 'Agro-processing miller sourcing raw pulses, wheat grains and oilseeds directly from regional farmers.'
    });

    // Admin
    const admin = await User.create({
      name: 'Administrator',
      email: 'admin@agriconnect.com',
      password: hashedPassword,
      role: 'admin',
      phone: '+91 99999 88888',
      location: { city: 'New Delhi', state: 'Delhi', address: 'Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001' },
      isVerified: true,
      verificationStatus: 'verified',
      avatar: '/images/admin.jpg',
      bio: 'AgriConnect National Platform Governance & Kisan Verification Officer'
    });

    // 3. 26 Diverse Indian Crops
    const productsData = [
      {
        title: 'Fresh Tomato',
        category: 'Vegetables',
        pricePerKg: 18,
        quantityAvailable: 300,
        unit: 'kg',
        location: { city: 'Nashik', state: 'Maharashtra' },
        farmer: ramesh._id,
        harvestDate: '16 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&auto=format&fit=crop&q=80'],
        description: 'Vibrant, sun-ripened red tomatoes picked early morning from fertile Nashik soils. Exceptional firmness and rich flavor.',
        organic: true,
        inStock: true
      },
      {
        title: 'Organic Basmati Rice',
        category: 'Grains',
        pricePerKg: 28,
        quantityAvailable: 500,
        unit: 'kg',
        location: { city: 'Guwahati', state: 'Assam' },
        farmer: harpreet._id,
        harvestDate: '14 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400&auto=format&fit=crop&q=80'],
        description: 'Naturally cultivated aromatic Joha & Jasmine organic rice. Completely chemical-free and packaged in eco-friendly burlap sacks.',
        organic: true,
        inStock: true
      },
      {
        title: 'Potato',
        category: 'Vegetables',
        pricePerKg: 22,
        quantityAvailable: 1000,
        unit: 'kg',
        location: { city: 'Agra', state: 'Uttar Pradesh' },
        farmer: suresh._id,
        harvestDate: '15 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&auto=format&fit=crop&q=80'],
        description: 'Firm and uniform fresh harvest potatoes with thin skins, ideal for domestic cooking or culinary processing.',
        organic: false,
        inStock: true
      },
      {
        title: 'Onion',
        category: 'Vegetables',
        pricePerKg: 20,
        quantityAvailable: 300,
        unit: 'kg',
        location: { city: 'Indore', state: 'Madhya Pradesh' },
        farmer: ramesh._id,
        harvestDate: '12 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1508747703725-719777637510?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400&auto=format&fit=crop&q=80'],
        description: 'Medium-to-large pungent pink onions dried and cured for prolonged shelf life and robust cooking flavor.',
        organic: true,
        inStock: true
      },
      {
        title: 'Green Chilli',
        category: 'Vegetables',
        pricePerKg: 32,
        quantityAvailable: 200,
        unit: 'kg',
        location: { city: 'Karnal', state: 'Haryana' },
        farmer: ramesh._id,
        harvestDate: '16 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=800&auto=format&fit=crop&q=80'],
        description: 'Crisp, spicy, fresh-picked green chillies with vivid green skin and maximum punch for commercial kitchens.',
        organic: false,
        inStock: true
      },
      {
        title: 'Mango (Alphonso)',
        category: 'Fruits',
        pricePerKg: 60,
        quantityAvailable: 400,
        unit: 'kg',
        location: { city: 'Ratnagiri', state: 'Maharashtra' },
        farmer: sunita._id,
        harvestDate: '10 Oct 2026',
        quality: 'Export Quality',
        images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop&q=80'],
        description: 'Authentic GI-tagged Ratnagiri Alphonso mangoes, handpicked with rich sweetness and sublime aroma.',
        organic: true,
        inStock: true
      },
      {
        title: 'Organic Soybeans',
        category: 'Oilseeds',
        pricePerKg: 44,
        quantityAvailable: 600,
        unit: 'kg',
        location: { city: 'Latur', state: 'Maharashtra' },
        farmer: ramesh._id,
        harvestDate: '15 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80'],
        description: 'High-protein non-GMO golden soybeans suited for soy milk, tofu, or seed grain processing.',
        organic: true,
        inStock: true
      },
      {
        title: 'Sharbati Wheat',
        category: 'Grains',
        pricePerKg: 26,
        quantityAvailable: 1200,
        unit: 'kg',
        location: { city: 'Sehore', state: 'Madhya Pradesh' },
        farmer: suresh._id,
        harvestDate: '08 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'],
        description: 'Golden Sharbati wheat grains from fertile black soil, celebrated for soft rotis.',
        organic: true,
        inStock: true
      },
      {
        title: 'Arhar Dal (Toor Pulse)',
        category: 'Pulses',
        pricePerKg: 110,
        quantityAvailable: 350,
        unit: 'kg',
        location: { city: 'Akola', state: 'Maharashtra' },
        farmer: sunita._id,
        harvestDate: '05 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'],
        description: 'Unpolished traditional yellow pigeon pea pulse with superior protein content and fast cooking characteristics.',
        organic: true,
        inStock: true
      },
      {
        title: 'Mustard Seeds (Sarson)',
        category: 'Oilseeds',
        pricePerKg: 65,
        quantityAvailable: 450,
        unit: 'kg',
        location: { city: 'Bharatpur', state: 'Rajasthan' },
        farmer: rajesh._id,
        harvestDate: '11 Oct 2026',
        quality: 'Grade A',
        images: ['https://www.outsidepride.com/images/products/detail/herbseed/blackmustard1.jpg'],
        description: 'Bold yellow and black mustard seeds with high pungent oil content for culinary cold-pressing.',
        organic: true,
        inStock: true
      },
      {
        title: 'Green Cardamom (Elaichi)',
        category: 'Spices',
        pricePerKg: 1450,
        quantityAvailable: 60,
        unit: 'kg',
        location: { city: 'Idukki', state: 'Kerala' },
        farmer: anil._id,
        harvestDate: '01 Oct 2026',
        quality: 'Export Quality',
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'],
        description: '8mm bold green cardamom pods with intense aroma and high essential oil content.',
        organic: true,
        inStock: true
      },
      {
        title: 'Malabar Black Pepper',
        category: 'Spices',
        pricePerKg: 520,
        quantityAvailable: 90,
        unit: 'kg',
        location: { city: 'Wayanad', state: 'Kerala' },
        farmer: anil._id,
        harvestDate: '03 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=800&auto=format&fit=crop&q=80'],
        description: 'Sun-dried high piperine tellicherry bold black peppercorns directly from Kerala hill estates.',
        organic: true,
        inStock: true
      },
      {
        title: 'Saurashtra Groundnut (Moongfali)',
        category: 'Oilseeds',
        pricePerKg: 72,
        quantityAvailable: 800,
        unit: 'kg',
        location: { city: 'Junagadh', state: 'Gujarat' },
        farmer: anil._id,
        harvestDate: '12 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1567306301408-9b74779a11af?w=800&auto=format&fit=crop&q=80'],
        description: 'Rich oil-bearing double seeded groundnuts cured under natural coastal sun.',
        organic: true,
        inStock: true
      },
      {
        title: 'Desi Chickpeas (Kala Chana)',
        category: 'Pulses',
        pricePerKg: 62,
        quantityAvailable: 700,
        unit: 'kg',
        location: { city: 'Ujjain', state: 'Madhya Pradesh' },
        farmer: suresh._id,
        harvestDate: '07 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'],
        description: 'Traditional desi brown chickpeas, rich in iron, dietary fiber, and natural protein.',
        organic: true,
        inStock: true
      },
      {
        title: 'Organic Green Gram (Moong Dal)',
        category: 'Pulses',
        pricePerKg: 96,
        quantityAvailable: 400,
        unit: 'kg',
        location: { city: 'Bikaner', state: 'Rajasthan' },
        farmer: rajesh._id,
        harvestDate: '09 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'],
        description: 'Unpolished whole green gram moong, easy to sprout and nutritious for institutional buyers.',
        organic: true,
        inStock: true
      },
      {
        title: 'Black Gram (Urad Dal)',
        category: 'Pulses',
        pricePerKg: 104,
        quantityAvailable: 350,
        unit: 'kg',
        location: { city: 'Guntur', state: 'Andhra Pradesh' },
        farmer: sunita._id,
        harvestDate: '06 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=800&auto=format&fit=crop&q=80'],
        description: 'Premium whole black matpe urad dal with high dough elasticity for papad and culinary recipes.',
        organic: true,
        inStock: true
      },
      {
        title: 'Pearl Millet (Desi Bajra)',
        category: 'Grains',
        pricePerKg: 24,
        quantityAvailable: 1100,
        unit: 'kg',
        location: { city: 'Nagaur', state: 'Rajasthan' },
        farmer: rajesh._id,
        harvestDate: '13 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80'],
        description: 'Drought-resistant nutritious pearl millet grain packed with iron, zinc, and healthy dietary fiber.',
        organic: true,
        inStock: true
      },
      {
        title: 'Maldandi Jowar (Sorghum)',
        category: 'Grains',
        pricePerKg: 34,
        quantityAvailable: 950,
        unit: 'kg',
        location: { city: 'Solapur', state: 'Maharashtra' },
        farmer: ramesh._id,
        harvestDate: '15 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'],
        description: 'Sweet and soft white Maldandi jowar grains grown in deep Deccan black soils.',
        organic: true,
        inStock: true
      },
      {
        title: 'Fresh Ooty Garlic (Lahsun)',
        category: 'Vegetables',
        pricePerKg: 140,
        quantityAvailable: 280,
        unit: 'kg',
        location: { city: 'Mandsaur', state: 'Madhya Pradesh' },
        farmer: ramesh._id,
        harvestDate: '17 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=800&auto=format&fit=crop&q=80'],
        description: 'Large bulb snow-white garlic cloves with strong medicinal pungency and prolonged cellar shelf life.',
        organic: true,
        inStock: true
      },
      {
        title: 'Organic Hill Ginger (Adrak)',
        category: 'Vegetables',
        pricePerKg: 85,
        quantityAvailable: 320,
        unit: 'kg',
        location: { city: 'Shimoga', state: 'Karnataka' },
        farmer: anil._id,
        harvestDate: '16 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'],
        description: 'Fibrous and zesty fresh ginger rhizomes harvested from organic red loamy soils.',
        organic: true,
        inStock: true
      },
      {
        title: 'Fresh Snowball Cauliflower',
        category: 'Vegetables',
        pricePerKg: 26,
        quantityAvailable: 400,
        unit: 'kg',
        location: { city: 'Varanasi', state: 'Uttar Pradesh' },
        farmer: suresh._id,
        harvestDate: '18 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=800&auto=format&fit=crop&q=80'],
        description: 'Compact curd snowy-white cauliflowers packed in ventilated cartons for wholesale markets.',
        organic: false,
        inStock: true
      },
      {
        title: 'Shankar-6 Long Staple Cotton',
        category: 'Oilseeds',
        pricePerKg: 78,
        quantityAvailable: 1500,
        unit: 'kg',
        location: { city: 'Rajkot', state: 'Gujarat' },
        farmer: anil._id,
        harvestDate: '10 Oct 2026',
        quality: 'Export Quality',
        images: ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80'],
        description: 'Certified 29mm staple length Shankar-6 clean lint cotton with high tensile strength for textile mills.',
        organic: false,
        inStock: true
      },
      {
        title: 'High Brix e (Ganna)',
        category: 'Grains',
        pricePerKg: 3.5,
        quantityAvailable: 10000,
        unit: 'kg',
        location: { city: 'Muzaffarnagar', state: 'Uttar Pradesh' },
        farmer: suresh._id,
        harvestDate: '16 Oct 2026',
        quality: 'Grade A',
        images: ['https://www.agrifarming.in/wp-content/uploads/Sugarcane-Cultivation-in-Tamil-Nadu-5.jpg'],
        description: 'Co-0238 high sucrose content sugarcane stalks fresh-cut for sugar processing plants and juice markets.',
        organic: false,
        inStock: true
      },
      {
        title: 'Salem Finger Turmeric (Haldi)',
        category: 'Spices',
        pricePerKg: 165,
        quantityAvailable: 500,
        unit: 'kg',
        location: { city: 'Nanded', state: 'Maharashtra' },
        farmer: sunita._id,
        harvestDate: '04 Oct 2026',
        quality: 'Export Quality',
        images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'],
        description: 'High curcumin (5.2%) double polished golden yellow turmeric fingers with intense color and aroma.',
        organic: true,
        inStock: true
      },
      {
        title: 'Unjha Royal Cumin (Jeera)',
        category: 'Spices',
        pricePerKg: 290,
        quantityAvailable: 350,
        unit: 'kg',
        location: { city: 'Patan', state: 'Gujarat' },
        farmer: anil._id,
        harvestDate: '08 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80'],
        description: 'Machine-cleaned bold cumin seeds from Unjha Mandi, 99% pure with rich essential oils.',
        organic: true,
        inStock: true
      },
      {
        title: 'Kashmiri Royal Delicious Apple',
        category: 'Fruits',
        pricePerKg: 95,
        quantityAvailable: 850,
        unit: 'kg',
        location: { city: 'Sopore', state: 'Jammu & Kashmir' },
        farmer: harpreet._id,
        harvestDate: '12 Oct 2026',
        quality: 'Grade A',
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80'],
        description: 'Crisp, sweet, deep red Kashmiri apples harvested at peak maturity and packed in wooden crates.',
        organic: true,
        inStock: true
      }
    ];

    const createdProducts = await Product.insertMany(productsData);
    console.log(`Created ${createdProducts.length} diverse Indian products.`);

    const tomato = createdProducts.find(p => p.title === 'Fresh Tomato');
    const onion = createdProducts.find(p => p.title === 'Onion');
    const rice = createdProducts.find(p => p.title.includes('Rice'));
    const potato = createdProducts.find(p => p.title === 'Potato');
    const mango = createdProducts.find(p => p.title.includes('Mango'));

    // 4. Reviews with authentic Indian feedback
    await Review.create([
      {
        farmer: ramesh._id,
        product: tomato._id,
        buyer: amit._id,
        buyerName: 'Amit Sharma',
        rating: 5,
        comment: 'Good quality tomatoes, Delivered on time.',
        dateString: '12 Oct 2026'
      },
      {
        farmer: ramesh._id,
        product: tomato._id,
        buyer: karan._id,
        buyerName: 'Karan Mehta',
        rating: 4.8,
        comment: 'Very fresh batch, great firmness and accurate weight. Will reorder weekly.',
        dateString: '09 Oct 2026'
      },
      {
        farmer: suresh._id,
        product: potato._id,
        buyer: rohit._id,
        buyerName: 'Rohit Singh',
        rating: 4.7,
        comment: 'Uniform size and clean harvest. Directly verified from farm gate.',
        dateString: '11 Oct 2026'
      }
    ]);

    // 5. Orders matching UI
    await Order.create([
      {
        buyer: amit._id,
        farmer: ramesh._id,
        product: tomato._id,
        productTitle: 'Fresh Tomato',
        productImage: tomato.images[0],
        quantity: 100,
        unit: 'kg',
        pricePerKg: 18,
        totalPrice: 1800,
        status: 'Delivered',
        trackingSteps: [
          { title: 'Order Placed & Escrow Secured', time: '11 Oct 2026, 09:30 AM', completed: true },
          { title: 'Harvested & Sorted', time: '11 Oct 2026, 03:00 PM', completed: true },
          { title: 'In Transit', time: '12 Oct 2026, 06:00 AM', completed: true },
          { title: 'Delivered', time: '12 Oct 2026, 02:15 PM', completed: true }
        ]
      },
      {
        buyer: karan._id,
        farmer: ramesh._id,
        product: onion._id,
        productTitle: 'Onion',
        productImage: onion.images[0],
        quantity: 200,
        unit: 'kg',
        pricePerKg: 20,
        totalPrice: 4000,
        status: 'In Transit',
        trackingSteps: [
          { title: 'Order Placed', time: '18 Oct 2026, 11:00 AM', completed: true },
          { title: 'Harvest Confirmed', time: '18 Oct 2026, 04:30 PM', completed: true },
          { title: 'Dispatched from Nashik Hub', time: '19 Oct 2026, 05:00 AM', completed: true },
          { title: 'Delivered', time: 'Estimated 20 Oct 2026', completed: false }
        ]
      },
      {
        buyer: priya._id,
        farmer: ramesh._id,
        product: rice._id,
        productTitle: 'Rice',
        productImage: rice.images[0],
        quantity: 500,
        unit: 'kg',
        pricePerKg: 28,
        totalPrice: 14000,
        status: 'Pending',
        trackingSteps: [
          { title: 'Order Placed', time: '19 Oct 2026, 02:40 PM', completed: true },
          { title: 'Farmer Confirmation', time: 'Awaiting farmer pickup', completed: false },
          { title: 'In Transit', time: 'Pending', completed: false },
          { title: 'Delivered', time: 'Pending', completed: false }
        ]
      },
      {
        buyer: rohit._id,
        farmer: ramesh._id,
        product: potato._id,
        productTitle: 'Potato',
        productImage: potato.images[0],
        quantity: 300,
        unit: 'kg',
        pricePerKg: 22,
        totalPrice: 6600,
        status: 'Delivered',
        trackingSteps: [
          { title: 'Order Placed', time: '14 Oct 2026', completed: true },
          { title: 'Packed & Loaded', time: '15 Oct 2026', completed: true },
          { title: 'In Transit', time: '15 Oct 2026', completed: true },
          { title: 'Delivered', time: '16 Oct 2026', completed: true }
        ]
      },
      {
        buyer: amit._id,
        farmer: suresh._id,
        product: onion._id,
        productTitle: 'Onion',
        productImage: onion.images[0],
        quantity: 200,
        unit: 'kg',
        pricePerKg: 20,
        totalPrice: 4000,
        status: 'Delivered',
        trackingSteps: [
          { title: 'Order Placed', time: '10 Oct 2026', completed: true },
          { title: 'Delivered', time: '12 Oct 2026', completed: true }
        ]
      },
      {
        buyer: amit._id,
        farmer: anil._id,
        product: rice._id,
        productTitle: 'Rice',
        productImage: rice.images[0],
        quantity: 500,
        unit: 'kg',
        pricePerKg: 28,
        totalPrice: 14000,
        status: 'Pending',
        trackingSteps: [
          { title: 'Order Placed', time: '19 Oct 2026', completed: true },
          { title: 'Pending Approval', time: 'Pending', completed: false }
        ]
      },
      {
        buyer: amit._id,
        farmer: sunita._id,
        product: mango._id,
        productTitle: 'Mango',
        productImage: mango.images[0],
        quantity: 100,
        unit: 'kg',
        pricePerKg: 60,
        totalPrice: 6000,
        status: 'Delivered',
        trackingSteps: [
          { title: 'Order Placed', time: '08 Oct 2026', completed: true },
          { title: 'Delivered', time: '10 Oct 2026', completed: true }
        ]
      }
    ]);

    // 6. Negotiations
    await Negotiation.create([
      {
        product: tomato._id,
        buyer: amit._id,
        farmer: ramesh._id,
        productTitle: 'Fresh Tomato',
        productImage: tomato.images[0],
        quantity: 150,
        originalPricePerKg: 18,
        offeredPricePerKg: 16,
        counterPricePerKg: 17,
        status: 'Countered',
        messages: [
          {
            senderId: amit._id,
            senderName: 'Amit Sharma',
            senderRole: 'buyer',
            text: 'We are buying 150 kg for our restaurant chain. Can you offer ₹16/kg?',
            proposedPrice: 16
          },
          {
            senderId: ramesh._id,
            senderName: 'Ramesh Kumar',
            senderRole: 'farmer',
            text: 'I can do ₹17/kg for Grade A organic harvest packed in crates.',
            proposedPrice: 17
          }
        ]
      }
    ]);

    console.log('Seeded successfully with 26 Indian crops, verified Indian farmers and buyers!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
