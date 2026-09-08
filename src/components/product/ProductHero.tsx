import Link from "next/link";
import { CmsImage } from "@/components/CmsImage";
import { Button, Container, Icon } from "@/components/ui";
import Reveal from "@/components/ui/Reveal";
import type { Category, Product } from "@/data/products";

/**
 * เลย์เอาต์แบบแบนเนอร์ใหญ่ ใช้เฉพาะหน้าสีกันไฟสองตัวตามที่ลูกค้าสั่ง
 *
 * หน้าสินค้าปกติเปิดด้วยแกลเลอรีคู่กับกล่องข้อมูล ส่วนหน้านี้เปิดด้วยแบนเนอร์
 * รูปล้วนเต็มความกว้าง แล้วไล่ลงไปเป็น ชื่อ+ช่องทางสั่งซื้อ → การันตี+เอกสาร →
 * รายละเอียดสินค้า
 *
 * ไม่ได้เพิ่มฟิลด์ใหม่ในฐานข้อมูลเลย ข้อความทุกจุดดึงจากชื่อสินค้า คำโปรย และ
 * ป้ายมาตรฐานที่มีอยู่แล้ว ลูกค้าจึงยังแก้ได้จากหน้าจอสินค้าเดิมในหลังบ้าน
 */

/** รูปแบนเนอร์ต่อสินค้า — ตอนนี้ยังเป็นรูปชั่วคราว รอรูปจริงจากลูกค้า
    เปลี่ยนได้สองทาง: วางไฟล์ทับที่ path เดิม หรือกดเปลี่ยนจากจอแก้ไขในหลังบ้าน
    (ใช้ CmsImage จึงทับด้วยรูปจากคลังรูปได้เลย) */
export const PRODUCT_HERO: Record<
  string,
  { banner: string; eyebrow: string; cutout: string }
> = {
  "neocoat-intumescent-paint-s": {
    banner: "/assets/product-hero-paint-s.jpg",
    eyebrow: "Solvent-Based Intumescent Coating",
    cutout: "/assets/products/neocoat-paint-s-cutout.webp",
  },
  "neocoat-intumescent-paint-w": {
    banner: "/assets/product-hero-paint-w.jpg",
    eyebrow: "Water-Based Intumescent Coating",
    cutout: "/assets/products/neocoat-paint-w.webp",
  },
};

type Links = { telHref: string; lineHref: string; mailHref: string; phone: string };
type Hero = { banner: string; eyebrow: string; cutout: string };

/**
 * แบนเนอร์พร้อมข้อความทับ
 *
 * รูปที่ลูกค้าส่งมาเป็นรูปถ่ายล้วน ไม่มีตัวหนังสือในตัวรูป จึงวางข้อความทับได้
 * (ต่างจากรอบก่อนที่ตั้งใจไว้ว่าลูกค้าจะออกแบบตัวหนังสือมาในรูปเอง)
 *
 * ชื่อสินค้าอยู่บนแบนเนอร์ที่เดียว ไม่ซ้ำอีกใต้รูป — ส่วนที่อยู่ใต้รูปคือกล่อง
 * สอบถามราคาซึ่งเป็นคนละเรื่องกัน
 *
 * ล็อกสัดส่วน 23:10 เท่ากันทุกจอ รูปที่ส่งมา (2.304:1) จึงพอดีแทบไม่ต้องตัด
 */
