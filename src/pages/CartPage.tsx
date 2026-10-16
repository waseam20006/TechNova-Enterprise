import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, subtotal, tax, shipping, total, totalItemsCount } = useCart();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; error?: boolean } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === 'TECHNOVA20') {
      const discount = Math.round(subtotal * 0.20 * 100) / 100;
      setCouponDiscount(discount);
      setCouponMessage({ text: isRTL ? 'تم تطبيق الرمز الترويجي: خصم الشركات 20%!' : 'Promo code applied: 20% Enterprise Discount!' });
    } else if (couponCode.trim().toUpperCase() === 'FREESHIP') {
      setCouponMessage({ text: isRTL ? 'تم تأكيد الشحن المجاني!' : 'Free freight coupon confirmed!' });
    } else {
      setCouponMessage({ text: isRTL ? 'رمز ترويجي غير صالح.' : 'Invalid promotional code.', error: true });
    }
  };

  const finalTotal = Math.max(0, Math.round((total - couponDiscount) * 100) / 100);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header />

      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 sm:mb-6">{t('shoppingCart')}</h1>

        {cart.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center shadow-xs max-w-2xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-gray-300 text-6xl">remove_shopping_cart</span>
            <h2 className="text-lg font-bold text-gray-900">{t('cartEmpty')}</h2>
            <p className="text-xs text-gray-500">
              {t('cartEmptyDesc')}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs"
            >
              {t('exploreCatalog')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left: Cart Items List (8 cols) */}
            <div className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <span className="text-xs sm:text-sm font-bold text-gray-700">{t('itemDetails')}</span>
                <span className="text-xs sm:text-sm font-bold text-gray-700">{t('priceCol')}</span>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-4 sm:py-5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex gap-3 sm:gap-4 flex-1 w-full">
                      {/* Product Thumbnail */}
                      <Link
                        to={`/product/${item.product.id}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 rounded border border-gray-100 p-2 shrink-0 flex items-center justify-center"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="space-y-1 flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-xs sm:text-sm font-bold text-gray-900 hover:text-[#FF9900] line-clamp-2"
                        >
                          {item.product.title}
                        </Link>
                        <div className="text-[11px] text-gray-500">
                          {item.product.brand} • {item.product.category}
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          {t('inStock')}
                        </div>

                        {/* Controls: Quantity & Delete */}
                        <div className="flex items-center gap-4 pt-2 text-xs">
                          <div className="flex items-center border border-gray-300 rounded bg-gray-50">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 cursor-pointer text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="px-3 py-1 font-bold text-gray-900 bg-white border-x border-gray-300 text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-gray-600 hover:bg-gray-200 cursor-pointer text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-xs text-blue-700 hover:underline hover:text-red-600 cursor-pointer font-medium"
                          >
                            {t('delete')}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Price Column */}
                    <div className="text-right sm:self-start w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-end pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <span className="sm:hidden text-xs text-gray-500">{t('priceCol')}:</span>
                      <div className="text-base font-bold text-gray-900">
                        ${(item.product.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Footer Bar */}
              <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  onClick={clearCart}
                  className="text-xs text-gray-500 hover:text-red-600 cursor-pointer font-medium"
                >
                  {t('clearAllItems')}
                </button>
                <div className="text-right text-xs sm:text-sm">
                  {t('itemsSubtotal')} ({totalItemsCount} {totalItemsCount === 1 ? t('item') : t('items')}):{' '}
                  <strong className="text-base text-gray-900">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>
            </div>

            {/* Right: Order Summary Card (4 cols) */}
            <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                {t('orderSummary')}
              </h2>

              <div className="space-y-2.5 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>{t('itemsSubtotal')}</span>
                  <span className="font-semibold text-gray-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1">
                    {t('shippingAndHandling')}
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {shipping === 0 ? t('free') : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>{t('estimatedTax')}</span>
                  <span className="font-semibold text-gray-900">${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>{t('enterpriseDiscount')}</span>
                    <span>-${couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                  <span>{t('orderTotal')}</span>
                  <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-gray-100 space-y-2">
                <label className="block text-xs font-semibold text-gray-700">{t('promoCodeLabel')}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="TECHNOVA20"
                    className="flex-1 px-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  />
                  <button
                    type="submit"
                    className="btn-sharp px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800 border border-gray-300 cursor-pointer"
                  >
                    {t('apply')}
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[11px] font-semibold ${couponMessage.error ? 'text-red-600' : 'text-emerald-700'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout')}
                className="btn-sharp w-full py-3 px-4 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">lock</span>
                {t('proceedToCheckout')} ({totalItemsCount})
              </button>

              <div className="text-[11px] text-gray-500 text-center leading-relaxed">
                <p>{t('poNotice')}</p>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};
