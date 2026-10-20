import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

export const translations = {
  en: {
    // Brand
    brandName: 'AgriConnect',
    tagline: 'Directly Connecting Farmers to Buyers',
    heroSub: 'A smart marketplace for fresh, quality produce. Better prices for farmers, reliable supply for buyers.',
    searchPlaceholder: 'Search for crops, categories or location...',
    searchBtn: 'Search',
    popularSearches: 'Popular Searches',

    // Nav
    navHome: 'Home',
    navProducts: 'Products',
    navFarmers: 'Farmers',
    navPriceTrends: 'Mandi Rates & Trends',
    navDemand: 'Market Demand Forecast',
    navCropAdvice: 'Crop Advisory',
    navAbout: 'About',
    navLogin: 'Login',
    navRegister: 'Register',
    navLogout: 'Logout',
    navCart: 'Cart',
    switchRole: 'Switch Role',
    langToggle: 'हिन्दी',

    // Features
    feat1Title: 'Direct Trade',
    feat1Sub: 'No intermediaries',
    feat2Title: 'Fair Prices',
    feat2Sub: 'Better earnings',
    feat3Title: 'Fresh Produce',
    feat3Sub: 'Farm to table',
    feat4Title: 'Trusted Community',
    feat4Sub: 'Verified farmers & buyers',

    // Categories
    catBrowse: 'Browse by Category',
    catViewAll: 'View All',
    catGrains: 'Grains',
    catVegetables: 'Vegetables',
    catFruits: 'Fruits',
    catPulses: 'Pulses',
    catOilseeds: 'Oilseeds',
    catSpices: 'Spices',

    // Marketplace
    filters: 'Filters',
    priceRange: 'Price Range',
    location: 'Location',
    availability: 'Availability',
    inStock: 'In Stock',
    nearMe: 'Near Me (Within 100 km)',
    applyFilters: 'Apply Filters',
    reset: 'Reset',
    freshProductsTitle: 'Fresh Products from Farmers',
    productsFound: 'products found',
    sortBy: 'Sort by',
    sortLatest: 'Latest',
    sortPriceLow: 'Price: Low to High',
    sortPriceHigh: 'Price: High to Low',
    sortQty: 'Largest Quantity',
    viewDetails: 'View Details',
    addToCart: 'Add to Cart',
    negotiatePrice: 'Negotiate Price',
    verifiedFarmer: 'Verified Farmer',
    available: 'available',

    // Product Detail
    harvestDate: 'Harvest Date',
    category: 'Category',
    quality: 'Quality',
    quantity: 'Quantity',
    totalPrice: 'Total Price',
    aboutFarmer: 'About Farmer',
    reviews: 'Reviews',
    allReviews: 'View All Reviews',

    // Negotiation Modal
    negTitle: 'Direct Price Negotiation',
    negOfferedPrice: 'Your Offered Price (₹/kg)',
    negQuantity: 'Quantity (kg)',
    negMessage: 'Message to Farmer',
    negSend: 'Send Offer to Farmer',
    negStandardPrice: 'Standard Catalog Price',
    negProposedTotal: 'Your Proposed Total',
    negProjectedSavings: 'Projected Savings',

    // Order Tracking
    trackTitle: 'Direct Farm Order Tracking',
    orderId: 'Order ID',
    escrowSecured: 'Escrow Protected',
    closeTracking: 'Close Tracking',

    // Dashboards
    farmerDash: 'Farmer Dashboard',
    buyerDash: 'Buyer Dashboard',
    adminDash: 'Admin Dashboard',
    addNewProduct: '+ Add New Product',
    activeProducts: 'Active Products',
    totalOrders: 'Total Orders',
    totalEarnings: 'Total Earnings',
    rating: 'Rating',
    recentOrders: 'Recent Orders',
    ongoingOrders: 'Ongoing Orders',
    completedOrders: 'Completed Orders',
    savedProducts: 'Saved Products',
    myOrders: 'My Orders',
    buyerCol: 'Buyer',
    productCol: 'Product',
    quantityCol: 'Quantity',
    statusCol: 'Status',
    actionCol: 'Action',
    pendingVerifications: 'Pending Verifications',
    verifyBtn: 'Verify',
    rejectBtn: 'Reject',
    dispatchBtn: 'Dispatch',
    markDeliveredBtn: 'Mark Delivered',
    trackBtn: 'Track',
    viewBtn: 'View',

    // Agri Analytics
    priceTrendTitle: 'APMC Mandi Rates & Price Trends',
    selectCrop: 'Select Crop',
    timePeriod: 'Time Period',
    currentPrice: 'Current Price',
    highestPrice: 'Highest Price',
    lowestPrice: 'Lowest Price',
    fromLastMonth: 'from last month',
    demandTitle: 'Wholesale Market Demand Forecast',
    selectRegion: 'Select Region',
    predictedDemand: 'Projected Procurement Volume (Metric Tons)',
    insights: 'Market Insights',
    recommendationLabel: 'Expert Recommendation',
    cropRecTitle: 'Soil & Climate Crop Advisory',
    selectState: 'Select Your State',
    soilType: 'Soil Type',
    season: 'Season',
    getRecommendation: 'Get Recommendation',
    recommendedCrops: 'Recommended Crops',
    suitability: 'Suitability'
  },
  hi: {
    // Brand
    brandName: 'एग्रीकनेक्ट',
    tagline: 'किसानों और खरीदारों का सीधा बाज़ार',
    heroSub: 'ताज़ा और गुणवत्तापूर्ण कृषि उपज का डिजिटल प्लेटफॉर्म। किसान को मिले सही भाव, खरीदार को मिले सीधा ताज़ा माल।',
    searchPlaceholder: 'फसल, श्रेणी या मंडी / राज्य खोजें...',
    searchBtn: 'खोजें',
    popularSearches: 'लोकप्रिय फसलें',

    // Nav
    navHome: 'मुख्य पृष्ठ (होम)',
    navProducts: 'फसलें व उत्पाद',
    navFarmers: 'हमारे किसान',
    navPriceTrends: 'मंडी भाव व रुझान',
    navDemand: 'थोक मांग पूर्वानुमान',
    navCropAdvice: 'फसल चयन सलाह',
    navAbout: 'हमारे बारे में',
    navLogin: 'लॉगिन',
    navRegister: 'पंजीकरण',
    navLogout: 'लॉगआउट',
    navCart: 'ऑर्डर कार्ट',
    switchRole: 'रोल बदलें',
    langToggle: 'English',

    // Features
    feat1Title: 'सीधा व्यापार',
    feat1Sub: 'बिचौलियों की कोई कमीशन नहीं',
    feat2Title: 'उचित भाव',
    feat2Sub: 'किसानों की बेहतर कमाई',
    feat3Title: 'ताज़ा फसल',
    feat3Sub: 'खेत से सीधे खरीदार तक',
    feat4Title: 'भरोसेमंद समुदाय',
    feat4Sub: 'सत्यापित किसान और खरीदार',

    // Categories
    catBrowse: 'श्रेणी अनुसार फसलें देखें',
    catViewAll: 'सभी देखें',
    catGrains: 'अनाज व दलहन',
    catVegetables: 'ताज़ा सब्जियां',
    catFruits: 'फल',
    catPulses: 'दालें',
    catOilseeds: 'तिलहन',
    catSpices: 'मसाले व मिर्च',

    // Marketplace
    filters: 'फ़िल्टर (छंटनी)',
    priceRange: 'मूल्य दायरा (₹/किग्रा)',
    location: 'राज्य / स्थान',
    availability: 'उपलब्धता',
    inStock: 'स्टॉक में उपलब्ध',
    nearMe: 'मेरे निकट (100 किमी के दायरे में)',
    applyFilters: 'फ़िल्टर लागू करें',
    reset: 'रीसेट करें',
    freshProductsTitle: 'किसानों द्वारा सीधे सूचीबद्ध ताज़ा उत्पाद',
    productsFound: 'फसलें उपलब्ध हैं',
    sortBy: 'क्रमबद्ध करें',
    sortLatest: 'नवीनतम',
    sortPriceLow: 'कीमत: कम से अधिक',
    sortPriceHigh: 'कीमत: अधिक से कम',
    sortQty: 'अधिकतम मात्रा',
    viewDetails: 'विवरण देखें',
    addToCart: 'कार्ट में जोड़ें',
    negotiatePrice: 'भाव मोलभाव करें',
    verifiedFarmer: 'सत्यापित किसान',
    available: 'उपलब्ध',

    // Product Detail
    harvestDate: 'फसल कटाई तिथि',
    category: 'श्रेणी',
    quality: 'गुणवत्ता ग्रेड',
    quantity: 'मात्रा',
    totalPrice: 'कुल मूल्य',
    aboutFarmer: 'किसान के बारे में',
    reviews: 'समीक्षाएं व रेटिंग',
    allReviews: 'सभी समीक्षाएं देखें',

    // Negotiation Modal
    negTitle: 'सीधा भाव मोलभाव (कीमत प्रस्ताव)',
    negOfferedPrice: 'आपका प्रस्तावित भाव (₹/किग्रा)',
    negQuantity: 'मात्रा (किग्रा)',
    negMessage: 'किसान के लिए संदेश',
    negSend: 'किसान को भाव प्रस्ताव भेजें',
    negStandardPrice: 'मानक सूचीबद्ध मूल्य',
    negProposedTotal: 'आपका प्रस्तावित कुल मूल्य',
    negProjectedSavings: 'अनुमानित बचत',

    // Order Tracking
    trackTitle: 'सीधा खेत ऑर्डर ट्रैकिंग',
    orderId: 'ऑर्डर क्रमांक',
    escrowSecured: 'एस्क्रो सुरक्षित भुगतान',
    closeTracking: 'ट्रैकिंग बंद करें',

    // Dashboards
    farmerDash: 'किसान डैशबोर्ड',
    buyerDash: 'खरीदार डैशबोर्ड',
    adminDash: 'व्यवस्थापक (Admin) डैशबोर्ड',
    addNewProduct: '+ नई फसल जोड़ें',
    activeProducts: 'सक्रिय फसलें',
    totalOrders: 'कुल ऑर्डर',
    totalEarnings: 'कुल आय (कमाई)',
    rating: 'रेटिंग',
    recentOrders: 'हालिया ऑर्डर',
    ongoingOrders: 'चल रहे ऑर्डर',
    completedOrders: 'पूर्ण ऑर्डर',
    savedProducts: 'सहेजे गए उत्पाद',
    myOrders: 'मेरे ऑर्डर',
    buyerCol: 'खरीदार',
    productCol: 'फसल / उत्पाद',
    quantityCol: 'मात्रा',
    statusCol: 'स्थिति',
    actionCol: 'कार्रवाई',
    pendingVerifications: 'लंबित सत्यापन',
    verifyBtn: 'सत्यापित करें',
    rejectBtn: 'अस्वीकार करें',
    dispatchBtn: 'रवाना करें (Dispatch)',
    markDeliveredBtn: 'वितरित चिह्नित करें',
    trackBtn: 'ट्रैक करें',
    viewBtn: 'देखें',

    // Agri Analytics
    priceTrendTitle: 'मंडी भाव व मूल्य रुझान विश्लेषण',
    selectCrop: 'फसल चुनें',
    timePeriod: 'समय अवधि',
    currentPrice: 'वर्तमान भाव',
    highestPrice: 'उच्चतम भाव',
    lowestPrice: 'न्यूनतम भाव',
    fromLastMonth: 'पिछले माह से',
    demandTitle: 'थोक बाज़ार मांग पूर्वानुमान',
    selectRegion: 'क्षेत्र चुनें',
    predictedDemand: 'अनुमानित उठाव व मांग (मीट्रिक टन)',
    insights: 'मुख्य अंतर्दृष्टि (Market Insights)',
    recommendationLabel: 'सलाह व सुझाव',
    cropRecTitle: 'कृषि फसल चयन व मृदा परामर्श',
    selectState: 'अपना राज्य चुनें',
    soilType: 'मिट्टी का प्रकार',
    season: 'मौसम / फसल चक्र',
    getRecommendation: 'फसल सलाह प्राप्त करें',
    recommendedCrops: 'अनुशंसित लाभदायक फसलें',
    suitability: 'अनुकूलता'
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('agriconnect_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('agriconnect_lang', lang);
  }, [lang]);

  const toggleLanguage = () => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t, isHindi: lang === 'hi' }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
