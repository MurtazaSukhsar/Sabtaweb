"use client"

import { useState, useTransition, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  ChevronDown,
  ChevronRight,
  Filter,
  GripVertical,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react"
import type { CategoryWithItems, Product } from "@/lib/products"
import { deleteProductAction, reorderCategoryAction } from "@/app/admin/actions"

export function AdminDashboard({ categories }: { categories: CategoryWithItems[] }) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || "all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openSlugs, setOpenSlugs] = useState<Set<string>>(() => {
    if (categoryParam) return new Set([categoryParam])
    return new Set(categories.length > 0 ? [categories[0].slug] : [])
  })

  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Product[]>>(() =>
    Object.fromEntries(categories.map((c) => [c.slug, c.items])),
  )
  const [isPending, startTransition] = useTransition()
  const [dragId, setDragId] = useState<string | null>(null)

  // When category query param changes (e.g. redirected after saving a product),
  // open and scroll to that category smoothly.
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      setOpenSlugs((prev) => new Set([...prev, categoryParam]))

      // Wait for DOM to render then scroll to the element
      const timer = setTimeout(() => {
        const el = document.getElementById(`category-${categoryParam}`)
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [categoryParam])

  // Filtered items computation
  const query = searchQuery.trim().toLowerCase()

  const filteredCategories = useMemo(() => {
    return categories
      .filter((cat) => selectedCategory === "all" || cat.slug === selectedCategory)
      .map((cat) => {
        const items = itemsByCategory[cat.slug] ?? []
        if (!query) return { ...cat, matchingItems: items }

        const matching = items.filter((p) => {
          return (
            p.name.toLowerCase().includes(query) ||
            p.slug.toLowerCase().includes(query) ||
            (p.grade && p.grade.toLowerCase().includes(query)) ||
            (p.standard && p.standard.toLowerCase().includes(query)) ||
            (p.description && p.description.toLowerCase().includes(query)) ||
            cat.name.toLowerCase().includes(query)
          )
        })

        return { ...cat, matchingItems: matching }
      })
  }, [categories, itemsByCategory, selectedCategory, query])

  const totalMatches = useMemo(() => {
    return filteredCategories.reduce((sum, c) => sum + c.matchingItems.length, 0)
  }, [filteredCategories])

  const totalAllProducts = useMemo(() => {
    return Object.values(itemsByCategory).reduce((sum, items) => sum + items.length, 0)
  }, [itemsByCategory])

  // Auto-expand all categories that have matching items when user searches
  useEffect(() => {
    if (query) {
      const slugsWithMatches = filteredCategories
        .filter((c) => c.matchingItems.length > 0)
        .map((c) => c.slug)
      setOpenSlugs(new Set(slugsWithMatches))
    }
  }, [query, filteredCategories])

  function toggleSlug(slug: string) {
    setOpenSlugs((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  function expandAll() {
    setOpenSlugs(new Set(categories.map((c) => c.slug)))
  }

  function collapseAll() {
    setOpenSlugs(new Set())
  }

  function handleDrop(categorySlug: string, sourceId: string, targetId: string) {
    if (!sourceId || sourceId === targetId) return
    const items = [...(itemsByCategory[categorySlug] ?? [])]
    const fromIdx = items.findIndex((p) => p.id === sourceId)
    const toIdx = items.findIndex((p) => p.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const [moved] = items.splice(fromIdx, 1)
    items.splice(toIdx, 0, moved)
    setItemsByCategory((prev) => ({ ...prev, [categorySlug]: items }))
    setDragId(null)
    startTransition(async () => {
      await reorderCategoryAction(
        categorySlug,
        items.map((p) => p.id),
      )
    })
  }

  async function handleDelete(id: string, categorySlug: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setItemsByCategory((prev) => ({
      ...prev,
      [categorySlug]: prev[categorySlug].filter((p) => p.id !== id),
    }))
    await deleteProductAction(id)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Search & Filters Controls */}
      <div className="card-premium flex flex-col gap-4 p-4 sm:p-5">
        {/* Search Input Bar */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by name, grade, standard (e.g. DIN934, shackle, 316)..."
            className="h-11 w-full rounded-lg border border-input bg-background pl-11 pr-10 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Category Pills Filter */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Filter className="size-3.5" /> Category:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                selectedCategory === "all"
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All ({totalAllProducts})
            </button>
            {categories.map((cat) => {
              const count = itemsByCategory[cat.slug]?.length ?? 0
              const isSelected = selectedCategory === cat.slug
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat.slug)
                    setOpenSlugs(new Set([cat.slug]))
                  }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="text-xs font-semibold text-muted-foreground hover:text-accent"
            >
              Expand all
            </button>
            <span className="text-muted-foreground/40">•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-xs font-semibold text-muted-foreground hover:text-accent"
            >
              Collapse all
            </button>
          </div>
        </div>

        {searchQuery && (
          <div className="rounded-lg bg-accent/10 px-3.5 py-2 text-xs font-semibold text-accent">
            Found {totalMatches} matching product{totalMatches === 1 ? "" : "s"} for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
      </div>

      {/* Categories & Products Accordions */}
      <div className="flex flex-col gap-4">
        {filteredCategories.map((cat) => {
          const items = cat.matchingItems
          const totalCategoryItems = itemsByCategory[cat.slug]?.length ?? 0
          const isOpen = openSlugs.has(cat.slug)

          if (searchQuery && items.length === 0) {
            return null
          }

          return (
            <div
              key={cat.slug}
              id={`category-${cat.slug}`}
              className={`card-premium overflow-hidden p-0 transition-shadow ${
                categoryParam === cat.slug ? "ring-2 ring-accent shadow-md" : ""
              }`}
            >
              <div className="flex items-center justify-between gap-4 px-5 py-4">
                <button
                  type="button"
                  onClick={() => toggleSlug(cat.slug)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  {isOpen ? (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="text-sm font-bold uppercase tracking-wider text-foreground">{cat.name}</span>
                  <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                    {searchQuery ? `${items.length} / ${totalCategoryItems}` : `${totalCategoryItems} products`}
                  </span>
                </button>

                <Link
                  href={`/admin/products/new?category=${cat.slug}`}
                  className="inline-flex items-center gap-1 rounded-md border border-accent/30 bg-accent/5 px-2.5 py-1.5 text-xs font-bold text-accent transition-colors hover:bg-accent hover:text-white"
                >
                  <Plus className="size-3.5" /> Add to {cat.name}
                </Link>
              </div>

              {isOpen && (
                <div className="border-t border-border">
                  {items.length === 0 ? (
                    <p className="px-5 py-6 text-sm text-muted-foreground">
                      {searchQuery
                        ? "No matching products in this category."
                        : "No products in this range yet."}
                    </p>
                  ) : (
                    <ul>
                      {items.map((item) => (
                        <li
                          key={item.id}
                          draggable={!searchQuery}
                          onDragStart={(e) => {
                            if (searchQuery) return
                            e.dataTransfer.setData("text/plain", item.id)
                            e.dataTransfer.effectAllowed = "move"
                            setDragId(item.id)
                          }}
                          onDragOver={(e) => {
                            if (searchQuery) return
                            e.preventDefault()
                            e.dataTransfer.dropEffect = "move"
                          }}
                          onDrop={(e) => {
                            if (searchQuery) return
                            e.preventDefault()
                            const sourceId = e.dataTransfer.getData("text/plain")
                            handleDrop(cat.slug, sourceId, item.id)
                          }}
                          onDragEnd={() => setDragId(null)}
                          className={`flex items-center gap-3 border-b border-border px-5 py-3 transition-colors last:border-b-0 hover:bg-secondary/30 ${
                            dragId === item.id ? "opacity-50" : ""
                          }`}
                        >
                          {!searchQuery && (
                            <GripVertical
                              className="size-4 shrink-0 cursor-grab text-muted-foreground"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="48px"
                                className="object-contain p-1"
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center text-[10px] text-muted-foreground">
                                No img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 truncate text-sm font-bold text-foreground">
                              {item.featured && (
                                <Star
                                  className="size-3.5 shrink-0 fill-accent text-accent"
                                  aria-label="Featured on homepage"
                                />
                              )}
                              <span className="truncate">{item.name}</span>
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.grade}
                              {item.grade && item.standard && " · "}
                              {item.standard}
                              {(item.grade || item.standard) && item.slug && " · "}
                              <span className="opacity-75">{item.slug}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/products/${item.id}/edit`}
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                              title="Edit product"
                            >
                              <Pencil className="size-4" aria-hidden="true" />
                            </Link>
                            <button
                              type="button"
                              onClick={() => handleDelete(item.id, cat.slug, item.name)}
                              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:border-red-300 hover:text-red-600"
                              title="Delete product"
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {filteredCategories.every((c) => c.matchingItems.length === 0) && (
          <div className="card-premium py-12 text-center text-muted-foreground">
            <p className="text-base font-bold text-foreground">No products found</p>
            <p className="mt-1 text-sm">Try searching for a different keyword or select &ldquo;All Categories&rdquo;.</p>
          </div>
        )}
      </div>

      {isPending && <p className="text-xs text-muted-foreground">Saving order…</p>}
    </div>
  )
}
