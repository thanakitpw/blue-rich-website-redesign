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

จากเดิม **5 หน้า** → **8 routes** (build ออกมา 25 หน้า)

| Route | ไฟล์ | ประเภท | หมายเหตุ |
|---|---|---|---|
| `/` | `src/app/page.tsx` | Static | 12 section |
| `/products` | `src/app/products/page.tsx` | **Dynamic** | อ่าน `?cat=` เพื่อกรองหมวด |
| `/products/[slug]` | `src/app/products/[slug]/page.tsx` | SSG × 8 | `generateStaticParams` |
| `/projects` | `src/app/projects/page.tsx` | Static | **หน้าใหม่** |
| `/about` | `src/app/about/page.tsx` | Static | |
| `/news` | `src/app/news/page.tsx` | Static | |
| `/news/[slug]` | `src/app/news/[slug]/page.tsx` | SSG × 7 | |
| `/contact` | `src/app/contact/page.tsx` | Static | ฟอร์ม + แผนที่ |
| `/sitemap.xml` | `src/app/sitemap.ts` | Static | สร้างจาก data |
| 404 | `src/app/not-found.tsx` | Static | |

### Section ในหน้าแรก (ตามลำดับ)

1. **Hero** — headline + CTA + trust chips + diamond collage + แถบติดต่อด่วน 3 ช่อง
2. **Marquee มาตรฐาน** — ASTM E-119 / ISO 834 / ISO 9001 / กฎกระทรวง 2567 / น.4-5, น.4-9
3. **หมวดหมู่สินค้า** — 4 การ์ด
4. **สินค้าเรือธง** — Neocoat Intumescent Paint
5. **Best Seller** — 3 สินค้า + การ์ด "ดูทั้งหมด"
6. **ทำไมต้องเลือกเรา** — 4 จุดแข็ง + แถบสถิติ 4 ตัว
7. **ขั้นตอนการทำงาน** — 4 สเต็ป
8. **ผลงาน** — 6 รูป (ลิงก์ไป `/projects`)
9. **บริการรับรองงาน** — รูปเอกสาร + รายการเอกสาร 4 อย่าง
10. **รีวิวลูกค้า** — 3 รีวิว
11. **บทความ** — 3 บทความล่าสุด
12. **CTA band**

---

## 5. Data Layer

เนื้อหาทั้งหมดแยกเป็นไฟล์ TS ไม่ฝังใน component — แก้เนื้อหาได้โดยไม่ต้องแตะ UI

| ไฟล์ | เนื้อหา |
|---|---|
| `src/data/site.ts` | ชื่อบริษัท, ที่อยู่, เบอร์, อีเมล, LINE, เมนู, มาตรฐาน, สถิติ, helper links (`telHref`, `lineHref`, `mapEmbed`, …) |
| `src/data/products.ts` | 4 หมวดหมู่ + 8 สินค้า (พร้อม specs, highlights, gallery) |
| `src/data/news.ts` | 7 บทความ (พร้อม body เต็ม) |
| `src/data/projects.ts` | 16 ผลงาน (พร้อม caption + span สำหรับ grid) |

### สินค้า 8 รายการ

| รหัส | ชื่อ | หมวด | อ้างอิง datasheet |
|---|---|---|---|
| A014 | สีกันไฟ–สีทนไฟ Neocoat Intumescent Paint | สีกันไฟ | — |
| A015 | Neocoat Primer 3000 | สีรองพื้น | — |
| A013 | น้ำมันสนอินทนิล | น้ำมันสน/ทินเนอร์ | — |
| A012 | ทินเนอร์อินทนิล AAA (3A) | น้ำมันสน/ทินเนอร์ | — |
| A004 | ผ้ากันไฟซิลิก้าเคลือบซิลิโคน | ผ้ากันไฟ | HERA **STR850** |
| A005 | ผ้ากันไฟผ้าใยแก้วไฟเบอร์กลาส | ผ้ากันไฟ | HERA **HT800** |
| A006 | ผ้ากันไฟซิลิก้า | ผ้ากันไฟ | HERA **ST750** |
| A007 | ผ้ากันไฟผ้าใยแก้วเคลือบซิลิโคน | ผ้ากันไฟ | HERA **SC470** |

spec ของผ้ากันไฟ (ความหนา/หน้ากว้าง/น้ำหนัก/อุณหภูมิ) ถอดมาจาก datasheet HERA ที่อยู่ในเว็บเดิม

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
