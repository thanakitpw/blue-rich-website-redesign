/**
 * แผนคีย์เวิร์ด SEO — ข้อมูลของหน้า /reports/seo-keywords
 *
 * หน้ารายงานให้ลูกค้าดู ไม่ผ่าน CMS ไม่อยู่ใน sitemap และ noindex
 * ที่มา: docs/seo-audit/2026-09-11/keyword-map.md (คีย์เวิร์ดหลัก → หน้าเป้าหมาย)
 * และ article-plan.md (บทความ 12 บท) · คีย์เวิร์ดเพิ่มเติม 60 คำจาก Google autocomplete (7 พ.ย. 2569)
 *
 * ตารางบทความในหน้าจริงอ่านจาก seo/blog/*.md
 * (ดู src/lib/reports/article-keywords.ts) `plannedArticles` ข้างล่างใช้เฉพาะ
 * ตอนที่ยังไม่มีไฟล์บทความ จะได้ไม่ต้องพิมพ์คีย์เวิร์ดซ้ำสองที่เมื่อบทความเขียนแล้ว
 */

export const reportMeta = {
  title: "แผนคีย์เวิร์ด SEO",
  domain: "www.blue-rich.com",
  /** วันที่จัดทำ เป็นข้อความไทยตรง ๆ เพราะหน้านี้ไม่ได้ใส่ schema */
  preparedOn: "11 กันยายน 2569",
  /** วันที่เพิ่มคีย์เวิร์ด 60 คำและบทความ 13–24 */
  updatedOn: "7 พฤศจิกายน 2569",
};

export const principles: { title: string; body: string }[] = [
  {
    title: "หนึ่งคีย์เวิร์ดหลักต่อหนึ่งหน้า",
    body: "แต่ละหน้ารับคำหลักคำเดียว เพื่อไม่ให้หน้าในเว็บเดียวกันแย่งอันดับกันเอง หน้าสินค้ารับชื่อรุ่น หน้าหมวดรับคำกว้าง บทความรับคำที่คนค้นเพื่อหาความรู้ก่อนตัดสินใจซื้อ",
  },
  {
    title: "เริ่มจากคำที่มีหลักฐานเหนือคู่แข่ง",
    body: "Blue Rich มีผลทดสอบ ASTM E-119 (จุฬาลงกรณ์มหาวิทยาลัย และ TÜV SÜD) กับ ISO 834 ให้ดาวน์โหลด และรับรองงานโดยวุฒิวิศวกรเอง คำในกลุ่มสีกันไฟและงานรับรอง น.4-5 / น.4-9 จึงมาก่อน ตามด้วยชื่อรุ่น Neocoat และอินทนิล ที่คู่แข่งเป็นตัวแทนจำหน่ายด้วยกัน",
  },
  {
    title: "คำกว้างใช้หน้าเฉพาะรับ ไม่หวังผลใน 6 เดือนแรก",
    body: "คำอย่าง สีกันไฟ ผ้ากันไฟ ทินเนอร์ มี TOA ร้านค้าออนไลน์ และผู้นำเข้าครองหน้าแรกอยู่ ให้หน้า landing รับคำเหล่านี้แยกจากหน้าสินค้า แล้ววัดผลจาก Search Console ทุกเดือนว่าคำไหนขยับ",
  },
];

export type KeywordType = "ซื้อ" | "บริการ" | "ความรู้" | "กฎหมาย" | "แบรนด์";

export type PageKeyword = {
  keyword: string;
  secondary: string[];
  type: KeywordType;
  /** path ในเว็บ หรือคำอธิบายเมื่อเป้าหมายเป็นบทความ */
  target: string;
  targetLabel?: string;
  competitors: string;
};

