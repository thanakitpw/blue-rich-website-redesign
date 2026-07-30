import type { Metadata } from "next";
import { Anuphan, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";
import { site } from "@/data/site";

const display = Anuphan({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.shortName} | สีกันไฟ สีทนไฟ โครงสร้างเหล็ก รับรองโดยวุฒิวิศวกร`,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  keywords: [
    "สีกันไฟ",
    "สีทนไฟ",
    "Intumescent Paint",
    "Neocoat",
    "สีรองพื้นกันสนิม",
    "ผ้ากันไฟ",
    "น้ำมันสน",
    "ทินเนอร์",
    "ASTM E-119",
    "ISO 834",
    "วุฒิวิศวกร",
  ],
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: site.shortName,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: ["/assets/banner-fireproof.jpg"],
  },
  icons: { icon: "/assets/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.name,
    alternateName: site.nameEn,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phones,
    image: `${site.url}/assets/logo.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "288/60 ถนนเลียบคลองสอง แขวงบางชัน",
      addressLocality: "เขตคลองสามวา",
      addressRegion: "กรุงเทพมหานคร",
      postalCode: "10510",
      addressCountry: "TH",
    },
  };

  return (
    <html lang="th" className={`${display.variable} ${body.variable}`}>
      <head>
        <noscript>
          {/* Scroll-reveal is JS-driven; keep everything visible without it. */}
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
        >
          ข้ามไปยังเนื้อหาหลัก
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
