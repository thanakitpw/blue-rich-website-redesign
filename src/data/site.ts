/**
 * ข้อมูลบริษัทที่แสดงทั่วเว็บ
 *
 * ชุดนี้เป็น "ค่าตั้งต้น" — ของจริงที่เว็บใช้มาจาก site_settings.company ใน
 * Supabase (ดู src/lib/cms/content.ts) ค่าตรงนี้ถูกใช้เมื่อยังไม่ได้ตั้งค่า
 * Supabase หรือต่อฐานข้อมูลไม่ติด เพื่อไม่ให้ทั้งเว็บหายไป
 *
 * ไม่ใช้ `as const` เพราะค่าที่อ่านจากฐานข้อมูลเป็น object ธรรมดา
 * ทั้งสองทางต้องเข้ากันได้กับ type เดียวกัน
 */
export type SiteInfo = {
  name: string;
  shortName: string;
  nameEn: string;
  tagline: string;
  description: string;
  url: string;
  address: string;
  addressShort: string;
  phones: string[];
  email: string;
  lineId: string;
  /** ช่องทาง LINE ที่สอง เป็นลิงก์เชิญที่ไม่มี ID สาธารณะ จึงเก็บทั้ง URL */
  lineHref2: string;
  hours: string;
  mapQuery: string;
};

export const site: SiteInfo = {
  name: "บริษัท บลูริช แมททีเรียล โปรดักส์ จำกัด",
  shortName: "Blue Rich",
  nameEn: "Blue Rich Material Products Co., Ltd.",
  tagline: "สีกันไฟโครงสร้างเหล็ก รับรองโดยวุฒิวิศวกร",
  description:
    "ผู้จำหน่ายสีกันไฟ-สีทนไฟ Neocoat Intumescent Paint สีรองพื้นกันสนิม น้ำมันสน ทินเนอร์ และผ้ากันไฟ พร้อมบริการรับรองงานสีกันไฟโดยวุฒิวิศวกร ตามกฎกระทรวง พ.ศ. 2567",
  url: "https://www.blue-rich.com",
  address:
    "หมู่บ้านบุราสิริ ปัญญาอินทรา เลขที่ 288/60 ถนนเลียบคลองสอง แขวงบางชัน เขตคลองสามวา กรุงเทพมหานคร 10510",
  addressShort: "แขวงบางชัน เขตคลองสามวา กรุงเทพฯ 10510",
  /* ลำดับในลิสต์นี้เป็นตัวกำหนดว่าเบอร์ไหนโผล่ที่ไหน เรียงใหม่ในหลังบ้านได้เลย
       เบอร์ที่ 1      → ปุ่มโทรทุกที่ทั่วเว็บที่มีปุ่มเดียว (ดู telHrefOf)
       สองเบอร์แรก    → ปุ่มโทรลอยมุมขวาล่าง
       สามเบอร์แรก    → แถบหัวเว็บ (ดู headerPhonesOf) และบล็อกสั่งซื้อหน้าแรก
       ทั้งหมด        → ท้ายเว็บ หน้าติดต่อเรา และหน้า landing */
  phones: ["099-458-6692", "092-998-8452", "061-421-5422"],
  email: "bluerich.sale@gmail.com",
  lineId: "blue999",
  hours: "จันทร์ – เสาร์  08:00 – 17:00 น.",
  lineHref2: "https://line.me/ti/p/rm4kjFGlC0",
  mapQuery:
    "288/60 หมู่บ้านบุราสิริ ปัญญาอินทรา ถนนเลียบคลองสอง แขวงบางชัน เขตคลองสามวา กรุงเทพมหานคร 10510",
};

/* ------------------------------------------------------------------ nav tree
 *
 * The nine top-level entries and their children follow the structure the
 * client drew by hand (items 1–9, with sub-lists under 2, 3, 4 and 5).
 * Children point at the real page that already covers them — the two Neocoat
 * formulas and the individual products go straight to their product pages,
 * so no duplicate content is created for the sake of the menu.
 */

export type NavChild = {
  href: string;
  label: string;
  /** One-line description shown in the desktop dropdown. */
  note?: string;
};

