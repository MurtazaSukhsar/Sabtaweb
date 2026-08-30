"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

export type MosaicItem = { src: string; alt: string }

// Per-tile drift in px across the whole scroll pass, and how strongly each
// tile leans toward the cursor. Mixed signs and magnitudes are what create
// the sense of depth — matching values would just look like one flat plane.
const TILE_MOTION = [
  { drift: -46, lean: 10 },
  { drift: 30, lean: -14 },
  { drift: -22, lean: 14 },
  { drift: 52, lean: -9 },
]

function Tile({
  item,
  index,
  scrollYProgress,
  pointerX,
  pointerY,
  enabled,
}: {
  item: MosaicItem
  index: number
  scrollYProgress: MotionValue<number>
  pointerX: MotionValue<number>
  pointerY: MotionValue<number>
  enabled: boolean
}) {
  const { drift, lean } = TILE_MOTION[index % TILE_MOTION.length]

  // Scroll parallax: each tile travels its own distance as the hero passes.
  const scrollY = useTransform(scrollYProgress, [0, 1], [drift, -drift])
  // Cursor lean: a few px of offset toward the pointer.
  const leanX = useTransform(pointerX, (v) => v * lean)
  const leanY = useTransform(pointerY, (v) => v * lean * 0.6)

  const x = useTransform([leanX], ([lx]) => (enabled ? (lx as number) : 0))
  const y = useTransform([scrollY, leanY], ([sy, ly]) =>
    enabled ? (sy as number) + (ly as number) : 0,
  )

  return (
    <motion.div
      style={{ x, y }}
      className={`relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/15 bg-white shadow-2xl ${
        index % 2 === 1 ? "mt-5 sm:mt-8" : ""
      }`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="(max-width: 1024px) 45vw, 22vw"
        className="object-contain p-6 sm:p-8"
        priority={index < 2}
      />
    </motion.div>
  )
}

export function HeroMosaic({ items }: { items: MosaicItem[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Parallax is decoration: skip it entirely for reduced-motion visitors and
    // on touch-first screens, where there is no cursor to lean toward and the
    // extra motion just costs scroll performance.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    const fine = window.matchMedia("(min-width: 1024px) and (hover: hover)")
    const update = () => setEnabled(fine.matches && !reduced.matches)
    update()
    reduced.addEventListener("change", update)
    fine.addEventListener("change", update)
    return () => {
      reduced.removeEventListener("change", update)
      fine.removeEventListener("change", update)
    }
  }, [])

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })

  // Raw pointer position, normalised to -1..1 from the centre of the mosaic.
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  // Springs keep the lean from snapping directly to the cursor.
  const pointerX = useSpring(rawX, { stiffness: 110, damping: 20, mass: 0.4 })
  const pointerY = useSpring(rawY, { stiffness: 110, damping: 20, mass: 0.4 })

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!enabled) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2)
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2)
  }

  function handlePointerLeave() {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto grid w-full max-w-md grid-cols-2 items-start gap-3 sm:gap-4 lg:max-w-none"
    >
      {items.map((item, i) => (
        <Tile
          key={item.src}
          item={item}
          index={i}
          scrollYProgress={scrollYProgress}
          pointerX={pointerX}
          pointerY={pointerY}
          enabled={enabled}
        />
      ))}
    </div>
  )
}
