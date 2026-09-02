# Blue Rich Material Products — บันทึกงาน Redesign

> เอกสารส่งต่องาน redesign เว็บไซต์ https://www.blue-rich.com/
> วันที่ทำ: 30 กรกฎาคม 2569 (2026-07-30)
> Repo: https://github.com/thanakitpw/blue-rich-website-redesign
> Commit: `f9fb68d` — Redesign blue-rich.com as a Next.js 16 + Tailwind v4 site

---

## 1. โจทย์

ลูกค้าต้องการ redesign เว็บ blue-rich.com ให้ทันสมัยขึ้น โดย:

- ใช้ **Next.js + Tailwind**
- **คงโทนสีเดิม** (น้ำเงิน–ฟ้า จากโลโก้)
- **เปลี่ยนโครงสร้างหน้าได้**

---

## 2. Stack

| ส่วน | เวอร์ชัน / ตัวเลือก |
|---|---|
| Framework | Next.js **16.2.12** (App Router, Turbopack) |
| React | 19.2.4 |
| CSS | Tailwind **v4** (`@theme` ใน `globals.css` — ไม่มี `tailwind.config.js`) |
| ภาษา | TypeScript 5 |
| Lint | ESLint 9 (`eslint.config.mjs` flat config) |
| ฟอนต์ | `next/font/google` — **Anuphan** (หัวข้อ) + **Noto Sans Thai** (เนื้อความ) |

Scaffold ด้วย `create-next-app` (App Router + src dir + import alias `@/*`)

---

## 3. Design System

ทั้งหมดอยู่ใน `src/app/globals.css` ภายใต้ `@theme`

### สี

สเกล `brand-50` → `brand-950` **สุ่มค่าจากโลโก้คลื่นเดิม** เพื่อคงโทนสีตามที่ลูกค้าขอ

```
brand-50  #f0f8fc   brand-500 #3488c1   brand-900 #143d5c
brand-100 #dcedf8   brand-600 #256da4   brand-950 #0c2438
brand-200 #bcdcf1   brand-700 #1f5785
brand-300 #8ec4e5   brand-800 #1d496e
brand-400 #59a6d5
```

`flame-400/500/600` (เหลือง–ส้ม) — **ใช้เฉพาะจุดที่สื่อถึงไฟ/อุณหภูมิเท่านั้น** (badge "ขายดี", "สินค้าเรือธง", เครื่องหมาย required ในฟอร์ม) ไม่ใช้เป็นสีตกแต่งทั่วไป เพื่อไม่ให้หลุดโทนเดิม

### ฟอนต์

ผูกผ่าน CSS variable: `--font-display` (Anuphan 500/600/700) และ `--font-body` (Noto Sans Thai 400/500/600/700)
`h1–h4` ใช้ display อัตโนมัติผ่าน `@layer base`

### Motif — "diamond"

hero เดิมของเว็บใช้ภาพสี่เหลี่ยมเอียง 45° มุมมน ผมเก็บลายนี้ไว้เป็นเอกลักษณ์ แต่ทำให้ทันสมัยขึ้น

```css
.diamond       { clip-path: inset(0 round 22%); transform: rotate(45deg); }
.diamond-inner { transform: rotate(-45deg) scale(1.42); }   /* หมุนรูปกลับ ไม่ให้ภาพเอียง */
```

ใช้ที่: hero collage, วงแหวนตกแต่งใน `PageHero` / footer / CTA band

### Utilities อื่น

- `.text-gradient-brand` — ไล่สีตัวอักษร
- `.mask-fade-x` — fade ขอบซ้าย/ขวา (ใช้กับ marquee และแถบ filter)
- `.reveal` + `[data-visible="true"]` — fade-in ตอน scroll
- `@keyframes marquee` — แถบมาตรฐานเลื่อนอัตโนมัติ
- `prefers-reduced-motion` — ปิด animation ทั้งหมด
- `<noscript>` ใน `layout.tsx` — บังคับ `.reveal` ให้มองเห็นเมื่อปิด JS (ไม่งั้นเนื้อหาหายทั้งเว็บ)

---

## 4. โครงสร้างหน้า

