import React, { useState } from 'react';
import { MenuItem } from '../types';
import { useCart } from '../cartContext';
import { Sparkles, Flame, Plus, Check, Settings } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  onCustomizeClick: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onCustomizeClick }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = () => {
    if (item.isPizza) {
      onCustomizeClick(item);
    } else {
      addToCart(item, undefined, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const formattedPrice = new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(item.price);

  return (
    <div
      className="bg-neutral-900/60 border border-neutral-800/80 rounded-2xl overflow-hidden hover:border-red-500/25 hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300 flex flex-col group h-full justify-between"
      id={`menu-item-${item.id}`}
    >
      {/* Product Image Panel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-950">
        <img
          src={item.image}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-95"
          loading="lazy"
        />
        {/* Decorative shadow layer */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/50 via-transparent to-transparent"></div>

        {/* Dynamic Badge Overlays */}
        {item.isPopular && (
          <span className="absolute top-3 left-3 bg-yellow-500 text-black text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider flex items-center gap-1 shadow-lg shadow-black/20">
            <Sparkles className="w-3 h-3 fill-current" />
            POPULAR
          </span>
        )}

        {item.isPizza && (
          <span className="absolute top-3 right-3 bg-red-600/95 border border-red-500/30 text-white text-[10px] font-black px-2.5 py-1 rounded-md tracking-wider shadow-lg shadow-black/20">
            PIZZA
          </span>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Header Row: Title & Heat */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-oswald font-semibold text-white text-base sm:text-lg tracking-wide uppercase group-hover:text-yellow-400 transition-colors">
              {item.name}
            </h3>
            {/* Heat Level Indicator */}
            {item.isPizza && (
              <div className="flex items-center shrink-0">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < 2 ? 'text-red-500 fill-current' : 'text-neutral-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-neutral-400 text-xs leading-relaxed line-clamp-3">
            {item.description}
          </p>

          {/* Deal configuration bullet checklist */}
          {item.dealItems && item.dealItems.length > 0 && (
            <div className="pt-2 pb-1 space-y-1">
              {item.dealItems.map((dealText, index) => (
                <div key={index} className="flex items-center gap-1.5 text-[11px] text-yellow-500/80">
                  <span className="w-1 h-1 rounded-full bg-yellow-500 shrink-0"></span>
                  <span className="truncate">{dealText}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing tag & Trigger Call to action */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-800/50">
          <div>
            <span className="text-neutral-500 text-[10px] block uppercase font-mono">
              {item.isPizza ? 'Price From' : 'Price'}
            </span>
            <span className="text-white text-base sm:text-lg font-black tracking-tight">
              {formattedPrice}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`h-10 px-4 sm:px-5 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all duration-300 ${
              item.isPizza
                ? 'bg-neutral-800 hover:bg-neutral-700 text-yellow-400 border border-neutral-700 hover:border-yellow-500'
                : isAdded
                ? 'bg-green-600/20 text-green-400 border border-green-500'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/10 hover:shadow-red-600/20 active:scale-95'
            }`}
            id={`btn-add-${item.id}`}
          >
            {item.isPizza ? (
              <>
                <Settings className="w-3.5 h-3.5" />
                <span>Customize</span>
              </>
            ) : isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 font-bold" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
