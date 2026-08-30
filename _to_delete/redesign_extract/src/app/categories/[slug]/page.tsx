import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, FileText } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryIcon } from "@/components/category-icon"
import { ProductCard } from "@/components/product-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CtaBanner } from "@/components/home/cta-banner"
import { catalogPdfPath, categories, siteConfig } from "@/lib/site-data"
import { getCategoryWithItems } from "@/lib/products"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}
  return {
    title: category.name,
    description: `${category.description} Stocked by ${siteConfig.name}, Dubai UAE.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = getCategoryWithItems(slug)
  if (!category) notFound()

  const others = categories.filter((c) => c.slug !== category.slug)

  return (
    <>
      <section className="relative overflow-hidden bg-primary">
        <div className="absolute inset-0 surface-grid opacity-[0.05]" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 md:px-8 md:py-20 lg:px-12">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg" style={{ backgroundColor: category.color }}>
              <CategoryIcon icon={category.icon} className="size-7" />
            </div>
            <div>
              {category.brandNote && <p className="eyebrow !text-accent">{category.brandNote}</p>}
              <h1 className="text-balance text-2xl font-extrabold uppercase tracking-tight text-primary-foreground sm:text-3xl md:text-5xl">
                {category.name}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base">{category.description}</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12">
        <Breadcrumbs crumbs={[{ label: "Products", href: "/products" }, { label: category.name }]} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_18rem]">
          <ScrollReveal>
            <div>
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">Product Types In This Range</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {category.items.length} product types, grades and standards as stocked. Confirm current availability with our sales team.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="card-premium flex flex-col gap-4 p-6 lg:sticky lg:top-24">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">Request This Range</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Send us the exact size, grade and quantity, and our sales team will confirm stock and pricing.
              </p>
              <Link
                href={`/contact?category=${encodeURIComponent(category.name)}`}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg btn-primary text-sm"
              >
                Get a Quote
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
              <a
                href={catalogPdfPath}
                download="Sabta-Trading-Product-Catalog-2026.pdf"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg btn-secondary text-sm"
              >
                <FileText className="size-4 shrink-0" aria-hidden="true" />
                Download Full Catalog
              </a>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={80}>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {category.items.map((item) => (
              <ProductCard key={item.id} item={item} color={category.color} icon={category.icon} />
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-16 border-t border-border pt-12 md:mt-20">
          <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">Other Ranges</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.slice(0, 4).map((cat) => (
              <Link key={cat.slug} href={`/categories/${cat.slug}`} className="card-premium group flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: cat.color }}>
                  <CategoryIcon icon={cat.icon} className="size-5" />
                </div>
                <span className="text-sm font-bold leading-tight text-foreground">{cat.name}</span>
                <ArrowRight className="ml-auto size-4 shrink-0 text-accent opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
