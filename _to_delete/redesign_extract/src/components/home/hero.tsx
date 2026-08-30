import Link from "next/link"
import Image from "next/image"
import { ArrowRight, PackageCheck, ShieldCheck } from "lucide-react"
import { catalogPagePath, siteConfig } from "@/lib/site-data"

// A small, hand-picked spread of real catalogue pages — not stock photography —
// arranged as a static mosaic so the hero shows actual Sabta product sheets.
const mosaicPages = [13, 30, 3, 23]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary py-16 sm:py-20 md:py-24 lg:py-28">
      <div className="absolute inset-0 surface-grid opacity-[0.05]" aria-hidden="true" />
      <div className="absolute -top-24 -right-24 size-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground backdrop-blur-md">
              <span className="relative flex size-2 rounded-full bg-accent" aria-hidden="true">
                <span className="soft-pulse absolute inset-0 rounded-full bg-accent" />
              </span>
              <span>Dubai, UAE &middot; Since {siteConfig.founded}</span>
            </div>

            <h1 className="text-balance text-3xl font-black uppercase leading-[1.08] tracking-tight text-primary-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Fasteners &amp; Industrial Hardware, Ready to Ship
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-primary-foreground/80 md:text-lg">
              A Dubai-based fastener distributor since 1994, stocking {siteConfig.itemsInStock} items for Automotive,
              Manufacturing, Marine and Oilfield, with sourcing behind us for anything not on the shelf.
            </p>

            <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-white/90 sm:gap-4">
              <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                <PackageCheck className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{siteConfig.itemsInStock} Items In Stock</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 backdrop-blur-md">
                <ShieldCheck className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span>304 &amp; 316 Marine Grade Stock</span>
              </div>
            </div>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="inline-flex h-13 items-center justify-center gap-2.5 rounded-xl btn-primary px-8 text-sm font-bold uppercase tracking-wider shadow-2xl transition-transform hover:scale-[1.03]"
              >
                <span>Browse Products</span>
                <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white hover:text-primary"
              >
                Request a Quote
              </Link>
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
            {mosaicPages.map((page, i) => (
              <div
                key={page}
                className={`relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl ${
                  i % 2 === 1 ? "translate-y-5 sm:translate-y-8" : ""
                }`}
              >
                <Image
                  src={catalogPagePath(page)}
                  alt="Sabta Trading product catalogue page"
                  fill
                  sizes="(max-width: 1024px) 45vw, 22vw"
                  className="object-cover object-top"
                  priority={i < 2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
