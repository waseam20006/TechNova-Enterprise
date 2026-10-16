import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const OrdersPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const { addToCart } = useCart();
  const { getProductById } = useProducts();
  const { t } = useLanguage();

  const userOrders = currentUser?.role === 'admin'
    ? orders
    : orders.filter((o) => o.customerEmail.toLowerCase() === currentUser?.email.toLowerCase());

  const getStatusBadge = (status: string) => {
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

  const handleBuyAgain = (productId: string | number) => {
    const prod = getProductById(productId);
    if (prod) {
      addToCart(prod, 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header />

      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">{t('yourEnterpriseOrders')}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {t('orderHistoryDesc')} {currentUser?.email}
            </p>
          </div>
          <Link
            to="/"
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 text-xs font-bold text-gray-800 shadow-2xs self-start"
          >
            {t('returnToStorefront')}
          </Link>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center shadow-xs max-w-xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-gray-300 text-6xl">inventory_2</span>
            <h2 className="text-lg font-bold text-gray-900">{t('noOrdersYet')}</h2>
            <p className="text-xs text-gray-500">
              {t('noOrdersDesc')}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs"
            >
              {t('startShopping')}
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs hover:border-gray-300 transition"
              >
                {/* Order Top Bar */}
                <div className="bg-gray-50 border-b border-gray-200 px-4 sm:px-6 py-3.5 sm:py-4 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex flex-wrap gap-4 sm:gap-8">
                    <div>
                      <span className="text-gray-500 block text-[11px] uppercase tracking-wider">{t('orderPlaced')}</span>
                      <strong className="text-gray-900">
                        {new Date(order.date).toLocaleDateString()}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[11px] uppercase tracking-wider">{t('total')}</span>
                      <strong className="text-gray-900">
                        ${order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </strong>
                    </div>

                    <div>
                      <span className="text-gray-500 block text-[11px] uppercase tracking-wider">{t('shipTo')}</span>
                      <strong className="text-gray-900 truncate max-w-[180px] block">
                        {order.shippingAddress.fullName}
                      </strong>
                    </div>

                    <div className="hidden md:block">
                      <span className="text-gray-500 block text-[11px] uppercase tracking-wider">{t('paymentMethod')}</span>
                      <span className="text-gray-700">{order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-gray-500 block text-[11px] uppercase tracking-wider">Order # {order.id}</span>
                    <span className="text-blue-700 font-mono text-xs">{order.trackingNumber}</span>
                  </div>
                </div>

                {/* Order Body */}
                <div className="p-4 sm:p-6">
                  {/* Status Indicator */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-gray-500">
                      {t('carrier')}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex gap-3 sm:gap-4 items-center flex-1">
                          <Link
                            to={`/product/${item.productId}`}
                            className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded border border-gray-100 p-2 shrink-0 flex items-center justify-center"
                          >
                            <img src={item.image} alt={item.title} className="max-h-full max-w-full object-contain" />
                          </Link>
                          <div>
                            <span className="text-[11px] font-semibold text-blue-700 uppercase">{item.brand}</span>
                            <Link
                              to={`/product/${item.productId}`}
                              className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#FF9900] line-clamp-2 block"
                            >
                              {item.title}
                            </Link>
                            <div className="text-xs text-gray-500 mt-1">
                              Qty: {item.quantity} × ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleBuyAgain(item.productId)}
                            className="btn-sharp px-3 py-1.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">refresh</span>
                            {t('buyItAgain')}
                          </button>
                          <Link
                            to={`/product/${item.productId}`}
                            className="btn-sharp px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs shadow-2xs"
                          >
                            {t('viewItem')}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