จากเดิม **5 หน้า** → **13 routes** (build ออกมา 38 หน้า)

หน้าเว็บหลักอยู่ใน route group `src/app/(site)/` (มี Header/Footer/FloatingActions)
ส่วนหน้า landing page อยู่ **นอก group** (`src/app/<slug>/`) เพื่อให้ render โดยไม่มีเมนู
URL อยู่ระดับ root ไม่มี prefix — ตรงกับโครงสร้างของ infinitematerialtech.com ที่ลูกค้าอ้างอิง

| Route | ไฟล์ | ประเภท | หมายเหตุ |
|---|---|---|---|
| `/` | `src/app/(site)/page.tsx` | Static | 12 section |
| `/products` | `src/app/(site)/products/page.tsx` | **Dynamic** | อ่าน `?cat=` เพื่อกรองหมวด |
| `/products/[slug]` | `src/app/(site)/products/[slug]/page.tsx` | SSG × 14 | `generateStaticParams` |
| `/projects` | `src/app/(site)/projects/page.tsx` | Static | **หน้าใหม่** |
| `/about` | `src/app/(site)/about/page.tsx` | Static | |
| `/news` | `src/app/(site)/news/page.tsx` | Static | |
| `/news/[slug]` | `src/app/(site)/news/[slug]/page.tsx` | SSG × 7 | |
| `/contact` | `src/app/(site)/contact/page.tsx` | Static | ฟอร์ม + แผนที่ |
| `/neocoat` | `src/app/neocoat/page.tsx` | Static | **Landing page** — noindex |
| `/thinner` | `src/app/thinner/page.tsx` | Static | **Landing page** — noindex |
| `/engineering` | `src/app/engineering/page.tsx` | Static | **Landing page** — noindex |
| `/four-plus` | `src/app/four-plus/page.tsx` | Static | **Landing page** — noindex |
| `/fire-blanket` | `src/app/fire-blanket/page.tsx` | Static | **Landing page** — noindex |
| `/sitemap.xml` | `src/app/sitemap.ts` | Static | สร้างจาก data |
| 404 | `src/app/not-found.tsx` | Static | |

### Section ในหน้าแรก (ตามลำดับ)

1. **Hero** — headline + CTA + trust chips + diamond collage + แถบติดต่อด่วน 3 ช่อง
2. **Marquee มาตรฐาน** — ASTM E-119 / ISO 834 / ISO 9001 / กฎกระทรวง 2567 / น.4-5, น.4-9
3. **หมวดหมู่สินค้า** — 7 การ์ด
4. **สินค้าเรือธง** — Neocoat Intumescent Paint
5. **Best Seller** — 4 สินค้า (`bestSellers` ใน `products.ts`) + การ์ด "ดูทั้งหมด"
6. **ทำไมต้องเลือกเรา** — 4 จุดแข็ง + แถบสถิติ 4 ตัว
7. **ขั้นตอนการทำงาน** — 4 สเต็ป
8. **ผลงาน** — 6 รูป (ลิงก์ไป `/projects`)
9. **บริการรับรองงาน** — รูปเอกสาร + รายการเอกสาร 4 อย่าง
10. **รีวิวลูกค้า** — 3 รีวิว
11. **บทความ** — 3 บทความล่าสุด
12. **CTA band**

---

## 4.5 Landing Pages — หน้าสำหรับยิงแอด

5 หน้า ทำตามชุดหน้าของ infinitematerialtech.com ที่ลูกค้าส่งมาเป็นตัวอย่าง
แต่ **ใช้ดีไซน์ของ Blue Rich เอง** เพราะลูกค้ากังวลว่าจะเหมือน Infinite เกินไป

| Route | สินค้า/บริการ | เทียบกับหน้าของ Infinite |
|---|---|---|
| `/neocoat` | สีกันไฟ Neocoat | `/neocoat` |
| `/thinner` | ทินเนอร์ 3A · 2K · น้ำมันสน | `/thinner` |
| `/engineering` | บริการรับรองโดยวุฒิวิศวกร | `/engineering` |
| `/four-plus` | สีน้ำพลาสติก Four Plus | `/four-plus` |
| `/fire-blanket` | ผ้ากันไฟ Fiberglass Cloth | `/fire-blanket` |

