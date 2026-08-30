// Blog store: Supabase-backed (site_settings key "blog_posts"), same generic
// key/value mechanism used for every other editable settings block in
// lib/db.ts. When Supabase isn't configured, reads fall back to the seed
// content in data/posts.json (mirrors the fallback pattern used across the
// rest of the app) and writes are a no-op — same as categories/settings.
//
// This module must only be imported from server components, route
// handlers, or Server Actions — never from a component marked "use client".

import fs from "fs"
import path from "path"
import { getSetting, saveSetting } from "./db"

export type BlogContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  publishedAt: string
  readTime: string
  coverImage: string
  coverAlt: string
  body: BlogContentBlock[]
}

const DATA_FILE = path.join(process.cwd(), "data", "posts.json")

function readSeedPosts(): BlogPost[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as BlogPost[]) : []
  } catch {
    return []
  }
}

function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return posts.slice().sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

async function loadPosts(): Promise<BlogPost[]> {
  return getSetting<BlogPost[]>("blog_posts", readSeedPosts())
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "")
}

// -------------------------------------------------------------
// Reads
// -------------------------------------------------------------

export async function readAllPosts(): Promise<BlogPost[]> {
  return sortByDateDesc(await loadPosts())
}

export async function getPost(slug: string): Promise<BlogPost | undefined> {
  const all = await loadPosts()
  return all.find((p) => p.slug === slug)
}

/** Up to `limit` other posts, preferring the same editorial category, newest first. */
export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPost[]> {
  const all = sortByDateDesc(await loadPosts())
  const current = all.find((p) => p.slug === slug)
  const others = all.filter((p) => p.slug !== slug)
  if (!current) return others.slice(0, limit)

  const sameCategory = others.filter((p) => p.category === current.category)
  const rest = others.filter((p) => p.category !== current.category)
  return [...sameCategory, ...rest].slice(0, limit)
}

// -------------------------------------------------------------
// Admin write operations
// -------------------------------------------------------------

export async function createPost(input: Omit<BlogPost, "slug"> & { slug?: string }): Promise<BlogPost> {
  const all = await loadPosts()
  const base = slugify(input.slug?.trim() ? input.slug : input.title)
  if (!base) throw new Error("Could not derive a URL slug from the title.")

  let candidate = base
  let n = 2
  while (all.some((p) => p.slug === candidate)) {
    candidate = `${base}-${n}`
    n++
  }

  const { slug: _ignored, ...rest } = input
  const post: BlogPost = { ...rest, slug: candidate }
  const ok = await saveSetting("blog_posts", [post, ...all])
  if (!ok) throw new Error("Failed to save the new post. Is Supabase configured?")
  return post
}

export async function updatePost(slug: string, patch: Partial<Omit<BlogPost, "slug">>): Promise<BlogPost | null> {
  const all = await loadPosts()
  const idx = all.findIndex((p) => p.slug === slug)
  if (idx === -1) return null

  const updated: BlogPost = { ...all[idx], ...patch }
  const list = [...all]
  list[idx] = updated

  const ok = await saveSetting("blog_posts", list)
  if (!ok) throw new Error("Failed to save changes. Is Supabase configured?")
  return updated
}

export async function deletePost(slug: string): Promise<boolean> {
  const all = await loadPosts()
  const list = all.filter((p) => p.slug !== slug)
  return saveSetting("blog_posts", list)
}
