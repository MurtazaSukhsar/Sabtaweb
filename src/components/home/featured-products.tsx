"use client"

import { useRef, useState, useEffect } from "react"
import { useScroll, useMotionValueEvent } from "framer-motion"
import type { Product } from "@/lib/products"
import ImgStack from "@/components/home/img-stack"

export function FeaturedProducts({ products }: { products: Product[] }) {
  const items = products.filter((p) => p.image).slice(0, 8)
  if (items.length === 0) return null
  const cardCount = items.length

  const sectionRef = useRef<HTMLElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Desktop scroll-driven animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!isMobile) {
      const next = Math.min(cardCount - 1, Math.max(0, Math.floor(v * cardCount)))
      setCurrentIndex(next)
    }
  })

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(cardCount - 1, prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  const handleSelectIndex = (idx: number) => {
    setCurrentIndex(idx)
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Featured products"
      className="relative w-full bg-background"
      style={{
        // On desktop, give enough scroll space for sticky animation. On mobile, keep natural height with touch-swiping.
        height: isMobile ? "auto" : `calc(100dvh + ${(cardCount - 1) * 35}vh)`,
        paddingTop: isMobile ? "3rem" : undefined,
        paddingBottom: isMobile ? "4rem" : undefined,
      }}
    >
      {/* Subtle Dot Grid Background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,#1b2a80_1px,transparent_1px)] [background-size:28px_28px]"
        aria-hidden="true"
      />

      {/* Container */}
      <div
        className={`${
          isMobile
            ? "relative flex flex-col items-center justify-center min-h-[600px] w-full"
            : "sticky top-0 flex h-dvh flex-col items-center justify-between pt-24 pb-8"
        }`}
      >
        {/* Centered Heading */}
        <div className="relative z-20 mb-4 flex flex-col items-center gap-2 text-center px-4">
          <span className="text-xs font-bold tracking-widest text-primary uppercase bg-primary/10 px-3 py-1 rounded-full">
            Curated Highlights
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider text-black">
            Featured Products
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mt-1">
            Explore our precision-engineered fasteners and heavy-duty rigging components.
          </p>
        </div>

        {/* Card Deck with Gesture & Button Controls */}
        <div className="relative z-10 flex-1 flex items-center justify-center w-full my-auto">
          <ImgStack
            products={items}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrev={handlePrev}
            onSelectIndex={handleSelectIndex}
          />
        </div>
      </div>
    </section>
  )
}
