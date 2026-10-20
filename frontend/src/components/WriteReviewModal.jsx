import React, { useState } from 'react';
import { Star, X, Check, ShieldCheck } from 'lucide-react';
import { api } from '../api';
import { useLanguage } from '../context/LanguageContext';

export const WriteReviewModal = ({ order, onClose, onSuccess }) => {
  const { isHindi } = useLanguage();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (order?._id && !order._id.startsWith('DEMO')) {
        await api.submitOrderReview(order._id, { rating, comment });
      }
      setSubmitted(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-800 text-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base">
                {isHindi ? 'किसान व फसल समीक्षा लिखें' : 'Write Farmer & Crop Review'}
              </h3>
              <p className="text-white/80 text-xs mt-0.5">
                {order?.productTitle || 'Produce'} · {order?.farmer?.name || 'Farmer'}
              </p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-extrabold text-gray-900 text-lg">
              {isHindi ? 'समीक्षा सफलतापूर्वक दर्ज की गई!' : 'Review Submitted Successfully!'}
            </h4>
            <p className="text-xs text-gray-500">
              {isHindi ? 'आपकी निष्पक्ष समीक्षा से अन्य खरीदारों को मदद मिलेगी और किसान की साख बढ़ेगी।' : 'Thank you! Your feedback helps the farming community maintain high-grade produce.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Star Rating Selector */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                {isHindi ? 'रेटिंग चुनें (1 से 5 स्टार):' : 'Select Star Rating:'}
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-emerald-700">
                {rating === 5 && (isHindi ? '⭐⭐⭐⭐⭐ उत्कृष्ट गुणवत्ता!' : '5/5 Excellent Quality!')}
                {rating === 4 && (isHindi ? '⭐⭐⭐⭐ बहुत अच्छा अनुभव' : '4/5 Very Good')}
                {rating === 3 && (isHindi ? '⭐⭐⭐ औसत गुणवत्ता' : '3/5 Average')}
                {rating <= 2 && (isHindi ? '⭐⭐ सुधार की आवश्यकता' : 'Needs Improvement')}
              </span>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {isHindi ? 'अपनी विस्तृत समीक्षा व अनुभव लिखें:' : 'Your Detailed Feedback:'}
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={isHindi ? 'उदा: टमाटर एकदम ताज़ा और उत्तम पैकेजिंग में मिले। रमेश जी ने समय पर गाड़ी लोड करवा दी।' : 'e.g. Produce arrived fresh, graded properly, and on time. Ramesh ji coordinated vehicle dispatch seamlessly.'}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
              >
                {loading ? (isHindi ? 'दर्ज हो रहा है...' : 'Submitting...') : (isHindi ? 'समीक्षा सबमिट करें' : 'Submit Review')}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
