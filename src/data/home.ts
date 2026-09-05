/**
 * เนื้อหาหน้าแรกที่เดิมเป็นค่าคงที่อยู่ใน src/app/(site)/page.tsx
 *
 * ย้ายออกมาเพื่อให้แก้ได้จากหลังบ้าน — ของจริงที่หน้าเว็บใช้มาจาก site_settings
 * ใน Supabase (ดู src/lib/cms/content.ts) ค่าที่นี่เป็นค่าตั้งต้นที่ใช้ตอน seed
 * และตอนที่ต่อฐานข้อมูลไม่ได้
 */

export type CategoryTile = {
  href: string;
  short: string;
  name: string;
  description: string;
  image: string;
  /** true = รูปถ่ายเต็มการ์ด · ไม่ใส่ = ภาพสินค้าตัดพื้นบนพื้นอ่อน */
  photo?: boolean;
};

/** สินค้าเรือธงในการ์ดใหญ่ทางซ้ายของแถบ "สินค้าขายดี" */
export const flagshipSlug = "neocoat-intumescent-paint-s";

/** ห้าใบเล็กที่ตามหลังการ์ดเรือธง */
export const bestSellerSlugs: string[] = [
  "neocoat-intumescent-paint-w",
  "neocoat-primer-grey-oxide",
  "fiberglass-cloth",
  "thinner-3a-intanin",
];

/**
 * การ์ดแปดใบใต้แบนเนอร์ ลำดับตามที่ลูกค้าสั่ง — สีกันไฟแยกเป็นสองสูตรมาก่อน
 * ตามด้วยงานวิศวกรสองบริการ แล้วจึงเป็นสินค้ากลุ่มอื่น
 */
export const categoryTiles: CategoryTile[] = [
  {
    href: "/products/neocoat-intumescent-paint-s",
    short: "Intumescent Paint-S",
    name: "สีกันไฟ สูตรน้ำมัน",
    description: "Neocoat Solvent Base ทา/พ่นโครงสร้างเหล็ก · ASTM E-119 · ISO 834",
    image: "/assets/products/neocoat-paint-s.png",
  },
  {
    href: "/products/neocoat-intumescent-paint-w",
    short: "Intumescent Paint-W",
    name: "สีกันไฟ สูตรน้ำ",
    description: "Neocoat Water Base ค่า VOC ต่ำ ไม่ใช้ทินเนอร์ เหมาะกับ Green Building",
    image: "/assets/products/neocoat-paint-w.png",
  },
  {
    href: "/fireproofing/certification",
    short: "Engineering Service",
    name: "วิศวกรรับรองสีกันไฟ",
    description: "จัดทำเอกสาร น.4-5 / น.4-9 รับรองโดยวุฒิวิศวกรโยธา",
    image: "/assets/service-certification.jpg",
    photo: true,
  },
  {
    href: "/fireproofing/supervision",
    short: "Site Supervision",
    name: "วิศวกรควบคุมสีกันไฟ",
    description: "ตรวจหน้างาน วัดความหนาฟิล์ม และบันทึกผลเป็นหลักฐาน",
    image: "/assets/service-supervision.jpg",
    photo: true,
  },
  {
    href: "/paint#steel-primer",
    short: "Primer & Top Coat",
    name: "สีรองพื้น / ทับหน้า",
    description: "Neocoat Primer Grey Oxide · Neogloss สีน้ำมันทาเหล็ก",
    image: "/assets/products/neocoat-primer.png",
  },
  {
    href: "/hardware",
    short: "Thinner & Turpentine",
    name: "ทินเนอร์ / น้ำมันสน",
    description: "ทินเนอร์ 3A ผสมสี อินทนิล · ทินเนอร์ 2K · น้ำมันสน",
    image: "/assets/products/thinner-3a-intanin.webp",
  },
  {
    href: "/products/fiberglass-cloth",
    short: "Fire Blanket",
    name: "ผ้ากันไฟ",
    description: "Fiberglass Cloth ผ้ากันไฟ / กันสะเก็ดไฟ 550–1000°C",
    image: "/assets/products/fiberglass-cloth-panel-main.webp",
  },
  {
    href: "/paint#emulsion",
    short: "Emulsion Paint",
    name: "สีน้ำพลาสติก",
    description: "Four Plus ทาภายใน / ภายนอก และสีรองพื้นปูน",
    image: "/assets/products/four-plus-exterior.webp",
  },
];

export type ClientLogo = {
  name: string;
  /** เว้นว่าง = ช่องที่จองไว้ ยังไม่มีโลโก้ จะขึ้นเป็นกรอบเส้นประ */
  image: string;
};

/**
 * โลโก้ลูกค้าที่โชว์เหนือแถบผลงาน — วางเป็นสองแถว แถวละห้าช่องบนจอใหญ่
 * เพิ่ม/ลบ/สลับลำดับได้เองที่ /admin/home ช่องที่ยังไม่ใส่รูปจะขึ้นเป็นกรอบเส้นประ
 */
export const clients: ClientLogo[] = [
  { name: "PTT Global Chemical", image: "/assets/clients/ptt-global-chemical.png" },
  { name: "EGAT (กฟผ.)", image: "/assets/clients/egat.png" },
  { name: "SCG", image: "/assets/clients/scg.png" },
  { name: "การรถไฟแห่งประเทศไทย", image: "/assets/clients/srt.png" },
  { name: "CHANGAN", image: "/assets/clients/changan.png" },
  { name: "ไทวัสดุ", image: "/assets/clients/thai-watsadu.png" },
  { name: "Central", image: "/assets/clients/central.png" },
  { name: "HomePro", image: "/assets/clients/homepro.png" },
  { name: "BYD", image: "/assets/clients/byd.png" },
  { name: "BDC", image: "/assets/clients/bdc.jpg" },
];

/** เช็คลิสต์ในบล็อกจุดเด่นกลางหน้าแรก */
export const valuePoints: string[] = [
  "ฟิล์มสีขยายตัวเป็นฉนวนเมื่อโดนความร้อน",
  "คำนวณความหนาฟิล์มตามค่า Section Factor รายชิ้น",
  "ตรวจวัดความหนาฟิล์มทั้งขณะเปียกและเมื่อแห้ง",
  "ปิดงานด้วยเอกสารรับรองจากวุฒิวิศวกรโยธา",
];
