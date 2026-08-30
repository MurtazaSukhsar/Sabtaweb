"use client"

import { useState } from "react"
import type { CategoryWithItems } from "@/lib/products"
import { CategoryCard } from "@/components/category-card"
import { ScrollReveal } from "@/components/scroll-reveal"

export function CategoryGrid({ categories }: { categories: CategoryWithItems[] }) {
  const [hovered, setHovered] = useState<number | null>(null)

  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal>
        <div className="mb-14 flex flex-col items-start gap-3">
          <p className="eyebrow">Product Ranges</p>
          <h2 className="section-heading">Nine ranges, one supplier</h2>
          <p className="section-subheading">
            From hose clips to workshop consumables, every range below is stocked and shipping from Dubai.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {categories.map((cat, i) => {
          const dimmed = hovered !== null && hovered !== i
          return (
            <ScrollReveal key={cat.slug} delay={i * 50} className={`h-full transition-all duration-300 ${dimmed ? "opacity-60" : ""}`}>
              <CategoryCard category={cat} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} />
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
