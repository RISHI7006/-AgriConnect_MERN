import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  Plus, 
  Minus, 
  CheckCircle2,
  CreditCard,
  QrCode,
  Building,
  Check,
  Sparkles,
  Phone,
  MapPin,
  Lock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api';

export const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const { user } = useAuth();
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    street: user?.location?.address || 'Shop 118, New Subzi Mandi',
    city: user?.location?.city || 'Delhi',
    state: user?.location?.state || 'Delhi',
    pincode: '110033'
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI' | 'Escrow' | 'NetBanking'
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('cart'); // 'cart' | 'paying' | 'success'
  const [placedOrders, setPlacedOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setErrorMessage('');
    setLoading(true);
    setPaymentStep('paying');

    try {
      // Simulate realistic payment processing for 1.2s
      await new Promise(res => setTimeout(res, 1200));

      const createdList = [];
      // Place direct order for each cart item
      for (const item of cart) {
        const orderRes = await api.createOrder({
          productId: item.product._id,
          quantity: item.quantity,
          deliveryAddress,
          paymentMethod: paymentMethod === 'UPI' ? 'UPI (PhonePe/GPay)' : paymentMethod === 'NetBanking' ? 'Net Banking (IMPS)' : 'AgriConnect Escrow'
        });
        createdList.push({
          ...orderRes,
          productTitle: item.product.title,
          farmerName: item.product.farmer?.name || 'Kisan',
          quantity: item.quantity,
          unit: item.product.unit || 'kg',
          totalPrice: item.pricePerKg * item.quantity
        });
      }

      setPlacedOrders(createdList);
      clearCart();
      setPaymentStep('success');
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'भुगतान व ऑर्डर प्रक्रिया में त्रुटि');
      setPaymentStep('cart');
    } finally {
      setLoading(false);
    }
  };

  // Payment Processing Overlay
  if (paymentStep === 'paying') {
    return (
      <div className="min-h-screen bg-[#F8FAF9] py-16 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto animate-pulse">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900">
              {isHindi ? 'सुरक्षित एस्क्रो भुगतान संसाधित हो रहा है...' : 'Processing Secure Escrow Payment...'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {isHindi ? 'कृपया प्रतीक्षा करें, किसान के लिए सुरक्षित एस्क्रो खाता आरक्षित किया जा रहा है।' : 'Please wait, reserving escrow allocation for the farmer.'}
            </p>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-600 h-2 rounded-full animate-indeterminate"></div>
          </div>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 py-2 px-4 rounded-xl">
            {isHindi ? `कुल राशि: ₹${totalAmount.toLocaleString('en-IN')}` : `Total: ₹${totalAmount.toLocaleString('en-IN')}`}
          </div>
        </div>
      </div>
    );
  }

  // Order Success Screen
  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-[#F8FAF9] py-16 flex items-center justify-center px-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full text-center space-y-5 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-[11px] font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider">
              {isHindi ? 'भुगतान सफल व सुरक्षित' : 'Payment Verified & Escrow Secured'}
            </span>
            <h2 className="text-2xl font-black text-gray-900 mt-2">
              {isHindi ? 'ऑर्डर सफलतापूर्वक दर्ज हो गया!' : 'Direct Farm Order Placed!'}
            </h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {isHindi 
                ? 'आपकी राशि एस्क्रो में सुरक्षित जमा है। किसान के पास ऑर्डर पहुँच गया है। किसान के अप्रूव करते ही माल रवाना होगा।' 
                : 'Your funds are securely held in AgriConnect Escrow. The farmer will now review and approve your harvest shipment.'}
            </p>
          </div>

          {/* Ordered Items Pill */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 text-left space-y-2 text-xs">
            <div className="font-extrabold text-gray-900 border-b border-gray-200 pb-1.5 flex justify-between">
              <span>{isHindi ? 'ऑर्डर विवरण:' : 'Order Summary:'}</span>
              <span className="text-emerald-700 font-bold">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            {placedOrders.map((o, idx) => (
              <div key={idx} className="flex justify-between text-gray-700 py-0.5">
                <span>{o.productTitle} ({o.quantity} {o.unit})</span>
                <span className="font-bold text-gray-900">₹{o.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => navigate('/buyer-dashboard')}
              className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>{isHindi ? '📦 बायर डैशबोर्ड में लाइव ट्रैक करें' : 'Track in Buyer Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/products"
              className="block w-full py-2.5 text-xs font-bold text-gray-600 hover:text-emerald-700 transition-colors"
            >
              {isHindi ? 'मंडी में और फसलें देखें' : 'Continue Sourcing Produce'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {isHindi ? 'थोक कृषि खरीद कार्ट एवं चेकआउट' : 'Direct Farm Produce Cart & Checkout'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {isHindi ? 'सीधे किसान से खरीदे गए उत्पादों की मात्रा, डिलीवरी पता और सुरक्षित एस्क्रो भुगतान।' : 'Review direct-from-farm quantities, mandi delivery address and secured escrow checkout.'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200 font-bold">
            {errorMessage}
          </div>
        )}

        {cart.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              {isHindi ? 'आपकी कार्ट में अभी कोई फसल नहीं है' : 'Your direct produce cart is empty'}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {isHindi ? 'मंडी में जाकर भारतीय किसानों द्वारा सूचीबद्ध ताज़ा फसलें देखें और कार्ट में जोड़ें।' : 'Explore fresh harvest directly from verified Indian cultivators across all mandis.'}
            </p>
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              {isHindi ? '🌾 मंडी में फसलें देखें' : 'Browse Marketplace'}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product._id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <img
                      src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'}
                      alt={item.product.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-base">{item.product.title}</h4>
                      <p className="text-xs text-gray-500">
                        {isHindi ? 'किसान' : 'Farmer'}: <strong>{item.product.farmer?.name || 'Ramesh Kumar'}</strong> ({item.product.location?.city || 'Nashik'})
                      </p>
                      <p className="text-xs font-bold text-emerald-700 mt-1">
                        ₹{item.pricePerKg} / {item.product.unit || 'kg'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-6 w-full sm:w-auto">
                    {/* Quantity controls */}
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, Math.max(10, item.quantity - 25))}
                        className="p-1 text-gray-500 hover:text-gray-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-16 text-center text-xs font-bold text-gray-800">
                        {item.quantity} {item.product.unit || 'kg'}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product._id, item.quantity + 25)}
                        className="p-1 text-gray-500 hover:text-gray-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[90px]">
                      <div className="text-base font-black text-gray-900">
                        ₹{(item.pricePerKg * item.quantity).toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.product._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Summary Card */}
            <div className="lg:col-span-4">
              <form onSubmit={handleCheckout} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
                <h3 className="font-black text-gray-900 text-base">
                  {isHindi ? 'ऑर्डर और भुगतान विवरण' : 'Order & Payment Summary'}
                </h3>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>{isHindi ? 'फसल उप-योग (Subtotal)' : 'Subtotal'}</span>
                    <span className="font-bold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{isHindi ? 'मंडी परिवहन (Logistics)' : 'Cold Chain Logistics'}</span>
                    <span className="font-bold text-emerald-700">{isHindi ? 'शामिल (खेत द्वार से)' : 'Included (Farm Gate)'}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{isHindi ? 'एस्क्रो बीमा शुल्क' : 'Escrow Guarantee Fee'}</span>
                    <span className="font-bold text-emerald-700">₹0 ({isHindi ? 'निःशुल्क' : 'Free'})</span>
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between text-sm font-black text-gray-900">
                    <span>{isHindi ? 'कुल देय राशि' : 'Total Payable'}</span>
                    <span className="text-blue-900 text-xl font-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-2.5 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-800">
                    {isHindi ? 'डिलीवरी / मंडी दुकान का पता *' : 'Delivery / Mandi Shop Address *'}
                  </label>
                  <input
                    type="text"
                    value={deliveryAddress.street}
                    onChange={(e) => setDeliveryAddress({ ...deliveryAddress, street: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    placeholder="Shop 118, New Subzi Mandi"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="City (e.g. Delhi)"
                      required
                    />
                    <input
                      type="text"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                      className="px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      placeholder="State"
                      required
                    />
                  </div>
                </div>

                {/* Indian Payment Options */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="block text-xs font-bold text-gray-800">
                    {isHindi ? 'भुगतान विधि चुनें (1-टैप डेमो भुगतान):' : 'Select Payment Method (1-Tap Demo Pay):'}
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('UPI')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === 'UPI' 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20' 
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                      <span className="text-[10px] block">UPI / QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Escrow')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === 'Escrow' 
                          ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-2 ring-blue-500/20' 
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-blue-700" />
                      <span className="text-[10px] block">{isHindi ? 'एस्क्रो ट्रस्ट' : 'Escrow Trust'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('NetBanking')}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        paymentMethod === 'NetBanking' 
                          ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold ring-2 ring-purple-500/20' 
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Building className="w-4 h-4 mx-auto mb-1 text-purple-700" />
                      <span className="text-[10px] block">{isHindi ? 'नेट बैंकिंग' : 'Net Banking'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 text-xs space-y-1">
                  <div className="flex items-center text-blue-900 font-bold">
                    <ShieldCheck className="w-4 h-4 mr-1 text-blue-600 flex-shrink-0" />
                    <span>{isHindi ? '100% किसान सुरक्षा एस्क्रो' : 'AgriConnect Escrow Guarantee'}</span>
                  </div>
                  <p className="text-[11px] text-blue-800 leading-tight">
                    {isHindi 
                      ? 'राशि किसान को तभी रिलीज़ होगी जब आप डिलीवरी पर फसल की गुणवत्ता सत्यापित करेंगे।' 
                      : 'Funds are safely held. The farmer is paid only after you inspect and accept produce quality.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center space-x-1.5 hover:scale-[1.01]"
                >
                  <span>
                    {loading 
                      ? (isHindi ? 'भुगतान हो रहा है...' : 'Processing...') 
                      : isHindi 
                      ? `₹${totalAmount.toLocaleString('en-IN')} का भुगतान करें और ऑर्डर दें` 
                      : `Pay & Place Order (₹${totalAmount.toLocaleString('en-IN')})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};