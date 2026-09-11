# Action Priorities — Blue Rich (11 ก.ย. 2569)

> ทุกข้อมีหลักฐานที่วัดได้ (อ้างไฟล์ audit) + วิธีแก้ · Effort เป็นชั่วโมงทำงานโดยประมาณ · Owner: dev = แก้โค้ด, content = เขียน, client = ต้องได้จากลูกค้า
> สถานะติ๊กได้อยู่ใน artifact "แผน SEO Blue Rich" (ไฟล์นี้เป็นสำเนาอ่านอย่างเดียว)

| Priority | เกณฑ์ |
|---|---|
| **P0** | ทำให้ Google หาหน้าไม่เจอ / เสียอันดับที่เคยมี / วัดผลไม่ได้ — ทำใน 1–3 วัน |
| **P1** | กระทบอันดับสูง แก้ได้ใน 1–2 สัปดาห์ |
| **P2** | กระทบปานกลาง หรือ quick win |
| **P3** | ทำเมื่อมีเวลา |

## 🚨 P0

### P0-1 URL เว็บเดิม 37 URL ตอบ 404 ทั้งที่ Google ยังเก็บและยังติดอันดับ
- **หลักฐาน**: `site:blue-rich.com` คืน `/News-159/161/163/164`, `/download.php?…`; "รับรองสีกันไฟ วุฒิวิศวกร" หน้าแรกมี `/Cat-276`; curl production `/About-` `/Item-4` `/News-159` = 404 (`technical-audit.md §1`, `redirect-map.md`)
- **แก้**: `redirects()` ใน `next.config.ts` ตาม `redirect-map.md` (36 URL + regex เลขซ้ำ) permanent · ทดสอบ 5 URL ครั้งเดียว · Request indexing ใน GSC
- Effort: Low (2 ชม.) · Impact: High · Owner: dev

### P0-2 ไม่มีระบบวัดผล (Search Console / GA4)
- **หลักฐาน**: grep `gtag|googletagmanager|@vercel/analytics` = 0 ไฟล์ · สถานะ GSC ไม่ทราบ (client-brief ช่องว่าง)
- **แก้**: ยืนยัน GSC แบบ Domain property (DNS TXT ที่ผู้ดูแลโดเมน) → ส่ง sitemap → บันทึก baseline · GA4 ผ่าน `@next/third-parties/google` (`GoogleAnalytics`) + event จาก `data-cta` ที่มีอยู่แล้วบนทุกปุ่ม · ติด Vercel Analytics ถ้าแพ็กเกจรองรับ
- Effort: Low (2 ชม. + รอสิทธิ์) · Impact: High (ทุกข้อหลังจากนี้วัดไม่ได้ถ้าไม่มี) · Owner: dev + client

## ⚠️ P1

### P1-1 ไม่มี canonical บน 32 / 37 หน้า และ `/products?cat=` ซ้ำหน้า `/products`
- **หลักฐาน**: crawl พบ canonical เฉพาะ LP 5 หน้า · `/products?cat=intumescent` title/description เหมือน `/products` (`technical-audit.md §2`)
- **แก้**: helper `pageMeta(path)` ใส่ `alternates.canonical` ทุก `generateMetadata` ใน `(site)/` · `/products` canonical = `/products` ไม่ว่าจะมี `?cat` · ให้ `?cat` เป็น `noindex,follow` หรือเปลี่ยนเป็น anchor/route จริง
- Effort: Low (3 ชม.) · Impact: High · Owner: dev

### P1-2 Structured data ไม่ตรงกับเนื้อหาหน้า (Product 0/12, Article 0/7, BreadcrumbList 0/33, Service 0/3)
- **หลักฐาน**: `technical-audit.md §3` · LocalBusiness `openingHours` ผิดรูปแบบ
- **แก้**: component `JsonLd` กลาง · Product (name, image, brand Neocoat/อินทนิล/Four Plus, sku ถ้ามี, offers `priceSpecification` ไม่ระบุราคา → ใช้ `availability` + `seller`), Article (headline, datePublished จาก `date_iso`, author = Organization, image), BreadcrumbList จาก props ของ `Breadcrumb`, Service ×3, FAQPage จาก FAQ ที่มีอยู่ (60 ข้อ) · แก้ LocalBusiness: `openingHoursSpecification`, `geo` (ต้องได้พิกัดจากลูกค้า), `sameAs`, `logo`, `address` เป็น `PostalAddress`
- Effort: Med (8 ชม.) · Impact: High · Owner: dev

