import React, { useState } from 'react';
import { MapPin, X, Navigation, Phone, Clock, Compass, HelpCircle } from 'lucide-react';
import { useCart } from '../cartContext';
import { PAKISTAN_CITIES, CITY_AREAS } from '../data';

interface DeliveryLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryLocationModal: React.FC<DeliveryLocationModalProps> = ({ isOpen, onClose }) => {
  const {
    deliveryType,
    setDeliveryType,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
  } = useCart();

  const [localCity, setLocalCity] = useState(selectedCity);
  const [localArea, setLocalArea] = useState(selectedArea);
  const [phone, setPhone] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleCityChange = (city: string) => {
    setLocalCity(city);
    const areas = CITY_AREAS[city] || [];
    if (areas.length > 0) {
      setLocalArea(areas[0]);
    } else {
      setLocalArea('');
    }
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    // Simulate active GPS locate trigger in Pakistan
    setTimeout(() => {
      setIsLocating(false);
      setLocalCity('Karachi');
      setLocalArea('DHA Phase 1-8');
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCity(localCity);
    setSelectedArea(localArea);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dark frosted overlay matching background blur on screenshot */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-[6px] transition-opacity" 
        onClick={onClose}
      />

      {/* Main Location Modal Container */}
      <div 
        className="bg-[#0c0d12] border border-neutral-900 w-full max-w-[480px] max-h-[90vh] flex flex-col rounded-3xl p-5 md:p-6 overflow-hidden relative shadow-2xl transition-all duration-300 transform scale-100 z-10 antialiased"
        id="delivery-location-dialog"
      >
        {/* Neon active gold line across the top edge */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600" />

        {/* Header Block */}
        <div className="flex justify-between items-start mb-5 flex-shrink-0">
          <div className="space-y-1">
            <h2 className="font-display font-black text-2xl tracking-widest text-white leading-none">
              DELIVERY LOCATION
            </h2>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-yellow-500" />
              <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                SELECT YOUR AREA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* USE CURRENT LOCATION BUTTON */}
            <button
              onClick={handleUseCurrentLocation}
              className="px-3 py-1.5 h-9 bg-neutral-900 border border-yellow-500/25 rounded-xl flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase tracking-wider hover:bg-yellow-500/5 active:scale-95 transition-all text-center cursor-pointer"
              title="Locate instantly using GPS coordinates"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'USE LOCATION'}</span>
            </button>

            {/* Modal Close Button */}
            <button
              onClick={onClose}
              className="w-9 h-9 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center transition-all hover:scale-105"
              id="close-location-modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container for content to prevent clipping on small screen heights */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pr-1">
          {/* Form Block */}
          <form onSubmit={handleSave} className="space-y-4">
          
          {/* DELIVERING TO indicator card */}
          <div className="border border-yellow-500/20 bg-yellow-500/[0.02] rounded-2xl p-4 relative overflow-hidden transition-all">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-yellow-500 tracking-widest">
                DELIVERING TO
              </span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 text-yellow-500 flex-shrink-0" />
              <span className="text-sm font-bold font-sans">
                {localCity ? `${localCity}, ${localArea}` : 'Not selected yet'}
              </span>
            </div>
          </div>

          {/* Delivery vs Self Pickup switches */}
          <div className="flex bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-800/80 gap-1.5">
            <button
              type="button"
              onClick={() => setDeliveryType('delivery')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                deliveryType === 'delivery'
                  ? 'bg-yellow-500 text-neutral-950 shadow-lg shadow-yellow-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/20'
              }`}
            >
              <Navigation className="w-4 h-4 rotate-45 text-current" />
              <span>DELIVERY</span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType('pickup')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                deliveryType === 'pickup'
                  ? 'bg-yellow-500 text-neutral-950 shadow-lg shadow-yellow-500/10'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900/20'
              }`}
            >
              <Clock className="w-4 h-4 text-current" />
              <span>PICKUP</span>
            </button>
          </div>

          {/* Prompt link help text */}
          <p className="text-xs text-neutral-400 leading-none">
            <span className="text-emerald-500 font-bold hover:underline cursor-pointer">Login</span> to save your address for faster checkout.
          </p>

          {/* CITY dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block font-sans">
              City
            </label>
            <div className="relative">
              <select
                value={localCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full h-12 bg-[#0c0d12] border border-neutral-800 focus:border-yellow-500/40 rounded-xl px-4 text-sm text-white focus:outline-none appearance-none font-sans font-bold cursor-pointer"
                required
              >
                {PAKISTAN_CITIES.map((city) => (
                  <option key={city} value={city} className="bg-[#0c0d12] text-white">
                    {city}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* AREA dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block font-sans">
              Select Area
            </label>
            <div className="relative">
              <select
                value={localArea}
                onChange={(e) => setLocalArea(e.target.value)}
                className="w-full h-12 bg-[#0c0d12] border border-neutral-800 focus:border-yellow-500/40 rounded-xl px-4 text-sm text-white focus:outline-none appearance-none font-sans cursor-pointer"
                required
              >
                {(CITY_AREAS[localCity] || []).map((area) => (
                  <option key={area} value={area} className="bg-[#0c0d12] text-white">
                    {area}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Phone input field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase block font-sans">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                <Phone className="w-4 h-4" />
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 03001234567"
                className="w-full h-12 bg-[#0c0d12] border border-neutral-800 focus:border-yellow-500/40 rounded-xl pl-11 pr-4 text-sm text-white focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Save & Continue Submit Button */}
          <button
            type="submit"
            className="w-full h-13 bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-500 text-white hover:brightness-110 active:scale-98 transition-all duration-300 rounded-xl mt-6 flex items-center justify-center gap-2 text-sm font-black font-sans shadow-lg shadow-yellow-500/10 cursor-pointer"
          >
            <Compass className="w-4.5 h-4.5" />
            <span>{isSaved ? 'LOCATION SAVED ✓' : 'SAVE LOCATION'}</span>
          </button>
        </form>
        </div>

        {/* Promo support badges at the bottom of the dialog */}
        <div className="border-t border-neutral-900/80 pt-4 mt-6 flex items-center justify-between">
          {/* OPEN 24/7 stamp */}
          <div className="flex items-center gap-2">
            <div className="bg-yellow-500 text-neutral-950 font-display font-black tracking-tighter text-sm px-2 py-0.5 rounded italic leading-none">
              OPEN 24/7
            </div>
            <span className="text-[10px] font-bold text-neutral-500 tracking-wider">
              ROUND THE CLOCK
            </span>
          </div>

          {/* 30 mins indicator */}
          <div className="flex items-center gap-1.5 text-neutral-400 text-xs">
            <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
            <span className="font-sans font-black text-white text-[13px]">30 <span className="text-[10px] text-neutral-400 font-bold uppercase">Mins</span></span>
            <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">DELIVERY</span>
          </div>
        </div>

      </div>
    </div>
  );
};
