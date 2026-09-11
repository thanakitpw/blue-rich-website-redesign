/**
 * ตัวอย่างเอกสารให้ดาวน์โหลดของแต่ละหน้าบริการ (/fireproofing/<slug>)
 *
 * เก็บในโค้ด ไม่ได้อยู่ในตาราง services ของ CMS — ตารางนั้นเก็บสแนปช็อต jsonb
 * ที่ seed ไปแล้ว ถ้าเพิ่มฟิลด์ใหม่ในนั้นต้องแก้ทั้ง type, seed, verify และ
 * หน้าจอหลังบ้าน ส่วนตัวอย่างเอกสารเปลี่ยนไม่บ่อย (ต้องวางไฟล์ PDF ใน public/docs
 * ด้วยอยู่แล้ว) จึงผูกกับ slug ตรงนี้แบบเดียวกับ PRODUCT_HERO ของหน้าสินค้า
 */
export type SampleDoc = {
  href: string;
  label: string;
  /** โครงการที่เอกสารชุดนั้นมาจาก — ช่วยให้ลูกค้าเลือกชุดที่ใกล้เคียงงานตัวเอง */
  detail: string;
  /** ขนาดไฟล์ให้คนบนมือถือตัดสินใจก่อนกด */
  size: string;
};

export const SERVICE_SAMPLES: Record<string, { title: string; description: string; docs: SampleDoc[] }> = {
  certification: {
    title: "ตัวอย่างเอกสารรับรองงานสีกันไฟ",
    description:
      "เอกสารรับรองชุดจริงที่เคยยื่นผ่านแล้ว ทั้งรายการคำนวณความหนาฟิล์ม ผลตรวจหน้างาน และหน้าลงนามโดยวุฒิวิศวกรโยธา เลือกชุดที่ใกล้เคียงกับอาคารของคุณ",
    docs: [
      {
        href: "/docs/fireproof-certification-sample-hospital.pdf",
        label: "รับรองสีกันไฟ งานโรงพยาบาล",
        detail: "อาคารโรงพยาบาล · ยื่นหน่วยงานราชการ",
        size: "4.1 MB",
      },
      {
        href: "/docs/fireproof-certification-sample-factory.pdf",
        label: "รับรองงานสีกันไฟ โรงงาน",
        detail: "อาคารโรงงาน · ยื่นขออนุญาตก่อสร้าง",
        size: "6.5 MB",
      },
      {
        href: "/docs/fireproof-certification-sample-industrial-estate.pdf",
        label: "รับรองสีกันไฟ ในการนิคมอุตสาหกรรม",
        detail: "โรงงานในนิคม · ยื่น กนอ. พร้อมแบบ น.4-5 / น.4-9",
        size: "7.5 MB",
      },
    ],
  },
};
