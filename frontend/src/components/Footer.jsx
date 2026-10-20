import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ShieldCheck, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0a2f1c] text-white pt-12 pb-8 border-t border-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Agri<span className="text-emerald-400">Connect</span>
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              India’s next-generation direct Farmer-to-Buyer agricultural marketplace. Empowering farmers with fair trade, direct pricing, escrow guarantees, and smart agricultural analytics.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Farmer Network</span>
            </div>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Marketplace</h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li><Link to="/products?category=Grains" className="hover:text-white transition-colors">Grains & Cereals</Link></li>
              <li><Link to="/products?category=Vegetables" className="hover:text-white transition-colors">Fresh Vegetables</Link></li>
              <li><Link to="/products?category=Fruits" className="hover:text-white transition-colors">Seasonal Fruits</Link></li>
              <li><Link to="/products?category=Pulses" className="hover:text-white transition-colors">Pulses & Lentils</Link></li>
              <li><Link to="/products?category=Oilseeds" className="hover:text-white transition-colors">Oilseeds</Link></li>
              <li><Link to="/products?category=Spices" className="hover:text-white transition-colors">Spices & Condiments</Link></li>
            </ul>
          </div>

          {/* Smart Market Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Market Analytics</h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li><Link to="/price-trends" className="hover:text-white transition-colors">Price Trend Analysis</Link></li>
              <li><Link to="/demand-prediction" className="hover:text-white transition-colors">Demand Prediction Engine</Link></li>
              <li><Link to="/crop-recommendation" className="hover:text-white transition-colors">Crop Suitability Advisor</Link></li>
              <li><Link to="/farmer-dashboard" className="hover:text-white transition-colors">Farmer Earnings Analytics</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-white transition-colors">Admin Verification Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 tracking-wider uppercase">Contact & Support</h4>
            <div className="space-y-2.5 text-xs text-emerald-200/80">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Kisan Bhavan, Central Mandi Complex, New Delhi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Toll-Free Kisan Helpline: 1800-420-AGRI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>support@agriconnect.org</span>
              </div>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80">
          <p>© 2026 AgriConnect — National Digital Agriculture & APMC Mandi Marketplace.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Built for Indian Agriculture</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline mx-1" />
            <span>Fair Prices • Transparent Trade</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
