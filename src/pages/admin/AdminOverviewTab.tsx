import React from 'react';
import { useOrders } from '../../context/OrderContext';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: 'products' | 'orders') => void;
  onOpenAddModal: () => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  onNavigateTab,
  onOpenAddModal,
}) => {
  const { orders, totalRevenue, totalOrdersCount } = useOrders();
  const { products } = useProducts();
  const { t } = useLanguage();

  const lowStockCount = products.filter((p) => p.stock < 5).length;
  const recentOrders = orders.slice(0, 5);

  const categoryStats = products.reduce((acc: Record<string, number>, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('totalGrossRevenue')}</span>
            <span className="material-symbols-outlined text-emerald-600 text-xl">payments</span>
          </div>
          <div className="text-2xl font-black text-gray-900">
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            {t('vsLastMonth')}
          </div>
        </div>

        {/* Card 2: Orders */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('enterpriseOrders')}</span>
            <span className="material-symbols-outlined text-blue-600 text-xl">receipt_long</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{totalOrdersCount}</div>
          <div className="text-[11px] text-gray-500 mt-1">{t('processedCheckout')}</div>
        </div>

        {/* Card 3: Products */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('activeCatalogProducts')}</span>
            <span className="material-symbols-outlined text-purple-600 text-xl">inventory_2</span>
          </div>
          <div className="text-2xl font-black text-gray-900">{products.length}</div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">{t('liveInStorefront')}</div>
        </div>

        {/* Card 4: Low Stock Alerts */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">{t('lowStockAlerts')}</span>
            <span className="material-symbols-outlined text-red-600 text-xl">warning</span>
          </div>
          <div className="text-2xl font-black text-red-600">{lowStockCount}</div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            {lowStockCount > 0 ? t('requireRestock') : t('allStocked')}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Recent Orders Summary (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('recentEnterpriseOrders')}</h2>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
            >
              {t('viewAllOrders')} ({orders.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead className="bg-gray-50 text-gray-600 uppercase text-[10px] tracking-wider border-y border-gray-200">
                <tr>
                  <th className="py-2.5 px-3">{t('orderIdDate')}</th>
                  <th className="py-2.5 px-3">{t('customerDetails')}</th>
                  <th className="py-2.5 px-3">{t('total')}</th>
                  <th className="py-2.5 px-3">{t('shipmentStatus')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-3 font-mono font-bold text-blue-700">{o.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-gray-900">{o.customerName}</div>
                      <div className="text-[11px] text-gray-400">{o.customerEmail}</div>
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-900">
                      ${o.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : o.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Launch & Department Stats */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('adminQuickActions')}</h3>
            <div className="space-y-2 text-xs">
              <button
                onClick={onOpenAddModal}
                className="btn-sharp w-full py-2.5 px-3 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                {t('addNewHardwareProduct')}
              </button>
              <button
                onClick={() => onNavigateTab('products')}
                className="btn-sharp w-full py-2 px-3 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">edit_note</span>
                {t('manageStoreCatalog')} ({products.length})
              </button>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">{t('catalogByDepartment')}</h3>
            <div className="space-y-2 text-xs">
              {Object.entries(categoryStats).map(([cat, count]) => (
                <div key={cat} className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700 truncate pr-2">{cat}</span>
                  <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
