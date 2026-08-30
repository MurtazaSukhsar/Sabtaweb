"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import Image from "next/image"
import { Pencil, Trash2 } from "lucide-react"
import { deletePostAction } from "@/app/admin/actions"
import type { BlogPost } from "@/lib/blog"

function formatDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
}

export function BlogList({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isPending, startTransition] = useTransition()

  function handleDelete(slug: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setPosts((prev) => prev.filter((p) => p.slug !== slug))
    startTransition(async () => {
      await deletePostAction(slug)
    })
  }

  if (posts.length === 0) {
    return (
      <div className="card-premium p-10 text-center text-sm text-muted-foreground">
        No blog posts yet. Click &ldquo;Write a Post&rdquo; to publish the first one.
      </div>
    )
  }

  return (
    <div className="card-premium p-0 overflow-hidden">
      <ul className="divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug} className="flex items-center gap-4 px-5 py-4">
            <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-white">
              {post.coverImage && (
                <Image src={post.coverImage} alt={post.coverAlt} fill sizes="48px" className="object-contain p-1" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{post.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {post.category} &middot; {formatDate(post.publishedAt)} &middot; {post.readTime}
              </p>
            </div>
            <Link
              href={`/admin/blog/${post.slug}/edit`}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-accent"
            >
              <Pencil className="size-4" aria-hidden="true" />
            </Link>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDelete(post.slug, post.title)}
              className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:border-red-300 hover:text-red-600"
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
