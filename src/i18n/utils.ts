// src/i18n/utils.ts
import { LanguageCode } from '@/i18n-config';

// Helper to load translation files dynamically from public directory
// This function is designed to work in client-side components
export const loadTranslations = async (locale: LanguageCode): Promise<{
  common: Record<string, string>;
  invoice: Record<string, string>;
}> => {
  try {
    // Client side: fetch from public directory
    const [commonResponse, invoiceResponse] = await Promise.all([
      fetch(`/locales/${locale}/common.json`).then(r => r.json()),
      fetch(`/locales/${locale}/invoice.json`).then(r => r.json())
    ]);

    return {
      common: commonResponse,
      invoice: invoiceResponse
    };
  } catch (error) {
    console.error(`Failed to load translations for ${locale}:`, error);
    // Fallback to English if locale-specific files are missing
    if (locale !== 'en') {
      const fallback = await loadTranslations('en');
      return fallback;
    }
    // If English is also missing, return empty objects
    return {
      common: {},
      invoice: {}
    };
  }
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
