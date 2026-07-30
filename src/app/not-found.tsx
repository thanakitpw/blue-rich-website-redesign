import { Button, Container, Icon } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-brand-950 py-40">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(56rem_28rem_at_50%_0%,var(--color-brand-700),transparent_65%)]"
      />
      <Container className="relative text-center">
        <p className="font-display text-7xl font-bold text-brand-500/40 sm:text-8xl">404</p>
        <h1 className="mt-4 text-3xl text-white sm:text-4xl">ไม่พบหน้าที่คุณกำลังมองหา</h1>
        <p className="mx-auto mt-4 max-w-md text-brand-100/70">
          หน้านี้อาจถูกย้ายหรือลบไปแล้ว ลองกลับไปหน้าหลักหรือดูรายการสินค้าทั้งหมดของเรา
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg" variant="secondary">
            กลับหน้าหลัก
          </Button>
          <Button href="/products" size="lg" variant="ghost">
            ดูสินค้าทั้งหมด
            <Icon.arrow />
          </Button>
        </div>
      </Container>
    </section>
  );
}