### วิธีทำให้ไม่เหมือน Infinite

| Infinite | Blue Rich |
|---|---|
| พื้นขาว–ดำ, CTA ส้ม/ทอง | hero น้ำเงินเข้ม `brand-950`, CTA น้ำเงิน + LINE เขียว |
| หัวข้อแบบ `SPEC \| ...`, `SYSTEM \| ...`, `TESTED BY`, `HOW IT WORKS` | หัวข้อไทยล้วน ไม่ใช้ label อังกฤษนำ |
| การ์ดเหลี่ยม | `rounded-3xl` / `rounded-4xl` + ลาย diamond 45° |
| ทุกหน้าใช้เลย์เอาต์เดียวกัน | แต่ละหน้ามี **ลูกเล่นเฉพาะตัว** (ดูตารางล่าง) |

ข้อความทั้งหมด **เขียนขึ้นใหม่** ไม่ได้ก๊อปจาก Infinite — ทั้งเพื่อความต่างและเพื่อเลี่ยง duplicate content

### ลูกเล่นเฉพาะของแต่ละหน้า

| หน้า | hero | ตัวชูโรง |
|---|---|---|
| สีกันไฟ | น้ำเงินเข้ม + ภาพแบนเนอร์ | marquee มาตรฐาน, ตารางอัตราทนไฟตามประเภทอาคาร, กลไกการพองตัว 4 สเต็ป |
| ทินเนอร์ | **สว่าง** (`brand-50` → ขาว) + สินค้า 3 ชิ้นเรียง | ตารางเทียบ 3 ตัว, บล็อก "ทินเนอร์ vs น้ำมันสน", การ์ดขนาดบรรจุ 4 ขนาด, **หัวข้อความปลอดภัย** (Infinite ไม่มี) |
| บริการวิศวกร | น้ำเงินเข้ม + ภาพเอกสารรับรอง | **timeline แนวตั้ง** แยก "คุณส่งให้เรา / เราส่งกลับ" ทุกขั้น, checklist เอกสารส่งมอบ, **บล็อกขอบเขต "รับ / ไม่รับ"** (Infinite ไม่มี) |
| Four Plus | สว่าง + ถังสี 3 ใบเหลื่อมกัน | **ไดอะแกรมระบบสี 3 ชั้น** (ทับหน้า→รองพื้น→พื้นผิว), **ตารางคำนวณจำนวนถัง**, บล็อกสาเหตุสีลอก/ด่าง/ขึ้นรา |
| ผ้ากันไฟ | น้ำเงินเข้ม + ภาพผ้าทอง | **การ์ดเลือกเกรด 4 ตัวพร้อม badge อุณหภูมิ**, แกลเลอรีเนื้อผ้า 5 รูป, **บล็อก "ผ้ากันไฟ ≠ สีกันไฟ"** (กันลูกค้าเข้าใจผิด) |

### Component ที่ใช้ร่วมกัน

```
src/components/landing/
├── kit.tsx          Wrap, Check, Eyebrow, SectionHead, DarkBand  (server components)
├── LpHeader.tsx     'use client' — sticky header, รับ prop `sections` (เมนูกระโดดในหน้า)
├── LpFooter.tsx     footer ไม่มีลิงก์ออกจากหน้า + prop `note` สำหรับ disclaimer รายหน้า
├── LpStickyCta.tsx  'use client' — แถบ CTA ล่างจอมือถือ, prop `quoteLabel`
├── LpQuoteForm.tsx  'use client' — **ฟอร์มขับด้วย config** (`LpQuoteFormConfig`)
└── LpFaq.tsx        <details> ล้วน ไม่ใช้ JS
```

`LpQuoteForm` รับ `config` จากไฟล์ data ของแต่ละหน้า — ช่อง **ชื่อ + เบอร์โทร** คงที่ทุกหน้า
ที่เหลือกำหนดเป็น `text` / `select` / `textarea` ได้ เช่นหน้าสีกันไฟถามอัตราทนไฟ
หน้าทินเนอร์ถามขนาดบรรจุ หน้าผ้ากันไฟถามขนาดผ้าและการเจาะตาไก่

