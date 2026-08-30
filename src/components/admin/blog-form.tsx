"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { GripVertical, ImageUp, ListPlus, Plus, Trash2 } from "lucide-react"
import { createPostAction, updatePostAction, uploadMediaAction } from "@/app/admin/actions"
import type { BlogContentBlock, BlogPost } from "@/lib/blog"

const inputClass =
  "mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
const textareaClass =
  "mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
const labelClass = "text-xs font-bold uppercase tracking-wider text-muted-foreground"

function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function emptyBlock(type: BlogContentBlock["type"]): BlogContentBlock {
  if (type === "ul") return { type: "ul", items: [""] }
  return { type, text: "" }
}

export function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const isEditing = !!post
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState(post?.title ?? "")
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "")
  const [category, setCategory] = useState(post?.category ?? "Buying Guides")
  const [publishedAt, setPublishedAt] = useState(post?.publishedAt ?? todayISO())
  const [readTime, setReadTime] = useState(post?.readTime ?? "5 min read")
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "")
  const [coverAlt, setCoverAlt] = useState(post?.coverAlt ?? "")
  const [body, setBody] = useState<BlogContentBlock[]>(post?.body ?? [{ type: "p", text: "" }])

  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  async function handleCoverFile(file: File | null) {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await uploadMediaAction(file)
      setCoverImage(result.url)
    } catch (err: any) {
      setError(err.message || "Failed to upload cover image.")
    } finally {
      setUploading(false)
    }
  }

  function updateBlock(index: number, next: BlogContentBlock) {
    setBody((prev) => prev.map((b, i) => (i === index ? next : b)))
  }

  function removeBlock(index: number) {
    setBody((prev) => prev.filter((_, i) => i !== index))
  }

  function moveBlock(index: number, dir: -1 | 1) {
    setBody((prev) => {
      const target = index + dir
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [moved] = next.splice(index, 1)
      next.splice(target, 0, moved)
      return next
    })
  }

  function addBlock(type: BlogContentBlock["type"]) {
    setBody((prev) => [...prev, emptyBlock(type)])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const cleanedBody = body
      .map((b) =>
        b.type === "ul" ? { ...b, items: b.items.map((i) => i.trim()).filter(Boolean) } : { ...b, text: b.text.trim() },
      )
      .filter((b) => (b.type === "ul" ? b.items.length > 0 : b.text.length > 0))

    const input = {
      title: title.trim(),
      excerpt: excerpt.trim(),
      category: category.trim(),
      publishedAt,
      readTime: readTime.trim(),
      coverImage: coverImage.trim(),
      coverAlt: coverAlt.trim(),
      body: cleanedBody,
    }

    startTransition(async () => {
      try {
        if (isEditing && post) {
          await updatePostAction(post.slug, input)
        } else {
          await createPostAction(input)
        }
        router.push("/admin/blog")
        router.refresh()
      } catch (err: any) {
        setError(err.message || "Failed to save post.")
      }
    })
  }

  const busy = isPending || uploading

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
      )}

      <div className="card-premium space-y-5">
        <h3 className="text-base font-bold uppercase text-foreground">Post Details</h3>

        <div>
          <label className={labelClass}>Title</label>
          <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Excerpt</label>
          <textarea rows={2} required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={textareaClass} />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelClass}>Category</label>
            <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Published Date</label>
            <input
              type="date"
              required
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Read Time</label>
            <input type="text" required value={readTime} onChange={(e) => setReadTime(e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      <div className="card-premium space-y-5">
        <h3 className="text-base font-bold uppercase text-foreground">Cover Image</h3>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <div className="relative size-32 shrink-0 overflow-hidden rounded-xl border border-border bg-white">
            {coverImage && <Image src={coverImage} alt={coverAlt || "Cover preview"} fill sizes="128px" className="object-contain p-2" />}
          </div>
          <div className="flex-1 space-y-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleCoverFile(e.target.files?.[0] ?? null)}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-accent bg-accent/5 px-4 text-xs font-bold text-accent hover:bg-accent hover:text-white"
            >
              <ImageUp className="size-4" /> {uploading ? "Uploading..." : "Upload Image"}
            </button>
            <div>
              <label className={labelClass}>Image URL (or paste an existing path)</label>
              <input type="text" required value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Image Alt Text</label>
              <input type="text" required value={coverAlt} onChange={(e) => setCoverAlt(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-premium space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold uppercase text-foreground">Article Content</h3>
        </div>

        <div className="flex flex-col gap-4">
          {body.map((block, i) => (
            <div key={i} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-accent">
                  <GripVertical className="size-3.5" />
                  {block.type === "p" ? "Paragraph" : block.type === "h2" ? "Heading" : "Bullet List"}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveBlock(i, -1)} disabled={i === 0} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                    ↑
                  </button>
                  <button type="button" onClick={() => moveBlock(i, 1)} disabled={i === body.length - 1} className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                    ↓
                  </button>
                  <button type="button" onClick={() => removeBlock(i)} className="rounded p-1 text-muted-foreground hover:text-red-600">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {block.type === "ul" ? (
                <div className="space-y-2">
                  {block.items.map((item, ii) => (
                    <div key={ii} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const items = [...block.items]
                          items[ii] = e.target.value
                          updateBlock(i, { ...block, items })
                        }}
                        className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => updateBlock(i, { ...block, items: block.items.filter((_, x) => x !== ii) })}
                        className="shrink-0 rounded p-1.5 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateBlock(i, { ...block, items: [...block.items, ""] })}
                    className="inline-flex h-8 items-center gap-1 rounded border border-accent bg-accent/5 px-2 text-[11px] font-bold text-accent hover:bg-accent hover:text-white"
                  >
                    <Plus className="size-3" /> Add Item
                  </button>
                </div>
              ) : (
                <textarea
                  rows={block.type === "h2" ? 1 : 4}
                  value={block.text}
                  onChange={(e) => updateBlock(i, { ...block, text: e.target.value })}
                  placeholder={block.type === "h2" ? "Section heading" : "Paragraph text"}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border pt-4">
          <button type="button" onClick={() => addBlock("p")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold text-foreground hover:border-accent hover:text-accent">
            <Plus className="size-3.5" /> Paragraph
          </button>
          <button type="button" onClick={() => addBlock("h2")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold text-foreground hover:border-accent hover:text-accent">
            <Plus className="size-3.5" /> Heading
          </button>
          <button type="button" onClick={() => addBlock("ul")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-input px-3 text-xs font-bold text-foreground hover:border-accent hover:text-accent">
            <ListPlus className="size-3.5" /> Bullet List
          </button>
        </div>
      </div>

      <button type="submit" disabled={busy} className="h-12 rounded-lg btn-primary text-sm font-bold uppercase tracking-wider">
        {isPending ? "Saving..." : isEditing ? "Save Changes" : "Publish Post"}
      </button>
    </form>
  )
}
