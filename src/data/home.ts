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
  "roof-shield-ceramic",
];

/** การ์ดแปดใบของ Concept B ชี้ไปหน้าหมวดตามโครงสร้างเมนูใหม่ */
export const categoryTiles: CategoryTile[] = [
  {
    href: "/intumescent",
    short: "Intumescent Paint",
    name: "สีกันไฟ",
    description: "Neocoat Intumescent Paint-S · Solvent Base และสูตรน้ำ Low VOC",
    image: "/assets/products/neocoat-paint-s.png",
  },
  {
    href: "/paint#steel-primer",
    short: "Primer & Top Coat",
    name: "สีรองพื้น / ทับหน้า",
    description: "Neocoat Primer Grey Oxide · Neogloss สีน้ำมันทาเหล็ก",
    image: "/assets/products/neocoat-primer.png",
  },
  {
    href: "/products/fiberglass-cloth",
    short: "Fire Blanket",
    name: "ผ้ากันไฟ",
    description: "Fiberglass Cloth ผ้ากันไฟ / กันสะเก็ดไฟ 550–1000°C",
    image: "/assets/products/fiberglass-cloth-panel-main.webp",
  },
  {
    href: "/hardware",
    short: "Thinner & Turpentine",
    name: "ทินเนอร์ / น้ำมันสน",
    description: "ทินเนอร์ 3A ผสมสี อินทนิล · ทินเนอร์ 2K · น้ำมันสน",
    image: "/assets/products/thinner-3a-intanin.webp",
  },
  {
    href: "/products/roof-shield-ceramic",
    short: "Ceramic Coating",
    name: "เซรามิคสะท้อนร้อน",
    description: "Roof Shield สีเซรามิคสะท้อนความร้อน ลดอุณหภูมิใต้หลังคา",
    image: "/assets/products/roof-shield.png",
  },
  {
    href: "/paint#emulsion",
    short: "Emulsion Paint",
    name: "สีน้ำพลาสติก",
    description: "Four Plus ทาภายใน / ภายนอก และสีรองพื้นปูน",
    image: "/assets/products/four-plus-exterior.webp",
  },
  {
    href: "/fireproofing/certification",
    short: "Engineering Service",
    name: "วิศวกรรับรองงานสีกันไฟ",
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
];

/** เช็คลิสต์ในบล็อกจุดเด่นกลางหน้าแรก */
export const valuePoints: string[] = [
  "ฟิล์มสีขยายตัวเป็นฉนวนเมื่อโดนความร้อน",
  "คำนวณความหนาฟิล์มตามค่า Section Factor รายชิ้น",
  "ตรวจวัดความหนาฟิล์มทั้งขณะเปียกและเมื่อแห้ง",
  "ปิดงานด้วยเอกสารรับรองจากวุฒิวิศวกรโยธา",
];
