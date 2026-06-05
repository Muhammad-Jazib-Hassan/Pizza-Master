import React, { useState, useEffect } from 'react';
import { MenuItem, PizzaSizeOption, CrustOption, FlavorOption, ToppingOption, CustomizationState } from '../types';
import { useCart } from '../cartContext';
import { Pizza, Flame, Check, Plus, Minus, X, AlertCircle } from 'lucide-react';

interface CustomizerModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({ item, isOpen, onClose }) => {
  if (!item || !isOpen) return null;

  const { addToCart } = useCart();

  // Pick default configurations safely
  const availableSizes = item.sizes || [];
  const availableCrusts = item.crusts || [];
  const availableFlavors = item.flavors || [];
  const availableToppings = item.toppings || [];

  const [selectedSize, setSelectedSize] = useState<PizzaSizeOption>(availableSizes[0]);
  const [selectedCrust, setSelectedCrust] = useState<CrustOption>(availableCrusts[0]);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorOption>(availableFlavors[0]);
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Sync state when a new item opens
  useEffect(() => {
    if (item) {
      if (availableSizes.length > 0) setSelectedSize(availableSizes[0]);
      if (availableCrusts.length > 0) setSelectedCrust(availableCrusts[0]);
      if (availableFlavors.length > 0) setSelectedFlavor(availableFlavors[0]);
      setSelectedToppings([]);
      setQuantity(1);
    }
  }, [item]);

  // Pricing calculation
  // Check if deal pizza - Deals have constant base price, sizing is disabled or locks to deal definition
  const basePrice = item.category === 'deals' ? item.price : selectedSize?.priceBase || item.price;
  const crustPrice = selectedCrust?.priceUpsell || 0;
  const toppingsPrice = selectedToppings.reduce((sum, t) => sum + t.price, 0);
  const finalUnitPrice = basePrice + crustPrice + toppingsPrice;
  const finalTotalPrice = finalUnitPrice * quantity;

  const handleToppingToggle = (topping: ToppingOption) => {
    setSelectedToppings((prev) => {
      const exists = prev.some((t) => t.id === topping.id);
      if (exists) {
        return prev.filter((t) => t.id !== topping.id);
      } else {
        return [...prev, topping];
      }
    });
  };

