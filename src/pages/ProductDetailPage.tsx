import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLanguage } from '../context/LanguageContext';
import { useCompare } from '../context/CompareContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductCard } from '../components/product/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProductById, products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare, compareList, openCompareModal } = useCompare();
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();

  const product = id ? getProductById(id) : undefined;
  const isCompared = product ? isInCompare(product.id) : false;
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [product, id]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F4F6]">
        <Header />
        <div className="flex-1 max-w-4xl mx-auto p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
          <span className="material-symbols-outlined text-6xl text-gray-300">error_outline</span>
          <h2 className="text-xl font-bold text-gray-900">{t('noMatchingProducts')}</h2>
          <Link
            to="/"
            className="px-5 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs"
          >
            {t('returnToStorefront')}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFavorited = isInWishlist(product.id);
  const allImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const originalPrice = product.originalPrice || Math.round(product.price * 1.15);
  const savings = Math.max(0, originalPrice - product.price);
  const discountPct = product.discountPercentage || Math.round((savings / originalPrice) * 100);

  const relatedProducts = products
    .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header />

      {/* Sub-bar Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 text-xs text-gray-500 shadow-2xs">
        <div className="max-w-[1536px] mx-auto flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#FF9900]">{t('electronics')}</Link>
          <span className={`material-symbols-outlined text-[13px] text-gray-400 ${isRTL ? 'rtl-flip' : ''}`}>chevron_right</span>
          <Link to={`/?category=${encodeURIComponent(product.category)}`} className="hover:text-[#FF9900]">
            {product.category}
          </Link>
          <span className={`material-symbols-outlined text-[13px] text-gray-400 ${isRTL ? 'rtl-flip' : ''}`}>chevron_right</span>
          <span className="text-gray-900 font-semibold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-6 w-full flex-1">
        {/* Main Product Stage */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Column 1: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="w-full h-72 sm:h-96 md:h-[420px] bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
              <img
                src={selectedImage || product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain transition-all duration-300"
              />
              {product.badge && (
                <span className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} bg-[#F59E0B] text-gray-950 text-xs font-black uppercase px-2.5 py-1 rounded-xs shadow-xs`}>
                  {product.badge}
                </span>
              )}
              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} p-2 rounded-full bg-white shadow border border-gray-200 transition ${
                  isFavorited ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
                title={isFavorited ? 'In Wishlist' : 'Add to Wishlist'}
              >
                <span className="material-symbols-outlined text-xl">favorite</span>
              </button>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded border-2 p-1 bg-gray-50 shrink-0 cursor-pointer transition ${
                      selectedImage === img ? 'border-[#FF9900] ring-1 ring-[#FF9900]' : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-center justify-between">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="material-symbols-outlined text-blue-600 text-base">verified</span>
                {t('certifiedHardware')}
              </span>
              <span className="text-[11px] font-mono text-slate-500">SKU: {String(product.id).toUpperCase()}</span>
            </div>
          </div>

          {/* Column 2: Overview & Specs (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
                {product.brand}
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                {product.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
              <div className="flex text-amber-500 text-sm">★★★★★</div>
              <span className="text-xs font-semibold text-blue-700">
                {product.ratingCount?.toLocaleString() || 1245} {t('ratingsCount')}
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-xs text-gray-500">{product.boughtCountText || `500+ ${t('boughtInPastMonth')}`}</span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {savings > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ${originalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="text-xs font-bold text-emerald-700">
                  {t('save')} ${savings.toFixed(2)} ({discountPct}% {t('off')})
                </div>
              )}
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">{t('productOverview')}</h3>
              <p className="text-xs text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="pt-3 border-t border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">{t('technicalSpecs')}</h3>
                <dl className="text-xs divide-y divide-gray-100 bg-gray-50 rounded border border-gray-200">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="px-3 py-2 grid grid-cols-3 gap-2">
                      <dt className="text-gray-500 font-semibold">{key}</dt>
                      <dd className="text-gray-900 font-medium col-span-2">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* Column 3: Buy Box */}
          <div className="lg:col-span-3">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-5 space-y-4">
              <div className="text-2xl font-bold text-gray-900">
                ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>

              <div className="space-y-1 text-xs">
                <div className="font-bold text-gray-900 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-amber-500">bolt</span>
                  {t('freeOneDayDelivery')}
                </div>
                <div className="text-gray-600">
                  {t('getItBy')} <strong className="text-gray-900">{t('tomorrow')}</strong>
                </div>
              </div>

              <div className={`text-xs font-bold flex items-center gap-1.5 ${
                product.stock < 5 ? 'text-red-600' : 'text-emerald-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${product.stock < 5 ? 'bg-red-600' : 'bg-emerald-600'}`}></span>
                {product.stock < 5 ? t('onlyLeft', { count: product.stock }) : t('inStock')}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">{t('quantity')}</label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-white border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF9900]"
                >
                  {[...Array(Math.min(product.stock || 10, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? t('unit') : t('units')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className={`btn-sharp w-full py-2.5 px-4 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isAdded ? 'bg-emerald-600 text-white' : 'bg-[#FF9900] hover:bg-[#E68A00] text-gray-950'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isAdded ? 'check' : 'shopping_cart'}
                  </span>
                  {isAdded ? t('addedToCart') : t('addToCart')}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="btn-sharp w-full py-2.5 px-4 font-bold text-xs bg-[#FFA41C] hover:bg-[#F39800] text-gray-950 shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">bolt</span>
                  {t('buyNow')}
                </button>
              </div>

              {/* Product Comparison Action */}
              <div className="pt-2 border-t border-gray-200 space-y-1.5">
                <button
                  type="button"
                  onClick={() => toggleCompare(product)}
                  className={`w-full py-2 px-3 rounded text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isCompared
                      ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isCompared ? 'check_box' : 'compare_arrows'}
                  </span>
                  <span>{isCompared ? `${t('compare')} (${compareList.length}/3)` : t('selectToCompare')}</span>
                </button>

                {isCompared && (
                  <button
                    type="button"
                    onClick={openCompareModal}
                    className="w-full text-center text-[11px] font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer block"
                  >
                    {t('compareNow')} →
                  </button>
                )}
              </div>

              <div className="text-[11px] text-gray-500 space-y-1.5 pt-2 border-t border-gray-200">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-gray-600">lock</span>
                  <span>{t('secureSSL')}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-gray-600">local_shipping</span>
                  <span>{t('shipsDirect')}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Related Hardware Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-900">{t('relatedProducts')} {product.category}</h2>
              <Link to={`/?category=${encodeURIComponent(product.category)}`} className="text-xs font-semibold text-blue-700 hover:underline">
                {t('seeAll')}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};