ฟอร์มยังส่งผ่าน `mailto:` + ปุ่มคัดลอกไป LINE เหมือนเดิม (ยังไม่มี backend)

### Data

| ไฟล์ | ใช้กับ |
|---|---|
| `src/data/fire-paint-lp.ts` | `/neocoat` |
| `src/data/thinner-lp.ts` | `/thinner` |
| `src/data/engineering-lp.ts` | `/engineering` |
| `src/data/four-plus-lp.ts` | `/four-plus` |
| `src/data/fire-blanket-lp.ts` | `/fire-blanket` |

ทุกไฟล์ export `navSections` (เมนูในหน้า) และ `quoteForm` (config ฟอร์ม)

### SEO

ทุกหน้าตั้ง `robots: { index: false, follow: true }` และ **ไม่อยู่ใน `sitemap.ts`**
เพื่อไม่ให้แย่ง keyword กับหน้า `/products/*` ที่ทำมาให้ติดอันดับแบบ organic
ถ้าวันหนึ่งอยากให้หน้า LP ติดอันดับเองด้วย ให้ลบ `robots` ออกและเพิ่ม path เข้า `sitemap.ts`

มี JSON-LD ทุกหน้า — `FAQPage` ทุกหน้า, `Product` ในหน้าสีกันไฟกับผ้ากันไฟ, `Service` ในหน้าบริการ

### Tracking

ทุกปุ่ม CTA มี `data-cta="..."` เช่น `hero-quote`, `sticky-line`, `form-submit-line`
เอาไว้ผูก event ของ GA4 / Google Ads ได้เลยโดยไม่ต้องแก้ markup

## 5. Data Layer

เนื้อหาทั้งหมดแยกเป็นไฟล์ TS ไม่ฝังใน component — แก้เนื้อหาได้โดยไม่ต้องแตะ UI

| ไฟล์ | เนื้อหา |
|---|---|
| `src/data/site.ts` | ชื่อบริษัท, ที่อยู่, เบอร์, อีเมล, LINE, เมนู, มาตรฐาน, สถิติ, helper links (`telHref`, `lineHref`, `mapEmbed`, …) |
| `src/data/products.ts` | 7 หมวดหมู่ + 14 สินค้า (badges, quickSpecs, specs, downloads, lists, installation, legal, FAQ, related, gallery) |
| `src/data/news.ts` | 7 บทความ (พร้อม body เต็ม) |
| `src/data/projects.ts` | 16 ผลงาน (พร้อม caption + span สำหรับ grid) |

### สินค้า 14 รายการ

ข้อมูลสินค้าทั้งชุด (ชื่อ, tagline, badges, quick spec, สเปกเทคนิค, ขั้นตอนติดตั้ง,
ข้อกฎหมาย, FAQ, สินค้าที่เกี่ยวข้อง, ลิงก์เอกสาร) **ถอดมาแบบคำต่อคำ**
จาก https://infinite-material.vercel.app/products — เปลี่ยนเฉพาะ presentation

| slug | ชื่อ | หมวด |
|---|---|---|
| `neocoat-intumescent-paint-s` | สีกันไฟ Neocoat สูตรน้ำมัน Intumescent Paint-S | สีกันไฟ |
| `neocoat-intumescent-paint-w` | สีกันไฟ Neocoat สูตรน้ำ Intumescent Paint-W | สีกันไฟ |
| `neocoat-primer-grey-oxide` | สีรองพื้นเทา Neocoat Primer Grey Oxide | สีรองพื้น/ทับหน้า |
| `neogloss-enamel` | สีน้ำมันทาเหล็ก Neogloss | สีรองพื้น/ทับหน้า |
| `thinner-3a-intanin` | ทินเนอร์ 3A ผสมสี อินทนิล | ทินเนอร์/น้ำมันสน |
| `thinner-2k` | ทินเนอร์ 2K ทินเนอร์ 3A | ทินเนอร์/น้ำมันสน |
| `turpentine-intanin` | น้ำมันสนผสมสี อินทนิล | ทินเนอร์/น้ำมันสน |
| `mandolite-cp2` | ซีเมนต์กันไฟ Mandolite CP-2 งานภายใน | ซีเมนต์กันไฟ |
| `fendolite-m2` | ซีเมนต์กันไฟ Fendolite M2 งานภายนอก | ซีเมนต์กันไฟ |
| `fiberglass-cloth` | ผ้ากันไฟ Fiberglass Cloth | ผ้ากันไฟ |
| `roof-shield-ceramic` | สีเซรามิคสะท้อนความร้อน Roof Shield White | เซรามิคสะท้อนร้อน |
| `four-plus-pro-masonry-sealer` | สีรองพื้นปูน Four Plus Pro Masonry Sealer | สีน้ำพลาสติก |
| `four-plus-exterior` | สีน้ำพลาสติกทาภายนอก Four Plus Exterior | สีน้ำพลาสติก |
| `four-plus-pro-interior` | สีน้ำพลาสติกทาภายใน Four Plus Pro Interior | สีน้ำพลาสติก |

