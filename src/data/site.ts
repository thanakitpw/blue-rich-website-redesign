export const site = {
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
  mapQuery:
    "288/60 หมู่บ้านบุราสิริ ปัญญาอินทรา ถนนเลียบคลองสอง แขวงบางชัน เขตคลองสามวา กรุงเทพมหานคร 10510",
} as const;

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

/** The two numbers the client wants in the header bar — 099 and 092. */
export const headerPhones = [site.phones[0], site.phones[3]];

export const telHref = `tel:${site.phones[0].replace(/-/g, "")}`;
export const lineHref = `https://line.me/ti/p/~${site.lineId}`;
/* Second LINE channel. It is an invite link with no public ID, so nothing is
   displayed next to it — only the label. */
export const lineHref2 = "https://line.me/ti/p/rm4kjFGlC0";

/** Both LINE channels, for the places that list every contact route. */
export const lineChannels = [
  { href: lineHref, label: `@${site.lineId}`, aria: `แอดไลน์ @${site.lineId}` },
  { href: lineHref2, label: null, aria: "แอดไลน์ ช่องทางที่ 2" },
] as const;
export const mailHref = `mailto:${site.email}`;
export const mapHref = `https://maps.google.com/?q=${encodeURIComponent(site.mapQuery)}`;
export const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.mapQuery,
)}&z=16&output=embed`;

export const standards = [
  { label: "ASTM E-119", note: "ทดสอบโดยจุฬาลงกรณ์มหาวิทยาลัย" },
  { label: "ISO 834", note: "ทดสอบ ณ ประเทศมาเลเซีย" },
  { label: "กฎกระทรวง พ.ศ. 2567", note: "การออกแบบโครงสร้างอาคาร" },
  { label: "แบบ กสอ. น.4-5 / น.4-9", note: "รับรองโดยวุฒิวิศวกรโยธา" },
];

export const stats = [
  { value: "15+", label: "ปีประสบการณ์งานสีกันไฟ" },
  { value: "1000°C", label: "อุณหภูมิสูงสุดของผ้ากันไฟ" },
  { value: "100%", label: "งานรับรองโดยวุฒิวิศวกร" },
];
