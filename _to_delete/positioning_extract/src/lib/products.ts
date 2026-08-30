// File-based product store. Product-level catalog data lives in
// data/products.json (not hardcoded in site-data.ts) so that the admin
// dashboard can add, edit, delete and reorder products at runtime without a
// code change or rebuild.
//
// This module touches the filesystem (`fs`) and must only be imported from
// server components, route handlers, or Server Actions — never from a
// component marked "use client".

import fs from "fs"
import path from "path"
import { categories, type CategoryMeta } from "@/lib/site-data"

export type Product = {
  id: string
  categorySlug: string
  slug: string
  name: string
  grade?: string
  standard?: string
  description: string
  image?: string
  /** Optional gallery of additional photos, beyond the primary `image`. */
  images?: string[]
  /** Hand-picked for the homepage "Featured Products" showcase. */
  featured?: boolean
  order: number
}

export type CategoryWithItems = CategoryMeta & { items: Product[] }

const DATA_FILE = path.join(process.cwd(), "data", "products.json")

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]\n", "utf8")
}

export function readAllProducts(): Product[] {
  ensureDataFile()
  const raw = fs.readFileSync(DATA_FILE, "utf8")
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as Product[]
  } catch {
    return []
  }
}

export function writeAllProducts(products: Product[]) {
  ensureDataFile()
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2) + "\n", "utf8")
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

