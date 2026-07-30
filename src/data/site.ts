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
  phones: ["099-458-6692", "061-421-5422", "086-339-4682"],
  email: "bluerich.sale@gmail.com",
  lineId: "blue999",
  hours: "จันทร์ – เสาร์  08:00 – 17:30 น.",
  mapQuery:
    "288/60 หมู่บ้านบุราสิริ ปัญญาอินทรา ถนนเลียบคลองสอง แขวงบางชัน เขตคลองสามวา กรุงเทพมหานคร 10510",
} as const;

export const nav = [
  { href: "/", label: "หน้าหลัก" },
  { href: "/products", label: "สินค้า" },
  { href: "/projects", label: "ผลงาน" },
  { href: "/about", label: "เกี่ยวกับเรา" },
  { href: "/news", label: "บทความ" },
  { href: "/contact", label: "ติดต่อเรา" },
] as const;

export const telHref = `tel:${site.phones[0].replace(/-/g, "")}`;
export const lineHref = `https://line.me/ti/p/~${site.lineId}`;
export const mailHref = `mailto:${site.email}`;
export const mapHref = `https://maps.google.com/?q=${encodeURIComponent(site.mapQuery)}`;
export const mapEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.mapQuery,
)}&z=16&output=embed`;

export const standards = [
  { label: "ASTM E-119", note: "ทดสอบโดยจุฬาลงกรณ์มหาวิทยาลัย" },
  { label: "ISO 834", note: "ทดสอบ ณ ประเทศมาเลเซีย" },
  { label: "ISO 9001 : 2015", note: "ระบบบริหารคุณภาพโรงงานผู้ผลิต" },
  { label: "กฎกระทรวง พ.ศ. 2567", note: "การออกแบบโครงสร้างอาคาร" },
  { label: "แบบ กสอ. น.4-5 / น.4-9", note: "รับรองโดยวุฒิวิศวกรโยธา" },
];

export const stats = [
  { value: "15+", label: "ปีประสบการณ์งานสีกันไฟ" },
  { value: "3 ชม.", label: "อัตราการทนไฟสูงสุดที่รับรอง" },
  { value: "1000°C", label: "อุณหภูมิสูงสุดของผ้ากันไฟ" },
  { value: "100%", label: "งานรับรองโดยวุฒิวิศวกร" },
];
