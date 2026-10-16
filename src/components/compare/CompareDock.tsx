import React from 'react';
import { useCompare } from '../../context/CompareContext';
import { useLanguage } from '../../context/LanguageContext';

export const CompareDock: React.FC = () => {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    openCompareModal,
    toastMessage,
  } = useCompare();
  const { t, isRTL } = useLanguage();

  const emptySlotsCount = Math.max(0, 3 - compareList.length);

  return (
    <>
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F172A] text-white px-4 py-2.5 rounded-lg shadow-xl border border-amber-500/50 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <span className="material-symbols-outlined text-amber-400 text-base">info</span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Floating Bottom Compare Dock (Visible whenever at least 1 product is selected) */}
      {compareList.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-3xl bg-[#0F172A]/95 backdrop-blur-md text-white rounded-xl shadow-2xl border border-slate-700/80 p-3 sm:px-5 sm:py-3.5 transition-all animate-in slide-in-from-bottom-4 duration-200"
          style={{ direction: isRTL ? 'rtl' : 'ltr' }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Left: Indicator & Thumbnails */}
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <div className="shrink-0 flex items-center gap-2 pr-2 border-r border-slate-700">
                <span className="material-symbols-outlined text-amber-400 text-xl">compare_arrows</span>
                <div>
                  <div className="text-xs font-black tracking-tight flex items-center gap-1.5">
                    <span>{t('compare')}</span>
                    <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {compareList.length}/3
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400 hidden md:block">
                    {emptySlotsCount > 0 ? `+${emptySlotsCount} slot${emptySlotsCount > 1 ? 's' : ''} available` : 'Max reached'}
                  </span>
                </div>
              </div>

              {/* Product Thumbnails in Dock */}
              <div className="flex items-center gap-2">
                {compareList.map((product) => (
                  <div
                    key={product.id}
                    className="relative group bg-slate-800/90 border border-slate-600 rounded-lg p-1 w-12 h-12 sm:w-13 sm:h-13 flex items-center justify-center shrink-0"
                    title={product.title}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      className="max-h-full max-w-full object-contain rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCompare(product.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px] opacity-90 group-hover:opacity-100 shadow hover:bg-red-700 transition cursor-pointer"
                      title={t('removeProduct')}
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Empty Slots */}
                {Array.from({ length: emptySlotsCount }).map((_, i) => (
                  <div
                    key={`slot-${i}`}
                    className="w-12 h-12 sm:w-13 sm:h-13 rounded-lg border border-dashed border-slate-600 flex flex-col items-center justify-center text-slate-500 text-[9px] shrink-0"
                    title="Add another product from catalog"
                  >
                    <span className="material-symbols-outlined text-sm text-slate-500">add</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs text-gray-400 hover:text-white transition px-2 py-1 cursor-pointer"
              >
                {t('clearCompare')}
              </button>

              <button
                type="button"
                onClick={openCompareModal}
                className="btn-sharp bg-[#FF9900] hover:bg-[#E68A00] active:bg-[#CC7A00] text-gray-950 font-bold px-4 py-2 rounded text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">compare_arrows</span>
                <span>{t('compareNow')} ({compareList.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
