// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LanaFleur — باقات ورد وهدايا زهرية | توصيل بالمغرب",
  description: "LanaFleur — باقات ورد مخصصة، تزيين الأعراس والمناسبات، هدايا زهرية وتوصيل سريع بالمغرب. اطلب الآن عبر واتساب.",
  keywords: ["ورد", "باقات", "أعراس", "هدايا", "توصيل ورد", "flower shop Morocco", "LanaFleur"],
  openGraph: {
    title: "LanaFleur — Fleurs & Art Floral",
    description: "Bouquets sur mesure, décoration événementielle et livraison florale au Maroc.",
    url: "https://lanafleur.com",
    siteName: "LanaFleur",
    locale: "ar_MA",
    type: "website",
  },
  robots: "index, follow",
  metadataBase: new URL("https://lanafleur.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Jost:wght@300;400;500&family=Cairo:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        {/* Structured data لـ Google (يساعد فالظهور فنتائج البحث) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FloristShop",
              name: "LanaFleur",
              url: "https://lanafleur.com",
              description: "متجر ورد وهدايا زهرية بالمغرب — باقات مخصصة، أعراس، توصيل سريع",
              address: {
                "@type": "PostalAddress",
                addressCountry: "MA",
              },
            }),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}