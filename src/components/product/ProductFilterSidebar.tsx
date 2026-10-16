import React, { useState } from 'react';
import { FilterState } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ProductFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  brandCounts: Record<string, number>;
  onResetAll: () => void;
  onCloseMobile?: () => void;
}

export const ProductFilterSidebar: React.FC<ProductFilterSidebarProps> = ({
  filters,
  onFilterChange,
  brandCounts,
  onResetAll,
  onCloseMobile,
}) => {
  const { t, isRTL } = useLanguage();

  const [minPriceInput, setMinPriceInput] = useState(
    filters.priceRange.min !== null ? String(filters.priceRange.min) : ''
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    filters.priceRange.max !== null ? String(filters.priceRange.max) : ''
  );

  const handleDeliveryToggle = (val: string) => {
    const exists = filters.deliveryDay.includes(val);
    const updated = exists
      ? filters.deliveryDay.filter((d) => d !== val)
      : [...filters.deliveryDay, val];
    onFilterChange({ ...filters, deliveryDay: updated });
  };

  const handleBrandToggle = (brand: string) => {
    const exists = filters.selectedBrands.includes(brand);
    const updated = exists
      ? filters.selectedBrands.filter((b) => b !== brand)
      : [...filters.selectedBrands, brand];
    onFilterChange({ ...filters, selectedBrands: updated });
  };

  const handleClearBrands = () => {
    onFilterChange({ ...filters, selectedBrands: [] });
  };

  const handlePriceRangeQuick = (min: number | null, max: number | null) => {
    setMinPriceInput(min !== null ? String(min) : '');
    setMaxPriceInput(max !== null ? String(max) : '');
    onFilterChange({
      ...filters,
      priceRange: { min, max },
    });
  };

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = minPriceInput ? parseFloat(minPriceInput) : null;
    const maxVal = maxPriceInput ? parseFloat(maxPriceInput) : null;
    onFilterChange({
      ...filters,
      priceRange: {
        min: !isNaN(Number(minVal)) ? minVal : null,
        max: !isNaN(Number(maxVal)) ? maxVal : null,
      },
    });
  };

  const handleRatingSelect = (rating: number | null) => {
    onFilterChange({
      ...filters,
      minRating: filters.minRating === rating ? null : rating,
    });
  };

  const handleRamToggle = (ram: string) => {
    const exists = filters.selectedRam.includes(ram);
    const updated = exists
      ? filters.selectedRam.filter((r) => r !== ram)
      : [...filters.selectedRam, ram];
    onFilterChange({ ...filters, selectedRam: updated });
  };

  const handleDepartmentClick = (dept: string) => {
    onFilterChange({
      ...filters,
      department: filters.department === dept ? 'all' : dept,
    });
  };

  const hasActiveFilters =
    filters.deliveryDay.length > 0 ||
    filters.selectedBrands.length > 0 ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null ||
    filters.minRating !== null ||
    filters.selectedRam.length > 0 ||
    filters.department !== 'all';

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4">
      {/* Mobile Drawer Top Bar with Close Button */}
      {onCloseMobile && (
        <div className="lg:hidden flex items-center justify-between pb-3 border-b border-gray-200">
          <span className="font-bold text-sm text-gray-900">{t('mobileFilters')}</span>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded text-gray-500 hover:text-gray-900 hover:bg-gray-100"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      )}

      {/* Active Filters Reset */}
      {hasActiveFilters && (
        <div className="bg-amber-50 border border-amber-200 rounded p-3 text-xs flex items-center justify-between">
          <span className="font-semibold text-amber-900">{t('activeFilters')}</span>
          <button
            onClick={onResetAll}
            className="text-amber-800 font-bold hover:underline text-[11px] cursor-pointer"
          >
            {t('resetAll')}
          </button>
        </div>
      )}

      {/* Delivery Filter */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('deliveryDay')}</h3>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-800 hover:text-[#FF9900] select-none">
          <input
            type="checkbox"
            checked={filters.deliveryDay.includes('Get It Tomorrow')}
            onChange={() => handleDeliveryToggle('Get It Tomorrow')}
            className="w-4 h-4 rounded text-[#FF9900] focus:ring-0 accent-[#FF9900] cursor-pointer"
          />
          <span className="font-medium flex items-center gap-1">
            {t('getItTomorrow')}
            <span className="material-symbols-outlined text-[15px] text-amber-500">bolt</span>
          </span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-800 hover:text-[#FF9900] select-none">
          <input
            type="checkbox"
            checked={filters.deliveryDay.includes('Get It in 2 Days')}
            onChange={() => handleDeliveryToggle('Get It in 2 Days')}
            className="w-4 h-4 rounded text-[#FF9900] focus:ring-0 accent-[#FF9900] cursor-pointer"
          />
          <span>{t('getItIn2Days')}</span>
        </label>
      </div>

      {/* Department Hierarchy */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('department')}</h3>
        <ul className="text-xs space-y-1.5 text-gray-700 font-medium">
          <li>
            <button
              onClick={() => handleDepartmentClick('all')}
              className={`font-bold text-left flex items-center gap-1 hover:text-[#FF9900] cursor-pointer w-full ${
                filters.department === 'all' ? 'text-gray-900' : 'text-gray-600'
              }`}
            >
              <span className={`material-symbols-outlined text-[14px] ${isRTL ? 'rtl-flip' : ''}`}>chevron_left</span>
              {t('computersAccessories')}
            </button>
          </li>
          <li className={isRTL ? 'pr-3.5' : 'pl-3.5'}>
            <button
              onClick={() => handleDepartmentClick('Laptops & Workstations')}
              className={`text-left w-full hover:text-[#FF9900] cursor-pointer ${
                filters.department === 'Laptops & Workstations' ? 'text-[#FF9900] font-bold' : ''
              }`}
            >
              {t('laptopsComputers')}
            </button>
          </li>
          <li className={isRTL ? 'pr-3.5' : 'pl-3.5'}>
            <button
              onClick={() => handleDepartmentClick('PC Gaming & Desktops')}
              className={`text-left w-full hover:text-[#FF9900] cursor-pointer ${
                filters.department === 'PC Gaming & Desktops' ? 'text-[#FF9900] font-bold' : ''
              }`}
            >
              PC Gaming & Desktops
            </button>
          </li>
          <li className={isRTL ? 'pr-3.5' : 'pl-3.5'}>
            <button
              onClick={() => handleDepartmentClick('Monitors & Displays')}
              className={`text-left w-full hover:text-[#FF9900] cursor-pointer ${
                filters.department === 'Monitors & Displays' ? 'text-[#FF9900] font-bold' : ''
              }`}
            >
              {t('monitorsDisplays')}
            </button>
          </li>
          <li className={isRTL ? 'pr-3.5' : 'pl-3.5'}>
            <button
              onClick={() => handleDepartmentClick('Computer Components')}
              className={`text-left w-full hover:text-[#FF9900] cursor-pointer ${
                filters.department === 'Computer Components' ? 'text-[#FF9900] font-bold' : ''
              }`}
            >
              {t('audioWearables')}
            </button>
          </li>
          <li className={isRTL ? 'pr-3.5' : 'pl-3.5'}>
            <button
              onClick={() => handleDepartmentClick('Smartphones & Tablets')}
              className={`text-left w-full hover:text-[#FF9900] cursor-pointer ${
                filters.department === 'Smartphones & Tablets' ? 'text-[#FF9900] font-bold' : ''
              }`}
            >
              Smartphones & Tablets
            </button>
          </li>
        </ul>
      </div>

      {/* Brands Checklist */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('brands')}</h3>
          {filters.selectedBrands.length > 0 && (
            <button
              onClick={handleClearBrands}
              className="text-[11px] text-[#FF9900] hover:underline font-semibold cursor-pointer"
            >
              {t('clear')}
            </button>
          )}
        </div>
        <div className="space-y-2 text-xs max-h-56 overflow-y-auto pr-1">
          {Object.entries(brandCounts).map(([brand, count]) => (
            <label
              key={brand}
              className="flex items-center justify-between cursor-pointer select-none group"
            >
              <span className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={filters.selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 rounded text-[#FF9900] focus:ring-0 accent-[#FF9900] cursor-pointer"
                />
                <span className={`group-hover:text-[#FF9900] ${
                  filters.selectedBrands.includes(brand) ? 'font-bold text-gray-900' : 'text-gray-800'
                }`}>
                  {brand}
                </span>
              </span>
              <span className="text-gray-400 text-[11px]">({count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Input Section */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('price')}</h3>
        <div className="space-y-1.5 text-xs text-gray-700">
          <button
            onClick={() => handlePriceRangeQuick(null, 500)}
            className={`block text-left w-full hover:text-[#FF9900] cursor-pointer ${
              filters.priceRange.min === null && filters.priceRange.max === 500 ? 'font-bold text-[#FF9900]' : ''
            }`}
          >
            {t('under500')}
          </button>
          <button
            onClick={() => handlePriceRangeQuick(500, 1000)}
            className={`block text-left w-full hover:text-[#FF9900] cursor-pointer ${
              filters.priceRange.min === 500 && filters.priceRange.max === 1000 ? 'font-bold text-[#FF9900]' : ''
            }`}
          >
            {t('price500to1000')}
          </button>
          <button
            onClick={() => handlePriceRangeQuick(1000, 2000)}
            className={`block text-left w-full hover:text-[#FF9900] cursor-pointer ${
              filters.priceRange.min === 1000 && filters.priceRange.max === 2000 ? 'font-bold text-[#FF9900]' : ''
            }`}
          >
            {t('price1000to2000')}
          </button>
          <button
            onClick={() => handlePriceRangeQuick(2000, null)}
            className={`block text-left w-full hover:text-[#FF9900] cursor-pointer ${
              filters.priceRange.min === 2000 && filters.priceRange.max === null ? 'font-bold text-[#FF9900]' : ''
            }`}
          >
            {t('price2000Above')}
          </button>
        </div>

        {/* Range Inputs with Go Button */}
        <form onSubmit={handleApplyCustomPrice} className="pt-2 border-t border-gray-100 flex items-center gap-2">
          <div className="relative flex-1">
            <span className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1.5 text-gray-400 text-xs`}>$</span>
            <input
              type="number"
              placeholder="Min"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              className={`w-full ${isRTL ? 'pr-5 pl-1' : 'pl-5 pr-1'} py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]`}
            />
          </div>
          <span className="text-gray-400 text-xs">to</span>
          <div className="relative flex-1">
            <span className={`absolute ${isRTL ? 'right-2' : 'left-2'} top-1.5 text-gray-400 text-xs`}>$</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              className={`w-full ${isRTL ? 'pr-5 pl-1' : 'pl-5 pr-1'} py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]`}
            />
          </div>
          <button
            type="submit"
            className="btn-sharp px-3 py-1 bg-gray-100 hover:bg-gray-200 border border-gray-300 text-xs font-bold text-gray-800 shadow-xs cursor-pointer"
          >
            {t('go')}
          </button>
        </form>
      </div>

      {/* Customer Reviews Stars Filter */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('customerReviews')}</h3>
        <div className="space-y-1 text-xs">
          <button
            onClick={() => handleRatingSelect(4.8)}
            className={`flex items-center gap-1.5 w-full text-left hover:text-[#FF9900] cursor-pointer ${
              filters.minRating === 4.8 ? 'font-bold text-amber-600' : ''
            }`}
          >
            <div className="flex text-amber-500 text-sm">★★★★★</div>
            <span className="text-gray-700 text-xs">{t('andUp')} (1,840)</span>
          </button>
          <button
            onClick={() => handleRatingSelect(4.5)}
            className={`flex items-center gap-1.5 w-full text-left hover:text-[#FF9900] cursor-pointer ${
              filters.minRating === 4.5 ? 'font-bold text-amber-600' : ''
            }`}
          >
            <div className="flex text-amber-500 text-sm">★★★★<span className="text-gray-300">★</span></div>
            <span className="text-gray-700 text-xs">{t('andUp')} (420)</span>
          </button>
          <button
            onClick={() => handleRatingSelect(4.0)}
            className={`flex items-center gap-1.5 w-full text-left hover:text-[#FF9900] cursor-pointer ${
              filters.minRating === 4.0 ? 'font-bold text-amber-600' : ''
            }`}
          >
            <div className="flex text-amber-500 text-sm">★★★<span className="text-gray-300">★★</span></div>
            <span className="text-gray-700 text-xs">{t('andUp')} (88)</span>
          </button>
        </div>
      </div>

      {/* Hardware Specs: RAM */}
      <div className="bg-white p-4 rounded border border-gray-200 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">{t('systemMemoryRam')}</h3>
        <div className="space-y-1.5 text-xs">
          {['32 GB & Above', '64 GB & Above', '16 GB'].map((ramOpt) => (
            <label key={ramOpt} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.selectedRam.includes(ramOpt)}
                onChange={() => handleRamToggle(ramOpt)}
                className="w-4 h-4 rounded text-[#FF9900] accent-[#FF9900] cursor-pointer"
              />
              <span className={`text-xs ${
                filters.selectedRam.includes(ramOpt) ? 'font-bold text-gray-900' : 'text-gray-700'
              }`}>
                {ramOpt === '32 GB & Above' ? t('ram32Above') : ramOpt === '64 GB & Above' ? t('ram64Above') : t('ram16')}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};
