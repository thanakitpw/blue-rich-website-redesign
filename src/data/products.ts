export type Category = {
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
};

export type Product = {
  slug: string;
  code: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  gallery: string[];
  highlights: string[];
  description: string[];
  specs: { label: string; value: string }[];
  featured?: boolean;
  bestSeller?: boolean;
};

export const categories: Category[] = [
  {
    slug: "fire-retardant-paint",
    name: "สีกันไฟ – สีทนไฟ",
    short: "Intumescent Paint",
    description:
      "สีกันไฟชนิดพองตัวสำหรับทาโครงสร้างเหล็ก ทั้งสูตรน้ำมันและสูตรน้ำ ผ่านมาตรฐาน ASTM E-119 และ ISO 834",
    image: "/assets/product-neocoat-intumescent.jpg",
  },
  {
    slug: "anti-rust-primer",
    name: "สีรองพื้นกันสนิมเหล็ก",
    short: "Anti-rust Primer",
    description:
      "สีรองพื้นกันสนิมคุณภาพสูง เสริมการยึดเกาะระหว่างผิวเหล็กกับสีทับหน้า ยืดอายุโครงสร้างก่อนเข้าระบบสีกันไฟ",
    image: "/assets/product-neocoat-primer.jpg",
  },
  {
    slug: "thinner-turpentine",
    name: "น้ำมันสนและทินเนอร์",
    short: "Thinner & Turpentine",
    description:
      "ตัวทำละลายคุณภาพสูงสำหรับผสมสีรองพื้นกันสนิม สีน้ำมัน สีโซลเวนต์ และสีอีพ็อกซี่ จำหน่ายยกแกลลอน",
    image: "/assets/product-turpentine.jpg",
  },
  {
    slug: "fire-blanket",
    name: "ผ้ากันไฟ",
    short: "Fire Blanket",
    description:
      "ผ้ากันไฟใยแก้วและซิลิก้า ทนอุณหภูมิ 550–1000°C ปลอดแอสเบสตอส สำหรับงานเชื่อมและงานฉนวนความร้อน",
    image: "/assets/product-silica-silicone.jpg",
  },
];