### P1-3 คำอธิบายสินค้า 12 หน้าเป็นข้อความผู้ผลิตที่ซ้ำกับตัวแทนอย่างน้อย 5 โดเมน
- **หลักฐาน**: ค้นประโยคจาก `products.ts:174` แบบใส่เครื่องหมายคำพูด → beelievesourcing, uoneplusgroup, infinitematerialtech, laquatech, blue-rich.com/Item-14 (`content-audit.md §2`)
- **แก้**: เขียน `tagline` + `description` ใหม่ทั้ง 12 สินค้าในมุม Blue Rich (งานที่ใช้, คำถามที่ลูกค้าถาม, เอกสารที่แนบ, การจัดส่ง) 150–250 คำ/สินค้า ผ่าน lint voice · แก้ใน CMS `/admin/products` แล้วเผยแพร่
- Effort: Med (10 ชม.) · Impact: High · Owner: content

### P1-4 Landing page 5 หน้าเป็น orphan (0 ลิงก์เข้า) และคำค้นซ้อนกับหน้าเมนู
- **หลักฐาน**: ไม่มีหน้าใดใน 37 หน้าลิงก์ไป LP · LP ลิงก์ออก 0–8 · ตารางชนกัน 5 กลุ่ม (`on-page-audit.md §5`, `content-audit.md §3`)
- **แก้**: ตัดสินใจก่อน — (ก) LP ติดอันดับเองตามที่ลูกค้าขอ → เพิ่มลิงก์เข้าจากหน้าหมวด/สินค้าที่เกี่ยว 2–3 จุด (เช่น การ์ด "ดูภาพรวมสีกันไฟโครงสร้างเหล็ก" บน `/intumescent` และหน้าสินค้า Neocoat) + ให้ LP มีลิงก์ออกไปหน้าสินค้า/บริการอย่างน้อย 3 + แบ่ง title/h1 ตามตาราง · (ข) LP ใช้ยิงแอดอย่างเดียว → กลับไป `noindex` + ถอดจาก sitemap
- Effort: Low (3 ชม.) · Impact: High · Owner: SEO + ผู้ดูแลตัดสิน

### P1-5 บทความเดิมบาง ไม่มีหัวข้อ ไม่มีลิงก์ และโมเดลข้อมูลรองรับบทความยาวไม่ได้
- **หลักฐาน**: 7 บท 3–6 ย่อหน้า (~180–330 คำ) h2 ในเนื้อหา 0, ลิงก์ในเนื้อหา → สินค้า 0, Article schema 0 · `articles.body jsonb` เป็น `string[]` · 4/7 บทเป็น B2C (`content-audit.md §1`)
- **แก้**: เพิ่มคอลัมน์ `content_html text` ในตาราง `articles` (migration + snapshot function) · render HTML ใน `news/[slug]` เมื่อมี (fallback `body`) · ช่อง textarea ใน `/admin/articles` · ตัวแปลง `.md → HTML` 2 โหมด · ตัวเลขนี้เป็นฐานของบทความ 12 บท
- Effort: Med (8 ชม.) · Impact: High · Owner: dev

### P1-6 Title ยาวเกิน 8 หน้า / description ยาวเกิน 12 หน้า / title ไม่มี keyword 6 หน้า
- **หลักฐาน**: `on-page-audit.md §1–2` (ตารางเสนอ title ใหม่อยู่ในนั้น)
- **แก้**: LP 5 หน้า + `/paint` `/fireproofing` `/` แก้ใน `generateMetadata` · หน้าสินค้า 3 ตัวแก้ `tagline` ใน CMS · หน้านำทาง 6 หน้าแก้ใน `copy-pages`/metadata
- Effort: Low (2 ชม.) · Impact: Med · Owner: dev + content

## 📋 P2

### P2-1 ลิงก์ภายในระหว่างบทความ ↔ สินค้า = 0 ทั้งสองทาง
- **หลักฐาน**: `on-page-audit.md §5`
- **แก้**: บทความใหม่ทุกบท ≥3 ลิงก์เข้าสินค้า/บริการ (กฎข้อ 5) · หน้าสินค้าเพิ่มบล็อก "บทความที่เกี่ยวข้อง" 2–3 ลิงก์ (data field `relatedArticles` หรือ match ด้วย tag) · `/fireproofing` (หน้าหมวด) ลิงก์ไปสินค้า 0 → เพิ่ม
- Effort: Med (4 ชม. + ทำต่อบท) · Impact: Med · Owner: dev + content

