import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { BlogPostCard } from "@/components/blog-post-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CtaBanner } from "@/components/home/cta-banner"
import { getSiteConfig } from "@/lib/db"
import { readAllPosts } from "@/lib/blog"

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  return {
    title: "Blog",
    description: `Buying guides and technical explainers on fastener grades, materials and marine rigging hardware from ${siteConfig.name}.`,
    alternates: { canonical: "/blog" },
  }
}

export default async function BlogIndexPage() {
  const posts = await readAllPosts()

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
          <p className="eyebrow !text-accent">Resources</p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            The Sabta Trading Blog
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-sm leading-relaxed text-primary-foreground/80 md:text-base">
            Buying guides and technical explainers on fastener grades, materials and marine rigging hardware — written by
            the same team that stocks and ships it.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: "Blog" }]} />

        {posts.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">No articles published yet — check back soon.</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <ScrollReveal key={post.slug} delay={(i % 3) * 80}>
                <BlogPostCard post={post} priority={i < 3} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

      <CtaBanner />
    </>
  )
}
