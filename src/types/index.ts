export interface Product {
  id: string | number;
  title: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  ratingCount: number;
  boughtCountText?: string;
  badge?: string;
  badgeColor?: 'amber' | 'red' | 'blue' | 'purple' | 'emerald' | 'gray';
  stock: number;
  ram?: string;
  deliverySpeed?: string;
  deliveryDateText?: string;
  description: string;
  image: string;
  images?: string[];
  specs?: Record<string, string>;
  isCustom?: boolean;
}

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string | number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  brand: string;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered';

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  customerName: string;
  customerEmail: string;
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  paymentMethod: string;
  status: OrderStatus;
  trackingNumber: string;
}

export interface FilterState {
  searchQuery: string;
  category: string;
  department: string;
  selectedBrands: string[];
  deliveryDay: string[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  minRating: number | null;
  selectedRam: string[];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}
