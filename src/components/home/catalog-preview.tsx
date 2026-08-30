import Image from "next/image"
import { catalogPagePath } from "@/lib/site-data"

const pages = [3, 13, 19, 23, 27, 30, 33, 38, 41, 44]
const doubled = [...pages, ...pages]

export function CatalogPreview() {
  return (
    <section className="relative overflow-hidden bg-primary/98 py-10 md:py-14" aria-label="Catalogue preview">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">

      </div>

      <div className="relative w-full overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-primary via-primary/60 to-transparent md:w-28" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-primary via-primary/60 to-transparent md:w-28" aria-hidden="true" />

        <div className="marquee-track">
          {doubled.map((page, i) => (
            <div
              key={`${page}-${i}`}
              className="relative mx-2 h-40 w-30 shrink-0 overflow-hidden rounded-lg border border-primary-foreground/10 bg-white shadow-md sm:h-48 sm:w-36"
            >
              <Image src={catalogPagePath(page)} alt="Sabta Trading catalogue page" fill sizes="180px" className="object-cover object-top" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