**บล็อกที่ใช้ร่วมกัน** — `installationSteps` (4 สเต็ป, ใช้กับสีกันไฟ 2 ตัว) และ
`legalInfo` (กฎกระทรวง 2566, ใช้กับสีกันไฟ 2 ตัว + ซีเมนต์กันไฟ 2 ตัว)

**ตัวเลขที่ต้องยืนยันก่อนใช้อ้างอิงเอกสารราชการ** — อัตราทนไฟของ Fendolite M II
และ Mandolite CP-2 ในเว็บต้นทางระบุไม่ตรงกันระหว่างหน้า listing กับหน้าเนื้อหา
(`specNote` ของทั้งสองตัวเตือนไว้แล้ว)

**ไฟล์ประกอบ**
- `public/assets/products/` (22 ไฟล์) — รูปสินค้าจริง ดึงมาจากเว็บต้นทาง
- `public/docs/` (13 ไฟล์ PDF, ~25 MB) — TDS / ผลทดสอบ ISO 834, ASTM E119 / MSDS / สเปกผ้ากันไฟ

---

## 6. Components

```
src/components/
├── ui/
│   ├── index.tsx          Container, Button, Eyebrow, SectionHeading,
│   │                      Icon (13 ตัว), Breadcrumb, PageHero
│   └── Reveal.tsx         'use client' — IntersectionObserver fade-in
├── layout/
│   ├── Header.tsx         'use client' — sticky, utility bar ยุบตอน scroll,
│   │                      mobile drawer
│   ├── Footer.tsx         4 คอลัมน์
│   └── FloatingActions.tsx 'use client' — FAB LINE / โทร / กลับขึ้นบน
├── cards.tsx              ProductCard, CategoryCard, NewsCard
├── home/Hero.tsx          hero + diamond collage
├── ProductGallery.tsx     'use client' — แกลเลอรีสินค้า + thumbnail
└── ContactForm.tsx        'use client' — ฟอร์ม (mailto)
```

`Button` รองรับ variant: `primary` / `secondary` / `ghost` / `line` (สีเขียว LINE `#06C755`)

---

## 7. รูปภาพ — ที่มาและวิธีได้มา

ทั้งหมดอยู่ใน `public/assets/` (37 ไฟล์ ~5.1 MB) **ดึงจากเว็บเดิมทั้งหมด** ไม่มี stock ภายนอก

| ไฟล์ | ที่มา / วิธีทำ |
|---|---|
| `logo.png` | โลโก้เดิม — **ลบพื้นหลังขาวออกเป็น transparent** ด้วย flood-fill จากขอบภาพ (PIL) เพื่อให้ `brightness-0 invert` ใน footer แสดงเป็นโลโก้ขาวได้ |
| `logo-flat.jpg` | โลโก้พื้นขาว (สำรอง) |
| `banner-fireproof.jpg` | แบนเนอร์ "Fire Proof Steel Structure" จากเว็บเดิม |
| `cert-documents.jpg` | ภาพเอกสารรับรอง น.4-5 / น.4-9 |
| `product-*.jpg` (8) | รูปสินค้า — ถังสี/แกลลอน จากหน้า Item, ส่วน**ผ้ากันไฟ 4 ตัว crop เอาเฉพาะรูปผ้าออกมาจาก datasheet** แล้ว resize เป็น 900×900 |
| `spec-*.jpg` (4) | datasheet HERA เต็มแผ่น (ใช้ในแกลเลอรีสินค้า) |
| `work-01..16.jpg` | **หั่นออกมาจากภาพ grid 4×4 ภาพเดียว** (`p1jse5vn7g...png`, 1919×1079) ที่เว็บเดิมใช้รวมรูปหน้างาน → ได้ภาพผลงานแยก 16 รูป เป็นที่มาของหน้า `/projects` |
| `news-*.jpg/png` (5) | ภาพประกอบบทความจากเว็บเดิม |

