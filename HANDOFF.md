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

### สี — พอร์ตจาก Concept B

ลูกค้าเลือก **Concept B** (`public/concept-b/index.html`) เป็นดีไซน์ของเว็บจริง
ตัวแปร CSS ของ Concept B ถูก map ลงบนสเกล `brand` / `slate` / `flame` ที่โค้ดใช้อยู่แล้ว
ทำให้ utility class เดิมทั้งหมดเปลี่ยนมาใช้พาเลตของ Concept B โดยไม่ต้องไล่แก้ทีละไฟล์

```
Concept B          →  Tailwind
--sky      #f1f7fb →  brand-50      --shell    #f6f9fb →  slate-50
--blue-100 #e5f1f8 →  brand-100     --line-soft#eef3f7 →  slate-100
--blue-300 #b3d7ea →  brand-200     --line     #e3ebf2 →  slate-200
--blue-500 #6aa4c4 →  brand-400     --muted    #62798a →  slate-500
--blue-600 #4a86ab →  brand-500     --ink      #15242f →  slate-950 / brand-950
--blue-700 #3a6f92 →  brand-600
--navy-800 #33607c →  brand-700     LINE green #06c755 →  ใช้ตรง ๆ ในคอมโพเนนต์
--navy-900 #2a5068 →  brand-800
--navy-950 #20404f →  brand-900
```

### สี action + สีหัวข้อ = `#206CA4`

ลูกค้าขอให้ **ปุ่ม, element ต่าง ๆ และตัวอักษรหัวข้อทั้งเว็บเป็นสีฟ้า `#206CA4`**
สีส้มของ Concept B (`--flame #ef7622`) ถูกแทนที่ทั้งหมด — ไม่มีสีส้มเหลือในเว็บแล้ว

```
accent-50  #eef5fa   accent-300 #7db2d4   accent-600 #1a5885  (hover)
accent-100 #d7e8f3   accent-400 #4a90bf   accent-700 #154668
accent-200 #aecfe6   accent-500 #206ca4   ← สีที่ลูกค้ากำหนด
```

**สองช่องใน `brand` ถูกตั้งเป็น `#206ca4` ด้วย** เพื่อให้ utility class เดิมทั่วทั้งโค้ด
(รวมหน้า landing page) เปลี่ยนตามโดยไม่ต้องไล่แก้ทีละจุด

| token | บทบาทเดิมใน Concept B | ใช้ที่ไหน |
|---|---|---|
| `brand-600` | `--blue-700` สี action | ปุ่ม, pill เมนู active, ลิงก์, ไอคอนวงกลม, badge |
| `brand-700` | `--navy-800` สีหัวข้อ | `h1–h5` (กฎใน `@layer base`), ชื่อสินค้าในการ์ด, หัวข้อ FAQ, breadcrumb ปัจจุบัน |

- `text-brand-900` ที่เคยใช้กับหัวข้อย่อย/ป้ายกำกับ ถูกเปลี่ยนเป็น `text-brand-700` ทั้งหมด
  จะได้เดินตามสีหัวข้อชุดเดียวกัน (`brand-900` เหลือไว้ใช้เป็น**พื้นเข้ม**เท่านั้น)
- ปุ่มที่เคย hover เป็น `brand-800` เปลี่ยนเป็น `accent-600` เพื่อให้เป็นการเข้มขึ้นของสีเดียวกัน
- จุดที่เคยเป็นส้ม → `#206CA4` : ขีด 4px หน้าหัวข้อ (`.rule-bar`), ปุ่มโทรกลมบน header,
  badge "ขายดี", ปุ่ม +/− ของ FAQ, eyebrow ภาษาอังกฤษ, ไอคอนใน footer,
  ตราวงกลม One Stop Service และปุ่ม CTA ทั้งหมด
- ปุ่ม LINE ยังเป็นเขียว `#06C755` และไอคอน Facebook ยังเป็น `#1877f2` ตามสีแบรนด์เจ้าของ
- contrast `#206ca4` บนพื้นขาว = **5.6:1** ผ่าน WCAG AA ทั้งตัวอักษรปกติและตัวอักษรบนปุ่ม

### ตัวเลข/ระยะ