export const pageKeywords: PageKeyword[] = [
  {
    keyword: "สีกันไฟ Neocoat",
    secondary: ["สีกันไฟ Neocoat สูตรน้ำมัน", "Neocoat Intumescent Paint-S", "สีทนไฟ นีโอโค้ท"],
    type: "ซื้อ",
    target: "/products/neocoat-intumescent-paint-s",
    competitors: "kanfai.com, uoneplusgroup.com, infinitematerialtech.com, beelievesourcing.co.th, kaiseeonline.com",
  },
  {
    keyword: "สีกันไฟสูตรน้ำ",
    secondary: ["Neocoat Intumescent Paint-W", "สีกันไฟ Low VOC", "สีกันไฟ Water Base"],
    type: "ซื้อ",
    target: "/products/neocoat-intumescent-paint-w",
    competitors: "TOA Fire Shield (toagroup.com), homepaint.co.th, srrpaint.co.th",
  },
  {
    keyword: "สีกันไฟโครงสร้างเหล็ก",
    secondary: ["สีกันไฟ ทนไฟ 3 ชั่วโมง", "สีกันไฟ intumescent", "สีพองตัวกันไฟ"],
    type: "ซื้อ",
    target: "/neocoat",
    competitors: "toagroup.com, homepaint.co.th, duracrete.co.th, integ.co.th",
  },
  {
    keyword: "สีกันไฟ · สีทนไฟ",
    secondary: ["สีกันไฟ ราคา", "สีทนไฟ ราคาส่ง", "สีกันไฟ สูตรน้ำมัน สูตรน้ำ"],
    type: "ซื้อ",
    target: "/intumescent",
    competitors: "toagroup.com, kaiseeonline.com, infinitematerialtech.com, Lazada, to-paints.com, firebarrier.in.th",
  },
  {
    keyword: "รับรองสีกันไฟ วุฒิวิศวกร",
    secondary: ["รับรองงานสีกันไฟ", "วุฒิวิศวกรโยธา รับรองสีกันไฟ", "บริษัทรับรองสีกันไฟ"],
    type: "บริการ",
    target: "/fireproofing",
    competitors: "tdonepro.com",
  },
  {
    keyword: "เอกสารรับรองสีกันไฟ น.4-5 น.4-9",
    secondary: ["หนังสือรับรองผู้ควบคุมงาน น.4-9", "แบบ น.4-5 สีกันไฟ", "เอกสารขออนุญาต กนอ. สีกันไฟ"],
    type: "บริการ",
    target: "/fireproofing/certification",
    competitors: "แทบไม่มีหน้าเฉพาะ",
  },
  {
    keyword: "วิศวกรควบคุมงานสีกันไฟ",
    secondary: ["ตรวจวัดความหนาฟิล์มสีกันไฟ", "ควบคุมงานทาสีกันไฟ"],
    type: "บริการ",
    target: "/fireproofing/supervision",
    competitors: "แทบไม่มีหน้าเฉพาะ",
  },
  {
    keyword: "รับรองงานสีกันไฟ คำนวณ Hp/A",
    secondary: ["รับรองสีกันไฟ ราคา", "วุฒิวิศวกรรับรองสีกันไฟ ทั่วประเทศ"],
    type: "บริการ",
    target: "/engineering",
    competitors: "tdonepro.com",
  },
  {
    keyword: "ผ้ากันไฟ Fiberglass Cloth",
    secondary: ["ผ้ากันไฟ ใยแก้ว", "ผ้ากันไฟ 1000 องศา", "ผ้ากันไฟ ทนความร้อน"],
    type: "ซื้อ",
    target: "/products/fiberglass-cloth",
    competitors: "watcharapolintergroup.com, ผ้ากันไฟ.com, herafabric.com, pmkpolomaker.com, lppanuntasup.com, supersafetythailand.com",
  },
  {
    keyword: "ผ้ากันสะเก็ดไฟ งานเชื่อม",
    secondary: ["ผ้ากันสะเก็ดไฟ ราคา", "ผ้ากันไฟ ตัดตามขนาด", "ผ้าห่มกันไฟ"],
    type: "ซื้อ",
    target: "/fire-blanket",
    competitors: "กลุ่มเดียวกับผ้ากันไฟ Fiberglass Cloth",
  },
  {
    keyword: "ทินเนอร์ 3A อินทนิล",
    secondary: ["ทินเนอร์ AAA อินทนิล", "ทินเนอร์ 3A ราคาส่ง", "ทินเนอร์ 3A 15 กก."],
    type: "ซื้อ",
    target: "/products/thinner-3a-intanin",
    competitors: "Shopee, onestockhome.com, beelievesourcing.co.th, thaiwatsadu.com, infinitematerialtech.com, sitsirichemical.com",
  },
  {
    keyword: "น้ำมันสน อินทนิล",
    secondary: ["น้ำมันสนผสมสี", "น้ำมันสน เชียงใหม่", "น้ำมันสน 15 กก."],
    type: "ซื้อ",
    target: "/products/turpentine-intanin",
    competitors: "ยังไม่ได้สำรวจ",
  },
  {
    keyword: "ทินเนอร์ ราคาส่ง",
    secondary: ["ทินเนอร์ 2K", "ทินเนอร์ล้าง", "ทินเนอร์ ปี๊บ 15 กก."],
    type: "ซื้อ",
    target: "/thinner",
    competitors: "Shopee, Lazada, onestockhome.com, thaiwatsadu.com",
  },
  {
    keyword: "สีรองพื้นกันสนิม Neocoat Primer",
    secondary: ["สีรองพื้นเทา Grey Oxide", "สีรองพื้นกันสนิม ก่อนทาสีกันไฟ", "Neocoat Primer 3000"],
    type: "ซื้อ",
    target: "/products/neocoat-primer-grey-oxide",
    competitors: "ยังไม่ได้สำรวจ",
  },
  {
    keyword: "สีน้ำมันทาเหล็ก Neogloss",
    secondary: ["สีทับหน้าเหล็ก", "สีน้ำมันเคลือบเงา เหล็ก"],
    type: "ซื้อ",
    target: "/products/neogloss-enamel",
    competitors: "ยังไม่ได้สำรวจ",
  },
  {
    keyword: "สีน้ำพลาสติก Four Plus",
    secondary: ["Four Plus Pro Interior", "Four Plus Exterior", "สีรองพื้นปูน Four Plus"],
    type: "ซื้อ",
    target: "/four-plus",
    competitors: "ยังไม่ได้สำรวจ",
  },
  {
    keyword: "มาตรฐานสีกันไฟ ASTM E-119 ISO 834",
    secondary: ["ผลทดสอบสีกันไฟ", "สีกันไฟ TÜV SÜD", "สีกันไฟ ผ่านการทดสอบ จุฬา"],
    type: "ความรู้",
    target: "/standards",
    competitors: "toagroup.com",
  },
  {
    keyword: "บลูริช · Blue Rich สีกันไฟ",
    secondary: ["บริษัท บลูริช แมททีเรียล โปรดักส์"],
    type: "แบรนด์",
    target: "/",
    competitors: "เพจ Facebook ของ Infinite อยู่อันดับ 1",
  },
];

