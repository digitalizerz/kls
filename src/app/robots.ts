import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/portal", "/technician", "/onboarding", "/api", "/login", "/register", "/forgot-password", "/reset-password"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
