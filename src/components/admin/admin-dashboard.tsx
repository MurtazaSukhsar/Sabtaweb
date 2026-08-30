"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { GripVertical, Pencil, Star, Trash2 } from "lucide-react"
import type { CategoryWithItems, Product } from "@/lib/products"
import { deleteProductAction, reorderCategoryAction } from "@/app/admin/actions"

export function AdminDashboard({ categories }: { categories: CategoryWithItems[] }) {
  const [openSlug, setOpenSlug] = useState<string | null>(categories[0]?.slug ?? null)
  const [itemsByCategory, setItemsByCategory] = useState<Record<string, Product[]>>(() =>
    Object.fromEntries(categories.map((c) => [c.slug, c.items])),
  )
  const [isPending, startTransition] = useTransition()
  const [dragId, setDragId] = useState<string | null>(null)

  // The dragged item's id travels on the native DataTransfer payload rather
  // than through React state: dragstart and drop can fire back-to-back
  // within the same browser task, with no guarantee a state update from
  // dragstart has been flushed and re-rendered before drop reads it. The
  // `dragId` state below is kept only for the drag-in-progress opacity
  // styling — it is never relied on for the actual reorder logic.
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
    setItemsByCategory((prev) => ({ ...prev, [categorySlug]: prev[categorySlug].filter((p) => p.id !== id) }))
    await deleteProductAction(id)
  }

  return (
    <div className="flex flex-col gap-4">
      {categories.map((cat) => {
        const items = itemsByCategory[cat.slug] ?? []
        const isOpen = openSlug === cat.slug
        return (
          <div key={cat.slug} className="card-premium overflow-hidden p-0">
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : cat.slug)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">{cat.name}</span>
              <span className="text-xs font-semibold text-muted-foreground">{items.length} products</span>
            </button>
            {isOpen && (
              <div className="border-t border-border">
                {items.length === 0 && (
                  <p className="px-5 py-6 text-sm text-muted-foreground">No products in this range yet.</p>
                )}
                <ul>
                  {items.map((item) => (
                    <li
                      key={item.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("text/plain", item.id)
                        e.dataTransfer.effectAllowed = "move"
                        setDragId(item.id)
                      }}
                      onDragOver={(e) => {
                        e.preventDefault()
                        e.dataTransfer.dropEffect = "move"
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const sourceId = e.dataTransfer.getData("text/plain")
                        handleDrop(cat.slug, sourceId, item.id)
                      }}
                      onDragEnd={() => setDragId(null)}
                      className={`flex items-center gap-3 border-b border-border px-5 py-3 last:border-b-0 ${dragId === item.id ? "opacity-50" : ""}`}
                    >
                      <GripVertical className="size-4 shrink-0 cursor-grab text-muted-foreground" aria-hidden="true" />
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                        {item.image && (
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-contain p-1" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 truncate text-sm font-bold text-foreground">
                          {item.featured && (
                            <Star className="size-3.5 shrink-0 fill-accent text-accent" aria-label="Featured on homepage" />
                          )}
                          <span className="truncate">{item.name}</span>
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.grade}
                          {item.grade && item.standard && " · "}
                          {item.standard}
                        </p>
                      </div>
                      <Link
                        href={`/admin/products/${item.id}/edit`}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-accent"
                      >
                        <Pencil className="size-4" aria-hidden="true" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id, cat.slug, item.name)}
                        className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:border-red-300 hover:text-red-600"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      })}
      {isPending && <p className="text-xs text-muted-foreground">Saving order…</p>}
    </div>
  )
}
