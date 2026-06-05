import React from 'react';
import { Home, Utensils, Flame, MapPin, Gift, User, ShoppingBag, Sun, Moon, Menu, ChevronLeft, Store } from 'lucide-react';
import { PizzaMasterLogo } from './PizzaMasterLogo';

interface SidebarNavProps {
  activeCategory: string;
  onCategorySelect: (cat: string) => void;
  onTrackerToggle: () => void;
  onPromoClick?: () => void;
  onLocationClick?: () => void;
  onUserClick?: () => void;
  onAmbientToggle?: () => void;
  isAmbientActive?: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function SidebarNav({
  activeCategory,
  onCategorySelect,
  onTrackerToggle,
  onPromoClick,
  onLocationClick,
  onUserClick,
  onAmbientToggle,
  isAmbientActive = true,
  isExpanded,
  onToggleExpand,
}: SidebarNavProps) {
  return (
    <aside
      className={`hidden md:flex fixed left-0 top-0 bottom-0 bg-[#090a0f] border-r border-neutral-900 flex-col py-5 z-50 select-none transition-all duration-300 ease-in-out h-screen overflow-hidden ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      id="desktop-sidebar-nav"
    >
      {/* 1. Header Burger Block (Fixed on top, never scrolls) */}
      <div className="px-3.5 pb-3 flex-shrink-0">
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onToggleExpand}
            className="w-11 h-11 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-md flex-shrink-0 cursor-pointer"
            title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            id="sidebar-burger"
          >
            {isExpanded ? <ChevronLeft className="w-5 h-5 text-yellow-500" /> : <Menu className="w-5 h-5" />}
          </button>
          
          {isExpanded && (
            <div className="flex items-center gap-2 animate-fade-in truncate">
              <PizzaMasterLogo size="sm" />
              <div className="leading-none">
                <span className="block font-display text-sm tracking-widest text-white">THE PIZZA</span>
                <span className="block font-oswald text-[9px] font-bold tracking-[0.15em] text-yellow-500">MASTER</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Middle Flex-1 Scrollable Section (Only links scroll if they exceed available space) */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-3.5 py-2 flex flex-col gap-3.5 overflow-x-hidden min-h-0 w-full">
        {/* Scroll top/Home shortcut */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={`w-full rounded-xl flex items-center transition-all duration-300 shadow-md cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          } ${
            activeCategory === 'deals' || window.scrollY < 300
              ? 'bg-yellow-500 text-neutral-950 font-bold shadow-yellow-500/10'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
          }`}
          title="Sourdough Home"
          id="sidebar-home-btn"
        >
          <Home className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">Back To Top</span>}
        </button>

        <div className="h-[1px] bg-neutral-900 my-1 mx-2 flex-shrink-0" />

        {/* Double Combo Deals Section */}
        <button
          onClick={() => onCategorySelect('deals')}
          className={`w-full rounded-xl flex items-center transition-all duration-300 cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          } ${
            activeCategory === 'deals'
              ? 'bg-orange-600/15 border border-orange-500 text-orange-500 font-black scale-102 shadow-md shadow-orange-500/5'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
          }`}
          title="Hot Promo Combos"
          id="sidebar-deals-btn"
        >
          <Flame className="w-5 h-5 text-orange-500 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">Hot Combos</span>}
        </button>

        {/* Oven Hot Pizza Shortcut */}
        <button
          onClick={() => onCategorySelect('pizzas')}
          className={`w-full rounded-xl flex items-center transition-all duration-300 cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          } ${
            activeCategory === 'pizzas'
              ? 'bg-red-600/15 border border-red-500 text-red-500 font-black scale-102 shadow-md shadow-red-500/5'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800'
          }`}
          title="Signature Slices"
          id="sidebar-pizzas-btn"
        >
          <Utensils className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">Gourmet Pizzas</span>}
        </button>

        <div className="h-[1px] bg-neutral-900 my-1 mx-2 flex-shrink-0" />

        {/* Active branch locators */}
        <button
          onClick={onLocationClick}
          className={`w-full rounded-xl flex items-center text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-300 cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          }`}
          title="Karachi, Lahore & Islamabad branches"
          id="sidebar-branches-btn"
        >
          <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">Our Branches</span>}
        </button>

        {/* Vouchers application */}
        <button
          onClick={onPromoClick}
          className={`w-full rounded-xl flex items-center text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-300 cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          }`}
          title="Clip Vouchers"
          id="sidebar-coupons-btn"
        >
          <Gift className="w-5 h-5 text-pink-500 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">Active Coupons</span>}
        </button>

        {/* Companion card user profile */}
        <button
          onClick={onUserClick}
          className={`w-full rounded-xl flex items-center text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-300 cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          }`}
          title="Loyalty Membership"
          id="sidebar-profile-btn"
        >
          <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">VIP Membership</span>}
        </button>

        {/* Order tracking */}
        <button
          onClick={onTrackerToggle}
          className={`w-full rounded-xl flex items-center text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all duration-300 cursor-pointer flex-shrink-0 ${
            isExpanded ? 'px-4 py-3 gap-3.5 justify-start text-left' : 'h-11 justify-center'
          }`}
          title="Track Hot-Boxes"
          id="sidebar-tracker-btn"
        >
          <ShoppingBag className="w-5 h-5 text-purple-400 flex-shrink-0" />
          {isExpanded && <span className="text-xs uppercase tracking-wider truncate font-display">Live Tracker</span>}
        </button>
      </div>

      {/* 3. Bottom Option Block (Fixed on bottom, never scrolls) */}
      <div className="px-3.5 pt-3 border-t border-neutral-900/60 flex-shrink-0 flex flex-col gap-4 w-full">
        {/* Helpline Banner in expanded */}
        {isExpanded && (
          <div className="p-3 bg-neutral-950 border border-neutral-800/60 rounded-xl space-y-1.5 animate-fade-in w-full">
            <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 uppercase font-mono">
              <Store className="w-3 h-3 text-red-500 flex-shrink-0" />
              <span className="truncate">Express Helpline</span>
            </div>
            <a href="tel:111339339" className="block text-white font-mono font-black text-xs hover:text-yellow-400 transition-colors truncate">
              UAN: 111-339-339
            </a>
          </div>
        )}

        {/* Theme Mode Toggle (Light/Dark) */}
        <button
          onClick={onAmbientToggle}
          className={`w-full rounded-xl flex items-center justify-center transition-all duration-300 cursor-pointer select-none ${
            isExpanded ? 'px-4 py-3 gap-3.5 text-left' : 'h-11'
          } ${
            isAmbientActive
              ? 'text-yellow-400 bg-yellow-500/5 hover:bg-yellow-500/10 border border-yellow-500/10'
              : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 border border-transparent'
          }`}
          title="Toggle Dark/Light Theme"
          id="sidebar-theme-btn"
        >
          {isAmbientActive ? (
            <Moon className="w-5 h-5 flex-shrink-0 text-yellow-500" />
          ) : (
            <Sun className="w-5 h-5 flex-shrink-0 text-orange-500" />
          )}
          {isExpanded && (
            <span className="text-[11px] font-bold uppercase tracking-wider font-mono truncate">
              {isAmbientActive ? 'Theme: Dark' : 'Theme: Light'}
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
