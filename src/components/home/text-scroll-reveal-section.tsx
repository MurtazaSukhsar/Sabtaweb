"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

// Plain clamped linear interpolation, written out by hand rather than handed
// to useTransform's array-range form. With a narrow, non-[0,1] input range
// (exactly what per-word/per-character stagger needs) that array form hands
// off to framer-motion's experimental native scroll-acceleration path, which
// here reads the range against the whole-page scroll timeline instead of
// this section's local one — so words swelled in and then faded back out
// instead of settling once revealed. A manual function transformer skips
// that path entirely and always behaves as a plain clamped 0→1 ramp.
function clampedRamp(value: number, start: number, end: number) {
  if (end <= start) return value >= end ? 1 : 0
  return Math.min(1, Math.max(0, (value - start) / (end - start)))
}

type WordProps = {
  word: string
  index: number
  total: number
  scrollYProgress: MotionValue<number>
  colorClass?: string
}

const WordV1 = ({ word, index, total, scrollYProgress, colorClass = "text-orange-500" }: WordProps) => {
  // Each word gets its own slice of the scroll range, with a little overlap
  // so the reveal reads as one gentle wave rather than a hard word-by-word
  // tick — light and basic on purpose, not a dramatic per-character flip.
  const start = (index / total) * 0.7
  const end = start + 1 / total + 0.18
  const opacity = useTransform(scrollYProgress, (v) => clampedRamp(v, start, end))
  const y = useTransform(scrollYProgress, (v) => 14 * (1 - clampedRamp(v, start, end)))

  return (
    <motion.span
      className={cn("mr-[0.28em] inline-block last:mr-0", colorClass)}
      style={{ opacity, y }}
    >
      {word}
    </motion.span>
  )
}

interface TextScrollRevealSectionProps {
  text: string
  bgClass?: string
  colorClass?: string
  heightClass?: string
  textClassName?: string
}

export function TextScrollRevealSection({
  text,
  bgClass = "bg-[#f5f4f3]",
  colorClass = "text-orange-500",
  heightClass = "h-[130vh]",
  textClassName = "text-3xl sm:text-5xl font-black",
}: TextScrollRevealSectionProps) {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const words = text.split(" ")

  return (
    <div ref={targetRef} className={cn("relative w-full", heightClass, bgClass)}>
      {/* Sticky container, pinned only for this section's own scroll-through
          distance — scroll-linked entirely to targetRef above, so it can't
          affect scroll or motion anywhere else on the page. */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden p-4">
        <div className={cn("w-full max-w-6xl text-balance text-center uppercase tracking-tighter", textClassName)}>
          {words.map((word, index) => (
            <WordV1
              key={word + index}
              word={word}
              index={index}
              total={words.length}
              scrollYProgress={scrollYProgress}
              colorClass={colorClass}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
