# Redirect Map — URL เว็บเดิม → เว็บใหม่

> หลักฐาน: Wayback Machine CDX (`web.archive.org/cdx/search/cdx?url=www.blue-rich.com/*`) พบ 37 URL ของเว็บเดิมที่เคยตอบ 200 (snapshot ล่าสุด 21 ม.ค. 2569)
> ทดสอบ production 11 ก.ย. 2569: `/About-`, `/Item-4`, `/News-159`, `/fire-paint` → **404 ทั้งหมด** ไม่มี redirect
> Google (`site:blue-rich.com`) ยังเก็บ `/News-159`, `/News-161`, `/News-163`, `/News-164`, `/download.php?file=…` และ `/Cat-276` (ติดอันดับคำ "รับรองสีกันไฟ วุฒิวิศวกร") อยู่

ชื่อหน้าเดิมอ่านจาก `<title>` ของ snapshot ใน Wayback (ไฟล์ดิบ: scratchpad `old-urls.json`)

## รูปแบบ URL เดิม

เว็บเดิมมี URL สองแบบต่อหน้า: `/Item-4` และ `/Item-4-4` (เลขซ้ำท้าย) ต้อง redirect ทั้งคู่
ใช้ regex ใน `next.config.ts` → `redirects()`:

```
source: "/:kind(Item|Cat|News)-:id(\\d+)-:dup(\\d+)"  → ส่งไปที่เดียวกับ /:kind-:id
```

## ตาราง

