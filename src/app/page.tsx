import type { Metadata } from "next"
import { Hero } from "@/components/home/hero"
import { TrustBadges } from "@/components/home/trust-badges"
import { CategoryGrid } from "@/components/home/category-grid"
import { FeaturedProducts } from "@/components/home/featured-products"
import { StatsCounter } from "@/components/home/stats-counter"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Industries } from "@/components/home/industries"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { CtaBanner } from "@/components/home/cta-banner"
import { HomeFaq } from "@/components/home/home-faq"
import { getAllCategoriesWithItems, getFeaturedProducts, getSiteConfig, getTestimonials, getFaqs } from "@/lib/db"

export const dynamic = "force-dynamic"

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  const title = `${siteConfig.name} | ${siteConfig.tagline}`
  return {
    title,
    description: siteConfig.description,
    alternates: { canonical: "/" },
    openGraph: {
      title,
      description: siteConfig.description,
      url: "/",
      type: "website",
    },
  }
}

export default async function HomePage() {
  const [categories, featuredProducts, testimonials, faqs] = await Promise.all([
    getAllCategoriesWithItems(),
    getFeaturedProducts(),
    getTestimonials(),
    getFaqs(),
  ])

  return (
    <>
      <Hero />
      <TrustBadges />
      <FeaturedProducts products={featuredProducts} />
      <CategoryGrid categories={categories} />
      <StatsCounter />
      <WhyChooseUs />
      <Industries />

      <TestimonialsSection
        title="What Our Clients Say"
        description="Hear from procurement managers and contractors who trust Sabta Trading."
        testimonials={testimonials}
      />
      <HomeFaq faqs={faqs} />
      <CtaBanner />
    </>
  )
}

