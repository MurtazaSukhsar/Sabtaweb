import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/blog"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export function BlogPostCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_50px_-18px_rgba(27,42,128,0.25)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-white">
        <Image
          src={post.coverImage}
          alt={post.coverAlt}
          fill
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 92vw"
          className="object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.05]"
          priority={priority}
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-accent">
          <span>{post.category}</span>
          <span className="text-border" aria-hidden="true">
            &middot;
          </span>
          <span className="text-muted-foreground">{post.readTime}</span>
        </div>

        <h3 className="text-lg font-extrabold leading-snug text-foreground transition-colors duration-200 group-hover:text-primary">
          {post.title}
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <time dateTime={post.publishedAt} className="text-xs font-semibold text-muted-foreground">
            {formatDate(post.publishedAt)}
          </time>
          <span className="flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary transition-colors group-hover:text-accent">
            Read
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  )
}
