// src/i18n-config/fonts.ts
import { Inter } from 'next/font/google';
import { LanguageCode } from './index';

// English font (default)
export const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
});

// We'll use system font stack for Chinese characters in CSS
// This keeps bundle size small while supporting CJK characters
export const getFontClass = (locale: LanguageCode): string => {
  switch (locale) {
    case 'zh-CN':
      return 'font-sans-zh'; // Defined in globals.css
    default:
      return interFont.className;
  }
};