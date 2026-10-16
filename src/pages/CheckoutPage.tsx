import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const CheckoutPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { cart, subtotal, tax, clearCart, totalItemsCount } = useCart();
  const { createOrder } = useOrders();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    fullName: currentUser?.name || 'Sarah Jenkins',
    company: currentUser?.company || 'Meridian Global Systems',
    street: '742 Lexington Ave, Floor 14',
    city: 'New York',
    state: 'NY',
    zipCode: '10022',
    country: 'United States',
    phone: '+1 (555) 234-5678',
  });

  const [shippingMethod, setShippingMethod] = useState<'free' | 'overnight'>('free');
  const [paymentMethod, setPaymentMethod] = useState<'net30' | 'card' | 'wire'>('net30');

  const [cardDetails, setCardDetails] = useState({
    cardNumber: '•••• •••• •••• 4092',
    expiry: '09/28',
    cvv: '842',
    nameOnCard: currentUser?.name || 'Sarah Jenkins',
  });

  const [isPlacing, setIsPlacing] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  const shippingCost = shippingMethod === 'overnight' ? 25 : 0;
  const finalTotal = Math.round((subtotal + shippingCost + tax) * 100) / 100;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsPlacing(true);

    setTimeout(() => {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.image,
        brand: item.product.brand,
      }));

      const newOrder = createOrder({
        customerName: formData.fullName,
        customerEmail: currentUser?.email || 'customer@technova.com',
        items: orderItems,
        subtotal,
        tax,
        shipping: shippingCost,
        total: finalTotal,
        shippingAddress: {
          fullName: formData.fullName,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod:
          paymentMethod === 'net30'
            ? 'Corporate Net-30 Invoicing (PO #TN-4091)'
            : paymentMethod === 'card'
            ? 'Corporate Credit Card ending in 4092'
            : 'Corporate ACH / Direct Wire Transfer',
        status: 'Processing',
      });

      clearCart();
      setIsPlacing(false);
      setConfirmedOrder(newOrder);
    }, 1000);
  };

  if (confirmedOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-12 flex-1 w-full">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-xs text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-4xl">check_circle</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-gray-900">{t('orderSuccessTitle')}</h1>
            <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
              {t('orderSuccessDesc')}{' '}
              <strong className="text-gray-900">{confirmedOrder.customerEmail}</strong>.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 text-left text-xs space-y-2 max-w-lg mx-auto">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('orderNumber')}</span>
                <span className="font-mono font-bold text-gray-900">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('trackingNumber')}</span>
                <span className="font-mono font-bold text-blue-700">{confirmedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('estimatedDeliveryText')}</span>
                <span className="font-bold text-gray-900">{t('tomorrow')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">{t('paymentTerm')}</span>
                <span className="font-medium text-gray-900">{confirmedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 text-sm font-bold">
                <span>{t('totalBilled')}</span>
                <span className="text-gray-900">${confirmedOrder.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
              <Link
                to="/orders"
                className="px-6 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs"
              >
                {t('viewOrders')}
              </Link>
              <Link
                to="/"
                className="px-6 py-2.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 font-bold rounded text-xs shadow-xs"
              >
                {t('continueShopping')}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F4F6]">
        <Header />
        <div className="flex-1 max-w-xl mx-auto p-12 text-center flex flex-col items-center justify-center space-y-4">
          <span className="material-symbols-outlined text-gray-300 text-6xl">shopping_cart</span>
          <h2 className="text-xl font-bold text-gray-900">{t('cartEmpty')}</h2>
          <p className="text-xs text-gray-500">{t('cartEmptyDesc')}</p>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs"
          >
            {t('exploreCatalog')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header />

      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-blue-600">lock</span>
            {t('secureCheckout')}
          </h1>
          <span className="text-xs text-gray-500">
            {t('purchasingAs')} <strong className="text-gray-900">{currentUser?.name}</strong> ({currentUser?.email})
          </span>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Form: Shipping, Delivery & Payment (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step 1: Shipping Address */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">{t('deliveryDestination')}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('fullName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('companyName')}</label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-gray-700 mb-1">{t('streetAddress')}</label>
                  <input
                    type="text"
                    required
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">{t('city')}</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t('state')}</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-gray-700 mb-1">{t('zipCode')}</label>
                    <input
                      type="text"
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Options */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">2</span>
                <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">{t('shippingMethod')}</h2>
              </div>

              <div className="space-y-3 text-xs">
                <label className={`flex items-center justify-between p-3.5 rounded border cursor-pointer transition ${
                  shippingMethod === 'free' ? 'border-[#FF9900] bg-amber-50/30 ring-1 ring-[#FF9900]' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'free'}
                      onChange={() => setShippingMethod('free')}
                      className="text-[#FF9900] accent-[#FF9900] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-500 text-base">bolt</span>
                        {t('priorityGround')}
                      </div>
                      <div className="text-gray-500">{t('groundDesc')}</div>
                    </div>
                  </div>
                  <span className="font-bold text-emerald-700">{t('free')}</span>
                </label>

                <label className={`flex items-center justify-between p-3.5 rounded border cursor-pointer transition ${
                  shippingMethod === 'overnight' ? 'border-[#FF9900] bg-amber-50/30 ring-1 ring-[#FF9900]' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === 'overnight'}
                      onChange={() => setShippingMethod('overnight')}
                      className="text-[#FF9900] accent-[#FF9900] cursor-pointer"
                    />
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-blue-600 text-base">local_shipping</span>
                        {t('overnightCourier')}
                      </div>
                      <div className="text-gray-500">{t('overnightDesc')}</div>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">$25.00</span>
                </label>
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">3</span>
                <h2 className="text-xs sm:text-sm font-bold text-gray-900 uppercase tracking-wider">{t('paymentMethod')}</h2>
              </div>

              <div className="space-y-3 text-xs">
                {/* Net-30 option */}
                <label className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition ${
                  paymentMethod === 'net30' ? 'border-[#FF9900] bg-amber-50/30 ring-1 ring-[#FF9900]' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'net30'}
                    onChange={() => setPaymentMethod('net30')}
                    className="mt-1 text-[#FF9900] accent-[#FF9900] cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {t('net30Invoicing')}
                      <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded font-bold">Approved</span>
                    </div>
                    <p className="text-gray-500 mt-0.5">{t('net30Desc')}</p>
                  </div>
                </label>

                {/* Credit Card option */}
                <label className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition ${
                  paymentMethod === 'card' ? 'border-[#FF9900] bg-amber-50/30 ring-1 ring-[#FF9900]' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="mt-1 text-[#FF9900] accent-[#FF9900] cursor-pointer"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="font-bold text-gray-900 flex items-center gap-2">
                      {t('creditCard')}
                      <span className="text-gray-400 font-mono text-[11px]">(Visa, Mastercard, Amex)</span>
                    </div>
                    {paymentMethod === 'card' && (
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="col-span-2">
                          <input
                            type="text"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                            placeholder="Card Number"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            placeholder="MM/YY"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            placeholder="CVV"
                            className="w-full px-3 py-1.5 border border-gray-300 rounded font-mono text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Wire Transfer */}
                <label className={`flex items-start gap-3 p-3.5 rounded border cursor-pointer transition ${
                  paymentMethod === 'wire' ? 'border-[#FF9900] bg-amber-50/30 ring-1 ring-[#FF9900]' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'wire'}
                    onChange={() => setPaymentMethod('wire')}
                    className="mt-1 text-[#FF9900] accent-[#FF9900] cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{t('wireTransfer')}</div>
                    <p className="text-gray-500 mt-0.5">{t('wireDesc')}</p>
                  </div>
                </label>
              </div>
            </div>

          </div>

          {/* Right Summary Box (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider pb-2 border-b border-gray-100">
              {t('reviewAndPlaceOrder')}
            </h2>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1 divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.product.id} className="pt-2 first:pt-0 flex items-center gap-3">
                  <img src={item.product.image} alt="" className="w-10 h-10 object-contain rounded bg-gray-50 border border-gray-200 p-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{item.product.title}</p>
                    <p className="text-[11px] text-gray-500">{item.quantity} × ${item.product.price.toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-900">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2 text-xs text-gray-700">
              <div className="flex justify-between">
                <span>{t('itemsSubtotal')}</span>
                <span className="font-semibold text-gray-900">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('shippingAndHandling')}</span>
                <span className="font-semibold text-emerald-700">{shippingCost === 0 ? t('free') : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('estimatedTax')}</span>
                <span className="font-semibold text-gray-900">${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between text-base font-black text-gray-900">
                <span>{t('orderTotal')}</span>
                <span>${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPlacing}
              className="btn-sharp w-full py-3 px-4 bg-[#FF9900] hover:bg-[#E68A00] disabled:opacity-50 text-gray-950 font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              {isPlacing ? t('processingOrder') : `${t('placeOrderButton')} ($${finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
            </button>
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};
