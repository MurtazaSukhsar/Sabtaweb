import type { Metadata } from "next"
import Link from "next/link"
import { readAllPosts } from "@/lib/blog"
import { BlogList } from "@/components/admin/blog-list"

export const metadata: Metadata = {
  title: "Blog",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminBlogPage() {
  const posts = await readAllPosts()

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Blog ({posts.length})</h1>
          <p className="mt-1 text-sm text-muted-foreground">Buying guides and technical explainers.</p>
        </div>
        <Link href="/admin/blog/new" className="inline-flex h-11 items-center rounded-lg btn-primary px-5 text-sm font-bold">
          Write a Post
        </Link>
      </div>

      <div className="mt-8">
        <BlogList initialPosts={posts} />
      </div>
    </div>
  )
}
