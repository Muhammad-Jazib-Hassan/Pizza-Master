import React from 'react';
import { Home, Pizza, ShoppingBag, Flame, MapPin } from 'lucide-react';
import { useCart } from '../cartContext';

interface MobileBottomNavProps {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onCartToggle: () => void;
  onPromoClick: () => void;
  onLocationClick: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeCategory,
  onCategorySelect,
  onCartToggle,
  onPromoClick,
  onLocationClick,
}) => {
  const { cart } = useCart();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onCategorySelect('deals');
  };

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] z-[999] animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* 
        Ultra Glassmorphic Outer Nav Pill 
        Uses dynamic bg-black/40 with high blur, safe white/10 translucent borders, 
        plus a glowing ambient dropshadow to visually detach from high-contrast pizza cards.
      */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-2.5 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] relative">
        
        {/* Subtle upper lighting sheet */}
        <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

        {/* Button 1: Home */}
        <button
          onClick={handleHomeClick}
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            activeCategory === 'deals' && window.scrollY < 300
              ? 'text-yellow-400 scale-105'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="Scroll to Top / Deals"
        >
          {activeCategory === 'deals' && window.scrollY < 300 && (
            <span className="absolute inset-0 bg-yellow-500/10 border border-yellow-500/20 rounded-xl animate-pulse" />
          )}
          <Home className="w-5 h-5 relative z-10" />
        </button>

        {/* Button 2: Pizza Menu */}
        <button
          onClick={() => onCategorySelect('pizzas')}
          className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            activeCategory === 'pizzas'
              ? 'text-yellow-400 scale-105'
              : 'text-neutral-400 hover:text-white'
          }`}
          title="View Pizzas"
        >
          {activeCategory === 'pizzas' && (
            <span className="absolute inset-0 bg-yellow-500/10 border border-yellow-500/20 rounded-xl" />
          )}
          <Pizza className="w-5 h-5 relative z-10" />
        </button>

        {/* Button 3: Floating Transparent Glowing Cart Bag */}
        <div className="relative -mt-6">
          <button
            onClick={onCartToggle}
            className="w-13 h-13 rounded-full bg-yellow-500/20 border border-yellow-500/40 backdrop-blur-md text-yellow-400 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:shadow-[0_0_30px_rgba(234,179,8,0.5)] active:scale-95 transition-all outline-none"
            title="Open Bag"
          >
            <ShoppingBag className="w-5.5 h-5.5 stroke-[2]" />
          </button>
          
          {/* Neon cart item dot counter badge */}
          {cartItemCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 border border-neutral-950 text-white font-mono text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
              {cartItemCount}
            </span>
          )}
        </div>

        {/* Button 4: Flame Deals */}
        <button
          onClick={onPromoClick}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 text-neutral-400 hover:text-yellow-400"
          title="Hot Vouchers"
        >
          <Flame className="w-5 h-5 hover:animate-pulse" />
        </button>

        {/* Button 5: Change Branch Location */}
        <button
          onClick={onLocationClick}
          className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 text-neutral-400 hover:text-yellow-400"
          title="Select Branch Area"
        >
          <MapPin className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