- `--wrap: 1180px` → `Container` = `max-w-[1180px] px-5`
- section = `py-[38px] lg:py-[52px]` (`.sec` ของ Concept B)
- radius 14 / 20px → override `--radius-3xl: 14px`, `--radius-4xl/5xl: 20px`
- เส้นขอบเป็น hairline `border border-slate-200` แทน `ring-*` แบบเดิม

### สเกลตัวอักษร (ยกขึ้นหนึ่งขั้นตามที่ลูกค้าขอ)

body = **16px / line-height 1.7** (เดิม 15/1.75) และ override สเกล `text-*` ทั้งชุดใน `@theme`

```
text-xs 13px   text-base 16px   text-2xl 24px
text-sm 15px   text-lg   19px   text-3xl 30px
               text-xl   21px   text-4xl 38px
```

ค่า `text-[Npx]` ที่ port มาจาก Concept B ถูกยกขึ้นหนึ่งขั้นทั้ง 31 ไฟล์เช่นกัน
ชื่อสินค้าในการ์ดใหญ่ขึ้นและหนาขึ้น (`text-[17px] font-semibold`, การ์ดเรือธง `text-[20px]`)

### พื้นหลังฟ้าของ section (เข้มขึ้นตามที่ลูกค้าขอ)

```
--color-brand-50  #f1f7fb → #dfecf7   (PageHero, chip, hover)
--color-slate-50  #f6f9fb → #eaf2f9   (section tone="shell")
--color-slate-500 #62798a → #4f6879   (muted text — เข้มขึ้นให้ contrast ยังผ่าน AA
                                        บนพื้นฟ้าที่เข้มขึ้น: 4.9:1)
```

### ฟอนต์

**Prompt** ทั้งเว็บ (เดิม Anuphan + Noto Sans Thai) — `--font-display` 500/600/700,
`--font-body` 300/400/500/600 ตามที่ Concept B ใช้

### Utilities ที่พอร์ตมาจาก Concept B

- `.rule-bar` — ขีดส้ม 4px หน้าหัวข้อ (`.sec-head h2::before`)
- `.eyebrow-en` — ตัวเอียงพิมพ์ใหญ่สำหรับบรรทัดภาษาอังกฤษ
- `.bleed-left` — ภาพทะลุขอบซ้ายในแถบ About
- `.line-clamp-3-b` — ตัด 3 บรรทัดของการ์ดสินค้าเรือธง

### คอมโพเนนต์ที่พอร์ตมาจาก Concept B

`src/components/concept.tsx` เก็บบล็อกหลักของ Concept B ไว้ใช้ซ้ำทุกหน้า

| Export | มาจาก Concept B |
|---|---|
| `Section` | `.sec` / `.sec-shell` |
| `Ribbon` | `.ribbon-box` แถบจุดเด่น 4 ช่อง |
| `ValueBlock` | `.value` — เครื่องหมายคำพูดส้ม + หัวข้อเอียง + เช็คลิสต์ + ภาพมี badge |
| `StandardsBand` | `.trusted` + `.std-chip` |
| `WorksGrid` | `.work-grid` masonry |
| `AboutBand` | `.about` ภาพทะลุขอบ + ตราวงกลม One Stop Service |
| `LineCta` | `.linecta` + `.mock` โมเดลจอมือถือ LINE |
| `Faq` | `details.qa` ขอบฟ้า → ส้มเมื่อเปิด |
| `CtaBand` | แถบปิดท้ายของหน้าใน |

`src/components/cards.tsx` — `ProductCard` (`.p-card`), `FeatureCard` (`.feature-card`
พร้อม `.pill-corner` ส้ม), `CategoryCard` (`.cat-card`), `NewsCard` (`.art`)

**Concept B ไม่มี SKU จริง** — ในคอนเซปต์ใส่รหัสสินค้าไว้เป็นตัวอย่าง (NEO-IP-S ฯลฯ)
เว็บจริงไม่มีข้อมูลนี้ จึงแสดงชื่อหมวดแทนในตำแหน่งเดียวกัน ไม่ได้แต่งรหัสขึ้นเอง

### เลย์เอาต์หน้าสินค้า / หมวดหมู่ / เกี่ยวกับเรา (รอบแก้ตาม ref ของลูกค้า)