/* ------------------------------------------------- คีย์เวิร์ดเพิ่มเติม 60 คำ */

/**
 * คำที่คนค้นจริงจาก Google autocomplete (hl=th, gl=th) เก็บ 7 พ.ย. 2569
 * ตัดคำที่เป็นชื่อแบรนด์คู่แข่งหรือร้านค้า (TOA, ไทวัสดุ, Kobe) และคำที่ไม่ตรงสินค้าออก
 * แต่ละคำให้หน้าที่มีอยู่แล้วรับ ไม่สร้างหน้าใหม่ — `article` คือเลขบทใน seo/blog
 * หน้าแสดงเป็นลิงก์เฉพาะบทที่ขึ้นเว็บแล้ว บทที่ยังรอรีวิวแสดงเป็นข้อความ
 */
export type ExtraKeyword = {
  keyword: string;
  type: KeywordType;
  /** path ของหน้าสินค้า/บริการที่รับคำนี้ */
  target?: string;
  /** หรือเลขบทความที่รับคำนี้ */
  article?: number;
};

export const extraKeywordGroups: { group: string; note: string; keywords: ExtraKeyword[] }[] = [
  {
    group: "สีกันไฟ คำซื้อและราคา",
    note: "คนที่กำลังจะซื้อ ให้หน้าสินค้าและบทราคาเป็นคนรับ",
    keywords: [
      { keyword: "สีกันไฟ ราคาถูก", type: "ซื้อ", article: 8 },
      { keyword: "สีกันไฟ 1 ถัง ทาได้กี่ตารางเมตร", type: "ซื้อ", article: 8 },
      { keyword: "สีกันไฟโครงสร้างเหล็ก ราคา", type: "ซื้อ", target: "/neocoat" },
      { keyword: "สีกันไฟ unique", type: "แบรนด์", target: "/products/neocoat-intumescent-paint-s" },
      { keyword: "สีกันไฟ สูตรน้ำมัน", type: "ซื้อ", target: "/products/neocoat-intumescent-paint-s" },
      { keyword: "สีทนไฟ ราคา", type: "ซื้อ", target: "/intumescent" },
      { keyword: "สีทากันไฟ", type: "ซื้อ", target: "/intumescent" },
      { keyword: "สีกันไฟ ยี่ห้อ", type: "ซื้อ", target: "/intumescent" },
    ],
  },
  {
    group: "สีกันไฟ ความรู้และวิธีใช้",
    note: "คำถามก่อนตัดสินใจ ให้บทความรับแล้วลิงก์เข้าหน้าสินค้า",
    keywords: [
      { keyword: "สีกันไฟ คือ", type: "ความรู้", article: 1 },
      { keyword: "intumescent paint คือ", type: "ความรู้", article: 1 },
      { keyword: "สีกันไฟ ทากี่รอบ", type: "ความรู้", article: 13 },
      { keyword: "วิธีใช้สีกันไฟ", type: "ความรู้", article: 13 },
      { keyword: "สีกันไฟ ทาเหล็ก", type: "ความรู้", article: 13 },
      { keyword: "สีกันไฟทาตอนไหน", type: "ความรู้", article: 13 },
      { keyword: "สีกันไฟ กี่ไมครอน", type: "ความรู้", article: 2 },
      { keyword: "มาตรฐานความหนาสีกันไฟ", type: "ความรู้", article: 2 },
      { keyword: "hp/a steel", type: "ความรู้", article: 2 },
      { keyword: "วัดความหนาสี", type: "ความรู้", article: 5 },
      { keyword: "sa 2.5 surface preparation", type: "ความรู้", article: 6 },
    ],
  },
  {
    group: "มาตรฐาน กฎหมาย และงานรับรอง",
    note: "คำของผู้ออกแบบและเจ้าของโครงการ เป็นจุดแข็งของ Blue Rich ที่มีผลทดสอบและวุฒิวิศวกร",
    keywords: [
      { keyword: "astm e119 คือ", type: "ความรู้", target: "/standards" },
      { keyword: "astm e119", type: "ความรู้", article: 7 },
      { keyword: "iso 834 fire curve", type: "ความรู้", article: 7 },
      { keyword: "กฎหมายสีกันไฟโครงสร้างเหล็ก", type: "กฎหมาย", article: 3 },
      { keyword: "กฎกระทรวง สีทนไฟ 2566", type: "กฎหมาย", article: 3 },
      { keyword: "กฎกระทรวง วัสดุทนไฟ", type: "กฎหมาย", article: 3 },
      { keyword: "สีทนไฟ กฎหมาย", type: "กฎหมาย", article: 3 },
      { keyword: "หนังสือรับรองสีกันไฟ", type: "บริการ", target: "/fireproofing/certification" },
      { keyword: "โครงสร้างเหล็กทนไฟ", type: "บริการ", target: "/fireproofing" },
      { keyword: "fireproofing", type: "บริการ", target: "/fireproofing" },
    ],
  },
  {
    group: "ผ้ากันไฟ",
    note: "คำซื้อของงานเชื่อมและโรงงาน คู่แข่งเป็นผู้นำเข้าเฉพาะทาง",
    keywords: [
      { keyword: "ผ้ากันไฟงานเชื่อม", type: "ซื้อ", target: "/fire-blanket" },
      { keyword: "ผ้ากันไฟงานเชื่อม ราคา", type: "ซื้อ", target: "/fire-blanket" },
      { keyword: "ผ้ากันไฟ 1 ม้วน", type: "ซื้อ", target: "/products/fiberglass-cloth" },
      { keyword: "ผ้ากันไฟ ราคา", type: "ซื้อ", target: "/products/fiberglass-cloth" },
      { keyword: "ผ้าใยแก้วทนความร้อน", type: "ซื้อ", target: "/products/fiberglass-cloth" },
      { keyword: "ผ้าใยแก้วเคลือบซิลิโคน", type: "ความรู้", article: 10 },
    ],
  },
  {
    group: "ทินเนอร์และน้ำมันสน",
    note: "คำซื้อปริมาณมาก ใช้ชื่ออินทนิลและขนาดปี๊บช่วยแยกจากร้านค้าปลีก",
    keywords: [
      { keyword: "ทินเนอร์ 3a ราคา", type: "ซื้อ", target: "/products/thinner-3a-intanin" },
      { keyword: "ทินเนอร์ 3a ปี๊บใหญ่", type: "ซื้อ", target: "/products/thinner-3a-intanin" },
      { keyword: "ทินเนอร์ aaa", type: "ซื้อ", target: "/products/thinner-3a-intanin" },
      { keyword: "ทินเนอร์ผสมสีน้ำมัน", type: "ความรู้", article: 11 },
      { keyword: "ทินเนอร์ล้างแปรง", type: "ซื้อ", target: "/products/thinner-wash-aaa" },
      { keyword: "ทินเนอร์ล้างกา", type: "ซื้อ", target: "/products/thinner-wash-aaa" },
      { keyword: "ทินเนอร์ผสมสีพ่นรถยนต์", type: "ซื้อ", target: "/products/thinner-2k" },
      { keyword: "น้ำมันสน ราคา", type: "ซื้อ", target: "/products/turpentine-intanin" },
      { keyword: "น้ำมันสนใช้ทำอะไร", type: "ความรู้", article: 11 },
    ],
  },
  {
    group: "สีรองพื้นและสีทาเหล็ก",
    note: "คำของงานเหล็กทั่วไปที่ไม่ใช่สีกันไฟ ใช้ระบบ Neocoat Primer กับ Neogloss",
    keywords: [
      { keyword: "สีรองพื้นเหล็กเก่า", type: "ความรู้", article: 14 },
      { keyword: "สีกันสนิมเหล็ก", type: "ความรู้", article: 14 },
      { keyword: "สีรองพื้นกันสนิม สีเทา", type: "ซื้อ", target: "/products/neocoat-primer-grey-oxide" },
      { keyword: "สีรองพื้นกันสนิมแดง", type: "ซื้อ", target: "/products/neocoat-primer-grey-oxide" },
      { keyword: "สีรองพื้นกันสนิม ราคา", type: "ซื้อ", target: "/products/neocoat-primer-grey-oxide" },
      { keyword: "สีน้ำมันทาเหล็ก ราคา", type: "ซื้อ", target: "/products/neogloss-enamel" },
      { keyword: "สีเคลือบเงาเหล็ก", type: "ซื้อ", target: "/products/neogloss-enamel" },
      { keyword: "สีน้ำมันทาเหล็กกันสนิม", type: "ความรู้", article: 15 },
      { keyword: "สีทาเหล็กไม่ต้องรองพื้น", type: "ความรู้", article: 15 },
      { keyword: "ทาสีเหล็กที่เป็นสนิม", type: "ความรู้", article: 15 },
    ],
  },
  {
    group: "สีน้ำพลาสติกและผนังปูน",
    note: "สินค้ามูลค่าต่ำกว่า ให้หน้า Four Plus และบทผนังปูนใหม่รับ",
    keywords: [
      { keyword: "ปูนใหม่กี่วันทาสีได้", type: "ความรู้", article: 16 },
      { keyword: "ปูนใหม่ต้องทาสีรองพื้นไหม", type: "ความรู้", article: 16 },
      { keyword: "สีรองพื้นปูนใหม่ ราคา", type: "ซื้อ", target: "/products/four-plus-pro-masonry-sealer" },
      { keyword: "สีน้ำพลาสติก 18 ลิตร ทาได้กี่ตารางเมตร", type: "ซื้อ", target: "/four-plus" },
      { keyword: "สีน้ำพลาสติก ภายนอก", type: "ซื้อ", target: "/products/four-plus-exterior" },
      { keyword: "สีน้ำพลาสติก ทาภายใน", type: "ซื้อ", target: "/products/four-plus-pro-interior" },
    ],
  },
];

