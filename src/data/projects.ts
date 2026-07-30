export type Project = {
  image: string;
  title: string;
  scope: string;
  span?: "wide" | "tall";
};

/** ภาพหน้างานจริงจากโครงการที่ใช้ระบบสีกันไฟ Neocoat */
export const projects: Project[] = [
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
    image: "/assets/work-03.jpg",
    title: "โครงสร้างเหล็กอาคารพาณิชย์",
    scope: "งานติดตั้งโครงสร้างหลักหน้าไซต์",
  },
  {
    image: "/assets/work-04.jpg",
    title: "โครงหลังคาช่วงกว้าง",
    scope: "Space Truss ทาสีกันไฟก่อนยกติดตั้ง",
    span: "tall",
  },
  {
    image: "/assets/work-05.jpg",
    title: "งานทาคานเหล็กรูปพรรณ",
    scope: "ควบคุมความหนาฟิล์มตลอดความยาวคาน",
  },
  {
    image: "/assets/work-06.jpg",
    title: "ลานเตรียมงานหน้าโรงงาน",
    scope: "เตรียมผิวและทาสีรองพื้นกันสนิม",
    span: "wide",
  },
  {
    image: "/assets/work-07.jpg",
    title: "โครงถักเหล็กสะพาน",
    scope: "งานสีกันไฟชิ้นส่วนโครงถัก",
  },
  {
    image: "/assets/work-08.jpg",
    title: "งานเสาและคานเชื่อมประกอบ",
    scope: "ตรวจสอบผิวงานก่อนส่งมอบ",
  },
  {
    image: "/assets/work-09.jpg",
    title: "โครงถักหน้างานกลางแจ้ง",
    scope: "ทาสีกันไฟหน้างานโครงการ",
  },
  {
    image: "/assets/work-10.jpg",
    title: "สีกันไฟ Neocoat พร้อมส่ง",
    scope: "สต็อกสินค้าสำหรับงานโครงการขนาดใหญ่",
    span: "tall",
  },
  {
    image: "/assets/work-11.jpg",
    title: "โครงหลังคาเหล็กสำเร็จรูป",
    scope: "งานทาสีกันไฟในโรงประกอบ",
  },
  {
    image: "/assets/work-12.jpg",
    title: "คานเหล็กประกอบขนาดใหญ่",
    scope: "งานสีระบบครบชุด รองพื้น + กันไฟ",
  },
  {
    image: "/assets/work-13.jpg",
    title: "เหล็กรูปพรรณเรียงรอทา",
    scope: "จัดคิวงานตามลำดับการติดตั้ง",
    span: "wide",
  },
  {
    image: "/assets/work-14.jpg",
    title: "งานเสาเหล็กในอาคาร",
    scope: "ทาสีกันไฟเสาโครงสร้างหลัก",
  },
  {
    image: "/assets/work-15.jpg",
    title: "คลังสีกันไฟหน้าโครงการ",
    scope: "จัดส่งตรงถึงหน้างานทั่วประเทศ",
  },
  {
    image: "/assets/work-16.jpg",
    title: "คานเหล็กพร้อมยกติดตั้ง",
    scope: "ตรวจรับความหนาฟิล์มก่อนยก",
  },
];
