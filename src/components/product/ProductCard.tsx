import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCompare } from '../../context/CompareContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toggleCompare, isInCompare } = useCompare();
  const { t, isRTL } = useLanguage();
  const [isAdded, setIsAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  const getBadgeStyle = (badge?: string) => {
    if (!badge) return null;
    const lower = badge.toLowerCase();
    if (lower.includes('best seller') || lower.includes('top rated')) {
      return 'bg-[#F59E0B] text-gray-950 font-black';
    }
    if (lower.includes('limited') || lower.includes('deal')) {
      return 'bg-[#B91C1C] text-white font-black';
    }
    if (lower.includes('enterprise') || lower.includes('choice')) {
      return 'bg-[#1E293B] text-white font-bold';
    }
    if (lower.includes('platinum')) {
      return 'bg-gray-100 text-gray-800 font-bold border border-gray-300';
    }
    if (lower.includes('value')) {
      return 'bg-blue-50 text-blue-800 border border-blue-200 font-bold';
    }
    if (lower.includes('proart')) {
      return 'bg-purple-50 text-purple-800 border border-purple-200 font-bold';
    }
    if (lower.includes('coupon') || lower.includes('save')) {
      return 'bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold';
    }
    return 'bg-slate-100 text-slate-800 font-semibold border border-slate-200';
  };

  // Format currency
  const formatPrice = (val: number) => {
    const parts = val.toFixed(2).split('.');
    return (
      <>
        ${Number(parts[0]).toLocaleString()}
        <span className="text-xs font-normal">.{parts[1]}</span>
      </>
    );
  };

  const originalPrice = product.originalPrice || Math.round(product.price * 1.15);
  const savings = Math.max(0, originalPrice - product.price);
  const discountPct = product.discountPercentage || Math.round((savings / originalPrice) * 100);

  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded p-4 flex flex-col md:flex-row gap-5 items-center justify-between hover:shadow-md transition group w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-center flex-1 w-full">
          <Link to={`/product/${product.id}`} className="shrink-0 w-32 h-32 sm:w-36 sm:h-36 bg-gray-50 rounded border border-gray-100 p-2 flex items-center justify-center relative overflow-hidden">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {product.badge && (
              <span className={`absolute top-1 ${isRTL ? 'right-1' : 'left-1'} text-[9px] uppercase px-1.5 py-0.5 rounded-xs ${getBadgeStyle(product.badge)}`}>
                {product.badge}
              </span>
            )}
          </Link>
          <div className="space-y-1 flex-1 text-center sm:text-left">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">{product.brand} • {product.category}</div>
            <Link to={`/product/${product.id}`}>
              <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#FF9900] transition line-clamp-2">
                {product.title}
              </h3>
            </Link>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs">
              <div className="flex text-amber-500">★★★★★</div>
              <span className="text-blue-700 hover:underline">{product.ratingCount?.toLocaleString() || 412} {t('ratingsCount')}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500">{product.boughtCountText || `500+ ${t('boughtInPastMonth')}`}</span>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 pt-1">{product.description}</p>
          </div>
        </div>

        <div className="w-full md:w-64 border-t md:border-t-0 md:border-l md:border-r-0 border-gray-200 pt-3 md:pt-0 md:px-4 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
              {savings > 0 && (
                <span className="text-xs text-gray-500 line-through">{t('listPrice')} ${originalPrice.toLocaleString()}</span>
              )}
            </div>
            {savings > 0 && (
              <span className="text-[11px] text-emerald-700 font-semibold block">
                {t('save')} ${savings.toFixed(2)} ({discountPct}% {t('off')})
              </span>
            )}
            <div className="text-xs text-gray-700 font-semibold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
              {t('freeOneDayDelivery')}
            </div>
            <div className="text-[11px] text-gray-600">
              {t('getItBy')} <strong className="text-gray-900">{t('tomorrow')}</strong>
            </div>
            <div className={`text-[11px] font-bold flex items-center gap-1 mt-1 ${product.stock < 5 ? 'text-red-600' : 'text-emerald-700'}`}>
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${product.stock < 5 ? 'bg-red-600' : 'bg-emerald-600'}`}></span>
              {product.stock < 5 ? t('onlyLeft', { count: product.stock }) : t('inStock')}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAddToCart}
              className={`btn-sharp flex-1 py-2 px-3 text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                isAdded ? 'bg-emerald-600 text-white' : 'bg-[#FF9900] hover:bg-[#E68A00] text-gray-950'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isAdded ? 'check' : 'shopping_cart'}
              </span>
              {isAdded ? t('addedToCart') : t('addToCart')}
            </button>
            <button
              type="button"
              onClick={handleToggleCompare}
              className={`px-2.5 py-2 border rounded font-semibold text-xs flex items-center gap-1 transition cursor-pointer ${
                isCompared
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
              title={isCompared ? t('removeProduct') : t('selectToCompare')}
            >
              <span className="material-symbols-outlined text-[16px]">
                {isCompared ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span className="hidden sm:inline">{t('compare')}</span>
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`p-2 border rounded hover:border-slate-400 transition cursor-pointer ${
                isFavorited ? 'text-red-500 border-red-200 bg-red-50' : 'text-gray-400 border-gray-200'
              }`}
              title="Add to Wishlist"
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded p-3.5 sm:p-4 flex flex-col justify-between hover:shadow-md transition group relative h-full w-full">
      <div>
        {/* Badge, Compare & Wishlist Action Header */}
        <div className="mb-2 flex items-center justify-between min-h-[22px] gap-1.5">
          <div className="flex items-center gap-1.5 overflow-hidden">
            {product.badge ? (
              <span className={`text-[10px] uppercase px-2 py-0.5 rounded-xs tracking-wider truncate ${getBadgeStyle(product.badge)}`}>
                {product.badge}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-gray-400 truncate">{product.brand}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compare Toggle Button */}
            <button
              type="button"
              onClick={handleToggleCompare}
              className={`flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border transition cursor-pointer ${
                isCompared
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
              }`}
              title={isCompared ? t('removeProduct') : t('selectToCompare')}
              aria-label={t('compare')}
            >
              <span className="material-symbols-outlined text-[14px]">
                {isCompared ? 'check_box' : 'check_box_outline_blank'}
              </span>
              <span>{t('compare')}</span>
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`transition p-0.5 rounded hover:scale-110 cursor-pointer ${
                isFavorited ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
              }`}
              title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <span className="material-symbols-outlined text-[18px]">favorite</span>
            </button>
          </div>
        </div>

        {/* Product Visual Area */}
        <Link
          to={`/product/${product.id}`}
          className="w-full h-40 sm:h-44 bg-gray-50 rounded flex items-center justify-center p-3 relative overflow-hidden mb-3 border border-gray-100 block group/img"
        >
          <img
            src={product.image}
            alt={product.title}
            className="max-h-full max-w-full object-contain group-hover/img:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
            }}
          />
          {product.ram && (
            <span className={`absolute bottom-1 ${isRTL ? 'left-2' : 'right-2'} text-[10px] text-gray-500 font-mono bg-white/80 px-1 py-0.5 rounded shadow-2xs`}>
              {product.ram}
            </span>
          )}
        </Link>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h2 className="text-xs font-bold text-gray-900 group-hover:text-[#FF9900] transition line-clamp-2 leading-snug mb-1 min-h-[32px]">
            {product.title}
          </h2>
        </Link>

        {/* Star Rating UI */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex text-amber-500 text-xs tracking-tighter">
            ★★★★★
          </div>
          <Link
            to={`/product/${product.id}`}
            className="text-xs text-blue-700 font-medium hover:underline"
          >
            {product.ratingCount?.toLocaleString() || '1,245'} {t('ratingsCount')}
          </Link>
        </div>

        <div className="text-[11px] text-gray-500 mb-2">
          {product.boughtCountText || `500+ ${t('boughtInPastMonth')}`}
        </div>

        {/* Pricing Area: Bold discounted + crossed out list */}
        <div className="mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-gray-900">{formatPrice(product.price)}</span>
            {savings > 0 && (
              <span className="text-xs text-gray-500 line-through">${originalPrice.toLocaleString()}</span>
            )}
          </div>
          {savings > 0 && (
            <span className={`text-[11px] font-semibold block ${product.badge?.includes('Deal') ? 'text-red-700' : 'text-emerald-700'}`}>
              {t('save')} ${savings.toFixed(2)} ({discountPct}% {t('off')})
            </span>
          )}
        </div>

        {/* Delivery & Stock Promises */}
        <div className="space-y-0.5 text-xs mb-3">
          <div className="font-bold text-gray-900 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-amber-500">bolt</span>
            {t('freeOneDayDelivery')}
          </div>
          <div className="text-gray-600 text-[11px]">
            {t('getItBy')} <strong className="text-gray-900">{t('tomorrow')}</strong>
          </div>
          <div className={`font-bold text-[11px] flex items-center gap-1 pt-1 ${
            product.stock < 5 ? 'text-red-600' : 'text-[#15803D]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block ${
              product.stock < 5 ? 'bg-red-600' : 'bg-emerald-600'
            }`}></span>
            {product.stock < 5 ? t('onlyLeft', { count: product.stock }) : t('inStock')}
          </div>
        </div>
      </div>

      {/* Solid Orange 'Add to Cart' Button */}
      <button
        onClick={handleAddToCart}
        className={`btn-sharp w-full py-2 px-3 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-auto ${
          isAdded
            ? 'bg-emerald-600 text-white'
            : 'bg-[#FF9900] hover:bg-[#E68A00] active:bg-[#CC7A00] text-gray-950'
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">
          {isAdded ? 'check' : 'shopping_cart'}
        </span>
        {isAdded ? t('addedToCart') : t('addToCart')}
      </button>
    </div>
  );
};