**หน้า `/projects` เกิดขึ้นได้เพราะการหั่นภาพ grid นี้** — เว็บเดิมไม่มีหน้าผลงานแยก

---

## 8. เนื้อหา — ดึงมาจากไหน

| หน้าเว็บเดิม | ใช้ทำอะไร |
|---|---|
| `blue-rich.com/` | หมวดหมู่, best seller, รีวิว 3 ราย, ข้อมูลติดต่อ |
| `/About-` | เนื้อหาหน้าเกี่ยวกับเรา, ปรัชญาการทำธุรกิจ |
| `/Item-4,5,6,7,12,13,14,15` | ชื่อ + รหัส + คำอธิบายสินค้า 8 รายการ |
| `/News-159` … `165` | บทความ 7 เรื่อง |

**ข้อมูลติดต่อ** (คัดจากเว็บเดิม ยืนยันแล้ว):
- ที่อยู่: หมู่บ้านบุราสิริ ปัญญาอินทรา เลขที่ 288/60 ถนนเลียบคลองสอง แขวงบางชัน เขตคลองสามวา กรุงเทพมหานคร 10510
- โทร: 099-458-6692, 061-421-5422, 086-339-4682
- อีเมล: bluerich.sale@gmail.com
- LINE ID: blue999

---

## 9. ⚠️ ข้อความที่ผมแต่งขึ้นเอง — ต้องให้ลูกค้ายืนยันก่อนใช้จริง

เว็บเดิมไม่มีข้อมูลเหล่านี้ ผมเขียนขึ้นเพื่อให้ layout สมบูรณ์ **กรุณาตรวจกับลูกค้าก่อน publish**

| อยู่ที่ | ข้อความ | สถานะ |
|---|---|---|
| `src/data/site.ts` → `stats` | **"15+ ปีประสบการณ์งานสีกันไฟ"** | ❗ แต่งเอง ไม่มีข้อมูลรองรับ |
| `src/data/site.ts` → `hours` | **"จันทร์ – เสาร์ 08:00 – 17:30 น."** | ❗ แต่งเอง |
| หน้าแรก CTA / `/projects` | "สรุปราคาให้ภายใน **1–2 วันทำการ**" | ❗ แต่งเอง |
| `/contact` | "ทีมงานจะติดต่อกลับภายใน **1 วันทำการ**" | ❗ แต่งเอง |
| หน้าแรก → ขั้นตอนการทำงาน 4 สเต็ป | เนื้อหาทั้ง 4 ขั้น | ❗ เขียนจากความเข้าใจทั่วไปของงานสีกันไฟ |
| `stats` → "3 ชม.", "1000°C", "100%" | อ้างอิงจาก spec สินค้าจริง | ✅ มีที่มา |
| `/four-plus` → ตารางคำนวณจำนวนถัง | คำนวณเองจาก 150 ตร.ม./ถัง/เที่ยว × (รองพื้น 1 + ทับหน้า 2) ปัดขึ้นเป็นถังเต็ม | ⚠️ เป็นเลขคณิต ไม่ใช่ตัวเลขจากผู้ผลิต — หน้าเว็บระบุว่าเป็นค่าประมาณแล้ว |
| `/thinner` → หัวข้อความปลอดภัย | ข้อปฏิบัติการเก็บ/ใช้ตัวทำละลาย 4 ข้อ | ❗ เขียนจากแนวปฏิบัติทั่วไป ควรให้ลูกค้าตรวจว่าตรงกับ MSDS |
| `/engineering` → ทุกหัวข้อ | ขอบเขตบริการ 3 อย่าง, timeline 5 ขั้น, รายการเอกสารส่งมอบ 6 รายการ, บล็อก "รับ/ไม่รับ" | ❗ **สำคัญ** เขียนจากความเข้าใจงานรับรองสีกันไฟทั่วไป ต้องให้วุฒิวิศวกรของลูกค้าตรวจก่อน publish |
| `/fire-blanket` → การจับคู่เกรดผ้ากับรูป | จับคู่จากภาพจริง (ทอง 2 เกรด / เคลือบซิลิโคนเทา / ซิลิก้าแดง) | ⚠️ ทั้ง 2 เกรดสีทองใช้รูปผ้าทองคนละใบแต่เป็นผ้าชุดเดียวกัน — ถ้าลูกค้ามีรูปแยกรายเกรดจะดีกว่า |
| ทุกหน้า LP | "เสนอราคาภายใน 1–2 วันทำการ" / "ภายใน 1 วันทำการ" | ❗ แต่งเอง (ต่อจากที่เคยระบุไว้ในตารางนี้) |
| `standards` → ISO 9001:2015 | เป็นใบรับรองของ **โรงงานผู้ผลิต (UNIQUE Products)** ที่เห็นบนฉลากถัง ไม่ใช่ของ Blue Rich — ผมระบุกำกับว่า "ระบบบริหารคุณภาพโรงงานผู้ผลิต" | ⚠️ ตรวจถ้อยคำอีกครั้ง |

