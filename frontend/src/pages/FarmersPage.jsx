import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  Phone, 
  Sprout, 
  ShoppingBag, 
  Award,
  ArrowRight,
  Search
} from 'lucide-react';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

export const FarmersPage = () => {
  const { t, isHindi } = useLanguage();
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const data = await api.getDemoProfiles();
        const all = [
          data.farmer,
          ...(data.allFarmers || [])
        ].filter(Boolean);

        // De-duplicate by _id
        const unique = Array.from(new Map(all.map(item => [item._id, item])).values());
        setFarmers(unique);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const defaultFarmers = [
    {
      _id: 'f1',
      name: 'Ramesh Kumar',
      location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad' },
      isVerified: true,
      rating: 4.8,
      reviewCount: 120,
      avatar: '/images/ramesh.jpg',
      bio: isHindi ? 'नासिक के जैविक किसान। लाल टमाटर, प्याज, लहसुन व अंगूर की खेती।' : 'Award-winning organic horticulturist growing Grade-A fresh tomatoes and onions.',
      phone: '+91 98234 11029',
      crops: ['Fresh Tomato', 'Onion', 'Garlic']
    },
    {
      _id: 'f2',
      name: 'Suresh Yadav',
      location: { city: 'Varanasi', state: 'Uttar Pradesh', address: 'Village Shivpur, Harahua Block' },
      isVerified: true,
      rating: 4.7,
      reviewCount: 85,
      avatar: '/images/suresh.jpg',
      bio: isHindi ? 'आगरा आलू, फूलगोभी व शरबती गेहूं के प्रमाणित उत्पादक।' : 'Specialized producer of certified high-starch Agra potatoes and Rabi wheat.',
      phone: '+91 94150 82741',
      crops: ['Potato', 'Cauliflower', 'Wheat']
    },
    {
      _id: 'f3',
      name: 'Sunita Devi',
      location: { city: 'Bhopal', state: 'Madhya Pradesh', address: 'Gram Berasia Road, FPO Krishi Parisar' },
      isVerified: true,
      rating: 4.9,
      reviewCount: 94,
      avatar: '/images/sunita.jpg',
      bio: isHindi ? 'महिला किसान उत्पादक संगठन की अध्यक्षा, जैविक दालें और हापुस आम।' : 'Leading a women-led organic farming cooperative for pulses and Alphonso mangoes.',
      phone: '+91 97551 34982',
      crops: ['Mango', 'Arhar Dal', 'Turmeric']
    },
    {
      _id: 'f4',
      name: 'Anil Patel',
      location: { city: 'Anand', state: 'Gujarat', address: 'Survey No. 89, Borsad Chokdi' },
      isVerified: true,
      rating: 4.6,
      reviewCount: 60,
      avatar: '/images/anil.jpg',
      bio: isHindi ? 'ड्रिप सिंचाई से जीरा, मूंगफली और संकर कपास की आधुनिक खेती।' : 'Drip irrigation innovator for cumin (jeera), groundnut, and long-staple cotton.',
      phone: '+91 99252 64819',
      crops: ['Cumin', 'Groundnut', 'Cotton']
    }
  ];

  const list = farmers.length > 0 ? farmers : defaultFarmers;

  const filtered = list.filter(f => 
    f.name?.toLowerCase().includes(search.toLowerCase()) ||
    f.location?.city?.toLowerCase().includes(search.toLowerCase()) ||
    f.location?.state?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? '100% सरकारी व आधार सत्यापित किसान नेटवर्क' : '100% KYC & Land-Record Verified Farmers'}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {isHindi ? 'हमारे पंजीकृत किसान उत्पादक' : 'Our Verified Farmers Network'}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {isHindi ? 'सीधे किसान से जुड़ें, उनकी खेत उपज देखें और निष्पक्ष व्यापार करें।' : 'Connect directly with certified farmers across Indian agricultural belts with zero intermediaries.'}
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isHindi ? 'किसान का नाम या शहर खोजें...' : 'Search farmer or city...'}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>
        </div>

        {/* Farmers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((farmer) => (
            <div
              key={farmer._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={farmer.avatar || '/images/ramesh.jpg'}
                    alt={farmer.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-base">{farmer.name}</h3>
                    <div className="flex items-center text-emerald-700 text-xs font-semibold mt-0.5">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      <span>{t('verifiedFarmer')}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold mt-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{farmer.rating || 4.8}</span>
                      <span className="text-gray-400 font-normal">({farmer.reviewCount || 100})</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3 text-xs text-gray-600 bg-gray-50/80 p-2.5 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium text-gray-800">
                      {farmer.location?.address || `${farmer.location?.city || 'Nashik'}, ${farmer.location?.state || 'Maharashtra'}`}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <a href={`tel:${farmer.phone || '+91 98234 11029'}`} className="font-bold text-blue-700 hover:underline">
                      {farmer.phone || '+91 98234 11029'}
                    </a>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-2 mb-4">
                  {farmer.bio || (isHindi ? 'प्रमाणित टिकाऊ और जैविक खेती के प्रति समर्पित प्रगतिशील किसान।' : 'Dedicated to sustainable chemical-free cultivation and direct supply to wholesale buyers.')}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center space-x-2">
                <a
                  href={`tel:${farmer.phone || '+91 98234 11029'}`}
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                  title="Call Farmer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'कॉल' : 'Call'}</span>
                </a>
                <Link
                  to={`/products?search=${encodeURIComponent(farmer.name)}`}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'फसलें देखें' : 'View Crops'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
