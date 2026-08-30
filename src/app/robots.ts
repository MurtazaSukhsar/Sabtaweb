import type { MetadataRoute } from "next"
import { getSiteConfig } from "@/lib/db"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteConfig = await getSiteConfig()
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}

