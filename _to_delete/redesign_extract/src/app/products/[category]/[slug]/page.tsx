import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, FileText } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { CategoryIcon } from "@/components/category-icon"
import { ProductCard } from "@/components/product-card"
import { ProductDetailActions } from "@/components/product-detail-actions"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CtaBanner } from "@/components/home/cta-banner"
import { catalogPdfPath, siteConfig } from "@/lib/site-data"
import { getCategoryWithItems, getProduct, readAllProducts } from "@/lib/products"

export const dynamic = "force-dynamic"

export function generateStaticParams() {
  return readAllProducts().map((p) => ({ category: p.categorySlug, slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params
  const product = getProduct(categorySlug, slug)
  if (!product) return {}
  return {
    title: product.name,
    description: `${product.description} Stocked by ${siteConfig.name}, Dubai UAE.`,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category: categorySlug, slug } = await params
  const category = getCategoryWithItems(categorySlug)
  if (!category) notFound()

  const product = category.items.find((p) => p.slug === slug)
  if (!product) notFound()

  const gallery = product.images && product.images.length > 0 ? product.images : product.image ? [product.image] : []

  const specRows = [
    product.grade ? { label: "Grade", value: product.grade } : null,
    product.standard ? { label: "Standard", value: product.standard } : null,
    { label: "Range", value: category.name },
    { label: "Availability", value: "In stock, Dubai UAE, confirm quantity with sales" },
  ].filter(Boolean) as { label: string; value: string }[]

  const related = category.items.filter((p) => p.id !== product.id).slice(0, 4)

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14 lg:px-12">
        <Breadcrumbs
          crumbs={[
            { label: "Products", href: "/products" },
            { label: category.name, href: `/categories/${category.slug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <ScrollReveal>
            <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white">
              {gallery.length > 0 ? (
                <Image
                  src={gallery[0]}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  quality={95}
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-2xl text-white" style={{ backgroundColor: category.color }}>
                  <CategoryIcon icon={category.icon} className="size-12" />
                </div>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {gallery.slice(1).map((src) => (
                  <div key={src} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-white">
                    <Image src={src} alt={product.name} fill sizes="120px" quality={90} className="object-contain p-2" />
                  </div>
                ))}
              </div>
            )}
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <div className="flex h-full flex-col">
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: category.color }}
              >
                <CategoryIcon icon={category.icon} className="size-3.5" />
                {category.name}
              </Link>

              <h1 className="mt-4 text-balance text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl md:text-4xl">
                {product.name}
              </h1>

              {(product.grade || product.standard) && (
                <p className="mt-3 text-sm font-semibold text-accent">
                  {product.grade}
                  {product.grade && product.standard && " · "}
                  {product.standard}
                </p>
              )}

              <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">{product.description}</p>

              <div className="mt-8 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {specRows.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-secondary/40" : ""}>
                        <td className="w-40 border-b border-border px-4 py-3 font-bold text-foreground last:border-b-0">{row.label}</td>
                        <td className="border-b border-border px-4 py-3 text-muted-foreground last:border-b-0">{row.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ProductDetailActions
                product={{
                  id: product.id,
                  name: product.name,
                  categorySlug: category.slug,
                  categoryName: category.name,
                  grade: product.grade,
                  standard: product.standard,
                  image: product.image,
                }}
              />

              <a
                href={catalogPdfPath}
                download="Sabta-Trading-Product-Catalog-2026.pdf"
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
              >
                <FileText className="size-3.5 shrink-0" aria-hidden="true" />
                Download Full Catalog (PDF)
              </a>
            </div>
          </ScrollReveal>
        </div>

        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-12 md:mt-20">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">More From {category.name}</h2>
              <Link href={`/categories/${category.slug}`} className="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
                View All
                <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} item={item} color={category.color} icon={category.icon} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CtaBanner />
    </>
  )
}
