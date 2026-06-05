import React, { useState } from 'react';
import { useCart } from '../cartContext';
import { CustomerDetails } from '../types';
import { PAKISTAN_CITIES, CITY_AREAS } from '../data';
import { MapPin, Phone, User, Mail, CreditCard, ChevronLeft, ShoppingBag, Truck } from 'lucide-react';

interface CheckoutFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  if (!isOpen) return null;

  const {
    cart,
    deliveryType,
    selectedCity,
    setSelectedCity,
    selectedArea,
    setSelectedArea,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    placeOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'card',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      tempErrors.name = 'Full name is strictly required';
    } else if (formData.name.length < 3) {
      tempErrors.name = 'Provide a valid name';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Provide a valid email format';
    }

    const cleanedPhone = formData.phone.replace(/[-\s]/g, '');
    if (!formData.phone.trim()) {
      tempErrors.phone = 'Mobile number is required';
    } else if (!/^(03|\+923)\d{9}$/.test(cleanedPhone) && !/^\d{11}$/.test(cleanedPhone)) {
      tempErrors.phone = 'Provide valid 11-digit Pak number (e.g., 03331234567)';
    }

    if (deliveryType === 'delivery') {
      if (!formData.address.trim()) {
        tempErrors.address = 'Full delivery address is required';
      } else if (formData.address.length < 10) {
        tempErrors.address = 'Provide a detailed house/apartment & street address';
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const customer: CustomerDetails = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      city: selectedCity,
      area: selectedArea,
      address: deliveryType === 'delivery' ? formData.address : `Self Pickup at ${selectedCity} Pizza Master Store`,
      notes: formData.notes,
      paymentMethod: formData.paymentMethod,
    };

    placeOrder(customer);
    onOrderSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" id="checkout-flow-overlay">
      {/* Dim backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="flex min-h-screen items-center justify-center p-4 relative z-10 w-full max-w-5xl mx-auto">
        {/* Checkout Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
          
          {/* Left: Input Form panels */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-neutral-800">
            
            {/* Nav Close */}
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white text-xs font-bold mb-6 transition-colors"
              id="back-to-menu-btn"
            >
              <ChevronLeft className="w-4 h-4 text-red-500" />
              <span>Back to Delicious Menu</span>
            </button>

            <h2 className="text-2xl font-black text-white tracking-tight mb-1.5 flex items-center gap-2">
              <Truck className="w-6 h-6 text-red-500" />
              <span>{deliveryType === 'delivery' ? 'Delivery Address' : 'Confirm Store Pickup'}</span>
            </h2>
            <p className="text-neutral-500 text-xs mb-6 leading-relaxed">
              Confirm your Pakistani branch location details, active mobile number, and payment preference below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Mohammed Jazib"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full bg-neutral-900 border ${
                        errors.name ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
                      } rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all`}
                    />
                  </div>
                  {errors.name && <p className="text-[10px] text-red-500 font-medium">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full bg-neutral-900 border ${
                        errors.email ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
                      } rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-red-500 font-medium">{errors.email}</p>}
                </div>
              </div>

              {/* Mobile Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Active Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-neutral-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 03331234567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full bg-neutral-900 border ${
                      errors.phone ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
                    } rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-medium">{errors.phone}</p>}
              </div>

              {/* Location Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* City */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    City Branch
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      const city = e.target.value;
                      setSelectedCity(city);
                      const areas = CITY_AREAS[city] || [];
                      if (areas.length > 0) setSelectedArea(areas[0]);
                    }}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Local Area */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    Serving Sector / Area
                  </label>
                  <select
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl py-2.5 px-3 text-xs text-white outline-none"
                  >
                    {(CITY_AREAS[selectedCity] || []).map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery Address Details */}
              {deliveryType === 'delivery' ? (
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                    Complete Street Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-neutral-600 absolute left-3 top-3" />
                    <textarea
                      name="address"
                      placeholder="e.g. House No. 44-B, Sunset Boulevard Street 12, Phase 2 Ext DHA"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full bg-neutral-900 border ${
                        errors.address ? 'border-red-500' : 'border-neutral-800 focus:border-red-500'
                      } rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-neutral-600 outline-none transition-all resize-none`}
                    ></textarea>
                  </div>
                  {errors.address && <p className="text-[10px] text-red-500 font-medium">{errors.address}</p>}
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl space-y-1 text-center font-sans select-none">
                  <span className="text-yellow-500 font-bold text-xs block uppercase">Zero-Contact Self Pickup</span>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Collect your fresh hot orders at the checkout desk in our standard <strong className="text-white">Pizza Master {selectedCity}</strong> branch location. Expected prep time: 10 minutes.
                  </p>
                </div>
              )}

              {/* Cooking Instructions / Notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Cooking / Driver Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  placeholder="e.g. Make it extra spicy / Leave on gate / Ring Bell"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-red-500 rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-neutral-600 outline-none resize-none"
                ></textarea>
              </div>

              {/* Payment Method toggler */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold block">
                  Payment Preference
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'cod' }))}
                    className={`py-3.5 px-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'bg-neutral-900 border-red-500 text-white shadow-lg'
                        : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <Truck className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-extrabold text-xs block">Cash on Delivery</span>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Pay with paper notes directly to the rider.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: 'card' }))}
                    className={`py-3.5 px-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'bg-neutral-900 border-red-500 text-white shadow-lg'
                        : 'bg-neutral-900/40 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                    <div>
                      <span className="font-extrabold text-xs block">Credit / Debit Card</span>
                      <p className="text-[10px] text-neutral-500 mt-0.5">Sweep or slip plastic card on delivery rider terminal.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Action Submit */}
              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-sans text-xs sm:text-sm font-black h-12 rounded-full shadow-lg shadow-red-700/25 active:scale-95 transition-all mt-4 border border-red-500"
                id="place-order-submit-btn"
              >
                Place Pizza Master Order (PKR {total.toLocaleString('en-PK')})
              </button>
            </form>
          </div>

          {/* Right: Sum totals panel */}
          <div className="w-full md:w-2/5 bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-2 pb-3 border-b border-neutral-800">
                <ShoppingBag className="w-5 h-5 text-yellow-500" />
                <span>Summary Basket</span>
              </h3>

              {/* Items tiny row list */}
              <div className="space-y-3.5 max-h-[30vh] overflow-y-auto scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-xs leading-normal">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-lg object-cover bg-neutral-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-1">
                        <span className="font-extrabold text-white truncate max-w-[120px] block uppercase text-[11px]">
                          {item.menuItem.name}
                        </span>
                        <span className="font-mono text-neutral-400 text-[11px] shrink-0">
                          x{item.quantity}
                        </span>
                      </div>
                      {item.customization && (
                        <p className="text-[9px] text-neutral-500 truncate max-w-[150px]">
                          {item.customization.size.name} ● {item.customization.crust.name}
                        </p>
                      )}
                    </div>
                    <span className="font-mono text-white text-[11px] tracking-tight shrink-0">
                      PKR {(item.unitPrice * item.quantity).toLocaleString('en-PK')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sum receipt stack */}
            <div className="border-t border-neutral-800 pt-5 mt-6 space-y-2.5 text-xs text-neutral-400">
              <div className="flex justify-between">
                <span>Subtotal Items</span>
                <span className="font-mono text-white">PKR {subtotal.toLocaleString('en-PK')}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-red-400 font-semibold">
                  <span>Special Promo Offer</span>
                  <span className="font-mono">-PKR {discount.toLocaleString('en-PK')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GST Tax (13%)</span>
                <span className="font-mono text-white">PKR {tax.toLocaleString('en-PK')}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-3">
                <span>{deliveryType === 'delivery' ? 'Delivery Ride Fee' : 'Store Pickup'}</span>
                <span className="font-mono text-white">
                  {deliveryType === 'delivery' ? `PKR ${deliveryFee}` : 'Free'}
                </span>
              </div>

              {/* Final row */}
              <div className="flex justify-between items-center pt-2 select-none">
                <span className="text-sm font-black text-white">Total Bill</span>
                <span className="text-xl font-black text-yellow-500 font-mono">
                  PKR {total.toLocaleString('en-PK')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
