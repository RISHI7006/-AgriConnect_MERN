import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { t, isHindi } = useLanguage();
  const [liked, setLiked] = React.useState(false);

  if (!product) return null;

  const displayImage = (product.images && product.images.length > 0)
    ? product.images[0]
    : 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80';

  const formatQuantity = () => {
    const qty = product.quantityAvailable || 100;
    const unit = product.unit || 'kg';
    if (qty >= 1000) {
      return `${(qty / 1000).toFixed(0)} Ton ${isHindi ? 'उपलब्ध' : 'available'}`;
    }
    return `${qty} ${unit} ${isHindi ? 'उपलब्ध' : 'available'}`;
  };

  const farmerName = product.farmer?.name || (isHindi ? 'सत्यापित किसान' : 'Verified Farmer');
  const farmerCity = product.location?.city || product.farmer?.location?.city || 'Nashik';
  const farmerState = product.location?.state || product.farmer?.location?.state || 'Maharashtra';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col group">
      
      {/* Image Container */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <img
          src={displayImage}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Wishlist Heart */}
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm ${
            liked ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-500 hover:text-red-500'
          }`}
          title="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-red-500' : ''}`} />
        </button>

        {/* Quality / Organic Tag */}
        {product.organic && (
          <span className="absolute top-2.5 left-2.5 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            {isHindi ? 'जैविक (Organic)' : 'Organic'}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md text-[11px]">
              {product.category}
            </span>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="truncate max-w-[100px] text-[11px]">{farmerCity}, {farmerState}</span>
            </div>
          </div>

          <h3 className="font-bold text-gray-900 text-base group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-xl font-extrabold text-emerald-700">
              ₹{product.pricePerKg}
            </span>
            <span className="text-xs text-gray-500">/{product.unit || 'kg'}</span>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {formatQuantity()}
          </p>

          <div className="mt-2.5 pt-2 border-t border-gray-50 flex items-center justify-between text-xs text-gray-600">
            <span className="truncate font-medium">{farmerName}</span>
            <span className="flex items-center text-emerald-600 font-bold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 mr-0.5" />
              {isHindi ? 'सत्यापित' : 'Verified'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 pt-2 flex items-center space-x-2">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center py-2 px-3 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            {t('viewDetails')}
          </Link>
          <button
            onClick={() => addToCart(product, 50)}
            className="p-2 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
            title="Direct Add to Cart (50 kg)"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
