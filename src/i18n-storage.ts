// src/lib/i18n-storage.ts
import { LanguageCode, defaultLanguage } from '@/i18n-config';

const LANGUAGE_STORAGE_KEY = 'sagainvo:language';

// Type guard to validate language codes
const isValidLanguageCode = (code: string): code is LanguageCode => {
  return ['en', 'zh-CN'].includes(code);
};

export const getStoredLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && isValidLanguageCode(stored)) {
      return stored;
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