import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sprout, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  BarChart3, 
  Sparkles, 
  MessageSquare, 
  Star, 
  UserCheck, 
  Users, 
  FileText, 
  LogOut, 
  ArrowLeft,
  User,
  Globe
} from 'lucide-react';

const sanitizeAvatar = (avatar, role) => {
  if (!avatar || avatar.includes('1544717305') || avatar.includes('1534528741') || avatar.includes('unsplash.com/photo-')) {
    if (role === 'buyer') return '/images/amit.jpg';
    if (role === 'admin') return '/images/admin.jpg';
    return '/images/ramesh.jpg';
  }
  return avatar;
};

export const Sidebar = ({ currentSection = 'dashboard', title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const { t, isHindi, toggleLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || 'farmer';

  let navItems = [];

  if (role === 'farmer') {
    navItems = [
      { name: isHindi ? 'डैशबोर्ड' : 'Dashboard', path: '/farmer-dashboard', icon: LayoutDashboard },
      { name: isHindi ? 'मेरी फसलें' : 'My Products', path: '/farmer-dashboard?tab=products', icon: Package },
      { name: isHindi ? 'ऑर्डर' : 'Orders', path: '/farmer-dashboard?tab=orders', icon: ShoppingBag },
      { name: isHindi ? 'भाव रुझान' : 'Price Trends', path: '/price-trends', icon: TrendingUp },
      { name: isHindi ? 'फसल सलाह' : 'Crop Recommendation', path: '/crop-recommendation', icon: Sparkles },
      { name: isHindi ? 'मोलभाव संदेश' : 'Messages', path: '/farmer-dashboard?tab=messages', icon: MessageSquare },
      { name: isHindi ? 'समीक्षाएं' : 'Reviews', path: '/farmer-dashboard?tab=reviews', icon: Star },
      { name: isHindi ? 'प्रोफाइल' : 'Profile', path: '/farmer-dashboard?tab=profile', icon: User },
    ];
  } else if (role === 'buyer') {
    navItems = [
      { name: isHindi ? 'डैशबोर्ड' : 'Dashboard', path: '/buyer-dashboard', icon: LayoutDashboard },
      { name: isHindi ? 'मेरे ऑर्डर' : 'My Orders', path: '/buyer-dashboard?tab=orders', icon: ShoppingBag },
      { name: isHindi ? 'सहेजे उत्पाद' : 'Saved Products', path: '/products', icon: Package },
      { name: isHindi ? 'मोलभाव बोलियां' : 'Messages', path: '/buyer-dashboard?tab=messages', icon: MessageSquare },
      { name: isHindi ? 'भाव रुझान' : 'Price Trends', path: '/price-trends', icon: TrendingUp },
      { name: isHindi ? 'फसल मांग' : 'Crop Demand', path: '/demand-prediction', icon: BarChart3 },
      { name: isHindi ? 'प्रोफाइल' : 'Profile', path: '/buyer-dashboard?tab=profile', icon: User },
    ];
  } else if (role === 'admin') {
    navItems = [
      { name: isHindi ? 'डैशबोर्ड' : 'Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
      { name: isHindi ? 'उपयोगकर्ता' : 'Manage Users', path: '/admin-dashboard?tab=users', icon: Users },
      { name: isHindi ? 'किसान सत्यापन' : 'Verify Farmers', path: '/admin-dashboard?tab=verify', icon: UserCheck },
      { name: isHindi ? 'फसलें प्रबंधित करें' : 'Manage Products', path: '/products', icon: Package },
      { name: isHindi ? 'ऑर्डर' : 'Orders', path: '/admin-dashboard?tab=orders', icon: ShoppingBag },
      { name: isHindi ? 'रिपोर्ट्स' : 'Reports', path: '/admin-dashboard?tab=reports', icon: FileText },
      { name: isHindi ? 'भाव डेटा' : 'Price Data', path: '/price-trends', icon: TrendingUp },
      { name: isHindi ? 'फीडबैक' : 'Feedback', path: '/admin-dashboard?tab=feedback', icon: Star },
    ];
  }

  return (
    <aside className="w-64 bg-[#0d4a2b] text-white flex flex-col flex-shrink-0 min-h-screen border-r border-[#09351e] shadow-xl">
      
      {/* Brand Header */}
      <div className="p-6 flex items-center justify-between border-b border-emerald-800/60">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-emerald-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">AgriConnect</span>
        </Link>
      </div>

      {/* User Profile Card */}
      <div className="px-5 py-4 border-b border-emerald-800/40 bg-emerald-950/20">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={sanitizeAvatar(user?.avatar, role)}
              alt={user?.name}
              className="w-11 h-11 rounded-full object-cover border-2 border-emerald-400"
            />
            {user?.isVerified && (
              <span className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white rounded-full p-0.5">
                <span className="w-2.5 h-2.5 block bg-white rounded-full"></span>
              </span>
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{user?.name || 'Ramesh Kumar'}</h4>
            <p className="text-xs text-emerald-300 font-medium capitalize">
              {role === 'farmer' ? (isHindi ? 'किसान' : 'Farmer') : role === 'buyer' ? (isHindi ? 'थोक खरीदार' : 'Buyer') : (isHindi ? 'व्यवस्थापक' : 'Administrator')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname + location.search) === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-emerald-600/90 text-white font-bold shadow-inner'
                  : 'text-emerald-100 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-300'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Quick Agri Analytics Cross Links */}
        <div className="pt-4 mt-4 border-t border-emerald-800/40">
          <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-emerald-400/80 mb-1.5">
            {isHindi ? 'डिजिटल कृषि एवं मंडी सेवाएं' : 'Digital Krishi Services'}
          </div>
          <Link
            to="/price-trends"
            className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium ${
              location.pathname === '/price-trends' ? 'bg-emerald-600/90 text-white font-bold' : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'मंडी भाव रुझान' : 'Price Trend Analysis'}</span>
          </Link>
          <Link
            to="/demand-prediction"
            className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium ${
              location.pathname === '/demand-prediction' ? 'bg-emerald-600/90 text-white font-bold' : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'मांग पूर्वानुमान' : 'Demand Prediction'}</span>
          </Link>
          <Link
            to="/crop-recommendation"
            className={`flex items-center space-x-3 px-3.5 py-2 rounded-xl text-xs font-medium ${
              location.pathname === '/crop-recommendation' ? 'bg-emerald-600/90 text-white font-bold' : 'text-emerald-200 hover:bg-emerald-800/40'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{isHindi ? 'फसल चयन सलाह' : 'Crop Recommendation'}</span>
          </Link>
        </div>
      </nav>

      {/* Footer Navigation (Language Switch, Logout & Return to Store) */}
      <div className="p-4 border-t border-emerald-800/40 space-y-2">
        <button
          onClick={toggleLanguage}
          className="w-full flex items-center justify-between text-xs text-amber-200 bg-emerald-950/40 border border-emerald-700/50 px-3 py-2 rounded-xl hover:bg-emerald-800/40 transition-colors font-bold"
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5" />
            <span>{isHindi ? 'भाषा: हिन्दी' : 'Language: English'}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 text-white px-2 py-0.5 rounded-md">
            {isHindi ? 'English करें' : 'हिन्दी करें'}
          </span>
        </button>

        <Link
          to="/products"
          className="flex items-center space-x-2 text-xs text-emerald-200 hover:text-white px-2 py-1.5 rounded-lg hover:bg-emerald-800/30 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{isHindi ? 'मंडी बाज़ार देखें' : 'Browse Marketplace'}</span>
        </Link>
        <button
          onClick={() => { logout(); navigate('/login'); }}
          className="w-full flex items-center space-x-2 text-xs text-red-300 hover:text-red-100 px-2 py-1.5 rounded-lg hover:bg-red-950/30 transition-colors font-bold"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span>{t('navLogout')}</span>
        </button>
      </div>

    </aside>
  );
};
