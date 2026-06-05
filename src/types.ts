export type FoodCategory =
  | 'deals'
  | 'pizzas'
  | 'starters'
  | 'pasta'
  | 'desserts'
  | 'beverages'
  | 'dips';

export interface PizzaSizeOption {
  id: string;
  name: string;
  slices: number;
  priceBase: number;
  description: string;
}

export interface CrustOption {
  id: string;
  name: string;
  priceUpsell: number;
}

export interface FlavorOption {
  id: string;
  name: string;
  description: string;
  heatLevel: 0 | 1 | 2 | 3;
}

export interface ToppingOption {
  id: string;
  name: string;
  category: 'meat' | 'veg' | 'cheese';
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: FoodCategory;
  price: number; // Base price
  image: string;
  isPizza: boolean;
  isPopular?: boolean;
  // Pizza customizer variables if isPizza is true
  sizes?: PizzaSizeOption[];
  crusts?: CrustOption[];
  flavors?: FlavorOption[];
  toppings?: ToppingOption[];
  // For deals, listing what's included
  dealItems?: string[];
}

export interface CustomizationState {
  size: PizzaSizeOption;
  crust: CrustOption;
  flavor: FlavorOption;
  toppings: ToppingOption[];
}

export interface CartItem {
  id: string; // Unique ID for cart item (including customization hash)
  menuItem: MenuItem;
  customization?: CustomizationState;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 'placed' | 'cooking' | 'out_for_delivery' | 'delivered';

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  notes?: string;
  paymentMethod: 'cod' | 'card';
}

export interface Order {
  id: string;
  items: CartItem[];
  customer: CustomerDetails;
  deliveryType: 'delivery' | 'pickup';
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}
