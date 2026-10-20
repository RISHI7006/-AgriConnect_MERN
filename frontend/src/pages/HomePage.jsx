import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ShoppingBag, 
  MapPin, 
  DollarSign, 
  Sprout,
  Users
} from 'lucide-react';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const HomePage = () => {
  const { t, isHindi } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await api.getProducts({ inStock: 'true' });
        setProducts(data.slice(0, 8));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const categories = [
    {
      name: isHindi ? 'अनाज व दलहन' : 'Grains',
      param: 'Grains',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&auto=format&fit=crop&q=80',
      items: isHindi ? 'गेहूं, बासमती चावल, बाजरा, ज्वार' : 'Wheat, Rice, Bajra, Jowar'
    },
    {
      name: isHindi ? 'ताज़ा सब्जियां' : 'Vegetables',
      param: 'Vegetables',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&auto=format&fit=crop&q=80',
      items: isHindi ? 'टमाटर, प्याज, आलू, हरी मिर्च' : 'Tomato, Potato, Onion, Garlic'
    },
    {
      name: isHindi ? 'ताज़ा फल' : 'Fruits',
      param: 'Fruits',
      image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=400&auto=format&fit=crop&q=80',
      items: isHindi ? 'हापुस आम, कश्मीरी सेब' : 'Alphonso Mango, Apple'
    },
    {
      name: isHindi ? 'दालें' : 'Pulses',
      param: 'Pulses',
      image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&auto=format&fit=crop&q=80',
      items: isHindi ? 'तुअर दाल, चना, मूंग दाल, उड़द' : 'Toor Dal, Chana, Moong, Urad'
    },
    {
      name: isHindi ? 'तिलहन' : 'Oilseeds',
      param: 'Oilseeds',
      image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80',
      items: isHindi ? 'सोयाबीन, सरसों, मूंगफली' : 'Soybean, Mustard, Groundnut'
    },
    {
      name: isHindi ? 'मसाले' : 'Spices',
      param: 'Spices',
      image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&auto=format&fit=crop&q=80',
      items: isHindi ? 'इलायची, काली मिर्च, हल्दी, जीरा' : 'Cardamom, Pepper, Turmeric, Cumin'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAF9]">
      
      {/* Hero Section matching reference screenshot 1 */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/60 via-white to-transparent pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold tracking-wide">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'भारत के 25,000+ सत्यापित किसान सीधे जुड़े हैं' : 'Empowering 25,000+ Indian Cultivators Directly'}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.12]">
                {isHindi ? (
                  <>किसानों से खरीदारों का <br /><span className="text-emerald-700">सीधा व्यापार मंच</span></>
                ) : (
                  <>Directly Connecting <br /><span className="text-emerald-700">Farmers to Buyers</span></>
                )}
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl font-normal leading-relaxed">
                {t('heroSub')}
              </p>

              {/* Search Bar matching image */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl">
                <div className="flex items-center bg-white rounded-2xl shadow-lg shadow-emerald-900/5 border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-transparent transition-all">
                  <div className="pl-3 text-gray-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm flex items-center space-x-1"
                  >
                    <span>{t('searchBtn')}</span>
                  </button>
                </div>
              </form>

              {/* Quick pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 pt-1">
                <span className="font-semibold text-gray-700">{t('popularSearches')}:</span>
                {['Tomato', 'Basmati Rice', 'Potato', 'Onion', 'Garlic', 'Turmeric', 'Cumin', 'Wheat'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => navigate(`/products?search=${encodeURIComponent(tag)}`)}
                    className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 transition-colors font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>

            </div>

            {/* Right Hero Image matching screenshot (Smiling Indian farmer holding green wheat in farm) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="/images/hero-farmer.jpg"
                    alt="Indian Farmer in field"
                    className="w-full h-[420px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                    <div className="text-white">
                      <p className="text-xs font-bold text-emerald-300">
                        {isHindi ? 'सत्यापित प्रगतिशील किसान' : 'Verified Progressive Farmer'}
                      </p>
                      <h4 className="text-lg font-bold">Ramesh Kumar — Nashik, Maharashtra</h4>
                      <p className="text-xs text-gray-200 mt-0.5">
                        {isHindi ? '100% खेत से सीधा ताज़ा माल • एस्क्रो सुरक्षित' : '100% Direct Farm-Gate Supply • Escrow Protected'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 border border-gray-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">+35% {isHindi ? 'किसान आय में वृद्धि' : 'Farmer Net Earnings'}</div>
                    <div className="text-[11px] text-gray-500">{isHindi ? 'बिचौलिया कमीशन समाप्त' : 'Zero Middleman Commission'}</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* 4 Feature Cards directly below hero matching Screenshot 1 */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 agri-card-hover">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{t('feat1Title')}</h4>
                <p className="text-xs text-gray-500">{t('feat1Sub')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 agri-card-hover">
              <div className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{t('feat2Title')}</h4>
                <p className="text-xs text-gray-500">{t('feat2Sub')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 agri-card-hover">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center flex-shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{t('feat3Title')}</h4>
                <p className="text-xs text-gray-500">{t('feat3Sub')}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 agri-card-hover">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{t('feat4Title')}</h4>
                <p className="text-xs text-gray-500">{t('feat4Sub')}</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Browse by Category matching Screenshot 1 */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('catBrowse')}</h2>
              <p className="text-xs text-gray-500 mt-1">
                {isHindi ? '26+ प्रमुख भारतीय फसलों को खेत से सीधा थोक भाव में खरीदें' : 'Explore all harvested produce straight from verified agricultural belts'}
              </p>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
            >
              <span>{t('catViewAll')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.param}
                to={`/products?category=${cat.param}`}
                className="group bg-[#F8FAF9] rounded-2xl p-3 border border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all duration-200 text-center flex flex-col items-center"
              >
                <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 bg-gray-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xs font-bold text-gray-800 group-hover:text-emerald-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{cat.items}</p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Featured Farm Produce Grid (8 of 26 crops) */}
      <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{t('freshProductsTitle')}</h2>
            <p className="text-xs text-gray-500 mt-1">
              {isHindi ? '26 फसलों की ताज़ा आवक, सीधे खेत से' : 'Directly listed by verified Indian farmers with active stock'}
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
          >
            <span>{isHindi ? 'सभी 26 फसलें देखें' : 'Explore All 26 Crops'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="h-72 rounded-2xl bg-gray-200 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* Smart ML Agricultural Intelligence Banner */}
      <section className="pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0d4a2b] via-[#15803d] to-[#04331b] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHindi ? 'राष्ट्रीय कृषि बाज़ार व सटीक मंडी भाव प्रणाली' : 'National Agricultural Mandi Intelligence'}</span>
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight">
              {isHindi ? 'मंडी भाव रुझान, 3 महीने का थोक मांग पूर्वानुमान और मिट्टी अनुसार फसल सलाह' : 'Make Informed Trade Decisions with Mandi Price Trends & Crop Suitability'}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              {isHindi ? 'ऐतिहासिक मंडी भावों का विश्लेषण करें, अगले 3 माह की मांग का पूर्वानुमान देखें और अपनी मिट्टी तथा मौसम के अनुसार सबसे अधिक लाभदायक फसल का चुनाव करें।' : 'Analyze historical APMC price trends, predict wholesale mandi demand 3 months in advance, and discover the highest yield crops for your soil and season.'}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                to="/price-trends"
                className="px-5 py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-colors shadow"
              >
                {t('priceTrendTitle')}
              </Link>
              <Link
                to="/demand-prediction"
                className="px-5 py-2.5 rounded-xl bg-emerald-900/60 text-white border border-emerald-400/30 font-bold text-xs hover:bg-emerald-900 transition-colors"
              >
                {t('demandTitle')}
              </Link>
              <Link
                to="/crop-recommendation"
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white font-bold text-xs hover:bg-emerald-600 transition-colors shadow"
              >
                {t('cropRecTitle')}
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
