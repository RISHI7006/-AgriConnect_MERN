import React from 'react';
import { Sprout, ShieldCheck, TrendingUp, Handshake, CheckCircle2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAF9] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>Direct Agricultural Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            About AgriConnect
          </h1>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Disrupting the traditional multi-tiered middleman commission structure to ensure farmers earn maximum value for their harvests while commercial buyers receive guaranteed freshness.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">The Problem We Solve</h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            In traditional agricultural supply chains, farmers often face up to 30-45% value erosion due to cascading intermediaries, lack of transparent price discovery, and delayed mandi settlements. Meanwhile, bulk buyers and institutional kitchens pay high premiums for produce that has spent days in sub-optimal transit.
          </p>

          <h2 className="text-xl font-bold text-gray-900 pt-4">Our End-to-End Digital Agricultural Platform</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <h4 className="font-bold text-emerald-900 mb-1">Direct Market Infrastructure</h4>
              <p className="text-emerald-800">
                Secure Escrow payments, verified farmer profiles, direct mandi price discovery, transparent buyer-farmer negotiations, and live order tracking.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-1">Market Analytics & Crop Advisory</h4>
              <p className="text-blue-800">
                Live daily APMC mandi price comparisons, 3-month regional demand forecasting, and agro-climatic crop suitability recommendations based on soil and season.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
