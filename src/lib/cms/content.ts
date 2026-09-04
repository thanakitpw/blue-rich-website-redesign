import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";
import type { Category, Product, Step } from "@/data/products";
import type { CategoryTile } from "@/data/home";
import type { Article } from "@/data/news";
import type { Project } from "@/data/projects";
import type { Faq } from "@/data/faq";
import type { ServicePage } from "@/data/fireproofing";
import type { NavItem, SiteInfo, Standard, Stat } from "@/data/site";

export type HomeShowcase = {
  flagshipSlug: string;
  bestSellerSlugs: string[];
  categoryTiles: CategoryTile[];
  valuePoints: string[];
};

export type LegalInfo = {
  title: string;
  intro: string;
  listTitle: string;
  items: string[];
};

/**
 * เนื้อหาที่เว็บหน้าบ้านใช้ — อ่านจาก Supabase เฉพาะสิ่งที่ "เผยแพร่แล้ว"
 *
 * ── ทำไมยังมี fallback ไปไฟล์ src/data/*.ts ──
 * ไฟล์เหล่านั้นคือเนื้อหาชุดตั้งต้นที่ใช้ seed ฐานข้อมูล (ตรวจแล้วว่าตรงกันทุก
 * ตัวอักษรด้วย scripts/cms-verify.mts) การถอยไปใช้จึงไม่ทำให้เนื้อหาเพี้ยน
 * มีไว้กัน deploy ที่ยังไม่ได้ใส่ env หรือ Supabase ล่ม แล้วเว็บทั้งเว็บหายไป
 *
 * ── ทำไมไม่ใช้ unstable_cache ──
 * Next 16 ประกาศแทนที่ด้วย `use cache` ซึ่งต้องเปิด Cache Components ทั้งโปรเจค
 * เว็บนี้ทุกหน้าเป็น static อยู่แล้ว จึงอ่าน DB แค่ตอน build กับตอนถูกสั่ง
 * revalidate หลังกดเผยแพร่ ส่วน cache() ของ React กันการยิงซ้ำภายใน request เดียว
 */

/** อ่านคอลัมน์ published ของตารางเนื้อหา คืน null เมื่ออ่านไม่ได้ ให้ผู้เรียกถอย */
const snapshots = async <T>(
  name: string,
  order: { column: string; ascending?: boolean },
): Promise<T[] | null> => {
  const sb = publicClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from(name)
    .select("published")
    .order(order.column, { ascending: order.ascending ?? true });

  if (error || !data) {
    // ไม่โยนต่อ — ปล่อยให้ผู้เรียกถอยไปใช้เนื้อหาตั้งต้น ดีกว่าทั้งหน้าพัง
    console.error(`[cms] อ่าน ${name} ไม่สำเร็จ:`, error?.message);
    return null;
  }
  return data.map((r) => r.published as T);
};

/** ค่าตั้งค่าเว็บไซต์รายคีย์ */
const setting = cache(async <T>(key: string): Promise<T | null> => {
  const sb = publicClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from("site_settings")
    .select("published_value")
    .eq("key", key)
    .maybeSingle();

  if (error) console.error(`[cms] อ่านค่า ${key} ไม่สำเร็จ:`, error.message);
  return (data?.published_value as T) ?? null;
});

/* ── เนื้อหาที่เป็นรายการ ─────────────────────────────────────────────── */

export const getCategories = cache(async (): Promise<Category[]> => {
  const rows = await snapshots<Category>("categories", { column: "sort_order" });
  return rows ?? (await import("@/data/products")).categories;
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const rows = await snapshots<Product>("products", { column: "sort_order" });
  return rows ?? (await import("@/data/products")).products;
});

export const getArticles = cache(async (): Promise<Article[]> => {
  // ใหม่สุดก่อน — ตรงกับลำดับเดิมในไฟล์ต้นฉบับ
  const rows = await snapshots<Article>("articles", { column: "date_iso", ascending: false });
  return rows ?? (await import("@/data/news")).articles;
});

export const getProjects = cache(async (): Promise<Project[]> => {
  const rows = await snapshots<Project>("projects", { column: "sort_order" });
  return rows ?? (await import("@/data/projects")).projects;
});

export const getHomeFaqs = cache(async (): Promise<Faq[]> => {
  const rows = await snapshots<Faq>("faqs", { column: "sort_order" });
  return rows ?? (await import("@/data/faq")).homeFaqs;
});

export const getServices = cache(async (): Promise<ServicePage[]> => {
  const rows = await snapshots<ServicePage>("services", { column: "sort_order" });
  return rows ?? (await import("@/data/fireproofing")).services;
});

/* ── ค่าตั้งค่าเว็บไซต์ ───────────────────────────────────────────────── */

export const getSiteInfo = cache(async (): Promise<SiteInfo> => {
  const v = await setting<SiteInfo>("company");
  return v ?? (await import("@/data/site")).site;
});

export const getNav = cache(async (): Promise<NavItem[]> => {
  const v = await setting<NavItem[]>("nav");
  return v ?? (await import("@/data/site")).nav;
});

export const getStandards = cache(async (): Promise<Standard[]> => {
  const v = await setting<Standard[]>("standards");
  return v ?? (await import("@/data/site")).standards;
});

export const getStats = cache(async (): Promise<Stat[]> => {
  const v = await setting<Stat[]>("stats");
  return v ?? (await import("@/data/site")).stats;
});

/* ── ตัวช่วยที่แทนของเดิมในไฟล์ข้อมูล ─────────────────────────────────── */

export const getCategory = async (slug: string) =>
  (await getCategories()).find((c) => c.slug === slug);

export const getProduct = async (slug: string) =>
  (await getProducts()).find((p) => p.slug === slug);

export const getProductsByCategory = async (slug: string) =>
  (await getProducts()).filter((p) => p.category === slug);

export const getArticle = async (slug: string) =>
  (await getArticles()).find((a) => a.slug === slug);

export const getService = async (slug: string) =>
  (await getServices()).find((s) => s.slug === slug);

/**
 * เนื้อหาหน้าแรกที่ไม่ได้มาจากตารางเนื้อหา — การ์ดหมวด สินค้าขายดี จุดเด่น
 * เก็บรวมเป็นก้อนเดียวเพราะหลังบ้านมีหน้าเดียวที่แก้ทั้งชุดนี้
 */
export const getHomeShowcase = cache(async (): Promise<HomeShowcase> => {
  const d = await import("@/data/home");
  const v = await setting<Partial<HomeShowcase>>("home_showcase");
  return {
    flagshipSlug: v?.flagshipSlug ?? d.flagshipSlug,
    bestSellerSlugs: v?.bestSellerSlugs ?? d.bestSellerSlugs,
    categoryTiles: v?.categoryTiles ?? d.categoryTiles,
    valuePoints: v?.valuePoints ?? d.valuePoints,
  };
});

/** ขั้นตอนการทา 4 ขั้น ที่หน้าสินค้าหลายตัวใช้ร่วมกัน */
export const getInstallationSteps = cache(async (): Promise<Step[]> => {
  const v = await setting<Step[]>("installation_steps");
  return v ?? (await import("@/data/products")).installationSteps;
});

/** บล็อกข้อกฎหมายที่หน้าสินค้ากันไฟใช้ร่วมกัน */
export const getLegalInfo = cache(async (): Promise<LegalInfo> => {
  const v = await setting<LegalInfo>("legal_info");
  return v ?? (await import("@/data/products")).legalInfo;
});

export const getRelatedProducts = async (product: Product) => {
  const all = await getProducts();
  return product.related
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => Boolean(p));
};
