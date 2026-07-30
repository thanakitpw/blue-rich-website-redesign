import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { articles } from "@/data/news";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/products", "/projects", "/about", "/news", "/contact"];

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
