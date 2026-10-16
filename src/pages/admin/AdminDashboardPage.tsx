import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useOrders } from '../../context/OrderContext';
import { useLanguage } from '../../context/LanguageContext';
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { ProductModal } from './ProductModal';
import { Product } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { addProduct, updateProduct, categories, products } = useProducts();
  const { orders } = useOrders();
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleOpenAddModal = () => {
    setProductToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (productData: any) => {
    if (productToEdit) {
      updateProduct(productToEdit.id, productData);
    } else {
      addProduct(productData);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC] text-slate-900 font-sans">
      
      {/* Mobile Admin Top Navigation Header (< 1024px) */}
      <div className="lg:hidden bg-[#0F172A] text-white p-3.5 flex items-center justify-between border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-1.5 rounded hover:bg-slate-800 text-gray-300"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
          <span className="font-black text-lg">TechNova</span>
          <span className="text-[10px] uppercase font-bold text-blue-400 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
            Admin
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="px-2 py-1 rounded bg-slate-800 text-xs font-bold text-amber-400 font-mono"
          >
            {language === 'en' ? 'AR' : 'EN'}
          </button>
          <Link
            to="/"
            className="p-1 text-gray-300 hover:text-white"
            title={t('adminLiveStorefront')}
          >
            <span className="material-symbols-outlined text-xl">storefront</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar (Desktop static, Mobile slide-over) */}
      <aside className={`
        fixed lg:static top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} z-50 lg:z-auto
        w-64 bg-[#0F172A] text-white flex flex-col shrink-0 min-h-screen border-r border-slate-800
        transition-transform duration-200 ease-in-out
        ${isMobileSidebarOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-baseline gap-1 group">
            <span className="text-xl font-black tracking-tight text-white">TechNova</span>
            <span className="w-2 h-2 rounded-full bg-[#FF9900] inline-block mb-0.5"></span>
            <span className="text-[10px] uppercase font-bold text-blue-400 ml-1.5 px-1.5 py-0.5 rounded bg-blue-950 border border-blue-800">
              Admin
            </span>
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Admin User Info */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-white truncate">{currentUser?.name}</p>
              <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="p-3 space-y-1 text-xs font-semibold flex-1">
          <button
            onClick={() => {
              setActiveTab('overview');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>{t('adminExecutiveOverview')}</span>
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition cursor-pointer ${
              activeTab === 'products'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              <span>{t('adminProductsCrud')}</span>
            </div>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded transition cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-blue-600 text-white font-bold shadow-xs'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              <span>{t('adminOrdersManagement')}</span>
            </div>
            <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </button>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <Link
              to="/"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded text-slate-300 hover:bg-slate-800/80 hover:text-white transition"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>{t('adminLiveStorefront')}</span>
            </Link>
          </div>
        </nav>

        {/* Bottom Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded text-red-400 hover:bg-red-950/40 hover:text-red-300 text-xs font-semibold transition cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>{t('signOut')}</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Stage */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header (Desktop) */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 px-6 sm:px-8 items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>TechNova Enterprise Admin</span>
            <span className={`material-symbols-outlined text-sm ${isRTL ? 'rtl-flip' : ''}`}>chevron_right</span>
            <span className="text-gray-900 font-bold capitalize">
              {activeTab === 'overview'
                ? t('adminExecutiveOverview')
                : activeTab === 'products'
                ? t('adminProductsCrud')
                : t('adminOrdersManagement')}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-slate-800 font-bold text-xs border border-gray-300 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm text-amber-500">translate</span>
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            <Link
              to="/"
              className="btn-sharp px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold border border-gray-300 flex items-center gap-1.5 shadow-2xs"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              {t('adminLiveStorefront')}
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <span className="text-xs text-slate-500 font-medium">
              {t('adminControlConsole')}
            </span>
          </div>
        </header>

        {/* Tab Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenAddModal={handleOpenAddModal}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsTab
              onOpenAddModal={handleOpenAddModal}
              onOpenEditModal={handleOpenEditModal}
            />
          )}

          {activeTab === 'orders' && <AdminOrdersTab />}
        </main>
      </div>

      {/* Add / Edit Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
        categories={categories}
      />
    </div>
  );
};
