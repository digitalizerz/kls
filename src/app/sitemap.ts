import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

const routes = ["", "/services", "/how-it-works", "/why-kls", "/service-options", "/contact", "/privacy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const lastModified = new Date();

  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified,
    changeFrequency: path === "" || path === "/services" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/services" ? 0.9 : path === "/contact" ? 0.8 : path.startsWith("/privacy") || path.startsWith("/terms") ? 0.3 : 0.7,
  }));
}
