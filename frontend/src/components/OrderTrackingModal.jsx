import React from 'react';
import { X, CheckCircle2, Clock, Truck, Package, ShieldCheck } from 'lucide-react';

export const OrderTrackingModal = ({ order, onClose }) => {
  if (!order) return null;

  const defaultSteps = [
    { title: 'Order Placed & Escrow Secured', time: '18 Oct 2026, 09:30 AM', completed: true },
    { title: 'Farmer Confirmed & Harvest Packed', time: '18 Oct 2026, 03:00 PM', completed: order.status === 'Confirmed' || order.status === 'In Transit' || order.status === 'Delivered' },
    { title: 'In Transit from Farm Gate', time: '19 Oct 2026, 06:15 AM', completed: order.status === 'In Transit' || order.status === 'Delivered' },
    { title: 'Delivered to Destination Yard', time: order.status === 'Delivered' ? 'Delivered' : 'Estimated Tomorrow, 02:00 PM', completed: order.status === 'Delivered' }
  ];

  const steps = (order.trackingSteps && order.trackingSteps.length > 0)
    ? order.trackingSteps
    : defaultSteps;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0d4a2b] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Truck className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-bold text-base">Direct Farm Order Tracking</h3>
              <p className="text-[11px] text-emerald-200">Order ID: #{order._id?.slice(-8).toUpperCase() || 'AGRI-9821'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Order Details Header */}
          <div className="flex items-center justify-between p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
            <div className="flex items-center space-x-3">
              <img
                src={order.productImage || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&auto=format&fit=crop&q=80'}
                alt={order.productTitle}
                className="w-12 h-12 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{order.productTitle}</h4>
                <p className="text-xs text-gray-600">Quantity: <strong>{order.quantity} {order.unit || 'kg'}</strong></p>
                <p className="text-xs text-emerald-700 font-bold">Total: ₹{order.totalPrice?.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${
                order.status === 'Delivered'
                  ? 'bg-emerald-100 text-emerald-800'
                  : order.status === 'In Transit'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {order.status}
              </span>
              <p className="text-[10px] text-gray-500 mt-1 flex items-center justify-end">
                <ShieldCheck className="w-3 h-3 text-emerald-600 mr-0.5" />
                Escrow Protected
              </p>
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-4 relative pl-4 border-l-2 border-emerald-100 ml-3">
            {steps.map((step, idx) => (
              <div key={idx} className="relative pl-6">
                <div className={`absolute -left-[25px] top-0 w-6 h-6 rounded-full flex items-center justify-center ${
                  step.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                </div>
                <div>
                  <h5 className={`text-xs font-bold ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.title}
                  </h5>
                  <p className="text-[11px] text-gray-500">{step.time || 'Awaiting update'}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Farmer & Buyer Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Farmer Card */}
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100 space-y-1">
              <span className="font-bold text-emerald-800 text-[11px] uppercase tracking-wider block">Origin Farm (किसान)</span>
              <p className="font-bold text-gray-900">{order.farmer?.name || 'Ramesh Kumar'}</p>
              <p className="text-[11px] text-gray-600">
                {order.farmer?.location?.address || `${order.farmer?.location?.city || 'Nashik'}, ${order.farmer?.location?.state || 'Maharashtra'}`}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{order.farmer?.phone || '+91 98234 11029'}</span>
                <a
                  href={`tel:${order.farmer?.phone || '+91 98234 11029'}`}
                  className="px-2 py-0.5 bg-emerald-700 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-800"
                >
                  Call Farmer
                </a>
              </div>
            </div>

            {/* Buyer Card */}
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-100 space-y-1">
              <span className="font-bold text-blue-800 text-[11px] uppercase tracking-wider block">Destination (खरीदार)</span>
              <p className="font-bold text-gray-900">{order.buyer?.name || 'Amit Sharma'}</p>
              <p className="text-[11px] text-gray-600">
                {order.deliveryAddress?.street 
                  ? `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state}`
                  : (order.buyer?.location?.address || `${order.buyer?.location?.city || 'Delhi'}, ${order.buyer?.location?.state || 'Delhi'}`)}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <span className="text-[11px] text-gray-500">{order.buyer?.phone || '+91 98110 54321'}</span>
                <a
                  href={`tel:${order.buyer?.phone || '+91 98110 54321'}`}
                  className="px-2 py-0.5 bg-blue-700 text-white rounded-lg text-[10px] font-bold hover:bg-blue-800"
                >
                  Call Buyer
                </a>
              </div>
            </div>
          </div>

          <div className="p-2.5 bg-gray-50 rounded-xl text-xs flex justify-between items-center text-gray-600">
            <span>Logistics Carrier:</span>
            <span className="font-bold text-emerald-700">AgriLogistics Cold-Chain Express (Truck #MH-15-AG-4902)</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            Close Tracking
          </button>

        </div>

      </div>
    </div>
  );
};
