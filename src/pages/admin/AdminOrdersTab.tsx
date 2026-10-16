import React, { useState } from 'react';
import { useOrders } from '../../context/OrderContext';
import { useLanguage } from '../../context/LanguageContext';
import { OrderStatus } from '../../types';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus } = useOrders();
  const { t, isRTL } = useLanguage();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<any | null>(null);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.trackingNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrderDetails && selectedOrderDetails.id === orderId) {
      setSelectedOrderDetails({ ...selectedOrderDetails, status: newStatus });
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer, tracking #..."
              className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]`}
            />
            <span className={`material-symbols-outlined text-gray-400 text-base absolute ${isRTL ? 'right-2.5' : 'left-2.5'} top-1/2 -translate-y-1/2`}>
              search
            </span>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-gray-300 rounded bg-white font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
          >
            <option value="all">All Statuses ({orders.length})</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="text-xs text-gray-500 font-medium">
          {t('showingResults')} <strong className="text-gray-900">{filteredOrders.length}</strong>
        </div>
      </div>

      {/* Orders Table with Responsive Scroll */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[750px]">
            <thead className="bg-gray-50 text-gray-700 uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">{t('orderIdDate')}</th>
                <th className="py-3 px-4">{t('customerDetails')}</th>
                <th className="py-3 px-4">{t('itemDetails')}</th>
                <th className="py-3 px-4">{t('total')}</th>
                <th className="py-3 px-4">{t('shipmentStatus')}</th>
                <th className="py-3 px-4 text-right">{t('invoice')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-700">{order.id}</div>
                    <div className="text-[11px] text-gray-500">
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                      {order.trackingNumber}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900">{order.customerName}</div>
                    <div className="text-[11px] text-gray-500">{order.customerEmail}</div>
                    <div className="text-[11px] text-gray-400">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-gray-800">
                      {order.items.length} {order.items.length === 1 ? t('item') : t('items')}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate max-w-xs">
                      {order.items.map((i) => `${i.quantity}x ${i.title}`).join(', ')}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 text-sm">
                      ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-[10px] text-gray-400">{order.paymentMethod}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold px-2.5 py-1 rounded border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 ${getStatusBadge(order.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrderDetails(order)}
                      className="px-3 py-1 bg-white hover:bg-gray-100 border border-gray-300 rounded text-[11px] font-semibold text-gray-700 shadow-2xs cursor-pointer inline-flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">visibility</span>
                      {t('details')}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details & Receipt Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full border border-gray-200 overflow-hidden my-8">
            <div className="bg-[#0F172A] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block uppercase tracking-wider">Enterprise Invoice Receipt</span>
                <h3 className="font-bold text-sm font-mono">Order {selectedOrderDetails.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="text-gray-400 hover:text-white transition p-1"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="p-6 text-xs space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded border border-gray-200">
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Customer / Billed To:</span>
                  <p className="font-bold text-gray-900">{selectedOrderDetails.customerName}</p>
                  <p className="text-gray-500">{selectedOrderDetails.customerEmail}</p>
                  <p className="text-gray-500 mt-1">Payment: {selectedOrderDetails.paymentMethod}</p>
                </div>
                <div>
                  <span className="font-bold text-gray-700 block mb-1">Shipment Destination:</span>
                  <p className="text-gray-800">{selectedOrderDetails.shippingAddress.street}</p>
                  <p className="text-gray-800">
                    {selectedOrderDetails.shippingAddress.city}, {selectedOrderDetails.shippingAddress.state} {selectedOrderDetails.shippingAddress.zipCode}
                  </p>
                  <p className="text-gray-500 font-mono mt-1">Tracking: {selectedOrderDetails.trackingNumber}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 uppercase tracking-wider mb-2">Ordered Hardware Systems</h4>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded overflow-hidden">
                  {selectedOrderDetails.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt="" className="w-10 h-10 object-contain rounded bg-gray-50 border p-1" />
                        <div>
                          <p className="font-bold text-gray-900">{item.title}</p>
                          <p className="text-[11px] text-gray-500">Qty: {item.quantity} × ${item.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900">
                        ${(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-gray-200 text-right">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal:</span>
                  <span className="font-medium text-gray-900">${selectedOrderDetails.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tax:</span>
                  <span className="font-medium text-gray-900">${selectedOrderDetails.tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-1 border-t border-gray-200">
                  <span>Grand Total:</span>
                  <span>${selectedOrderDetails.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Update Status:</span>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => handleStatusChange(selectedOrderDetails.id, e.target.value as OrderStatus)}
                    className="px-3 py-1.5 border border-gray-300 rounded font-semibold text-xs"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-4 py-1.5 bg-gray-900 text-white rounded text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