export const products: Product[] = [
  {
    slug: "neocoat-intumescent-paint",
    code: "A014",
    name: "สีกันไฟ – สีทนไฟ Neocoat Intumescent Paint",
    category: "fire-retardant-paint",
    tagline: "Solvent Base และ Water Base สำหรับโครงสร้างเหล็ก",
    image: "/assets/product-neocoat-intumescent.jpg",
    gallery: [
      "/assets/product-neocoat-intumescent.jpg",
      "/assets/banner-fireproof.jpg",
      "/assets/cert-documents.jpg",
    ],
    highlights: [
      "ทดสอบมาตรฐาน ASTM E-119 โดยจุฬาลงกรณ์มหาวิทยาลัย",
      "ทดสอบมาตรฐาน ISO 834 ณ ประเทศมาเลเซีย",
      "รับรองงานโดยวุฒิวิศวกรโยธา แบบ น.4-5 และ น.4-9",
      "มีทั้งสูตรน้ำมัน (Solvent Base) และสูตรน้ำ (Water Base)",
    ],
    description: [
      "สีกันไฟ – สีทนไฟ Neocoat Intumescent Paint เป็นสีกันไฟชนิดพองตัว (Intumescent) สำหรับเคลือบผิวโครงสร้างเหล็ก เมื่อได้รับความร้อนจากเพลิงไหม้ ฟิล์มสีจะพองตัวขึ้นหลายสิบเท่ากลายเป็นชั้นฉนวนคาร์บอน ช่วยชะลอการถ่ายเทความร้อนเข้าสู่เนื้อเหล็ก ทำให้โครงสร้างคงกำลังรับน้ำหนักได้ตามเวลาที่กฎหมายกำหนด",
      "จำหน่ายทั้งสูตรน้ำมัน (Solvent Base) และสูตรน้ำ (Water Base) เฉดสีขาวและสีเทา ทาได้ทั้งด้วยแปรง ลูกกลิ้ง และเครื่องพ่น ความหนาฟิล์มแห้งตามอัตราการทนไฟที่ต้องการ โดยทั่วไปอยู่ที่ประมาณ 500 ไมครอน",
      "ทุกโครงการรับรองเอกสารงานสีกันไฟโดยวุฒิวิศวกรโยธาและวิศวกรควบคุมงาน ตามกฎกระทรวงกำหนดการออกแบบโครงสร้างอาคาร และลักษณะและคุณสมบัติของวัสดุที่ใช้ในงานโครงสร้างอาคาร พ.ศ. 2567",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A014" },
      { label: "ประเภท", value: "Intumescent Paint ชนิดพองตัว" },
      { label: "สูตร", value: "Solvent Base / Water Base" },
      { label: "เฉดสี", value: "ขาว และ เทา" },
      { label: "ลักษณะฟิล์ม", value: "ด้าน" },
      { label: "ความหนาแนะนำ", value: "ประมาณ 500 ไมครอน" },
      { label: "อัตราการทนไฟ", value: "สูงสุด 3 ชั่วโมง" },
      { label: "มาตรฐานทดสอบ", value: "ASTM E-119 / ISO 834" },
      { label: "วิธีทา", value: "แปรง ลูกกลิ้ง หรือเครื่องพ่น" },
    ],
    featured: true,
    bestSeller: true,
  },
  {
    slug: "neocoat-primer-3000",
    code: "A015",
    name: "Neocoat Primer 3000",
    category: "anti-rust-primer",
    tagline: "สีรองพื้นกันสนิมแดงและเทา",
    image: "/assets/product-neocoat-primer.jpg",
    gallery: ["/assets/product-neocoat-primer.jpg"],
    highlights: [
      "เสริมการยึดเกาะระหว่างผิวโลหะกับสีทับหน้า",
      "มีให้เลือกทั้งเฉดสีแดงและสีเทา",
      "ฟิล์มสีชนิดด้าน แห้งเร็ว ทาต่อระบบสีกันไฟได้",
    ],
    description: [
      "Neocoat Primer 3000 คือสีรองพื้นกันสนิมคุณภาพดี ช่วยเสริมการยึดเกาะบนพื้นผิวโลหะ และป้องกันการเกิดสนิมบนโครงสร้างเหล็กก่อนเข้าสู่ระบบสีกันไฟหรือสีทับหน้า",
      "เหมาะสำหรับงานโครงสร้างเหล็กรูปพรรณ เสา คาน โครงหลังคา และงานเหล็กทั่วไปทั้งภายในและภายนอกอาคาร",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A015" },
      { label: "ประเภท", value: "สีรองพื้นกันสนิม" },
      { label: "เฉดสี", value: "แดง และ เทา" },
      { label: "ลักษณะฟิล์ม", value: "ด้าน" },
      { label: "ใช้กับ", value: "โครงสร้างเหล็ก งานเหล็กทั่วไป" },
    ],
    bestSeller: true,
  },
  {
    slug: "turpentine-inthanin",
    code: "A013",
    name: "น้ำมันสนอินทนิล",
    category: "thinner-turpentine",
    tagline: "น้ำมันสนเชียงใหม่ 100% Turpentine",
    image: "/assets/product-turpentine.jpg",
    gallery: ["/assets/product-turpentine.jpg"],
    highlights: [
      "น้ำมันสนเชียงใหม่แท้ 100%",
      "ผสมสีรองพื้นกันสนิมและสีน้ำมันทั่วไป",
      "บรรจุแกลลอนขนาดใหญ่ ราคาพิเศษสำหรับงานโครงการ",
    ],
    description: [
      "น้ำมันสนอินทนิล ผลิตจากน้ำมันสนเชียงใหม่ 100% สำหรับผสมสีรองพื้นกันสนิมและสีน้ำมันทั่วไป ช่วยให้เนื้อสีกระจายตัวสม่ำเสมอและทาลื่นขึ้น",
      "บรรจุแกลลอนขนาดใหญ่ เหมาะกับงานทาสีโครงสร้างปริมาณมาก มีราคาพิเศษสำหรับผู้รับเหมาและงานโครงการ",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A013" },
      { label: "ประเภท", value: "น้ำมันสน (Turpentine)" },
      { label: "ส่วนผสม", value: "น้ำมันสนเชียงใหม่ 100%" },
      { label: "ใช้ผสม", value: "สีรองพื้นกันสนิม สีน้ำมันทั่วไป" },
    ],
  },
  {
    slug: "thinner-inthanin",
    code: "A012",
    name: "ทินเนอร์อินทนิล AAA (3A)",
    category: "thinner-turpentine",
    tagline: "ทินเนอร์เกรดคุณภาพสูง สำหรับงานสีอุตสาหกรรม",
    image: "/assets/product-thinner.jpg",
    gallery: ["/assets/product-thinner.jpg"],
    highlights: [
      "ผสมสีรองพื้นกันสนิม และสีสูตรน้ำมัน",
      "ผสมสีสูตรโซลเวนต์ และสีอีพ็อกซี่",
      "คุณภาพสูง ราคาพิเศษสำหรับงานโครงการ",
    ],
    description: [
      "ทินเนอร์อินทนิล เกรด AAA (3A) เป็นตัวทำละลายคุณภาพสูงสำหรับผสมสีรองพื้นกันสนิม สีสูตรน้ำมัน สีสูตรโซลเวนต์ และสีอีพ็อกซี่",
      "ช่วยปรับความหนืดของสีให้เหมาะกับวิธีการทาแต่ละแบบ ทั้งงานแปรง ลูกกลิ้ง และงานพ่น",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A012" },
      { label: "ประเภท", value: "ทินเนอร์ เกรด AAA (3A)" },
      {
        label: "ใช้ผสม",
        value: "สีรองพื้นกันสนิม สีน้ำมัน สีโซลเวนต์ สีอีพ็อกซี่",
      },
    ],
  },
  {
    slug: "fire-blanket-silica-silicone",
    code: "A004",
    name: "ผ้ากันไฟซิลิก้าเคลือบซิลิโคน",
    category: "fire-blanket",
    tagline: "ทนอุณหภูมิสูงสุด 1000°C หนา 0.8 มม.",
    image: "/assets/product-silica-silicone.jpg",
    gallery: ["/assets/product-silica-silicone.jpg", "/assets/spec-silica-silicone.jpg"],
    highlights: [
      "ทนอุณหภูมิสูงสุด 1000°C",
      "เคลือบซิลิโคนสีแดงทั้งสองด้าน",
      "ปลอดแอสเบสตอส ไม่ลามไฟ",
    ],
    description: [
      "ผ้ากันไฟซิลิก้าเคลือบซิลิโคนกันความร้อนสีแดง ทนอุณหภูมิสูงสุด 1000°C ความหนา 0.8 มม. ทอจากเส้นใยซิลิก้าต่อเนื่องซึ่งมีความแข็งแรงสูงกว่าผ้าใยแก้วทั่วไป",
      "เหมาะสำหรับงานฉนวนกันความร้อน ผ้าคลุมงานเชื่อม ผ้าคลุมเทอร์ไบน์ ปลอกหุ้มท่อไอเสีย และม่านกันสะเก็ดไฟ ใช้แพร่หลายในอุตสาหกรรมปิโตรเคมี น้ำมันและก๊าซ อู่ต่อเรือ และโรงงานเหล็ก",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A004 / STR850" },
      { label: "เนื้อผ้า", value: "ซิลิก้าเคลือบซิลิโคนสองด้าน" },
      { label: "ความหนา", value: "0.80 มม. (±0.05)" },
      { label: "หน้ากว้าง", value: "0.920 เมตร" },
      { label: "ความยาวม้วน", value: "46 / 50 เมตร" },
      { label: "สี", value: "แดง" },
      { label: "น้ำหนัก", value: "800 g/m²" },
      { label: "ทนอุณหภูมิ", value: "1000°C (ซิลิโคน 280°C)" },
      { label: "การลามไฟ", value: "ไม่ลามไฟ (0 rating)" },
    ],
    bestSeller: true,
  },
  {
    slug: "fire-blanket-fiberglass",
    code: "A005",
    name: "ผ้ากันไฟผ้าใยแก้วไฟเบอร์กลาส",
    category: "fire-blanket",
    tagline: "ทนอุณหภูมิสูงสุด 550°C หนา 1.0 มม.",
    image: "/assets/product-fiberglass.jpg",
    gallery: ["/assets/product-fiberglass.jpg", "/assets/spec-fiberglass.jpg"],
    highlights: [
      "ทนอุณหภูมิต่อเนื่องสูงสุด 550°C",
      "ทอลายซาติน ผ่านกระบวนการ Heat Treated",
      "ผิวไม่ระคายเคือง ปลอดแอสเบสตอส",
    ],
    description: [
      "ผ้ากันไฟผ้าใยแก้วไฟเบอร์กลาส สีทอง ทนอุณหภูมิสูงสุด 550°C ความหนา 1.0 มม. เป็นผ้าฉนวนใยแก้วที่ใช้แพร่หลายที่สุดในตลาด",
      "ทอลายซาตินแน่นและผ่านความร้อน ทำให้ผ้าหนาและแข็งแรง ทนแรงกระแทกจากสะเก็ดไฟเชื่อมได้ดีกว่าผ้าบางทั่วไป ผิวสัมผัสไม่เป็นขุย ลดการระคายเคืองผิวหนัง",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A005 / HT800" },
      { label: "เนื้อผ้า", value: "ใยแก้วไฟเบอร์กลาส" },
      { label: "ความหนา", value: "1.0 มม." },
      { label: "หน้ากว้าง", value: "1.0 เมตร" },
      { label: "ความยาวม้วน", value: "50 เมตร" },
      { label: "สี", value: "ทอง / น้ำตาลทอง" },
      { label: "ความหนาแน่น", value: "860 g/m³" },
      { label: "ทนอุณหภูมิ", value: "550°C (ต่อเนื่อง)" },
      { label: "ลายทอ", value: "Satin, Heat Treated" },
    ],
  },
  {
    slug: "fire-blanket-silica",
    code: "A006",
    name: "ผ้ากันไฟซิลิก้า",
    category: "fire-blanket",
    tagline: "ทนอุณหภูมิสูงสุด 1000°C จุดหลอมเหลว 1800°C",
    image: "/assets/product-silica.jpg",
    gallery: ["/assets/product-silica.jpg", "/assets/spec-silica.jpg"],
    highlights: [
      "ทนอุณหภูมิใช้งาน 1000°C จุดหลอมเหลว 1800°C",
      "ปริมาณ SiO₂ ไม่น้อยกว่า 96%",
      "ไม่ติดไฟ ไม่ปล่อยควันพิษเมื่อโดนความร้อน",
    ],
    description: [
      "ผ้ากันไฟผ้าซิลิก้า สีทอง ทนอุณหภูมิสูงสุด 1000°C ความหนา 0.7 มม. ทอจากเส้นใยซิลิก้าต่อเนื่องที่มีปริมาณซิลิกอนไดออกไซด์ไม่น้อยกว่า 96%",
      "มีอัตราส่วนความแข็งแรงต่อน้ำหนักสูงมาก ไม่ติดไฟ ทนเชื้อรา และป้องกันความร้อนได้ดีเยี่ยม เมื่อสัมผัสความร้อนจะไม่ปล่อยเปลวไฟหรือสารพิษ",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A006 / ST750" },
      { label: "เนื้อผ้า", value: "ซิลิก้า (Silica)" },
      { label: "ความหนา", value: "0.7 มม. (±5%)" },
      { label: "หน้ากว้าง", value: "0.920 เมตร" },
      { label: "ความยาวม้วน", value: "46 เมตร" },
      { label: "สี", value: "ทอง / เบจทอง" },
      { label: "SiO₂", value: "ไม่น้อยกว่า 96%" },
      { label: "ทนอุณหภูมิ", value: "1000°C" },
      { label: "จุดหลอมเหลว", value: "1800°C" },
    ],
  },
  {
    slug: "fire-blanket-fiberglass-silicone",
    code: "A007",
    name: "ผ้ากันไฟผ้าใยแก้วเคลือบซิลิโคน",
    category: "fire-blanket",
    tagline: "ทนอุณหภูมิ 550°C หนา 0.5 มม. สีเทา",
    image: "/assets/product-fiberglass-silicone.jpg",
    gallery: [
      "/assets/product-fiberglass-silicone.jpg",
      "/assets/spec-fiberglass-silicone.jpg",
    ],
    highlights: [
      "เคลือบซิลิโคนทั้งสองด้าน กันน้ำ",
      "ทนการขัดถูและมีความยืดหยุ่นดี",
      "ทนสารเคมีและด่าง กันคราบน้ำมัน",
    ],
    description: [
      "ผ้ากันไฟผ้าใยแก้วเคลือบซิลิโคนกันความร้อน สีเทา ทนอุณหภูมิ 550°C ความหนา 0.5 มม. เคลือบซิลิโคนทั้งสองด้าน",
      "เหมาะสำหรับทำแผ่นฉนวนแบบถอดได้ ปลอกหุ้มหน้าแปลน ผ้าคลุมอุปกรณ์ ม่านกันสะเก็ดไฟเชื่อม และ Expansion Joint ทนช่วงอุณหภูมิ -50 ถึง 550°C",
    ],
    specs: [
      { label: "รหัสสินค้า", value: "A007 / SC470" },
      { label: "เนื้อผ้า", value: "ใยแก้วเคลือบซิลิโคนสองด้าน" },
      { label: "ความหนา", value: "0.5 มม. (±5%)" },
      { label: "หน้ากว้าง", value: "1.50 เมตร" },
      { label: "ความยาวม้วน", value: "50 เมตร" },
      { label: "สี", value: "เทา / แดง" },
      { label: "น้ำหนัก", value: "560 g/m²" },
      { label: "ช่วงอุณหภูมิ", value: "-50 ถึง 550°C" },
      { label: "ซิลิโคนทนได้", value: "260°C" },
    ],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);
