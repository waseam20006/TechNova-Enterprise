import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useLanguage } from './LanguageContext';

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string | number) => void;
  toggleCompare: (product: Product) => boolean;
  isInCompare: (productId: string | number) => boolean;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  openCompareModal: () => void;
  closeCompareModal: () => void;
  toastMessage: string | null;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);
const COMPARE_STORAGE_KEY = 'technova_compare_list';

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t } = useLanguage();
  const [compareList, setCompareList] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(COMPARE_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compareList));
    } catch (e) {
      console.error(e);
    }
  }, [compareList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const isInCompare = (productId: string | number) => {
    return compareList.some((p) => String(p.id) === String(productId));
  };

  const addToCompare = (product: Product): boolean => {
    if (isInCompare(product.id)) {
      return true;
    }
    if (compareList.length >= 3) {
      showToast(t('maxCompareWarning'));
      return false;
    }
    setCompareList((prev) => [...prev, product]);
    return true;
  };

  const removeFromCompare = (productId: string | number) => {
    setCompareList((prev) => prev.filter((p) => String(p.id) !== String(productId)));
  };

  const toggleCompare = (product: Product): boolean => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      return false;
    } else {
      return addToCompare(product);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const openCompareModal = () => {
    if (compareList.length === 0) {
      showToast(t('noProductsInCompare'));
      return;
    }
    setIsCompareModalOpen(true);
  };

  const closeCompareModal = () => {
    setIsCompareModalOpen(false);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        isCompareModalOpen,
        openCompareModal,
        closeCompareModal,
        toastMessage,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
