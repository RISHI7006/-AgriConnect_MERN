import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Sprout, ShieldCheck, UserCheck, ArrowRight, Check, ShoppingBag, User, MapPin, Phone, Mail, Lock, Building, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationPicker } from '../components/LocationPicker';

export const AuthPage = ({ mode = 'login' }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialRole = searchParams.get('role');

  // Determine active tab: 'farmer-register', 'buyer-register', or 'login'
  const determineInitialTab = () => {
    if (mode === 'register' || location.pathname === '/register') {
      if (initialRole === 'buyer') return 'buyer-register';
      return 'farmer-register';
    }
    return 'login';
  };

  const [activeTab, setActiveTab] = useState(determineInitialTab);
  const { isHindi } = useLanguage();

  useEffect(() => {
    if (location.pathname === '/register') {
      if (initialRole === 'buyer') setActiveTab('buyer-register');
      else setActiveTab('farmer-register');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname, initialRole]);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    city: 'Nashik',
    state: 'Maharashtra',
    phone: '+91 ',
    businessName: '',
    farmAddress: ''
  });

  const [locationData, setLocationData] = useState({
    state: 'Maharashtra',
    city: 'Nashik',
    village: 'Pimpalgaon Baswant',
    pincode: '422209',
    nearestMandi: 'Pimpalgaon Baswant APMC (टमाटर व अंगूर मंडी)',
    address: 'Pimpalgaon Baswant, Nashik, Maharashtra - 422209'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register, switchRole } = useAuth();
  const navigate = useNavigate();

  const handleQuickDemo = async (role) => {
    try {
      setLoading(true);
      const activeUser = await switchRole(role);
      const targetRole = activeUser?.role || role;
      if (targetRole === 'farmer') navigate('/farmer-dashboard');
      else if (targetRole === 'buyer') navigate('/buyer-dashboard');
      else if (targetRole === 'admin') navigate('/admin-dashboard');
    } catch (err) {
      console.error('Quick demo error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (activeTab === 'login') {
        const res = await login(formData.email.trim(), formData.password);
        if (res.role === 'farmer') navigate('/farmer-dashboard');
        else if (res.role === 'buyer') navigate('/buyer-dashboard');
        else if (res.role === 'admin') navigate('/admin-dashboard');
        else navigate('/products');
      } else if (activeTab === 'farmer-register') {
        const res = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'farmer',
          phone: formData.phone.trim() || '+91 98765 43210',
          location: {
            city: locationData.city || 'Nashik',
            state: locationData.state || 'Maharashtra',
            village: locationData.village || 'Pimpalgaon Baswant',
            pincode: locationData.pincode || '422209',
            nearestMandi: locationData.nearestMandi || '',
            address: locationData.address || `${locationData.village}, ${locationData.city}, ${locationData.state}`
          }
        });
        // Direct clean farmer to dashboard with 0 items
        navigate('/farmer-dashboard');
      } else if (activeTab === 'buyer-register') {
        const res = await register({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: 'buyer',
          phone: formData.phone.trim() || '+91 98765 43210',
          location: {
            city: locationData.city || 'Delhi',
            state: locationData.state || 'Delhi',
            village: locationData.village || 'Azadpur',
            pincode: locationData.pincode || '110033',
            nearestMandi: locationData.nearestMandi || '',
            address: formData.businessName.trim() ? `${formData.businessName}, ${locationData.address}` : locationData.address
          }
        });
        // Direct clean buyer to dashboard with 0 orders
        navigate('/buyer-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center text-white shadow-md">
            <Sprout className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className="text-2xl font-black tracking-tight text-gray-900">
            Agri<span className="text-emerald-700">Connect</span>
          </span>
        </Link>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {activeTab === 'farmer-register'
            ? (isHindi ? '🌾 किसान पंजीकरण (नया खाता)' : '🌾 Farmer Registration (Clean Account)')
            : activeTab === 'buyer-register'
            ? (isHindi ? '🛒 थोक खरीदार पंजीकरण' : '🛒 Wholesale Buyer Registration')
            : (isHindi ? 'खाते में साइन इन करें' : 'Sign In to Your Account')}
        </h2>
        <p className="text-xs text-gray-500 font-medium">
          {isHindi 
            ? 'बिना बिचौलियों के सीधा किसान-से-खरीदार डिजिटल कृषि मंच' 
            : 'Direct Farmer-to-Buyer transparency with verified credentials'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        
        {/* Fast-Track Demo Switcher Strip */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-emerald-200/90 rounded-3xl p-4 sm:p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-black text-emerald-950">
                {isHindi ? '🚀 तुरंत टेस्ट करें (1-क्लिक डेमो लॉगिन):' : 'Instant Demo Access (1-Click Test Login):'}
              </span>
            </div>
            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-2.5 py-0.5 rounded-full font-bold">
              {isHindi ? 'सैंपल डेटा सहित' : 'Preloaded Data'}
            </span>
          </div>

          <p className="text-[11px] text-gray-600 mb-3 leading-relaxed">
            {isHindi
              ? 'यदि आप बिना रजिस्टर किए प्लेटफॉर्म को तुरंत टेस्ट करना चाहते हैं, तो नीचे दिए गए डेमो प्रोफाइल पर क्लिक करें:'
              : 'To quickly explore pre-filled farm products and sample orders without registering, pick a demo persona:'}
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemo('farmer')}
              className="p-2.5 bg-white text-emerald-900 hover:bg-emerald-100/70 border border-emerald-300 rounded-2xl text-xs font-bold transition-all shadow-xs text-center hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center space-x-1 font-extrabold">
                <span>🌾 किसान</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-0.5 truncate">रमेश कुमार</div>
              <div className="text-[10px] text-gray-400 font-normal">नासिक (फसलें: 12)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('buyer')}
              className="p-2.5 bg-white text-blue-900 hover:bg-blue-100/70 border border-blue-300 rounded-2xl text-xs font-bold transition-all shadow-xs text-center hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center space-x-1 font-extrabold">
                <span>🛒 खरीदार</span>
              </div>
              <div className="text-[11px] text-blue-700 font-bold mt-0.5 truncate">अमित शर्मा</div>
              <div className="text-[10px] text-gray-400 font-normal">आज़ादपुर मंडी (ऑर्डर: 5)</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="p-2.5 bg-white text-purple-900 hover:bg-purple-100/70 border border-purple-300 rounded-2xl text-xs font-bold transition-all shadow-xs text-center hover:scale-[1.02]"
            >
              <div className="flex items-center justify-center space-x-1 font-extrabold">
                <span>⚡ एडमिन</span>
              </div>
              <div className="text-[11px] text-purple-700 font-bold mt-0.5 truncate">व्यवस्थापक</div>
              <div className="text-[10px] text-gray-400 font-normal">KYC सत्यापन व नियंत्रण</div>
            </button>
          </div>
        </div>

        {/* Main Auth Container */}
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl sm:px-10 border border-gray-100">
          
          {/* Distinct 3-Way Mode Switcher: Farmer Register, Buyer Register, Login */}
          <div className="grid grid-cols-3 gap-1.5 bg-gray-100 p-1.5 rounded-2xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => { setActiveTab('farmer-register'); setError(''); }}
              className={`py-2.5 px-2 rounded-xl transition-all text-center flex flex-col items-center justify-center ${
                activeTab === 'farmer-register'
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="font-extrabold">{isHindi ? '🌾 किसान रजिस्टर' : '🌾 Farmer Register'}</span>
              <span className={`text-[10px] ${activeTab === 'farmer-register' ? 'text-emerald-100' : 'text-gray-400'}`}>
                {isHindi ? 'फसल बिक्री हेतु' : 'Sell Harvest'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('buyer-register'); setError(''); }}
              className={`py-2.5 px-2 rounded-xl transition-all text-center flex flex-col items-center justify-center ${
                activeTab === 'buyer-register'
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="font-extrabold">{isHindi ? '🛒 खरीदार रजिस्टर' : '🛒 Buyer Register'}</span>
              <span className={`text-[10px] ${activeTab === 'buyer-register' ? 'text-blue-100' : 'text-gray-400'}`}>
                {isHindi ? 'थोक खरीद हेतु' : 'Bulk Buying'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('login'); setError(''); }}
              className={`py-2.5 px-2 rounded-xl transition-all text-center flex flex-col items-center justify-center ${
                activeTab === 'login'
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <span className="font-extrabold">{isHindi ? '🔐 खाता लॉगिन' : '🔐 Sign In'}</span>
              <span className={`text-[10px] ${activeTab === 'login' ? 'text-gray-300' : 'text-gray-400'}`}>
                {isHindi ? 'मौजूदा उपयोगकर्ता' : 'Existing User'}
              </span>
            </button>
          </div>

          {/* Clean Account Notice for Registration */}
          {activeTab !== 'login' && (
            <div className={`p-3.5 mb-5 rounded-2xl border text-xs flex items-start space-x-2.5 ${
              activeTab === 'farmer-register' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-blue-50/70 border-blue-200 text-blue-900'
            }`}>
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="block font-bold">
                  {activeTab === 'farmer-register'
                    ? (isHindi ? 'ताज़ा किसान खाता (0 डमी डेटा):' : 'Fresh Clean Farmer Account:')
                    : (isHindi ? 'ताज़ा खरीदार खाता (0 डमी डेटा):' : 'Fresh Clean Buyer Account:')}
                </strong>
                <span>
                  {activeTab === 'farmer-register'
                    ? (isHindi 
                        ? 'नया किसान रजिस्टर करने पर आपका डैशबोर्ड एकदम खाली और साफ़ होगा (0 उत्पाद, 0 ऑर्डर, ₹0 आय)। जब आप नई फसल जोड़ेंगे, तभी वह आपके खाते में जुड़ेगी।' 
                        : 'Your new farmer dashboard starts strictly clean with 0 products and 0 orders. Your dashboard dynamically updates as you add your own produce.')
                    : (isHindi 
                        ? 'नया खरीदार रजिस्टर करने पर आपका डैशबोर्ड एकदम साफ़ (0 ऑर्डर) होगा। जब आप मंडी से फसल ऑर्डर करेंगे, तभी ऑर्डर दर्ज होंगे।' 
                        : 'Your new wholesale buyer dashboard starts clean with 0 orders. Procurements only show up when you actually place direct orders.')}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 font-bold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Registration Specific Fields */}
            {activeTab !== 'login' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {activeTab === 'farmer-register'
                      ? (isHindi ? 'किसान का पूरा नाम *' : 'Farmer Full Name *')
                      : (isHindi ? 'खरीदार / व्यापारी का पूरा नाम *' : 'Buyer / Trader Full Name *')}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={activeTab === 'farmer-register' ? (isHindi ? 'जैसे: राजेश कुमार' : 'e.g. Rajesh Kumar') : (isHindi ? 'जैसे: अमित शर्मा' : 'e.g. Amit Sharma')}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {activeTab === 'buyer-register' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-800 mb-1">
                      {isHindi ? 'दुकान / कंपनी का नाम (वैकल्पिक)' : 'Business / Shop Name (Optional)'}
                    </label>
                    <div className="relative">
                      <Building className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder={isHindi ? 'जैसे: शर्मा एग्रो ट्रेडिंग, दुकान 45' : 'e.g. Sharma Agro Trading, Shop 45'}
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-1">
                  <LocationPicker
                    value={locationData}
                    onChange={setLocationData}
                    showMandis={true}
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-1">
                    {isHindi ? 'मोबाइल / व्हाट्सएप नंबर (सीधे संपर्क हेतु) *' : 'Mobile / WhatsApp Number (For Direct Call/Msg) *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {isHindi ? 'ईमेल पता (Email Address) *' : 'Email Address *'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={
                    activeTab === 'farmer-register' 
                      ? 'kisan@example.com' 
                      : activeTab === 'buyer-register' 
                      ? 'buyer@example.com' 
                      : 'ramesh@farmer.com'
                  }
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                {isHindi ? 'पासवर्ड (Password) *' : 'Password *'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white font-black text-xs rounded-xl transition-all shadow-md mt-3 flex items-center justify-center space-x-2 ${
                activeTab === 'farmer-register'
                  ? 'bg-emerald-700 hover:bg-emerald-800 hover:scale-[1.01]'
                  : activeTab === 'buyer-register'
                  ? 'bg-blue-700 hover:bg-blue-800 hover:scale-[1.01]'
                  : 'bg-gray-900 hover:bg-gray-800 hover:scale-[1.01]'
              }`}
            >
              <span>
                {loading
                  ? (isHindi ? 'प्रक्रिया चल रही है...' : 'Processing...')
                  : activeTab === 'farmer-register'
                  ? (isHindi ? '🌾 किसान खाता बनाएं (Create Farmer Account)' : '🌾 Create Farmer Account')
                  : activeTab === 'buyer-register'
                  ? (isHindi ? '🛒 खरीदार खाता बनाएं (Create Buyer Account)' : '🛒 Create Buyer Account')
                  : (isHindi ? '🔐 खाते में साइन इन करें' : 'Sign In')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
};