function uniqueSlug(base: string, categorySlug: string, products: Product[], excludeId?: string) {
  const taken = new Set(
    products.filter((p) => p.categorySlug === categorySlug && p.id !== excludeId).map((p) => p.slug),
  )
  let slug = base || "product"
  let n = 2
  while (taken.has(slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  return slug
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return readAllProducts()
    .filter((p) => p.categorySlug === categorySlug)
    .sort((a, b) => a.order - b.order)
}

export function getProduct(categorySlug: string, slug: string): Product | undefined {
  return readAllProducts().find((p) => p.categorySlug === categorySlug && p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return readAllProducts().find((p) => p.id === id)
}

export function getCategoryWithItems(slug: string): CategoryWithItems | undefined {
  const meta = categories.find((c) => c.slug === slug)
  if (!meta) return undefined
  return { ...meta, items: getProductsByCategory(slug) }
}

export function getAllCategoriesWithItems(): CategoryWithItems[] {
  const all = readAllProducts()
  return categories.map((meta) => ({
    ...meta,
    items: all.filter((p) => p.categorySlug === meta.slug).sort((a, b) => a.order - b.order),
  }))
}

// Categories that represent the site's core identity: fasteners (bolts,
// nuts, washers) and marine rigging hardware. When the homepage showcase
// needs to backfill beyond hand-picked "featured" products, it leans into
// these first so the showcase reads as fastener-and-marine-rigging-centric
// rather than an arbitrary mix of everything in stock.
const FEATURED_PRIORITY_CATEGORIES = ["rigging-hardware", "lifting-marine-hardware", "bolts-screws", "nuts", "washers"]

/**
 * Products for the homepage "Featured Products" showcase. Prioritizes
 * anything hand-picked as `featured` in the admin panel. If fewer than
 * `limit` are marked, backfills by round-robining the newest products
 * across the fastener + marine rigging hardware categories above (so the
 * mix stays balanced rather than being dominated by whichever category
 * happens to have the most recent uploads), then falls back to the rest
 * of the catalog if still short. Products without a photo are skipped —
 * the showcase is a visual carousel.
 */
export function getFeaturedProducts(limit = 10): Product[] {
  const withImages = readAllProducts().filter((p) => !!p.image)
  const marked = withImages.filter((p) => p.featured)
  if (marked.length >= limit) return marked.slice(0, limit)

  const unmarked = withImages.filter((p) => !p.featured)
  const byCategory = new Map<string, Product[]>(
    FEATURED_PRIORITY_CATEGORIES.map((slug) => [slug, unmarked.filter((p) => p.categorySlug === slug).reverse()]),
  )

  const priorityPicks: Product[] = []
  let addedInRound = true
  while (addedInRound && marked.length + priorityPicks.length < limit) {
    addedInRound = false
    for (const slug of FEATURED_PRIORITY_CATEGORIES) {
      if (marked.length + priorityPicks.length >= limit) break
      const next = byCategory.get(slug)!.shift()
      if (next) {
        priorityPicks.push(next)
        addedInRound = true
      }
    }
  }

  const usedIds = new Set([...marked, ...priorityPicks].map((p) => p.id))
  const stillNeeded = limit - marked.length - priorityPicks.length
  const rest = stillNeeded > 0 ? [...unmarked].reverse().filter((p) => !usedIds.has(p.id)).slice(0, stillNeeded) : []

  return [...marked, ...priorityPicks, ...rest]
}

export type NewProductInput = {
  categorySlug: string
  name: string
  grade?: string
  standard?: string
  description: string
  image?: string
  featured?: boolean
}

export function addProduct(input: NewProductInput): Product {
  const products = readAllProducts()
  const baseSlug = slugify(input.name)
  const slug = uniqueSlug(baseSlug, input.categorySlug, products)
  const id = `${input.categorySlug}--${slug}`
  const order = products.filter((p) => p.categorySlug === input.categorySlug).length
  const product: Product = {
    id,
    categorySlug: input.categorySlug,
    slug,
    name: input.name.trim(),
    grade: input.grade?.trim() || undefined,
    standard: input.standard?.trim() || undefined,
    description: input.description.trim(),
    image: input.image,
    featured: input.featured ?? false,
    order,
  }
  products.push(product)
  writeAllProducts(products)
  return product
}

export type ProductPatch = {
  categorySlug?: string
  name?: string
  grade?: string
  standard?: string
  description?: string
  image?: string
  featured?: boolean
}

export function updateProduct(id: string, patch: ProductPatch): Product | null {
  const products = readAllProducts()
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return null
  const current = products[idx]
  const categorySlug = patch.categorySlug ?? current.categorySlug
  let slug = current.slug
  let newId = current.id

  const nameChanged = patch.name !== undefined && patch.name.trim() !== current.name
  const categoryChanged = categorySlug !== current.categorySlug
  if (nameChanged || categoryChanged) {
    const baseSlug = slugify(patch.name ?? current.name)
    slug = uniqueSlug(baseSlug, categorySlug, products, current.id)
    newId = `${categorySlug}--${slug}`
  }

  const updated: Product = {
    ...current,
    id: newId,
    categorySlug,
    slug,
    name: patch.name !== undefined ? patch.name.trim() : current.name,
    grade: patch.grade !== undefined ? patch.grade.trim() || undefined : current.grade,
    standard: patch.standard !== undefined ? patch.standard.trim() || undefined : current.standard,
    description: patch.description !== undefined ? patch.description.trim() : current.description,
    image: patch.image !== undefined ? patch.image : current.image,
    featured: patch.featured !== undefined ? patch.featured : current.featured,
    order: categoryChanged ? products.filter((p) => p.categorySlug === categorySlug).length : current.order,
  }

  products[idx] = updated
  writeAllProducts(products)
  return updated
}

export function deleteProduct(id: string): boolean {
  const products = readAllProducts()
  const next = products.filter((p) => p.id !== id)
  if (next.length === products.length) return false
  writeAllProducts(next)
  return true
}

/** Sets `order` on every product in a category to match the position of its
 * id in `orderedIds`. Ids not present in the category are left untouched. */
export function reorderCategory(categorySlug: string, orderedIds: string[]) {
  const products = readAllProducts()
  const position = new Map(orderedIds.map((id, i) => [id, i]))
  for (const p of products) {
    if (p.categorySlug === categorySlug && position.has(p.id)) {
      p.order = position.get(p.id)!
    }
  }
  writeAllProducts(products)
}
