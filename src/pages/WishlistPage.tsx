import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { t, isRTL } = useLanguage();

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header />

      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">{t('savedWishlist')}</h1>
            <p className="text-xs text-gray-500 mt-1">
              {t('savedWishlistDesc')}
            </p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs text-gray-500 hover:text-red-600 cursor-pointer self-start sm:self-auto"
            >
              {t('clearWishlist')}
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center shadow-xs max-w-xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-gray-300 text-6xl">favorite_border</span>
            <h2 className="text-lg font-bold text-gray-900">{t('wishlistEmpty')}</h2>
            <p className="text-xs text-gray-500">
              {t('wishlistEmptyDesc')}
            </p>
            <Link
              to="/"
              className="inline-block px-6 py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold rounded text-xs shadow-xs"
            >
              {t('exploreCatalog')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded p-4 flex flex-col justify-between hover:shadow-md transition relative group"
              >
                <div>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-red-500 hover:text-red-700 transition cursor-pointer`}
                    title={t('remove')}
                  >
                    <span className="material-symbols-outlined text-xl">favorite</span>
                  </button>

                  <Link
                    to={`/product/${product.id}`}
                    className="w-full h-44 bg-gray-50 rounded border border-gray-100 flex items-center justify-center p-3 mb-3 block"
                  >
                    <img src={product.image} alt={product.title} className="max-h-full max-w-full object-contain" />
                  </Link>

                  <span className="text-[11px] font-semibold text-blue-700 uppercase">{product.brand}</span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#FF9900] line-clamp-2 mb-2">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="text-base font-bold text-gray-900 mb-3">
                    ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>

                <div className="space-y-2 mt-auto">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="btn-sharp w-full py-2 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                    {t('moveToCart')}
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="btn-sharp w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs border border-gray-200 cursor-pointer"
                  >
                    {t('remove')}
                  </button>
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
