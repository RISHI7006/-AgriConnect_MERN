import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Sprout, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Layers
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

export const CropRecommendationPage = () => {
  const { t, isHindi } = useLanguage();
  const [state, setState] = useState('Maharashtra');
  const [soilType, setSoilType] = useState('Black Soil');
  const [season, setSeason] = useState('Kharif');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const states = [
    'Maharashtra',
    'Punjab',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Gujarat',
    'Rajasthan',
    'Karnataka',
    'Haryana'
  ];

  const soils = [
    { id: 'Black Soil', label: isHindi ? 'काली मिट्टी (Black Cotton Soil)' : 'Black Soil' },
    { id: 'Alluvial Soil', label: isHindi ? 'जलोढ़ मिट्टी (Alluvial Soil)' : 'Alluvial Soil' },
    { id: 'Red Soil', label: isHindi ? 'लाल मिट्टी (Red Soil)' : 'Red Soil' },
    { id: 'Sandy Loam', label: isHindi ? 'बलुई दोमट (Sandy Loam)' : 'Sandy Loam' },
    { id: 'Clayey Soil', label: isHindi ? 'चिकनी मिट्टी (Clayey Soil)' : 'Clayey Soil' }
  ];

  const seasons = [
    { id: 'Kharif', label: isHindi ? 'खरीफ (मानसून फसल)' : 'Kharif' },
    { id: 'Rabi', label: isHindi ? 'रबी (शीतकालीन फसल)' : 'Rabi' },
    { id: 'Zaid', label: isHindi ? 'जायद (गर्मी की फसल)' : 'Zaid' }
  ];

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await api.getCropRecommendations({ state, soilType, season });
      setRecommendations(Array.isArray(data?.recommendations) ? data.recommendations : []);
    } catch (e) {
      console.error(e);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleGetRecommendation = (e) => {
    e.preventDefault();
    fetchRecommendations();
  };

  const defaultCrops = [
    {
      name: isHindi ? 'सोयाबीन (Soybean)' : 'Soybean',
      suitability: 92,
      demand: isHindi ? 'बाज़ार में भारी मांग' : 'High demand',
      priceTrend: isHindi ? 'अच्छा मंडी भाव' : 'Good market price',
      image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: isHindi ? 'कपास (Cotton)' : 'Cotton',
      suitability: 88,
      demand: isHindi ? 'आपकी मिट्टी के अनुकूल' : 'Suitable for your soil',
      priceTrend: isHindi ? 'उत्कृष्ट मुनाफा मार्जिन' : 'Good profit margin',
      image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&auto=format&fit=crop&q=80'
    },
    {
      name: isHindi ? 'मक्का (Maize)' : 'Maize',
      suitability: 84,
      demand: isHindi ? 'औद्योगिक मांग अधिक' : 'High demand',
      priceTrend: isHindi ? 'मध्यम जल आवश्यकता' : 'Moderate water need',
      image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&auto=format&fit=crop&q=80'
    }
  ];

  const cropsToDisplay = (recommendations.length > 0) ? recommendations : defaultCrops;

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      
      {/* Dark green sidebar matching screenshot 9 */}
      <Sidebar currentSection="crop-recommendation" title="Crop Recommendation" />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('cropRecTitle')}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isHindi ? 'राज्य, मिट्टी के सूक्ष्म पोषक तत्वों व मौसम के आधार पर अधिकतम पैदावार व लाभदायक फसलों की कृषि सिफारिश प्रणाली।' : 'Scientific Agronomic Advisory evaluating Soil Micro-Nutrients, Seasonal Climate, and Mandi Liquidity.'}
          </p>
        </div>

        {/* Input Parameters Form matching Screenshot 9 */}
        <form onSubmit={handleGetRecommendation} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                {t('selectState')}
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                {t('soilType')}
              </label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {soils.map(st => <option key={st.id} value={st.id}>{st.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                {t('season')}
              </label>
              <select
                value={season}
                onChange={(e) => setSeason(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
              >
                {seasons.map(sn => <option key={sn.id} value={sn.id}>{sn.label}</option>)}
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? (isHindi ? 'विश्लेषण जारी...' : 'Evaluating Model...') : t('getRecommendation')}</span>
              </button>
            </div>

          </div>
        </form>

        {/* Recommended Crops Section matching Screenshot 9 */}
        <div className="mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            {t('recommendedCrops')}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isHindi ? `${state} में ${soilType} और ${season} मौसम के लिए सर्वाधिक उपयुक्त फसलें:` : `Optimized for ${soilType} in ${state} during ${season} season`}
          </p>
        </div>

        {/* 3 Crop Cards matching Screenshot 9 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cropsToDisplay.map((crop, idx) => (
            <div
              key={crop.name}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors">
                      {crop.name}
                    </h3>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {t('suitability')}: {crop.suitability}%
                  </span>
                </div>

                <div className="space-y-2 mb-6 text-xs text-gray-600">
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-gray-800">{crop.demand}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="font-semibold text-gray-800">{crop.priceTrend}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
                  <img
                    src={crop.image || 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?w=400&auto=format&fit=crop&q=80'}
                    alt={crop.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>

    </div>
  );
};
