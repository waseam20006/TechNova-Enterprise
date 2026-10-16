import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  totalItemsCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const CART_STORAGE_KEY = 'technova_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => String(item.product.id) === String(product.id));
      if (existingIndex > -1) {
        const copy = [...prev];
        const newQty = copy[existingIndex].quantity + quantity;
        copy[existingIndex] = {
          ...copy[existingIndex],
          quantity: Math.min(newQty, product.stock || 99),
        };
        return copy;
      }
      return [...prev, { product, quantity: Math.min(quantity, product.stock || 99) }];
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (String(item.product.id) === String(productId)) {
          const maxStock = item.product.stock || 99;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  // Free delivery for orders over $100
  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 25;
  // Standard corporate estimated tax rate 8.5%
  const tax = Math.round(subtotal * 0.085 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        shipping,
        total,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
