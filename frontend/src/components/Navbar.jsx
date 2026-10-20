import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api';
import { 
  Sprout, 
  ShoppingBag, 
  ChevronDown, 
  LayoutDashboard, 
  TrendingUp, 
  Sparkles, 
  LogOut,
  SlidersHorizontal,
  Globe,
  Users,
  Camera,
  Check,
  X,
  User as UserIcon,
  MapPin,
  Phone
} from 'lucide-react';

const sanitizeAvatar = (avatar, role) => {
  if (!avatar || avatar.includes('1544717305') || avatar.includes('1534528741') || avatar.includes('unsplash.com/photo-')) {
    if (role === 'buyer') return '/images/amit.jpg';
    if (role === 'admin') return '/images/admin.jpg';
    return '/images/ramesh.jpg';
  }
  return avatar;
};

const INDIAN_FARMER_PHOTOS = [
  { name: 'Ramesh Kumar', state: 'Nashik, Maharashtra', url: '/images/ramesh.jpg' },
  { name: 'Suresh Yadav', state: 'Varanasi, UP', url: '/images/suresh.jpg' },
  { name: 'Sunita Devi', state: 'Bhopal, MP', url: '/images/sunita.jpg' },
  { name: 'Anil Patel', state: 'Anand, Gujarat', url: '/images/anil.jpg' },
  { name: 'Rajesh Choudhary', state: 'Jaipur, Rajasthan', url: '/images/rajesh.jpg' },
  { name: 'Harpreet Singh', state: 'Ludhiana, Punjab', url: '/images/harpreet.jpg' }
];

const INDIAN_BUYER_PHOTOS = [
  { name: 'Amit Sharma', state: 'Azadpur Mandi, Delhi', url: '/images/amit.jpg' },
  { name: 'Karan Mehta', state: 'APMC Vashi, Mumbai', url: '/images/karan.jpg' },
  { name: 'Priya Verma', state: 'Agro Hub, Bangalore', url: '/images/priya.jpg' },
  { name: 'Rohit Singh', state: 'Galla Mandi, Lucknow', url: '/images/rohit.jpg' }
];

