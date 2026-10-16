import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductCard } from '../components/product/ProductCard';
import { ProductFilterSidebar } from '../components/product/ProductFilterSidebar';
import { FilterState } from '../types';

export const StorefrontPage: React.FC = () => {
  const { products, loading } = useProducts();
  const { t, isRTL } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 8;

  // Filter state
  const initialCategory = searchParams.get('category') || 'all';
  const initialDept = searchParams.get('dept') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialQuery,
    category: initialCategory,
    department: initialDept !== 'all' ? initialDept : (initialCategory !== 'all' ? initialCategory : 'all'),
    selectedBrands: [],
    deliveryDay: ['Get It Tomorrow'],
    priceRange: { min: null, max: null },
    minRating: null,
    selectedRam: ['32 GB & Above'],
    sortBy: 'featured',
  });

  // Sync when search params change in URL
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || 'all';
    const dept = searchParams.get('dept') || 'all';

    setFilters((prev) => ({
      ...prev,
      searchQuery: q,
      category: cat,
      department: dept !== 'all' ? dept : (cat !== 'all' ? cat : prev.department),
    }));
  }, [searchParams]);

  // Brand counts
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.brand] = (counts[p.brand] || 0) + 1;
    });
    return counts;
  }, [products]);

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search Query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      // Department / Category filter
      if (filters.department !== 'all') {
        if (p.category !== filters.department) {
          return false;
        }
      }

      // Selected Brands
      if (filters.selectedBrands.length > 0) {
        if (!filters.selectedBrands.includes(p.brand)) {
          return false;
        }
      }

      // Delivery Day
      if (filters.deliveryDay.length > 0) {
        if (!p.deliverySpeed || !filters.deliveryDay.includes(p.deliverySpeed)) {
          return false;
        }
      }

      // Price Range
      if (filters.priceRange.min !== null && p.price < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== null && p.price > filters.priceRange.max) {
        return false;
      }

      // Min Rating
      if (filters.minRating !== null && p.rating < filters.minRating) {
        return false;
      }

      // System Memory (RAM)
      if (filters.selectedRam.length > 0) {
        if (!p.ram || !filters.selectedRam.includes(p.ram)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'newest') return (b.isCustom ? 1 : 0) - (a.isCustom ? 1 : 0);
      return 0;
    });
  }, [products, filters]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleResetAllFilters = () => {
    setFilters({
      searchQuery: '',
      category: 'all',
      department: 'all',
      selectedBrands: [],
      deliveryDay: [],
      priceRange: { min: null, max: null },
      minRating: null,
      selectedRam: [],
      sortBy: 'featured',
    });
    setSearchParams({});
    setCurrentPage(1);
    setIsMobileFiltersOpen(false);
  };

  const handleCategoryNav = (cat: string) => {
    setFilters((prev) => ({
      ...prev,
      category: cat,
      department: cat,
    }));
    setCurrentPage(1);
  };

  const handleSearchNav = (query: string) => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: query,
    }));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header
        onCategorySelect={handleCategoryNav}
        onSearchChange={handleSearchNav}
      />

      {/* Sub-bar Breadcrumb and Result Stats */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 shadow-2xs">
        <div className="max-w-[1536px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          
          {/* Breadcrumb Hierarchy */}
          <div className="flex items-center gap-1.5 text-gray-500 flex-wrap">
            <button
              onClick={() => handleResetAllFilters()}
              className="hover:text-[#FF9900] cursor-pointer"
            >
              {t('electronics')}
            </button>
            <span className={`material-symbols-outlined text-[13px] text-gray-400 ${isRTL ? 'rtl-flip' : ''}`}>chevron_right</span>
            <button
              onClick={() => handleCategoryNav('Laptops & Workstations')}
              className="hover:text-[#FF9900] cursor-pointer"
            >
              {t('computersAccessories')}
            </button>
            <span className={`material-symbols-outlined text-[13px] text-gray-400 ${isRTL ? 'rtl-flip' : ''}`}>chevron_right</span>
            <span className="text-gray-900 font-semibold truncate max-w-xs">
              {filters.department !== 'all' ? filters.department : t('highPerformanceWorkstations')}
            </span>
            <span className="mx-2 text-gray-300 hidden sm:inline">|</span>
            <span className="text-gray-700">
              {t('showingResults')} <strong className="text-gray-900">{filteredProducts.length}</strong>
              {filters.searchQuery && (
                <> {t('resultsFor')} <strong className="text-gray-900">"{filters.searchQuery}"</strong></>
              )}
            </span>
          </div>

          {/* Sorting, Mobile Filter Trigger & View Toggles */}
          <div className="flex items-center justify-between md:justify-end gap-3 self-stretch md:self-auto">
            {/* Mobile Filter Button (visible only on small & medium screens) */}
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-gray-600">tune</span>
              <span>{t('mobileFilters')}</span>
              {(filters.selectedBrands.length > 0 || filters.deliveryDay.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-[#FF9900]"></span>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <label htmlFor="catalog-sort" className="text-gray-600 font-medium hidden sm:inline">{t('sortBy')}</label>
                <div className="relative">
                  <select
                    id="catalog-sort"
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                    className={`appearance-none bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold py-1.5 ${isRTL ? 'pr-2.5 pl-7' : 'pl-2.5 pr-7'} rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] cursor-pointer`}
                  >
                    <option value="featured">{t('featured')}</option>
                    <option value="price-asc">{t('priceLowToHigh')}</option>
                    <option value="price-desc">{t('priceHighToLow')}</option>
                    <option value="rating">{t('avgCustomerReview')}</option>
                    <option value="newest">{t('newestArrivals')}</option>
                  </select>
                  <span className={`material-symbols-outlined text-[16px] text-gray-500 absolute ${isRTL ? 'left-1.5' : 'right-1.5'} top-1/2 -translate-y-1/2 pointer-events-none`}>
                    expand_more
                  </span>
                </div>
              </div>

              <div className="flex items-center border border-gray-200 rounded p-0.5 bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded cursor-pointer transition ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title={t('gridView')}
                >
                  <span className="material-symbols-outlined text-[16px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded cursor-pointer transition ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title={t('listView')}
                >
                  <span className="material-symbols-outlined text-[16px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Storefront Body: Desktop 2-Column or Mobile Layout */}
      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-5 flex flex-col lg:flex-row gap-5 flex-1 w-full">
        
        {/* Desktop Left Sidebar Filters (Hidden on mobile/tablet) */}
        <div className="hidden lg:block">
          <ProductFilterSidebar
            filters={filters}
            onFilterChange={(newF) => {
              setFilters(newF);
              setCurrentPage(1);
            }}
            brandCounts={brandCounts}
            onResetAll={handleResetAllFilters}
          />
        </div>

        {/* Mobile Slide-Over Filter Drawer */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileFiltersOpen(false)}
            />
            <div className={`relative ${isRTL ? 'mr-auto' : 'ml-auto'} w-80 max-w-[90vw] bg-white h-full shadow-2xl p-5 overflow-y-auto z-10`}>
              <ProductFilterSidebar
                filters={filters}
                onFilterChange={(newF) => {
                  setFilters(newF);
                  setCurrentPage(1);
                }}
                brandCounts={brandCounts}
                onResetAll={handleResetAllFilters}
                onCloseMobile={() => setIsMobileFiltersOpen(false)}
              />
              <div className="pt-4 mt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="w-full py-2.5 bg-[#FF9900] text-gray-950 font-bold rounded text-xs shadow-xs"
                >
                  {t('showingResults')} {filteredProducts.length}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Main Content Grid */}
        <section className="flex-1 flex flex-col min-w-0">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 animate-pulse">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded p-4 h-96">
                  <div className="w-full h-44 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 w-2/3 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 w-1/3 rounded mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4 items-stretch'
                  : 'space-y-4'
              }
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center my-auto space-y-4 shadow-xs">
              <span className="material-symbols-outlined text-gray-300 text-6xl">devices_off</span>
              <h3 className="text-base font-bold text-gray-900">{t('noMatchingProducts')}</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {t('noMatchingDesc')}
              </p>
              <button
                onClick={handleResetAllFilters}
                className="px-5 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                {t('resetAllFilters')}
              </button>
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="mt-8 mb-8 flex items-center justify-center gap-1.5 sm:gap-2 text-xs">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-medium shadow-2xs cursor-pointer"
              >
                {t('previous')}
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => setCurrentPage(pg)}
                  className={`w-8 h-8 rounded border text-xs cursor-pointer transition ${
                    currentPage === pg
                      ? 'border-gray-500 bg-white font-bold text-gray-900 shadow-xs'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {pg}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 font-medium shadow-2xs cursor-pointer"
              >
                {t('next')}
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
