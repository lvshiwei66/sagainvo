// src/app/i18n-provider-wrapper.tsx
'use server';

import { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/context';
import { cookies } from 'next/headers';
import { getStoredLanguageServerSafe } from '@/lib/i18n-storage';

interface I18nProviderWrapperProps {
  children: ReactNode;
}

// Server component that wraps the I18nProvider
export default async function I18nProviderWrapper({ children }: I18nProviderWrapperProps) {
  // Get the user's language preference server-side
  // This might involve checking cookies, headers, etc.
  const initialLocale = getStoredLanguageServerSafe();

  return (
    <I18nProvider initialLocale={initialLocale}>
      {children}
    </I18nProvider>
  );
}