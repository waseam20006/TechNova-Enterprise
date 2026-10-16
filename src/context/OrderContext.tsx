import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrderStatus } from '../types';

interface OrderContextType {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => boolean;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByCustomerEmail: (email: string) => Order[];
  totalRevenue: number;
  totalOrdersCount: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const ORDERS_STORAGE_KEY = 'technova_orders_v2';

const SEED_ORDERS: Order[] = [
  {
    id: 'ORD-8942-NY',
    date: '2025-05-12T14:32:00.000Z',
    customerName: 'Sarah Jenkins (Enterprise Lead)',
    customerEmail: 'sarah.jenkins@enterprise.com',
    items: [
      {
        productId: 'prod-macbook-pro-16',
        title: 'Apple MacBook Pro 16-inch M3 Max (Space Black)',
        price: 3499.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
        brand: 'Apple',
      },
      {
        productId: 'prod-apple-studio-display',
        title: 'Apple Studio Display 27-inch 5K Retina',
        price: 1599.00,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80',
        brand: 'Apple',
      }
    ],
    subtotal: 10196.00,
    shipping: 0,
    tax: 866.66,
    total: 11062.66,
    shippingAddress: {
      fullName: 'Sarah Jenkins',
      street: '742 Lexington Ave, Floor 14',
      city: 'New York',
      state: 'NY',
      zipCode: '10022',
      country: 'United States',
    },
    paymentMethod: 'Corporate Net-30 Invoicing',
    status: 'Delivered',
    trackingNumber: 'TN-FEDEX-9928174201',
  },
  {
    id: 'ORD-7731-SF',
    date: '2025-05-14T09:15:00.000Z',
    customerName: 'David Vance',
    customerEmail: 'david.vance@vancetech.io',
    items: [
      {
        productId: 'prod-asus-rog-g16',
        title: 'ASUS ROG Zephyrus G16 (2024) 16" OLED 240Hz',
        price: 2899.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
        brand: 'ASUS',
      },
      {
        productId: 'prod-samsung-odyssey-g9',
        title: 'Samsung Odyssey G9 49-inch Dual QHD Curved',
        price: 899.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        brand: 'Samsung',
      }
    ],
    subtotal: 3798.99,
    shipping: 0,
    tax: 322.91,
    total: 4121.90,
    shippingAddress: {
      fullName: 'David Vance',
      street: '500 Howard Street, Suite 400',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States',
    },
    paymentMethod: 'Corporate Visa ending in 4092',
    status: 'Shipped',
    trackingNumber: 'TN-UPS-188294101',
  },
  {
    id: 'ORD-6512-TX',
    date: '2025-05-15T18:45:00.000Z',
    customerName: 'Elena Rostova',
    customerEmail: 'elena@novacore.ai',
    items: [
      {
        productId: 'prod-dell-xps-16',
        title: 'Dell XPS 16 9640 Laptop - 16.3" 4K+ Touch OLED',
        price: 2449.00,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1593642634361-8f3a38550d4f?auto=format&fit=crop&w=800&q=80',
        brand: 'Dell Technologies',
      }
    ],
    subtotal: 7347.00,
    shipping: 0,
    tax: 624.50,
    total: 7971.50,
    shippingAddress: {
      fullName: 'Elena Rostova',
      street: '301 Congress Ave, Suite 1200',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
      country: 'United States',
    },
    paymentMethod: 'Wire Transfer / ACH',
    status: 'Processing',
    trackingNumber: 'TN-DHL-55410928',
  }
];

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      //
    }
    return SEED_ORDERS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  const createOrder = (orderData: Omit<Order, 'id' | 'date' | 'trackingNumber'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingSuffix = Math.floor(10000000 + Math.random() * 90000000);

    const newOrder: Order = {
      ...orderData,
      id: `ORD-${randomSuffix}-TN`,
      date: new Date().toISOString(),
      trackingNumber: `TN-EXP-${trackingSuffix}`,
      status: 'Processing',
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus): boolean => {
    let matched = false;
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        matched = true;
        return { ...o, status: newStatus };
      }
      return o;
    });

    if (matched) {
      setOrders(updated);
    }
    return matched;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId);
  };

  const getOrdersByCustomerEmail = (email: string) => {
    const lower = email.toLowerCase();
    return orders.filter((o) => o.customerEmail.toLowerCase() === lower);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Pending' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        getOrdersByCustomerEmail,
        totalRevenue,
        totalOrdersCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
