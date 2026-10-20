import React, { useState } from 'react';
import { MapPin, Navigation, Check, AlertCircle, RefreshCw, Building2 } from 'lucide-react';
import { 
  getAllStates, 
  getCitiesForState, 
  getVillagesForCity, 
  getMandisForCity, 
  detectCurrentLocation 
} from '../data/indianLocations';
import { useLanguage } from '../context/LanguageContext';

export const LocationPicker = ({ 
  value = {}, 
  onChange, 
  showMandis = true, 
  required = true,
  className = '' 
}) => {
  const { isHindi } = useLanguage();
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsSuccess, setGpsSuccess] = useState('');
  const [gpsError, setGpsError] = useState('');

  const states = getAllStates();
  const currentState = value.state || 'Maharashtra';
  const cities = getCitiesForState(currentState);
  const currentCity = value.city || (cities[0] || 'Nashik');
  const villages = getVillagesForCity(currentState, currentCity);
  const currentVillage = value.village || (villages[0] || 'Pimpalgaon Baswant');
  const mandis = getMandisForCity(currentState, currentCity);

  const handleStateChange = (newState) => {
    const newCities = getCitiesForState(newState);
    const newCity = newCities[0] || '';
    const newVillages = getVillagesForCity(newState, newCity);
    const newVillage = newVillages[0] || '';
    const newMandis = getMandisForCity(newState, newCity);
    const newMandi = newMandis[0]?.name || '';

    onChange({
      ...value,
      state: newState,
      city: newCity,
      village: newVillage,
      nearestMandi: newMandi,
      address: `${newVillage ? newVillage + ', ' : ''}${newCity}, ${newState}`
    });
  };

  const handleCityChange = (newCity) => {
    const newVillages = getVillagesForCity(currentState, newCity);
    const newVillage = newVillages[0] || '';
    const newMandis = getMandisForCity(currentState, newCity);
    const newMandi = newMandis[0]?.name || '';

    onChange({
      ...value,
      city: newCity,
      village: newVillage,
      nearestMandi: newMandi,
      address: `${newVillage ? newVillage + ', ' : ''}${newCity}, ${currentState}`
    });
  };

  const handleVillageChange = (newVillage) => {
    onChange({
      ...value,
      village: newVillage,
      address: `${newVillage}, ${currentCity}, ${currentState}`
    });
  };

  const handleMandiChange = (mandiName) => {
    onChange({
      ...value,
      nearestMandi: mandiName
    });
  };

  const handleGpsDetect = async () => {
    setGpsLoading(true);
    setGpsError('');
    setGpsSuccess('');

    try {
      const loc = await detectCurrentLocation();
      
      // Match best state if available
      const matchingState = states.find(s => s.toLowerCase() === loc.state.toLowerCase()) || loc.state;
      const availableCities = getCitiesForState(matchingState);
      const matchingCity = availableCities.find(c => loc.city.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(loc.city.toLowerCase())) || availableCities[0] || loc.city;
      const availableVillages = getVillagesForCity(matchingState, matchingCity);
      const matchingVillage = availableVillages.find(v => loc.village.toLowerCase().includes(v.toLowerCase())) || loc.village;
      const detectedMandis = getMandisForCity(matchingState, matchingCity);

      onChange({
        state: matchingState,
        city: matchingCity,
        village: matchingVillage,
        pincode: loc.pincode,
        nearestMandi: detectedMandis[0]?.name || '',
        address: loc.fullAddress || `${matchingVillage}, ${matchingCity}, ${matchingState} - ${loc.pincode}`
      });

      setGpsSuccess(isHindi ? `✓ लोकेशन फेच हुई: ${matchingVillage}, ${matchingCity}` : `✓ Location detected: ${matchingVillage}, ${matchingCity}`);
      setTimeout(() => setGpsSuccess(''), 5000);
    } catch (err) {
      setGpsError(isHindi ? 'लोकेशन फेच करने में असमर्थ। कृपया ड्रॉपडाउन से चुनें।' : 'Could not detect GPS location. Please select from dropdowns.');
      setTimeout(() => setGpsError(''), 4000);
    } finally {
      setGpsLoading(false);
    }
  };

  return (
    <div className={`space-y-3.5 bg-gray-50/80 p-4 rounded-2xl border border-gray-200/80 ${className}`}>
      
      {/* GPS 1-Click Detect Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200/70">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-black text-gray-900">
            {isHindi ? 'सटीक स्थान एवं कृषि मंडी चयन:' : 'Exact Location & Mandi Selection:'}
          </span>
        </div>
        <button
          type="button"
          onClick={handleGpsDetect}
          disabled={gpsLoading}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-[11px] font-bold shadow-xs transition-all disabled:opacity-50"
        >
          {gpsLoading ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Navigation className="w-3.5 h-3.5" />
          )}
          <span>{isHindi ? '🛰️ लाइव GPS से लोकेशन लें' : '🛰️ Detect via Live GPS'}</span>
        </button>
      </div>

      {gpsSuccess && (
        <div className="p-2.5 bg-emerald-100/80 border border-emerald-300 text-emerald-900 rounded-xl text-[11px] font-bold flex items-center space-x-2 animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
          <span>{gpsSuccess}</span>
        </div>
      )}

      {gpsError && (
        <div className="p-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl text-[11px] font-semibold flex items-center space-x-2 animate-in fade-in">
          <AlertCircle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Grid for State & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">
            {isHindi ? 'राज्य (State):' : 'State:'} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={currentState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required={required}
          >
            {states.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">
            {isHindi ? 'जिला / शहर (District / City):' : 'District / City:'} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            value={currentCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            required={required}
          >
            {cities.map((ct) => (
              <option key={ct} value={ct}>{ct}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Village / Tehsil */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">
            {isHindi ? 'तहसील / ग्राम / क्षेत्र (Tehsil / Village):' : 'Tehsil / Village / Area:'}
          </label>
          {villages.length > 0 ? (
            <select
              value={currentVillage}
              onChange={(e) => handleVillageChange(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            >
              {villages.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={value.village || ''}
              onChange={(e) => handleVillageChange(e.target.value)}
              placeholder="उदा. पिंपलगांव बसवंत"
              className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
          )}
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-700 mb-1">
            {isHindi ? 'पिनकोड (Pincode):' : 'Pincode:'}
          </label>
          <input
            type="text"
            value={value.pincode || ''}
            onChange={(e) => onChange({ ...value, pincode: e.target.value })}
            placeholder="उदा. 422209"
            maxLength={6}
            className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 font-semibold text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>
      </div>

      {/* Show Mandis if enabled */}
      {showMandis && mandis.length > 0 && (
        <div className="pt-1">
          <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-blue-700" />
            <span>{isHindi ? 'निकटतम अधिकृत कृषि उपज मंडी (APMC Mandi):' : 'Nearest Authorized APMC Mandi:'}</span>
          </label>
          <select
            value={value.nearestMandi || mandis[0]?.name}
            onChange={(e) => handleMandiChange(e.target.value)}
            className="w-full px-3 py-2 bg-blue-50/60 rounded-xl border border-blue-200 text-xs font-bold text-blue-950 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            {mandis.map((m) => (
              <option key={m.name} value={m.name}>
                {m.name} ({m.type} - {m.distance})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Full Address Display */}
      <div>
        <label className="block text-[11px] font-bold text-gray-700 mb-1">
          {isHindi ? 'खेत / दुकान / डिलीवरी का पूरा पता:' : 'Full Farm / Shop / Delivery Address:'}
        </label>
        <input
          type="text"
          value={value.address || `${currentVillage ? currentVillage + ', ' : ''}${currentCity}, ${currentState}`}
          onChange={(e) => onChange({ ...value, address: e.target.value })}
          placeholder="उदा. गट नं. 142, मुख्य बाज़ार रोड, पिंपलगांव बसवंत"
          className="w-full px-3 py-2 bg-white rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
        />
      </div>

    </div>
  );
};
