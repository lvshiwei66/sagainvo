// src/i18n-config/index.ts
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', dir: 'ltr' },
] as const;

export type LanguageCode = typeof languages[number]['code'];
export type Direction = 'ltr' | 'rtl';

export const defaultLanguage: LanguageCode = 'en';

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