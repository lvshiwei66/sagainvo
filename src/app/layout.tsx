import type { Metadata } from "next";
import { I18nProvider } from "@/i18n/context";
import { getStoredLanguageServerSafe } from "@/lib/i18n-storage";
import { headers } from 'next/headers';
import "./globals.css";

const metadata: Metadata = {
  title: "Saga Invoice - Professional Invoice Generator",
  description: "Create professional invoices in 30 seconds. Free, no signup required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use server-safe language detection to avoid hydration mismatch
  // Get headers to pass to language detection function
  const requestHeaders = headers();

  // Client will sync with localStorage after mount
  const initialLocale = getStoredLanguageServerSafe(requestHeaders);

  return (
    <html lang={initialLocale} suppressHydrationWarning>
      <body>
        <I18nProvider initialLocale={initialLocale}>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
