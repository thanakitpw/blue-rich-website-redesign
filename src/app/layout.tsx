import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { SiteProvider } from "@/components/SiteProvider";
import { getNav, getSiteInfo } from "@/lib/cms/content";

/* Concept B is set entirely in Prompt — one family for both roles. */
const display = Prompt({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteInfo();
  return {
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
    // Icons come from the app/ file convention (favicon.ico, icon.png,
    // apple-icon.png) — all generated from the Blue Rich logo.
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, nav] = await Promise.all([getSiteInfo(), getNav()]);

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
    /* ที่อยู่เป็นข้อความบรรทัดเดียวตามที่ลูกค้ากรอกในหลังบ้าน ไม่ได้แตกเป็น
       PostalAddress รายฟิลด์ เพราะถ้าแตกไว้แล้วลูกค้าแก้ที่อยู่ ข้อมูลสองชุดนี้
       จะไม่ตรงกันโดยไม่มีใครรู้ — schema.org รับ address เป็น Text อยู่แล้ว */
    address: site.address,
    openingHours: site.hours,
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
        {/*
         * Chrome (header / footer / floating actions) lives in the (site) group
         * layout — the landing pages sit outside that group on purpose and
         * render without it.
         */}
        <SiteProvider site={site} nav={nav}>
          {children}
        </SiteProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
