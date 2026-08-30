import type { Metadata } from "next"
import { BlogForm } from "@/components/admin/blog-form"

export const metadata: Metadata = {
  title: "Write a Post",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default function NewBlogPostPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Write a Post</h1>
      <p className="mt-1 text-sm text-muted-foreground">This will appear on the blog immediately.</p>
      <div className="mt-8">
        <BlogForm />
      </div>
    </div>
  )
}