export function ProductBanner({
  product,
  cat,
  hero,
  homeLabel,
}: {
  product: Product;
  cat?: Category;
  hero: Hero;
  homeLabel: string;
}) {
  return (
    <header className="pt-4 lg:pt-6">
      <Container>
        {/* จอเล็กกำหนดความสูงตรงๆ ไม่ใช้ aspect-ratio
            เพราะ aspect-ratio + min-height ทำให้เบราว์เซอร์ถอดความกว้างกลับจากความสูง
            (404px x 2.3 = ~929px) แบนเนอร์เลยกว้างเกินจอและดันทั้งหน้าให้เลื่อนแนวนอน
            w-full ตรึงความกว้างไว้อีกชั้น กันไม่ให้อัตราส่วนย้อนกลับมาคิดความกว้าง
            จอ sm ขึ้นไปพื้นที่กว้างพอแล้ว จึงกลับไปใช้อัตราส่วน 23:10 เหมือนเดิม */}
        <div className="relative h-[452px] w-full overflow-hidden rounded-3xl bg-brand-900 sm:aspect-23/10 sm:h-auto sm:min-h-[330px] lg:rounded-4xl">
          {/* alt ว่างเพราะเป็นรูปประกอบ ข้อความทั้งหมดเป็นตัวหนังสือจริงทับอยู่ด้านบน
              โปรแกรมอ่านหน้าจอจึงอ่านจากตัวหนังสือได้เลย ไม่ต้องอ่านซ้ำจาก alt */}
          <CmsImage
            src={hero.banner}
            alt=""
            fill
            priority
            sizes="(min-width: 1200px) 1140px, 100vw"
            className="object-cover"
          />

          {/* ม่านทับรูป วางให้เข้มตรงที่ตัวหนังสืออยู่จริงของแต่ละขนาดจอ
              ชั้นล่างมีทุกจอ รองเบรดครัมบ์ ป้ายมาตรฐาน และเป็นพื้นให้ถังสี
              จอเล็กข้อความอยู่บนซ้าย จึงไล่เข้มจากมุมบนซ้าย
              จอ sm ขึ้นไปข้อความอยู่ขวา จึงไล่เข้ามาจากขอบขวาเหมือนเดิม */}
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-brand-950/70 via-brand-950/20 to-brand-950/10"
          />
          <span
            aria-hidden
            className="absolute inset-0 bg-gradient-to-br from-brand-950/80 via-brand-950/30 to-transparent sm:hidden"
          />
          <span
            aria-hidden
            className="absolute inset-0 hidden bg-gradient-to-l from-brand-950/60 via-brand-950/25 to-transparent sm:block"
          />

          {/* รูปสินค้ามุมซ้ายล่าง วางลอยบนรูปถ่ายตรงๆ ไม่มีกรอบพื้นหลัง
              ใช้ไฟล์คนละใบกับรูปสินค้าปกติ — ใบนี้ตัดพื้นขาวออกให้โปร่งใสแล้ว
              (ไฟล์ในหน้าสินค้าและการ์ดหมวดยังเป็น PNG พื้นขาวเหมือนเดิม เพราะที่นั่น
              วางบนพื้นขาวอยู่แล้ว) เงาใต้ภาพช่วยให้ถังไม่ดูแปะติดกับรูปถ่าย */}
          <div className="pointer-events-none absolute bottom-4 left-5 w-[46%] max-w-[176px] sm:bottom-5 sm:left-8 sm:w-[25%] sm:max-w-[190px] lg:bottom-6 lg:left-11 lg:max-w-[224px]">
            <div className="relative aspect-square">
              <CmsImage
                src={hero.cutout}
                alt=""
                fill
                sizes="(min-width: 1024px) 224px, 46vw"
                className="object-contain object-bottom drop-shadow-[0_16px_28px_rgba(6,18,28,0.55)]"
              />
            </div>
          </div>

          {/* จอเล็ก: ข้อความชิดซ้ายไล่จากบนลงมา แล้วเว้นที่ด้านล่างไว้ให้รูปสินค้า
              จอใหญ่: กลับไปเป็นเบรดครัมบ์บน–ข้อความชิดขวาล่างเหมือนเดิม */}
          <div className="relative flex h-full flex-col justify-start gap-4 px-6 py-5 pb-[196px] sm:justify-between sm:gap-0 sm:px-9 sm:pb-5 lg:px-12 lg:py-8">
            {/* เบรดครัมบ์อยู่บนแบนเนอร์เลย ไม่ต้องมีแถบขาวคั่นก่อนถึงรูป */}
            <nav aria-label="breadcrumb">
              <ol className="flex flex-wrap items-center justify-end gap-1.5 text-[12.5px] text-white/70 sm:text-[13px]">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    {homeLabel}
                  </Link>
                </li>
                <li aria-hidden>›</li>
                <li>
                  <Link href="/products" className="transition hover:text-white">
                    สินค้าทั้งหมด
                  </Link>
                </li>
                {cat && (
                  <>
                    <li aria-hidden>›</li>
                    <li>
                      <Link
                        href={`/products?cat=${cat.slug}`}
                        className="transition hover:text-white"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            {/* จอเล็กชิดซ้าย · จอ sm ขึ้นไปชิดขวา — ขีดส้มกับป้ายมาตรฐานต้องย้ายตามทั้งก้อน
                ไม่งั้นจะลอยค้างอยู่คนละฝั่งกับตัวหนังสือ */}
            <div className="max-w-[46ch] text-left sm:ml-auto sm:text-right">
              <span
                aria-hidden
                className="block h-[3px] w-10 rounded-full bg-accent-500 sm:ml-auto lg:w-12"
              />
              <p className="eyebrow-en mt-3 text-[10.5px] text-white/75 lg:text-xs">
                {hero.eyebrow}
              </p>
              <h1 className="mt-1.5 text-[clamp(20px,3.4vw,40px)] break-words hyphens-auto leading-[1.18] font-semibold text-white drop-shadow-[0_2px_16px_rgba(12,26,36,0.6)]">
                {product.name}
              </h1>
              <p className="mt-2.5 ml-auto hidden text-[14.5px] leading-relaxed text-white/90 sm:block lg:mt-3.5 lg:text-[16px]">
                {product.tagline}
              </p>

              {product.badges.length > 0 && (
                <ul className="mt-4 flex flex-wrap justify-start gap-2 sm:justify-end lg:mt-5">
                  {product.badges.map((b) => (
                    <li
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm sm:px-3.5 sm:text-[12.5px]"
                    >
                      <Icon.check className="size-3.5 text-accent-400" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}

/**
 * แถบสอบถามราคา — ชื่อสินค้าไปอยู่บนแบนเนอร์แล้ว ตรงนี้เหลือเฉพาะเรื่องซื้อ-ขาย
 *
 * Blue Rich เสนอราคาเป็นรายโครงการ จึงไม่มีตัวเลขตายตัว ใช้ช่องนี้บอกเหตุผล
 * แล้วพาไปที่ช่องทางติดต่อแทน
 */
export function ProductQuote({ links }: { links: Links }) {
  return (
    <section className="pt-7 lg:pt-10">
      <Container>
        <div className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-10 lg:p-8">
          <div>
            <p className="text-[clamp(21px,2.4vw,27px)] leading-tight font-bold text-brand-600">
              สอบถามราคา
            </p>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-slate-500">
              ราคาขึ้นกับปริมาณและขอบเขตงาน · แจ้งพื้นที่หน้างานให้ทีมงานประเมินได้
            </p>
          </div>
          {/* ปุ่มโทรกินทั้งบรรทัดบนจอแคบ เบอร์จะได้ไม่ตกบรรทัดกลางเบอร์ */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap lg:shrink-0">
            <Button href={links.lineHref} variant="line" size="lg">
              <Icon.line className="size-[18px]" />
              สั่งซื้อผ่าน LINE
            </Button>
            <Button href={links.telHref} size="lg" className="whitespace-nowrap">
              <Icon.phone />
              โทร {links.phone}
            </Button>
            <Button href={links.mailHref} variant="ghost" size="lg">
              <Icon.mail />
              ส่งอีเมล
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

/**
 * แถวเอกสารดาวน์โหลด กางเต็มความกว้าง
 *
 * เดิมมีการ์ดการันตีสามใบอยู่เหนือแถวนี้ด้วย ลูกค้าขอให้เอาออกทุกหน้าสินค้า
 * (ทั้งหน้าที่ใช้เลย์เอาต์แบนเนอร์และหน้าที่ใช้เลย์เอาต์แกลเลอรี)
 */
export function ProductAssurance({ product }: { product: Product }) {
  const downloads = product.downloads ?? [];
  return (
    <section className="pt-9 lg:pt-12">
      <Container>
        {downloads.length > 0 && (
          <Reveal delay={120}>
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-6 lg:p-7">
              <p className="eyebrow-en text-[12px] tracking-[0.07em] text-accent-500">
                เอกสารดาวน์โหลด
              </p>
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                {downloads.map((d) => (
                  <a
                    key={d.href}
                    href={d.href}
                    target="_blank"
                    rel="noopener"
                    className="flex items-start gap-2.5 rounded-2xl border border-slate-200 px-4 py-3.5 text-[14px] font-medium text-brand-700 transition hover:border-brand-200 hover:bg-brand-50"
                  >
                    <Icon.doc className="mt-0.5 size-4 shrink-0 text-accent-500" />
                    {d.label}
                  </a>
                ))}
              </div>
              {product.downloadNote && (
                <p className="mt-4 text-[13px] leading-relaxed text-slate-400">
                  {product.downloadNote}
                </p>
              )}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