### P2-2 ความเร็วหน้าแรก (LCP 6.3 s lab, perf 73)
- **หลักฐาน**: `technical-audit.md §6` — สไลด์ 3 รูปโหลดพร้อมกัน (164 KB), ฟอนต์ 10 ไฟล์ 87 KB, unused JS 85 KB, HTML 312 KB
- **แก้**: สไลด์ 2–3 `loading="lazy"` + `priority` เฉพาะรูปแรก · ลดน้ำหนักฟอนต์ Prompt เหลือ 400/500/600/700 ตัวแปรเดียว · ตรวจ section ที่เป็น client component โดยไม่จำเป็น · วัดซ้ำด้วย PSI เมื่อโควตาคืน
- Effort: Med (4 ชม.) · Impact: Med · Owner: dev

### P2-3 `/concept-b|c|d/*.html` ยังเสิร์ฟ 200 (เนื้อหาซ้ำหน้าแรก)
- **หลักฐาน**: curl `/concept-b/index.html` = 200, 74 KB · robots Disallow อย่างเดียวไม่กัน index ถ้ามีลิงก์จากที่อื่น
- **แก้**: ลบโฟลเดอร์ออกจาก `public/` (เก็บใน git history) หรือใส่ header `X-Robots-Tag: noindex` ผ่าน `headers()` ใน `next.config.ts`
- Effort: Low (0.5 ชม.) · Impact: Med · Owner: dev

### P2-4 NAP ขัดกันระหว่างเว็บใหม่กับเว็บเดิม/Google
- **หลักฐาน**: ที่อยู่ 288/60 vs 288/438 · เบอร์ 092-998-8452 vs 086-339-4682 (`content-audit.md §4`)
- **แก้**: ถามลูกค้า → แก้ให้ตรงกันทั้งเว็บ (CMS settings), Google Business Profile, LINE OA, ใบเสนอราคา
- Effort: Low (1 ชม.) · Impact: Med (local) · Owner: client

### P2-5 Google Business Profile ไม่ทราบสถานะ + ไม่มี `sameAs`
- **แก้**: ถามลูกค้า → claim/อัปเดต GBP (หมวด "ผู้จำหน่ายสี" + "บริการวิศวกรรม"), รูป 10 รูป, ลิงก์เว็บ, เวลาทำการที่ยืนยันแล้ว · ใส่ URL GBP/Maps + LINE OA + Facebook (ถ้ามี) ใน `sameAs`
- Effort: Low (2 ชม.) · Impact: Med · Owner: client + SEO

### P2-6 alt ว่างบนรูปเนื้อหา (หน้าแรก 18/46, หน้าสินค้า hero, การ์ดบทความ)
- **หลักฐาน**: `on-page-audit.md §4` · `Header.tsx:67`, `cards.tsx:127,195`, `ProductHero.tsx:89,122`
- **แก้**: โลโก้ alt = ชื่อบริษัท · รูปสินค้า alt = ชื่อสินค้า · แบนเนอร์ hero alt บรรยายภาพ · การ์ดบทความ alt = ชื่อบท · รูปตกแต่งจริง ๆ คง `alt=""`
- Effort: Low (1.5 ชม.) · Impact: Low–Med · Owner: dev

### P2-7 ไม่มีหน้านโยบายความเป็นส่วนตัว (PDPA) ทั้งที่ฟอร์ม 6 จุดเก็บข้อมูลส่วนบุคคล
- **แก้**: หน้า `/privacy` (noindex ได้) + ลิงก์ใต้ฟอร์มและ footer · ต้องให้ลูกค้าตรวจข้อความ
- Effort: Low (2 ชม.) · Impact: Low (SEO) / High (กฎหมาย) · Owner: dev + client

### P2-8 OG image ใช้รูปเดียว 358 KB กับ 25 หน้า / หน้าสินค้าไม่มี `og:type`
- **แก้**: ทำ OG 1200×630 ≤150 KB สำหรับหน้าแรก, หมวด 4, บริการ 3, LP 5 (13 รูป — เจนตามสเปก) · หน้าสินค้า og:image ใช้รูปสินค้าบนพื้นขาว · เติม `og:type: website` ในหน้าสินค้า
- Effort: Low (2 ชม. + เจนรูป) · Impact: Low–Med (แชร์ผ่าน LINE) · Owner: dev + ผู้ดูแล

