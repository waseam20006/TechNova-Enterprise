import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { useLanguage } from '../../context/LanguageContext';

export const CompareModal: React.FC = () => {
  const { compareList, isCompareModalOpen, closeCompareModal, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { t, isRTL } = useLanguage();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addedId, setAddedId] = useState<string | number | null>(null);

  // Close modal on Escape key and prevent background scroll
  useEffect(() => {
    if (!isCompareModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCompareModal();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCompareModalOpen, closeCompareModal]);

  if (!isCompareModalOpen) return null;

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  // Extract all unique specification keys across all products in comparison
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap((p) => (p.specs ? Object.keys(p.specs) : []))
    )
  );

  // Common attribute rows:
  const commonRows = [
    {
      key: 'price',
      label: t('pricing'),
      render: (p: any) => {
        const orig = p.originalPrice || Math.round(p.price * 1.15);
        const savings = Math.max(0, orig - p.price);
        return (
          <div>
            <div className="text-base font-extrabold text-gray-900">
              ${p.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            {savings > 0 && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-gray-400 line-through">
                  ${orig.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded">
                  {t('save')} ${savings.toFixed(0)}
                </span>
              </div>
            )}
          </div>
        );
      },
      getValue: (p: any) => p.price,
    },
    {
      key: 'brand',
      label: t('brand'),
      render: (p: any) => <span className="font-bold text-gray-800">{p.brand}</span>,
      getValue: (p: any) => p.brand,
    },
    {
      key: 'category',
      label: t('category'),
      render: (p: any) => <span className="text-gray-700">{p.category}</span>,
      getValue: (p: any) => p.category,
    },
    {
      key: 'rating',
      label: t('rating'),
      render: (p: any) => (
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 text-xs">★★★★★</span>
          <span className="text-gray-800 font-bold text-xs">{p.rating || 4.8}</span>
          <span className="text-gray-500 text-xs">({p.ratingCount || 120})</span>
        </div>
      ),
      getValue: (p: any) => p.rating,
    },
    {
      key: 'stock',
      label: t('stockStatus'),
      render: (p: any) => (
        <span className={`inline-flex items-center gap-1 font-bold text-xs ${p.stock < 5 ? 'text-red-600' : 'text-emerald-700'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${p.stock < 5 ? 'bg-red-600' : 'bg-emerald-600'}`}></span>
          {p.stock < 5 ? t('onlyLeft', { count: p.stock }) : t('inStock')}
        </span>
      ),
      getValue: (p: any) => (p.stock < 5 ? 'low' : 'in-stock'),
    },
    {
      key: 'delivery',
      label: t('deliveryDay'),
      render: (p: any) => (
        <span className="text-gray-700 font-medium text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-amber-500">bolt</span>
          {p.deliverySpeed || t('getItTomorrow')}
        </span>
      ),
      getValue: (p: any) => p.deliverySpeed || 'Get It Tomorrow',
    },
    {
      key: 'ram',
      label: t('systemMemoryRam'),
      render: (p: any) => <span className="font-semibold text-gray-800">{p.ram || 'N/A'}</span>,
      getValue: (p: any) => p.ram || 'N/A',
    },
  ];

  const emptySlotsCount = Math.max(0, 3 - compareList.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCompareModal();
      }}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="compare-modal-title"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full border border-gray-200 overflow-hidden my-6 flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0F172A] text-white px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-amber-400 text-2xl">compare_arrows</span>
            <div>
              <h2 id="compare-modal-title" className="text-base sm:text-lg font-black tracking-tight">
                {t('compareProducts')}
              </h2>
              <p className="text-[11px] text-gray-300 hidden sm:block">{t('compareSubtitle')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareList.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs text-gray-400 hover:text-white transition underline cursor-pointer"
              >
                {t('clearCompare')}
              </button>
            )}
            <button
              type="button"
              onClick={closeCompareModal}
              className="text-gray-400 hover:text-white transition p-1 rounded cursor-pointer"
              title={t('close')}
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Count & Difference Toggle */}
        <div className="bg-slate-50 border-b border-gray-200 px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-700">
              {compareList.length} / 3 {t('items')}
            </span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-500 hidden sm:inline">{t('maxCompareWarning')}</span>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700">
            <input
              type="checkbox"
              checked={highlightDifferences}
              onChange={(e) => setHighlightDifferences(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF9900] accent-[#FF9900] cursor-pointer"
            />
            <span className="font-medium text-xs">{t('differencesOnly')}</span>
          </label>
        </div>

        {/* Comparison Matrix Body */}
        {compareList.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 my-auto">
            <span className="material-symbols-outlined text-gray-300 text-6xl">compare_arrows</span>
            <h3 className="text-base font-bold text-gray-900">{t('noProductsInCompare')}</h3>
            <p className="text-xs text-gray-500 max-w-md">{t('addProductsToCompareDesc')}</p>
            <button
              type="button"
              onClick={closeCompareModal}
              className="btn-sharp px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs cursor-pointer"
            >
              {t('startShopping')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto flex-1 p-4 sm:p-6 text-xs">
            <div className="min-w-[620px]">
              {/* Products Header Columns */}
              <div className="grid grid-cols-4 gap-4 pb-4 border-b border-gray-200 items-stretch">
                <div className="font-bold text-gray-500 uppercase text-[11px] pt-4 flex flex-col justify-between">
                  <span>{t('itemDetails')}</span>
                  <span className="text-[10px] text-gray-400 normal-case font-normal">
                    {highlightDifferences ? '● Highlighted rows indicate differing specifications' : ''}
                  </span>
                </div>

                {compareList.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col justify-between relative group hover:shadow-md transition">
                    <button
                      type="button"
                      onClick={() => removeFromCompare(product.id)}
                      className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-gray-100 transition cursor-pointer z-10`}
                      title={t('removeProduct')}
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>

                    <Link
                      to={`/product/${product.id}`}
                      onClick={closeCompareModal}
                      className="w-full h-32 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-2 mb-2 block overflow-hidden group/img"
                    >
                      <img
                        src={product.image}
                        alt={product.title}
                        className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform"
                      />
                    </Link>

                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">{product.brand}</span>
                    <Link
                      to={`/product/${product.id}`}
                      onClick={closeCompareModal}
                      className="font-bold text-gray-900 hover:text-[#FF9900] line-clamp-2 text-xs mb-3 min-h-[32px]"
                      title={product.title}
                    >
                      {product.title}
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className={`btn-sharp w-full py-2 px-2 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-auto rounded ${
                        addedId === product.id ? 'bg-emerald-600 text-white' : 'bg-[#FF9900] hover:bg-[#E68A00] text-gray-950'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {addedId === product.id ? 'check' : 'shopping_cart'}
                      </span>
                      {addedId === product.id ? t('addedToCart') : t('addToCart')}
                    </button>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="border-2 border-dashed border-gray-200 rounded-lg p-5 flex flex-col items-center justify-center text-center text-gray-400 h-full min-h-[220px] bg-slate-50/50">
                    <span className="material-symbols-outlined text-3xl mb-1 text-gray-300">add_circle_outline</span>
                    <span className="font-bold text-xs text-gray-600">Empty Comparison Slot</span>
                    <span className="text-[11px] text-gray-400 mt-1 max-w-[140px] leading-relaxed">
                      Select "Compare" on another product from the catalog
                    </span>
                  </div>
                ))}
              </div>

              {/* Standard Attributes Rows */}
              <div className="divide-y divide-gray-100">
                {commonRows.map((row) => {
                  const values = compareList.map(row.getValue);
                  const hasDiff = new Set(values).size > 1;
                  const isHighlighted = highlightDifferences && hasDiff;

                  return (
                    <div
                      key={row.key}
                      className={`grid grid-cols-4 gap-4 py-3 items-center transition ${
                        isHighlighted ? 'bg-amber-50/80 font-semibold' : 'hover:bg-gray-50/60'
                      }`}
                    >
                      <div className="font-semibold text-gray-600 pl-1 flex items-center gap-1.5">
                        <span>{row.label}</span>
                        {isHighlighted && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Different between items"></span>
                        )}
                      </div>

                      {compareList.map((product) => (
                        <div key={product.id} className="px-2">
                          {row.render(product)}
                        </div>
                      ))}

                      {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                        <div key={`empty-cell-${idx}`} className="text-gray-300 text-center">—</div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Hardware Technical Specifications Section */}
              {allSpecKeys.length > 0 && (
                <div className="mt-6 pt-4 border-t-2 border-gray-200">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-gray-900 mb-3 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-600">settings_suggest</span>
                    {t('specsComparison')}
                  </h3>

                  <div className="divide-y divide-gray-100">
                    {allSpecKeys.map((specKey) => {
                      const values = compareList.map((p) => (p.specs && p.specs[specKey]) || '—');
                      const hasDiff = new Set(values).size > 1;
                      const isHighlighted = highlightDifferences && hasDiff;

                      return (
                        <div
                          key={specKey}
                          className={`grid grid-cols-4 gap-4 py-2.5 items-center transition ${
                            isHighlighted ? 'bg-amber-50/80 font-semibold' : 'hover:bg-gray-50/60'
                          }`}
                        >
                          <div className="font-semibold text-gray-600 pl-1 flex items-center gap-1.5">
                            <span>{specKey}</span>
                            {isHighlighted && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Specification differs"></span>
                            )}
                          </div>

                          {compareList.map((product) => (
                            <div key={product.id} className="px-2 text-gray-800 leading-snug">
                              {(product.specs && product.specs[specKey]) || <span className="text-gray-300">—</span>}
                            </div>
                          ))}

                          {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                            <div key={`empty-spec-${idx}`} className="text-gray-300 text-center">—</div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-5 sm:px-6 py-3 flex items-center justify-between text-xs shrink-0">
          <span className="text-gray-500 text-[11px]">
            {t('maxCompareWarning')}
          </span>
          <button
            type="button"
            onClick={closeCompareModal}
            className="btn-sharp px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded shadow-xs cursor-pointer"
          >
            {t('close')}
          </button>
        </div>

      </div>
    </div>
  );
};
