import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FaqAccordion } from "@/components/faq-accordion"
import { ScrollReveal } from "@/components/scroll-reveal"

interface HomeFaqProps {
  faqs: { question: string; answer: string }[]
}

export function HomeFaq({ faqs }: HomeFaqProps) {
  if (faqs.length === 0) return null

  // Show first 5 FAQs on the home page
  const preview = faqs.slice(0, 5)

  return (
    <section aria-labelledby="home-faq-heading" className="relative w-full bg-background">
      {/* Subtle dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,#1b2a80_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
        {/* Heading */}
        <ScrollReveal>
          <div className="mb-10 text-center">
            <p className="eyebrow">Got Questions?</p>
            <h2
              id="home-faq-heading"
              className="mt-3 text-3xl font-extrabold uppercase tracking-wider text-black sm:text-4xl"
            >
              Frequently Asked
            </h2>
          </div>
        </ScrollReveal>

        {/* Accordion */}
        <ScrollReveal delay={100}>
          <FaqAccordion faqs={preview} />

          {/* Link to full FAQ */}
          <div className="mt-10 flex justify-center">
            <Link
              href="/faq"
              className="group inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground hover:border-primary"
            >
              View All FAQs
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
