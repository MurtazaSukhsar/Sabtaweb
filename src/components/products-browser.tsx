"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, ArrowRight } from "lucide-react"
import type { CategoryMeta } from "@/lib/site-data"
import { CategoryIcon } from "@/components/category-icon"

export type FlatItem = {
  name: string
  grade?: string
  standard?: string
  categorySlug: string
  categoryName: string
  slug: string
  color: string
  icon: CategoryMeta["icon"]
}

export function ProductsBrowser({ items }: { items: FlatItem[] }) {
  const [query, setQuery] = useState("")

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return items.filter((item) => item.name.toLowerCase().includes(q) || item.categoryName.toLowerCase().includes(q)).slice(0, 40)
  }, [query, items])

  return (
    <div>
      <div className="relative mx-auto max-w-2xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${items.length}+ product types (e.g. "shackle", "hex bolt", "grease nipple")`}
          aria-label="Search products"
          className="h-14 w-full rounded-xl border border-input bg-background pl-12 pr-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>

      {query.trim() && (
        <div className="mx-auto mt-6 max-w-3xl">
          {results.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              No product types match &ldquo;{query}&rdquo;. Try a different term or{" "}
              <Link href="/contact" className="font-semibold text-accent underline">
                ask our sales team
              </Link>
              .
            </p>
          ) : (
            <ul className="grid gap-2.5">
              {results.map((item) => (
                <li key={`${item.categorySlug}-${item.slug}`}>
                  <Link
                    href={`/products/${item.categorySlug}/${item.slug}`}
                    className="card-premium flex items-center justify-between gap-4 px-5 py-3.5"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg text-white" style={{ backgroundColor: item.color }}>
                        <CategoryIcon icon={item.icon} className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.categoryName}
                          {item.grade ? ` · Grade: ${item.grade}` : ""}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-accent" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
