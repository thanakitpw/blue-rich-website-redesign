# Technical Audit — Blue Rich (11 ก.ย. 2569)

> วิธีตรวจ: `next build` ในเครื่องแล้ว crawl ทุก URL ใน sitemap (37 หน้า) + หน้าทดสอบอีก 6 หน้า ผ่าน `next start -p 3100` (ไฟล์ดิบ scratchpad `crawl.json`)
> production ยิง curl 12 ครั้ง (เว้น 1.2 วิ) เฉพาะสิ่งที่ต้องดูจากของจริง: redirect, URL เก่า, robots, sitemap, header
> Lighthouse 12 (mobile, simulated throttling) รันกับ build ในเครื่อง 3 หน้า เพราะ PageSpeed API โควตาสาธารณะเต็ม ("Quota exceeded … Queries per day")

## 1. Index / redirect

| ตรวจ | ผล | สถานะ |
|---|---|---|
| `site:blue-rich.com` ใน Google | คืน `/`, `/News-159`, `/News-161`, `/News-163`, `/News-164`, `/download.php?file=…pdf` — เป็น URL เว็บเดิมทั้งหมดยกเว้นหน้าแรก | 🚨 |
| ค้น "บลูริช แมททีเรียล โปรดักส์ สีกันไฟ" | อันดับ 2 = `/` (อันดับ 1 = Facebook ของ Infinite), อันดับ 5 = `/Cat-276` (URL เดิม) | ⚠️ |
| ค้น "รับรองสีกันไฟ วุฒิวิศวกร" | `/Cat-276` (เว็บเดิม) อยู่หน้าแรก — ตอนนี้ตอบ 404 | 🚨 |
| URL เดิม `/About-` `/Item-4` `/News-159` | **404** (88.9 KB หน้า not-found) | 🚨 |
| `/fire-paint` (route เก่าของเว็บใหม่) | 404 | ⚠️ |
| `http://blue-rich.com/` | 308 → `https://blue-rich.com/` → 308 → `https://www.blue-rich.com/` (2 hop) | 🌱 |
| `https://www.blue-rich.com/` | 200, `x-vercel-cache: HIT`, `x-nextjs-prerender: 1`, HSTS 2 ปี | ✅ |
| หน้า 404 | ตอบ status 404 จริง + `<meta name="robots" content="noindex">` + h1 "ไม่พบหน้าที่คุณกำลังมองหา" | ✅ |
| `/concept-b/index.html` | **200** (74 KB HTML ต้นแบบดีไซน์ เนื้อหาซ้ำหน้าแรก) มี Disallow ใน robots.txt แต่ยังเสิร์ฟอยู่ | ⚠️ |
| `/llms.txt` | 404 | 🌱 |

## 2. Canonical / duplicate

| ตรวจ | ผล |
|---|---|
| หน้าที่มี `<link rel="canonical">` | **5 / 37** — เฉพาะ landing page (`/neocoat`, `/engineering`, `/four-plus`, `/thinner`, `/fire-blanket`) |
| หน้าที่ไม่มี canonical | 32 หน้าใน `(site)/` รวมหน้าแรก สินค้า 12 บทความ 7 |
| `/products?cat=intumescent`, `/products?cat=thinner` | 200, title/description **เหมือน** `/products` ทุกตัวอักษร ไม่มี canonical → เนื้อหาซ้ำจาก query string (หมวดที่กรองได้ 7 ค่า = 7 URL ซ้ำ) |
| `/intumescent` vs `/neocoat` vs `/products/neocoat-intumescent-paint-s` | 3 หน้าเล่นคำ "สีกันไฟ" — HANDOFF แบ่งไว้แล้ว (LP = คำหมวด, สินค้า = คำรายรุ่น) แต่ยังไม่มี canonical และ LP ไม่มีลิงก์เข้าเลย |
| title ซ้ำ | 1 คู่ (`/products` กับ `?cat=`) นอกนั้นไม่ซ้ำ |

