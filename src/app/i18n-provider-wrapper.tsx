// src/app/i18n-provider-wrapper.tsx
import { ReactNode } from 'react';
import { I18nProvider } from '@/i18n/context';
import { getStoredLanguageServerSafe } from '@/lib/i18n-storage';
import { headers } from 'next/headers';

interface I18nProviderWrapperProps {
  children: ReactNode;
}

// Server component that wraps the I18nProvider
export default async function I18nProviderWrapper({ children }: I18nProviderWrapperProps) {
  // Get the request headers to pass to the language detection function
  const requestHeaders = headers();

  // Convert headers to a format that getStoredLanguageServerSafe expects
  const initialLocale = getStoredLanguageServerSafe(requestHeaders);

  return (
    <I18nProvider initialLocale={initialLocale}>
      {children}
    </I18nProvider>
  );
}