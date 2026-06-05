import React, { useState } from 'react';
import { useCart } from '../cartContext';
import { PAKISTAN_CITIES, CITY_AREAS } from '../data';
import { MapPin, ShoppingBag, Phone, ChevronDown, ListOrdered, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { PizzaMasterLogo } from './PizzaMasterLogo';

interface HeaderProps {
  onCartToggle: () => void;
  onTrackerToggle: () => void;
  onCategorySelect?: (category: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onCartToggle, onTrackerToggle, onCategorySelect }) => {
  const {
    deliveryType,
    setDeliveryType,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
    cart,
    activeOrder,
  } = useCart();

  const [cityOpen, setCityOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    // Reset area to the first one in the new city
    const areas = CITY_AREAS[city] || [];
    if (areas.length > 0) {
      setSelectedArea(areas[0]);
    }
    setCityOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-neutral-950 border-b border-yellow-500/10 shadow-xl" id="app-header">
      {/* Top micro-banner */}
      <div className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-600 text-neutral-100 text-xs py-1.5 px-4 font-sans font-medium flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
          <span>Get 15% off your first pizza! Code: <strong className="font-bold tracking-wider">MASTER50</strong></span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] opacity-90">
          <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> UAN: 111-339-339</span>
          <span>●</span>
          <span>Fresh Oven-Baked Guarantee</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
        {/* Left: Logo & Toggle */}
        <div className="flex items-center gap-5">
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-neutral-300 hover:text-yellow-500 transition-colors"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <PizzaMasterLogo size="md" className="group-hover:scale-105 transition-transform duration-300" />
            <div className="leading-none select-none">
              <span className="block font-display text-2xl tracking-wide text-white">THE PIZZA</span>
              <span className="block font-oswald text-[10px] font-bold tracking-[0.25em] text-yellow-500">MASTER</span>
            </div>
          </a>

          {/* Location details (desktop) */}
          <div className="hidden md:flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-3 py-1.5 text-xs text-neutral-300">
            <MapPin className="w-3.5 h-3.5 text-red-500" />
            
            {/* City Selector */}
            <div className="relative">
              <button 
                onClick={() => { setCityOpen(!cityOpen); setAreaOpen(false); }}
                className="font-semibold flex items-center gap-1 text-white hover:text-yellow-400 transition-colors"
                id="city-select-btn"
              >
                {selectedCity}
                <ChevronDown className="w-3 h-3 text-yellow-500" />
              </button>
              {cityOpen && (
                <div className="absolute top-8 left-0 mt-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-1 w-32 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
                  {PAKISTAN_CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityChange(city)}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-800 hover:text-yellow-400 text-neutral-300 text-xs transition-colors"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-neutral-600">|</span>

            {/* Area Selector */}
            <div className="relative">
              <button 
                onClick={() => { setAreaOpen(!areaOpen); setCityOpen(false); }}
                className="font-medium flex items-center gap-1 hover:text-yellow-400 transition-colors max-w-[120px] truncate"
                id="area-select-btn"
              >
                {selectedArea}
                <ChevronDown className="w-3 h-3 text-yellow-500" />
              </button>
              {areaOpen && (
                <div className="absolute top-8 left-0 mt-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl py-1 w-48 max-h-56 overflow-y-auto z-50 animate-in fade-in slide-in-from-top-1 duration-200 scrollbar-thin">
                  {(CITY_AREAS[selectedCity] || []).map((area) => (
                    <button
                      key={area}
                      onClick={() => {
                        setSelectedArea(area);
                        setAreaOpen(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-neutral-800 hover:text-yellow-400 text-neutral-300 text-xs transition-colors"
                    >
                      {area}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Center Toggle: Delivery vs Pickup */}
        <div className="hidden sm:flex bg-neutral-900 p-1 rounded-full border border-neutral-800">
          <button
            onClick={() => setDeliveryType('delivery')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              deliveryType === 'delivery'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            id="toggle-delivery"
          >
            Delivery (20-30m)
          </button>
          <button
            onClick={() => setDeliveryType('pickup')}
            className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
              deliveryType === 'pickup'
                ? 'bg-yellow-500 text-neutral-950 shadow-lg shadow-yellow-500/20'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            id="toggle-pickup"
          >
            Self Pickup (10m)
          </button>
        </div>

        {/* Right Action panel */}
        <div className="flex items-center gap-3">
          {/* Tracker Trigger if activeOrder exists */}
          {activeOrder && (
            <button
              onClick={onTrackerToggle}
              className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-green-500/30 text-green-400 text-xs font-bold py-2 px-3.5 rounded-full relative group transition-all"
              id="header-tracker-btn"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span>Track Order</span>
              <span className="hidden lg:inline text-neutral-500">({activeOrder.id})</span>
            </button>
          )}

          {/* Quick Support / Contact */}
          <a
            href="tel:111339339"
            className="hidden lg:flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 text-yellow-500 hover:text-white hover:bg-yellow-600 hover:border-yellow-600 transition-all duration-300"
            title="Call Support"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Cart Trigger Button */}
          <button
            onClick={onCartToggle}
            className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-sans text-sm font-bold h-11 px-5 rounded-full shadow-lg shadow-red-600/20 active:scale-95 transition-all border border-red-500"
            id="header-cart-btn"
          >
            <div className="relative">
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-yellow-400 text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-neutral-950 animate-bounce">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Cart</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop & Panel */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-neutral-950 z-50 p-6 flex flex-col border-r border-neutral-800 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <PizzaMasterLogo size="sm" />
                <div className="leading-none">
                  <span className="block font-display text-base tracking-wide text-white">THE PIZZA</span>
                  <span className="block font-oswald text-[9px] font-bold tracking-[0.14em] text-yellow-500">MASTER</span>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Location Selector */}
            <div className="mb-6 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
              <span className="text-neutral-500 text-xs block mb-1">Your Branch Location</span>
              <div className="text-white font-bold flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                {selectedCity}, {selectedArea}
              </div>
            </div>

            {/* Delivery Toggle for Mobile */}
            <div className="grid grid-cols-2 bg-neutral-900 p-1 rounded-full border border-neutral-800 mb-6">
              <button
                onClick={() => { setDeliveryType('delivery'); setMobileMenuOpen(false); }}
                className={`py-2 text-center text-xs font-bold rounded-full transition-all ${
                  deliveryType === 'delivery' ? 'bg-red-600 text-white' : 'text-neutral-400'
                }`}
              >
                Delivery
              </button>
              <button
                onClick={() => { setDeliveryType('pickup'); setMobileMenuOpen(false); }}
                className={`py-2 text-center text-xs font-bold rounded-full transition-all ${
                  deliveryType === 'pickup' ? 'bg-yellow-500 text-neutral-950' : 'text-neutral-400'
                }`}
              >
                Pickup
              </button>
            </div>

            {/* Menu Sections Navigation */}
            <div className="space-y-4 flex-1">
              <span className="text-neutral-500 text-xs font-bold tracking-widest block uppercase mb-2">Categories</span>
              {['deals', 'pizzas', 'starters', 'pasta', 'desserts', 'beverages', 'dips'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (onCategorySelect) onCategorySelect(cat);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left font-bold text-neutral-300 hover:text-yellow-500 capitalize flex items-center justify-between group"
                >
                  <span>{cat === 'starters' ? 'Starters & Sides' : cat}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-yellow-500 transition-all transform translate-x-[-10px] group-hover:translate-x-0" />
                </button>
              ))}
            </div>

            {/* Footer with Contact info */}
            <div className="border-t border-neutral-800 pt-6 mt-6 space-y-3">
              <a href="tel:111339339" className="flex items-center gap-2.5 text-yellow-500 font-bold text-sm">
                <Phone className="w-4 h-4" /> UAN: 111-339-339
              </a>
              <p className="text-neutral-500 text-[11px]">
                Replica for demonstration. Enjoy ordering high-durability pizzas online!
              </p>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
