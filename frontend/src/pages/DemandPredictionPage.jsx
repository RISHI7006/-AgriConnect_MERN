import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Lightbulb, 
  Sparkles
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

export const DemandPredictionPage = () => {
  const { t, isHindi } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Rice');
  const [selectedRegion, setSelectedRegion] = useState('All India');
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  const crops = [
    { id: 'Rice', name: isHindi ? 'बासमती चावल (Basmati Rice)' : 'Rice' },
    { id: 'Tomato', name: isHindi ? 'टमाटर (Tomato)' : 'Tomato' },
    { id: 'Potato', name: isHindi ? 'आलू (Potato)' : 'Potato' },
    { id: 'Onion', name: isHindi ? 'प्याज (Onion)' : 'Onion' },
    { id: 'Wheat', name: isHindi ? 'गेहूं (Wheat)' : 'Wheat' },
    { id: 'Soybean', name: isHindi ? 'सोयाबीन (Soybean)' : 'Soybean' },
    { id: 'Mustard', name: isHindi ? 'सरसों (Mustard)' : 'Mustard' },
    { id: 'Cotton', name: isHindi ? 'कपास (Cotton)' : 'Cotton' },
    { id: 'Turmeric', name: isHindi ? 'हल्दी (Turmeric)' : 'Turmeric' },
    { id: 'Garlic', name: isHindi ? 'लहसुन (Garlic)' : 'Garlic' }
  ];

  const regions = ['All India', 'North India', 'South India', 'Western India', 'Eastern India', 'Central India'];

  useEffect(() => {
    const fetchPrediction = async () => {
      setLoading(true);
      try {
        const data = await api.getDemandPrediction({ crop: selectedCrop, region: selectedRegion });
        setPredictionData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, [selectedCrop, selectedRegion]);

  const defaultMonths = [
    { month: 'Nov', demand: 1200 },
    { month: 'Dec', demand: 1450 },
    { month: 'Jan', demand: 1600 }
  ];

  const chartData = (predictionData?.months && Array.isArray(predictionData.months))
    ? predictionData.months
    : defaultMonths;

  const growthRate = predictionData?.growthRate || 35;
  const bestTimeToSell = predictionData?.bestTimeToSell || 'January 2027';
  const highDemandRegions = predictionData?.highDemandRegions || 'North & East regions';
  const recommendation = predictionData?.recommendation || (isHindi ? 'उत्पादन बढ़ाने और सर्दियों की मांग के लिए स्टॉक सुरक्षित रखने पर विचार करें।' : 'Consider increasing production');

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      
      {/* Dark green sidebar matching screenshot 8 */}
      <Sidebar currentSection="demand-prediction" title="Demand Prediction" />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('demandTitle')}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isHindi ? 'देश की प्रमुख मंडियों में अगले 3 माह की थोक खरीद मात्रा एवं आवक का सांख्यिकीय पूर्वानुमान।' : 'Wholesale Procurement Volumes & Demand Forecasting Across India APMC Consumption Hubs.'}
          </p>
        </div>

        {/* Dropdown Selectors matching screenshot 8 */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              {t('selectCrop')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
              {t('selectRegion')}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-3 py-2 text-xs font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 cursor-pointer"
            >
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        {/* Main 2-Column Section matching Screenshot 8: Chart on Left, Insights on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Bar Chart "Predicted Demand (Metric Tons)" */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {t('predictedDemand')}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{isHindi ? 'अगले 3 माह की अनुमानित थोक मांग' : 'Projected next 3 months consumption'}</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                {isHindi ? 'सटीकता: 91%' : 'Confidence: 91%'}
              </span>
            </div>

            <div className="w-full h-[300px] min-h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 13, fontWeight: 'bold', fill: '#475569' }} />
                  <YAxis tickLine={false} axisLine={{ stroke: '#e2e8f0' }} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 4500]} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-900 text-white p-3 rounded-xl text-xs shadow-xl">
                            <p className="font-bold text-blue-400">{payload[0].payload.month} {isHindi ? 'पूर्वानुमान' : 'Forecast'}</p>
                            <p className="text-base font-extrabold">{payload[0].value?.toLocaleString()} MT</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="demand" radius={[8, 8, 0, 0]} maxBarSize={60}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === chartData.length - 1 ? '#0284c7' : '#38bdf8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Demand Numbers Labels matching screenshot 8 */}
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 text-center text-xs">
              {chartData.map(item => (
                <div key={item.month}>
                  <div className="font-extrabold text-gray-900 text-base">{item.demand?.toLocaleString()}</div>
                  <div className="text-gray-400 font-semibold">{item.month} (MT)</div>
                </div>
              ))}
            </div>

          </div>

          {/* Right: Insights Card matching Screenshot 8 */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-6">
            
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg mb-6 flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>{t('insights')}</span>
              </h3>

              <div className="space-y-5 text-xs text-gray-700">
                
                {/* Point 1 */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">
                      {isHindi ? `अगले 3 महीनों में मांग में ${growthRate}% वृद्धि की संभावना` : `Demand expected to increase by ${growthRate}% in next 3 months`}
                    </h5>
                    <p className="text-gray-500 mt-0.5">
                      {isHindi ? 'त्योहारी व शादी-समारोहों के सीजन से थोक खाद्य मांग में भारी उछाल।' : 'Seasonal harvest and wholesale processing contracts driving higher volumes.'}
                    </p>
                  </div>
                </div>

                {/* Point 2 */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">
                      {isHindi ? `फसल बेचने का सर्वोत्तम समय: ${bestTimeToSell}` : `Best time to sell: ${bestTimeToSell}`}
                    </h5>
                    <p className="text-gray-500 mt-0.5">
                      {isHindi ? 'मंडी में कम आपूर्ति के समय उच्चतम भाव लाभ मिलता है।' : 'Price realization peaks near harvest depletion window.'}
                    </p>
                  </div>
                </div>

                {/* Point 3 */}
                <div className="flex items-start space-x-3.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">
                      {isHindi ? `${highDemandRegions} में भारी मांग` : `High demand in ${highDemandRegions}`}
                    </h5>
                    <p className="text-gray-500 mt-0.5">
                      {isHindi ? 'खाद्य प्रसंस्करण मिलों और मेट्रो शहरों से सीधे ऑर्डर सक्रिय।' : 'Bulk mandi transactions concentrated in urban processing belts.'}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Recommendation footer note matching screenshot 8 */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-emerald-700 flex-shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-emerald-900">{t('recommendationLabel')}: </span>
                <span className="text-emerald-800 font-medium">{recommendation}</span>
              </div>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