export const Navbar = () => {
  const { user, logout, switchRole, updateUser } = useAuth();
  const { totalItemsCount } = useCart();
  const { t, lang, toggleLanguage, isHindi } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [photoSuccessMsg, setPhotoSuccessMsg] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);

  const handleOpenPhotoModal = () => {
    setSelectedAvatar(sanitizeAvatar(user?.avatar, user?.role));
    setCustomUrl('');
    setUserMenuOpen(false);
    setPhotoModalOpen(true);
  };

  const handleSavePhoto = async () => {
    setSavingPhoto(true);
    const targetAvatar = customUrl.trim() || selectedAvatar;
    try {
      await api.updateProfile({
        userId: user?._id,
        role: user?.role,
        avatar: targetAvatar
      });
      updateUser({ avatar: targetAvatar });
      setPhotoSuccessMsg(true);
      setTimeout(() => {
        setPhotoSuccessMsg(false);
        setPhotoModalOpen(false);
      }, 1200);
    } catch (err) {
      alert(err.message || 'Error updating photo');
    } finally {
      setSavingPhoto(false);
    }
  };

  const getNavLinks = () => {
    if (user?.role === 'farmer') {
      return [
        { name: isHindi ? '🌾 किसान डैशबोर्ड' : 'Farmer Dashboard', path: '/farmer-dashboard' },
        { name: t('navProducts'), path: '/products' },
        { name: t('navPriceTrends'), path: '/price-trends' },
        { name: t('navCropAdvice'), path: '/crop-recommendation' },
      ];
    }
    if (user?.role === 'buyer') {
      return [
        { name: isHindi ? '🛒 बायर डैशबोर्ड' : 'Buyer Dashboard', path: '/buyer-dashboard' },
        { name: t('navProducts'), path: '/products' },
        { name: t('navFarmers'), path: '/farmers' },
        { name: t('navPriceTrends'), path: '/price-trends' },
        { name: t('navDemand'), path: '/demand-prediction' },
      ];
    }
    if (user?.role === 'admin') {
      return [
        { name: isHindi ? '⚡ एडमिन डैशबोर्ड' : 'Admin Dashboard', path: '/admin-dashboard' },
        { name: t('navProducts'), path: '/products' },
        { name: t('navFarmers'), path: '/farmers' },
        { name: t('navPriceTrends'), path: '/price-trends' },
      ];
    }
    return [
      { name: t('navHome'), path: '/' },
      { name: t('navProducts'), path: '/products' },
      { name: t('navFarmers'), path: '/farmers' },
      { name: t('navPriceTrends'), path: '/price-trends' },
      { name: t('navAbout'), path: '/about' },
    ];
  };

  const navLinks = getNavLinks();

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'farmer') return '/farmer-dashboard';
    if (user.role === 'buyer') return '/buyer-dashboard';
    if (user.role === 'admin') return '/admin-dashboard';
    return '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-green-700 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-green-600/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-green-700 transition-colors">
                Agri<span className="text-green-600">Connect</span>
              </span>
            </div>
          </Link>

          {/* Main Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-bold transition-colors px-3 py-2 rounded-lg ${
                    isActive
                      ? 'text-green-700 bg-green-50 font-extrabold'
                      : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Hand Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Switcher Button (हिन्दी / English) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-all shadow-xs"
              title="भाषा बदलें / Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-700" />
              <span>{isHindi ? 'English' : '🇮🇳 हिन्दी'}</span>
            </button>

            {/* Cart Icon - Visible only for buyers or guests */}
            {user?.role !== 'farmer' && (
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full text-gray-600 hover:text-green-700 hover:bg-green-50 transition-colors"
                title={t('navCart')}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-green-600 text-white text-[11px] font-bold flex items-center justify-center shadow">
                    {totalItemsCount}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile or Login */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  title="Profile Menu"
                >
                  <img
                    src={sanitizeAvatar(user?.avatar, user?.role)}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-600/40 shadow-xs"
                  />
                  <span className="hidden lg:block text-xs font-bold text-gray-800 pr-1">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden lg:block" />
                </button>

                {userMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 text-xs animate-in fade-in duration-100"
                    onMouseLeave={() => setUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-gray-100 flex items-center space-x-3">
                      <img
                        src={sanitizeAvatar(user?.avatar, user?.role)}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-emerald-700 font-medium capitalize">{user.role} • {user.location?.city || 'India'}</p>
                      </div>
                    </div>

                    {/* Change Profile Photo Button */}
                    <div className="p-1.5">
                      <button
                        onClick={handleOpenPhotoModal}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold transition-colors"
                      >
                        <Camera className="w-4 h-4 text-emerald-700" />
                        <span>{isHindi ? 'फोटो बदलें (Change Photo)' : 'Change Profile Photo'}</span>
                      </button>
                    </div>

                    <Link
                      to={getDashboardPath()}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 font-semibold"
                    >
                      <LayoutDashboard className="w-4 h-4 text-gray-400" />
                      <span>{user.role === 'farmer' ? t('farmerDash') : user.role === 'buyer' ? t('buyerDash') : t('adminDash')}</span>
                    </Link>

                    <Link
                      to={`${getDashboardPath()}?tab=profile`}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 font-semibold"
                    >
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span>{isHindi ? 'पूरी प्रोफाइल व संपर्क सेटिंग्स' : 'Profile & Contact Details'}</span>
                    </Link>

                    <Link
                      to="/price-trends"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 font-semibold"
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span>{t('priceTrendTitle')}</span>
                    </Link>

                    <Link
                      to="/crop-recommendation"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-700 font-semibold"
                    >
                      <Sparkles className="w-4 h-4 text-gray-400" />
                      <span>{t('cropRecTitle')}</span>
                    </Link>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); navigate('/login'); }}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t('navLogout')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-gray-700 hover:text-green-700 px-2.5 py-1.5 rounded-xl transition-colors hover:bg-gray-100"
                >
                  {isHindi ? '🔐 लॉगिन' : 'Sign In'}
                </Link>
                <Link
                  to="/register?role=farmer"
                  className="text-xs font-bold text-emerald-800 bg-emerald-100/80 hover:bg-emerald-200 px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center space-x-1"
                >
                  <span>🌾 {isHindi ? 'किसान रजिस्टर' : 'Farmer Reg'}</span>
                </Link>
                <Link
                  to="/register?role=buyer"
                  className="text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center space-x-1"
                >
                  <span>🛒 {isHindi ? 'खरीदार रजिस्टर' : 'Buyer Reg'}</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Direct Navbar Photo Change Modal */}
      {photoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100 p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center space-x-2">
                <Camera className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-gray-900 text-base">
                  {isHindi ? 'प्रोफाइल फोटो बदलें' : 'Change Profile Photo'}
                </h3>
              </div>
              <button onClick={() => setPhotoModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {photoSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isHindi ? 'प्रोफाइल फोटो सफलतापूर्वक अपडेट हो गई!' : 'Profile photo updated successfully!'}</span>
              </div>
            )}

            {/* Current Selected Preview */}
            <div className="flex items-center space-x-4 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <img
                src={customUrl.trim() || selectedAvatar || sanitizeAvatar(user?.avatar, user?.role)}
                alt="Selected"
                className="w-16 h-16 rounded-full object-cover ring-4 ring-emerald-500/30 shadow-md"
              />
              <div>
                <p className="font-bold text-gray-900 text-sm">{user?.name}</p>
                <p className="text-xs text-emerald-700 font-semibold capitalize">{user?.role} • {user?.location?.city || 'India'}</p>
                <p className="text-[11px] text-gray-500 mt-0.5">{isHindi ? 'नीचे से असली भारतीय फोटो चुनें या अपना URL डालें' : 'Select an authentic Indian photo below or enter URL'}</p>
              </div>
            </div>

            {/* 1-Click Authentic Indian Photo Presets */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-2">
                {isHindi ? '1-क्लिक भारतीय फोटो चुनें:' : '1-Click Select Authentic Indian Portrait:'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {(user?.role === 'buyer' ? INDIAN_BUYER_PHOTOS : INDIAN_FARMER_PHOTOS).map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => { setSelectedAvatar(item.url); setCustomUrl(''); }}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all p-1 text-center ${
                      (selectedAvatar === item.url && !customUrl) ? 'border-emerald-600 ring-2 ring-emerald-600/30 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img src={item.url} alt={item.name} className="w-full h-14 rounded-lg object-cover" />
                    <span className="block text-[10px] text-gray-700 font-medium truncate mt-1">{item.name.split(' ')[0]}</span>
                    {selectedAvatar === item.url && !customUrl && (
                      <span className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Photo URL Input */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {isHindi ? 'या कस्टम फोटो यूआरएल (URL) दर्ज करें:' : 'Or Enter Custom Photo URL:'}
              </label>
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://... or /images/..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setPhotoModalOpen(false)}
                className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                disabled={savingPhoto}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center space-x-1.5 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{savingPhoto ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'फोटो सहेजें' : 'Save Photo')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
