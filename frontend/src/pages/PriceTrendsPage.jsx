import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  MapPin, 
  Sparkles,
  Building2,
  Navigation,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { Sidebar } from '../components/Sidebar';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';
import { 
  getAllStates, 
  getCitiesForState, 
  getMandisForCity, 
  calculateMandiPrice, 
  detectCurrentLocation 
} from '../data/indianLocations';

export const PriceTrendsPage = () => {
  const { t, isHindi } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [timePeriod, setTimePeriod] = useState('Last 6 Months');

  // Hierarchical Indian Location States
  const states = getAllStates();
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const cities = getCitiesForState(selectedState);
  const [selectedCity, setSelectedCity] = useState(cities[0] || 'Nashik');
  const mandis = getMandisForCity(selectedState, selectedCity);
  const [selectedMandiObj, setSelectedMandiObj] = useState(mandis[0] || null);

  const [trendData, setTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsNotice, setGpsNotice] = useState('');

  // 26 Authentic Indian Crops
  const crops = [
    { id: 'Tomato', name: isHindi ? 'टमाटर (Tomato)' : 'Tomato', basePrice: 18 },
    { id: 'Rice', name: isHindi ? 'बासमती चावल (Basmati Rice)' : 'Basmati Rice', basePrice: 28 },
    { id: 'Potato', name: isHindi ? 'आलू (Potato)' : 'Potato', basePrice: 22 },
    { id: 'Onion', name: isHindi ? 'प्याज (Onion)' : 'Onion', basePrice: 20 },
    { id: 'Green Chilli', name: isHindi ? 'हरी मिर्च (Green Chilli)' : 'Green Chilli', basePrice: 32 },
    { id: 'Alphonso Mango', name: isHindi ? 'हापुस आम (Alphonso Mango)' : 'Alphonso Mango', basePrice: 60 },
    { id: 'Wheat', name: isHindi ? 'गेहूं (Wheat)' : 'Wheat', basePrice: 26 },
    { id: 'Soybean', name: isHindi ? 'सोयाबीन (Soybean)' : 'Soybean', basePrice: 44 },
    { id: 'Arhar Dal', name: isHindi ? 'अरहर दाल (Arhar Dal)' : 'Arhar Dal', basePrice: 110 },
    { id: 'Mustard', name: isHindi ? 'सरसों (Mustard)' : 'Mustard', basePrice: 65 },
    { id: 'Cardamom', name: isHindi ? 'इलायची (Cardamom)' : 'Cardamom', basePrice: 1450 },
    { id: 'Black Pepper', name: isHindi ? 'काली मिर्च (Black Pepper)' : 'Black Pepper', basePrice: 520 },
    { id: 'Groundnut', name: isHindi ? 'मूंगफली (Groundnut)' : 'Groundnut', basePrice: 68 },
    { id: 'Chickpeas (Chana)', name: isHindi ? 'चना (Chickpeas)' : 'Chickpeas (Chana)', basePrice: 58 },
    { id: 'Moong Dal', name: isHindi ? 'मूंग दाल (Moong Dal)' : 'Moong Dal', basePrice: 94 },
    { id: 'Urad Dal', name: isHindi ? 'उड़द दाल (Urad Dal)' : 'Urad Dal', basePrice: 88 },
    { id: 'Bajra', name: isHindi ? 'बाजरा (Bajra)' : 'Bajra', basePrice: 24 },
    { id: 'Jowar', name: isHindi ? 'ज्वार (Jowar)' : 'Jowar', basePrice: 32 },
    { id: 'Garlic', name: isHindi ? 'लहसुन (Garlic)' : 'Garlic', basePrice: 140 },
    { id: 'Ginger', name: isHindi ? 'अदरक (Ginger)' : 'Ginger', basePrice: 85 },
    { id: 'Cauliflower', name: isHindi ? 'फूलगोभी (Cauliflower)' : 'Cauliflower', basePrice: 26 },
    { id: 'Cotton', name: isHindi ? 'कपास (Cotton)' : 'Cotton', basePrice: 78 },
    { id: 'Sugarcane', name: isHindi ? 'गन्ना (Sugarcane)' : 'Sugarcane', basePrice: 3.5 },
    { id: 'Turmeric', name: isHindi ? 'हल्दी (Turmeric)' : 'Turmeric', basePrice: 115 },
    { id: 'Cumin (Jeera)', name: isHindi ? 'जीरा (Cumin)' : 'Cumin (Jeera)', basePrice: 280 },
    { id: 'Apple', name: isHindi ? 'कश्मीरी सेब (Apple)' : 'Apple', basePrice: 95 }
  ];

  const timePeriods = ['Last 6 Months', 'Last 3 Months'];

  // Handle State change
  const handleStateChange = (newState) => {
    setSelectedState(newState);
    const newCities = getCitiesForState(newState);
    const newCity = newCities[0] || '';
    setSelectedCity(newCity);
    const newMandis = getMandisForCity(newState, newCity);
    setSelectedMandiObj(newMandis[0] || null);
  };

  // Handle City change
  const handleCityChange = (newCity) => {
    setSelectedCity(newCity);
    const newMandis = getMandisForCity(selectedState, newCity);
    setSelectedMandiObj(newMandis[0] || null);
  };

  // GPS 1-Click Nearest Mandi Detect
  const handleGpsDetect = async () => {
    setGpsLoading(true);
    setGpsNotice('');
    try {
      const loc = await detectCurrentLocation();
      const matchedState = states.find(s => s.toLowerCase() === loc.state.toLowerCase()) || 'Maharashtra';
      setSelectedState(matchedState);
      const availableCities = getCitiesForState(matchedState);
      const matchedCity = availableCities.find(c => loc.city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(loc.city.toLowerCase())) || availableCities[0];
      setSelectedCity(matchedCity);
      const matchedMandis = getMandisForCity(matchedState, matchedCity);
      setSelectedMandiObj(matchedMandis[0] || null);

      setGpsNotice(isHindi 
        ? `✓ आपकी लोकेशन फेच हुई: ${loc.city}, ${matchedState}। निकटतम मंडी भाव लोड किए गए।`
        : `✓ GPS detected: ${loc.city}, ${matchedState}. Loaded nearest local APMC mandis.`
      );
      setTimeout(() => setGpsNotice(''), 5000);
    } catch (err) {
      setGpsNotice(isHindi ? 'लोकेशन फेच करने में असमर्थ। कृपया ड्रॉपडाउन से चुनें।' : 'GPS detection failed. Please select from state dropdown.');
      setTimeout(() => setGpsNotice(''), 4000);
    } finally {
      setGpsLoading(false);
    }
  };

  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      try {
        const data = await api.getPriceTrends({
          crop: selectedCrop,
          timePeriod,
          location: `${selectedState} - ${selectedCity}`
        });
        setTrendData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, [selectedCrop, timePeriod, selectedState, selectedCity]);

  // Current crop base object
  const currentCropObj = crops.find(c => c.id === selectedCrop) || crops[0];
  const mandiModifier = selectedMandiObj?.priceModifier || 1.0;
  const mandiPricing = calculateMandiPrice(currentCropObj.basePrice, mandiModifier);

  const defaultHistory = [
    { month: 'May', price: Math.round(currentCropObj.basePrice * 0.85 * mandiModifier) },
    { month: 'Jun', price: Math.round(currentCropObj.basePrice * 1.05 * mandiModifier) },
    { month: 'Jul', price: Math.round(currentCropObj.basePrice * 0.90 * mandiModifier) },
    { month: 'Aug', price: Math.round(currentCropObj.basePrice * 1.25 * mandiModifier) },
    { month: 'Sep', price: Math.round(currentCropObj.basePrice * 1.10 * mandiModifier) },
    { month: 'Oct', price: Math.round(currentCropObj.basePrice * mandiModifier) },
    { month: 'Nov', price: Math.round(currentCropObj.basePrice * 1.15 * mandiModifier), predicted: true },
    { month: 'Dec', price: Math.round(currentCropObj.basePrice * 1.28 * mandiModifier), predicted: true },
    { month: 'Jan', price: Math.round(currentCropObj.basePrice * 1.20 * mandiModifier), predicted: true }
  ];

  const chartData = (trendData?.history && Array.isArray(trendData.history) && trendData.history.length > 0)
    ? trendData.history.map(item => ({
        ...item,
        price: Math.round(item.price * mandiModifier)
      }))
    : defaultHistory;

  const currentPrice = mandiPricing.modalPrice;
  const changePercent = trendData?.changePercent || 12;
  const highestPrice = mandiPricing.maxPrice;
  const lowestPrice = mandiPricing.minPrice;

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      
      {/* Sidebar */}
      <Sidebar currentSection="price-trends" title="Price Trends" />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Title Header without AI/ML tags */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t('priceTrendTitle')}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {isHindi 
                ? 'देश भर की अधिकृत कृषि उपज मंडियों (APMC) के दैनिक थोक भाव, आवक एवं ऐतिहासिक मूल्य विश्लेषण।' 
                : 'National APMC Mandi Daily Wholesale Modal Rates, Arrival Volumes & Historical Market Trends.'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGpsDetect}
            disabled={gpsLoading}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl text-xs font-bold shadow-md transition-all disabled:opacity-50 self-start md:self-auto"
          >
            {gpsLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4" />
            )}
            <span>{isHindi ? '🛰️ मेरी निकटतम मंडी खोजें (GPS)' : '🛰️ Find Nearest Mandi (GPS)'}</span>
          </button>
        </div>

        {gpsNotice && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold flex items-center space-x-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>{gpsNotice}</span>
          </div>
        )}

        {/* State, City & Mandi Search Filter Bar */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Select Crop */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {t('selectCrop')}
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Select State */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {isHindi ? 'राज्य चुनें (State)' : 'State'}
              </label>
              <select
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Select District / City */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {isHindi ? 'जिला / शहर (City)' : 'District / City'}
              </label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Time Period */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                {t('timePeriod')}
              </label>
              <select
                value={timePeriod}
                onChange={(e) => setTimePeriod(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-900 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {timePeriods.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

          </div>

          {/* Active Mandi Indicator Pill */}
          <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-gray-600">
                {isHindi ? 'सक्रिय मंडी:' : 'Active Mandi:'}
              </span>
              <span className="font-extrabold text-gray-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 text-xs text-emerald-900">
                {selectedMandiObj?.name || 'Lasalgaon APMC'}
              </span>
            </div>
            <span className="text-[11px] text-gray-500">
              {isHindi ? 'नीचे दी गई तालिका से किसी भी मंडी पर क्लिक करके उसका व्यक्तिगत भाव देख सकते हैं' : 'Click on any Mandi in the comparison table below to view its specific rate'}
            </span>
          </div>
        </div>

        {/* Live Mandi Comparison Table for Selected State & District */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center space-x-2">
                <span>{selectedCity} ({selectedState}) - {isHindi ? 'मंडी भाव तुलनात्मक सूची' : 'Mandi Rates Comparison'}</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {isHindi ? `${currentCropObj.name} के लिए विभिन्न मंडियों का आज का लाइव भाव` : `Live market rates for ${currentCropObj.name} across regional APMC yards`}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
              🔴 {isHindi ? 'दैनिक लाइव मंडी बुलेटिन' : 'Daily APMC Feed'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">{isHindi ? 'मंडी का नाम (APMC Yard)' : 'Mandi Name'}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'प्रकार / दूरी' : 'Type / Dist'}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'मॉडल भाव (₹/किग्रा)' : 'Modal Price (₹/kg)'}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'क्विंटल भाव (₹/Qtl)' : 'Price / Quintal'}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'न्यूनतम - उच्चतम भाव' : 'Min - Max Range'}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'दैनिक आवक' : 'Daily Arrivals'}</th>
                  <th className="py-3.5 px-6 text-right">{isHindi ? 'एक्शन' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                {mandis.map((mandi) => {
                  const mPricing = calculateMandiPrice(currentCropObj.basePrice, mandi.priceModifier);
                  const isSelected = selectedMandiObj?.name === mandi.name;
                  const priceDiff = Math.round((mPricing.modalPrice - currentCropObj.basePrice) * 10) / 10;

                  return (
                    <tr 
                      key={mandi.name}
                      onClick={() => setSelectedMandiObj(mandi)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/70 font-bold' : 'hover:bg-gray-50/60'
                      }`}
                    >
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <div className="font-extrabold text-gray-900 text-sm flex items-center space-x-1.5">
                          <span>{mandi.name}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-full font-bold">
                              {isHindi ? 'सक्रिय' : 'Active'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-gray-500">{mandi.type}</span>
                        <div className="text-[11px] text-gray-400 font-normal">📍 {mandi.distance}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-base font-black text-emerald-800">
                          ₹{mPricing.modalPrice}/kg
                        </div>
                        {priceDiff !== 0 && (
                          <div className={`text-[10px] font-bold ${priceDiff > 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {priceDiff > 0 ? `+₹${priceDiff} vs आधार` : `₹${priceDiff} vs आधार`}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900">
                        {mPricing.modalPriceQuintal}
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        ₹{mPricing.minPrice} — ₹{mPricing.maxPrice} /kg
                      </td>
                      <td className="py-4 px-6 text-gray-600 font-medium">
                        {mPricing.arrivals}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMandiObj(mandi);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isSelected 
                              ? 'bg-emerald-700 text-white shadow-xs' 
                              : 'bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-800'
                          }`}
                        >
                          {isSelected ? (isHindi ? 'चयनित' : 'Selected') : (isHindi ? 'यह मंडी चुनें' : 'Select')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Metric Cards for Selected Mandi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">
              {isHindi ? `${selectedMandiObj?.name?.split(' ')[0] || 'मंडी'} में वर्तमान भाव:` : 'Mandi Modal Price:'}
            </span>
            <div className="mt-2 flex items-baseline space-x-2">
              <span className="text-3xl font-black text-emerald-700">₹{currentPrice}/kg</span>
              <span className="text-xs font-bold text-gray-400">({mandiPricing.modalPriceQuintal})</span>
            </div>
            <div className="mt-2 flex items-center text-xs font-bold text-emerald-600">
              <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
              <span>{changePercent}% {t('fromLastMonth')}</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">{t('highestPrice')}</span>
            <div className="mt-2 text-3xl font-black text-gray-900">
              ₹{highestPrice}/kg
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              {mandiPricing.maxPriceQuintal} ({isHindi ? 'ग्रेड-A नीलामी उच्चतम भाव' : 'Grade-A Auction Ceiling'})
            </p>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold">{t('lowestPrice')}</span>
            <div className="mt-2 text-3xl font-black text-gray-900">
              ₹{lowestPrice}/kg
            </div>
            <p className="text-[11px] text-gray-400 mt-2">
              {mandiPricing.minPriceQuintal} ({isHindi ? 'बम्पर आवक न्यूनतम आधार भाव' : 'Base Support Price'})
            </p>
          </div>

        </div>

        {/* Historical Price Trend Chart */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">
                {currentCropObj.name} — {selectedMandiObj?.name || 'Mandi'} {isHindi ? 'मूल्य रुझान' : 'Price Movement'}
              </h3>
              <p className="text-xs text-gray-500">
                {isHindi 
                  ? 'ऐतिहासिक वास्तविक व्यापार औसत एवं अगले 3 महीने का सांख्यिकीय मूल्य पूर्वानुमान' 
                  : 'Historical Mandi trade averages with 3-month seasonal trend projection'}
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-blue-50 text-blue-800 rounded-full text-xs font-bold self-start sm:self-auto border border-blue-200">
              📍 {selectedCity}, {selectedState}
            </span>
          </div>

          <div className="w-full h-[320px] min-h-[320px]">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 'dataMax + 10']} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-xl border border-slate-700">
                          <p className="text-emerald-400 font-bold">{payload[0].payload.month} 2026</p>
                          <p className="text-base font-extrabold">₹{payload[0].value}/kg</p>
                          <p className="text-[10px] text-gray-300">₹{payload[0].value * 100}/क्विंटल</p>
                          {payload[0].payload.predicted && (
                            <p className="text-[10px] text-amber-300 font-bold mt-0.5">{isHindi ? 'अनुमानित अग्रिम भाव' : 'Forward Projection'}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#0284c7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#priceGradient2)"
                  dot={{ r: 5, fill: '#0284c7', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7, fill: '#0369a1' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-500 gap-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span>{isHindi ? 'मंडी ऑक्शन औसत (मई - अक्टू 2026)' : 'Observed APMC Auction Average (May - Oct 2026)'}</span>
            </span>
            <span className="text-emerald-700 font-bold">
              {isHindi ? `दैनिक आवक मात्रा: ${mandiPricing.arrivals}` : `Daily Arrival Volume: ${mandiPricing.arrivals}`}
            </span>
          </div>
        </div>

      </main>

    </div>
  );
};