export type ArticleKeyword = {
  n: number;
  title: string;
  keyword: string;
  secondary: string[];
  /** slug ของบทความ (มีเมื่ออ่านจาก seo/blog) */
  slug?: string;
  /** ขึ้นเว็บแล้วหรือยัง — ดูจากไฟล์ seo/published/<slug>.json */
  live?: boolean;
};

/** แผนบทความ 12 บท ใช้จนกว่า content/articles/*.md จะมีจริง */
export const plannedArticles: ArticleKeyword[] = [
  { n: 1, title: "สีกันไฟโครงสร้างเหล็ก พองตัวเป็นฉนวนกันความร้อนได้ 3 ชั่วโมง", keyword: "สีกันไฟโครงสร้างเหล็ก", secondary: ["สีกันไฟ ทำงานอย่างไร", "intumescent paint", "สีกันไฟ พองตัว"] },
  { n: 2, title: "ความหนาสีกันไฟ คำนวณจากค่า Hp/A และอัตราการทนไฟของอาคาร", keyword: "ความหนาสีกันไฟ", secondary: ["คำนวณความหนาสีกันไฟ", "Hp/A", "Section Factor", "DFT สีกันไฟ"] },
  { n: 3, title: "กฎกระทรวง พ.ศ. 2566 กำหนดอัตราการทนไฟของโครงสร้างเหล็ก", keyword: "กฎกระทรวง 2566 โครงสร้างเหล็ก", secondary: ["อาคารที่ต้องทำสีกันไฟ", "อัตราการทนไฟ อาคารสูง", "กฎกระทรวงฉบับที่ 48/60"] },
  { n: 4, title: "เอกสารรับรองสีกันไฟ น.4-5 และ น.4-9 พร้อมก่อนยื่นขออนุญาต", keyword: "เอกสารรับรองสีกันไฟ", secondary: ["น.4-5", "น.4-9", "หนังสือรับรองผู้ควบคุมงาน", "เอกสารขออนุญาต กนอ."] },
  { n: 5, title: "วิศวกรควบคุมงานสีกันไฟ ตรวจวัดความหนาฟิล์มทุกชิ้นก่อนปิดงาน", keyword: "วิศวกรควบคุมงานสีกันไฟ", secondary: ["ตรวจวัดความหนาฟิล์ม", "WFT DFT", "ควบคุมงานทาสีกันไฟ"] },
  { n: 6, title: "ระบบสีกันไฟ 3 ชั้น รองพื้นกันสนิม สีกันไฟ และสีทับหน้า", keyword: "ระบบสีกันไฟ", secondary: ["สีรองพื้นกันสนิม ก่อนทาสีกันไฟ", "สีทับหน้าสีกันไฟ", "เตรียมพื้นผิวเหล็ก"] },
  { n: 7, title: "ผลทดสอบสีกันไฟ ASTM E-119 และ ISO 834 บอกอัตราการทนไฟจริง", keyword: "ผลทดสอบสีกันไฟ ASTM E-119", secondary: ["ISO 834 สีกันไฟ", "TÜV SÜD สีกันไฟ", "ทดสอบสีกันไฟ จุฬา"] },
  { n: 8, title: "ราคาสีกันไฟต่อตารางเมตร ขึ้นกับความหนาฟิล์มและหน้าตัดเหล็ก", keyword: "ราคาสีกันไฟ ต่อตารางเมตร", secondary: ["ราคาสีกันไฟ", "สีกันไฟ ราคาถัง", "คิดราคางานสีกันไฟ"] },
  { n: 9, title: "สีกันไฟสูตรน้ำ Neocoat Paint-W ใช้ในอาคารที่ยังเปิดใช้งานได้", keyword: "สีกันไฟสูตรน้ำ", secondary: ["สีกันไฟ Low VOC", "สีกันไฟ Water Base", "สีกันไฟ ไม่มีกลิ่น"] },
  { n: 10, title: "ผ้ากันไฟ Fiberglass Cloth เกรด 550°C และ 1000°C เลือกตามงาน", keyword: "ผ้ากันไฟ 1000 องศา", secondary: ["ผ้ากันสะเก็ดไฟ งานเชื่อม", "ผ้ากันไฟ ใยแก้ว", "ผ้ากันไฟ ซิลิโคน"] },
  { n: 11, title: "ทินเนอร์ 3A กับน้ำมันสน ต่างกันที่ชนิดสีที่ใช้ผสมและการล้าง", keyword: "ทินเนอร์ 3A กับ น้ำมันสน", secondary: ["ทินเนอร์ อินทนิล", "น้ำมันสน อินทนิล", "ทินเนอร์ 2K", "ทินเนอร์ล้าง"] },
  { n: 12, title: "สีกันไฟ ซีเมนต์กันไฟ ยิปซัมทนไฟ เทียบข้อดีสำหรับโครงเหล็ก", keyword: "สีกันไฟ กับ ซีเมนต์กันไฟ", secondary: ["วัสดุกันไฟโครงสร้างเหล็ก", "วิธีป้องกันไฟโครงสร้างเหล็ก", "ยิปซัมทนไฟ"] },
];
