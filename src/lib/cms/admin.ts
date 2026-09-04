import { serverClient } from "@/lib/supabase/server";
import type { Download, Faq, InfoList, SpecRow, SpecTable } from "@/data/products";

/**
 * แถวฉบับร่างที่หลังบ้านอ่านและแก้
 *
 * คอลัมน์ปกติ = ฉบับร่าง · คอลัมน์ published = สแนปช็อตที่เว็บจริงอ่าน
 * ชื่อฟิลด์เป็น snake_case ตามฐานข้อมูล ไม่ใช่ camelCase แบบ type ฝั่งเว็บ
 * เพื่อให้เห็นชัดตอนอ่านโค้ดว่ากำลังอยู่ฝั่งไหน
 */
export type ProductRow = {
  id: number;
  slug: string;
  name: string;
  category_slug: string;
  tagline: string;
  card_summary: string;
  badges: string[];
  quick_specs: SpecRow[];
  image: string;
  gallery: string[];
  downloads: Download[];
  download_note: string | null;
  description: string[];
  lists: InfoList[];
  specs: SpecRow[];
  spec_note: string | null;
  spec_table: SpecTable | null;
  installation: boolean;
  legal_standards: string | null;
  faq: Faq[];
  related: string[];
  featured: boolean;
  best_seller: boolean;
  sort_order: number;
  has_draft: boolean;
  published_at: string | null;
  updated_at: string;
};

export type ArticleRow = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date_iso: string | null;
  date_label: string;
  tag: string;
  body: string[];
  has_draft: boolean;
  published_at: string | null;
  updated_at: string;
};

export type CategoryRow = {
  id: number;
  slug: string;
  name: string;
  short: string;
  description: string;
  image: string;
  sort_order: number;
  has_draft: boolean;
};

export type ProjectRow = {
  id: number;
  image: string;
  title: string;
  scope: string;
  span: "wide" | "tall" | null;
  sort_order: number;
  has_draft: boolean;
};

export type FaqRow = {
  id: number;
  page: string;
  question: string;
  answer: string;
  sort_order: number;
  has_draft: boolean;
};

export type ServiceRow = {
  id: number;
  slug: string;
  label: string;
  eyebrow: string;
  title: string;
  lede: string;
  image: string;
  highlights: string[];
  blocks: { title: string; body: string }[];
  products: string[];
  faq: Faq[];
  sort_order: number;
  has_draft: boolean;
  updated_at: string;
};

const PRODUCT_COLS =
  "id, slug, name, category_slug, tagline, card_summary, badges, quick_specs, image, " +
  "gallery, downloads, download_note, description, lists, specs, spec_note, spec_table, " +
  "installation, legal_standards, faq, related, featured, best_seller, sort_order, " +
  "has_draft, published_at, updated_at";
const ARTICLE_COLS =
  "id, slug, title, excerpt, image, date_iso, date_label, tag, body, has_draft, published_at, updated_at";
const SERVICE_COLS =
  "id, slug, label, eyebrow, title, lede, image, highlights, blocks, products, faq, " +
  "sort_order, has_draft, updated_at";

export async function listProducts(): Promise<ProductRow[]> {
  const sb = await serverClient();
  if (!sb) return [];
  const { data } = await sb.from("products").select(PRODUCT_COLS).order("sort_order");
  return (data ?? []) as unknown as ProductRow[];
}

export async function getProductRow(slug: string): Promise<ProductRow | null> {
  const sb = await serverClient();
  if (!sb) return null;
  const { data } = await sb.from("products").select(PRODUCT_COLS).eq("slug", slug).maybeSingle();
  return (data as unknown as ProductRow) ?? null;
}

export async function listArticles(): Promise<ArticleRow[]> {
  const sb = await serverClient();
  if (!sb) return [];
  const { data } = await sb
    .from("articles")
    .select(ARTICLE_COLS)
    .order("date_iso", { ascending: false })
    .order("id");
  return (data ?? []) as unknown as ArticleRow[];
}

export async function getArticleRow(slug: string): Promise<ArticleRow | null> {
  const sb = await serverClient();
  if (!sb) return null;
  const { data } = await sb.from("articles").select(ARTICLE_COLS).eq("slug", slug).maybeSingle();
  return (data as unknown as ArticleRow) ?? null;
}

