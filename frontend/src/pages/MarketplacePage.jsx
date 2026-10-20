import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const MarketplacePage = () => {
  const { t, isHindi } = useLanguage();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [priceMax, setPriceMax] = useState(500);
  const [selectedState, setSelectedState] = useState('All India');
  const [inStockOnly, setInStockOnly] = useState(true);
  const [nearMe, setNearMe] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { id: 'Grains', label: isHindi ? 'अनाज व दलहन (Grains)' : 'Grains' },
    { id: 'Vegetables', label: isHindi ? 'सब्जियां (Vegetables)' : 'Vegetables' },
    { id: 'Fruits', label: isHindi ? 'फल (Fruits)' : 'Fruits' },
    { id: 'Pulses', label: isHindi ? 'दालें (Pulses)' : 'Pulses' },
    { id: 'Oilseeds', label: isHindi ? 'तिलहन (Oilseeds)' : 'Oilseeds' },
    { id: 'Spices', label: isHindi ? 'मसाले (Spices)' : 'Spices' },
  ];

  const states = [
    'All India',
    'Maharashtra',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Gujarat',
    'Rajasthan',
    'Punjab',
    'Haryana',
    'Karnataka',
    'Kerala',
    'Assam',
    'Jammu & Kashmir'
  ];

  const fetchFilteredProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        category: selectedCategories.join(','),
        maxPrice: priceMax,
        state: selectedState === 'All India' ? '' : selectedState,
        inStock: inStockOnly ? 'true' : '',
        sort: sortBy
      };
      const data = await api.getProducts(params);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredProducts();
  }, [sortBy]);

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    fetchFilteredProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceMax(500);
    setSelectedState('All India');
    setInStockOnly(true);
    setNearMe(false);
    setSortBy('latest');
    api.getProducts().then(res => setProducts(Array.isArray(res) ? res : []));
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Search & Location Bar */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-3 shadow-sm mb-8 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full flex items-center">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyFilters()}
              placeholder={isHindi ? 'फसल का नाम (टमाटर, बासमती चावल, आलू, प्याज), किसान, शहर खोजें...' : 'Search for crops, location, farmer...'}
              className="w-full pl-11 pr-4 py-2.5 text-xs sm:text-sm rounded-xl focus:outline-none focus:bg-gray-50 text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex items-center space-x-1.5 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button
              onClick={handleApplyFilters}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center space-x-1"
            >
              <span>{t('searchBtn')}</span>
            </button>
          </div>
        </div>

        {/* Layout: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>{t('filters')}</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-gray-400 hover:text-emerald-700 font-medium flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t('reset')}</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">{t('category')}</h4>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label
                    key={cat.id}
                    className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer hover:text-emerald-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => toggleCategory(cat.id)}
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                <span>{t('priceRange')}</span>
                <span className="text-emerald-700 font-extrabold text-sm">₹0 - ₹{priceMax}</span>
              </div>
              <input
                type="range"
                min="1"
                max="1500"
                step="5"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹1</span>
                <span>₹750</span>
                <span>₹1500</span>
              </div>
            </div>

            {/* Location */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">{t('location')}</h4>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-medium text-gray-700"
              >
                {states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Availability */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">{t('availability')}</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span>{t('inStock')}</span>
                </label>
                <label className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nearMe}
                    onChange={(e) => setNearMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span>{t('nearMe')}</span>
                </label>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyFilters}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              {t('applyFilters')}
            </button>
          </aside>

          {/* Right Main Grid */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">{t('freshProductsTitle')}</h2>
                <p className="text-xs text-gray-500">
                  <strong className="text-emerald-700 font-bold">{products.length}</strong> {t('productsFound')}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500 font-medium">{t('sortBy')}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="latest">{t('sortLatest')}</option>
                  <option value="price-low">{t('sortPriceLow')}</option>
                  <option value="price-high">{t('sortPriceHigh')}</option>
                  <option value="quantity">{t('sortQty')}</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <div key={n} className="h-80 rounded-2xl bg-gray-200 animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <p className="text-base font-bold text-gray-800">
                  {isHindi ? 'कोई फसल नहीं मिली।' : 'No farm products match your criteria.'}
                </p>
                <p className="text-xs text-gray-500">
                  {isHindi ? 'कृपया अपने फ़िल्टर या मूल्य सीमा को समायोजित करें।' : 'Try adjusting your filters, price range, or state selection.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold"
                >
                  {t('reset')}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(prod => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
