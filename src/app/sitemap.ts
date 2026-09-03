import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { articles } from "@/data/news";
import { navRoutes, site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  /* Everything reachable from the main menu, plus the catalogue index. The
   * menu links straight to some product pages — those are de-duplicated
   * against the product loop below. */
  const menuRoutes = navRoutes
    .filter((path) => !path.includes("#") && !path.startsWith("/products/"))
    .map((path) => (path === "/" ? "" : path));

  const staticRoutes = Array.from(new Set([...menuRoutes, "/products"]));

  return [
    ...staticRoutes.map((path) => ({
      url: `${site.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...articles.map((a) => ({
      url: `${site.url}/news/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
