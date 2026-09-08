export type Project = {
  image: string;
  title: string;
  scope: string;
  span?: "wide" | "tall";
};

/** ภาพหน้างานจริงจากโครงการที่ใช้ระบบสีกันไฟ Neocoat */
export const projects: Project[] = [
  {
    image: "/assets/work-interior-factory.webp",
    title: "ภายในอาคารโรงงานที่ทาสีกันไฟแล้ว",
    scope: "เสาและคานเหล็กทาสีกันไฟครบระบบ พร้อมเปิดใช้อาคาร",
  },
  {
    image: "/assets/work-01.jpg",
    title: "อาคารโรงงานสำเร็จ",
    scope: "โครงสร้างเหล็กภายในอาคารโรงงาน",
    span: "wide",
  },
  {
    image: "/assets/work-truss-lift.webp",
    title: "ทาสีกันไฟโครงถักหลังคา",
    scope: "ทำงานบนรถกระเช้า ทาสีกันไฟโครงถักช่วงกว้างหน้างาน",
  },
  {
    image: "/assets/work-dft-gauge.webp",
    title: "ตรวจวัดความหนาฟิล์มแห้ง",
    scope: "วัดด้วยเครื่อง PosiTector ได้ 542 ไมครอน",
  },
  {
    image: "/assets/work-03.jpg",
    title: "โครงสร้างเหล็กอาคารพาณิชย์",
    scope: "งานติดตั้งโครงสร้างหลักหน้าไซต์",
  },
  {
    image: "/assets/work-site-erection.webp",
    title: "โครงสร้างเหล็กอาคารระหว่างก่อสร้าง",
    scope: "งานติดตั้งโครงสร้างเหล็กหน้าไซต์",
  },
  {
    image: "/assets/work-tubular-truss.webp",
    title: "โครงถักท่อเหล็กทาสีกันไฟ",
    scope: "ทาสีกันไฟในโรงประกอบก่อนยกติดตั้ง",
  },
  {
    image: "/assets/work-beams-shop.webp",
    title: "คานเหล็กทาสีกันไฟในโรงประกอบ",
    scope: "ทาสีกันไฟให้ครบความหนาก่อนส่งเข้าหน้างาน",
  },
];
