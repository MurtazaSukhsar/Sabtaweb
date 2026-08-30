import type { MetadataRoute } from "next"
import { getSiteConfig, getAllCategoriesWithItems } from "@/lib/db"
import { readAllPosts } from "@/lib/blog"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = await getSiteConfig()
  const base = siteConfig.url
  const staticRoutes = ["", "/about", "/products", "/contact", "/faq", "/blog"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }))

  const categoriesWithItems = await getAllCategoriesWithItems()

  const categoryRoutes = categoriesWithItems.map((cat) => ({
    url: `${base}/categories/${cat.slug}`,
    lastModified: new Date(),
  }))

  const productRoutes = categoriesWithItems.flatMap((cat) =>
    cat.items.map((item) => ({
      url: `${base}/products/${cat.slug}/${item.slug}`,
      lastModified: new Date(),
    })),
  )

  const blogRoutes = (await readAllPosts()).map((post) => ({
    url: `${base}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...blogRoutes]
}

