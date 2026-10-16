import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { OrderProvider } from './context/OrderContext';

import { StorefrontPage } from './pages/StorefrontPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { DealsPage } from './pages/DealsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <WishlistProvider>
                <OrderProvider>
                  <Routes>
                    {/* Public Storefront Routes */}
                    <Route path="/" element={<StorefrontPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/deals" element={<DealsPage />} />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Customer Protected Routes */}
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <CheckoutPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />

                    {/* Admin Exclusive Protected Route (Role !== 'admin' strictly blocked) */}
                    <Route
                      path="/admin/*"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />

                    {/* Fallback to Storefront */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </OrderProvider>
              </WishlistProvider>
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}
