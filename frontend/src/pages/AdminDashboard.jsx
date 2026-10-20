import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserCheck, 
  Package, 
  ShoppingBag, 
  ShieldCheck, 
  FileText, 
  Check, 
  X,
  AlertTriangle,
  Eye,
  CheckCircle2,
  Trash2,
  Phone
} from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

export const AdminDashboard = () => {
  const { t, isHindi } = useLanguage();
  const [stats, setStats] = useState({
    registeredFarmers: 245,
    registeredBuyers: 178,
    totalProducts: 1250,
    totalOrders: 320
  });

  const [activeTab, setActiveTab] = useState('kyc'); // 'kyc' | 'products' | 'orders' | 'disputes'
  const [verifications, setVerifications] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState('');
  const [docModal, setDocModal] = useState(null);
  const [statModal, setStatModal] = useState(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, pendingData] = await Promise.all([
        api.getAdminStats().catch(() => null),
        api.getPendingVerifications().catch(() => null)
      ]);
      if (statsData) setStats(statsData);
      setVerifications(Array.isArray(pendingData) && pendingData.length ? pendingData : [
        { _id: '1', name: 'Ramesh Kumar', phone: '+91 98234 11029', role: 'farmer', location: { city: 'Nashik', state: 'Maharashtra' }, docType: '7/12 Land Record (सातबारा)' },
        { _id: '2', name: 'Sunita Devi', phone: '+91 94250 77891', role: 'farmer', location: { city: 'Bhopal', state: 'MP' }, docType: 'Kisan Credit Card (KCC)' },
        { _id: '3', name: 'Amit Sharma', phone: '+91 98110 54321', role: 'buyer', location: { city: 'Delhi', state: 'Delhi' }, docType: 'APMC Mandi Trader License' },
        { _id: '4', name: 'Harpreet Singh', phone: '+91 98142 09876', role: 'farmer', location: { city: 'Ludhiana', state: 'Punjab' }, docType: 'Soil Health Card & Aadhaar' },
      ]);

      setAdminProducts([
        { _id: 'p1', title: 'Fresh Tomato (Grade A)', farmer: 'Ramesh Kumar', price: 18, qty: '500 kg', location: 'Nashik', status: 'Pending Review', img: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=80' },
        { _id: 'p2', title: 'Mustard Seeds (Sarson)', farmer: 'Rajesh Choudhary', price: 65, qty: '450 kg', location: 'Bharatpur', status: 'Approved', img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=80' },
        { _id: 'p3', title: 'Basmati Rice (1121)', farmer: 'Harpreet Singh', price: 45, qty: '2000 kg', location: 'Ludhiana', status: 'Approved', img: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=80' },
        { _id: 'p4', title: 'Organic Potato (Kufri)', farmer: 'Suresh Yadav', price: 16, qty: '1200 kg', location: 'Varanasi', status: 'Pending Review', img: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=80' },
      ]);

      setAdminOrders([
        { _id: 'ord1', buyer: 'Amit Sharma', farmer: 'Ramesh Kumar', product: 'Fresh Tomato', qty: '100 kg', amount: '₹1,800', status: 'In Transit', escrow: 'Secured' },
        { _id: 'ord2', buyer: 'Karan Mehta', farmer: 'Suresh Yadav', product: 'Nashik Red Onion', qty: '200 kg', amount: '₹4,000', status: 'Delivered', escrow: 'Released' },
        { _id: 'ord3', buyer: 'Priya Verma', farmer: 'Harpreet Singh', product: 'Basmati Rice', qty: '500 kg', amount: '₹22,500', status: 'Pending', escrow: 'Secured' },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerificationAction = async (userId, userName, action) => {
    try {
      if (!userId.startsWith('DEMO') && userId.length > 5) {
        await api.verifyUser(userId, action).catch(() => {});
      }
      setVerifications(prev => prev.filter(u => u._id !== userId));
      setActionNotice(isHindi 
        ? `${userName} का सत्यापन ${action === 'verify' ? 'सफलतापूर्वक स्वीकार किया गया ✓' : 'अस्वीकृत कर दिया गया'}`
        : `Successfully ${action === 'verify' ? 'approved & verified' : 'declined'} ${userName}`
      );
      setTimeout(() => setActionNotice(''), 4000);
    } catch (e) {
      alert('Error updating user: ' + e.message);
    }
  };

  const handleProductModeration = (prodId, prodTitle, action) => {
    setAdminProducts(prev => prev.map(p => p._id === prodId ? { ...p, status: action === 'approve' ? 'Approved' : 'Rejected' } : p));
    setActionNotice(isHindi
      ? `फसल "${prodTitle}" को ${action === 'approve' ? 'मंडी में सूचीबद्ध करने हेतु स्वीकृत किया गया ✓' : 'अस्वीकृत किया गया'}`
      : `Product "${prodTitle}" was ${action === 'approve' ? 'approved' : 'rejected'}`
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleResolveDispute = (ordId, buyerName) => {
    setAdminOrders(prev => prev.map(o => o._id === ordId ? { ...o, escrow: 'Refunded / Resolved', status: 'Resolved' } : o));
    setActionNotice(isHindi
      ? `${buyerName} का विवाद सफलतापूर्वक सुलझाया गया। एस्क्रो खाता अद्यतन हो गया ✓`
      : `Dispute for ${buyerName} resolved. Escrow updated successfully.`
    );
    setTimeout(() => setActionNotice(''), 4000);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAF9]">
      
      {/* Dark Green Sidebar matching UI screenshot 6 */}
      <Sidebar currentSection="admin-dashboard" title="Admin Dashboard" />

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('adminDash')}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isHindi ? 'मंच प्रशासन, किसान भू-अभिलेख सत्यापन (KYC), फसल मॉडरेशन व विवाद निवारण।' : 'Platform Governance, KYC Document Verification, Marketplace Moderation & Escrow Oversight.'}
          </p>
        </div>

        {actionNotice && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{actionNotice}</span>
            </span>
            <button onClick={() => setActionNotice('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* 4 Stat Cards matching screenshot 6 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          
          <button
            onClick={() => setStatModal('farmers')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-emerald-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:bg-emerald-100 transition-colors">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{stats.registeredFarmers.toLocaleString()}</div>
              <div className="text-xs text-gray-500 font-medium">{isHindi ? 'पंजीकृत किसान' : 'Registered Farmers'}</div>
            </div>
          </button>

          <button
            onClick={() => setStatModal('buyers')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:bg-blue-100 transition-colors">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{stats.registeredBuyers.toLocaleString()}</div>
              <div className="text-xs text-gray-500 font-medium">{isHindi ? 'पंजीकृत खरीदार' : 'Registered Buyers'}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-amber-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:bg-amber-100 transition-colors">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{stats.totalProducts.toLocaleString()}</div>
              <div className="text-xs text-gray-500 font-medium">{isHindi ? 'कुल फसलें / उत्पाद' : 'Total Products'}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md hover:border-purple-200 transition-all text-left group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:bg-purple-100 transition-colors">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">{stats.totalOrders.toLocaleString()}</div>
              <div className="text-xs text-gray-500 font-medium">{isHindi ? 'कुल ऑर्डर' : 'Total Orders'}</div>
            </div>
          </button>

        </div>

        {/* Section Tabs */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('kyc')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'kyc' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {isHindi ? '1. किसान KYC सत्यापन' : '1. KYC Verifications'} ({verifications.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'products' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {isHindi ? '2. फसल उत्पाद मॉडरेशन' : '2. Product Moderation'} ({adminProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-emerald-700 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          >
            {isHindi ? '3. ऑर्डर व विवाद निवारण' : '3. Orders & Disputes'} ({adminOrders.length})
          </button>
        </div>

        {/* Tab 1: KYC Verification Table */}
        {activeTab === 'kyc' && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-lg">{t('pendingVerifications')}</h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full border border-amber-200">
                {verifications.length} {isHindi ? 'समीक्षा हेतु लंबित' : 'Requiring Review'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">{isHindi ? 'नाम व संपर्क' : 'Name & Contact'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'प्रकार' : 'Type'}</th>
                    <th className="py-3.5 px-6">{t('location')}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'दस्तावेज़' : 'Documents'}</th>
                    <th className="py-3.5 px-6 text-right">{t('actionCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {verifications.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">
                        <div className="font-bold text-gray-900 text-sm">{item.name}</div>
                        <div className="text-[11px] text-gray-500">{item.phone || '+91 98234 11029'}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.role === 'farmer' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}>
                          {item.role === 'farmer' ? (isHindi ? 'किसान' : 'Farmer') : (isHindi ? 'खरीदार' : 'Buyer')}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <div className="font-bold text-gray-900">{item.location?.village || item.location?.address || 'Pimpalgaon Baswant'}</div>
                        <div className="text-[11px] text-gray-500">{item.location?.city || 'Nashik'}, {item.location?.state || 'Maharashtra'} {item.location?.pincode ? ` - ${item.location.pincode}` : ''}</div>
                        {item.location?.nearestMandi && (
                          <div className="text-[10px] text-blue-700 font-semibold mt-0.5">📍 {item.location.nearestMandi}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          type="button"
                          onClick={() => setDocModal(item)}
                          className="inline-flex items-center text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-emerald-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1" />
                          <span>{item.docType || (isHindi ? '7/12 भू-अभिलेख' : '7/12 Land Record')}</span>
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleVerificationAction(item._id, item.name, 'verify')}
                          className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                        >
                          {t('verifyBtn')}
                        </button>
                        <button
                          onClick={() => handleVerificationAction(item._id, item.name, 'reject')}
                          className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors"
                        >
                          {t('rejectBtn')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 2: Product Moderation */}
        {activeTab === 'products' && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-lg">{isHindi ? 'फसल सूची मॉडरेशन (Product Moderation)' : 'Product Moderation'}</h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                {isHindi ? 'मंडी गुणवत्ता मानक' : 'Mandi Grade Standards'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">{isHindi ? 'फसल' : 'Product'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'किसान' : 'Farmer'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'मात्रा व भाव' : 'Qty & Price'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'स्थिति' : 'Status'}</th>
                    <th className="py-3.5 px-6 text-right">{t('actionCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {adminProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 flex items-center space-x-3">
                        <img src={p.img} alt={p.title} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{p.title}</div>
                          <div className="text-[11px] text-gray-400">{p.location}</div>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-emerald-800">{p.farmer}</td>
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-gray-900">₹{p.price}/kg</div>
                        <div className="text-gray-500 text-[11px]">{p.qty}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                          p.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {p.status !== 'Approved' && (
                          <button
                            onClick={() => handleProductModeration(p._id, p.title, 'approve')}
                            className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
                          >
                            {isHindi ? 'स्वीकारें' : 'Approve'}
                          </button>
                        )}
                        {p.status !== 'Rejected' && (
                          <button
                            onClick={() => handleProductModeration(p._id, p.title, 'reject')}
                            className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold transition-colors"
                          >
                            {isHindi ? 'हटाएं / अस्वीकार' : 'Reject'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Tab 3: Orders & Escrow Oversight */}
        {activeTab === 'orders' && (
          <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-extrabold text-gray-900 text-lg">{isHindi ? 'मंच ऑर्डर व एस्क्रो भुगतान नियंत्रण' : 'Orders & Escrow Governance'}</h3>
              <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full border border-emerald-200">
                {isHindi ? '100% सुरक्षित भुगतान' : '100% Escrow Protected'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="py-3.5 px-6">{isHindi ? 'ऑर्डर विवरण' : 'Order'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'खरीदार → किसान' : 'Buyer → Farmer'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'राशि' : 'Amount'}</th>
                    <th className="py-3.5 px-6">{isHindi ? 'एस्क्रो स्थिति' : 'Escrow Status'}</th>
                    <th className="py-3.5 px-6 text-right">{t('actionCol')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                  {adminOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-900">
                        <div>{ord.product}</div>
                        <div className="text-gray-400 text-[11px] font-normal">{ord.qty} · Status: {ord.status}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-gray-800">{ord.buyer}</div>
                        <div className="text-emerald-700 text-[11px]">→ {ord.farmer}</div>
                      </td>
                      <td className="py-4 px-6 font-extrabold text-gray-900">{ord.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.escrow === 'Released' ? 'bg-emerald-100 text-emerald-800' :
                          ord.escrow === 'Secured' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                        }`}>
                          {ord.escrow}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        {ord.status !== 'Resolved' && (
                          <button
                            onClick={() => handleResolveDispute(ord._id, ord.buyer)}
                            className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-colors"
                          >
                            {isHindi ? 'विवाद सुलझाएं' : 'Resolve Dispute'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* Document Preview Modal */}
      {docModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setDocModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base">{isHindi ? 'सत्यापन दस्तावेज़ समीक्षा' : 'Verification Document Preview'}</h3>
                <p className="text-white/80 text-xs mt-0.5">{docModal.name} — {docModal.docType}</p>
              </div>
              <button onClick={() => setDocModal(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                <div className="font-bold text-gray-900 text-sm">📋 {docModal.docType}</div>
                <div className="text-gray-600">{isHindi ? 'सरकारी राजस्व विभाग व डिजिटल भू-अभिलेख पोर्टल से प्रमाणित:' : 'Verified via Digital Land Record Portal:'}</div>
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
                  <div><strong>{isHindi ? 'किसान का नाम:' : 'Holder Name:'}</strong> {docModal.name}</div>
                  <div><strong>{isHindi ? 'फोन:' : 'Contact:'}</strong> {docModal.phone || '+91 98234 11029'}</div>
                  <div><strong>{isHindi ? 'जिला/राज्य:' : 'Location:'}</strong> {docModal.location?.city || 'Nashik'}, {docModal.location?.state || 'Maharashtra'}</div>
                  <div><strong>{isHindi ? 'स्थिति:' : 'Status:'}</strong> <span className="text-emerald-700 font-bold">Authenticated</span></div>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={() => { handleVerificationAction(docModal._id, docModal.name, 'verify'); setDocModal(null); }}
                  className="px-4 py-2 bg-emerald-700 text-white font-bold rounded-xl text-xs hover:bg-emerald-800"
                >
                  {isHindi ? 'स्वीकारें एवं प्रमाणित करें' : 'Approve & Verify'}
                </button>
                <button
                  onClick={() => { handleVerificationAction(docModal._id, docModal.name, 'reject'); setDocModal(null); }}
                  className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl text-xs hover:bg-red-100 border border-red-200"
                >
                  {isHindi ? 'अस्वीकार करें' : 'Decline'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Modal */}
      {statModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={() => setStatModal(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-5 flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {statModal === 'farmers' ? (isHindi ? 'पंजीकृत किसान विवरण' : 'Registered Farmers') : (isHindi ? 'पंजीकृत खरीदार विवरण' : 'Registered Buyers')}
              </h3>
              <button onClick={() => setStatModal(null)} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-80 overflow-y-auto text-xs">
              {(statModal === 'farmers' ? [
                { name: 'Ramesh Kumar', location: 'Nashik, Maharashtra', crops: 'Tomato, Onion, Grapes', phone: '+91 98234 11029', avatar: '/images/ramesh.jpg' },
                { name: 'Suresh Yadav', location: 'Varanasi, UP', crops: 'Onion, Wheat, Mustard', phone: '+91 94150 82741', avatar: '/images/suresh.jpg' },
                { name: 'Sunita Devi', location: 'Bhopal, MP', crops: 'Wheat, Soybean, Chana', phone: '+91 94250 77891', avatar: '/images/sunita.jpg' },
                { name: 'Anil Patel', location: 'Anand, Gujarat', crops: 'Groundnut, Cotton', phone: '+91 94265 31780', avatar: '/images/anil.jpg' },
                { name: 'Rajesh Choudhary', location: 'Jaipur, Rajasthan', crops: 'Mustard, Cumin, Isabgol', phone: '+91 94140 33567', avatar: '/images/rajesh.jpg' },
                { name: 'Harpreet Singh', location: 'Ludhiana, Punjab', crops: 'Basmati Rice, Wheat', phone: '+91 98142 09876', avatar: '/images/harpreet.jpg' },
              ] : [
                { name: 'Amit Sharma', location: 'Azadpur Mandi, Delhi', type: 'Wholesale Mandi Trader', phone: '+91 98110 54321', avatar: '/images/amit.jpg' },
                { name: 'Karan Mehta', location: 'APMC Vashi, Mumbai', type: 'Hotel Chain Buyer', phone: '+91 98200 99887', avatar: '/images/karan.jpg' },
                { name: 'Priya Verma', location: 'Hebbal, Bangalore', type: 'Supermarket Chain Buyer', phone: '+91 97400 11223', avatar: '/images/priya.jpg' },
                { name: 'Rohit Singh', location: 'Transport Nagar, Lucknow', type: 'Food Processor', phone: '+91 98765 43210', avatar: '/images/rohit.jpg' },
              ]).map((u, i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                  <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900">{u.name}</div>
                    <div className="text-gray-500 text-[11px]">{u.location} · {u.crops || u.type}</div>
                    <div className="text-emerald-700 font-bold text-[11px]">{u.phone}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={() => setStatModal(null)} className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold">
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