| หน้า | Ref | สิ่งที่ทำ |
|---|---|---|
| `/products/[slug]` | ภาพสกรีนช็อตที่ลูกค้าส่ง | breadcrumb ไอคอนบ้าน → 2 คอลัมน์ : แกลเลอรีมีลูกศร ‹ › + แถบ thumbnail / ชื่อสินค้าตัวใหญ่สีฟ้า, หมวด, badge, เส้นคั่น, คำโปรย, bullet สเปก (2 ข้อแรกจุดสีฟ้าเน้น), ช่องราคา, ปุ่มสั่งซื้อผ่าน LINE, การ์ดการันตี 3 ข้อ, กล่องดาวน์โหลดเอกสาร |
| `/intumescent` `/paint` `/hardware` `/products` | `energyreform-solar.com/product-category/…` | `CatalogSection` — sidebar หมวดหมู่ (สร้างจาก `nav` ใน site.ts) + แถบ "เรียงโดย" + กริดสินค้า แล้วตามด้วยเนื้อหาเชิงบทความเดิมของแต่ละหน้า |
| `/about` | `energyreform-solar.com/about-us/` | คำโปรยกลางหน้า + ชิปมาตรฐาน → ผังขั้นตอนทำงาน 5 ขั้นแบบมีตัวเลข → บล็อกแนะนำบริษัท + สถิติ + ตรา One Stop Service → ค่านิยม 4 ข้อ → แกลเลอรีผลงาน 8 รูป → ขอบเขตผลิตภัณฑ์ → CTA |

**ref หน้า about เปิดด้วยวันจดทะเบียนและทุนจดทะเบียนของบริษัท** — ลูกค้ายังไม่ได้ให้ตัวเลขนี้
บล็อกนั้นจึงเขียนว่าบริษัททำอะไรแทน ไม่ได้แต่งข้อมูลการจดทะเบียนขึ้นเอง

**ราคาสินค้า** — ไม่มีในระบบ ช่องราคาบนหน้าสินค้าจึงเขียนว่า "สอบถามราคา"
พร้อมหมายเหตุว่าราคาขึ้นกับปริมาณและขอบเขตงาน ไม่ได้ใส่ตัวเลขสมมติ

### สินค้าที่ถอดออก

**ซีเมนต์กันไฟ** (หมวด `fireproof-cement` + `mandolite-cp2` + `fendolite-m2`) ถูกลบออก
จาก `products.ts` และทุกจุดที่อ้างถึงตามที่ลูกค้าสั่ง — เหลือ 6 หมวด 12 สินค้า
ยกเว้นบทความกฎหมาย `/news/fire-protection-law` ที่ยังเอ่ยถึง "ซีเมนต์กันไฟ"
ในฐานะหนึ่งในสามวิธีป้องกันไฟที่กฎหมายยอมรับ (เป็นข้อมูลกฎหมาย ไม่ใช่รายการสินค้าที่ขาย)

### Utilities อื่น

- `.mask-fade-x` — fade ขอบซ้าย/ขวา (ใช้กับ marquee และแถบ filter)
- `.reveal` + `[data-visible="true"]` — fade-in ตอน scroll
- `prefers-reduced-motion` — ปิด animation ทั้งหมด
- `<noscript>` ใน `layout.tsx` — บังคับ `.reveal` ให้มองเห็นเมื่อปิด JS (ไม่งั้นเนื้อหาหายทั้งเว็บ)

---

## 3.5 โครงสร้างเมนู (ตามที่ลูกค้าร่างมา)

เมนูหลัก 9 รายการ ตามภาพร่างที่ลูกค้าส่งมา — นิยามอยู่ที่ `nav` ใน `src/data/site.ts`
รายการที่ 2–5 มีเมนูย่อย ส่วน 6–9 เป็นหน้าเดี่ยว

