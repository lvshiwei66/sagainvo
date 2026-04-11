// src/i18n/utils.ts
import { LanguageCode } from '@/i18n-config';

// Import translation files statically - this bundles translations with the app
import enCommon from '@/locales/en/common.json';
import enInvoice from '@/locales/en/invoice.json';
import zhCommon from '@/locales/zh-CN/common.json';
import zhInvoice from '@/locales/zh-CN/invoice.json';

// Cache for translations to avoid re-importing
const translationCache: Record<LanguageCode, { common: Record<string, any>; invoice: Record<string, any> }> = {
  'en': { common: enCommon, invoice: enInvoice },
  'zh-CN': { common: zhCommon, invoice: zhInvoice },
};

/**
 * Load translation files - uses static imports for reliability
 * This function works in both server and client components
 */
export const loadTranslations = async (locale: LanguageCode): Promise<{
  common: Record<string, any>;
  invoice: Record<string, any>;
}> => {
  // Return cached translations immediately
  return translationCache[locale] || translationCache['en'];
};

// Flatten nested object for easier lookup
export const flattenTranslations = (obj: any, prefix: string = ''): Record<string, string> => {
  const flattened: Record<string, string> = {};

  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      flattened[newKey] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(flattened, flattenTranslations(value, newKey));
    }
  }

  return flattened;
};

// Translation function
export const translate = (
  translations: Record<string, string>,
  key: string,
  params?: Record<string, string | number>
): string => {
  const value = translations[key] || key;

  if (params) {
    return Object.keys(params).reduce((result, paramKey) => {
      return result.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
    }, value);
  }

  return value;
};
