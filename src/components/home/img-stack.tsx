"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, PanInfo } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/products"

interface ImgStackProps {
  products: Product[]
  currentIndex: number
  onNext?: () => void
  onPrev?: () => void
  onSelectIndex?: (index: number) => void
}

export default function ImgStack({
  products,
  currentIndex,
  onNext,
  onPrev,
  onSelectIndex,
}: ImgStackProps) {
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50
    const velocityThreshold = 400

    if (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold) {
      if (currentIndex < products.length - 1 && onNext) {
        onNext()
      }
    } else if (info.offset.x > swipeThreshold || info.velocity.x > velocityThreshold) {
      if (currentIndex > 0 && onPrev) {
        onPrev()
      }
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[420px] px-4">
      {/* Card Container */}
      <div className="relative flex items-center justify-center w-[290px] h-[410px] min-[360px]:w-[320px] min-[360px]:h-[440px] sm:w-[360px] sm:h-[480px]">
        {products.map((product, index) => {
          const relativeIndex = index - currentIndex
          const isDismissed = relativeIndex < 0
          const isTopCard = relativeIndex === 0
          const isVisible = relativeIndex >= 0 && relativeIndex <= 3

          // Visual positioning for stack
          const offsetIncrement = -12
          const verticalOffset = -10
          const baseRotation = 2
          const rotationIncrement = 2.5

          const totalCards = Math.min(products.length, 4)
          const centerOffset = ((totalCards - 1) * Math.abs(offsetIncrement)) / 2

          const x = isDismissed ? -450 : isVisible ? relativeIndex * offsetIncrement + centerOffset : centerOffset
          const y = isDismissed ? -80 : isVisible ? relativeIndex * verticalOffset : verticalOffset * 3
          const rotate = isDismissed
            ? -30
            : relativeIndex === 0
            ? 0
            : -(baseRotation + relativeIndex * rotationIncrement)
          const opacity = isDismissed ? 0 : isVisible ? 1 - relativeIndex * 0.18 : 0
          const scale = isDismissed ? 0.9 : isVisible ? 1 - relativeIndex * 0.05 : 0.85
          const zIndex = isDismissed ? 0 : 50 - relativeIndex * 10

          return (
            <motion.div
              key={product.id || index}
              className={`absolute w-[260px] min-[360px]:w-[280px] sm:w-[320px] overflow-hidden rounded-2xl shadow-2xl bg-white border border-gray-200/80 flex flex-col ${
                isTopCard ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
              }`}
              style={{
                zIndex,
                aspectRatio: "3/4.4",
              }}
              animate={{ x, y, rotate, opacity, scale }}
              transition={{
                duration: isDismissed ? 0.4 : 0.45,
                ease: [0.25, 1, 0.5, 1],
              }}
              drag={isTopCard ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={isTopCard ? handleDragEnd : undefined}
            >
              {/* Product Image Area */}
              <div className="relative flex-1 w-full bg-radial from-gray-50 to-gray-100/50 p-4 flex items-center justify-center overflow-hidden">
                {product.image && (
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2 rounded-lg pointer-events-none drop-shadow-md"
                      sizes="(max-width: 640px) 280px, 320px"
                      draggable={false}
                      priority={index < 2}
                    />
                  </div>
                )}

                {/* Grade / Category Pill */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary backdrop-blur-md">
                    {product.grade || "Premium Grade"}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-400">
                    {index + 1}/{products.length}
                  </span>
                </div>
              </div>

              {/* Product Info Area */}
              <div className="p-4 bg-white border-t border-gray-100 flex flex-col gap-2">
                <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-1 leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {product.description || "High-strength industrial and marine hardware."}
                </p>
                <Link
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  className="mt-1 flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors group"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Interactive Controls & Swipe Guidance */}
      <div className="flex items-center justify-between w-full max-w-[320px] mt-4 px-2">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          aria-label="Previous product"
          className="p-2 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5" aria-hidden="true">
          {products.map((_, i) => (
            <button
              key={i}
              onClick={() => onSelectIndex && onSelectIndex(i)}
              aria-label={`Go to product ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "h-2 w-6 bg-primary"
                  : "h-1.5 w-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={currentIndex === products.length - 1}
          aria-label="Next product"
          className="p-2 rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[11px] text-gray-400 mt-2 tracking-wide text-center">
        Swipe cards left/right or use arrows
      </p>
    </div>
  )
}
