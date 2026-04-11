// src/i18n-config/index.ts
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', dir: 'ltr' },
] as const;

export type LanguageCode = typeof languages[number]['code'];
export type Direction = 'ltr' | 'rtl';

export const defaultLanguage: LanguageCode = 'en';

// Array of supported language codes for validation
export const supportedLanguages = languages.map(lang => lang.code) as readonly string[];

/**
 * Parse Accept-Language header and return the best matching supported language
 */
export const parseAcceptLanguage = (acceptLanguage: string | null): LanguageCode => {
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

export const languageMap: Record<string, LanguageCode> = {
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'zh-SG': 'zh-CN',
};

export const getBrowserLocale = (): LanguageCode => {
  if (typeof window !== 'undefined') {
    const browserLocale = navigator.language;
    return languageMap[browserLocale] || defaultLanguage;
  }
  return defaultLanguage;
};