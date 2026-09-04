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
  phones: ["099-458-6692", "061-421-5422", "086-339-4682", "092-998-8452"],
  email: "bluerich.sale@gmail.com",
  lineId: "blue999",
  hours: "จันทร์ – เสาร์  08:00 – 17:30 น.",
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
  children?: NavChild[];
};

export const nav: NavItem[] = [
  { href: "/", label: "หน้าแรก" },
  {
    href: "/intumescent",
    label: "สีกันไฟ Neocoat",
    children: [
      {
        href: "/products/neocoat-intumescent-paint-s",
        label: "สีกันไฟสูตรน้ำมัน",
        note: "Intumescent Paint-S",
      },
      {
        href: "/products/neocoat-intumescent-paint-w",
        label: "สีกันไฟสูตรน้ำ",
        note: "Intumescent Paint-W",
      },
    ],
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
        href: "/hardware#thinner-wash",
        label: "ทินเนอร์ล้าง",
        note: "ล้างเครื่องมือช่างและอุปกรณ์",
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

/** เบอร์สองตัวที่ขึ้นบนแถบหัวเว็บ — ตัวแรกและตัวที่สี่ตามที่ลูกค้าเลือก */
export const headerPhonesOf = (s: SiteInfo) =>
  [s.phones[0], s.phones[3] ?? s.phones[1]].filter(Boolean) as string[];

/** ทั้งสองช่องทาง LINE สำหรับที่ที่ลิสต์ช่องทางติดต่อครบทุกทาง */
export const lineChannelsOf = (s: SiteInfo) => [
  { href: lineHrefOf(s), label: `@${s.lineId}`, aria: `แอดไลน์ @${s.lineId}` },
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

export type Standard = { label: string; note: string };

export const standards: Standard[] = [
  { label: "ASTM E-119", note: "ทดสอบโดยจุฬาลงกรณ์มหาวิทยาลัย" },
  { label: "ISO 834", note: "ทดสอบ ณ ประเทศมาเลเซีย" },
  { label: "กฎกระทรวง พ.ศ. 2567", note: "การออกแบบโครงสร้างอาคาร" },
  { label: "แบบ กสอ. น.4-5 / น.4-9", note: "รับรองโดยวุฒิวิศวกรโยธา" },
];

export type Stat = { value: string; label: string };

export const stats: Stat[] = [
  { value: "15+", label: "ปีประสบการณ์งานสีกันไฟ" },
  { value: "1000°C", label: "อุณหภูมิสูงสุดของผ้ากันไฟ" },
  { value: "100%", label: "งานรับรองโดยวุฒิวิศวกร" },
];
