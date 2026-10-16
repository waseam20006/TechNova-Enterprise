import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';
import { DeliverToModal } from './DeliverToModal';

interface HeaderProps {
  onCategorySelect?: (category: string) => void;
  onSearchChange?: (query: string) => void;
  onToggleMobileFilters?: () => void;
  hasFiltersButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onCategorySelect,
  onSearchChange,
  onToggleMobileFilters,
  hasFiltersButton = false,
}) => {
  const { currentUser, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { totalWishlistCount } = useWishlist();
  const { compareList, openCompareModal } = useCompare();
  const { language, toggleLanguage, isRTL, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedDept, setSelectedDept] = useState('All Departments');
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState('New York 10001');
  const [currentZip, setCurrentZip] = useState('10001');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchQuery);
    }
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('q', searchQuery.trim());
    if (selectedDept !== 'All Departments') params.set('dept', selectedDept);
    navigate(`/?${params.toString()}`);
    setIsMobileDrawerOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (onSearchChange) onSearchChange('');
    navigate('/');
  };

  const handleDeptSelect = (dept: string) => {
    setSelectedDept(dept);
    if (onCategorySelect) {
      onCategorySelect(dept === 'All Departments' ? 'all' : dept);
    }
  };

  const handleNavCategoryClick = (categoryName: string) => {
    if (onCategorySelect) {
      onCategorySelect(categoryName);
    }
    navigate(`/?category=${encodeURIComponent(categoryName)}`);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* Top Header: Deep Navy Blue (#0F172A) */}
      <header className="bg-[#0F172A] text-white w-full sticky top-0 z-40 shadow-md">
        <div className="max-w-[1536px] mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="lg:hidden p-1.5 text-gray-300 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
            aria-label="Open navigation drawer"
          >
            <span className="material-symbols-outlined text-2xl">menu</span>
          </button>

          {/* Brand Logo & Deliver To */}
          <div className="flex items-center gap-3 sm:gap-5 shrink-0">
            <Link to="/" className="flex items-baseline gap-1 group py-1">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-slate-100 transition">
                TechNova
              </span>
              <span className="w-2 h-2 rounded-full bg-[#FF9900] inline-block mb-1 group-hover:scale-125 transition-transform"></span>
            </Link>

            {/* Deliver To Selector (Hidden on small mobile, visible on tablet+) */}
            <button
              onClick={() => setIsDeliverModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded hover:ring-1 hover:ring-slate-400 text-left transition text-xs cursor-pointer"
              title="Change Delivery Zip"
            >
              <span className="material-symbols-outlined text-[18px] text-gray-300">location_on</span>
              <div className="leading-tight">
                <span className="text-gray-400 block text-[11px]">{t('deliverTo')}</span>
                <span className="font-bold text-white text-xs">{deliveryLocation}</span>
              </div>
            </button>
          </div>

          {/* Center Search Bar (Responsive, scales on mobile) */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl mx-1 sm:mx-2 hidden sm:flex items-center h-10 rounded-[4px] overflow-hidden bg-white shadow-inner focus-within:ring-2 focus-within:ring-[#FF9900]"
          >
            {/* Department Dropdown (hidden on very small viewports) */}
            <div className="hidden md:flex relative bg-gray-100 hover:bg-gray-200 border-r border-gray-300 h-full items-center px-2.5 shrink-0">
              <select
                value={selectedDept}
                onChange={(e) => handleDeptSelect(e.target.value)}
                aria-label="Filter products by department"
                className="bg-transparent text-xs font-semibold text-gray-800 pr-4 py-1 appearance-none focus:outline-none cursor-pointer"
              >
                <option value="All Departments">{t('allDepartments')}</option>
                <option value="Laptops & Workstations">{t('laptopsComputers')}</option>
                <option value="Monitors & Displays">{t('monitorsDisplays')}</option>
                <option value="Smartphones & Tablets">Smartphones & Tablets</option>
                <option value="Computer Components">{t('audioWearables')}</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-gray-600 pointer-events-none absolute right-1">
                arrow_drop_down
              </span>
            </div>

            {/* Input */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 h-full px-3 text-xs sm:text-sm text-gray-900 placeholder-gray-500 focus:outline-none"
            />

            {/* Clear icon */}
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-gray-400 hover:text-gray-600 px-2 cursor-pointer"
                title={t('clearSearch')}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              className="bg-[#FF9900] hover:bg-[#E68A00] transition-colors h-full px-4 sm:px-5 flex items-center justify-center text-gray-950 font-bold shrink-0 cursor-pointer"
              title={t('search')}
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          </form>

          {/* Right Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 text-xs">

            {/* Language Switcher: EN / AR */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold transition cursor-pointer text-xs"
              title={language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
            >
              <span className="material-symbols-outlined text-sm text-amber-400">translate</span>
              <span className="font-mono">{language === 'en' ? 'AR' : 'EN'}</span>
            </button>

            {/* Admin Direct Button (Prominent when Admin is logged in) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow-xs border border-blue-400"
              >
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>{t('adminDashboard')}</span>
              </Link>
            )}

            {/* Hello, Sign In / Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                onBlur={() => setTimeout(() => setIsAccountMenuOpen(false), 250)}
                className="flex flex-col text-left px-2 py-1 rounded hover:ring-1 hover:ring-gray-400 leading-tight cursor-pointer"
              >
                <span className="text-gray-300 text-[11px] truncate max-w-[80px] sm:max-w-[120px]">
                  {isAuthenticated ? `Hello, ${currentUser?.name.split(' ')[0]}` : t('helloSignIn')}
                </span>
                <span className="font-bold text-white text-xs flex items-center gap-0.5">
                  {isAuthenticated ? (isAdmin ? t('adminPortal') : t('myAccount')) : t('accountAndLists')}
                  <span className="material-symbols-outlined text-[14px] text-gray-400">arrow_drop_down</span>
                </span>
              </button>

              {/* Account Dropdown Menu */}
              {isAccountMenuOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} top-full mt-1 w-64 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150`}>
                  {isAuthenticated ? (
                    <div>
                      <div className="pb-3 border-b border-slate-100">
                        <p className="font-bold text-xs text-slate-900">{currentUser?.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                          isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {isAdmin ? t('corpAdmin') : t('corpCustomer')}
                        </span>
                      </div>

                      <div className="py-2 space-y-1">
                        {isAdmin && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 text-xs font-semibold text-blue-700"
                          >
                            <span className="material-symbols-outlined text-[16px]">dashboard</span>
                            {t('adminDashboard')}
                          </Link>
                        )}
                        <Link
                          to="/orders"
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700"
                        >
                          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                          {t('returnsAndOrders')}
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 text-xs text-slate-700"
                        >
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px]">favorite</span>
                            {t('wishlist')}
                          </div>
                          {totalWishlistCount > 0 && (
                            <span className="bg-slate-200 text-slate-800 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                              {totalWishlistCount}
                            </span>
                          )}
                        </Link>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            logout();
                            navigate('/');
                          }}
                          className="w-full text-left flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-red-50 text-red-600 text-xs font-medium cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">logout</span>
                          {t('signOut')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-2 space-y-3">
                      <Link
                        to="/login"
                        className="block w-full py-2 bg-[#FF9900] hover:bg-[#E68A00] text-slate-950 font-bold rounded shadow-xs text-xs text-center"
                      >
                        {t('signInCta')}
                      </Link>
                      <p className="text-[11px] text-slate-500">
                        {t('newCustomer')}{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-semibold">
                          {t('startHere')}
                        </Link>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Returns & Orders (Hidden on mobile) */}
            <Link
              to="/orders"
              className="hidden sm:flex flex-col text-left px-2 py-1 rounded hover:ring-1 hover:ring-gray-400 leading-tight"
            >
              <span className="text-gray-300 text-[11px]">{t('returnsAndOrders').split(' ')[0]}</span>
              <span className="font-bold text-white text-xs">& Orders</span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="hidden md:flex items-center gap-1 px-2 py-1 rounded hover:ring-1 hover:ring-gray-400 text-white"
              title={t('wishlist')}
            >
              <div className="relative">
                <span className="material-symbols-outlined text-[24px]">favorite</span>
                {totalWishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalWishlistCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Product Comparison Header Button */}
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={openCompareModal}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold transition cursor-pointer text-xs"
                title={t('compareProducts')}
              >
                <span className="material-symbols-outlined text-[20px] text-amber-400">compare_arrows</span>
                <span className="hidden xl:inline">{t('compare')}</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {compareList.length}/3
                </span>
              </button>
            )}

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-1 sm:gap-2 px-2 py-1 rounded hover:ring-1 hover:ring-gray-400 group"
            >
              <div className="relative flex items-center">
                <span className="material-symbols-outlined text-[26px] sm:text-[30px] text-white">shopping_cart</span>
                <span className="absolute -top-1 right-0 bg-[#FF9900] text-gray-950 text-[10px] sm:text-[11px] font-black w-4 sm:w-4.5 h-4 sm:h-4.5 rounded-full flex items-center justify-center ring-2 ring-[#0F172A]">
                  {totalItemsCount}
                </span>
              </div>
              <span className="font-bold text-xs sm:text-sm text-white pt-1.5 hidden md:inline">{t('cart')}</span>
            </Link>

          </div>
        </div>

        {/* Mobile Search Row (Shown only on small mobile < 640px) */}
        <div className="sm:hidden px-3 pb-2.5 pt-1">
          <form onSubmit={handleSearchSubmit} className="flex items-center h-9 rounded bg-white overflow-hidden shadow-inner">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 px-3 text-xs text-gray-900 focus:outline-none"
            />
            {searchQuery && (
              <button type="button" onClick={handleClearSearch} className="px-2 text-gray-400">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
            <button type="submit" className="bg-[#FF9900] px-3.5 h-full flex items-center justify-center text-gray-950 font-bold">
              <span className="material-symbols-outlined text-base">search</span>
            </button>
          </form>
        </div>
      </header>

      {/* Secondary Nav Bar: Desktop Scrollable (#1E293B) */}
      <nav className="bg-[#1E293B] text-gray-200 text-xs border-b border-slate-700 hidden lg:block">
        <div className="max-w-[1536px] mx-auto px-4 h-9 flex items-center justify-between overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-5 whitespace-nowrap">
            <button
              onClick={() => handleNavCategoryClick('all')}
              className="flex items-center gap-1 font-bold text-white hover:text-[#FF9900] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">menu</span>
              {t('navAll')}
            </button>
            <Link
              to="/deals"
              className="hover:text-white font-medium text-[#FF9900] transition"
            >
              {t('todaysDeals')}
            </Link>
            <button
              onClick={() => handleNavCategoryClick('Laptops & Workstations')}
              className="hover:text-white font-medium text-gray-300 transition cursor-pointer"
            >
              {t('laptopsComputers')}
            </button>
            <button
              onClick={() => handleNavCategoryClick('Monitors & Displays')}
              className="hover:text-white font-medium text-gray-300 transition cursor-pointer"
            >
              {t('monitorsDisplays')}
            </button>
            <button
              onClick={() => handleNavCategoryClick('Computer Components')}
              className="hover:text-white font-medium text-gray-300 transition cursor-pointer"
            >
              {t('audioWearables')}
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => handleNavCategoryClick('all')}
              className="hover:text-white font-medium text-blue-300 font-semibold cursor-pointer"
            >
              {t('enterpriseSolutions')}
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-2 text-gray-300 text-xs font-semibold pl-4">
            <span>{t('bulkProcurement')}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer (Slide-over navigation on tablet & mobile) */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Menu */}
          <div className={`relative ${isRTL ? 'mr-auto' : 'ml-auto'} w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto text-slate-900`}>
            {/* Drawer Header */}
            <div className="bg-[#0F172A] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black">TechNova</span>
                <span className="w-2 h-2 rounded-full bg-[#FF9900]"></span>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* Account Quick Status */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              {isAuthenticated ? (
                <div>
                  <p className="font-bold text-sm text-slate-900">{currentUser?.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{currentUser?.email}</p>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                      {t('adminDashboard')}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="block w-full py-2 bg-[#FF9900] text-gray-950 font-bold rounded text-xs text-center shadow-xs"
                  >
                    {t('signInCta')}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="block w-full py-2 bg-white border border-slate-300 text-slate-800 font-semibold rounded text-xs text-center"
                  >
                    {t('createAccountTitle')}
                  </Link>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <div className="p-4 space-y-1 text-xs divide-y divide-slate-100 flex-1">
              <div className="pb-3 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t('department')}
                </span>
                <button
                  onClick={() => handleNavCategoryClick('all')}
                  className="w-full text-left py-2 px-2 rounded hover:bg-slate-100 font-semibold text-slate-800"
                >
                  {t('navAll')}
                </button>
                <button
                  onClick={() => handleNavCategoryClick('Laptops & Workstations')}
                  className="w-full text-left py-2 px-2 rounded hover:bg-slate-100 font-semibold text-slate-800"
                >
                  {t('laptopsComputers')}
                </button>
                <button
                  onClick={() => handleNavCategoryClick('Monitors & Displays')}
                  className="w-full text-left py-2 px-2 rounded hover:bg-slate-100 font-semibold text-slate-800"
                >
                  {t('monitorsDisplays')}
                </button>
                <button
                  onClick={() => handleNavCategoryClick('Computer Components')}
                  className="w-full text-left py-2 px-2 rounded hover:bg-slate-100 font-semibold text-slate-800"
                >
                  {t('audioWearables')}
                </button>
                <button
                  onClick={() => handleNavCategoryClick('Smartphones & Tablets')}
                  className="w-full text-left py-2 px-2 rounded hover:bg-slate-100 font-semibold text-slate-800"
                >
                  Smartphones & Tablets
                </button>
                <Link
                  to="/deals"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="block py-2 px-2 rounded hover:bg-slate-100 font-bold text-[#FF9900]"
                >
                  {t('todaysDeals')}
                </Link>
              </div>

              <div className="pt-3 pb-3 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  {t('myAccount')}
                </span>
                <Link
                  to="/orders"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-2 py-2 px-2 rounded hover:bg-slate-100 text-slate-700"
                >
                  <span className="material-symbols-outlined text-base">receipt_long</span>
                  {t('returnsAndOrders')}
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-2 py-2 px-2 rounded hover:bg-slate-100 text-slate-700"
                >
                  <span className="material-symbols-outlined text-base">favorite</span>
                  {t('wishlist')} ({totalWishlistCount})
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center gap-2 py-2 px-2 rounded hover:bg-slate-100 text-slate-700"
                >
                  <span className="material-symbols-outlined text-base">shopping_cart</span>
                  {t('cart')} ({totalItemsCount})
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    openCompareModal();
                  }}
                  className="w-full text-left flex items-center justify-between py-2 px-2 rounded hover:bg-slate-100 text-slate-700 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-amber-500">compare_arrows</span>
                    <span>{t('compareProducts')}</span>
                  </div>
                  {compareList.length > 0 && (
                    <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {compareList.length}/3
                    </span>
                  )}
                </button>
              </div>

              {/* Language Switch in Drawer */}
              <div className="pt-3">
                <button
                  onClick={() => {
                    toggleLanguage();
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full py-2.5 px-3 rounded bg-slate-100 hover:bg-slate-200 font-bold text-xs flex items-center justify-between text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">translate</span>
                    <span>{language === 'en' ? 'اللغة العربية (العربية)' : 'English (EN)'}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">{language.toUpperCase()}</span>
                </button>
              </div>
            </div>

            {/* Logout button at bottom if logged in */}
            {isAuthenticated && (
              <div className="p-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    logout();
                    setIsMobileDrawerOpen(false);
                    navigate('/');
                  }}
                  className="w-full py-2 rounded text-red-600 font-semibold text-xs hover:bg-red-50 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">logout</span>
                  {t('signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deliver To Modal */}
      <DeliverToModal
        isOpen={isDeliverModalOpen}
        onClose={() => setIsDeliverModalOpen(false)}
        currentZip={currentZip}
        onSaveZip={(zip, locationName) => {
          setCurrentZip(zip);
          setDeliveryLocation(locationName);
        }}
      />
    </>
  );
};
