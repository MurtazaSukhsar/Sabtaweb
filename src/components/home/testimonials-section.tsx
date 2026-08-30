"use client"

import { cn } from "@/lib/utils"
import { TestimonialCard, type TestimonialAuthor } from "@/components/ui/testimonial-card"
import { ScrollReveal } from "@/components/scroll-reveal"

interface TestimonialsSectionProps {
  title: string
  description: string
  testimonials: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({
  title,
  description,
  testimonials,
  className,
}: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) return null

  return (
    <section
      className={cn(
        "bg-secondary/35 text-foreground border-y border-border",
        "py-16 sm:py-20 md:py-24",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-12 text-center sm:gap-16 px-4">
        <ScrollReveal>
          <div className="flex flex-col items-center gap-3">

            <h2 className="section-heading max-w-[720px]">
              {title}
            </h2>
            <p className="section-subheading max-w-[600px]">
              {description}
            </p>
          </div>
        </ScrollReveal>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-2">
          {/* Scrollable track using native project CSS */}
          <div className="w-full overflow-hidden">
            <div className="marquee-track flex gap-4">
              {/* Set 1 */}
              <div className="flex gap-4 shrink-0">
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard
                    key={`set1-${i}`}
                    {...testimonial}
                  />
                ))}
              </div>
              {/* Set 2 */}
              <div className="flex gap-4 shrink-0">
                {testimonials.map((testimonial, i) => (
                  <TestimonialCard
                    key={`set2-${i}`}
                    {...testimonial}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Lateral gradient fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/6 bg-gradient-to-r from-background to-transparent sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/6 bg-gradient-to-l from-background to-transparent sm:block" />
        </div>
      </div>
    </section>
  )
}
