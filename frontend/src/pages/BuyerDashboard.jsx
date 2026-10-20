import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Truck, 
  CheckCircle2, 
  Bookmark, 
  Search, 
  Eye, 
  Handshake,
  User,
  ShieldCheck,
  Phone,
  MapPin,
  Mail,
  Camera,
  Edit2,
  Save,
  Check,
  Star,
  MessageSquare,
  Sprout,
  ShoppingCart,
  X
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { OrderTrackingModal } from '../components/OrderTrackingModal';
import { DirectContactModal } from '../components/DirectContactModal';
import { WriteReviewModal } from '../components/WriteReviewModal';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LocationPicker } from '../components/LocationPicker';

const INDIAN_BUYER_AVATARS = [
  { name: 'Amit Sharma (Delhi)', url: '/images/amit.jpg' },
  { name: 'Karan Mehta (Mumbai)', url: '/images/karan.jpg' },
  { name: 'Priya Verma (Bangalore)', url: '/images/priya.jpg' },
  { name: 'Rohit Singh (Lucknow)', url: '/images/rohit.jpg' }
];

export const BuyerDashboard = () => {
  const { user, updateUser } = useAuth();
  const { t, isHindi } = useLanguage();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [negotiations, setNegotiations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [contactModal, setContactModal] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);
  const [orderFilter, setOrderFilter] = useState('All');
  const [buyerToast, setBuyerToast] = useState('');
  const [pendingOrderStatus, setPendingOrderStatus] = useState('Pending');
  const [loading, setLoading] = useState(true);

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || 'Amit Sharma',
    phone: user?.phone || '+91 98110 54321',
    avatar: user?.avatar || '/images/amit.jpg',
    city: user?.location?.city || 'Delhi',
    state: user?.location?.state || 'Delhi',
    address: user?.location?.address || 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033',
    bio: user?.bio || 'Wholesale mandi trader sourcing farm-gate fresh produce for Delhi NCR supermarket chains.'
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || 'Amit Sharma',
        phone: user.phone || '+91 98110 54321',
        avatar: user.avatar || '/images/amit.jpg',
        city: user.location?.city || 'Delhi',
        state: user.location?.state || 'Delhi',
        address: user.location?.address || 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033',
        bio: user.bio || 'Wholesale mandi trader sourcing farm-gate fresh produce for Delhi NCR supermarket chains.'
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
      const [ordersData, negsData] = await Promise.all([
        api.getMyOrders(),
        api.getMyNegotiations()
      ]);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setNegotiations(Array.isArray(negsData) ? negsData : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadDataSilently = async () => {
    try {
      const [ordersData, negsData] = await Promise.all([
        api.getMyOrders(),
        api.getMyNegotiations()
      ]);
      if (Array.isArray(ordersData)) setOrders(ordersData);
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

  const handleBuyerNegotiationAction = async (negId, action) => {
    try {
      await api.respondNegotiation(negId, { action });
      setBuyerToast(action === 'accept' 
        ? (isHindi ? '✓ काउंटर भाव स्वीकार किया गया! अब आप नीचे दिए बटन से तय भाव पर तुरंत ऑर्डर दे सकते हैं।' : '✓ Counter offer accepted! You can now place direct order at agreed price.')
        : (isHindi ? '✗ भाव अस्वीकार किया गया।' : '✗ Offer declined.')
      );
      setTimeout(() => setBuyerToast(''), 4500);
      loadDataSilently();
    } catch (e) {
      alert(e.message);
    }
  };

  const handleDirectOrderFromNegotiation = async (neg) => {
    try {
      const agreedPrice = neg.agreedPricePerKg || neg.counterPricePerKg || neg.offeredPricePerKg;
      const prodId = neg.product?._id || neg.product;

      const orderPayload = {
        productId: prodId,
        quantity: Number(neg.quantity),
        customPricePerKg: Number(agreedPrice),
        negotiationId: neg._id,
        paymentMethod: 'Escrow Secured',
        deliveryAddress: {
          street: user?.location?.address || 'Market Yard Hub, Shop 14',
          city: user?.location?.city || 'Pune',
          state: user?.location?.state || 'Maharashtra',
          pincode: '411037'
        },
        notes: `Negotiated buy at ₹${agreedPrice}/kg`
      };

      await api.createOrder(orderPayload);
      setBuyerToast(isHindi 
        ? `✓ तय भाव ₹${agreedPrice}/kg पर ऑर्डर दर्ज हुआ! एस्क्रो में भुगतान सुरक्षित है। किसान डैशबोर्ड पर भी तुरंत अपडेट हो गया।`
        : `✓ Order successfully placed at agreed price ₹${agreedPrice}/kg! Escrow secured and synced live with farmer.`
      );
      setTimeout(() => setBuyerToast(''), 5000);
      loadDataSilently();
    } catch (e) {
      alert('Order failed: ' + e.message);
    }
  };

  const isDemoUser = Boolean(user?.isDemo || (user?.email && user.email.toLowerCase() === 'amit@buyer.com'));

  const totalOrders = isDemoUser 
    ? (orders.length > 0 ? orders.length : 5) 
    : orders.length;

  const ongoingOrders = isDemoUser 
    ? (orders.filter(o => o.status === 'In Transit' || o.status === 'Pending' || o.status === 'Confirmed').length || 2) 
    : orders.filter(o => o.status === 'In Transit' || o.status === 'Pending' || o.status === 'Confirmed').length;

  const completedOrders = isDemoUser 
    ? (orders.filter(o => o.status === 'Delivered').length || 3) 
    : orders.filter(o => o.status === 'Delivered').length;

  const savedProducts = isDemoUser ? 12 : 0;

  const [statModal, setStatModal] = useState(null);

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      
      {/* Dark Green Sidebar matching UI screenshot 5 */}
      <Sidebar currentSection="buyer-dashboard" title="Buyer Dashboard" />

      {/* Main Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Search bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {t('buyerDash')}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {isHindi ? 'स्वागत है' : 'Welcome back'}, <strong>{user?.name || 'Amit Sharma'}</strong>. {isHindi ? 'अपने थोक कृषि खरीद ऑर्डर प्रबंधित करें।' : 'Manage your direct farm procurements.'}
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={isHindi ? 'फसल या किसान खोजें...' : 'Search products, farmers...'}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 shadow-sm"
            />
          </div>
        </div>

        {/* 4 Stat Cards matching screenshot 5 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <button
            onClick={() => setStatModal('orders')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-emerald-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-100 transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{totalOrders}</div>
              <div className="text-xs text-gray-500 font-medium">{t('totalOrders')}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('ongoing')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-100 transition-colors">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{ongoingOrders}</div>
              <div className="text-xs text-gray-500 font-medium">{t('ongoingOrders')}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('completed')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-teal-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold group-hover:bg-teal-100 transition-colors">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{completedOrders}</div>
              <div className="text-xs text-gray-500 font-medium">{t('completedOrders')}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('saved')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-purple-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:bg-purple-100 transition-colors">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{savedProducts}</div>
              <div className="text-xs text-gray-500 font-medium">{t('savedProducts')}</div>
            </div>
          </button>

        </div>

        {/* Tab handling: If someone clicks profile or messages in sidebar */}
        {activeTab === 'profile' && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 max-w-3xl space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="font-extrabold text-gray-900 text-xl">{isHindi ? 'खरीदार प्रोफाइल एवं फोटो प्रबंधन' : 'Buyer Profile & Photo Settings'}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{isHindi ? 'अपनी भारतीय खरीदार प्रोफाइल फोटो, फोन नंबर व डिलीवरी पता अपडेट करें।' : 'Update your authentic Indian buyer photo, phone number and business delivery address.'}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(!editingProfile)}
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{editingProfile ? (isHindi ? 'रद्द करें' : 'Cancel') : (isHindi ? 'प्रोफ़ाइल बदलें' : 'Edit Profile')}</span>
              </button>
            </div>

            {profileSaveSuccess && (
              <div className="p-3 bg-blue-50 border border-blue-200 text-blue-800 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <Check className="w-4 h-4 text-blue-600" />
                <span>{isHindi ? 'खरीदार प्रोफाइल और फोटो सफलतापूर्वक अपडेट हो गए!' : 'Buyer profile and photo updated successfully!'}</span>
              </div>
            )}

            {/* Profile Overview */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-gradient-to-br from-blue-50/50 to-white p-5 rounded-3xl border border-blue-100">
              <div className="relative group">
                <img
                  src={user?.avatar || profileForm.avatar || '/images/amit.jpg'}
                  alt={user?.name || 'Buyer'}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-500/40 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setEditingProfile(true)}
                  className="absolute bottom-0 right-0 p-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                  title="Change Photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h4 className="font-extrabold text-gray-900 text-xl">{user?.name || 'Amit Sharma'}</h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-blue-600" />
                    <span>{isHindi ? 'सत्यापित थोक खरीदार' : 'Verified Wholesale Buyer'}</span>
                  </span>
                </div>

                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span className="font-bold text-gray-900">{user?.phone || '+91 98110 54321'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{user?.location?.address || `${user?.location?.city || 'Delhi'}, ${user?.location?.state || 'Delhi'}`}</span>
                  </div>
                  {user?.email && (
                    <div className="flex items-center justify-center sm:justify-start space-x-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 leading-relaxed pt-2 line-clamp-2">
                  {user?.bio || 'Wholesale mandi trader sourcing farm-gate fresh produce for Delhi NCR supermarket chains.'}
                </p>
              </div>
            </div>

            {/* Editing Form */}
            {editingProfile && (
              <form onSubmit={handleSaveProfile} className="space-y-5 pt-2 border-t border-gray-100 animate-in fade-in">
                {/* Photo Selection Presets */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    {isHindi ? 'भारतीय खरीदार फोटो चुनें (1-क्लिक बदलाव):' : 'Select Authentic Indian Buyer Photo (1-Click Change):'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {INDIAN_BUYER_AVATARS.map((item, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setProfileForm({ ...profileForm, avatar: item.url })}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all p-1 text-center ${
                          profileForm.avatar === item.url ? 'border-blue-600 ring-2 ring-blue-600/30 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img src={item.url} alt={item.name} className="w-full h-20 rounded-xl object-cover" />
                        <span className="block text-[10px] text-gray-700 font-medium truncate mt-1">{item.name.split(' ')[0]}</span>
                        {profileForm.avatar === item.url && (
                          <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white rounded-full p-0.5">
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {isHindi ? 'फोन नंबर (किसानों के संपर्क हेतु):' : 'Phone Number (For Farmer Direct Contact):'}
                    </label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                      placeholder="+91 98110 54321"
                      required
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <LocationPicker
                    value={{
                      state: profileForm.state || 'Delhi',
                      city: profileForm.city || 'Delhi',
                      village: profileForm.village || 'Azadpur',
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
                    {isHindi ? 'कंपनी / व्यापार विवरण:' : 'Business / Procurement Details:'}
                  </label>
                  <textarea
                    rows={3}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
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
                    className="px-6 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'प्रोफाइल सहेजें' : 'Save Profile'}</span>
                  </button>
                </div>
              </form>
            )}
          </section>
        )}

        {/* Notification Toast */}
        {buyerToast && (
          <div className="mb-6 p-4 bg-emerald-50 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-sm font-bold animate-in fade-in flex items-center space-x-3 shadow-md">
            <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{buyerToast}</span>
          </div>
        )}

        {/* My Orders Table matching screenshot 5 */}
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-gray-900 text-lg">{t('myOrders')}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{isHindi ? 'किसान संपर्क, खेत स्थान और वास्तविक समय डिलीवरी ट्रैकिंग' : 'Direct farmer phone contact, farm location and real-time tracking'}</p>
            </div>
            <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
              {t('catViewAll')}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="py-3.5 px-6">{t('productCol')}</th>
                  <th className="py-3.5 px-6">{isHindi ? 'किसान व संपर्क विवरण' : 'Farmer & Contact'}</th>
                  <th className="py-3.5 px-6">{t('quantityCol')}</th>
                  <th className="py-3.5 px-6">{t('statusCol')}</th>
                  <th className="py-3.5 px-6 text-right">{t('actionCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                
                {orders.length === 0 ? (
                  isDemoUser ? (
                    <>
                    {/* Row 1: In Transit (Fresh Tomato) */}
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&auto=format&fit=crop&q=80" alt="Tomato" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="font-bold text-gray-900">Fresh Tomato</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">Ramesh Kumar</div>
                        <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-bold mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <button
                            type="button"
                            onClick={() => setContactModal({
                              contact: { name: 'Ramesh Kumar', phone: '+91 98234 11029', role: isHindi ? 'सत्यापित किसान (नासिक)' : 'Verified Farmer (Nashik)', avatar: '/images/ramesh.jpg' },
                              mode: 'call'
                            })}
                            className="hover:underline font-bold text-emerald-700"
                          >
                            +91 98234 11029
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Pimpalgaon Baswant, Nashik, Maharashtra</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">100 kg</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
                          In Transit
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Ramesh Kumar', phone: '+91 98234 11029', role: isHindi ? 'सत्यापित किसान (नासिक)' : 'Verified Farmer (Nashik)', avatar: '/images/ramesh.jpg' },
                            mode: 'call'
                          })}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-100 inline-flex items-center space-x-1"
                          title="Call Farmer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{isHindi ? 'कॉल' : 'Call'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Ramesh Kumar', phone: '+91 98234 11029', role: isHindi ? 'सत्यापित किसान (नासिक)' : 'Verified Farmer (Nashik)', avatar: '/images/ramesh.jpg' },
                            mode: 'message'
                          })}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1"
                          title="Message Farmer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{isHindi ? 'संदेश' : 'Msg'}</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrder({
                            _id: 'DEMO001',
                            productTitle: 'Fresh Tomato',
                            quantity: 100, unit: 'kg',
                            status: 'In Transit',
                            totalPrice: 1800,
                            productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80',
                            farmer: { name: 'Ramesh Kumar', phone: '+91 98234 11029', location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                            buyer: { name: user?.name || 'Amit Sharma', phone: user?.phone || '+91 98110 54321', location: { city: user?.location?.city || 'Delhi', address: user?.location?.address || 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033' } },
                            trackingSteps: [
                              { title: 'Order Placed & Escrow Secured', time: '15 Oct 2026, 09:30 AM', completed: true },
                              { title: 'Farmer Confirmed & Harvest Packed', time: '15 Oct 2026, 03:00 PM', completed: true },
                              { title: 'In Transit: Farm Gate → Azadpur Mandi, Delhi', time: '16 Oct 2026, 06:15 AM', completed: true },
                              { title: 'Delivered to Destination', time: 'Expected: 17 Oct 2026, 02:00 PM', completed: false }
                            ]
                          })}
                          className="px-2.5 py-1 bg-blue-700 text-white rounded-lg text-[11px] font-bold hover:bg-blue-800"
                        >{t('trackBtn')}</button>
                      </td>
                    </tr>

                    {/* Row 2: Delivered (Nashik Red Onion) */}
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <img src="https://images.unsplash.com/photo-1508747703725-719777637510?w=80&auto=format&fit=crop&q=80" alt="Onion" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="font-bold text-gray-900">Nashik Red Onion</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">Suresh Yadav</div>
                        <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-bold mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <button
                            type="button"
                            onClick={() => setContactModal({
                              contact: { name: 'Suresh Yadav', phone: '+91 94150 82741', role: isHindi ? 'सत्यापित किसान (वाराणसी)' : 'Verified Farmer (Varanasi)', avatar: '/images/suresh.jpg' },
                              mode: 'call'
                            })}
                            className="hover:underline font-bold text-emerald-700"
                          >
                            +91 94150 82741
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Village Shivpur, Varanasi, UP</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">200 kg</td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          Delivered
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Suresh Yadav', phone: '+91 94150 82741', role: isHindi ? 'सत्यापित किसान (वाराणसी)' : 'Verified Farmer (Varanasi)', avatar: '/images/suresh.jpg' },
                            mode: 'call'
                          })}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-100 inline-flex items-center space-x-1"
                          title="Call Farmer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{isHindi ? 'कॉल' : 'Call'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Suresh Yadav', phone: '+91 94150 82741', role: isHindi ? 'सत्यापित किसान (वाराणसी)' : 'Verified Farmer (Varanasi)', avatar: '/images/suresh.jpg' },
                            mode: 'message'
                          })}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1"
                          title="Message Farmer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{isHindi ? 'संदेश' : 'Msg'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewOrder({
                            _id: 'DEMO002',
                            productTitle: 'Nashik Red Onion',
                            farmer: { name: 'Suresh Yadav' }
                          })}
                          className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-[11px] font-bold hover:bg-amber-100 border border-amber-200 inline-flex items-center space-x-1"
                        >
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span>{isHindi ? 'समीक्षा दें' : 'Review'}</span>
                        </button>
                        <button
                          onClick={() => setSelectedOrder({
                            _id: 'DEMO002',
                            productTitle: 'Nashik Red Onion',
                            quantity: 200, unit: 'kg',
                            status: 'Delivered',
                            totalPrice: 4000,
                            productImage: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=200&auto=format&fit=crop&q=80',
                            farmer: { name: 'Suresh Yadav', phone: '+91 94150 82741', location: { city: 'Varanasi', state: 'Uttar Pradesh', address: 'Village Shivpur, Pindra Tehsil, Varanasi - 221003' } },
                            buyer: { name: user?.name || 'Amit Sharma', phone: user?.phone || '+91 98110 54321', location: { city: user?.location?.city || 'Delhi', address: user?.location?.address || 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033' } },
                            trackingSteps: [
                              { title: 'Order Placed & Escrow Secured', time: '10 Oct 2026, 11:00 AM', completed: true },
                              { title: 'Farmer Confirmed & Harvest Packed', time: '11 Oct 2026, 08:30 AM', completed: true },
                              { title: 'In Transit: Varanasi → Azadpur Mandi, Delhi', time: '12 Oct 2026, 05:00 AM', completed: true },
                              { title: 'Delivered to Azadpur Mandi', time: '13 Oct 2026, 10:20 AM', completed: true }
                            ]
                          })}
                          className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-800"
                        >{t('viewBtn')}</button>
                      </td>
                    </tr>

                    {/* Row 3: Pending (Basmati Rice) */}
                    <tr className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=80&auto=format&fit=crop&q=80" alt="Rice" className="w-9 h-9 rounded-lg object-cover" />
                        <span className="font-bold text-gray-900">Basmati Rice (1121)</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-900 text-sm">Harpreet Singh</div>
                        <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-bold mt-0.5">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <button
                            type="button"
                            onClick={() => setContactModal({
                              contact: { name: 'Harpreet Singh', phone: '+91 98142 09876', role: isHindi ? 'सत्यापित किसान (पंजाब)' : 'Verified Farmer (Punjab)', avatar: '/images/harpreet.jpg' },
                              mode: 'call'
                            })}
                            className="hover:underline font-bold text-emerald-700"
                          >
                            +91 98142 09876
                          </button>
                        </div>
                        <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400" />
                          <span>Village Gill, Ludhiana, Punjab</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">500 kg</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          pendingOrderStatus === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {pendingOrderStatus === 'Pending' ? (isHindi ? 'लंबित (पुष्टि हेतु)' : 'Pending') : (isHindi ? 'रद्द किया गया' : 'Cancelled')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-1.5">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Harpreet Singh', phone: '+91 98142 09876', role: isHindi ? 'सत्यापित किसान (पंजाब)' : 'Verified Farmer (Punjab)', avatar: '/images/harpreet.jpg' },
                            mode: 'call'
                          })}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-100 inline-flex items-center space-x-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{isHindi ? 'कॉल' : 'Call'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: 'Harpreet Singh', phone: '+91 98142 09876', role: isHindi ? 'सत्यापित किसान (पंजाब)' : 'Verified Farmer (Punjab)', avatar: '/images/harpreet.jpg' },
                            mode: 'message'
                          })}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[11px] font-bold hover:bg-blue-100 inline-flex items-center space-x-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{isHindi ? 'संदेश' : 'Msg'}</span>
                        </button>
                        {pendingOrderStatus === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPendingOrderStatus('Cancelled');
                              setBuyerToast(isHindi ? 'ऑर्डर सफलतापूर्वक रद्द कर दिया गया व राशि रिफंड हो गई।' : 'Order cancelled and payment refunded.');
                              setTimeout(() => setBuyerToast(''), 4000);
                            }}
                            className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[11px] font-bold hover:bg-red-100 border border-red-200"
                          >
                            {isHindi ? 'ऑर्डर रद्द करें' : 'Cancel'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-400 font-bold italic px-2">
                            {isHindi ? 'रद्द' : 'Cancelled'}
                          </span>
                        )}
                        <button
                          onClick={() => setSelectedOrder({
                            _id: 'DEMO003',
                            productTitle: 'Basmati Rice (1121)',
                            quantity: 500, unit: 'kg',
                            status: pendingOrderStatus,
                            totalPrice: 22500,
                            productImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&auto=format&fit=crop&q=80',
                            farmer: { name: 'Harpreet Singh', phone: '+91 98142 09876', location: { city: 'Ludhiana', state: 'Punjab', address: 'Village Gill, Ludhiana - 141006' } },
                            buyer: { name: user?.name || 'Amit Sharma', phone: user?.phone || '+91 98110 54321', location: { city: user?.location?.city || 'Delhi', address: user?.location?.address || 'Shop 118, New Subzi Mandi, Azadpur, Delhi - 110033' } },
                            trackingSteps: [
                              { title: 'Order Placed & Escrow Secured', time: '20 Oct 2026, 09:00 AM', completed: true },
                              { title: 'Farmer Confirmation', time: 'Awaiting farmer harvest pack', completed: false },
                              { title: 'In Transit: Ludhiana → Delhi', time: 'Pending dispatch', completed: false },
                              { title: 'Delivered to Azadpur Mandi', time: 'Pending', completed: false }
                            ]
                          })}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-[11px] font-bold hover:bg-gray-200"
                        >{t('viewBtn')}</button>
                      </td>
                    </tr>
                  </>
                ) : (
                  <tr>
                    <td colSpan="5" className="py-16 text-center">
                      <div className="max-w-md mx-auto text-center space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                          <ShoppingBag className="w-7 h-7" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-gray-900 text-sm">
                            {isHindi ? 'आपने अभी तक कोई ऑर्डर नहीं दिया है (0 ऑर्डर)' : 'No Procurements Yet (0 Orders)'}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                            {isHindi 
                              ? 'सीधे किसानों से ताज़ा फसलें थोक भाव पर खरीदने के लिए मंडी में जाएँ और सीधे ऑर्डर करें।' 
                              : 'Explore our direct farmer marketplace to source fresh produce at wholesale prices.'}
                          </p>
                        </div>
                        <Link
                          to="/products"
                          className="inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
                        >
                          <Sprout className="w-4 h-4" />
                          <span>{isHindi ? 'मंडी में फसलें देखें (Browse Marketplace)' : 'Browse Marketplace'}</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                )
              ) : (
                orders.map((order) => {
                    const farmerName = order.farmer?.name || 'Ramesh Kumar';
                    const prodName = order.productTitle || order.product?.title || 'Crop Produce';
                    const prodImg = order.productImage || order.product?.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&auto=format&fit=crop&q=80';
                    const isDelivered = order.status === 'Delivered';
                    const isInTransit = order.status === 'In Transit';

                    return (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 flex items-center space-x-3">
                          <img src={prodImg} alt={prodName} className="w-9 h-9 rounded-lg object-cover" />
                          <span className="font-bold text-gray-900">{prodName}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-bold text-gray-900 text-sm">{farmerName}</div>
                          <div className="flex items-center space-x-2 text-[11px] text-emerald-700 font-bold mt-0.5">
                            <Phone className="w-3 h-3 text-emerald-600" />
                            <a href={`tel:${order.farmer?.phone || '+91 98234 11029'}`} className="hover:underline">
                              {order.farmer?.phone || '+91 98234 11029'}
                            </a>
                          </div>
                          <div className="text-[11px] text-gray-500 flex items-center space-x-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {order.farmer?.location?.address || `${order.farmer?.location?.city || 'Nashik'}, ${order.farmer?.location?.state || 'Maharashtra'}`}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">{order.quantity} {order.unit || 'kg'}</td>
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
                            {order.status === 'Confirmed' ? (isHindi ? '✓ स्वीकृत (किसान द्वारा अप्रूव)' : 'Approved by Farmer') : order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <a
                            href={`tel:${order.farmer?.phone || '+91 98234 11029'}`}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold hover:bg-emerald-100 inline-flex items-center space-x-1"
                            title="Call Farmer"
                          >
                            <Phone className="w-3 h-3" />
                            <span>Call</span>
                          </a>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="font-bold text-emerald-700 hover:underline"
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
                <span>{isHindi ? 'आपकी सक्रिय भाव बोलियां व किसान के उत्तर' : 'Your Active Price Bids & Counter-Offers'}</span>
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                {isHindi ? '🔴 लाइव अपडेट' : '🔴 Live Sync'}
              </span>
            </div>

            <div className="space-y-4">
              {negotiations.map((neg) => {
                const agreedPrice = neg.agreedPricePerKg || neg.counterPricePerKg || neg.offeredPricePerKg;
                return (
                  <div key={neg._id} className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {isHindi ? 'किसान ' : 'Farmer '}{neg.farmer?.name || 'Ramesh Kumar'} ({neg.productTitle})
                      </h4>
                      <p className="text-gray-500 mt-1">
                        {t('quantityCol')}: <strong>{neg.quantity} kg</strong> | {isHindi ? 'मूल भाव:' : 'Original:'} <strong>₹{neg.originalPricePerKg}/kg</strong> | {isHindi ? 'आपकी बोली:' : 'Your Bid:'} <strong>₹{neg.offeredPricePerKg}/kg</strong>
                        {neg.counterPricePerKg && (
                          <span> | {isHindi ? 'किसान का काउंटर भाव:' : 'Farmer Counter:'} <strong className="text-blue-700 font-extrabold text-sm">₹{neg.counterPricePerKg}/kg</strong></span>
                        )}
                      </p>
                      
                      <div className="mt-2 flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          neg.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                          neg.status === 'Ordered' ? 'bg-emerald-600 text-white' :
                          neg.status === 'Countered' ? 'bg-blue-100 text-blue-800' :
                          neg.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {isHindi ? 'स्थिति: ' : 'Status: '}{neg.status}
                        </span>
                        
                        {neg.messages && neg.messages.length > 0 && (
                          <span className="text-gray-600 italic bg-white px-2.5 py-0.5 rounded-lg border border-gray-200 text-[11px]">
                            "{neg.messages[neg.messages.length - 1]?.text}"
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {neg.status === 'Countered' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleBuyerNegotiationAction(neg._id, 'accept')}
                            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-sm"
                          >
                            {isHindi ? `✓ काउंटर भाव ₹${neg.counterPricePerKg}/kg स्वीकारें` : `Accept Counter ₹${neg.counterPricePerKg}/kg`}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDirectOrderFromNegotiation(neg)}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition-colors shadow-md flex items-center space-x-1.5"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isHindi ? `🛒 तय भाव पर तुरंत खरीदें (₹${neg.counterPricePerKg * neg.quantity})` : `Order Now (₹${neg.counterPricePerKg * neg.quantity})`}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBuyerNegotiationAction(neg._id, 'reject')}
                            className="px-3 py-2 bg-gray-200 hover:bg-red-50 text-gray-700 hover:text-red-700 font-semibold rounded-xl"
                          >
                            {isHindi ? 'अस्वीकार' : 'Decline'}
                          </button>
                        </>
                      )}

                      {neg.status === 'Accepted' && (
                        <button
                          type="button"
                          onClick={() => handleDirectOrderFromNegotiation(neg)}
                          className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center space-x-2 animate-pulse"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>{isHindi ? `🛒 स्वीकृत भाव ₹${agreedPrice}/kg पर तुरंत ऑर्डर दें (कुल ₹${agreedPrice * neg.quantity})` : `Order at Agreed Price ₹${agreedPrice}/kg (Total ₹${agreedPrice * neg.quantity})`}</span>
                        </button>
                      )}

                      {neg.status === 'Ordered' && (
                        <div className="flex items-center space-x-1.5 text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>{isHindi ? 'ऑर्डर दर्ज हो चुका है (ऊपर तालिका में देखें)' : 'Order Placed & Escrow Secured'}</span>
                        </div>
                      )}

                      {neg.status === 'Pending' && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 italic">
                            {isHindi ? 'किसान के जवाब की प्रतीक्षा है...' : 'Waiting for Farmer response...'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBuyerNegotiationAction(neg._id, 'reject')}
                            className="px-2.5 py-1 text-xs bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 font-medium rounded-lg"
                          >
                            {isHindi ? 'रद्द करें' : 'Cancel'}
                          </button>
                        </div>
                      )}

                      {neg.status === 'Rejected' && (
                        <span className="text-red-600 font-bold bg-red-50 px-3 py-1 rounded-xl">
                          {isHindi ? 'प्रस्ताव समाप्त' : 'Negotiation Closed'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

      </main>

      {/* Tracking Modal */}
      {selectedOrder && (
        <OrderTrackingModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Stat Detail Modal */}
      {statModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setStatModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div className={`p-6 text-white ${
              statModal === 'orders' ? 'bg-gradient-to-r from-emerald-600 to-emerald-700' :
              statModal === 'ongoing' ? 'bg-gradient-to-r from-blue-600 to-blue-700' :
              statModal === 'completed' ? 'bg-gradient-to-r from-teal-600 to-teal-700' :
              'bg-gradient-to-r from-purple-600 to-purple-700'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    {statModal === 'orders' && <ShoppingBag className="w-5 h-5" />}
                    {statModal === 'ongoing' && <Truck className="w-5 h-5" />}
                    {statModal === 'completed' && <CheckCircle2 className="w-5 h-5" />}
                    {statModal === 'saved' && <Bookmark className="w-5 h-5" />}
                  </div>
                  <div>
                    <h2 className="font-extrabold text-lg">
                      {statModal === 'orders' && (isHindi ? 'सभी ऑर्डर विवरण' : 'All Orders Detail')}
                      {statModal === 'ongoing' && (isHindi ? 'चल रहे ऑर्डर' : 'Ongoing Orders')}
                      {statModal === 'completed' && (isHindi ? 'पूर्ण ऑर्डर' : 'Completed Orders')}
                      {statModal === 'saved' && (isHindi ? 'सहेजे गए उत्पाद' : 'Saved Products')}
                    </h2>
                    <p className="text-white/80 text-xs mt-0.5">{user?.name || 'Amit Sharma'} — {isHindi ? 'खरीदार डैशबोर्ड' : 'Buyer Dashboard'}</p>
                  </div>
                </div>
                <button onClick={() => setStatModal(null)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                  <span className="text-white font-bold text-sm">✕</span>
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">

              {buyerToast && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold animate-in fade-in flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{buyerToast}</span>
                </div>
              )}

              {/* All Orders */}
              {statModal === 'orders' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setOrderFilter('All')}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${orderFilter === 'All' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-700'}`}
                    >
                      <div>5</div>
                      <div className="text-[10px] font-normal">{isHindi ? 'सभी' : 'All'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('Ongoing')}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${orderFilter === 'Ongoing' ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700'}`}
                    >
                      <div>2</div>
                      <div className="text-[10px] font-normal">{isHindi ? 'चल रहे' : 'Ongoing'}</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrderFilter('Completed')}
                      className={`p-2 rounded-xl text-center border text-xs font-bold transition-all ${orderFilter === 'Completed' ? 'bg-emerald-700 text-white' : 'bg-emerald-50 text-emerald-700'}`}
                    >
                      <div>3</div>
                      <div className="text-[10px] font-normal">{isHindi ? 'पूर्ण' : 'Completed'}</div>
                    </button>
                  </div>

                  {[
                    { id: '1', farmer: 'Ramesh Kumar', phone: '+91 98234 11029', product: 'Fresh Tomato', qty: '100 kg', status: 'In Transit', date: '16 Oct 2026', amount: '₹1,800', type: 'Ongoing', avatar: '/images/ramesh.jpg' },
                    { id: '2', farmer: 'Harpreet Singh', phone: '+91 98142 09876', product: 'Basmati Rice (1121)', qty: '500 kg', status: pendingOrderStatus, date: '20 Oct 2026', amount: '₹22,500', type: 'Ongoing', avatar: '/images/harpreet.jpg' },
                    { id: '3', farmer: 'Suresh Yadav', phone: '+91 94150 82741', product: 'Nashik Red Onion', qty: '200 kg', status: 'Delivered', date: '13 Oct 2026', amount: '₹4,000', type: 'Completed', avatar: '/images/suresh.jpg' },
                    { id: '4', farmer: 'Anil Patel', phone: '+91 94265 31780', product: 'Groundnut (Bold)', qty: '300 kg', status: 'Delivered', date: '5 Oct 2026', amount: '₹12,000', type: 'Completed', avatar: '/images/anil.jpg' },
                    { id: '5', farmer: 'Sunita Devi', phone: '+91 94250 77891', product: 'Wheat (Grade A)', qty: '400 kg', status: 'Delivered', date: '1 Oct 2026', amount: '₹8,800', type: 'Completed', avatar: '/images/sunita.jpg' },
                  ].filter(o => {
                    if (orderFilter === 'All') return true;
                    return o.type === orderFilter;
                  }).map((o) => (
                    <div key={o.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900">{o.product}</div>
                          <div className="text-gray-500 mt-0.5 flex items-center space-x-1">
                            <span className="text-emerald-700 font-bold">{o.farmer}</span>
                            <span>· {o.phone}</span>
                          </div>
                          <div className="text-gray-400 text-[11px]">{o.qty} · {o.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-extrabold text-gray-900">{o.amount}</div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
                            o.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                            o.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                            'bg-red-100 text-red-800'
                          }`}>{o.status}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: o.farmer, phone: o.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: o.avatar },
                            mode: 'call'
                          })}
                          className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-bold hover:bg-emerald-100 flex items-center space-x-1"
                        >
                          <Phone className="w-2.5 h-2.5" />
                          <span>{isHindi ? 'कॉल' : 'Call'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: o.farmer, phone: o.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: o.avatar },
                            mode: 'message'
                          })}
                          className="px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 flex items-center space-x-1"
                        >
                          <MessageSquare className="w-2.5 h-2.5" />
                          <span>{isHindi ? 'संदेश' : 'Msg'}</span>
                        </button>

                        {o.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              setPendingOrderStatus('Cancelled');
                              setBuyerToast(isHindi ? 'ऑर्डर रद्द कर दिया गया।' : 'Order cancelled.');
                              setTimeout(() => setBuyerToast(''), 3500);
                            }}
                            className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 border border-red-200"
                          >
                            {isHindi ? 'रद्द करें' : 'Cancel'}
                          </button>
                        )}

                        {o.status === 'In Transit' && (
                          <button
                            type="button"
                            onClick={() => setSelectedOrder({
                              _id: `BUYER_${o.id}`,
                              productTitle: o.product,
                              quantity: parseInt(o.qty),
                              status: 'In Transit',
                              totalPrice: parseInt(o.amount.replace(/[^0-9]/g, '')),
                              productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200',
                              farmer: { name: o.farmer, phone: o.phone, location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                              buyer: { name: user?.name || 'Amit Sharma', phone: user?.phone || '+91 98110 54321', location: { city: 'Delhi', address: 'Azadpur Mandi, Delhi' } },
                              trackingSteps: [
                                { title: 'Order Placed & Escrow Secured', time: '15 Oct 2026', completed: true },
                                { title: 'Farmer Dispatched Batch', time: '16 Oct 2026', completed: true },
                                { title: 'In Transit to Destination Mandi', time: 'In Transit', completed: true },
                                { title: 'Delivered', time: 'Expected Today', completed: false }
                              ]
                            })}
                            className="px-2 py-1 bg-blue-700 text-white rounded-lg text-[10px] font-bold hover:bg-blue-800"
                          >
                            {t('trackBtn')}
                          </button>
                        )}

                        {o.status === 'Delivered' && (
                          <button
                            type="button"
                            onClick={() => setReviewOrder({
                              _id: `BUYER_${o.id}`,
                              productTitle: o.product,
                              farmer: { name: o.farmer }
                            })}
                            className="px-2 py-1 bg-amber-50 text-amber-800 rounded-lg text-[10px] font-bold hover:bg-amber-100 border border-amber-200 flex items-center space-x-1"
                          >
                            <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                            <span>{isHindi ? 'समीक्षा दें' : 'Review'}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Ongoing Orders */}
              {statModal === 'ongoing' && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-2xl border border-blue-100">{isHindi ? '🚚 ये 2 ऑर्डर अभी रास्ते में हैं या पुष्टि के अधीन हैं:' : '🚚 Currently active orders under fulfillment:'}</p>
                  {[
                    { id: '1', farmer: 'Ramesh Kumar', phone: '+91 98234 11029', product: 'Fresh Tomato', qty: '100 kg', status: 'In Transit', eta: 'Expected: Today, 02:00 PM', amount: '₹1,800', from: 'Nashik, Maharashtra', to: user?.location?.address || 'Azadpur Mandi, Delhi', avatar: '/images/ramesh.jpg' },
                    { id: '2', farmer: 'Harpreet Singh', phone: '+91 98142 09876', product: 'Basmati Rice (1121)', qty: '500 kg', status: pendingOrderStatus, eta: 'Awaiting dispatch confirmation', amount: '₹22,500', from: 'Ludhiana, Punjab', to: user?.location?.address || 'Azadpur Mandi, Delhi', avatar: '/images/harpreet.jpg' },
                  ].map((o) => (
                    <div key={o.id} className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-900 text-sm">{o.product} — {o.qty}</div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${o.status === 'In Transit' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{o.status}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                        <Phone className="w-3 h-3" />
                        <span>{o.farmer} — {o.phone}</span>
                      </div>
                      <div className="text-gray-500 text-[11px]">📍 {isHindi ? 'से:' : 'From:'} {o.from} → {isHindi ? 'को:' : 'To:'} {o.to}</div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-gray-400">{o.eta}</span>
                        <span className="font-extrabold text-gray-900">{o.amount}</span>
                      </div>

                      <div className="flex items-center justify-end space-x-1.5 pt-2 border-t border-blue-100/60">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: o.farmer, phone: o.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: o.avatar },
                            mode: 'call'
                          })}
                          className="px-2.5 py-1 bg-white text-emerald-700 rounded-lg text-[10px] font-bold border border-gray-200 hover:bg-emerald-50"
                        >
                          {isHindi ? 'कॉल' : 'Call'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: o.farmer, phone: o.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: o.avatar },
                            mode: 'message'
                          })}
                          className="px-2.5 py-1 bg-white text-blue-700 rounded-lg text-[10px] font-bold border border-gray-200 hover:bg-blue-50"
                        >
                          {isHindi ? 'संदेश' : 'Msg'}
                        </button>
                        {o.status === 'Pending' ? (
                          <button
                            type="button"
                            onClick={() => {
                              setPendingOrderStatus('Cancelled');
                              setBuyerToast(isHindi ? 'ऑर्डर रद्द कर दिया गया।' : 'Order cancelled.');
                              setTimeout(() => setBuyerToast(''), 3500);
                            }}
                            className="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold hover:bg-red-100 border border-red-200"
                          >
                            {isHindi ? 'रद्द करें' : 'Cancel'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedOrder({
                              _id: `BUYER_ONGOING_${o.id}`,
                              productTitle: o.product,
                              quantity: parseInt(o.qty),
                              status: 'In Transit',
                              totalPrice: parseInt(o.amount.replace(/[^0-9]/g, '')),
                              productImage: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200',
                              farmer: { name: o.farmer, phone: o.phone, location: { city: 'Nashik', state: 'Maharashtra', address: 'Gat No. 142, Pimpalgaon Baswant, Niphad, Nashik - 422209' } },
                              buyer: { name: user?.name || 'Amit Sharma', phone: user?.phone || '+91 98110 54321', location: { city: 'Delhi', address: 'Azadpur Mandi, Delhi' } },
                              trackingSteps: [
                                { title: 'Order Placed & Escrow Secured', time: '15 Oct 2026', completed: true },
                                { title: 'Farmer Dispatched Batch', time: '16 Oct 2026', completed: true },
                                { title: 'In Transit to Destination Mandi', time: 'In Transit', completed: true },
                                { title: 'Delivered', time: 'Expected Today', completed: false }
                              ]
                            })}
                            className="px-2.5 py-1 bg-blue-700 text-white rounded-lg text-[10px] font-bold hover:bg-blue-800"
                          >
                            {t('trackBtn')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completed Orders */}
              {statModal === 'completed' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs font-bold text-emerald-700">
                    ✅ {isHindi ? `कुल 3 ऑर्डर सफलतापूर्वक डिलीवर हो चुके हैं।` : `3 orders delivered successfully.`}
                  </div>
                  {[
                    { id: '1', farmer: 'Suresh Yadav', phone: '+91 94150 82741', product: 'Nashik Red Onion', qty: '200 kg', date: '13 Oct 2026', amount: '₹4,000', rating: 5, avatar: '/images/suresh.jpg' },
                    { id: '2', farmer: 'Anil Patel', phone: '+91 94265 31780', product: 'Groundnut (Bold)', qty: '300 kg', date: '5 Oct 2026', amount: '₹12,000', rating: 4, avatar: '/images/anil.jpg' },
                    { id: '3', farmer: 'Sunita Devi', phone: '+91 94250 77891', product: 'Wheat (Grade A)', qty: '400 kg', date: '1 Oct 2026', amount: '₹8,800', rating: 5, avatar: '/images/sunita.jpg' },
                  ].map((o) => (
                    <div key={o.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-gray-900">{o.product} — {o.qty}</div>
                        <span className="text-yellow-500">{'⭐'.repeat(o.rating)}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-emerald-700 font-bold">
                        <Phone className="w-3 h-3" />
                        <span>{o.farmer} — {o.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-500">
                        <span>{o.date}</span>
                        <span className="font-extrabold text-gray-900">{o.amount}</span>
                      </div>

                      <div className="flex items-center justify-end space-x-1.5 pt-1 border-t border-gray-100">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: o.farmer, phone: o.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: o.avatar },
                            mode: 'call'
                          })}
                          className="px-2 py-1 bg-white text-emerald-700 rounded-lg text-[10px] font-bold border border-gray-200 hover:bg-emerald-50"
                        >
                          {isHindi ? 'कॉल' : 'Call'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: o.farmer, phone: o.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: o.avatar },
                            mode: 'message'
                          })}
                          className="px-2 py-1 bg-white text-blue-700 rounded-lg text-[10px] font-bold border border-gray-200 hover:bg-blue-50"
                        >
                          {isHindi ? 'संदेश' : 'Msg'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewOrder({
                            _id: `BUYER_COMPLETED_${o.id}`,
                            productTitle: o.product,
                            farmer: { name: o.farmer }
                          })}
                          className="px-2.5 py-1 bg-amber-50 text-amber-800 rounded-lg text-[10px] font-bold hover:bg-amber-100 border border-amber-200 flex items-center space-x-1"
                        >
                          <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                          <span>{isHindi ? 'समीक्षा लिखें' : 'Write Review'}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Saved Products - All 12 items matching the number 12! */}
              {statModal === 'saved' && (
                <div className="space-y-3">
                  <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-xs font-bold text-purple-800">
                    🔖 {isHindi ? 'कुल 12 फसलें आपने पसंदीदा सूची में सहेजी हैं:' : '12 crops saved in your procurement watchlist:'}
                  </div>
                  {[
                    { id: 1, farmer: 'Rajesh Choudhary', phone: '+91 94140 33567', product: 'Isabgol (Psyllium Husk)', location: 'Jaipur, Rajasthan', pricePerKg: 180, qty: '500 kg', img: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=80&auto=format&fit=crop&q=80', avatar: '/images/rajesh.jpg' },
                    { id: 2, farmer: 'Harpreet Singh', phone: '+91 98142 09876', product: 'Basmati Rice (1121)', location: 'Ludhiana, Punjab', pricePerKg: 45, qty: '2000 kg', img: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=80&auto=format&fit=crop&q=80', avatar: '/images/harpreet.jpg' },
                    { id: 3, farmer: 'Sunita Devi', phone: '+91 94250 77891', product: 'Chickpea (Desi Chana)', location: 'Bhopal, MP', pricePerKg: 55, qty: '800 kg', img: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=80&auto=format&fit=crop&q=80', avatar: '/images/sunita.jpg' },
                    { id: 4, farmer: 'Anil Patel', phone: '+91 94265 31780', product: 'Groundnut (Bold)', location: 'Anand, Gujarat', pricePerKg: 40, qty: '1200 kg', img: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=80&auto=format&fit=crop&q=80', avatar: '/images/anil.jpg' },
                    { id: 5, farmer: 'Ramesh Kumar', phone: '+91 98234 11029', product: 'Pomegranate (Bhagwa)', location: 'Nashik, Maharashtra', pricePerKg: 95, qty: '300 kg', img: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=80&auto=format&fit=crop&q=80', avatar: '/images/ramesh.jpg' },
                    { id: 6, farmer: 'Suresh Yadav', phone: '+91 94150 82741', product: 'Mustard Seeds (Sarson)', location: 'Bharatpur, Rajasthan', pricePerKg: 65, qty: '450 kg', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=80&auto=format&fit=crop&q=80', avatar: '/images/suresh.jpg' },
                    { id: 7, farmer: 'Ramesh Kumar', phone: '+91 98234 11029', product: 'Green Grapes (Thompson)', location: 'Nashik, Maharashtra', pricePerKg: 65, qty: '200 kg', img: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=80&auto=format&fit=crop&q=80', avatar: '/images/ramesh.jpg' },
                    { id: 8, farmer: 'Rajesh Choudhary', phone: '+91 94140 33567', product: 'Cumin (Jeera)', location: 'Nagaur, Rajasthan', pricePerKg: 240, qty: '350 kg', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=80&auto=format&fit=crop&q=80', avatar: '/images/rajesh.jpg' },
                    { id: 9, farmer: 'Anil Patel', phone: '+91 94265 31780', product: 'Cotton (Shankar-6)', location: 'Rajkot, Gujarat', pricePerKg: 72, qty: '1500 kg', img: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=80&auto=format&fit=crop&q=80', avatar: '/images/anil.jpg' },
                    { id: 10, farmer: 'Sunita Devi', phone: '+91 94250 77891', product: 'Soybean (Yellow)', location: 'Indore, MP', pricePerKg: 46, qty: '900 kg', img: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=80&auto=format&fit=crop&q=80', avatar: '/images/sunita.jpg' },
                    { id: 11, farmer: 'Harpreet Singh', phone: '+91 98142 09876', product: 'Wheat (Sharbati)', location: 'Ludhiana, Punjab', pricePerKg: 28, qty: '3000 kg', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=80&auto=format&fit=crop&q=80', avatar: '/images/harpreet.jpg' },
                    { id: 12, farmer: 'Suresh Yadav', phone: '+91 94150 82741', product: 'Turmeric (Salem Finger)', location: 'Sangli, Maharashtra', pricePerKg: 130, qty: '400 kg', img: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=80&auto=format&fit=crop&q=80', avatar: '/images/suresh.jpg' }
                  ].map((p, i) => (
                    <div key={p.id || i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs hover:border-purple-200 transition-colors">
                      <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <img
                        src={p.img}
                        alt={p.product}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80&auto=format&fit=crop&q=80'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-900 truncate text-xs">{p.product}</div>
                        <div className="text-emerald-700 font-bold">₹{p.pricePerKg}/kg · {p.qty}</div>
                        <div className="flex items-center space-x-1 text-gray-500 mt-0.5 text-[11px]">
                          <span className="text-blue-600 font-bold">{p.farmer}</span>
                          <span>· {p.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => setContactModal({
                            contact: { name: p.farmer, phone: p.phone, role: isHindi ? 'किसान' : 'Farmer', avatar: p.avatar },
                            mode: 'call'
                          })}
                          className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100"
                          title="Call Farmer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBuyerToast(isHindi ? `✓ ${p.product} के लिए सीधा ऑर्डर ड्राफ्ट तैयार!` : `✓ Direct order draft prepared for ${p.product}!`);
                            setTimeout(() => setBuyerToast(''), 3500);
                          }}
                          className="px-2.5 py-1.5 bg-emerald-700 text-white rounded-xl text-[10px] font-bold hover:bg-emerald-800"
                        >
                          {isHindi ? 'ऑर्डर' : 'Order'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button
                onClick={() => setStatModal(null)}
                className="px-5 py-2 bg-blue-700 text-white rounded-xl text-xs font-bold hover:bg-blue-800 transition-colors"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Contact Modal (Call & WhatsApp & Message) */}
      {contactModal && (
        <DirectContactModal
          contact={contactModal.contact}
          initialMode={contactModal.mode}
          onClose={() => setContactModal(null)}
        />
      )}

      {/* Write Review Modal */}
      {reviewOrder && (
        <WriteReviewModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={() => {
            setBuyerToast(isHindi ? 'आपकी समीक्षा सफलतापूर्वक सबमिट हो गई!' : 'Your review was submitted successfully!');
            setTimeout(() => setBuyerToast(''), 4000);
          }}
        />
      )}

    </div>
  );
};
