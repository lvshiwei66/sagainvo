// src/i18n/context.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LanguageCode, getBrowserLocale } from '@/i18n-config';
import { loadTranslations, flattenTranslations, translate } from './utils';
import { getStoredLanguage, setStoredLanguage } from '@/lib/i18n-storage';

interface I18nContextType {
  locale: LanguageCode;
  setLocale: (locale: LanguageCode) => void;
  tCommon: (key: string, params?: Record<string, string | number>) => string;
  tInvoice: (key: string, params?: Record<string, string | number>) => string;
  direction: 'ltr' | 'rtl';
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
  initialLocale?: LanguageCode;
}

export const I18nProvider = ({ children, initialLocale }: I18nProviderProps) => {
  // Initialize locale from localStorage on client side, fallback to initialLocale or browser detection
  const [locale, setLocaleState] = useState<LanguageCode>(() => {
    // On server side or if localStorage is not available, use initialLocale or browser detection
    if (typeof window === 'undefined') {
      return initialLocale || getBrowserLocale();
    }
    // On client side, always read from localStorage first
    return getStoredLanguage();
  });

  const [translations, setTranslations] = useState({
    common: {} as Record<string, string>,
    invoice: {} as Record<string, string>
  });

  // Load translations when locale changes
  useEffect(() => {
    const loadAndSetTranslations = async () => {
      const rawTranslations = await loadTranslations(locale);
      setTranslations({
        common: flattenTranslations(rawTranslations.common),
        invoice: flattenTranslations(rawTranslations.invoice)
      });

      // Update stored language
      setStoredLanguage(locale);
    };

    loadAndSetTranslations();
  }, [locale]);

  const setLocale = (newLocale: LanguageCode) => {
    setLocaleState(newLocale);
    // setStoredLanguage is called in the useEffect above when locale changes
  };

  const tCommon = (key: string, params?: Record<string, string | number>) => {
    return translate(translations.common, key, params);
  };

  const tInvoice = (key: string, params?: Record<string, string | number>) => {
    return translate(translations.invoice, key, params);
  };

  const direction: 'ltr' | 'rtl' = 'ltr'; // Currently only supporting LTR

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        tCommon,
        tInvoice,
        direction
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};