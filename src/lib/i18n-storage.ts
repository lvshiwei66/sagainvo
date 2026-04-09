// src/lib/i18n-storage.ts
import { LanguageCode, defaultLanguage } from '@/i18n-config';

const LANGUAGE_STORAGE_KEY = 'sagainvo:language';

export const getStoredLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored) {
      // Validate that the stored language is supported
      const supportedLanguages = ['en', 'zh-CN'] as const;
      if (supportedLanguages.includes(stored as LanguageCode)) {
        return stored as LanguageCode;
      }
    }

    // Fall back to browser detection
    const browserLocale = navigator.language;
    const languageMap: Record<string, LanguageCode> = {
      'zh': 'zh-CN',
      'zh-CN': 'zh-CN',
      'zh-SG': 'zh-CN',
    };

    return languageMap[browserLocale] || defaultLanguage;
  } catch (error) {
    console.warn('Could not access localStorage, using default language:', error);
    return defaultLanguage;
  }
};

export const setStoredLanguage = (lang: LanguageCode): void => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Could not write to localStorage:', error);
    }
  }
};