```
1  หน้าแรก              /
2  สีกันไฟ Neocoat      /intumescent
     ├ สีกันไฟสูตรน้ำมัน  /products/neocoat-intumescent-paint-s
     └ สีกันไฟสูตรน้ำ     /products/neocoat-intumescent-paint-w
3  รับรองสีกันไฟ         /fireproofing
     ├ วิศวกรรับรองสีกันไฟ      /fireproofing/certification
     └ วิศวกรควบคุมสีกันไฟ      /fireproofing/supervision
4  สีน้ำ/สีน้ำมัน         /paint
     ├ สีรองพื้นกันสนิมทาเหล็ก   /products/neocoat-primer-grey-oxide
     ├ สีทับหน้าเหล็ก           /products/neogloss-enamel
     ├ สีรองพื้นปูนใหม่/เก่า      /products/four-plus-pro-masonry-sealer
     └ สีน้ำพลาสติก            /paint#emulsion
5  ฮาร์ดแวร์             /hardware
     ├ ทินเนอร์ 3A       /products/thinner-3a-intanin
     ├ ทินเนอร์ล้าง       /hardware#thinner-wash   ← ยังไม่มีหน้าสินค้า รอสเปกจากลูกค้า
     ├ น้ำมันสน          /products/turpentine-intanin
     ├ ทินเนอร์ 2K       /products/thinner-2k
     └ ผ้ากันไฟ          /products/fiberglass-cloth
6  เกี่ยวกับเรา           /about
7  ผลงานของเรา          /projects
8  บทความ              /news
9  ติดต่อเรา             /contact
```

- **Header 3 ชั้น** (`src/components/layout/Header.tsx`) — แถบ utility (ยุบเมื่อ scroll) →
  แถวโลโก้ + CTA → แถบเมนูสีน้ำเงิน dropdown เปิดด้วย `group-hover` / `group-focus-within`
  (ไม่ใช้ state ต่อเมนู) · จอ < `lg` ใช้ drawer แบบ accordion
- **Footer** สร้าง sitemap จาก `nav` ตัวเดียวกัน — แก้เมนูที่ `site.ts` ที่เดียว เปลี่ยนทั้ง header/footer/sitemap.xml
- `navRoutes` (site.ts) คือ flatten ของทั้งต้นไม้ ใช้ป้อน `src/app/sitemap.ts`
- หน้า `/products` (แคตตาล็อกรวม + filter ตามหมวด) ยังอยู่เหมือนเดิม ใช้เป็นปลายทางของปุ่ม
  "ดูสินค้าทั้งหมด" — เมนูใหม่เป็นชั้นนำทางที่วางทับแคตตาล็อกเดิม ไม่ได้แทนที่

### หน้าใหม่ที่เพิ่มเข้ามา

| Route | เนื้อหา |
|---|---|
| `/intumescent` | แคตตาล็อก 4 สินค้า, หลักการทำงาน + ไดอะแกรม SVG ตัดขวางระบบสี, เทียบสูตรน้ำมัน/สูตรน้ำ (ตัดส่วนมาตรฐาน / ขั้นตอน / ข้อกฎหมาย / FAQ ออกตามที่ลูกค้าสั่ง) |
| `/fireproofing` | 2 บริการหลัก, timeline, เอกสารที่ส่งมอบ, ขอบเขตงานที่รับ/ไม่รับ, ผลงาน, FAQ |
| `/fireproofing/certification` · `/fireproofing/supervision` | หน้าบริการย่อย — ข้อมูลจาก `src/data/fireproofing.ts` |
| `/paint` | ระบบสีงานเหล็ก (รองพื้น/ทับหน้า) และงานปูน (รองพื้นปูน/สีน้ำพลาสติก) มี anchor `#emulsion` |
| `/hardware` | ทินเนอร์ 3 ตัว + บล็อก **ทินเนอร์ล้าง** (`#thinner-wash`) + ตารางเลือกตัวทำละลายตามชนิดสี + ผ้ากันไฟ |

เนื้อหาทุกหน้าอ้างจาก `products.ts` และ `engineering-lp.ts` ที่มีอยู่แล้ว **ไม่มีการแต่งสเปกหรือราคาขึ้นใหม่**

## 4. โครงสร้างหน้า

จากเดิม **5 หน้า** → **13 routes** (build ออกมา 38 หน้า)

หน้าเว็บหลักอยู่ใน route group `src/app/(site)/` (มี Header/Footer/FloatingActions)
ส่วนหน้า landing page อยู่ **นอก group** (`src/app/<slug>/`) เพื่อให้ render โดยไม่มีเมนู
URL อยู่ระดับ root ไม่มี prefix — ตรงกับโครงสร้างของ infinitematerialtech.com ที่ลูกค้าอ้างอิง

