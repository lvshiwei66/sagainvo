import type { Metadata } from "next";
import { getBrowserLocale } from "@/i18n-config";
import { I18nProvider } from "@/i18n/context";
import { getStoredLanguage } from "@/lib/i18n-storage";
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
  // Determine initial locale - try stored, then browser detection, then default to 'en'
  const initialLocale = getStoredLanguage();

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
