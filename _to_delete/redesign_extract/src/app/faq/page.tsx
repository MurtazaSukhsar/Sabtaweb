import type { Metadata } from "next"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { FaqAccordion } from "@/components/faq-accordion"
import { CtaBanner } from "@/components/home/cta-banner"
import { faqs, siteConfig } from "@/lib/site-data"

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${siteConfig.name}: stock, grades, sourcing and how to request a quote.`,
}

export default function FaqPage() {
  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
          <p className="eyebrow !text-accent">Support</p>
          <h1 className="mt-4 text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: "FAQ" }]} />
        <div className="mt-10">
          <FaqAccordion faqs={[...faqs]} />
        </div>
      </div>

      <CtaBanner />
    </>
  )
}
