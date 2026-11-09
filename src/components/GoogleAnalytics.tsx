import Script from "next/script";

/**
 * Google tag ของ GA4 property "Blue Rich" (G-BR2ZX6MQPQ)
 *
 * Google เสิร์ฟ Google tag ของ property ใหม่ผ่าน gtm.js?id=GTM-… — ID นี้ไม่ใช่
 * GTM container ที่เข้าไปแก้ได้ ค่า config ของ GA4 และ Enhanced measurement
 * (page_view รวมถึงตอนเปลี่ยนหน้าแบบ client-side, scroll, outbound click) อยู่ในตัว tag
 * แล้ว จึงไม่ต้องเรียก gtag('config') เอง
 *
 * event ที่เว็บส่งเองอยู่ใน lib/analytics.ts
 */
const GOOGLE_TAG_ID = "GTM-5F8MSDVN";

export function GoogleAnalytics() {
  return (
    <>
      <Script
        id="google-tag"
        src={`https://www.googletagmanager.com/gtm.js?id=${GOOGLE_TAG_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());`}
      </Script>
    </>
  );
}
