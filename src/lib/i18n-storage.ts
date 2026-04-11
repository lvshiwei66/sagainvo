// src/lib/i18n-storage.ts
import { LanguageCode, defaultLanguage, supportedLanguages } from '@/i18n-config';

// Cookie key used by middleware and server-side code
export const LANGUAGE_COOKIE_KEY = 'NEXT_LOCALE';

// LocalStorage key for client-side persistence
const LANGUAGE_STORAGE_KEY = 'sagainvo:language';

/**
 * Parse Accept-Language header and return the best matching supported language
 */
const parseAcceptLanguage = (acceptLanguage: string | null): LanguageCode => {
  if (!acceptLanguage) return defaultLanguage;

  // Parse header like "zh-CN,zh;q=0.9,en;q=0.8"
  const languages = acceptLanguage.split(',').map(lang => {
    const [code, q = 'q=1'] = lang.trim().split(';');
    const quality = parseFloat(q.replace('q=', ''));
    return { code: code.toLowerCase(), quality };
  });

  // Find best matching supported language
  for (const { code } of languages.sort((a, b) => b.quality - a.quality)) {
    // Exact match
    const exactMatch = supportedLanguages.find(lang => lang === code);
    if (exactMatch) {
      return exactMatch as LanguageCode;
    }
    // Prefix match (e.g., "zh" matches "zh-CN")
    const prefixMatch = supportedLanguages.find(lang => lang.startsWith(code));
    if (prefixMatch) return prefixMatch as LanguageCode;
  }

  return defaultLanguage;
};

/**
 * Get language from request headers (server-side)
 * Priority: Cookie > Accept-Language > Default
 */
export const getStoredLanguageServerSafe = (request?: Request | Headers): LanguageCode => {
  try {
    // Get headers from Request or Headers object
    const headers = request instanceof Request ? request.headers : request;

    if (headers) {
      // Priority 1: Check cookie
      const cookieHeader = headers.get('cookie');
      if (cookieHeader) {
        const cookies = Object.fromEntries(
          cookieHeader.split(';').map(cookie => {
            const [key, value] = cookie.trim().split('=');
            return [key, decodeURIComponent(value)];
          })
        );
        const cookieLang = cookies[LANGUAGE_COOKIE_KEY];
        if (cookieLang && supportedLanguages.includes(cookieLang as LanguageCode)) {
          return cookieLang as LanguageCode;
        }
      }

      // Priority 2: Check Accept-Language header
      const acceptLanguage = headers.get('accept-language');
      if (acceptLanguage) {
        return parseAcceptLanguage(acceptLanguage);
      }
    }
  } catch (error) {
    console.warn('Could not parse request headers:', error);
  }

  return defaultLanguage;
};

// Get stored language from localStorage (client-side only)
export const getStoredLanguage = (): LanguageCode => {
  if (typeof window === 'undefined') {
    return defaultLanguage;
  }

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && supportedLanguages.includes(stored as LanguageCode)) {
      return stored as LanguageCode;
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