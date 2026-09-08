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
    image: "/assets/work-02.jpg",
    title: "งานทาสีกันไฟโครงถัก",
    scope: "ทาด้วยแปรงและลูกกลิ้ง สูตรน้ำมัน",
  },
  {
    image: "/assets/work-07.jpg",
    title: "โครงถักเหล็กสะพาน",
    scope: "งานสีกันไฟชิ้นส่วนโครงถัก",
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
];
