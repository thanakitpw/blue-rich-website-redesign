import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/layout/FloatingActions";

/**
 * Chrome shared by every page of the main site. The ad landing pages sit
 * outside this group so they render with no navigation pulling visitors away.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <FloatingActions />
    </>
  );
}
