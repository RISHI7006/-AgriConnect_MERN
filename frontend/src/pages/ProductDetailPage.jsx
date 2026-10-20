import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Star, 
  ShoppingBag, 
  Handshake, 
  ChevronLeft, 
  Plus, 
  Minus,
  Phone,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';
import { api } from '../api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { NegotiationModal } from '../components/NegotiationModal';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { t, isHindi } = useLanguage();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(100);
  const [loading, setLoading] = useState(true);
  const [showNegotiateModal, setShowNegotiateModal] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await api.getProductById(id);
        setProduct(data?.product || null);
        setReviews(data?.reviews || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAF9]">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAF9]">
        <h2 className="text-xl font-bold text-gray-800">
          {isHindi ? 'फसल विवरण उपलब्ध नहीं है' : 'Product Not Found'}
        </h2>
        <Link to="/products" className="mt-3 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold">
          {isHindi ? 'मंडी बाज़ार में वापस जाएं' : 'Back to Marketplace'}
        </Link>
      </div>
    );
  }

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582284540020-8acbe03f4924?w=400&auto=format&fit=crop&q=80'
      ];

  const pricePerKg = Number(product.pricePerKg) || 18;
  const totalPrice = pricePerKg * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleDirectBuy = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const farmerName = product.farmer?.name || 'Ramesh Kumar';
  const farmerCity = product.location?.city || product.farmer?.location?.city || 'Nashik';
  const farmerState = product.location?.state || product.farmer?.location?.state || 'Maharashtra';

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link
          to="/products"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-gray-500 hover:text-emerald-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{isHindi ? 'सभी फसलों पर वापस जाएं' : 'Back to Products Marketplace'}</span>
        </Link>

        {/* Top Product Section: Gallery + Details matching Screenshot 3 */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Left Image Gallery */}
            <div className="md:col-span-6 space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
                <img
                  src={images[selectedImageIndex] || images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-emerald-600 ring-2 ring-emerald-100'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Details Panel matching screenshot 3 */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              
              <div>
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    {product.title}
                  </h1>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {t('inStock')}
                  </span>
                </div>

                <div className="mt-3 flex items-baseline space-x-3">
                  <span className="text-3xl font-extrabold text-emerald-700">
                    ₹{product.pricePerKg}
                  </span>
                  <span className="text-gray-500 font-medium">/{product.unit || 'kg'}</span>
                  <span className="text-xs text-gray-500 font-semibold pl-2">
                    {product.quantityAvailable || 300} {product.unit || 'kg'} {t('available')}
                  </span>
                </div>

                {/* Farmer Snippet */}
                <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-gray-800">
                  <span className="text-gray-500">{isHindi ? 'किसान:' : 'Farmer:'}</span>
                  <strong className="text-gray-900">{farmerName}</strong>
                  <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                    {t('verifiedFarmer')}
                  </span>
                </div>

                {/* Attributes Table matching UI screenshot 3 */}
                <div className="mt-5 space-y-2.5 text-xs text-gray-600 border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('location')}</span>
                    <span className="font-semibold text-gray-800">
                      {farmerCity}, {farmerState}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('harvestDate')}</span>
                    <span className="font-semibold text-gray-800">{product.harvestDate || '16 Oct 2026'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('category')}</span>
                    <span className="font-semibold text-gray-800">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">{t('quality')}</span>
                    <span className="font-semibold text-gray-800">{product.quality || 'Grade A'}</span>
                  </div>
                </div>

                {/* Quantity Selector matching screenshot 3 */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700">{t('quantity')}</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(10, quantity - 25))}
                        className="p-1 rounded-lg hover:bg-white text-gray-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-16 text-center text-sm font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.quantityAvailable || 1000, quantity + 25))}
                        className="p-1 rounded-lg hover:bg-white text-gray-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs text-gray-500 font-semibold">{product.unit || 'kg'}</span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-500">{t('totalPrice')}:</span>
                  <span className="text-2xl font-extrabold text-emerald-800">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleDirectBuy}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-sm rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 hover:scale-[1.01]"
                >
                  <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isHindi ? `सीधे अभी खरीदें (₹${totalPrice.toLocaleString('en-IN')})` : `Buy Now (₹${totalPrice.toLocaleString('en-IN')})`}</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedToast ? (isHindi ? 'कार्ट में जोड़ा गया ✓' : 'Added to Cart ✓') : t('addToCart')}</span>
                </button>

                <button
                  onClick={() => setShowNegotiateModal(true)}
                  className="w-full py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-sm rounded-xl border-2 border-emerald-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Handshake className="w-4 h-4" />
                  <span>{t('negotiatePrice')}</span>
                </button>
              </div>

            </div>

          </div>
        </div>

        {/* Bottom Section: About Farmer + Reviews matching screenshot 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* About Farmer Card */}
          <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-base">{t('aboutFarmer')}</h3>
            
            <div className="flex items-center space-x-3">
              <img
                src={product.farmer?.avatar || '/images/ramesh.jpg'}
                alt={farmerName}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/20"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-base">{farmerName}</h4>
                <div className="flex items-center text-emerald-600 text-xs font-semibold mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  <span>{t('verifiedFarmer')}</span>
                </div>
                <div className="flex items-center text-xs text-amber-500 font-bold mt-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                  <span>{product.farmer?.rating || 4.8}</span>
                  <span className="text-gray-400 font-normal ml-1">({product.farmer?.reviewCount || 120} {isHindi ? 'समीक्षाएं' : 'reviews'})</span>
                </div>
              </div>
            </div>

            {/* Complete Contact Details */}
            <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 space-y-2 text-xs">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-gray-700">{isHindi ? 'खेत का पूरा पता:' : 'Farm Address:'} </span>
                  <span className="text-gray-900 font-medium">{product.farmer?.location?.address || `${farmerCity}, ${farmerState}`}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-gray-700">{isHindi ? 'फोन नंबर:' : 'Phone:'} </span>
                  <a href={`tel:${product.farmer?.phone || '+91 98234 11029'}`} className="text-emerald-800 font-bold hover:underline">
                    {product.farmer?.phone || '+91 98234 11029'}
                  </a>
                </div>
              </div>

              {product.farmer?.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-gray-700">{isHindi ? 'ईमेल:' : 'Email:'} </span>
                    <span className="text-gray-900">{product.farmer.email}</span>
                  </div>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              {product.farmer?.bio || (isHindi ? 'महाराष्ट्र और मध्य भारत में जैविक और रासायनिक-मुक्त टिकाऊ खेती करने वाले किसान।' : 'Dedicated to agro-ecological farming in Maharashtra with direct cold chain storage and organic compliance.')}
            </p>

            {/* Quick Contact Action Buttons */}
            <div className="pt-1 flex items-center space-x-2">
              <a
                href={`tel:${product.farmer?.phone || '+91 98234 11029'}`}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{isHindi ? 'किसान से बात करें' : 'Call Farmer Direct'}</span>
              </a>
              <a
                href={`https://wa.me/${(product.farmer?.phone || '9823411029').replace(/[^0-9]/g, '')}?text=AgriConnect%20Inquiry%20about%20${encodeURIComponent(product.title)}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm"
                title="WhatsApp"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Reviews Card matching screenshot 3 */}
          <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-base">{t('reviews')}</h3>
                <div className="flex items-center space-x-1 text-xs mt-0.5">
                  <span className="font-bold text-amber-500">4.8 / 5</span>
                  <span className="text-gray-400">(120 {isHindi ? 'समीक्षाएं' : 'reviews'})</span>
                </div>
              </div>
              <button className="text-xs font-bold text-emerald-700 hover:text-emerald-800">
                {t('allReviews')}
              </button>
            </div>

            {/* Review List */}
            <div className="space-y-3">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-gray-400 text-[11px]">12 Oct 2026</span>
                </div>
                <p className="text-xs font-semibold text-gray-800">
                  {isHindi ? '"बहुत अच्छी गुणवत्ता के टमाटर, समय पर डिलीवरी।"' : '"Good quality tomatoes, Delivered on time."'}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 font-medium">— Amit Sharma (Wholesale Buyer, Delhi)</p>
              </div>

              {reviews.filter(r => r.buyerName !== 'Amit Sharma').map((r, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-2xl text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-800">{r.buyerName}</span>
                    <span className="text-[11px] text-gray-400">{r.dateString || 'Recent'}</span>
                  </div>
                  <p className="text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

      {/* Negotiation Modal */}
      {showNegotiateModal && (
        <NegotiationModal
          product={product}
          quantity={quantity}
          onClose={() => setShowNegotiateModal(false)}
        />
      )}

    </div>
  );
};