| Route | ไฟล์ | ประเภท | หมายเหตุ |
|---|---|---|---|
| `/` | `src/app/(site)/page.tsx` | Static | 12 section |
| `/intumescent` | `src/app/(site)/intumescent/page.tsx` | Static | **หน้าใหม่** — เมนู 2 (เดิม `/fire-paint`) |
| `/fireproofing` | `src/app/(site)/fireproofing/page.tsx` | Static | **หน้าใหม่** — เมนู 3 (รวมหัวข้องานหน้างานที่รับเหมา) |
| `/fireproofing/[slug]` | `src/app/(site)/fireproofing/[slug]/page.tsx` | SSG × 2 | **หน้าใหม่** — certification, supervision |
| `/paint` | `src/app/(site)/paint/page.tsx` | Static | **หน้าใหม่** — เมนู 4 |
| `/hardware` | `src/app/(site)/hardware/page.tsx` | Static | **หน้าใหม่** — เมนู 5 |
| `/products` | `src/app/(site)/products/page.tsx` | **Dynamic** | อ่าน `?cat=` เพื่อกรองหมวด |
| `/products/[slug]` | `src/app/(site)/products/[slug]/page.tsx` | SSG × 11 | `generateStaticParams` |
| `/projects` | `src/app/(site)/projects/page.tsx` | Static | **หน้าใหม่** |
| `/about` | `src/app/(site)/about/page.tsx` | Static | |
| `/news` | `src/app/(site)/news/page.tsx` | Static | |
| `/news/[slug]` | `src/app/(site)/news/[slug]/page.tsx` | SSG × 7 | |
| `/contact` | `src/app/(site)/contact/page.tsx` | Static | ฟอร์ม + แผนที่ |
| `/neocoat` | `src/app/neocoat/page.tsx` | Static | **Landing page** — index + อยู่ใน sitemap |
| `/thinner` | `src/app/thinner/page.tsx` | Static | **Landing page** — index + อยู่ใน sitemap |
| `/engineering` | `src/app/engineering/page.tsx` | Static | **Landing page** — index + อยู่ใน sitemap |
| `/four-plus` | `src/app/four-plus/page.tsx` | Static | **Landing page** — index + อยู่ใน sitemap |
| `/fire-blanket` | `src/app/fire-blanket/page.tsx` | Static | **Landing page** — index + อยู่ใน sitemap |
| `/sitemap.xml` | `src/app/sitemap.ts` | Static | สร้างจาก data + หน้า landing ทั้ง 5 |
| `/robots.txt` | `src/app/robots.ts` | Static | **ใหม่** — กัน `/admin`, `/api/`, `/concept-*` + ชี้ sitemap |
| 404 | `src/app/not-found.tsx` | Static | |

### Section ในหน้าแรก (ตามลำดับ — ตาม Concept B)

1. **Hero** — สไลด์แบนเนอร์ 3 รูป + h1 + การ์ดคู่ (สีกันไฟ / รับรองงาน) + แถบจุดเด่น 4 ช่อง
2. **สินค้าขายดี** — การ์ดเรือธง 330px + กริดสินค้า 6 ตัว
3. **เลือกสินค้าตามลักษณะงาน** — 8 การ์ดหมวด ลิงก์เข้าโครงสร้างเมนูใหม่
4. **Protect your Steel Structure** — บล็อกคำโปรย + เช็คลิสต์ 4 ข้อ + ภาพมี badge
5. **มาตรฐาน** — คำโปรยเอียง + ชิป 5 มาตรฐาน (พื้น shell)
6. **ผลงานที่ผ่านมาของเรา** — masonry 6 รูป
7. **BY BLUE RICH** — แถบ about ภาพทะลุขอบซ้าย + ตรา One Stop Service + สถิติ 4 ตัว
8. **สนใจสั่งซื้อ** — CTA ไลน์ + เบอร์โทร + โมเดลจอมือถือ
9. **บทความสาระน่ารู้** — 3 บทความ (พื้น shell)
10. **คำถามที่พบบ่อย?** — ภาพ + accordion 6 ข้อ (`src/data/faq.ts`)

รูปสไลด์ใช้ `banner-mock-1/2/3.jpg` ซึ่งเป็น**ภาพหน้างานจริง**ที่ครอปเป็นสัดส่วนแบนเนอร์
(ชื่อไฟล์ติดคำว่า mock มาตั้งแต่ตอนทำคอนเซปต์) — เปลี่ยนเป็นแบนเนอร์ออกแบบได้ทันทีเมื่อลูกค้าส่งไฟล์มา

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