  const handleAddToCart = () => {
    const customization: CustomizationState = {
      size: selectedSize,
      crust: selectedCrust,
      flavor: selectedFlavor,
      toppings: selectedToppings,
    };

    addToCart(item, customization, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="customizer-modal-wrapper">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card Frame */}
      <div className="relative bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Left Side: Dynamic Pizza Canvas Viewer */}
        <div className="w-full lg:w-1/2 bg-neutral-900/40 p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-neutral-800 relative select-none min-h-[280px]">
          
          {/* Radial light glow behind the pizza */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Cooking Pan Frame */}
          <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-neutral-800 bg-[#151518] flex items-center justify-center shadow-inner scale-in duration-300">
            {/* Interactive Sourdough Dough */}
            <div className="absolute inset-2 bg-gradient-to-tr from-amber-700 via-amber-600 to-amber-500 rounded-full shadow-md">
              
              {/* Marinara Red Paste Layer */}
              <div className="absolute inset-1.5 bg-red-800 border-2 border-amber-600 rounded-full shadow-inner opacity-90"></div>
              
              {/* Cheese Melt Layer */}
              <div className="absolute inset-2.5 bg-gradient-to-r from-yellow-300 via-amber-100 to-yellow-200 rounded-full opacity-90 mix-blend-normal">
                {/* Visual Pizza Slices Marks */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent"></div>
                <div className="absolute inset-0 border-t border-t-amber-800/20 rotate-[45deg]"></div>
                <div className="absolute inset-0 border-t border-t-amber-800/20 rotate-[135deg]"></div>
                <div className="absolute inset-0 border-t border-t-amber-800/20 rotate-[90deg]"></div>
                <div className="absolute inset-0 border-t border-t-amber-800/20 rotate-[0deg]"></div>
              </div>

              {/* Dynamic Toppings Render Engine */}
              <div className="absolute inset-4 overflow-hidden rounded-full font-mono">
                {/* Rendery Olives */}
                {selectedToppings.some((t) => t.id === 'top_olives') && (
                  <>
                    <div className="absolute top-8 left-16 w-3 h-3 rounded-full bg-black border border-neutral-800"></div>
                    <div className="absolute top-20 left-10 w-3 h-3 rounded-full bg-black border border-neutral-800"></div>
                    <div className="absolute top-32 left-28 w-3 h-3 rounded-full bg-black border border-neutral-800"></div>
                    <div className="absolute top-12 left-32 w-3 h-3 rounded-full bg-black border border-neutral-800"></div>
                    <div className="absolute top-28 left-40 w-3 h-3 rounded-full bg-black border border-neutral-800"></div>
                  </>
                )}

                {/* Rendery Spicy Peppers */}
                {selectedToppings.some((t) => t.id === 'top_jalapenos') && (
                  <>
                    <div className="absolute top-16 left-12 w-4 h-3 bg-green-600 rounded-full border border-green-700 rotate-12"></div>
                    <div className="absolute top-28 left-20 w-4 h-3 bg-green-600 rounded-full border border-green-700 -rotate-45"></div>
                    <div className="absolute top-14 left-26 w-4 h-3 bg-green-600 rounded-full border border-green-700 rotate-[60deg]"></div>
                    <div className="absolute top-36 left-14 w-4 h-3 bg-green-600 rounded-full border border-green-700 rotate-[110deg]"></div>
                  </>
                )}

                {/* Rendery Pepperoni */}
                {selectedToppings.some((t) => t.id === 'top_pepperoni') && (
                  <>
                    <div className="absolute top-6 left-24 w-6 h-6 bg-red-700 rounded-full border border-red-800 flex items-center justify-center text-[5px] scale-90">🔴</div>
                    <div className="absolute top-26 left-6 w-6 h-6 bg-red-700 rounded-full border border-red-800 flex items-center justify-center text-[5px] scale-90">🔴</div>
                    <div className="absolute top-18 left-34 w-6 h-6 bg-red-700 rounded-full border border-red-800 flex items-center justify-center text-[5px] scale-90">🔴</div>
                    <div className="absolute top-34 left-22 w-6 h-6 bg-red-700 rounded-full border border-red-800 flex items-center justify-center text-[5px] scale-90">🔴</div>
                  </>
                )}

                {/* Rendery Mushrooms */}
                {selectedToppings.some((t) => t.id === 'top_mushrooms') && (
                  <>
                    <div className="absolute top-10 left-8 w-4 h-4 bg-yellow-100 rounded-t-full border-b-2 border-neutral-400 rotate-12"></div>
                    <div className="absolute top-22 left-24 w-4 h-4 bg-yellow-100 rounded-t-full border-b-2 border-neutral-400 -rotate-30"></div>
                    <div className="absolute top-32 left-10 w-4 h-4 bg-yellow-100 rounded-t-full border-b-2 border-neutral-400 rotate-90"></div>
                    <div className="absolute top-24 left-36 w-4 h-4 bg-yellow-100 rounded-t-full border-b-2 border-neutral-400 rotate-[140deg]"></div>
                  </>
                )}

                {/* Rendery Chicken Chunks */}
                {selectedToppings.some((t) => t.id === 'top_smoked_chicken' || t.id === 'top_tikka_chicken') && (
                  <>
                    <div className="absolute top-12 left-18 w-5 h-4 bg-amber-800 rounded shadow border border-amber-950"></div>
                    <div className="absolute top-30 left-12 w-5 h-4 bg-amber-800 rounded shadow border border-amber-950"></div>
                    <div className="absolute top-20 left-28 w-5 h-4 bg-amber-800 rounded shadow border border-amber-950"></div>
                    <div className="absolute top-34 left-36 w-5 h-4 bg-amber-800 rounded shadow border border-amber-950"></div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Pizza Caption with size */}
          <div className="text-center mt-6 space-y-1 z-10">
            <span className="text-yellow-400 font-oswald text-xs block uppercase tracking-widest leading-none">
              Custom Oven Pizza
            </span>
            <h3 className="text-white text-xl font-display tracking-wider uppercase">
              {selectedFlavor?.name || 'My Pizza'}
            </h3>
            <p className="text-neutral-500 text-[11px] font-mono">
              {selectedSize?.name} ● {selectedCrust?.name} ● {selectedSize?.slices} slices
            </p>
          </div>
        </div>

        {/* Right Side: Options Bento-Box Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between max-h-[50vh] lg:max-h-none overflow-y-auto lg:overflow-visible">
          
          {/* Header Close Panel */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <span className="text-red-500 text-[10px] font-oswald font-bold block uppercase tracking-widest">Custom Pizza Cooking</span>
              <h2 className="text-2xl font-display text-white tracking-wider uppercase">{item.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
              id="close-customizer-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Options Body Container */}
          <div className="p-6 space-y-6 flex-1 max-h-[55vh] overflow-y-auto scrollbar-thin">
            
            {/* 1. Size Selection Panel */}
            {availableSizes.length > 0 && item.category !== 'deals' && (
              <div className="space-y-3">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
                  Step 1: Choose Size
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  {availableSizes.map((sz) => {
                    const isSelected = selectedSize?.id === sz.id;
                    return (
                      <button
                        key={sz.id}
                        onClick={() => setSelectedSize(sz)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-neutral-900 border-red-500 text-white shadow-lg'
                            : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                        }`}
                        id={`size-btn-${sz.id}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-extrabold text-xs">{sz.name}</span>
                          <span className="text-[10px] font-mono text-yellow-500">{sz.slices} Slices</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-normal line-clamp-1">{sz.description}</p>
                        <span className="text-xs font-bold text-white mt-1.5 block">PKR {sz.priceBase}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 1. Deals Information Message for Size Selection */}
            {item.category === 'deals' && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3.5 rounded-xl flex gap-2.5 items-start">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-yellow-500 block">Deal Locked Size Slicing</span>
                  <p className="text-neutral-400 text-[10px] leading-relaxed">
                    This deal includes a preconfigured {selectedSize?.name || 'locked-size'} pizza. Custom crust configurations, local seasonings, and extra toppings still apply!
                  </p>
                </div>
              </div>
            )}

            {/* 2. Crust Selection Panel */}
            {availableCrusts.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
                  Step 2: Choose Crust Layer
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {availableCrusts.map((cr) => {
                    const isSelected = selectedCrust?.id === cr.id;
                    return (
                      <button
                        key={cr.id}
                        onClick={() => setSelectedCrust(cr)}
                        className={`text-left px-3 py-2.5 rounded-lg border text-xs font-bold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-neutral-900 border-red-500 text-white'
                            : 'bg-neutral-900/20 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                        }`}
                        id={`crust-btn-${cr.id}`}
                      >
                        <span>{cr.name}</span>
                        {cr.priceUpsell > 0 ? (
                          <span className="text-[10px] font-bold text-yellow-500">+PKR {cr.priceUpsell}</span>
                        ) : (
                          <span className="text-[10px] text-green-500 font-bold">Free</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Choose Flavor / Seasoning */}
            {availableFlavors.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
                  Step 3: Choose Flavor Seasoning
                </span>
                <div className="space-y-2">
                  {availableFlavors.map((fl) => {
                    const isSelected = selectedFlavor?.id === fl.id;
                    return (
                      <button
                        key={fl.id}
                        onClick={() => setSelectedFlavor(fl)}
                        className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'bg-neutral-900 border-red-500 text-white'
                            : 'bg-neutral-900/20 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                        }`}
                        id={`flavor-btn-${fl.id}`}
                      >
                        <div className="relative mt-0.5">
                          <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                            isSelected ? 'border-red-500 bg-red-600' : 'border-neutral-700'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                          </div>
                        </div>

                        <div className="space-y-0.5 flex-1 select-none">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-extrabold text-xs text-white">{fl.name}</span>
                            {/* Chili Level representation */}
                            {fl.heatLevel > 0 && (
                              <span className="flex items-center gap-0.5 select-none" title={`Heat level: ${fl.heatLevel}`}>
                                {Array.from({ length: fl.heatLevel }).map((_, idx) => (
                                  <Flame key={idx} className="w-3 h-3 text-red-500 fill-current shrink-0" />
                                ))}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-neutral-500 leading-normal">{fl.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Extra Premium Extra Toppings */}
            {availableToppings.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
                  Step 4: Add Extra Toppings (Optional)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableToppings.map((to) => {
                    const isChecked = selectedToppings.some((t) => t.id === to.id);
                    return (
                      <button
                        key={to.id}
                        onClick={() => handleToppingToggle(to)}
                        className={`text-left p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all select-none ${
                          isChecked
                            ? 'bg-red-950/20 border-red-500 text-white'
                            : 'bg-neutral-900/30 border-neutral-800/80 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
                        }`}
                        id={`topping-chk-${to.id}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                            isChecked ? 'bg-red-600 border-red-500' : 'border-neutral-700'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                          </div>
                          <span>{to.name}</span>
                        </div>
                        <span className="text-[10px] text-yellow-500 font-bold font-mono">+PKR {to.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Quantity & Add to Cart panel */}
          <div className="p-6 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Quantity Counter adjustment */}
            <div className="flex items-center gap-3.5 bg-neutral-950 px-4 py-2 border border-neutral-800 rounded-full select-none">
              <span className="text-neutral-500 text-xs font-bold leading-none">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="text-neutral-400 hover:text-white h-7 w-7 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors flex items-center justify-center border border-neutral-800"
                  id="customizer-qty-dec"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-sm font-black text-white w-4 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="text-neutral-400 hover:text-white h-7 w-7 rounded-full bg-neutral-900 hover:bg-neutral-800 transition-colors flex items-center justify-center border border-neutral-800"
                  id="customizer-qty-inc"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Price tag & Basket call to action */}
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
              <div className="text-left sm:text-right">
                <span className="text-neutral-500 text-[10px] block uppercase font-mono">Total Price</span>
                <span className="text-white text-lg font-black tracking-tight" id="customizer-total-preview">
                  PKR {finalTotalPrice.toLocaleString('en-PK')}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-sans text-xs sm:text-sm font-black h-12 px-8 rounded-full shadow-lg shadow-red-700/20 active:scale-95 transition-all text-center"
                id="customizer-add-to-cart-btn"
              >
                Add to Basket
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
