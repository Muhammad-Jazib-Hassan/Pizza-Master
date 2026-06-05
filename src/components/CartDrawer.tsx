import React, { useState } from 'react';
import { useCart } from '../cartContext';
import { ShoppingBag, Trash2, X, AlertCircle, Plus, Minus, Tag, Check, Award } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutClick: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onCheckoutClick }) => {
  if (!isOpen) return null;

  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    promoCode,
    applyPromoCode,
    removePromoCode,
    deliveryType,
    clearCart,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    
    const res = applyPromoCode(couponInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-wrapper">
      {/* Drawer Overlay backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Drawer Slide Core Panel */}
        <div className="w-screen max-w-md bg-neutral-950 border-l border-neutral-800 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
          
          {/* Header row */}
          <div className="px-6 py-5 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-red-500 animate-pulse" />
              <h2 className="text-lg font-extrabold text-white tracking-tight">Your Master Basket</h2>
              <span className="bg-neutral-900 border border-neutral-800 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((ac, item) => ac + item.quantity, 0)} Items
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white bg-neutral-900 h-9 w-9 border border-neutral-800 hover:border-neutral-700 rounded-full flex items-center justify-center transition-colors"
              id="close-cart-btn"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Cart Items listing section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 select-none">
                <div className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-dashed border-neutral-800 flex items-center justify-center text-neutral-600">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-white font-extrabold text-base">Your Basket is Empty</h3>
                  <p className="text-neutral-500 text-xs px-6 mt-1.5 max-w-xs mx-auto">
                    Take a look at our Pizza Master signature hot pizzas or value combos and start custom cooking!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-red-600 hover:bg-red-700 text-white font-sans text-xs font-bold py-2.5 px-6 rounded-full transition-all"
                  id="cart-drawer-resume"
                >
                  Browse Delicious Menu
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
                  <span className="text-neutral-400 text-xs font-bold">Selected Items</span>
                  <button
                    onClick={clearCart}
                    className="text-neutral-500 hover:text-red-400 text-[10px] font-bold uppercase tracking-wider transition-colors"
                  >
                    Clear Basket
                  </button>
                </div>

                <div className="space-y-3.5">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-neutral-900/35 border border-neutral-900 p-3 rounded-2xl flex gap-3 transition-colors hover:border-neutral-800"
                      id={`cart-row-${item.id}`}
                    >
                      {/* Item thumbnail */}
                      <img
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-neutral-800"
                      />

                      {/* Item context details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-white font-extrabold text-sm truncate uppercase tracking-tight">
                              {item.menuItem.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-neutral-500 hover:text-red-500 transition-colors p-0.5"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Pizza customizer description lists */}
                          {item.customization && (
                            <div className="text-[10px] text-neutral-500 space-y-0.5 mt-1 leading-normal">
                              <p className="text-yellow-500/80 font-mono">
                                {item.customization.size.name} ● {item.customization.crust.name}
                              </p>
                              <p className="text-neutral-400 font-medium">
                                Flavor: {item.customization.flavor.name}
                              </p>
                              {item.customization.toppings.length > 0 && (
                                <p className="text-neutral-500 italic max-w-xs truncate">
                                  +Toppings: {item.customization.toppings.map((t) => t.name).join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Quantity and Price grid */}
                        <div className="flex items-center justify-between pt-2.5 mt-1.5 border-t border-neutral-900">
                          {/* Inner Quantity toggles */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="h-5.5 w-5.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
                              id={`cart-qty-dec-${item.id}`}
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[11px] font-black text-white w-4 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="h-5.5 w-5.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center"
                              id={`cart-qty-inc-${item.id}`}
                            >
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>

                          {/* Line item prices */}
                          <span className="text-white text-xs font-bold font-mono">
                            PKR {(item.unitPrice * item.quantity).toLocaleString('en-PK')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Pricing Summary Footer console */}
          {cart.length > 0 && (
            <div className="p-6 bg-neutral-900 border-t border-neutral-800 space-y-4">
              
              {/* Promo Code input field form */}
              <div className="space-y-2">
                {!promoCode ? (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo Code (MASTER50)"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          setCouponFeedback(null);
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 focus:border-red-500 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-neutral-600 uppercase tracking-widest outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-neutral-800 hover:bg-neutral-700 text-yellow-500 text-xs font-bold px-4 rounded-xl border border-neutral-700"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <div className="bg-red-950/20 border border-red-500/20 px-3 py-2.5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500 shrink-0" />
                      <span className="text-xs font-black text-rose-400 tracking-wider">
                        ACTIVE PROMO: {promoCode}
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-neutral-500 hover:text-white text-[10px] font-bold uppercase"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Feedback notifications */}
                {couponFeedback && (
                  <p className={`text-[10px] font-medium flex items-center gap-1.5 ${
                    couponFeedback.success ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {couponFeedback.success ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {couponFeedback.message}
                  </p>
                )}
              </div>

              {/* Pricing breakdown */}
              <div className="space-y-2 text-xs border-b border-neutral-800/40 pb-4">
                <div className="flex justify-between text-neutral-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">PKR {subtotal.toLocaleString('en-PK')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-red-400 font-semibold">
                    <span>Promo Discount</span>
                    <span className="font-mono">-PKR {discount.toLocaleString('en-PK')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-400">
                  <span>GST/Tax (13% Government Tax)</span>
                  <span className="font-mono text-white">PKR {tax.toLocaleString('en-PK')}</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>
                    {deliveryType === 'delivery' ? 'Delivery Charges' : 'Self Pickup Savings'}
                  </span>
                  <span className={`font-mono ${deliveryType === 'delivery' ? 'text-white' : 'text-green-400'}`}>
                    {deliveryType === 'delivery' ? `PKR ${deliveryFee}` : 'Free'}
                  </span>
                </div>
              </div>

              {/* Grand Total Row */}
              <div className="flex justify-between items-center py-1">
                <span className="text-sm font-black text-white">Grand Total</span>
                <span className="text-lg font-black text-yellow-500 font-mono" id="cart-grand-total">
                  PKR {total.toLocaleString('en-PK')}
                </span>
              </div>

              {/* Call to action Checkout */}
              <button
                onClick={() => {
                  onClose();
                  onCheckoutClick();
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-sans text-xs sm:text-sm font-black h-12 rounded-full shadow-xl shadow-red-700/20 active:scale-95 transition-all flex items-center justify-center gap-2 group border border-red-500"
                id="cart-checkout-cta"
              >
                <span>Proceed to Checkout</span>
                <span className="font-mono bg-red-700 text-white text-[10px] px-2 py-0.5 rounded font-black">
                  PKR {total.toLocaleString('en-PK')}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
