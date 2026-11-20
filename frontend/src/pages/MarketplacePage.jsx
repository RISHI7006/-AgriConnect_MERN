import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, RefreshCw, AlertCircle, WifiOff } from 'lucide-react';
import { api } from '../api';
import { ProductCard } from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';

export const MarketplacePage = () => {
  const { t, isHindi } = useLanguage();
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get('category') ? [searchParams.get('category')] : []
  );
  const [priceMax, setPriceMax] = useState(1500);
  const [selectedState, setSelectedState] = useState('All India');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [sortBy, setSortBy] = useState('latest');

  const categories = [
    { id: 'Grains', label: isHindi ? 'अनाज व दलहन' : 'Grains' },
    { id: 'Vegetables', label: isHindi ? 'सब्जियां' : 'Vegetables' },
    { id: 'Fruits', label: isHindi ? 'फल' : 'Fruits' },
    { id: 'Pulses', label: isHindi ? 'दालें' : 'Pulses' },
    { id: 'Oilseeds', label: isHindi ? 'तिलहन' : 'Oilseeds' },
    { id: 'Spices', label: isHindi ? 'मसाले' : 'Spices' },
  ];

  const states = [
    'All India', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh',
    'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Karnataka',
    'Kerala', 'Assam', 'Bihar', 'Tamil Nadu', 'Andhra Pradesh',
    'Telangana', 'West Bengal', 'Odisha', 'Jammu & Kashmir'
  ];

  const fetchFilteredProducts = useCallback(async (overrides = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: overrides.search !== undefined ? overrides.search : search,
        category: (overrides.selectedCategories !== undefined ? overrides.selectedCategories : selectedCategories).join(','),
        maxPrice: (overrides.priceMax !== undefined ? overrides.priceMax : priceMax) < 1500 ? (overrides.priceMax !== undefined ? overrides.priceMax : priceMax) : '',
        state: (overrides.selectedState !== undefined ? overrides.selectedState : selectedState) === 'All India' ? '' : (overrides.selectedState !== undefined ? overrides.selectedState : selectedState),
        inStock: (overrides.inStockOnly !== undefined ? overrides.inStockOnly : inStockOnly) ? 'true' : '',
        sort: overrides.sortBy !== undefined ? overrides.sortBy : sortBy
      };
      // Remove empty params
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const data = await api.getProducts(params);
      if (!Array.isArray(data)) throw new Error('Invalid response from server');
      setProducts(data);
    } catch (e) {
      console.error('Products fetch error:', e);
      setError(e.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  }, [search, selectedCategories, priceMax, selectedState, inStockOnly, sortBy]);

  useEffect(() => {
    fetchFilteredProducts();
  }, [sortBy]);

  // Initial load on mount
  useEffect(() => {
    fetchFilteredProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleCategory = (catId) => {
    setSelectedCategories(prev =>
      prev.includes(catId) ? prev.filter(c => c !== catId) : [...prev, catId]
    );
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    setMobileFiltersOpen(false);
    fetchFilteredProducts();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategories([]);
    setPriceMax(1500);
    setSelectedState('All India');
    setInStockOnly(false);
    setNearMe(false);
    setSortBy('latest');
    fetchFilteredProducts({
      search: '', selectedCategories: [], priceMax: 1500,
      selectedState: 'All India', inStockOnly: false, sortBy: 'latest'
    });
  };

  const handleRetry = () => {
    setRetrying(true);
    fetchFilteredProducts();
  };

  const handleQuickSeed = async () => {
    setSeeding(true);
    try {
      await api.seedDemoData();
      await fetchFilteredProducts({
        search: '', selectedCategories: [], priceMax: 1500,
        selectedState: 'All India', inStockOnly: false, sortBy: 'latest'
      });
    } catch (e) {
      console.error('Seed error:', e);
    } finally {
      setSeeding(false);
    }
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
              placeholder={isHindi ? 'फसल का नाम, किसान, शहर खोजें...' : 'Search for crops, location, farmer...'}
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
              <span>{t('searchBtn') || 'Search'}</span>
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Filter Drawer Toggle (< lg) */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="w-full py-3 px-4 bg-white border border-gray-200/90 rounded-2xl font-bold text-xs text-gray-800 flex items-center justify-between shadow-xs hover:border-emerald-500 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>{isHindi ? 'फ़िल्टर और श्रेणियां' : 'Filter by Category & Price'}</span>
              {(selectedCategories.length > 0 || selectedState !== 'All India' || inStockOnly) && (
                <span className="bg-emerald-700 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {selectedCategories.length + (selectedState !== 'All India' ? 1 : 0) + (inStockOnly ? 1 : 0)}
                </span>
              )}
            </div>
            <span className="text-emerald-700 font-extrabold text-xs">
              {mobileFiltersOpen ? (isHindi ? 'छिपाएं ▲' : 'Hide Filters ▲') : (isHindi ? 'फ़िल्टर खोलें ▼' : 'Show Filters ▼')}
            </span>
          </button>
        </div>

        {/* Layout: Filters Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className={`bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm h-fit space-y-6 ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                <span>{t('filters') || 'Filters'}</span>
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-gray-400 hover:text-emerald-700 font-medium flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{t('reset') || 'Reset'}</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">{t('category') || 'Category'}</h4>
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
                <span>{t('priceRange') || 'Price Range'}</span>
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
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">{t('location') || 'Location'}</h4>
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
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">{t('availability') || 'Availability'}</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span>{t('inStock') || 'In Stock'}</span>
                </label>
                <label className="flex items-center space-x-2.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nearMe}
                    onChange={(e) => setNearMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span>{t('nearMe') || 'Near Me (Within 100 km)'}</span>
                </label>
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleApplyFilters}
              className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              {t('applyFilters') || 'Apply Filters'}
            </button>
          </aside>

          {/* Right Main Grid */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white px-5 py-3.5 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">{t('freshProductsTitle') || 'Fresh Products from Farmers'}</h2>
                <p className="text-xs text-gray-500">
                  {loading ? (
                    <span className="text-amber-600">Loading products...</span>
                  ) : error ? (
                    <span className="text-red-500">Connection issue — please retry</span>
                  ) : (
                    <><strong className="text-emerald-700 font-bold">{products.length}</strong> {t('productsFound') || 'products found'}</>
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-gray-500 font-medium">{t('sortBy') || 'Sort by'}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-200 text-gray-800 font-bold px-3 py-1.5 rounded-xl focus:outline-none cursor-pointer"
                >
                  <option value="latest">{t('sortLatest') || 'Latest'}</option>
                  <option value="price-low">{t('sortPriceLow') || 'Price: Low to High'}</option>
                  <option value="price-high">{t('sortPriceHigh') || 'Price: High to Low'}</option>
                  <option value="quantity">{t('sortQty') || 'Most Quantity'}</option>
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
            ) : error ? (
              <div className="bg-white p-12 rounded-2xl border border-red-100 text-center space-y-4">
                <div className="flex justify-center">
                  <WifiOff className="w-12 h-12 text-red-300" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-800">
                    {isHindi ? 'सर्वर से कनेक्ट नहीं हो पाया' : 'Could not connect to server'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isHindi
                      ? 'सर्वर थोड़ी देर में जाग रहा है। कृपया 30 सेकंड बाद दोबारा कोशिश करें।'
                      : 'The server may be waking up. Please wait 30 seconds and retry.'}
                  </p>
                </div>
                <button
                  onClick={handleRetry}
                  disabled={retrying}
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl text-xs font-semibold disabled:opacity-60"
                >
                  {retrying ? 'Retrying...' : (isHindi ? 'दोबारा कोशिश करें' : 'Retry Now')}
                </button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                <p className="text-base font-bold text-gray-800">
                  {isHindi ? 'कोई फसल नहीं मिली।' : 'No farm products match your criteria.'}
                </p>
                <p className="text-xs text-gray-500">
                  {isHindi ? 'कृपया फ़िल्टर हटाकर दोबारा देखें।' : 'Try resetting filters or adjusting your price range.'}
                </p>
                <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-750 font-semibold rounded-xl text-xs transition-colors"
                  >
                    {t('reset') || 'Reset Filters'}
                  </button>
                  <button
                    onClick={handleQuickSeed}
                    disabled={seeding}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-60 flex items-center gap-1.5"
                  >
                    <span>{seeding ? (isHindi ? 'लोड हो रहा है...' : 'Seeding...') : (isHindi ? '🌾 सभी 26 फसलें रीलोड करें' : '🌾 Load All 26 Crops')}</span>
                  </button>
                </div>
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