## 3. Structured data (JSON-LD)

| Type | มีที่ | ขาดที่ |
|---|---|---|
| `LocalBusiness` | ทุกหน้า (root layout) | `openingHours` เป็นข้อความไทย "จันทร์ – เสาร์ 08:00 – 17:00 น." (รูปแบบที่ schema.org รับคือ `Mo-Sa 08:00-17:00`), ไม่มี `geo`, `sameAs` (Facebook/LINE), `logo`, `priceRange`, `address` เป็น string ไม่ใช่ `PostalAddress` |
| `Product` | `/neocoat`, `/fire-blanket` (LP) | **หน้าสินค้าทั้ง 12** ไม่มี ทั้งที่มีชื่อ รูป แบรนด์ สเปก FAQ ครบ |
| `Service` | `/engineering` (LP) | `/fireproofing`, `/fireproofing/certification`, `/fireproofing/supervision` |
| `FAQPage` | LP 5 หน้า | หน้าสินค้า (มี FAQ รวม 45 ข้อ), `/fireproofing` (8 ข้อ), หน้าแรก (7 ข้อ) — หมายเหตุ FAQPage ไม่ได้ rich result แล้วตั้งแต่ พ.ค. 2569 ใส่เป็นสัญญาณให้ AI search |
| `Article` | ไม่มีเลย | บทความ 7 บท (มี `<time datetime>` ISO และ `og:type=article` แล้ว แค่ยังไม่ทำเป็น schema) |
| `BreadcrumbList` | ไม่มีเลย | 33 หน้าที่มี breadcrumb มองเห็น |
| `Organization` (แยกจาก LocalBusiness) | ไม่มี | ไม่จำเป็น ถ้าเติม `logo`/`sameAs` ใน LocalBusiness |

Schema coverage: หน้าที่มี JSON-LD ≥1 = 37/37 (100%) แต่ที่มี type ตรงกับเนื้อหาหน้า = 5/37 (14%)

## 4. Open Graph / LINE share

| ตรวจ | ผล |
|---|---|
| `og:title`, `og:description`, `og:image`, `twitter:card=summary_large_image` | มีทุกหน้า ✅ |
| `og:image` หน้าทั่วไป | `/assets/banner-fireproof.jpg` ไฟล์ดิบ 358 KB (ไม่ผ่าน next/image) ใช้ร่วมกัน 25 หน้า |
| `og:image` หน้าสินค้า | รูปสินค้า (PNG โปร่ง) — บน LINE พื้นหลังจะเป็นสีเทา |
| `og:type` หน้าสินค้า | หายไป (child `openGraph` ทับของ root ทั้งก้อน) |
| บทความ | `og:type=article` + `article:published_time` ✅ |

## 5. Sitemap / robots

| ตรวจ | ผล |
|---|---|
| `robots.txt` | มี · Disallow `/admin`, `/api/`, `/concept-b/`, `/concept-c/`, `/concept-d/` · ชี้ sitemap ✅ |
| `sitemap.xml` | 37 URL ตอบ 200 ทั้งหมด · `lastmod` มีเฉพาะบทความ 7 URL (วันที่ 2567) อีก 30 URL ไม่มี · priority 1/0.9/0.8/0.7/0.5 |
| URL หลุด sitemap | ไม่มี (สร้างจากเมนูใน CMS + สินค้า + บทความ) |
| หน้าที่อยู่ใน sitemap แต่ไม่มีลิงก์ภายในเข้าเลย (orphan) | **5 หน้า LP** — ไม่มีหน้าไหนใน 37 หน้าลิงก์ไป `/neocoat` `/thinner` `/engineering` `/four-plus` `/fire-blanket` |

## 6. Core Web Vitals (Lighthouse lab, mobile, build ในเครื่อง — ไม่ใช่ field data)

