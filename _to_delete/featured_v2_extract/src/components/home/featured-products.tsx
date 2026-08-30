"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useSpring } from "framer-motion"
import type { Product } from "@/lib/products"
import { ScrollReveal } from "@/components/scroll-reveal"

// A scroll-driven showcase for hand-picked products: cards scatter in, line
// up, form a circle, then morph into a shuffling arc — all tied directly to
// how far the visitor has scrolled through this section. The section pins in
// place (position: sticky) for a stretch of scroll distance while the
// animation plays, then releases and the page continues normally. This uses
// real document scroll the whole way — nothing calls preventDefault or traps
// the wheel/touch, so trackpad, mouse wheel, keyboard and touch scrolling
// all just work, and scrolling back up reverses the sequence.

type CardTarget = { x: number; y: number; rotation: number; scale: number; opacity: number }

const CARD_SIZE = 108
const LINE_SPACING = CARD_SIZE + 26 // px gap between cards when lined up mid-animation

// Progress thresholds (0..1 across the pinned scroll range).
const SCATTER_END = 0.1
const LINE_END = 0.24
const ARC_FORMED = 0.6 // circle -> arc morph completes here; the rest of the range shuffles the arc

// Deterministic "random" (seeded by index) so the scatter layout renders
// identically on the server and the client — a real Math.random() here
// would cause a hydration mismatch on first paint.
function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

function FeaturedFlipCard({ product, target }: { product: Product; target: CardTarget }) {
  const href = `/products/${product.categorySlug}/${product.slug}`
  return (
    <motion.div
      animate={{ x: target.x, y: target.y, rotate: target.rotation, scale: target.scale, opacity: target.opacity }}
      transition={{ type: "spring", stiffness: 120, damping: 20, mass: 0.6 }}
      style={{ position: "absolute", width: CARD_SIZE, height: CARD_SIZE, transformStyle: "preserve-3d" }}
      className="group cursor-pointer"
    >
      <Link
        href={href}
        aria-label={`View ${product.name}`}
        className="block h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
          transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 22 }}
          whileHover={{ rotateY: 180 }}
        >
          {/* Front face — product photo */}
          <div
            className="absolute inset-0 h-full w-full overflow-hidden rounded-xl border border-border bg-white shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            {product.image && (
              <Image src={product.image} alt={product.name} fill sizes="200px" className="object-contain p-2.5" />
            )}
          </div>
          {/* Back face — name + link through */}
          <div
            className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-primary bg-primary p-3 text-center shadow-lg"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <p className="line-clamp-2 text-[11px] font-bold leading-tight text-primary-foreground">{product.name}</p>
            {(product.grade || product.standard) && (
              <p className="mt-1 line-clamp-1 text-[9px] font-semibold text-primary-foreground/70">
                {product.grade}
                {product.grade && product.standard && " · "}
                {product.standard}
              </p>
            )}
            <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-accent">View details</p>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  const items = useMemo(() => products.slice(0, 10), [products])
  const total = items.length

  // The tall wrapper is what creates scroll distance for the pin; the inner
  // sticky element stays put in the viewport for that whole distance.
  const wrapperRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })

  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] })
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 260, damping: 40, mass: 0.4 })
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const unsub = smoothProgress.on("change", setProgress)
    return unsub
  }, [smoothProgress])

  // Track stage size for the circle/arc math below.
  useEffect(() => {
    const el = stageRef.current
    if (!el || total === 0) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({ width: entry.contentRect.width, height: entry.contentRect.height })
      }
    })
    observer.observe(el)
    setContainerSize({ width: el.offsetWidth, height: el.offsetHeight })
    return () => observer.disconnect()
  }, [total])

  const scatterPositions = useMemo(
    () =>
      items.map((_, i) => ({
        x: (seededRandom(i * 7 + 1) - 0.5) * 900,
        y: (seededRandom(i * 13 + 3) - 0.5) * 440,
        rotation: (seededRandom(i * 5 + 9) - 0.5) * 180,
        scale: 0.6,
      })),
    [items],
  )

  if (total === 0) return null

  return (
    <section ref={wrapperRef} className="relative h-[220vh] sm:h-[240vh]">
      <div className="sticky top-0 flex h-screen min-h-[640px] w-full flex-col justify-center overflow-hidden py-10">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
          <ScrollReveal>
            <div className="mb-8 flex flex-col items-start gap-3 md:mb-10">
              <p className="eyebrow">Featured Picks</p>
              <h2 className="section-heading">Featured Products</h2>
            </div>
          </ScrollReveal>

          <div
            ref={stageRef}
            className="relative flex h-[58vh] min-h-[420px] w-full items-center justify-center overflow-hidden"
          >
            {items.map((product, i) => {
              let target: CardTarget

              if (progress < SCATTER_END) {
                const fade = clamp01(progress / SCATTER_END)
                target = { ...scatterPositions[i], opacity: fade }
              } else if (progress < LINE_END) {
                const lineTotalWidth = total * LINE_SPACING
                target = { x: i * LINE_SPACING - lineTotalWidth / 2, y: 0, rotation: 0, scale: 1, opacity: 1 }
              } else {
                const isMobile = containerSize.width < 640
                const minDimension = Math.min(containerSize.width, containerSize.height) || 1

                // Circle formation.
                const circleRadius = Math.min(minDimension * 0.32, 250)
                const circleAngle = (i / total) * 360
                const circleRad = (circleAngle * Math.PI) / 180
                const circlePos = {
                  x: Math.cos(circleRad) * circleRadius,
                  y: Math.sin(circleRad) * circleRadius,
                  rotation: circleAngle + 90,
                }

                // Bottom "shelf" arc — a gentle upward bow across the row.
                // Sized directly off the container so the row always fits
                // inside this section's box.
                const morphT = clamp01((progress - LINE_END) / (ARC_FORMED - LINE_END))
                const shuffleT = clamp01((progress - ARC_FORMED) / (1 - ARC_FORMED))

                const spreadT = total > 1 ? i / (total - 1) : 0.5 // 0..1 static slot across the row
                const swayAmplitude = 0.055
                const sway = Math.sin(shuffleT * Math.PI * 3) * swayAmplitude
                const t = clamp01(spreadT + sway)
                const xNorm = t - 0.5 // -0.5..0.5, 0 = center

                const arcWidth = Math.min(containerSize.width * 0.86, isMobile ? 340 : 980)
                const baseYOffset = containerSize.height * (isMobile ? 0.08 : 0.06)
                const bowDepth = containerSize.height * (isMobile ? 0.22 : 0.26)

                const arcPos = {
                  x: xNorm * arcWidth,
                  y: baseYOffset + bowDepth * (xNorm * 2) ** 2,
                  rotation: xNorm * 34 + shuffleT * 6 * Math.sin(shuffleT * Math.PI * 3),
                  scale: isMobile ? 1.15 : 1.45,
                }

                target = {
                  x: lerp(circlePos.x, arcPos.x, morphT),
                  y: lerp(circlePos.y, arcPos.y, morphT),
                  rotation: lerp(circlePos.rotation, arcPos.rotation, morphT),
                  scale: lerp(1, arcPos.scale, morphT),
                  opacity: 1,
                }
              }

              return <FeaturedFlipCard key={product.id} product={product} target={target} />
            })}
          </div>

          <p className="mt-6 text-center text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
            {progress < 0.96 ? "Keep scrolling" : "Scroll on"}
          </p>
        </div>
      </div>
    </section>
  )
}
