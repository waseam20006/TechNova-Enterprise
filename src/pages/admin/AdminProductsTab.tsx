import React, { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';
import { Product } from '../../types';

interface AdminProductsTabProps {
  onOpenAddModal: () => void;
  onOpenEditModal: (product: Product) => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  onOpenAddModal,
  onOpenEditModal,
}) => {
  const { products, deleteProduct, resetCatalog } = useProducts();
  const { t, isRTL } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          String(p.id).toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchTerm]);

  const handleDelete = (id: string | number) => {
    deleteProduct(id);
    setDeleteConfirmId(null);
    showToast(isRTL ? 'تم حذف المنتج بنجاح من الكتالوج.' : 'Product successfully removed from catalog.');
  };

  const handleResetCatalog = async () => {
    if (window.confirm(isRTL ? 'هل تريد استعادة الكتالوج إلى مواصفات الأجهزة الأصلية؟' : 'Reset catalog back to default enterprise hardware specifications?')) {
      await resetCatalog();
      showToast(isRTL ? 'تمت استعادة الكتالوج الافتراضي.' : 'Catalog restored to default enterprise seeds.');
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Controls: Search, Category Filter, and Add Button */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products by title, brand, or SKU..."
              className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]`}
            />
            <span className={`material-symbols-outlined text-gray-400 text-base absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2`}>
              search
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className={`material-symbols-outlined text-gray-400 hover:text-gray-600 text-sm absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 cursor-pointer`}
              >
                close
              </button>
            )}
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-56 px-3 py-2 text-xs border border-gray-300 rounded bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
          >
            <option value="all">{t('allDepartments')} ({products.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={handleResetCatalog}
            className="btn-sharp px-3 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            title={t('resetCatalog')}
          >
            <span className="material-symbols-outlined text-sm">restart_alt</span>
            <span className="hidden sm:inline">{t('resetCatalog')}</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="btn-sharp px-4 py-2 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">add</span>
            {t('addNewHardwareProduct')}
          </button>
        </div>
      </div>

      {/* Products Data Table with Responsive Scroll */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between text-xs">
          <span className="font-bold text-gray-700">
            {t('activeCatalogProducts')} ({filtered.length} {t('items')})
          </span>
          <span className="text-[11px] text-gray-500 hidden sm:inline">
            {t('liveInStorefront')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-gray-100 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">{t('hardwareItem')}</th>
                <th className="py-3 px-4">{t('department')}</th>
                <th className="py-3 px-4">{t('priceCol')}</th>
                <th className="py-3 px-4">{t('inventoryStock')}</th>
                <th className="py-3 px-4">Badge</th>
                <th className="py-3 px-4 text-right">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50/70 transition">
                  {/* Title & Image */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 max-w-md">
                      <div className="w-12 h-12 rounded border border-gray-200 bg-gray-50 p-1 shrink-0 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt=""
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-blue-700 uppercase block">
                          {product.brand}
                        </span>
                        <div className="font-bold text-gray-900 truncate">
                          {product.title}
                        </div>
                        <span className="text-[10px] font-mono text-gray-400">
                          ID: {String(product.id)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-gray-900">
                    ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Stock */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        product.stock < 5
                          ? 'bg-red-100 text-red-800'
                          : product.stock < 15
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.stock < 5 ? 'bg-red-600' : product.stock < 15 ? 'bg-amber-600' : 'bg-emerald-600'
                        }`}
                      ></span>
                      {product.stock} {t('inStock')}
                    </span>
                  </td>

                  {/* Badge */}
                  <td className="py-3 px-4">
                    {product.badge ? (
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-200">
                        {product.badge}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-[11px]">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onOpenEditModal(product)}
                        className="p-1.5 text-blue-700 hover:bg-blue-50 rounded transition cursor-pointer"
                        title={t('editProduct')}
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(product.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete Product"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 space-y-4 border border-gray-200">
            <div className="flex items-center gap-3 text-red-600">
              <span className="material-symbols-outlined text-3xl">delete_forever</span>
              <h3 className="text-base font-bold text-gray-900">Confirm Product Deletion</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Are you sure you want to delete this product from the TechNova catalog? This will immediately remove it from the customer storefront and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-300 rounded text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
              >
                {t('cancel')}
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold shadow-xs cursor-pointer"
              >
                {t('delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