### P2-9 ปีของกฎกระทรวงและเลขฉบับที่อ้างขัดกันเองในเว็บ
- **หลักฐาน**: "พ.ศ. 2567" ใน `site.ts`, `news.ts`, `fire-paint-lp.ts`, `engineering-lp.ts` · "ฉบับที่ 48/60" ใน `fireproofing.ts`, `engineering-lp.ts` · แหล่งภายนอก (bsa.or.th, asa.or.th) เรียก "พ.ศ. 2566"
- **แก้**: ให้วุฒิวิศวกรของลูกค้ายืนยัน แล้วแก้ทุกจุดให้ตรง (description ของทั้งเว็บอยู่ใน CMS settings)
- Effort: Low (1 ชม. หลังได้คำตอบ) · Impact: Med (ความน่าเชื่อถือ) · Owner: client

## 🌱 P3

### P3-1 sitemap ไม่มี `lastmod` บน 30 URL
- **แก้**: ใช้ `published_at`/`updated_at` จาก CMS เป็น lastmod ทุก URL · Effort: Low (1 ชม.) · Owner: dev

### P3-2 redirect 2 hop จาก `http://blue-rich.com`
- **แก้**: ตั้ง apex → `https://www.` ที่ Vercel domain settings ให้ข้ามขั้น · Effort: Low · Owner: dev

### P3-3 `llms.txt`
- **แก้**: ไฟล์สั้นสรุปบริษัท สินค้า บริการ ลิงก์หน้าหลัก + ลิงก์ผลทดสอบ · Effort: Low (0.5 ชม.) · Owner: SEO

### P3-4 หัวข้อที่เป็นคำถามและคำต้องห้ามใน h1/h2
- **หลักฐาน**: h1 หน้าแรก "…ครบวงจร", `/products` "ไม่แน่ใจว่าโครงการของคุณต้องใช้ระบบสีแบบไหน?", "คำถามที่พบบ่อย?"
- **แก้**: ปรับเป็นประโยคบอกเล่าตาม voice guide · Effort: Low · Owner: content

### P3-5 Accessibility (Lighthouse 92–93): `color-contrast`, `target-size`
- **แก้**: ตรวจสี muted บนพื้นฟ้า และปุ่ม/ลิงก์เล็กกว่า 24 px · Effort: Low · Owner: dev

## สิ่งที่ทำไว้ดีแล้ว ไม่ต้องแตะ

1. Static prerender ทุกหน้า + Vercel CDN (`x-vercel-cache: HIT`, TTFB 0.12–0.49 s), HTTPS + HSTS 2 ปี, host canonical `www` ด้วย 308
2. `robots.txt` + `sitemap.xml` สร้างจากเมนู/สินค้า/บทความใน CMS — 37 URL ตอบ 200 ทั้งหมด ไม่มี noindex หลุด
3. h1 หน้าละ 1 ครบ 37 หน้า · title/description ไม่ซ้ำ (ยกเว้น `?cat`) · `lang="th"`
4. `next/image` ครบ (AVIF/WebP, lazy, `sizes`) · CLS = 0 ทั้ง 3 หน้าที่วัด
5. Breadcrumb มองเห็นบน 33 หน้า พร้อมไอคอนบ้าน
6. OG + `twitter:card` ทุกหน้า · บทความมี `og:type=article` + `published_time` · `<time datetime>` ISO
7. หน้า 404 ตอบ 404 จริง + noindex · หน้า `/admin` `/api` กันด้วย login + robots
8. LP มี Product/Service/FAQPage schema ครบ · LocalBusiness ทุกหน้า
9. FAQ จริง 60 ข้อ (สินค้า 45, บริการ 8, หน้าแรก 7) เขียนไว้แล้ว พร้อมทำ schema
10. ผลทดสอบ 3 ฉบับ + TDS/MSDS/datasheet 17 ไฟล์ ดาวน์โหลดได้ — เป็นหลักฐาน E-E-A-T ที่ตัวแทนจำหน่ายรายอื่นบนหน้าแรกไม่มี
11. ปุ่ม CTA ทุกปุ่มมี `data-cta` รอผูก GA4 ได้ทันที
12. ฟอร์มส่งผ่าน Resend (server action) ข้อความ error/สำเร็จดึง NAP จาก CMS ชุดเดียว
13. เนื้อหาแยกเป็น data/CMS ไม่ฝังใน component → แก้ title/description/สินค้าได้โดยไม่แตะ UI
14. skip link, `<noscript>` fallback ของ scroll-reveal, ฟอนต์ `display: swap`
