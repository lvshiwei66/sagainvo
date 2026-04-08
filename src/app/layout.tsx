import type { Metadata } from "next";
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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
