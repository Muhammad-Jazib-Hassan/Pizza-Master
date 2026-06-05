import React from 'react';
import { useCart } from '../cartContext';
import { OrderStatus } from '../types';
import { Truck, Clock, Smartphone, MapPin, CheckCircle, Flame, Pizza, Store, Star, User } from 'lucide-react';

interface OrderTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({ isOpen, onClose }) => {
  const { activeOrder, resetActiveOrder } = useCart();

  if (!isOpen || !activeOrder) return null;

  const currentStatus = activeOrder.status;

  const stepsList: { status: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      status: 'placed',
      label: 'Order Confirmed',
      desc: 'The Pizza Master kitchen has received and approved your order.',
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      status: 'cooking',
      label: 'Baking in Oven',
      desc: 'Our chefs are hand-stretching sourdough and oven-baking at 450 degrees.',
      icon: <Pizza className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />,
    },
    {
      status: 'out_for_delivery',
      label: 'Out for Delivery',
      desc: 'Our fast hot-box courier biker is speeding down Sunset Boulevard to you.',
      icon: <Truck className="w-5 h-5 animate-bounce" />,
    },
    {
      status: 'delivered',
      label: 'Freshly Delivered',
      desc: 'Deliver complete! Pull loose those cheese strings and grab a slice!',
      icon: <Star className="w-5 h-5 text-yellow-500 fill-current" />,
    },
  ];

  const getStepIndex = (status: OrderStatus) => {
    if (status === 'placed') return 0;
    if (status === 'cooking') return 1;
    if (status === 'out_for_delivery') return 2;
    if (status === 'delivered') return 3;
    return 0;
  };

  const currentStepIndex = getStepIndex(currentStatus);

  // Approximate remaining minutes
  const getRemainingMinutes = (status: OrderStatus) => {
    if (status === 'placed') return 25;
    if (status === 'cooking') return 18;
    if (status === 'out_for_delivery') return 8;
    return 0;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="order-tracker-overlay">
      {/* Dim backdrop */}
      <div 
        className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4 relative z-10 w-full max-w-4xl mx-auto">
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
          
          {/* Left panel: Live Progress Animation */}
          <div className="w-full md:w-[55%] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-yellow-500 text-xs font-mono font-black uppercase tracking-wider block">
                    Live Pizza Delivery Tracker
                  </span>
                  <h2 className="text-white text-2xl font-black tracking-tight flex items-center gap-2">
                    <span>Order: {activeOrder.id}</span>
                  </h2>
                </div>

                {/* Status Countdown */}
                {currentStatus !== 'delivered' ? (
                  <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 select-none">
                    <Clock className="w-3.5 h-3.5 text-yellow-500" />
                    <span className="text-[11px] text-white font-mono font-extrabold tracking-tight">
                      Est: ~{getRemainingMinutes(currentStatus)} Mins
                    </span>
                  </div>
                ) : (
                  <div className="bg-green-600/10 border border-green-500/25 px-3 py-1.5 rounded-full flex items-center gap-1.5 shrink-0 uppercase tracking-wider text-[10px] font-black text-green-400 select-none">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Complete
                  </div>
                )}
              </div>

              {/* Graphical Pizza baking background animation helper */}
              <div className="bg-neutral-900/40 p-5 rounded-2xl border border-neutral-900 mb-8 relative overflow-hidden flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest text-neutral-500 block mb-1">
                    Current Step
                  </span>
                  <h3 className="text-white text-base font-extrabold capitalize">
                    {stepsList[currentStepIndex].label}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-1 leading-normal">
                    {stepsList[currentStepIndex].desc}
                  </p>
                </div>

                {/* Large animated graphic icons */}
                <div className="h-14 w-14 bg-red-600/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center shrink-0 ml-4 relative">
                  {currentStatus === 'cooking' && (
                    <span className="absolute inset-0 rounded-full bg-yellow-500/5 animate-ping"></span>
                  )}
                  {stepsList[currentStepIndex].icon}
                </div>
              </div>

              {/* Progress Stepper Logics */}
              <div className="relative space-y-6 pl-8">
                {/* Connecting lines */}
                <div className="absolute left-3.5 top-2.5 bottom-2.5 w-0.5 bg-neutral-800"></div>

                {stepsList.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isTodo = idx > currentStepIndex;

                  return (
                    <div key={idx} className="relative flex gap-4 text-xs leading-normal">
                      
                      {/* Left circular node indicator */}
                      <span className={`absolute left-[-26px] top-1 h-5.5 w-5.5 rounded-full flex items-center justify-center border transition-all ${
                        isDone
                          ? 'bg-green-500 border-green-500 text-neutral-950'
                          : isCurrent
                          ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-600'
                      }`}>
                        {isDone ? (
                          <CheckCircle className="w-3.5 h-3.5" />
                        ) : (
                          <span className="text-[10px] font-mono font-black">{idx + 1}</span>
                        )}
                      </span>

                      {/* Text Label details */}
                      <div className="space-y-0.5">
                        <h4 className={`font-extrabold tracking-tight ${
                          isDone ? 'text-green-400' : isCurrent ? 'text-white' : 'text-neutral-600'
                        }`}>
                          {step.label}
                        </h4>
                        <p className={`text-[11px] leading-relaxed max-w-sm ${
                          isCurrent ? 'text-neutral-300' : 'text-neutral-600'
                        }`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Support Call to action details */}
            <div className="pt-8 border-t border-neutral-900 mt-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
              <a
                href="tel:111339339"
                className="flex items-center gap-2 text-yellow-500 hover:text-white text-xs font-bold transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                <span>Call Pizza Master Support (111-339-339)</span>
              </a>

              <button
                onClick={onClose}
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 text-xs font-bold px-5 py-2.5 rounded-full transition-all"
                id="tracker-close-btn"
              >
                Close Tracking
              </button>
            </div>
          </div>

          {/* Right panel: Static Customer Receipt details */}
          <div className="w-full md:w-[45%] bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-neutral-900">
            <div className="space-y-6">
              <h3 className="text-white font-extrabold text-base border-b border-neutral-900 pb-3 flex items-center gap-2">
                <Store className="w-4.5 h-4.5 text-red-500" />
                <span>Receipt Details</span>
              </h3>

              {/* Delivery info logs */}
              <div className="space-y-3.5 text-xs text-neutral-400 leading-relaxed border-b border-neutral-900 pb-5">
                <div className="flex gap-2">
                  <User className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block text-[11px]">Customer</span>
                    <p className="text-[11px]">{activeOrder.customer.name} ({activeOrder.customer.phone})</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-bold block text-[11px]">
                      {activeOrder.deliveryType === 'delivery' ? 'Serving Destination' : 'Pickup Store'}
                    </span>
                    <p className="text-[11px] text-neutral-300 leading-normal max-w-[220px]">
                      {activeOrder.customer.city}, {activeOrder.customer.area} <br />
                      <span className="text-neutral-500 italic font-mono">{activeOrder.customer.address}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Ordered Pizzas check logs */}
              <div className="space-y-4 max-h-[22vh] overflow-y-auto scrollbar-thin">
                <span className="text-[10px] font-mono font-black uppercase text-neutral-500 block">
                  Items Checked Order Invoice
                </span>
                
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs leading-normal">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-extrabold text-white truncate text-[11px] block uppercase">
                          {item.menuItem.name}
                        </span>
                        <span className="font-mono text-neutral-400 text-[10px]">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.customization && (
                        <p className="text-[9px] text-neutral-500 truncate max-w-[120px]">
                          {item.customization.size.name} ● {item.customization.crust.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sum receipt lists */}
            <div className="border-t border-neutral-900 pt-5 mt-6 space-y-2">
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Receipt Subtotal</span>
                <span className="font-mono text-white text-[11px]">PKR {activeOrder.subtotal.toLocaleString('en-PK')}</span>
              </div>
              {activeOrder.discount > 0 && (
                <div className="flex justify-between text-xs text-red-400 font-semibold">
                  <span>Special Promo Offer</span>
                  <span className="font-mono text-[11px]">-PKR {activeOrder.discount.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-neutral-500">
                <span>GST Tax (13%)</span>
                <span className="font-mono text-white text-[11px]">PKR {activeOrder.tax.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between text-xs text-neutral-500 pb-3 border-b border-neutral-900">
                <span>Charges / Surcharges</span>
                <span className="font-mono text-white text-[11px]">
                  {activeOrder.deliveryType === 'delivery' ? `PKR ${activeOrder.deliveryFee}` : 'Free'}
                </span>
              </div>

              {/* Reset Order, checkout another */}
              <div className="flex justify-between items-center pt-2 mb-4 select-none">
                <span className="text-xs font-extrabold text-white">Paid Total bill</span>
                <span className="text-base font-black text-yellow-500 font-mono">
                  PKR {activeOrder.total.toLocaleString('en-PK')}
                </span>
              </div>

              {currentStatus === 'delivered' && (
                <button
                  onClick={resetActiveOrder}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all font-sans uppercase"
                >
                  Order New Delicious Pizza!
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
