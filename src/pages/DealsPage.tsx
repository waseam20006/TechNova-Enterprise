import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductCard } from '../components/product/ProductCard';

export const DealsPage: React.FC = () => {
  const { products } = useProducts();
  const { t, isRTL } = useLanguage();

  const deals = products.filter(
    (p) => (p.discountPercentage && p.discountPercentage > 10) || p.badge?.toLowerCase().includes('deal') || p.badge?.toLowerCase().includes('save')
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      <Header />

      <main className="max-w-[1536px] mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1 w-full">
        {/* Banner */}
        <div className="bg-[#0F172A] text-white rounded-lg p-6 sm:p-8 mb-6 sm:mb-8 border border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl text-center sm:text-left">
            <span className="bg-[#B91C1C] text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-xs tracking-wider inline-block">
              {isRTL ? 'عروض لفترة محدودة' : 'Limited Time Deals'}
            </span>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight">
              {isRTL ? 'خصومات وعروض محطات العمل والعتاد التقني' : 'Enterprise Workstation & Hardware Discounts'}
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isRTL
                ? 'وفر حتى 500$ على أجهزة الحاسوب المحمولة المتطورة، الشاشات العريضة بدقة 49 بوصة، والأنظمة المعتمدة للمؤسسات. الشحن السريع مشمول مجاناً.'
                : 'Save up to $500 on high-end laptops, 49" ultrawide curved monitors, and certified ISV mobile workstations. Free Next-Day Courier included.'}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-lg text-center shrink-0 w-full sm:w-auto">
            <span className="text-[11px] text-amber-400 uppercase tracking-wider font-bold block mb-1">
              {isRTL ? 'خصم إضافي للشركات' : 'Corporate Bulk Rebate'}
            </span>
            <p className="text-lg font-black text-white">{isRTL ? 'وفر 20% إضافية' : 'Save 20% Extra'}</p>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">TECHNOVA20</p>
          </div>
        </div>

        {/* Deals Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {t('todaysDeals')} ({deals.length} {t('items')})
          </h2>
          <Link to="/" className="text-xs font-bold text-blue-700 hover:underline">
            {isRTL ? 'عرض جميع المنتجات ←' : 'View All Catalog Products →'}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