| URL เดิม | ชื่อหน้าเดิม | ปลายทางใหม่ | เหตุผล |
|---|---|---|---|
| `/About-` | ABOUT US | `/about` | หน้าเดียวกัน |
| `/Contact-` | CONTACT US | `/contact` | หน้าเดียวกัน |
| `/Cat-274` | สีสะท้อนความร้อน | `/paint` | สินค้าถูกถอดออก หมวดใกล้เคียงที่สุด |
| `/Cat-275` | สีรองพื้นกันสนิมเหล็ก | `/products/neocoat-primer-grey-oxide` | สินค้าตัวเดียวกัน |
| `/Cat-276` | สีกันไฟ-สีทนไฟ (ยังติดอันดับ "รับรองสีกันไฟ วุฒิวิศวกร") | `/intumescent` | หน้าหมวดสีกันไฟ |
| `/Cat-277` | น้ำมันสนและทินเนอร์ | `/hardware` | หมวดเดียวกัน |
| `/Cat-278` | สีสะท้อนความร้อน เซรามิคโค๊ตติ้ง | `/paint` | สินค้าถูกถอดออก |
| `/Cat-279` | สีน้ำมันเคลือบเงา | `/products/neogloss-enamel` | สินค้าใกล้เคียงที่สุด |
| `/Cat-280` | สีกันซึม | `/paint` | ไม่มีสินค้ากันซึมแล้ว |
| `/Cat-282` | ผ้ากันไฟ | `/products/fiberglass-cloth` | สินค้าเดียวกัน |
| `/Cat-283` | รับรองงานสีกันไฟ | `/fireproofing` | บริการเดียวกัน |
| `/Cat-284` | งานระบบพื้นอุตสาหกรรม | `/projects` | ไม่มีบริการนี้แล้ว ส่งไปหน้าผลงาน |
| `/Item-1` | รูฟ ชิลด์ ไวท์ | `/paint` | สินค้าถูกถอดออก |
| `/Item-2` | บริการติดตั้ง งานพื้นอีพ็อกซี่ | `/projects` | ไม่มีบริการนี้แล้ว |
| `/Item-3` | บริการงานกันซึม | `/projects` | ไม่มีบริการนี้แล้ว |
| `/Item-4` | ผ้ากันไฟชิลิก้าเคลือบซิลิโคน | `/products/fiberglass-cloth` | รวมผ้ากันไฟทุกเกรดไว้หน้าเดียว |
| `/Item-5` | ผ้ากันไฟผ้าใยแก้วไฟเบอร์กลาส | `/products/fiberglass-cloth` | |
| `/Item-6` | ผ้ากันไฟซิลิก้า | `/products/fiberglass-cloth` | |
| `/Item-7` | ผ้ากันไฟผ้าใยแก้วเคลือบซิลิโคน | `/products/fiberglass-cloth` | |
| `/Item-8` | ทีโอเอ 201 รูฟซีล | `/paint` | สินค้าถูกถอดออก |
| `/Item-10` | ทีโอเอ กลิปตั้น | `/products/neogloss-enamel` | สีน้ำมันทาเหล็กเหมือนกัน |
| `/Item-11` | ซุปเปอร์การ์ด เอช อาร์ 999 | `/paint` | สินค้าถูกถอดออก |
| `/Item-12` | ทินเนอร์อินทนิล | `/products/thinner-3a-intanin` | สินค้าเดียวกัน |
| `/Item-13` | น้ำมันสนอินทนิล | `/products/turpentine-intanin` | สินค้าเดียวกัน |
| `/Item-14` | สีกันไฟ-สีทนไฟ Neocoat | `/products/neocoat-intumescent-paint-s` | สินค้าเดียวกัน |
| `/Item-15` | Neocoat Primer 3000 | `/products/neocoat-primer-grey-oxide` | สินค้าเดียวกัน |
| `/News-159` | เลือกกันซึมแบบไหนที่ใช้แล้วบ้านไม่รั่วซึม | `/news/choosing-waterproofing` | บทเดียวกัน |
| `/News-160` | เลือกวัสดุกันบ้านร้อนเป็นก็เย็นใจ | `/news/heat-insulation-materials` | บทเดียวกัน |
| `/News-161` | 5 วิธีกำจัดสนิมที่ถูกต้องและน่าลอง | `/news/5-ways-to-remove-rust` | บทเดียวกัน |
| `/News-162` | กฏกระทรวง | `/news/ministerial-regulation-2567` | บทเดียวกัน (ชื่อเดิมสั้น) |
| `/News-163` | รวม 8 อุปกรณ์ทาสีบ้าน ของมันต้องมี | `/news/8-house-painting-tools` | บทเดียวกัน |
| `/News-164` | เรื่องควรรู้เกี่ยวกับกฎหมายการป้องกันอัคคีภัย | `/news/fire-protection-law` | บทเดียวกัน |
| `/News-165` | (ไม่มีใน Wayback) | `/news/neocoat-fireproof-painting-project` | เดาจากลำดับวันที่ — ต้องยืนยัน |
| `/Item-9` | (ไม่มีใน Wayback) | `/products` | ไม่รู้ว่าเป็นอะไร ส่งไปแคตตาล็อก |
| `/download.php?file=*` | PDF เอกสาร (2 ไฟล์) | `/standards` | หน้าเอกสาร/ผลทดสอบใหม่ |
| `/fire-paint` | route เก่าของเว็บใหม่ (HANDOFF ระบุว่าเคยเป็นเมนู 2) | `/intumescent` | |

รวม 36 URL + regex 1 ตัวสำหรับรูปแบบเลขซ้ำ (`/Item-4-4`, `/Cat-276-276`, `/News-159-159`)

## หลังใส่ redirect

1. ทดสอบ `curl -sI` 5 URL: `/Cat-276`, `/Item-14`, `/News-159`, `/Item-4-4`, `/download.php?file=x` → ต้องได้ 308/301 ไปปลายทางถูกต้อง (ครั้งเดียว ไม่ยิงซ้ำ)
2. ใน Search Console → URL Inspection `/Cat-276` และ `/Item-14` → Request indexing ปลายทางใหม่
3. เช็คซ้ำอีก 30 วันว่า `site:blue-rich.com` ไม่มี URL แบบ `/Item-`, `/Cat-`, `/News-` เหลือ
