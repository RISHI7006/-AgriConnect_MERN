import React, { useState } from 'react';
import { X, Handshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';

export const NegotiationModal = ({ product, quantity, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [offeredPrice, setOfferedPrice] = useState(product ? Math.max(1, product.pricePerKg - 2) : 16);
  const [orderQty, setOrderQty] = useState(quantity || 100);
  const [message, setMessage] = useState(`We are ordering in bulk (${quantity || 100} kg) and requesting a competitive price of ₹${product ? Math.max(1, product.pricePerKg - 2) : 16}/kg.`);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const originalTotal = product.pricePerKg * orderQty;
  const offeredTotal = offeredPrice * orderQty;
  const savings = originalTotal - offeredTotal;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.createNegotiation({
        productId: product._id,
        quantity: Number(orderQty),
        offeredPricePerKg: Number(offeredPrice),
        message
      });
      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to submit negotiation request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-800 to-green-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Handshake className="w-5 h-5 text-emerald-300" />
            <h3 className="font-bold text-lg">Direct Price Negotiation</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-gray-900">Offer Sent to Farmer!</h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              Your price offer of <strong>₹{offeredPrice}/kg</strong> for <strong>{orderQty} kg</strong> has been forwarded to <strong>{product.farmer?.name || 'the farmer'}</strong>. You will receive an instant notification when they accept or counter.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
            >
              Close & View Negotiations
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Product Summary */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
              <img
                src={product.images?.[0] || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'}
                alt={product.title}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm truncate">{product.title}</h4>
                <p className="text-xs text-gray-500">Farmer: {product.farmer?.name} ({product.farmer?.location?.city || 'Nashik'})</p>
                <p className="text-xs font-semibold text-emerald-700">Listed Price: ₹{product.pricePerKg}/kg</p>
              </div>
            </div>

            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg border border-red-200">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Quantity (kg)</label>
                <input
                  type="number"
                  min="10"
                  max={product.quantityAvailable}
                  value={orderQty}
                  onChange={(e) => setOrderQty(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Offered Price (₹/kg)</label>
                <input
                  type="number"
                  min="1"
                  value={offeredPrice}
                  onChange={(e) => setOfferedPrice(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent font-bold text-emerald-800"
                  required
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs space-y-1.5">
              <div className="flex justify-between text-gray-600">
                <span>Standard Catalog Price:</span>
                <span className="line-through">₹{originalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-900">
                <span>Your Proposed Total:</span>
                <span>₹{offeredTotal.toLocaleString()}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between font-semibold text-emerald-700 pt-1 border-t border-emerald-200/60">
                  <span>Projected Savings:</span>
                  <span>₹{savings.toLocaleString()} ({(savings / originalTotal * 100).toFixed(0)}%)</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Message to Farmer</label>
              <textarea
                rows="2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="State your business use, schedule, or terms..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors shadow flex items-center space-x-1.5"
              >
                <span>{loading ? 'Submitting...' : 'Send Offer to Farmer'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
