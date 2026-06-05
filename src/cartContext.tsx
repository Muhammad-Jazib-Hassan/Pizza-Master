import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, MenuItem, CustomizationState, CustomerDetails, Order, OrderStatus } from './types';

interface CartContextType {
  cart: CartItem[];
  deliveryType: 'delivery' | 'pickup';
  setDeliveryType: (type: 'delivery' | 'pickup') => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  addToCart: (item: MenuItem, customization: CustomizationState | undefined, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, change: number) => void;
  clearCart: () => void;
  promoCode: string;
  applyPromoCode: (code: string) => { success: boolean; message: string };
  removePromoCode: () => void;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  activeOrder: Order | null;
  placeOrder: (customer: CustomerDetails) => Order;
  resetActiveOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [selectedCity, setSelectedCity] = useState<string>('Karachi');
  const [selectedArea, setSelectedArea] = useState<string>('DHA Phase 1-8');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  // Load cart from localStorage on init
  useEffect(() => {
    const savedCart = localStorage.getItem('pizzamaster_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse saved cart', e);
      }
    }
  }, []);

  // Sync cart to localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    localStorage.setItem('pizzamaster_cart', JSON.stringify(newCart));
  };

  const addToCart = (item: MenuItem, customization: CustomizationState | undefined, quantity: number) => {
    // Generate a unique key based on item ID + customization details (size, crust, flavor, toppings)
    let customizationHash = '';
    let unitPrice = item.price;

    if (item.isPizza && customization) {
      const sizeId = customization.size.id;
      const crustId = customization.crust.id;
      const flavorId = customization.flavor.id;
      const toppingIds = customization.toppings.map(t => t.id).sort().join(',');
      
      customizationHash = `-${sizeId}-${crustId}-${flavorId}-${toppingIds}`;
      
      // Calculate real unit price
      // Small/Medium/Large have different base prices
      let pizzaBase = customization.size.priceBase;
      
      // Deal check - Deals have a fixed price but pizza sizes might still be customizable
      if (item.category === 'deals') {
        // If it's a deal, the pizza customization is typically included, but lets add any upsells
        pizzaBase = item.price;
      }
      
      const crustUpsell = customization.crust.priceUpsell;
      const toppingsCost = customization.toppings.reduce((total, t) => total + t.price, 0);
      
      unitPrice = pizzaBase + crustUpsell + toppingsCost;
    }

    const cartItemId = `${item.id}${customizationHash}`;

    setCart(prev => {
      const existingIdx = prev.findIndex(item => item.id === cartItemId);
      let updated: CartItem[];

      if (existingIdx > -1) {
        updated = prev.map((item, idx) => 
          idx === existingIdx 
            ? { ...item, quantity: item.quantity + quantity, totalPrice: (item.quantity + quantity) * item.unitPrice }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          menuItem: item,
          customization,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        };
        updated = [...prev, newItem];
      }
      
      saveCartToStorage(updated);
      return updated;
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => {
      const updated = prev.filter(item => item.id !== cartItemId);
      saveCartToStorage(updated);
      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, change: number) => {
    setCart(prev => {
      const updated = prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = Math.max(1, item.quantity + change);
          return {
            ...item,
            quantity: newQty,
            totalPrice: newQty * item.unitPrice,
          };
        }
        return item;
      });
      saveCartToStorage(updated);
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('pizzamaster_cart');
    setPromoCode('');
    setDiscountPercent(0);
  };

  const applyPromoCode = (code: string) => {
    const uppercaseCode = code.toUpperCase().trim();
    if (uppercaseCode === 'MASTER50') {
      setPromoCode('MASTER50');
      setDiscountPercent(15); // 15% discount
      return { success: true, message: 'MASTER50 Promo Applied! Enjoy 15% Off Your Pizza.' };
    } else if (uppercaseCode === 'FREEBEAST') {
      setPromoCode('FREEBEAST');
      setDiscountPercent(25); // 25% discount for massive deal
      return { success: true, message: 'FREEBEAST Premium Applied! 25% Super Discount Activated.' };
    } else if (uppercaseCode === 'LAUNCH2026') {
      setPromoCode('LAUNCH2026');
      setDiscountPercent(20); // 20% discount
      return { success: true, message: 'LAUNCH2026 Promo Applied! 20% Discount off your complete order.' };
    }
    return { success: false, message: 'Invalid coupon code. Try MASTER50 or LAUNCH2026!' };
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = deliveryType === 'delivery' ? 150 : 0; // 150 PKR flat fee
  const taxPercent = 0.13; // 13% GST in Pakistan
  const tax = Math.round(subtotal * taxPercent);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = Math.max(0, subtotal + deliveryFee + tax - discount);

  // Place Order Action
  const placeOrder = (customer: CustomerDetails): Order => {
    const newOrder: Order = {
      id: `BDW-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      customer,
      deliveryType,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      status: 'placed',
      createdAt: new Date().toISOString(),
    };

    setActiveOrder(newOrder);
    // Clear cart database on place order
    clearCart();
    return newOrder;
  };

  // Status simulation hooks
  useEffect(() => {
    if (!activeOrder) return;

    // Simulate cooking, dispatch, delivery
    const steps: OrderStatus[] = ['cooking', 'out_for_delivery', 'delivered'];
    let currentStep = 0;

    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setActiveOrder(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: steps[currentStep],
          };
        });
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 20000); // Progress order every 20 seconds for real feel but fast enough to test!

    return () => clearInterval(interval);
  }, [activeOrder?.id]);

  const resetActiveOrder = () => {
    setActiveOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        deliveryType,
        setDeliveryType,
        selectedCity,
        setSelectedCity,
        selectedArea,
        setSelectedArea,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        promoCode,
        applyPromoCode,
        removePromoCode,
        subtotal,
        deliveryFee,
        tax,
        discount,
        total,
        activeOrder,
        placeOrder,
        resetActiveOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