export type NavItem = {
  href: string;
  label: string;
  /** บรรทัดที่สองใต้ชื่อเมนูหลัก ใช้กับเมนูที่ชื่อไทยไม่ได้บอกชื่อรุ่นสินค้า */
  note?: string;
  children?: NavChild[];
};

export const nav: NavItem[] = [
  { href: "/", label: "หน้าแรก" },
  /* สองสูตรนี้เคยเป็นเมนูย่อยใต้ "สีกันไฟ Neocoat" ลูกค้าขอให้ยกขึ้นมาเป็นเมนูหลัก
     เพราะเป็นสินค้าที่คนค้นหาตรง ๆ ไม่ควรต้องกดเปิด dropdown ก่อน
     หน้าหมวด /intumescent จึงไม่มีลิงก์ในเมนูแล้ว แต่ยังลิงก์จากหน้าแรกและ /paint
     และถูกใส่ใน sitemap.ts แยกไว้ต่างหาก เพื่อไม่ให้หลุดจาก sitemap ไปด้วย */
  {
    href: "/products/neocoat-intumescent-paint-s",
    label: "สีกันไฟสูตรน้ำมัน",
    note: "Neocoat Intumescent Paint-S",
  },
  {
    href: "/products/neocoat-intumescent-paint-w",
    label: "สีกันไฟสูตรน้ำ",
    note: "Neocoat Intumescent Paint-W",
  },
  {
    href: "/fireproofing",
    label: "รับรองสีกันไฟ",
    children: [
      {
        href: "/fireproofing/certification",
        label: "วิศวกรรับรองสีกันไฟ",
        note: "คำนวณ ตรวจหน้างาน และเซ็นเอกสารโดยวุฒิวิศวกรโยธา",
      },
      {
        href: "/fireproofing/supervision",
        label: "วิศวกรควบคุมสีกันไฟ",
        note: "ตรวจหน้างาน วัดความหนาฟิล์ม และบันทึกผลเป็นหลักฐาน",
      },
    ],
  },
  {
    href: "/paint",
    label: "สีน้ำ/สีน้ำมัน",
    children: [
      {
        href: "/products/neocoat-primer-grey-oxide",
        label: "สีรองพื้นกันสนิมทาเหล็ก",
        note: "Neocoat Primer Grey Oxide",
      },
      {
        href: "/products/neogloss-enamel",
        label: "สีทับหน้าเหล็ก",
        note: "Neogloss สีน้ำมันทาเหล็ก",
      },
      {
        href: "/products/four-plus-pro-masonry-sealer",
        label: "สีรองพื้นปูนใหม่/เก่า",
        note: "Four Plus Pro Masonry Sealer",
      },
      {
        href: "/paint#emulsion",
        label: "สีน้ำพลาสติก",
        note: "Four Plus ภายใน–ภายนอก",
      },
    ],
  },
  {
    href: "/hardware",
    label: "ฮาร์ดแวร์",
    children: [
      {
        href: "/products/thinner-3a-intanin",
        label: "ทินเนอร์ 3A",
        note: "ผสมสี อินทนิล",
      },
      {
        /* เดิมชี้ไปที่หัวข้อในหน้าฮาร์ดแวร์ ตอนนี้มีหน้าสินค้าของตัวเองแล้วจึงชี้ตรงเข้าไป
           หัวข้อในหน้าฮาร์ดแวร์ยังอยู่เหมือนเดิม แค่ไม่ได้เป็นปลายทางของเมนูแล้ว */
        href: "/products/thinner-wash-aaa",
        label: "ทินเนอร์ล้าง",
        note: "แกลลอน 1.9 กก. ผสมสีและล้างอุปกรณ์",
      },
      {
        href: "/products/turpentine-intanin",
        label: "น้ำมันสน",
        note: "น้ำมันสนผสมสี อินทนิล",
      },
      {
        href: "/products/thinner-2k",
        label: "ทินเนอร์ 2K",
        note: "งานสีรถยนต์",
      },
      {
        href: "/products/fiberglass-cloth",
        label: "ผ้ากันไฟ",
        note: "Fiberglass Cloth",
      },
    ],
  },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/projects", label: "ผลงานของเรา" },
  { href: "/news", label: "บทความ" },
  { href: "/contact", label: "ติดต่อเรา" },
];