### การทำ index (อัปเดตรอบล่าสุด)

เดิมทั้ง 5 หน้าตั้ง `robots: { index: false }` และไม่อยู่ใน sitemap เพราะตั้งใจให้เป็นหน้ายิงแอดอย่างเดียว
ลูกค้าขอให้**เปิดให้ติดอันดับ**เหมือนของ Infinite จึงเปลี่ยนเป็น

- ถอด `robots` ออก แล้วใส่ `alternates.canonical` ชี้กลับหาตัวเอง
- ใส่ทั้ง 5 route ใน `sitemap.ts` ที่ priority `0.9` (สูงกว่าหน้าทั่วไปที่ `0.8`)
- เพิ่ม `src/app/robots.ts` — เดิมเว็บไม่มี robots.txt เลย บอตจึงคลาน `/concept-b|c|d`
  ซึ่งเป็น HTML ดีไซน์ต้นแบบใน `public/` ที่เนื้อหาซ้ำกับหน้าจริงได้

**จุดที่ต้องเฝ้าดู** — คำค้นอาจชนกันเองระหว่าง LP กับหน้าในเมนู แบ่งไว้ดังนี้
`/neocoat` เอาคำระดับหมวด (สีกันไฟโครงสร้างเหล็ก) · `/products/neocoat-*` เอาคำรายรุ่น ·
`/intumescent` เป็นหน้าหมวดในเมนู ถ้า 3 เดือนแล้ว Search Console ขึ้นว่าแย่งกันเอง
ให้เลือกหน้าเดียวเป็นตัวหลักต่อคำค้น แล้ว canonical ที่เหลือมาหาหน้านั้น

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
| `/engineering` → ฐานกฎหมายใต้การ์ดบริการ + เช็กลิสต์เอกสารขออนุญาต 7 ข้อ | **ใหม่** — ดึงเนื้อหามาจากหน้า `/engineering` ของ Infinite (กฎกระทรวงฉบับที่ 48 / 60, กฎกระทรวง พ.ศ. 2567, รายการเอกสาร กนอ.) | ❗ **สำคัญ** ต้องให้วุฒิวิศวกรของลูกค้ายืนยันว่าอ้างฉบับถูกต้องก่อน publish |
| `น.4-5 / น.4-9` → ตัวย่อหน่วยงาน | เดิมเขียน **"แบบ กสอ."** แก้เป็น **"แบบ กนอ."** ตามที่หน้าของ Infinite ใช้ (กนอ. = การนิคมอุตสาหกรรมฯ ซึ่งเป็นผู้ออกใบอนุญาตก่อสร้างในนิคม ส่วน กสอ. = กรมส่งเสริมอุตสาหกรรม ไม่ได้ออกใบอนุญาตอาคาร) | ⚠️ แก้เฉพาะใน `engineering-lp.ts` — **`src/data/site.ts` → `standards[nor-4-5-4-9]` ยังเขียน "กสอ." อยู่** รอลูกค้ายืนยันก่อนแก้ให้ตรงกันทั้งเว็บ |
| `/four-plus` → อัตราการทาได้ | เว็บเราใช้ **150 ตร.ม./ถัง/เที่ยว** ตาม `products.ts` แต่หน้าของ Infinite ระบุเป็นช่วง **120–150** | ⚠️ ยังไม่แก้ เพราะจะไปขัดกับหน้าสินค้าทั้งเว็บ — ขอให้ลูกค้าเช็ก TDS ว่าเลขไหนถูก ถ้าเป็นช่วง ต้องแก้ทั้ง `products.ts`, `four-plus-lp.ts` และตารางคำนวณจำนวนถัง (ควรคิดจาก 120 เพื่อไม่ให้ลูกค้าสั่งขาด) |
| ผลทดสอบ → ISO 9001:2015 ฉบับ PDF | Infinite มีไฟล์ให้โหลดที่ `/docs/iso-9001-2015-certificate.pdf` แต่ `public/docs/` ของเรา**ยังไม่มีไฟล์นี้** | ⚠️ ขอไฟล์จากลูกค้า (เป็นใบรับรองของโรงงานผู้ผลิต) แล้วเพิ่มใน `reports.items` ของ `/neocoat` และ `/engineering` |

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
