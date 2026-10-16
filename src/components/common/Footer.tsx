import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { isRTL } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0F172A] text-gray-300 text-xs border-t border-slate-800 mt-auto">
      {/* Back to top banner */}
      <button
        type="button"
        onClick={scrollToTop}
        className="w-full py-3 bg-[#1E293B] hover:bg-slate-700 text-center font-semibold text-white transition block cursor-pointer"
      >
        {isRTL ? 'العودة إلى أعلى الصفحة' : 'Back to top'}
      </button>

      {/* Footer link columns */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
        <div>
          <h4 className="font-bold text-white text-sm mb-3">
            {isRTL ? 'تعرف علينا' : 'Get to Know Us'}
          </h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li><a href="#about" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'وظائف في تيك نوفا' : 'Careers at TechNova'}</a></li>
            <li><a href="#blog" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'مدونة تيك نوفا المؤسسية' : 'TechNova Corporate Blog'}</a></li>
            <li><a href="#enterprise" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'عن حلول المؤسسات' : 'About TechNova Enterprise'}</a></li>
            <li><a href="#investors" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'علاقات المستثمرين' : 'Investor Relations'}</a></li>
            <li><a href="#labs" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'مختبرات العتاد المتقدم' : 'TechNova Hardware Labs'}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">
            {isRTL ? 'اعمل معنا' : 'Make Money with Us'}
          </h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li><a href="#marketplace" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'البيع في سوق تيك نوفا' : 'Sell on TechNova Marketplace'}</a></li>
            <li><a href="#b2b" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'التوريد لقطاع الأعمال' : 'Supply to TechNova Business'}</a></li>
            <li><a href="#affiliate" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'برنامج الشركاء التابعين' : 'Affiliate Partner Network'}</a></li>
            <li><a href="#fulfillment" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'الخدمات اللوجستية (FBN)' : 'Fulfillment by TechNova (FBN)'}</a></li>
            <li><a href="#ads" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'إعلانات الشركات' : 'Advertise Your Enterprise Products'}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">
            {isRTL ? 'الدفع والائتمان' : 'Payment & Credit'}
          </h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li><a href="#card" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'بطاقة تيك نوفا للشركات' : 'TechNova Corporate Card'}</a></li>
            <li><a href="#net30" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'تسهيلات Net-30 الائتمانية' : 'Net-30 Enterprise Credit Lines'}</a></li>
            <li><a href="#volume" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'حسابات الشراء بالجملة' : 'Volume Purchasing Accounts'}</a></li>
            <li><a href="#rewards" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'برنامج مكافآت التوريد' : 'Shop with Rewards Points'}</a></li>
            <li><a href="#tax" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'الإعفاءات الضريبية للمؤسسات' : 'Corporate Tax Exemptions'}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white text-sm mb-3">
            {isRTL ? 'المساعدة والدعم' : 'Let Us Help You'}
          </h4>
          <ul className="space-y-2 text-gray-400 text-xs">
            <li><Link to="/orders" className="hover:underline hover:text-white">{isRTL ? 'حسابك في تيك نوفا' : 'Your TechNova Account'}</Link></li>
            <li><Link to="/orders" className="hover:underline hover:text-white">{isRTL ? 'تتبع الشحنات والطلبات' : 'Track Orders & Shipments'}</Link></li>
            <li><a href="#returns" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'سياسات الاستبدال والإرجاع' : 'Return Policies & Replacements'}</a></li>
            <li><a href="#warranty" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'الضمانات التجارية المعتمدة' : 'Commercial Hardware Warranties'}</a></li>
            <li><a href="#help" onClick={(e) => e.preventDefault()} className="hover:underline hover:text-white">{isRTL ? 'مركز المساعدة على مدار الساعة' : '24/7 Enterprise Help Center'}</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom sub-footer */}
      <div className="border-t border-slate-800 py-6 bg-[#0a0f1d]">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-white tracking-tight">TechNova</span>
            <span className="text-slate-600">|</span>
            <span className="text-gray-400 text-xs">
              {isRTL ? 'التوريد العالمي للعتاد ومحطات العمل للشركات' : 'Global Enterprise Hardware Supply'}
            </span>
          </div>
          <p className="text-gray-500 text-xs text-center md:text-right">
            © 2025 TechNova Retail & Infrastructure Inc. All rights reserved. Strict Fortune 500 Enterprise E-Commerce Specifications.
          </p>
        </div>
      </div>
    </footer>
  );
};
