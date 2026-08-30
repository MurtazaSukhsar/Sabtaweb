import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPost } from "@/lib/blog"
import { BlogForm } from "@/components/admin/blog-form"

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function EditBlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Edit Post</h1>
      <p className="mt-1 text-sm text-muted-foreground">{post.title}</p>
      <div className="mt-8">
        <BlogForm post={post} />
      </div>
    </div>
  )
}
