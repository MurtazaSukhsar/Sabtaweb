"use client"

import { memo, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { motion, useAnimation, useMotionValue, useTransform, type MotionValue } from "framer-motion"

type AnimationControls = ReturnType<typeof useAnimation>

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect

type UseMediaQueryOptions = {
  defaultValue?: boolean
  initializeWithValue?: boolean
}

const IS_SERVER = typeof window === "undefined"

export function useMediaQuery(
  query: string,
  { defaultValue = false, initializeWithValue = true }: UseMediaQueryOptions = {},
): boolean {
  const getMatches = (query: string): boolean => {
    if (IS_SERVER) {
      return defaultValue
    }
    return window.matchMedia(query).matches
  }
  const [matches, setMatches] = useState<boolean>(() => {
    if (initializeWithValue) {
      return getMatches(query)
    }
    return defaultValue
  })
  const handleChange = () => {
    setMatches(getMatches(query))
  }
  useIsomorphicLayoutEffect(() => {
    const matchMedia = window.matchMedia(query)
    handleChange()
    matchMedia.addEventListener("change", handleChange)
    return () => {
      matchMedia.removeEventListener("change", handleChange)
    }
  }, [query])
  return matches
}

export type CarouselImage = {
  src: string
  alt: string
}

// A slow ambient spin — one full revolution every 34s — so the corridor
// reads as alive at a glance without demanding attention. Drag always
// takes priority: dragging stops it, and it resumes once the momentum
// settle finishes. No click-to-preview here — cards are display only.
const AUTO_ROTATE_SECONDS = 34
const duration = 0.15
const transition = { duration, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(
  ({
    controls,
    rotation,
    cards,
    onDragStart,
    onDragSettled,
  }: {
    controls: AnimationControls
    rotation: MotionValue<number>
    cards: CarouselImage[]
    onDragStart: () => void
    onDragSettled: () => void
  }) => {
    const isScreenSizeSm = useMediaQuery("(max-width: 640px)")
    const cylinderWidth = isScreenSizeSm ? 820 : 1800
    const faceCount = cards.length
    const faceWidth = cylinderWidth / faceCount
    const radius = cylinderWidth / (2 * Math.PI)
    const transform = useTransform(rotation, (value) => `rotate3d(0, 1, 0, ${value}deg)`)

    return (
      <div
        className="flex h-full min-w-0 items-center justify-center"
        style={{
          perspective: "1000px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        <motion.div
          drag="x"
          className="relative flex h-full origin-center cursor-grab justify-center active:cursor-grabbing"
          style={{
            transform,
            rotateY: rotation,
            width: cylinderWidth,
            transformStyle: "preserve-3d",
          }}
          onDragStart={onDragStart}
          onDrag={(_, info) => rotation.set(rotation.get() + info.delta.x * 0.05)}
          onDragEnd={(_, info) => {
            controls
              .start({
                rotateY: rotation.get() + info.velocity.x * 0.05,
                transition: { type: "spring", stiffness: 100, damping: 30, mass: 0.1 },
              })
              .then(onDragSettled)
          }}
          animate={controls}
        >
          {cards.map((img, i) => (
            <div
              key={`key-${img.src}-${i}`}
              className="absolute flex h-full origin-center items-center justify-center rounded-xl p-3 drop-shadow-[0_16px_20px_rgba(0,0,0,0.4)]"
              style={{
                width: `${faceWidth}px`,
                transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              <motion.img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="pointer-events-none aspect-square w-full rounded-lg object-contain"
                initial={{ filter: "blur(4px)" }}
                animate={{ filter: "blur(0px)" }}
                transition={transition}
              />
            </div>
          ))}
        </motion.div>
      </div>
    )
  },
)
Carousel.displayName = "Carousel"

export function ThreeDPhotoCarousel({ images }: { images: CarouselImage[] }) {
  const controls = useAnimation()
  // Owned here (not inside Carousel) so startAutoRotate below can read the
  // live position after a drag settles, instead of only Carousel having it.
  const rotation = useMotionValue(0)
  const cards = useMemo(() => images, [images])
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)")

  const startAutoRotate = () => {
    if (reducedMotion) return
    // Keyframes anchored to the CURRENT rotation, not a hardcoded [0, -360]:
    // that hardcoded version always snapped the ring back to face 0 first,
    // discarding wherever a drag had left it, before resuming the spin —
    // visually, the carousel "reset to the 1st pic" every time a drag
    // settled. Starting the keyframe pair at rotation.get() means the tween
    // begins exactly where the value already is, so there's nothing to jump.
    // The infinite loop is still seamless: after one full revolution the
    // value is current-360deg, which renders identically to current (mod
    // 360deg), so the loop's snap back to the first keyframe is invisible.
    const current = rotation.get()
    controls.start({
      rotateY: [current, current - 360],
      transition: { duration: AUTO_ROTATE_SECONDS, ease: "linear", repeat: Infinity },
    })
  }

  useEffect(() => {
    startAutoRotate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  return (
    // min-w-0: as a grid item, this defaults to min-width:auto, which sizes
    // for the subtree's min-content — including the rotating cylinder's
    // 820-1800px width demand several levels down. overflow-hidden further
    // in only clips painting, it doesn't stop that width from being counted
    // as this item's content-based minimum, so without min-w-0 the grid
    // column (and everything sharing it, including the hero's text column
    // on mobile's single-column layout) gets pulled wide enough to fit the
    // carousel's full un-rotated diameter, blowing out the whole page.
    <div className="relative min-w-0">
      {/* A definite pixel height at every breakpoint, not h-full/min-h: the
          inner Carousel nests several plain h-full divs (needed so the 3D
          rotating cylinder and its perspective wrapper both size off the
          same box), and CSS only resolves a percentage height against an
          ancestor with a genuinely explicit height — min-height clamping an
          auto height does not count, even though the box's own rendered
          size ends up correct. With min-h here instead of h, that whole
          h-full chain silently collapsed to 0 several levels down.
          Mobile gets a shorter box (and a smaller cylinderWidth above) so
          the ring reads as a compact accent, not a competing hero element. */}
      <div className="relative h-[260px] w-full min-w-0 overflow-hidden sm:h-[420px] lg:h-[460px]">
        <Carousel
          controls={controls}
          rotation={rotation}
          cards={cards}
          onDragStart={() => controls.stop()}
          onDragSettled={startAutoRotate}
        />
      </div>
    </div>
  )
}