---

## 10. บั๊กที่เจอและแก้ระหว่างทาง

1. **ไอคอนแสดงผลขนาดยักษ์** — ใน `Icon` เขียน `className="size-4" {...p}` ทำให้ props ที่ส่งเข้ามาทับ `className` เดิมจนคลาสขนาดหายไป SVG เลย render ตามขนาด intrinsic
   → แก้เป็น destructure `className` แล้ว merge: `` className={`size-4 ${className}`} `` (ทั้ง 13 ไอคอน)

2. **โลโก้ใน footer เป็นกล่องสีขาว** — `logo.png` มีพื้นหลังขาวทึบ พอโดน `brightness-0 invert` เลยกลายเป็นสี่เหลี่ยมขาว
   → flood-fill พื้นขาวจากขอบภาพให้เป็น alpha 0

3. **Grid ผลงานมีช่องโหว่** — การ์ดมี span ไม่เท่ากัน (`col-span-2` / `row-span-2`) ทำให้เกิดรู
   → เพิ่ม `[grid-auto-flow:dense]`

4. **เนื้อหาหายทั้งเว็บถ้าปิด JS** — `.reveal` ตั้ง `opacity: 0` ไว้ รอ IntersectionObserver
   → เพิ่ม `<noscript>` override ใน `layout.tsx`

5. **Next เตือน workspace root ผิด** — เจอ lockfile หลายตัวในเครื่อง
   → pin `turbopack.root` ใน `next.config.ts`

6. คำอธิบายหมวดหมู่ยาวเกิน ทำให้ `line-clamp-3` ตัดกลางคัน → ตัดข้อความให้สั้นลง

---

## 11. การตรวจสอบที่ทำไปแล้ว

- ✅ `next build` ผ่าน — 25 หน้า
- ✅ Screenshot desktop (1440px): `/`, `/products`, `/products/[slug]`, `/projects`, `/about`, `/contact`
- ✅ Screenshot mobile (430px) ผ่าน Chrome DevTools Protocol พร้อม device emulation
- ✅ ตรวจ horizontal overflow: `document.documentElement.scrollWidth` = 430 เท่ากับ viewport → **ไม่มี overflow**
  (element ที่ยื่นออกนอกจอเป็น marquee กับ hero collage ซึ่งอยู่ใน `overflow-hidden` ตามตั้งใจ)

**ยังไม่ได้ตรวจ:** โลโก้ footer หลังแก้ transparency + ล้าง Next image cache — ต้องเปิดดูด้วยตาอีกครั้ง