export async function listCategories(): Promise<CategoryRow[]> {
  const sb = await serverClient();
  if (!sb) return [];
  const { data } = await sb
    .from("categories")
    .select("id, slug, name, short, description, image, sort_order, has_draft")
    .order("sort_order");
  return (data ?? []) as unknown as CategoryRow[];
}

export async function listProjects(): Promise<ProjectRow[]> {
  const sb = await serverClient();
  if (!sb) return [];
  const { data } = await sb
    .from("projects")
    .select("id, image, title, scope, span, sort_order, has_draft")
    .order("sort_order")
    .order("id");
  return (data ?? []) as unknown as ProjectRow[];
}

export async function listFaqs(page = "home"): Promise<FaqRow[]> {
  const sb = await serverClient();
  if (!sb) return [];
  const { data } = await sb
    .from("faqs")
    .select("id, page, question, answer, sort_order, has_draft")
    .eq("page", page)
    .order("sort_order")
    .order("id");
  return (data ?? []) as unknown as FaqRow[];
}

export async function listServices(): Promise<ServiceRow[]> {
  const sb = await serverClient();
  if (!sb) return [];
  const { data } = await sb.from("services").select(SERVICE_COLS).order("sort_order");
  return (data ?? []) as unknown as ServiceRow[];
}

export async function getServiceRow(slug: string): Promise<ServiceRow | null> {
  const sb = await serverClient();
  if (!sb) return null;
  const { data } = await sb.from("services").select(SERVICE_COLS).eq("slug", slug).maybeSingle();
  return (data as unknown as ServiceRow) ?? null;
}

/** ค่าตั้งค่าเว็บไซต์ฉบับร่าง — ถ้ายังไม่เคยแก้ ให้ถอยไปฉบับเผยแพร่ */
export async function getSettingDraft<T>(key: string): Promise<T | null> {
  const sb = await serverClient();
  if (!sb) return null;
  const { data } = await sb
    .from("site_settings")
    .select("draft_value, published_value")
    .eq("key", key)
    .maybeSingle();
  return ((data?.draft_value ?? data?.published_value) as T) ?? null;
}

/** คีย์ไหนมีร่างค้างบ้าง — ใช้ติดป้ายบนหน้าตั้งค่า */
export async function dirtySettingKeys(): Promise<Set<string>> {
  const sb = await serverClient();
  if (!sb) return new Set();
  const { data } = await sb.from("site_settings").select("key, draft_value, published_value");
  return new Set(
    (data ?? [])
      .filter((r) => JSON.stringify(r.draft_value) !== JSON.stringify(r.published_value))
      .map((r) => r.key as string),
  );
}

/** ตัวเลขบนแดชบอร์ด */
export async function dashboardStats() {
  const sb = await serverClient();
  const empty = {
    products: 0, articles: 0, projects: 0, faqs: 0,
    dirtyProducts: 0, dirtyArticles: 0, dirtyProjects: 0,
    dirtyFaqs: 0, dirtyServices: 0, dirtyCategories: 0, dirtySettings: 0,
  };
  if (!sb) return empty;

  const count = async (table: string, dirty = false) => {
    let q = sb.from(table).select("id", { count: "exact", head: true });
    if (dirty) q = q.eq("has_draft", true);
    const { count: c } = await q;
    return c ?? 0;
  };

  const [
    products, articles, projects, faqs,
    dirtyProducts, dirtyArticles, dirtyProjects, dirtyFaqs, dirtyServices, dirtyCategories,
    dirtySettings,
  ] = await Promise.all([
    count("products"), count("articles"), count("projects"), count("faqs"),
    count("products", true), count("articles", true), count("projects", true),
    count("faqs", true), count("services", true), count("categories", true),
    dirtySettingKeys().then((s) => s.size),
  ]);

  return {
    products, articles, projects, faqs,
    dirtyProducts, dirtyArticles, dirtyProjects, dirtyFaqs, dirtyServices,
    dirtyCategories, dirtySettings,
  };
}

/** "3 นาทีที่แล้ว" — ใช้ทุกหน้ารายการ */
export function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const m = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 1) return "เมื่อครู่";
  if (m < 60) return `${m} นาทีที่แล้ว`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ชั่วโมงที่แล้ว`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} วันที่แล้ว`;
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric",
  });
}
