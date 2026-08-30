import type { Metadata } from "next"
import { Download } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryCard } from "@/components/category-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { ProductsBrowser, type FlatItem } from "@/components/products-browser"
import { CtaBanner } from "@/components/home/cta-banner"
import { catalogPdfPath, categories, siteConfig } from "@/lib/site-data"
import { getAllCategoriesWithItems } from "@/lib/products"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Products",
  description: `Browse all ${categories.length} fastener and marine rigging hardware ranges stocked by ${siteConfig.name}, ${siteConfig.itemsInStock} items in stock, Dubai UAE.`,
}

export default function ProductsPage() {
  const categoriesWithItems = getAllCategoriesWithItems()
  const flatItems: FlatItem[] = categoriesWithItems.flatMap((cat) =>
    cat.items.map((item) => ({
      name: item.name,
      grade: item.grade,
      standard: item.standard,
      categorySlug: cat.slug,
      categoryName: cat.name,
      slug: item.slug,
      color: cat.color,
      icon: cat.icon,
    })),
  )

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
          <p className="eyebrow !text-accent">Product Catalogue</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            {siteConfig.itemsInStock} Items, Nine Ranges
          </h1>
          <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            Every range below is stocked ready to ship from Dubai. Search for a specific product type, browse a range, or
            download the full 2026 catalogue.
          </p>
          <a
            href={catalogPdfPath}
            download="Sabta-Trading-Product-Catalog-2026.pdf"
            className="mt-7 inline-flex h-13 items-center gap-2.5 rounded-xl border border-white/30 bg-white/10 px-7 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white hover:text-primary"
          >
            <Download className="size-4 shrink-0" aria-hidden="true" />
            Download Full Catalog (PDF)
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12">
        <Breadcrumbs crumbs={[{ label: "Products" }]} />

        <div className="mt-10">
          <ProductsBrowser items={flatItems} />
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {categoriesWithItems.map((cat, i) => (
            <ScrollReveal key={cat.slug} delay={i * 50} className="h-full">
              <CategoryCard category={cat} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
