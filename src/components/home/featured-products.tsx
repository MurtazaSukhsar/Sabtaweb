"use client"

import { useRef, useState } from "react"
import { useScroll, useMotionValueEvent } from "framer-motion"
import type { Product } from "@/lib/products"
import ImgStack from "@/components/home/img-stack"

// Extra scroll distance (in vh) per card before it gets dismissed.
// Was 55 — with 8 featured cards that's 100dvh + 440vh, over 5 full
// screens of scrolling for one section, which read as "scrolling stops"
// since so little visually changes per screen of scroll input.
const VH_PER_CARD = 20

export function FeaturedProducts({ products }: { products: Product[] }) {
  const items = products.filter((p) => p.image).slice(0, 8)
  if (items.length === 0) return null
  const images = items.map((p) => p.image as string)
  const cardCount = images.length

  const sectionRef = useRef<HTMLElement>(null)

  // scrollYProgress goes 0→1 over the entire pinned section height.
  // We divide that range into cardCount steps.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const [dismissedCount, setDismissedCount] = useState(0)

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    // Each card occupies an equal slice of the scroll range.
    // The last step completes at v=1 so the section unpins naturally.
    const next = Math.min(cardCount, Math.max(0, Math.round(v * cardCount)))
    setDismissedCount(next)
  })

  return (
    <section
      ref={sectionRef}
      aria-label="Featured products"
      className="relative w-full overflow-hidden bg-background"
      // Extra height creates the scroll space while the inner div stays pinned
      style={{ height: `calc(100dvh + ${cardCount * VH_PER_CARD}vh)` }}
    >
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] bg-[radial-gradient(circle,#1b2a80_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      {/* Sticky viewport — stays on screen while user scrolls through cards */}
      <div className="sticky top-0 flex h-dvh flex-col items-center pt-24 sm:pt-28">
        {/* Centred black heading — z-20 keeps it above card stack */}
        <div className="relative z-20 mb-6 flex flex-col items-center gap-2 text-center px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider text-black">
            Featured Products
          </h2>
        </div>

        {/* Card deck — scroll dismisses cards one by one */}
        <div className="relative z-10 flex-1 flex items-start justify-center w-full">
          <ImgStack images={images} dismissedCount={dismissedCount} />
        </div>

        {/* Progress dots */}
        <div className="pb-8 flex items-center gap-2" aria-hidden="true">
          {images.map((_, i) => (
            <span
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i < dismissedCount
                  ? "h-1.5 w-1.5 bg-border"
                  : i === dismissedCount
                  ? "h-2 w-5 bg-accent"
                  : "h-1.5 w-1.5 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