---

## 12. งานที่ยังค้าง / ข้อเสนอแนะ

| เรื่อง | รายละเอียด |
|---|---|
| 🔴 ยืนยันเนื้อหาแต่งเอง | ดูหัวข้อ 9 — สำคัญที่สุด อย่า publish ก่อนเช็ค |
| 🟡 โลโก้ footer | รัน `npm run dev` เลื่อนลงดู footer ว่าโลโก้ขาวขึ้นถูกต้องไหม |
| 🟡 ฟอร์มติดต่อ | ตอนนี้เปิดโปรแกรมเมลผ่าน `mailto:` — ถ้าอยากได้เมลเข้ากล่องจริง ต้องต่อ Resend / Formspree / Server Action + SMTP (ดูคอมเมนต์ใน `ContactForm.tsx`) |
| 🟡 `README.md` | ยังเป็น boilerplate ของ create-next-app ควรเขียนใหม่ |
| 🟢 รูป datasheet | `spec-*.jpg` เป็นภาพสแกน อ่านยากบนมือถือ — ถ้าลูกค้ามีไฟล์ PDF ต้นฉบับจะดีกว่า |
| 🟢 SEO | มี metadata + sitemap + JSON-LD (LocalBusiness) แล้ว ยังไม่มี `robots.txt` |
| 🟢 Analytics | ยังไม่ได้ติดตั้ง |

---

## 13. ⚠️ เรื่อง iCloud Drive — สำคัญมาก

โปรเจกต์อยู่ใน `~/Library/Mobile Documents/com~apple~CloudDocs/…` (iCloud Drive) **ซึ่งทำให้งานพังกลางคัน 2 ครั้ง**

### อาการ

iCloud "Optimize Mac Storage" จะ **evict** เนื้อไฟล์ที่ไม่ได้แตะสักพัก เหลือไว้แค่ placeholder — ไฟล์ยังมีชื่อและขนาดถูกต้อง แต่ **อ่านได้ 0 ไบต์**

ตรวจด้วย `ls -lO` จะเห็น flag `compressed,dataless`

### ผลที่เกิด

- `next build` พังด้วย `ERR_INVALID_PACKAGE_CONFIG` (อ่าน `package.json` ไม่ได้)
- `git status` ขึ้น `error: short read while indexing .gitignore` → **git มองไม่เห็นกฎ ignore เลยเตรียมจะ commit `node_modules` ทั้งก้อน**
- `git status` ค้างเป็น zombie process ทิ้ง `.git/index.lock` ค้างไว้
- process ค้างจน load average ขึ้นไป 12

### วิธีที่ใช้แก้

```bash
# หาไฟล์ที่โดน evict
find . -path ./node_modules -prune -o -type f -print | while read -r f; do
  case "$(ls -lO "$f" | awk '{print $5}')" in *dataless*) echo "DATALESS $f";; esac
done

# ไฟล์ที่อยู่ใน git อยู่แล้ว — ลบ placeholder แล้วดึงกลับจาก git object
rm -f <file> && git checkout HEAD -- <file>

# ล้าง lock ค้าง
rm -f .git/index.lock

# node_modules ซ่อมไม่คุ้ม ลงใหม่เลย
rm -rf node_modules && npm install
```

### 👉 สิ่งที่ควรทำหลังย้ายโฟลเดอร์

**ย้ายออกจาก iCloud** เช่นไป `~/Developer/` แล้วใช้ GitHub เป็นตัว sync แทน — โค้ดขึ้น repo หมดแล้ว clone ใหม่ได้เลย:

```bash
cd ~/Developer
git clone https://github.com/thanakitpw/blue-rich-website-redesign.git
cd blue-rich-website-redesign
npm install
npm run dev
```

หรือถ้าจำเป็นต้องอยู่บน iCloud — ปิด **System Settings → Apple ID → iCloud → "Optimize Mac Storage"**

---

## 14. คำสั่งที่ใช้บ่อย

```bash
npm run dev     # dev server (Turbopack) → http://localhost:3000
npm run build   # production build — ควรได้ 25 หน้า
npm start       # รัน production build
npm run lint    # ESLint
```
