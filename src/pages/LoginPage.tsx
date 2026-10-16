import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Footer } from '../components/common/Footer';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        if (email.toLowerCase() === 'admin@technova.com') {
          navigate('/admin');
        } else {
          navigate(redirectPath);
        }
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setError('An unexpected error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F4F6] text-slate-900 font-sans">
      {/* Top minimal header */}
      <header className="bg-[#0F172A] py-3.5 px-6 border-b border-slate-800 flex items-center justify-between">
        <Link to="/" className="inline-flex items-baseline gap-1 group">
          <span className="text-2xl font-black tracking-tight text-white">TechNova</span>
          <span className="w-2 h-2 rounded-full bg-[#FF9900] inline-block mb-1"></span>
        </Link>

        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-xs font-bold text-amber-400 font-mono border border-slate-700 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">translate</span>
          <span>{language === 'en' ? 'AR' : 'EN'}</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="max-w-md w-full space-y-6">
          
          {/* Main Login Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-7 shadow-xs">
            <h1 className="text-xl font-bold text-gray-900 mb-5">{t('signInTitle')}</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('emailAddress')}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-gray-700">{t('password')}</label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-blue-700 hover:underline">
                    {t('forgotPassword')}
                  </a>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-sharp w-full py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isLoading ? t('verifyingCredentials') : t('signInButton')}
              </button>

              <div className="text-[11px] text-gray-500 leading-relaxed pt-2">
                {t('termsNotice')}
              </div>
            </form>
          </div>

          {/* New Customer Prompt */}
          <div className="text-center space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#F3F4F6] px-3 text-gray-500 font-medium">{t('newCustomer')}</span>
              </div>
            </div>

            <Link
              to="/register"
              className="btn-sharp block w-full py-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 font-semibold text-xs shadow-2xs text-center"
            >
              {t('createCustomerButton')}
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
