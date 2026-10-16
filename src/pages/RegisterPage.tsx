import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Footer } from '../components/common/Footer';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name, email, password, company);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Failed to create customer account.');
      }
    } catch {
      setError('An unexpected error occurred during account registration.');
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
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-7 shadow-xs">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{t('createAccountTitle')}</h1>
            <p className="text-xs text-gray-500 mb-5">{t('createAccountSubtitle')}</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">warning</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('fullName')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('company')}</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Data Labs"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('emailAddress')} *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('password')} *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">{t('confirmPassword')}</label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF9900] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-sharp w-full py-2.5 bg-[#FF9900] hover:bg-[#E68A00] text-gray-950 font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                {isLoading ? t('creatingAccount') : t('createCustomerButton')}
              </button>

              <div className="pt-3 border-t border-gray-100 text-center">
                <span className="text-gray-600 text-xs">
                  {t('alreadyHaveAccount')}{' '}
                  <Link to="/login" className="text-blue-700 hover:underline font-bold">
                    {t('signInLink')}
                  </Link>
                </span>
              </div>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};
