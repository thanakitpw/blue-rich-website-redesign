# SEO Audit Summary — Blue Rich Material Products

> Audit 11 ก.ย. 2569 · เว็บ https://www.blue-rich.com · Next.js 16 + Supabase CMS บน Vercel · 37 หน้าใน sitemap ตรวจครบทุกหน้า (+6 หน้าทดสอบ)
> วิธี: build ในเครื่องแล้ว crawl · production curl 12 ครั้ง · Wayback CDX สำหรับ URL เว็บเดิม · Google search 9 คำ · Lighthouse 3 หน้า (PageSpeed API โควตาเต็ม)
> ไม่มี Search Console/GA4 → ไม่มีข้อมูล impression, click, CrUX

## ภาพรวม

เว็บใหม่ทำ technical พื้นฐานไว้ดี (static, CDN, sitemap, robots, h1, next/image, OG) แต่ **ยังไม่ได้ต่อจากเว็บเดิม** และ **ยังไม่ได้บอก Google ว่าหน้าไหนคืออะไร**:

1. Google ยังจำเว็บเดิมอยู่ — URL เก่า 37 ตัว (`/Item-N`, `/Cat-N`, `/News-N`, `/About-`) ตอบ 404 หมด รวมถึง `/Cat-276` ที่ยังติดหน้าแรกคำ "รับรองสีกันไฟ วุฒิวิศวกร"
2. หน้าใน `(site)/` 32 หน้าไม่มี canonical · หน้าสินค้า 12 หน้าไม่มี Product schema · บทความ 7 บทไม่มี Article schema · ไม่มี BreadcrumbList เลย
3. คำอธิบายสินค้าทั้ง 12 หน้าเป็นข้อความผู้ผลิตที่ซ้ำกับตัวแทนจำหน่ายอย่างน้อย 5 โดเมน — คำ "สีกันไฟ Neocoat" หน้าแรกจึงเป็นของ kanfai / uoneplus / infinitematerialtech / kaiseeonline ไม่ใช่ Blue Rich
4. Landing page 5 หน้าที่ลูกค้าขอให้ติดอันดับ ไม่มีลิงก์เข้าเลยสักลิงก์
5. บทความเดิม 7 บทสั้น (180–330 คำ) 4 บทเป็นเรื่องบ้าน ไม่มีหัวข้อ/ลิงก์ และโมเดล `body: string[]` รองรับบทความยาวไม่ได้

จุดแข็งที่คู่แข่งไม่มี: ผลทดสอบ TÜV SÜD / จุฬาฯ / FSRG ดาวน์โหลดได้ + วุฒิวิศวกรรับรองเอง — ควรเป็นแกนของทั้ง content และ schema

## คะแนน (ประเมินจากสิ่งที่ตรวจได้)

| มิติ | คะแนน | สรุป |
|---|---|---|
| Technical | 55 / 100 | index/redirect กับ canonical ฉุด · infra + crawlability ดี |
| On-page | 60 / 100 | h1/title/desc มีครบ แต่ยาวเกิน 8+12 หน้า, alt ว่าง, ลิงก์ในเนื้อหาน้อยมาก |
| Content | 30 / 100 | สินค้า = สำเนา, บทความ = บาง + ผิดกลุ่ม, ไม่มีบทใหม่ 15 เดือน |
| Local | 45 / 100 | NAP ในเว็บตรงกัน แต่ขัดกับเว็บเดิม/Google · GBP ไม่ทราบ · schema ไม่ครบ |
| AI/AEO | 40 / 100 | FAQ 60 ข้อมีจริง ผลทดสอบมีจริง แต่ schema/llms.txt/ผู้เขียน ไม่มี |
| **รวม** | **46 / 100** | พื้นฐานดี งานที่เหลือเป็นงาน content + schema + เชื่อมต่อจากเว็บเดิม |

## จำนวนปัญหา

| Priority | จำนวน | ไฮไลต์ |
|---|---|---|
| P0 | 2 | redirect URL เก่า 37 ตัว · ไม่มี GSC/GA4 |
| P1 | 6 | canonical, schema, สินค้าซ้ำ, LP orphan, โมเดลบทความ, title/desc |
| P2 | 9 | ลิงก์ภายใน, LCP หน้าแรก, concept HTML, NAP, GBP, alt, PDPA, OG, ปีกฎกระทรวง |
| P3 | 5 | lastmod, redirect hop, llms.txt, หัวข้อคำถาม, a11y |

รายละเอียด + วิธีแก้ทุกข้อ: `action-priorities.md` · หลักฐานดิบ: `technical-audit.md`, `on-page-audit.md`, `content-audit.md`, `redirect-map.md`

## Quick wins (ทำได้ทันทีหลังผู้ดูแลอนุมัติ ไม่รอลูกค้า)

1. 301 redirect 36 URL + regex (P0-1) — 2 ชม.
2. canonical ทุกหน้า + `?cat` (P1-1) — 3 ชม.
3. ลบ `/concept-*` ออกจาก `public/` (P2-3) — 30 นาที
4. title/description ที่ยาวเกิน (P1-6) — 2 ชม.
5. Product/Article/BreadcrumbList/FAQPage schema (P1-2) — 8 ชม.

## ต้องได้จากลูกค้าก่อนทำต่อ

- สิทธิ์ Search Console (หรือ DNS TXT) + GA4
- ที่อยู่จริง 288/60 หรือ 288/438 · เบอร์ 092-998-8452 หรือ 086-339-4682 · เวลาทำการ · Google Business Profile มีไหม
- ชื่อ + เลขใบอนุญาตวุฒิวิศวกรที่เซ็น (สำหรับ author และบทความบริการ)
- ยืนยันปีกฎกระทรวง (2566 vs 2567) และฉบับที่อ้าง
- ตัดสินใจ LP: ติดอันดับเอง (ต้องลิงก์เข้า) หรือยิงแอดอย่างเดียว (noindex)
- โฟลเดอร์ Google Drive สำหรับ Doc บทความ

## Keyword และแผนบทความ

- `keyword-map.md` — 18 คำหลัก → หน้าเป้าหมาย + คู่แข่งจากการค้นจริง + คำที่ชนะได้เร็ว (ชื่อรุ่น Neocoat/อินทนิล, งานรับรอง น.4-5/น.4-9) vs ช้า (สีกันไฟ, ผ้ากันไฟ, ทินเนอร์ ที่ TOA/ร้านออนไลน์/ผู้นำเข้าครอง)
- `article-plan.md` — 12 บท: สีกันไฟ + งานรับรอง 9 บท, ผ้ากันไฟ/ทินเนอร์ 2 บท, เปรียบเทียบวัสดุกันไฟ 1 บท · ไม่มีกรณีศึกษาเพราะไม่มีข้อมูลโครงการจริง · บท #3 (กฎกระทรวง) ทับบทเดิม 2 บท เสนอรีไรต์ในที่เดิม + 301

## Checklist

artifact "แผน SEO Blue Rich" https://claude.ai/code/artifact/4a7c4724-bcd8-42c6-8614-430c2610b0e1 — 61 ข้อ ติ๊กได้ สถานะเก็บร่วมกัน (source: `plan-artifact.html` ในโฟลเดอร์นี้) · แบ่ง 9 เฟส: วัดผล → technical → schema/OG → on-page → internal link → บทความ → รูปและความเร็ว → local/off-page → วัดผล
