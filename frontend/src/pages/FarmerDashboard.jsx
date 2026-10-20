import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Star, 
  Plus, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  Handshake, 
  MessageSquare,
  AlertCircle,
  User,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  Camera,
  Edit2,
  Save,
  Check
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { AddProductModal } from '../components/AddProductModal';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { DirectContactModal } from '../components/DirectContactModal';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationPicker } from '../components/LocationPicker';

const INDIAN_FARMER_AVATARS = [
  { name: 'Ramesh Kumar (Maharashtra)', url: '/images/ramesh.jpg' },
  { name: 'Suresh Yadav (Uttar Pradesh)', url: '/images/suresh.jpg' },
  { name: 'Sunita Devi (Madhya Pradesh)', url: '/images/sunita.jpg' },
  { name: 'Anil Patel (Gujarat)', url: '/images/anil.jpg' },
  { name: 'Rajesh Choudhary (Rajasthan)', url: '/images/rajesh.jpg' },
  { name: 'Harpreet Singh (Punjab)', url: '/images/harpreet.jpg' }
];

export const FarmerDashboard = () => {
  const { user, updateUser } = useAuth();
  const { t, isHindi } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState(null);
  const [contactModal, setContactModal] = useState(null); // { contact, mode: 'call'|'message' }
  const [orderFilter, setOrderFilter] = useState('All');
  const [demoPendingStatus, setDemoPendingStatus] = useState('Pending');
  const [ordersToast, setOrdersToast] = useState('');
  const [negotiationToast, setNegotiationToast] = useState('');
  const [counterPriceInput, setCounterPriceInput] = useState({});

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Ramesh Kumar',
    phone: user?.phone || '+91 98234 11029',
    avatar: user?.avatar || '/images/ramesh.jpg',
    city: user?.location?.city || 'Nashik',
    state: user?.location?.state || 'Maharashtra',
    address: user?.location?.address || 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209',
    bio: user?.bio || 'Award-winning organic horticulturist growing Grade-A fresh produce in fertile soil.'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || 'Ramesh Kumar',
        phone: user.phone || '+91 98234 11029',
        avatar: user.avatar || '/images/ramesh.jpg',
        city: user.location?.city || 'Nashik',
        state: user.location?.state || 'Maharashtra',
        address: user.location?.address || 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209',
        bio: user.bio || 'Award-winning organic horticulturist growing Grade-A fresh produce in fertile soil.'
      });
    }
  }, [user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await api.updateProfile({
        userId: user?._id,
        name: profileForm.name,
        phone: profileForm.phone,
        avatar: profileForm.avatar,
        bio: profileForm.bio,
        location: {
          city: profileForm.city,
          state: profileForm.state,
          address: profileForm.address
        }
      });
      updateUser(updated);
      setProfileSaveSuccess(true);
      setTimeout(() => setProfileSaveSuccess(false), 4000);
      setEditingProfile(false);
    } catch (err) {
      alert(err.message || 'Error updating profile');
    }
  };

  const activeTab = searchParams.get('tab') || 'dashboard';

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, prodsData, negsData] = await Promise.all([
        api.getMyOrders(),
        api.getFarmerProducts(),
        api.getMyNegotiations()
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(prodsData) ? prodsData : []);
      setNegotiations(Array.isArray(negsData) ? negsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadDataSilently = async () => {
    try {
      const [ordersData, prodsData, negsData] = await Promise.all([
        api.getMyOrders(),
        api.getFarmerProducts(),
        api.getMyNegotiations()
      ]);
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(prodsData)) setProducts(prodsData);
      if (Array.isArray(negsData)) setNegotiations(negsData);
    } catch (e) {
      // background polling
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadDataSilently, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      if (newStatus === 'Confirmed') {
        setOrdersToast(isHindi ? '✓ ऑर्डर स्वीकृत! एस्क्रो राशि आपकी कुल आय में जुड़ गई है।' : '✓ Order Approved! Escrow funds allocated to your balance.');
        setTimeout(() => setOrdersToast(''), 4000);
      } else if (newStatus === 'In Transit') {
        setOrdersToast(isHindi ? '🚚 माल रवाना हो गया है।' : '🚚 Dispatched for transit.');
        setTimeout(() => setOrdersToast(''), 4000);
      } else if (newStatus === 'Delivered') {
        setOrdersToast(isHindi ? '✓ डिलीवरी पूर्ण व भुगतान रिलीज़ हुआ!' : '✓ Delivered and funds released!');
        setTimeout(() => setOrdersToast(''), 4000);
      }
      loadDataSilently();
    } catch (e) {
      alert('Error updating status: ' + e.message);
    }
  };

  const handleNegotiationAction = async (negId, action) => {
    try {
      const counterPrice = counterPriceInput[negId];
      if (action === 'counter') {
        if (!counterPrice || Number(counterPrice) <= 0) {
          alert(isHindi ? 'कृपया मान्य काउंटर भाव दर्ज करें (उदा. 17)' : 'Please enter a valid numeric counter price');
          return;
        }
      }
      await api.respondNegotiation(negId, {
        action,
        counterPrice: Number(counterPrice) || undefined,
        message: action === 'counter' ? `Farmer countered with ₹${counterPrice}/kg` : undefined
      });
      setNegotiationToast(
        action === 'accept'
          ? (isHindi ? '✓ खरीदार का मोलभाव प्रस्ताव स्वीकार कर लिया गया!' : '✓ Buyer offer accepted!')
          : action === 'counter'
          ? (isHindi ? `✓ काउंटर भाव ₹${counterPrice}/kg सफलतापूर्वक भेजा गया!` : `✓ Counter offer ₹${counterPrice}/kg sent!`)
          : (isHindi ? '✗ प्रस्ताव अस्वीकार कर दिया गया।' : '✗ Offer declined.')
      );
      setTimeout(() => setNegotiationToast(''), 4500);
      setCounterPriceInput({ ...counterPriceInput, [negId]: '' });
      loadDataSilently();
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  const isDemoUser = Boolean(user?.isDemo || (user?.email && user.email.toLowerCase() === 'ramesh@farmer.com'));

  const activeProductsCount = isDemoUser 
    ? (products.length > 0 ? products.length : 12) 
    : products.length;

  const totalOrdersCount = isDemoUser 
    ? (orders.length > 0 ? orders.length : 35) 
    : orders.length;

  const totalEarnings = (() => {
    if (isDemoUser && orders.length === 0) return '₹48,350';
    const approvedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Confirmed' || o.status === 'In Transit');
    const sum = approvedOrders.reduce((acc, curr) => acc + (Number(curr.totalPrice) || 0), 0);
    return `₹${sum.toLocaleString('en-IN')}`;
  })();

  const farmerRating = isDemoUser 
    ? '4.8' 
    : (user?.rating ? user.rating.toFixed(1) : (isHindi ? '5.0 (नया)' : '5.0 (New)'));

  const [statModal, setStatModal] = useState(null); // { type: 'products'|'orders'|'earnings'|'rating' }

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      
      {/* Dark Green Sidebar matching UI screenshot 4 */}
      <Sidebar currentSection="farmer-dashboard" title="Farmer Dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t('farmerDash')}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {isHindi ? 'स्वागत है' : 'Welcome back'}, <strong>{user?.name || 'Ramesh Kumar'}</strong>. {isHindi ? 'अपनी खेत उपज, ऑर्डर और आय का प्रबंधन करें।' : 'Here is your farm inventory and orders overview.'}
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addNewProduct')}</span>
          </button>
        </div>

        {/* 4 Stat Cards matching screenshot 4 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <button
            onClick={() => setStatModal('products')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-emerald-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-100 transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{activeProductsCount}</div>
              <div className="text-xs text-gray-500 font-medium">{t('activeProducts')}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('orders')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-100 transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{totalOrdersCount}</div>
              <div className="text-xs text-gray-500 font-medium">{t('totalOrders')}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('earnings')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-amber-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-100 transition-colors">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{totalEarnings}</div>
              <div className="text-xs text-gray-500 font-medium">{t('totalEarnings')}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('rating')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-purple-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:bg-purple-100 transition-colors">
              <Star className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{farmerRating}</div>
              <div className="text-xs text-gray-500 font-medium">{t('rating')}</div>
            </div>
          </button>

        </div>

        {/* Tab content switching: Never renders blank white! */}
        {activeTab === 'products' ? (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-extrabold text-gray-900 text-lg">
                {isHindi ? 'मेरी सूचीबद्ध फसलें' : 'My Listed Farm Produce'}
              </h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
              >
                {t('addNewProduct')}
              </button>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-16 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4 shadow-xs">
                  <Package className="w-8 h-8" />
                </div>
                <h4 className="text-base font-extrabold text-gray-900 mb-1">
                  {isHindi ? 'कोई फसल सूचीबद्ध नहीं है (0 उत्पाद)' : 'No Farm Produce Listed Yet (0 Items)'}
                </h4>
                <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                  {isHindi 
                    ? 'आपका खाता एकदम नया और साफ़ है। अपनी पहली फसल (टमाटर, प्याज, गेहूं आदि) जोड़ने के लिए नीचे दिए गए बटन पर क्लिक करें।' 
                    : 'Your account is fresh and clean. Click the button below to add your first harvest and start receiving direct buyer orders.'}
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isHindi ? '+ अपनी पहली फसल जोड़ें (Add First Produce)' : '+ Add Your First Produce'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                  <div key={p._id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-center space-x-3">
                    <img src={p.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&auto=format&fit=crop&q=80'} alt={p.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-gray-900 text-sm truncate">{p.title}</h4>
                      <p className="text-xs text-emerald-700 font-bold">₹{p.pricePerKg}/{p.unit || 'kg'}</p>
                      <p className="text-[11px] text-gray-500">{p.quantityAvailable} {p.unit || 'kg'} {t('available')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : activeTab === 'profile' ? (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 max-w-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-gray-900 text-xl">{isHindi ? 'किसान प्रोफाइल एवं फोटो प्रबंधन' : 'Farmer Profile & Photo Settings'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{isHindi ? 'अपनी भारतीय किसान प्रोफाइल फोटो, फोन नंबर व खेत का पता अपडेट करें।' : 'Update your authentic Indian farmer photo, contact number and farm address.'}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(!editingProfile)}
                className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editingProfile ? (isHindi ? 'रद्द करें' : 'Cancel') : (isHindi ? 'प्रोफ़ाइल बदलें' : 'Edit Profile')}</span>
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'प्रोफाइल और फोटो सफलतापूर्वक अपडेट हो गए!' : 'Profile and photo updated successfully!'}</span>
              </div>
            )}

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gradient-to-br from-emerald-50/50 to-white p-5 rounded-3xl border border-emerald-100">
              <div className="relative group">
                <img
                  src={user?.avatar || profileForm.avatar || '/images/ramesh.jpg'}
                  alt={user?.name || 'Farmer'}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-500/40 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  className="absolute bottom-0 right-0 p-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                  title="Change Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-extrabold text-gray-900 text-xl">{user?.name || 'Ramesh Kumar'}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{isHindi ? 'सत्यापित किसान' : 'Verified Farmer'}</span>
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold text-gray-900">{user?.phone || '+91 98234 11029'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{user?.location?.address || `${user?.location?.city || 'Nashik'}, ${user?.location?.state || 'Maharashtra'}`}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed pt-2 line-clamp-2">
                  {user?.bio || 'Award-winning organic horticulturist growing Grade-A fresh tomatoes, onions, garlic and table grapes in fertile Nashik soil.'}
                </p>
              </div>
            </div>

            {/* Editing Form */}
            {editingProfile && (
              <form onSubmit={handleSaveProfile} className="space-y-5 pt-2 border-t border-gray-100 animate-in fade-in">
                {/* Photo Selection Presets */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    {isHindi ? 'भारतीय किसान फोटो चुनें (1-क्लिक बदलाव):' : 'Select Authentic Indian Farmer Photo (1-Click Change):'}
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {INDIAN_FARMER_AVATARS.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setProfileForm({ ...profileForm, avatar: item.url })}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 text-center ${
                          profileForm.avatar === item.url ? 'border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={item.url} alt={item.name} className="w-full h-16 rounded-xl object-cover" />
                        <span className="block text-[10px] text-gray-700 font-medium truncate mt-1">{item.name.split(' ')[0]}</span>
                        {profileForm.avatar === item.url && (
                          <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white rounded-full p-0.5">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Photo URL */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isHindi ? 'या कस्टम फोटो यूआरएल (URL) दर्ज करें:' : 'Or Enter Custom Photo URL:'}
                  </label>
                  <input
                    type="text"
                    value={profileForm.avatar}
                    onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    placeholder="https://... or /images/..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isHindi ? 'पूरा नाम:' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isHindi ? 'फोन नंबर (खरीदारों के संपर्क हेतु):' : 'Phone Number (For Buyer Direct Contact):'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-bold"
                      placeholder="+91 98234 11029"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <LocationPicker
                    value={{
                      state: profileForm.state || 'Maharashtra',
                      city: profileForm.city || 'Nashik',
                      village: profileForm.village || 'Pimpalgaon Baswant',
                      address: profileForm.address || '',
                      nearestMandi: profileForm.nearestMandi || ''
                    }}
                    onChange={(loc) => setProfileForm({
                      ...profileForm,
                      state: loc.state,
                      city: loc.city,
                      village: loc.village,
                      address: loc.address,
                      nearestMandi: loc.nearestMandi
                    })}
                    showMandis={true}
                    required={true}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {isHindi ? 'खेत विवरण / बायो:' : 'Farm Bio & Crops Specialization:'}
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingProfile(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'प्रोफाइल सहेजें' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            )}
          </section>
        ) : null}

        {/* Recent Orders Table matching screenshot 4 */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">{t('recentOrders')}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{isHindi ? 'खरीदारों के संपूर्ण संपर्क विवरण व डिलीवरी पते' : 'Full buyer contact numbers and destination addresses'}</p>
            </div>
            <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              {t('catViewAll')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">{t('buyerCol')} & Contact</th>
                  <th className="py-3.5 px-6">{t('productCol')}</th>
                  <th className="py-3.5 px-6">{t('quantityCol')}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'राशि (एस्क्रो)' : 'Amount'}</th>
                  <th className="py-3.5 px-6">{t('statusCol')}</th>
                  <th className="py-3.5 px-6 text-right">{t('actionCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                
                {orders.length === 0 ? (
                  isDemoUser ? (
                    <>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <div className="font-bold text-gray-900 text-sm">Amit Sharma</div>
                        <div className="flex items-center space-x-2 text-[11px] text-blue-700 font-bold mt-0.5">
                          <Phone className="w-3 h-3 text-blue-600" />
                          <a href="tel:+919811054321" className="hover:underline">+91 98110 54321</a>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Shop 118, Azadpur Mandi, Delhi</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">Tomato</td>
                      <td className="py-4 px-6">100 kg</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Delivered
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <a href="tel:+919811054321" className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={() => setSelectedOrderForTracking({
                            _id: 'FDEMO001',
                            productTitle: 'Fresh Tomato',
                            quantity: 100, unit: 'kg',
                            status: 'Delivered',
                            totalPrice: 1800,
                            productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
                            farmer: { name: user?.name || 'Ramesh Kumar', phone: user?.phone || '+91 98234 11029', location: { city: user?.location?.city || 'Nashik', state: user?.location?.state || 'Maharashtra', address: user?.location?.address || 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                            buyer: { name: 'Amit Sharma', phone: '+91 98110 54321', location: { city: 'Delhi', address: 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033' } },
                            trackingSteps: [
                              { title: 'Order Placed & Escrow Secured', time: '15 Oct 2026, 09:30 AM', completed: true },
                              { title: 'Farmer Confirmed & Harvest Packed', time: '15 Oct 2026, 03:00 PM', completed: true },
                              { title: 'In Transit: Farm Gate → Azadpur Mandi, Delhi', time: '16 Oct 2026, 06:15 AM', completed: true },
                              { title: 'Delivered to Azadpur Mandi', time: '17 Oct 2026, 10:20 AM', completed: true }
                            ]
                          })}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-100"
                        >{t('viewBtn')}</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <div className="font-bold text-gray-900 text-sm">Karan Mehta</div>
                        <div className="flex items-center space-x-2 text-[11px] text-blue-700 font-bold mt-0.5">
                          <Phone className="w-3 h-3 text-blue-600" />
                          <a href="tel:+919820099887" className="hover:underline">+91 98200 99887</a>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Gala 402, APMC Market, Vashi, Navi Mumbai</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">Onion</td>
                      <td className="py-4 px-6">200 kg</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          In Transit
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <a href="tel:+919820099887" className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1">
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                        <button
                          onClick={() => setSelectedOrderForTracking({
                            _id: 'FDEMO002',
                            productTitle: 'Onion',
                            quantity: 200, unit: 'kg',
                            status: 'In Transit',
                            totalPrice: 3000,
                            productImage: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=200&auto=format&fit=crop&q=80',
                            farmer: { name: user?.name || 'Ramesh Kumar', phone: user?.phone || '+91 98234 11029', location: { city: user?.location?.city || 'Nashik', state: user?.location?.state || 'Maharashtra', address: user?.location?.address || 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                            buyer: { name: 'Karan Mehta', phone: '+91 98200 99887', location: { city: 'Navi Mumbai', address: 'Gala 402, APMC Market, Vashi, Navi Mumbai - 400703' } },
                            trackingSteps: [
                              { title: 'Order Placed & Escrow Secured', time: '18 Oct 2026, 10:00 AM', completed: true },
                              { title: 'Farmer Confirmed & Harvest Packed', time: '18 Oct 2026, 04:00 PM', completed: true },
                              { title: 'In Transit: Nashik → Vashi APMC, Mumbai', time: '19 Oct 2026, 05:00 AM', completed: true },
                              { title: 'Delivered to APMC Market', time: 'Expected: 20 Oct 2026, 08:00 AM', completed: false }
                            ]
                          })}
                          className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100"
                        >{t('trackBtn')}</button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <div className="font-bold text-gray-900 text-sm">Priya Verma</div>
                        <div className="flex items-center space-x-2 text-[11px] text-blue-700 font-bold mt-0.5">
                          <Phone className="w-3 h-3 text-blue-600" />
                          <button
                            type="button"
                            onClick={() => setContactModal({
                              contact: { name: 'Priya Verma', phone: '+91 97400 11223', role: isHindi ? 'थोक खरीदार (बैंगलोर)' : 'Wholesale Buyer (Bangalore)', avatar: '/images/priya.jpg' },
                              mode: 'call'
                            })}
                            className="hover:underline font-bold text-blue-700"
                          >
                            +91 97400 11223
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Building 12, Agro Hub, Bangalore</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">Rice (Basmati)</td>
                      <td className="py-4 px-6">500 kg</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          demoPendingStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
                          demoPendingStatus === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                          demoPendingStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {demoPendingStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Priya Verma', phone: '+91 97400 11223', role: isHindi ? 'थोक खरीदार (बैंगलोर)' : 'Wholesale Buyer (Bangalore)', avatar: '/images/priya.jpg' },
                            mode: 'call'
                          })}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1"
                          title="Call Buyer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{isHindi ? 'कॉल' : 'Call'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Priya Verma', phone: '+91 97400 11223', role: isHindi ? 'थोक खरीदार (बैंगलोर)' : 'Wholesale Buyer (Bangalore)', avatar: '/images/priya.jpg' },
                            mode: 'message'
                          })}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-100 inline-flex items-center space-x-1"
                          title="Message Buyer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{isHindi ? 'संदेश' : 'Msg'}</span>
                        </button>
                        {demoPendingStatus === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setDemoPendingStatus('In Transit');
                                setOrdersToast(isHindi ? '✓ ऑर्डर स्वीकार किया गया! फसल लोडिंग एवं पारगमन (In Transit) शुरू।' : '✓ Order Confirmed & Dispatched for Transit!');
                                setTimeout(() => setOrdersToast(''), 4000);
                              }}
                              className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-800 shadow-sm"
                            >
                              {isHindi ? 'स्वीकारें' : 'Accept'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setDemoPendingStatus('Rejected');
                                setOrdersToast(isHindi ? 'ऑर्डर अस्वीकृत किया गया।' : 'Order declined.');
                                setTimeout(() => setOrdersToast(''), 4000);
                              }}
                              className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 border border-red-200"
                            >
                              {isHindi ? 'अस्वीकार' : 'Reject'}
                            </button>
                          </>
                        )}
                        {demoPendingStatus === 'In Transit' && (
                          <button
                            type="button"
                            onClick={() => {
                              setDemoPendingStatus('Delivered');
                              setOrdersToast(isHindi ? '✓ ऑर्डर सफलतापूर्वक डिलीवर मार्क हो गया!' : '✓ Marked as Delivered!');
                              setTimeout(() => setOrdersToast(''), 4000);
                            }}
                            className="px-2.5 py-1 bg-blue-700 text-white rounded-lg text-[11px] font-bold hover:bg-blue-800"
                          >
                            {isHindi ? 'डिलीवर हुआ' : 'Mark Delivered'}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setSelectedOrderForTracking({
                            _id: 'FDEMO003',
                            productTitle: 'Rice (Basmati)',
                            quantity: 500, unit: 'kg',
                            status: demoPendingStatus,
                            totalPrice: 22500,
                            productImage: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=200&auto=format&fit=crop&q=80',
                            farmer: { name: user?.name || 'Ramesh Kumar', phone: user?.phone || '+91 98234 11029', location: { city: user?.location?.city || 'Nashik', state: user?.location?.state || 'Maharashtra', address: user?.location?.address || 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                            buyer: { name: 'Priya Verma', phone: '+91 97400 11223', location: { city: 'Bangalore', address: 'Building 12, Agro Hub, Hebbal, Bangalore - 560024' } },
                            trackingSteps: [
                              { title: 'Order Placed & Escrow Secured', time: '20 Oct 2026, 09:00 AM', completed: true },
                              { title: 'Farmer Harvest Packed', time: demoPendingStatus !== 'Pending' ? '20 Oct 2026, 11:30 AM' : 'Pending...', completed: demoPendingStatus !== 'Pending' },
                              { title: 'In Transit to Bangalore', time: demoPendingStatus === 'Delivered' ? '21 Oct 2026, 05:00 AM' : 'In Transit...', completed: demoPendingStatus === 'In Transit' || demoPendingStatus === 'Delivered' },
                              { title: 'Delivered to Agro Hub, Bangalore', time: demoPendingStatus === 'Delivered' ? '22 Oct 2026, 02:00 PM' : 'Pending...', completed: demoPendingStatus === 'Delivered' }
                            ]
                          })}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-bold hover:bg-gray-200"
                        >
                          {t('viewBtn')}
                        </button>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="max-w-md mx-auto text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">
                            {isHindi ? 'अभी कोई ऑर्डर प्राप्त नहीं हुआ है (0 ऑर्डर)' : 'No Orders Received Yet (0 Orders)'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                            {isHindi 
                              ? 'जैसे ही कोई खरीदार आपकी सूचीबद्ध फसल का ऑर्डर करेगा, उसका संपूर्ण विवरण, फोन नंबर व डिलीवरी पता यहाँ दिखाई देगा।' 
                              : 'As soon as buyers purchase your harvest, their full contact details and delivery tracking will appear here.'}
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                orders.map((order) => {
                    const buyerName = order.buyer?.name || 'Amit Sharma';
                    const prodName = order.productTitle || order.product?.title || 'Crop Produce';
                    const isDelivered = order.status === 'Delivered';
                    const isInTransit = order.status === 'In Transit';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-semibold text-gray-900">
                          <div className="font-bold text-gray-900 text-sm">{buyerName}</div>
                          <div className="flex items-center space-x-2 text-[11px] text-blue-700 font-bold mt-0.5">
                            <Phone className="w-3 h-3 text-blue-600" />
                            <a href={`tel:${order.buyer?.phone || '+91 98110 54321'}`} className="hover:underline">
                              {order.buyer?.phone || '+91 98110 54321'}
                            </a>
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {order.deliveryAddress?.street 
                                ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}` 
                                : `${order.buyer?.location?.city || 'Delhi'}, ${order.buyer?.location?.state || 'Delhi'}`}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {prodName}
                        </td>
                        <td className="py-4 px-6">
                          {order.quantity} {order.unit || 'kg'}
                        </td>
                        <td className="py-4 px-6 font-extrabold text-emerald-800 text-sm">
                          ₹{(order.totalPrice || (order.pricePerKg * order.quantity) || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                            isDelivered
                              ? 'bg-emerald-100 text-emerald-800'
                              : order.status === 'Confirmed'
                              ? 'bg-purple-100 text-purple-800'
                              : isInTransit
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {order.status === 'Confirmed' ? (isHindi ? 'स्वीकृत (Confirmed)' : 'Confirmed') : order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <a
                            href={`tel:${order.buyer?.phone || '+91 98110 54321'}`}
                            className="px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1"
                            title="Call Buyer"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                          {order.status === 'Pending' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'Confirmed')}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-black shadow-xs inline-flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isHindi ? '✓ स्वीकार करें (Approve)' : 'Approve Order'}</span>
                            </button>
                          )}
                          {order.status === 'Confirmed' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'In Transit')}
                              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-[11px] font-black shadow-xs inline-flex items-center space-x-1"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>{isHindi ? '🚚 रवाना करें (Dispatch)' : 'Dispatch'}</span>
                            </button>
                          )}
                          {order.status === 'In Transit' && (
                            <button
                              onClick={() => handleStatusChange(order._id, 'Delivered')}
                              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-[11px] font-black shadow-xs inline-flex items-center space-x-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{isHindi ? '✓ डिलीवरी पूर्ण' : 'Mark Delivered'}</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrderForTracking(order)}
                            className="text-emerald-700 font-bold hover:underline text-xs"
                          >
                            {isInTransit ? t('trackBtn') : t('viewBtn')}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>

        </section>

        {/* Active Negotiations */}
        {negotiations.length > 0 && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-lg flex items-center space-x-2">
                <Handshake className="w-5 h-5 text-emerald-700" />
                <span>{isHindi ? 'खरीदारों से प्राप्त भाव मोलभाव प्रस्ताव' : 'Incoming Buyer Price Negotiations'}</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {isHindi ? '🔴 लाइव अपडेट' : '🔴 Live Sync'}
              </span>
            </div>

            {negotiationToast && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold animate-in fade-in flex items-center space-x-2 shadow-sm">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{negotiationToast}</span>
              </div>
            )}

            <div className="space-y-4">
              {negotiations.map((neg) => (
                <div key={neg._id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">
                      {isHindi ? 'प्रस्ताव:' : 'Offer from'} {neg.buyer?.name || 'Buyer'} ({neg.productTitle})
                    </h4>
                    <p className="text-gray-500 mt-1">
                      {t('quantityCol')}: <strong>{neg.quantity} kg</strong> | {isHindi ? 'मानक भाव:' : 'Original:'} <strong>₹{neg.originalPricePerKg}/kg</strong> | {isHindi ? 'प्रस्तावित भाव:' : 'Offered:'} <strong className="text-emerald-700 font-extrabold text-sm">₹{neg.offeredPricePerKg}/kg</strong>
                      {neg.counterPricePerKg && (
                        <span> | {isHindi ? 'आपका काउंटर भाव:' : 'Your Counter:'} <strong className="text-blue-700 font-bold">₹{neg.counterPricePerKg}/kg</strong></span>
                      )}
                    </p>
                    {neg.messages && neg.messages.length > 0 && (
                      <p className="text-gray-600 italic mt-2 bg-white p-2 rounded-lg border border-gray-100 inline-block">
                        "{neg.messages[neg.messages.length - 1]?.text || 'Bulk discount requested'}"
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {neg.status === 'Pending' || neg.status === 'Countered' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleNegotiationAction(neg._id, 'accept')}
                          className="px-3.5 py-2 bg-emerald-700 text-white font-bold rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
                        >
                          {isHindi ? 'स्वीकार करें' : 'Accept Offer'}
                        </button>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            placeholder="Counter ₹"
                            value={counterPriceInput[neg._id] || ''}
                            onChange={(e) => setCounterPriceInput({ ...counterPriceInput, [neg._id]: e.target.value })}
                            className="w-20 px-2.5 py-2 rounded-xl border border-gray-200 text-center font-bold text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleNegotiationAction(neg._id, 'counter')}
                            className="px-3 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-sm"
                          >
                            {isHindi ? 'काउंटर भाव दें' : 'Counter'}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNegotiationAction(neg._id, 'reject')}
                          className="px-3 py-2 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-red-50 hover:text-red-700"
                        >
                          {isHindi ? 'अस्वीकार' : 'Decline'}
                        </button>
                      </>
                    ) : neg.status === 'Accepted' ? (
                      <div className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>{isHindi ? `स्वीकृत (₹${neg.agreedPricePerKg || neg.counterPricePerKg || neg.offeredPricePerKg}/kg) - खरीदार के आर्डर की प्रतीक्षा` : `Accepted (₹${neg.agreedPricePerKg || neg.counterPricePerKg || neg.offeredPricePerKg}/kg) - Awaiting Buyer Order`}</span>
                      </div>
                    ) : neg.status === 'Ordered' ? (
                      <div className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold shadow-sm">
                        <Check className="w-4 h-4 text-white" />
                        <span>{isHindi ? '🎉 खरीदार ने आर्डर दे दिया है (ऊपर आर्डर सूची में देखें)' : '🎉 Ordered by Buyer (Check Orders table above)'}</span>
                      </div>
                    ) : (
                      <span className="font-bold px-3 py-1.5 rounded-xl bg-red-100 text-red-800">
                        {isHindi ? 'अस्वीकृत' : 'Declined'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => loadData()}
        />
      )}

      {/* Order Tracking Modal */}
      {selectedOrderForTracking && (
        <OrderTrackingModal
          order={selectedOrderForTracking}
          onClose={() => setSelectedOrderForTracking(null)}
        />
      )}

      {/* Stat Detail Modal */}
      {statModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setStatModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className={`p-6 ${statModal === 'products' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700' : statModal === 'orders' ? 'bg-gradient-to-r from-blue-600 to-blue-700' : statModal === 'earnings' ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'bg-gradient-to-r from-purple-600 to-purple-700'} text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {statModal === 'products' && <Package className="w-5 h-5" />}
                    {statModal === 'orders' && <ShoppingBag className="w-5 h-5" />}
                    {statModal === 'earnings' && <DollarSign className="w-5 h-5" />}
                    {statModal === 'rating' && <Star className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg">
                      {statModal === 'products' && (isHindi ? 'सक्रिय उत्पाद विवरण' : 'Active Products Detail')}
                      {statModal === 'orders' && (isHindi ? 'कुल ऑर्डर विवरण' : 'Total Orders Detail')}
                      {statModal === 'earnings' && (isHindi ? 'कुल आय विवरण' : 'Total Earnings Detail')}
                      {statModal === 'rating' && (isHindi ? 'रेटिंग एवं समीक्षा' : 'Rating & Reviews')}
                    </h2>
                    <p className="text-white/80 text-xs mt-0.5">{user?.name || 'Ramesh Kumar'} — {isHindi ? 'किसान डैशबोर्ड' : 'Farmer Dashboard'}</p>
                  </div>
                </div>
                <button onClick={() => setStatModal(null)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white font-bold text-sm">✕</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">

              {/* Products Detail */}
              {statModal === 'products' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-emerald-50 rounded-2xl p-3 text-center"><div className="text-xl font-extrabold text-emerald-700">{activeProductsCount}</div><div className="text-[11px] text-gray-500">{isHindi ? 'सूचीबद्ध फसलें' : 'Listed Crops'}</div></div>
                    <div className="bg-blue-50 rounded-2xl p-3 text-center"><div className="text-xl font-extrabold text-blue-700">10</div><div className="text-[11px] text-gray-500">{isHindi ? 'उपलब्ध (In Stock)' : 'In Stock'}</div></div>
                    <div className="bg-amber-50 rounded-2xl p-3 text-center"><div className="text-xl font-extrabold text-amber-700">2</div><div className="text-[11px] text-gray-500">{isHindi ? 'कम स्टॉक' : 'Low Stock'}</div></div>
                  </div>
                  {[
                    { _id: '1', title: isHindi ? 'ताज़ा टमाटर (Fresh Tomato - Grade A)' : 'Fresh Tomato (Grade A)', pricePerKg: 18, quantityAvailable: 500, unit: 'kg', images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '2', title: isHindi ? 'नासिक लाल प्याज (Red Onion - Export)' : 'Red Onion (Export Quality)', pricePerKg: 22, quantityAvailable: 800, unit: 'kg', images: ['https://images.unsplash.com/photo-1508747703725-719777637510?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '3', title: isHindi ? 'अंगूर (Green Grapes - Thompson)' : 'Green Grapes (Thompson)', pricePerKg: 65, quantityAvailable: 200, unit: 'kg', images: ['https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '4', title: isHindi ? 'देसी सफेद लहसुन (Desi Garlic)' : 'Garlic (Desi White)', pricePerKg: 120, quantityAvailable: 150, unit: 'kg', images: ['https://images.unsplash.com/photo-1615478503562-ec2d8aa0e24e?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '5', title: isHindi ? 'हरी मिर्च (Green Chilli - G4)' : 'Green Chilli (G4 Spicy)', pricePerKg: 45, quantityAvailable: 180, unit: 'kg', images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '6', title: isHindi ? 'फूलगोभी (Snowball Cauliflower)' : 'Cauliflower (Snowball)', pricePerKg: 20, quantityAvailable: 350, unit: 'kg', images: ['https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '7', title: isHindi ? 'आलू (Kufri Jyoti Potato)' : 'Potato (Kufri Jyoti)', pricePerKg: 16, quantityAvailable: 1200, unit: 'kg', images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '8', title: isHindi ? 'अनार (Bhagwa Pomegranate)' : 'Pomegranate (Bhagwa)', pricePerKg: 95, quantityAvailable: 250, unit: 'kg', images: ['https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '9', title: isHindi ? 'ताज़ा अदरक (Fresh Ginger)' : 'Ginger (Fresh Maran)', pricePerKg: 85, quantityAvailable: 100, unit: 'kg', images: ['https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&auto=format&fit=crop&q=80'], status: 'Low Stock' },
                    { _id: '10', title: isHindi ? 'पालक (Desi Green Spinach)' : 'Spinach (Desi Palak)', pricePerKg: 15, quantityAvailable: 120, unit: 'kg', images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '11', title: isHindi ? 'बैंगन (Round Purple Brinjal)' : 'Brinjal (Round Purple)', pricePerKg: 18, quantityAvailable: 220, unit: 'kg', images: ['https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=80&auto=format&fit=crop&q=80'], status: 'In Stock' },
                    { _id: '12', title: isHindi ? 'भिंडी (Green Ladyfinger / Okra)' : 'Ladyfinger (Okra / Bhindi)', pricePerKg: 28, quantityAvailable: 90, unit: 'kg', images: ['https://images.unsplash.com/photo-1525607551316-4a8e16d1f9ba?w=80&auto=format&fit=crop&q=80'], status: 'Low Stock' },
                  ].map((p, i) => (
                    <div key={p._id || i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-colors">
                      <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <img
                        src={p.images?.[0]}
                        alt={p.title}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&auto=format&fit=crop&q=80'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 text-xs truncate">{p.title}</div>
                        <div className="text-[11px] text-emerald-700 font-bold">₹{p.pricePerKg}/{p.unit} · {p.quantityAvailable} {p.unit} {isHindi ? 'उपलब्ध' : 'available'}</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.status === 'In Stock' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'} flex-shrink-0`}>
                        {p.status === 'In Stock' ? (isHindi ? 'उपलब्ध' : 'In Stock') : (isHindi ? 'कम स्टॉक' : 'Low Stock')}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Orders Detail */}
              {statModal === 'orders' && (
                <div className="space-y-4">
                  {/* Summary Metric Counters */}
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setOrderFilter('All')}
                      className={`p-2 rounded-2xl text-center border transition-all ${orderFilter === 'All' ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
                    >
                      <div className="text-base font-extrabold">35</div>
                      <div className="text-[10px]">{isHindi ? 'सभी' : 'All'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('Delivered')}
                      className={`p-2 rounded-2xl text-center border transition-all ${orderFilter === 'Delivered' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'}`}
                    >
                      <div className="text-base font-extrabold">28</div>
                      <div className="text-[10px]">{isHindi ? 'डिलीवर' : 'Delivered'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('In Transit')}
                      className={`p-2 rounded-2xl text-center border transition-all ${orderFilter === 'In Transit' ? 'bg-blue-700 text-white border-blue-700' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'}`}
                    >
                      <div className="text-base font-extrabold">5</div>
                      <div className="text-[10px]">{isHindi ? 'रास्ते में' : 'Transit'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('Pending')}
                      className={`p-2 rounded-2xl text-center border transition-all ${orderFilter === 'Pending' ? 'bg-amber-600 text-white border-amber-600' : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'}`}
                    >
                      <div className="text-base font-extrabold">2</div>
                      <div className="text-[10px]">{isHindi ? 'लंबित' : 'Pending'}</div>
                    </button>
                  </div>

                  {ordersToast && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in flex items-center space-x-2">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{ordersToast}</span>
                    </div>
                  )}

                  {/* 35 Orders List */}
                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {[
                      // 2 Pending Orders
                      { id: 1, buyer: 'Priya Verma', phone: '+91 97400 11223', product: 'Rice (Basmati)', qty: '500 kg', status: demoPendingStatus, date: '20 Oct 2026', amount: '₹22,500', mandi: 'Bangalore Agro Hub' },
                      { id: 2, buyer: 'Manoj Tiwari', phone: '+91 98390 44551', product: 'Garlic (Desi White)', qty: '80 kg', status: 'Pending', date: '20 Oct 2026', amount: '₹9,600', mandi: 'Lucknow Mandi' },
                      // 5 In Transit Orders
                      { id: 3, buyer: 'Karan Mehta', phone: '+91 98200 99887', product: 'Red Onion', qty: '200 kg', status: 'In Transit', date: '20 Oct 2026', amount: '₹3,000', mandi: 'APMC Vashi, Navi Mumbai' },
                      { id: 4, buyer: 'Deepak Gupta', phone: '+91 98102 33445', product: 'Fresh Tomato', qty: '150 kg', status: 'In Transit', date: '19 Oct 2026', amount: '₹2,700', mandi: 'Azadpur Mandi, Delhi' },
                      { id: 5, buyer: 'Sanjay Sharma', phone: '+91 94260 77889', product: 'Green Grapes', qty: '100 kg', status: 'In Transit', date: '19 Oct 2026', amount: '₹6,500', mandi: 'Kalupur Mandi, Ahmedabad' },
                      { id: 6, buyer: 'Rajesh Agarwal', phone: '+91 94140 12345', product: 'Potato (Kufri)', qty: '400 kg', status: 'In Transit', date: '18 Oct 2026', amount: '₹6,400', mandi: 'Muhana Mandi, Jaipur' },
                      { id: 7, buyer: 'Vikram Patel', phone: '+91 98250 88776', product: 'Cauliflower', qty: '200 kg', status: 'In Transit', date: '18 Oct 2026', amount: '₹4,000', mandi: 'Surat APMC' },
                      // 28 Delivered Orders
                      { id: 8, buyer: 'Amit Sharma', phone: '+91 98110 54321', product: 'Fresh Tomato', qty: '100 kg', status: 'Delivered', date: '17 Oct 2026', amount: '₹1,800', mandi: 'Delhi Mandi' },
                      { id: 9, buyer: 'Rohit Singh', phone: '+91 98765 43210', product: 'Green Grapes', qty: '80 kg', status: 'Delivered', date: '16 Oct 2026', amount: '₹5,200', mandi: 'Lucknow' },
                      { id: 10, buyer: 'Sunil Jain', phone: '+91 98260 11223', product: 'Garlic', qty: '60 kg', status: 'Delivered', date: '15 Oct 2026', amount: '₹7,200', mandi: 'Indore Mandi' },
                      { id: 11, buyer: 'Alok Mishra', phone: '+91 94150 99887', product: 'Red Onion', qty: '300 kg', status: 'Delivered', date: '14 Oct 2026', amount: '₹6,600', mandi: 'Varanasi APMC' },
                      { id: 12, buyer: 'Rakesh Verma', phone: '+91 98180 55443', product: 'Tomato', qty: '200 kg', status: 'Delivered', date: '14 Oct 2026', amount: '₹3,600', mandi: 'Okhla Mandi, Delhi' },
                      { id: 13, buyer: 'Dinesh Shah', phone: '+91 98240 66554', product: 'Green Chilli', qty: '50 kg', status: 'Delivered', date: '13 Oct 2026', amount: '₹2,250', mandi: 'Vadodara' },
                      { id: 14, buyer: 'Pramod Kumar', phone: '+91 94310 77665', product: 'Potato', qty: '500 kg', status: 'Delivered', date: '12 Oct 2026', amount: '₹8,000', mandi: 'Patna Mandi' },
                      { id: 15, buyer: 'Vijay Sethi', phone: '+91 98101 22334', product: 'Pomegranate', qty: '120 kg', status: 'Delivered', date: '11 Oct 2026', amount: '₹11,400', mandi: 'Delhi' },
                      { id: 16, buyer: 'Anand Rao', phone: '+91 98480 33221', product: 'Ginger', qty: '40 kg', status: 'Delivered', date: '10 Oct 2026', amount: '₹3,400', mandi: 'Hyderabad' },
                      { id: 17, buyer: 'Mukesh Choudhary', phone: '+91 94141 55667', product: 'Red Onion', qty: '250 kg', status: 'Delivered', date: '09 Oct 2026', amount: '₹5,500', mandi: 'Jodhpur' },
                      { id: 18, buyer: 'Gaurav Khanna', phone: '+91 98140 88990', product: 'Tomato', qty: '180 kg', status: 'Delivered', date: '08 Oct 2026', amount: '₹3,240', mandi: 'Amritsar' },
                      { id: 19, buyer: 'Ashok Reddy', phone: '+91 98490 12345', product: 'Brinjal', qty: '150 kg', status: 'Delivered', date: '07 Oct 2026', amount: '₹2,700', mandi: 'Kurnool' },
                      { id: 20, buyer: 'Nitin Gadgil', phone: '+91 98220 44332', product: 'Spinach', qty: '100 kg', status: 'Delivered', date: '06 Oct 2026', amount: '₹1,500', mandi: 'Pune Market' },
                      { id: 21, buyer: 'Bhupendra Singh', phone: '+91 94120 77889', product: 'Cauliflower', qty: '160 kg', status: 'Delivered', date: '05 Oct 2026', amount: '₹3,200', mandi: 'Agra Mandi' },
                      { id: 22, buyer: 'Kishore Joshi', phone: '+91 98261 22334', product: 'Okra (Bhindi)', qty: '80 kg', status: 'Delivered', date: '04 Oct 2026', amount: '₹2,240', mandi: 'Bhopal' },
                      { id: 23, buyer: 'Suresh Singhania', phone: '+91 98300 11223', product: 'Red Onion', qty: '350 kg', status: 'Delivered', date: '03 Oct 2026', amount: '₹7,700', mandi: 'Kolkata APMC' },
                      { id: 24, buyer: 'Tarun Mathur', phone: '+91 94142 33445', product: 'Garlic', qty: '50 kg', status: 'Delivered', date: '02 Oct 2026', amount: '₹6,000', mandi: 'Kota' },
                      { id: 25, buyer: 'Harish Nair', phone: '+91 94470 55667', product: 'Green Grapes', qty: '90 kg', status: 'Delivered', date: '01 Oct 2026', amount: '₹5,850', mandi: 'Kochi' },
                      { id: 26, buyer: 'Lalit Mittal', phone: '+91 98112 44332', product: 'Fresh Tomato', qty: '120 kg', status: 'Delivered', date: '30 Sep 2026', amount: '₹2,160', mandi: 'Faridabad' },
                      { id: 27, buyer: 'Pankaj Dubey', phone: '+91 94251 66778', product: 'Potato', qty: '600 kg', status: 'Delivered', date: '29 Sep 2026', amount: '₹9,600', mandi: 'Jabalpur' },
                      { id: 28, buyer: 'Chetan Bhagat', phone: '+91 98201 33445', product: 'Pomegranate', qty: '150 kg', status: 'Delivered', date: '28 Sep 2026', amount: '₹14,250', mandi: 'Mumbai' },
                      { id: 29, buyer: 'Siddharth Roy', phone: '+91 98310 99887', product: 'Ginger', qty: '60 kg', status: 'Delivered', date: '27 Sep 2026', amount: '₹5,100', mandi: 'Howrah' },
                      { id: 30, buyer: 'Devendra Yadav', phone: '+91 94151 22334', product: 'Green Chilli', qty: '70 kg', status: 'Delivered', date: '26 Sep 2026', amount: '₹3,150', mandi: 'Kanpur' },
                      { id: 31, buyer: 'Hemant Bafna', phone: '+91 94252 88990', product: 'Brinjal', qty: '120 kg', status: 'Delivered', date: '25 Sep 2026', amount: '₹2,160', mandi: 'Ujjain' },
                      { id: 32, buyer: 'Rajendra Prasad', phone: '+91 94311 33221', product: 'Okra', qty: '90 kg', status: 'Delivered', date: '24 Sep 2026', amount: '₹2,520', mandi: 'Gaya' },
                      { id: 33, buyer: 'Mohan Lal', phone: '+91 94143 77889', product: 'Red Onion', qty: '220 kg', status: 'Delivered', date: '23 Sep 2026', amount: '₹4,840', mandi: 'Bikaner' },
                      { id: 34, buyer: 'Jatin Chawla', phone: '+91 98103 44556', product: 'Fresh Tomato', qty: '140 kg', status: 'Delivered', date: '22 Sep 2026', amount: '₹2,520', mandi: 'Gurgaon' },
                      { id: 35, buyer: 'Gopal Krishna', phone: '+91 98481 55667', product: 'Spinach', qty: '110 kg', status: 'Delivered', date: '21 Sep 2026', amount: '₹1,650', mandi: 'Vijayawada' }
                    ].filter(item => {
                      if (orderFilter === 'All') return true;
                      if (orderFilter === 'Pending') return item.status === 'Pending' || item.status === 'Rejected';
                      return item.status === orderFilter;
                    }).map((o) => (
                      <div key={o.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-gray-200 text-xs transition-all space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-extrabold text-gray-900 text-sm">{o.buyer} — {o.product}</div>
                            <div className="text-gray-500 text-[11px] mt-0.5">{o.qty} · {o.mandi} · {o.date}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-extrabold text-gray-900 text-sm">{o.amount}</div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                              o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {o.status}
                            </span>
                          </div>
                        </div>

                        {/* Action buttons for each order */}
                        <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-gray-100">
                          <button
                            type="button"
                            onClick={() => setContactModal({
                              contact: { name: o.buyer, phone: o.phone, role: isHindi ? 'खरीदार' : 'Buyer', location: { city: o.mandi } },
                              mode: 'call'
                            })}
                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 flex items-center space-x-1"
                          >
                            <Phone className="w-2.5 h-2.5" />
                            <span>{isHindi ? 'कॉल' : 'Call'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setContactModal({
                              contact: { name: o.buyer, phone: o.phone, role: isHindi ? 'खरीदार' : 'Buyer', location: { city: o.mandi } },
                              mode: 'message'
                            })}
                            className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100 flex items-center space-x-1"
                          >
                            <MessageSquare className="w-2.5 h-2.5" />
                            <span>{isHindi ? 'संदेश' : 'Msg'}</span>
                          </button>

                          {o.status === 'Pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setDemoPendingStatus('In Transit');
                                  setOrdersToast(isHindi ? `✓ ${o.buyer} का ऑर्डर स्वीकार हुआ!` : `✓ Accepted ${o.buyer}'s order!`);
                                  setTimeout(() => setOrdersToast(''), 4000);
                                }}
                                className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-800 shadow-sm"
                              >
                                {isHindi ? 'स्वीकारें' : 'Accept'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDemoPendingStatus('Rejected');
                                  setOrdersToast(isHindi ? `ऑर्डर अस्वीकृत किया गया।` : `Order rejected.`);
                                  setTimeout(() => setOrdersToast(''), 4000);
                                }}
                                className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 border border-red-200"
                              >
                                {isHindi ? 'अस्वीकार' : 'Reject'}
                              </button>
                            </>
                          )}

                          {o.status === 'In Transit' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  setOrdersToast(isHindi ? `✓ ${o.buyer} का ऑर्डर डिलीवर मार्क हो गया!` : `✓ Marked ${o.buyer}'s order as delivered!`);
                                  setTimeout(() => setOrdersToast(''), 4000);
                                }}
                                className="px-2 py-1 bg-blue-700 text-white rounded-lg text-[10px] font-bold hover:bg-blue-800"
                              >
                                {isHindi ? 'डिलीवर हुआ' : 'Mark Delivered'}
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForTracking({
                                  _id: `DEMO_${o.id}`,
                                  productTitle: o.product,
                                  quantity: parseInt(o.qty),
                                  status: 'In Transit',
                                  totalPrice: parseInt(o.amount.replace(/[^0-9]/g, '')),
                                  productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200',
                                  farmer: { name: user?.name || 'Ramesh Kumar', phone: user?.phone || '+91 98234 11029', location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                                  buyer: { name: o.buyer, phone: o.phone, location: { city: o.mandi, address: `${o.mandi} Yard` } },
                                  trackingSteps: [
                                    { title: 'Order Placed & Escrow Secured', time: '18 Oct 2026, 09:30 AM', completed: true },
                                    { title: 'Harvest Packed at Farm', time: '18 Oct 2026, 04:00 PM', completed: true },
                                    { title: 'In Transit from Farm Gate', time: '19 Oct 2026, 05:00 AM', completed: true },
                                    { title: 'Delivered to Destination Yard', time: 'Expected: 21 Oct 2026, 02:00 PM', completed: false }
                                  ]
                                })}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-lg text-[10px] font-bold hover:bg-gray-300"
                              >
                                {t('trackBtn')}
                              </button>
                            </>
                          )}

                          {o.status === 'Delivered' && (
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForTracking({
                                _id: `DEMO_${o.id}`,
                                productTitle: o.product,
                                quantity: parseInt(o.qty),
                                status: 'Delivered',
                                totalPrice: parseInt(o.amount.replace(/[^0-9]/g, '')),
                                productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200',
                                farmer: { name: user?.name || 'Ramesh Kumar', phone: user?.phone || '+91 98234 11029', location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                                buyer: { name: o.buyer, phone: o.phone, location: { city: o.mandi, address: `${o.mandi} Yard` } },
                                trackingSteps: [
                                  { title: 'Order Placed & Escrow Secured', time: '10 Oct 2026', completed: true },
                                  { title: 'Harvest Packed at Farm', time: '11 Oct 2026', completed: true },
                                  { title: 'In Transit from Farm Gate', time: '12 Oct 2026', completed: true },
                                  { title: 'Delivered & Payment Released', time: o.date, completed: true }
                                ]
                              })}
                              className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-[10px] font-bold hover:bg-emerald-100"
                            >
                              {t('viewBtn')}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Earnings Detail */}
              {statModal === 'earnings' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-50 rounded-2xl p-4 text-center"><div className="text-2xl font-extrabold text-emerald-700">₹48,350</div><div className="text-[11px] text-gray-500">{isHindi ? 'कुल आय (इस माह)' : 'Total This Month'}</div></div>
                    <div className="bg-blue-50 rounded-2xl p-4 text-center"><div className="text-2xl font-extrabold text-blue-700">₹3,42,000</div><div className="text-[11px] text-gray-500">{isHindi ? 'वार्षिक आय' : 'Annual Earnings'}</div></div>
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm">{isHindi ? 'माहवार आय विवरण:' : 'Monthly Breakdown:'}</h4>
                  {[
                    { month: 'October 2026', amount: '₹48,350', orders: 8, change: '+12%', up: true },
                    { month: 'September 2026', amount: '₹43,180', orders: 7, change: '+5%', up: true },
                    { month: 'August 2026', amount: '₹41,200', orders: 6, change: '-3%', up: false },
                    { month: 'July 2026', amount: '₹42,500', orders: 9, change: '+18%', up: true },
                    { month: 'June 2026', amount: '₹36,000', orders: 5, change: '+8%', up: true },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                      <div>
                        <div className="font-bold text-gray-900">{m.month}</div>
                        <div className="text-gray-500">{m.orders} {isHindi ? 'ऑर्डर' : 'orders'}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-extrabold text-gray-900 text-sm">{m.amount}</div>
                        <span className={`font-bold text-[10px] ${m.up ? 'text-emerald-600' : 'text-red-500'}`}>{m.change}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                    <div className="font-bold text-amber-800">{isHindi ? '💳 भुगतान जानकारी:' : '💳 Payment Info:'}</div>
                    <div className="text-amber-700 mt-1">{isHindi ? 'सभी भुगतान सीधे बैंक खाते में (NEFT/RTGS) — SBI Nashik Main Branch — XXXX1029' : 'All payments credited directly to SBI Nashik Main Branch — A/C ending XXXX1029 via NEFT/RTGS'}</div>
                  </div>
                </div>
              )}

              {/* Rating Detail */}
              {statModal === 'rating' && (
                <div className="space-y-3">
                  <div className="text-center py-4 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100">
                    <div className="text-5xl font-extrabold text-purple-700">4.8</div>
                    <div className="text-2xl mt-1">⭐⭐⭐⭐⭐</div>
                    <div className="text-xs text-gray-500 mt-1">{isHindi ? '47 खरीदार समीक्षाओं पर आधारित' : 'Based on 47 buyer reviews'}</div>
                  </div>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => {
                      const counts = [32, 10, 3, 1, 1];
                      const pct = Math.round((counts[5 - star] / 47) * 100);
                      return (
                        <div key={star} className="flex items-center space-x-2 text-xs">
                          <span className="w-4 font-bold text-gray-700">{star}⭐</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="text-gray-500 w-6">{counts[5 - star]}</span>
                        </div>
                      );
                    })}
                  </div>
                  <h4 className="font-bold text-gray-800 text-sm pt-2">{isHindi ? 'हाल की समीक्षाएं:' : 'Recent Reviews:'}</h4>
                  {[
                    { name: 'Amit Sharma', rating: 5, comment: 'Excellent quality tomatoes! Very fresh, right from the farm. Ramesh ji is very reliable.', date: '17 Oct 2026', avatar: '/images/amit.jpg' },
                    { name: 'Karan Mehta', rating: 5, comment: 'Best onions I have sourced from Maharashtra. Grade A quality and timely dispatch.', date: '13 Oct 2026', avatar: '/images/karan.jpg' },
                    { name: 'Priya Verma', rating: 4, comment: 'Good produce. Packaging could be improved slightly. Will order again.', date: '8 Oct 2026', avatar: '/images/priya.jpg' },
                    { name: 'Rohit Singh', rating: 5, comment: 'The grapes were perfect — sweet, firm and no spoilage. Highly recommend!', date: '3 Oct 2026', avatar: '/images/rohit.jpg' },
                  ].map((r, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                      <div className="flex items-center space-x-2 mb-1">
                        <img src={r.avatar} alt={r.name} className="w-7 h-7 rounded-full object-cover" />
                        <div>
                          <div className="font-bold text-gray-900">{r.name}</div>
                          <div className="text-gray-400">{r.date}</div>
                        </div>
                        <span className="ml-auto text-yellow-500">{'⭐'.repeat(r.rating)}</span>
                      </div>
                      <p className="text-gray-600 italic">"{r.comment}"</p>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setStatModal(null)}
                className="px-5 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Contact & Chat Modal */}
      {contactModal && (
        <DirectContactModal
          contact={contactModal.contact}
          initialMode={contactModal.mode}
          onClose={() => setContactModal(null)}
        />
      )}

    </div>
  );
};