| หน้า | Perf | LCP | CLS | TBT | FCP | น้ำหนักรวม |
|---|---|---|---|---|---|---|
| `/` | 73 | 6.3 s | 0 | 210 ms | 1.2 s | 925 KB |
| `/products/neocoat-intumescent-paint-s` | 87 | 4.0 s | 0 | 20 ms | 1.2 s | 562 KB |
| `/news/ministerial-regulation-2567` | 89 | 3.7 s | 0 | 20 ms | 1.2 s | 603 KB |

- LCP element หน้าแรก = รูปสไลด์แรก (`banner-walkway.jpg` ผ่าน next/image 58 KB) แต่สไลด์ 2–3 (`banner-2.jpg` 61 KB, `banner-1.jpg` 45 KB) โหลดพร้อมกันตั้งแต่แรก
- LCP element หน้าสินค้า = แบนเนอร์ hero ที่ `alt=""`
- ฟอนต์ Prompt โหลด **10 ไฟล์ 87 KB** (ประกาศ 2 ตัวแปร รวม 7 น้ำหนัก: 300/400/500/600 + 500/600/700)
- JS 15 ไฟล์ 238 KB · unused JS ~85–89 KB ทุกหน้า · legacy JS 13 KB
- HTML หน้าแรก 312 KB (RSC payload ของ 12 section) หน้าสินค้า 211 KB
- TTFB production 0.12–0.49 s (cache HIT) ✅ · Accessibility 92–93 (ตก `color-contrast`, `target-size`) · Best Practices 100 · Lighthouse SEO 100
- ต้องการ field data (CrUX) จาก Search Console → รอสิทธิ์

## 7. รูปภาพ

| ตรวจ | ผล |
|---|---|
| ใช้ `next/image` | 44 / 46 รูปบนหน้าแรก (2 ที่ไม่ใช่คือ SVG inline) ทุกหน้าใน `(site)/` ใช้ครบ |
| format | AVIF/WebP ผ่าน `images.formats` ✅ lazy ทุกรูปที่ไม่ใช่ hero ✅ |
| ไฟล์ต้นฉบับใหญ่สุดใน `public/assets` | `banner-walkway.jpg` 706 KB, `news-rust.jpg` 702 KB, `about-steel-structure.jpg` 667 KB, `banner-2.jpg` 622 KB (รวม 16 MB / 37 ไฟล์) — ถูกย่อตอนเสิร์ฟ แต่ og:image ไม่ผ่านการย่อ |
| `alt=""` | หน้าแรก 18/46 · หน้าสินค้า 1–6 · บทความ 4/6 (รูปการ์ดบทความอื่น + โลโก้) · ที่ควรมี alt แต่ว่าง: โลโก้ header, รูปสินค้าในการ์ดหน้าแรก (`neocoat-paint-s.png`, `neocoat-paint-w.webp`, `service-certification.jpg`), แบนเนอร์ hero หน้าสินค้า |
| `public/docs` | PDF 61 MB (ผลทดสอบ, TDS, MSDS) ไม่ได้อยู่ใน git-lfs — ไม่กระทบ SEO แต่ควรรู้ |

## 8. อื่น ๆ

- `<html lang="th">` ✅ · viewport ✅ · HSTS ✅ · ไม่มี mixed content
- ไม่มี Google Analytics / GTM / Vercel Analytics ในโค้ดเลย (grep `gtag|googletagmanager|@vercel/analytics` = 0)
- ไม่มีหน้านโยบายความเป็นส่วนตัว (PDPA) ทั้งที่ฟอร์มติดต่อ + ฟอร์มขอใบเสนอราคา 5 LP เก็บชื่อ เบอร์ อีเมล
- Middleware (`proxy.ts`) ครอบเฉพาะ `/admin` `/api/admin` ไม่กระทบหน้าสาธารณะ ✅
- `x-nextjs-stale-time: 300` — หน้าสาธารณะ static ทั้งหมด revalidate ตอนกดเผยแพร่ใน CMS
