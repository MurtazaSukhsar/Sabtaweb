import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { BlogPostCard } from "@/components/blog-post-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CtaBanner } from "@/components/home/cta-banner"
import { getSiteConfig } from "@/lib/db"
import { getPost, getRelatedPosts, readAllPosts, type BlogContentBlock } from "@/lib/blog"

export async function generateStaticParams() {
  return (await readAllPosts()).map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      images: [post.coverImage],
    },
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function ContentBlock({ block }: { block: BlogContentBlock }) {
  if (block.type === "h2") {
    return <h2 className="mt-10 text-xl font-extrabold uppercase tracking-tight text-foreground first:mt-0 md:text-2xl">{block.text}</h2>
  }
  if (block.type === "ul") {
    return (
      <ul className="mt-4 flex flex-col gap-2.5">
        {block.items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground md:text-base">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return <p className="mt-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">{block.text}</p>
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const [siteConfig, related] = await Promise.all([getSiteConfig(), getRelatedPosts(slug, 3)])

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [`${siteConfig.url}${post.coverImage}`],
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: { "@type": "ImageObject", url: `${siteConfig.url}/brand/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${siteConfig.url}/blog/${post.slug}` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14 lg:px-12">
        <Breadcrumbs crumbs={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

        <ScrollReveal>
          <div className="mt-6 flex flex-wrap items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
            <span>{post.category}</span>
            <span className="text-border" aria-hidden="true">
              &middot;
            </span>
            <time dateTime={post.publishedAt} className="text-muted-foreground">
              {formatDate(post.publishedAt)}
            </time>
            <span className="text-border" aria-hidden="true">
              &middot;
            </span>
            <span className="text-muted-foreground">{post.readTime}</span>
          </div>

          <h1 className="mt-4 text-balance text-2xl font-extrabold uppercase tracking-tight text-foreground sm:text-3xl md:text-4xl">
            {post.title}
          </h1>

          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">{post.excerpt}</p>

          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border bg-white">
            <Image src={post.coverImage} alt={post.coverAlt} fill sizes="(min-width: 768px) 720px, 100vw" className="object-contain p-10" priority />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={80}>
          <article className="mt-2">
            {post.body.map((block, i) => (
              <ContentBlock key={i} block={block} />
            ))}
          </article>
        </ScrollReveal>

        {related.length > 0 && (
          <div className="mt-16 border-t border-border pt-12 md:mt-20">
            <h2 className="text-xl font-extrabold uppercase tracking-tight text-foreground">More From the Blog</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <BlogPostCard key={item.slug} post={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CtaBanner />
    </>
  )
}