/** Every routable page in the tree — used by the sitemap. */
export const navRoutes = nav.flatMap((item) => [
  item.href,
  ...(item.children ?? []).map((c) => c.href),
]);

/* ------------------------------------------------------------ derived links
 *
 * รับ SiteInfo เข้ามาแทนที่จะอ่านจากตัวแปร `site` ตรงๆ เพราะข้อมูลบริษัทแก้ได้
 * จากหลังบ้านแล้ว ลิงก์พวกนี้จึงต้องคำนวณจากค่าที่กำลังใช้จริง ณ ตอนนั้น
 * ไม่ใช่จากค่าตั้งต้นในไฟล์นี้
 */
export const telHrefOf = (s: SiteInfo) => `tel:${(s.phones[0] ?? "").replace(/-/g, "")}`;
export const lineHrefOf = (s: SiteInfo) => `https://line.me/ti/p/~${s.lineId}`;
export const mailHrefOf = (s: SiteInfo) => `mailto:${s.email}`;
export const mapHrefOf = (s: SiteInfo) =>
  `https://maps.google.com/?q=${encodeURIComponent(s.mapQuery)}`;
export const mapEmbedOf = (s: SiteInfo) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&z=16&output=embed`;

/** เบอร์ที่ขึ้นบนแถบหัวเว็บ — สามตัวแรกของลิสต์ เท่าที่แถบด้านขวาบนรับไหว
    ลูกค้าสลับลำดับเบอร์ในหลังบ้านได้ เบอร์ที่อยากให้ขึ้นก็ย้ายมาไว้ต้นลิสต์ */
export const headerPhonesOf = (s: SiteInfo) => s.phones.slice(0, 3).filter(Boolean);

/** ทั้งสองช่องทาง LINE สำหรับที่ที่ลิสต์ช่องทางติดต่อครบทุกทาง */
export const lineChannelsOf = (s: SiteInfo) => [
  { href: lineHrefOf(s), label: s.lineId, aria: `แอดไลน์ ${s.lineId}` },
  { href: s.lineHref2, label: null, aria: "แอดไลน์ ช่องทางที่ 2" },
];

/**
 * ข้อมูลบริษัท + เมนู + ลิงก์ที่คำนวณจากทั้งสองอย่าง มัดรวมเป็นก้อนเดียว
 *
 * client component อ่านก้อนนี้ผ่าน useSite() ส่วน server component เรียก
 * bundleFor() เองได้ตรงๆ ทั้งสองฝั่งจึงคำนวณลิงก์ด้วยสูตรเดียวกันเสมอ
 */
export type SiteBundle = {
  site: SiteInfo;
  nav: NavItem[];
  telHref: string;
  lineHref: string;
  lineHref2: string;
  mailHref: string;
  mapHref: string;
  mapEmbed: string;
  headerPhones: string[];
  lineChannels: ReturnType<typeof lineChannelsOf>;
};

export const bundleFor = (s: SiteInfo, navItems: NavItem[]): SiteBundle => ({
  site: s,
  nav: navItems,
  telHref: telHrefOf(s),
  lineHref: lineHrefOf(s),
  lineHref2: s.lineHref2,
  mailHref: mailHrefOf(s),
  mapHref: mapHrefOf(s),
  mapEmbed: mapEmbedOf(s),
  headerPhones: headerPhonesOf(s),
  lineChannels: lineChannelsOf(s),
});

/* ค่าตั้งต้นของลิงก์เหล่านี้ คำนวณจาก `site` ด้านบน
   ใช้ในที่ที่ยังไม่ได้ต่อกับข้อมูลจากหลังบ้าน (เช่น metadata ตอน build) */
export const telHref = telHrefOf(site);
export const lineHref = lineHrefOf(site);
export const lineHref2 = site.lineHref2;
export const mailHref = mailHrefOf(site);
export const mapHref = mapHrefOf(site);
export const mapEmbed = mapEmbedOf(site);
export const headerPhones = headerPhonesOf(site);
export const lineChannels = lineChannelsOf(site);

/**
 * มาตรฐานที่ผลิตภัณฑ์และงานรับรองอ้างอิง
 *
 * label กับ note ถูกใช้เป็นชิปสั้นๆ อยู่หลายที่ (หน้าเกี่ยวกับเรา ท้าย landing
 * page) ส่วน slug/image/eyebrow/title/body/points ใช้กับการ์ดสามใบบนหน้าแรก
 * และหน้า /standards ที่กางรายละเอียดทีละมาตรฐาน — `slug` คือ anchor ที่การ์ด
 * หน้าแรกลิงก์เข้าไป
 *
 * รูปที่ใส่ไว้ตอนนี้เป็นรูป mock หยิบจากคลังรูปเดิมของเว็บ รอรูปจริงจากลูกค้า
 * เปลี่ยนได้ที่ field `image` ของแต่ละอัน
 */
export type Standard = {
  slug: string;
  label: string;
  note: string;
  image: string;
  /** "contain" สำหรับรูปที่เป็นเอกสารแนวตั้ง — ต้องเห็นทั้งแผ่น ห้ามครอบตัด
      ถ้าไม่ใส่จะครอบเต็มกรอบแบบรูปถ่ายทั่วไป */
  fit?: "cover" | "contain";
  eyebrow: string;
  title: string;
  body: string[];
  points: string[];
  docs?: { label: string; href: string }[];
};

export const standards: Standard[] = [
  {
    slug: "astm-e119",
    label: "ASTM E-119",
    note: "ทดสอบโดยจุฬาลงกรณ์มหาวิทยาลัย",
    image: "/assets/cert-astm-e119-chula.webp",
    fit: "contain",
    eyebrow: "Fire Test Standard",
    title: "ASTM E-119 — มาตรฐานทดสอบการทนไฟของชิ้นส่วนอาคาร",
    body: [
      "ASTM E-119 เป็นมาตรฐานทดสอบการทนไฟของชิ้นส่วนอาคาร โดยเผาตัวอย่างในเตาทดสอบตามเส้นโค้งอุณหภูมิ–เวลาที่กำหนด แล้ววัดว่าชิ้นส่วนยังทำหน้าที่ของมันได้นานเท่าใด ผลที่ได้คืออัตราการทนไฟเป็นชั่วโมง ซึ่งเป็นตัวเลขที่ใช้อ้างอิงในแบบและเอกสารขออนุญาต",
      "ระบบสีกันไฟ Neocoat ผ่านการทดสอบวัสดุป้องกันไฟ จากศูนย์วิจัยเพื่อความปลอดภัยจากอัคคีภัย ภาควิชาวิศวกรรมโยธา จุฬาลงกรณ์มหาวิทยาลัย",
    ],
    points: [
      "ทดสอบการทนไฟตามเส้นโค้งอุณหภูมิ–เวลามาตรฐาน",
      "ผลทดสอบระบุอัตราการทนไฟเป็นชั่วโมง",
      "ใช้แนบกับเอกสารรับรองงานสีกันไฟรายโครงการได้",
    ],
    /* รายงานของ TÜV SÜD ย้ายไปอยู่การ์ดมาตรฐานของตัวเองแล้ว ไม่แปะซ้ำตรงนี้ */
    docs: [
      { label: "ASTM E-119 — จุฬาลงกรณ์มหาวิทยาลัย", href: "/docs/astm-e119-chula-2008.pdf" },
    ],
  },
  {
    slug: "tuv-sud",
    label: "TÜV SÜD",
    note: "รายงานทดสอบโดยหน่วยงานอิสระ",
    image: "/assets/cert-astm-e119-tuv.webp",
    fit: "contain",
    eyebrow: "Independent Third-Party Report",
    title: "TÜV SÜD — รายงานผลทดสอบจากหน่วยงานอิสระระดับสากล",
    body: [
      "TÜV SÜD เป็นหน่วยงานตรวจสอบและรับรองอิสระระดับสากล ไม่ได้เป็นผู้ผลิตหรือผู้ขายสินค้า ผลทดสอบที่ออกโดยหน่วยงานลักษณะนี้จึงมีน้ำหนักต่างจากผลทดสอบที่ผู้ผลิตทำเอง",
      "TÜV SÜD (ประเทศไทย) ทดสอบความทนไฟของสีกันไฟชนิดขยายตัวให้กับ Unique Products (Thailand) ผู้ผลิต Neocoat รายงานเลขที่ BLS/R24/8044 ลงวันที่ 7 มกราคม 2568 ทดสอบเมื่อ 26 พฤศจิกายน 2567 ดาวน์โหลดฉบับเต็มตรวจสอบได้",
    ],
    points: [
      "ทดสอบโดยหน่วยงานอิสระ ไม่ใช่การทดสอบภายในของผู้ผลิต",
      "เป็นการทดสอบเพื่อการวิจัยและพัฒนา ใช้ระเบียบวิธีอ้างอิงตาม ASTM E119-24",
      "ตัวรายงานระบุไว้เองว่าชิ้นทดสอบถูกปรับให้ตรงกับวัตถุประสงค์ของการวิจัย จึงไม่ใช่การทดสอบที่สอดคล้องกับ ASTM E119-24 ครบทุกข้อ",
    ],
    docs: [{ label: "ASTM E-119 — TÜV SÜD", href: "/docs/astm-e119-tuv-2025.pdf" }],
  },
  {
    slug: "iso-834",
    label: "ISO 834",
    note: "ทดสอบ ณ ประเทศมาเลเซีย",
    image: "/assets/cert-iso-834-fsrg.webp",
    fit: "contain",
    eyebrow: "International Standard",
    title: "ISO 834 — มาตรฐานทดสอบการทนไฟระดับสากล",
    body: [
      "ISO 834 เป็นมาตรฐานทดสอบการทนไฟที่ใช้กันทั่วโลก หลักการเดียวกับ ASTM E-119 คือเผาตัวอย่างตามเส้นโค้งอุณหภูมิ–เวลาแล้ววัดระยะเวลาที่ชิ้นส่วนยังทำหน้าที่ได้ ต่างกันที่รายละเอียดของเงื่อนไขการทดสอบ",
      "ระบบสีกันไฟ Neocoat มีผลทดสอบตาม ISO 834 จากห้องปฏิบัติการ FSRG ณ ประเทศมาเลเซีย เลขที่รายงาน 2019/035 ดาวน์โหลดตรวจสอบได้",
    ],
    points: [
      "มาตรฐานทดสอบการทนไฟที่ใช้อ้างอิงในระดับสากล",
      "ทดสอบโดยห้องปฏิบัติการอิสระ ไม่ใช่การทดสอบภายใน",
      "ใช้คู่กับผล ASTM E-119 เพื่อยืนยันผลซ้ำ",
    ],
    docs: [{ label: "ISO 834 — FSRG 2019/035", href: "/docs/iso834-fsrg-2019-035.pdf" }],
  },
  {
    slug: "nor-4-5-4-9",
    label: "รับรองโดยวิศวกรโยธา",
    note: "ควบคุมงานโดยวิศวกรโยธา",
    image: "/assets/fireproofing-certification.jpg",
    eyebrow: "Engineer Certified",
    title: "เอกสารรับรองงานสีกันไฟ",
    body: [
      "งานสีกันไฟที่ถูกต้องตามกฎหมายต้องมีเอกสารรับรองโดยวุฒิวิศวกรโยธาและวิศวกรควบคุมงาน ตามแบบ น.4-5 (หนังสือแสดงความยินยอมของผู้ควบคุมงาน) และ น.4-9 (หนังสือรับรองของผู้ควบคุมงาน) พร้อมผลทดสอบตามมาตรฐาน ASTM E-119 หรือ ISO 834 ประกอบ",
      "เอกสารชุดนี้ต่างจากผลทดสอบผลิตภัณฑ์ — ผลทดสอบเป็นของตัวสี ส่วน น.4-5 / น.4-9 ออกให้เฉพาะโครงการของคุณ",
    ],
    points: [
      "คำนวณความหนาฟิล์มตามค่า Hp/A ของหน้าตัดจริงรายชิ้น",
      "ตรวจวัดความหนาฟิล์มหน้างานทั้งขณะเปียกและเมื่อแห้ง",
      "วิศวกรโยธาควบคุมงานสีกันไฟ",
    ],
  },
];

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "15+", label: "ปีประสบการณ์งานสีกันไฟ" },
  { value: "1000°C", label: "อุณหภูมิสูงสุดของผ้ากันไฟ" },
  { value: "100%", label: "งานรับรองโดยวุฒิวิศวกร" },
];
