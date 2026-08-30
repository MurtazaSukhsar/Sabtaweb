"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Product } from "@/lib/products"

// Keep the fan odd-count where possible so there's a true centre card; the
// geometry math below works for any count regardless.
export const MAX_FAN_CARDS = 5

type Geometry = {
  cardW: number
  cardH: number
  xStep: number
  yLift: number
  angle: number
  height: number
}

// Derived straight from the measured container width (via ResizeObserver)
// rather than fixed breakpoints, so the fan never overflows on any device —
// each card is ~30% of the available width with a ~50% overlap between
// neighbours, which keeps most of every card's face clickable.
function computeGeometry(containerWidth: number): Geometry {
  const cardW = Math.min(340, Math.max(150, containerWidth * 0.3))
  const cardH = cardW * 1.32
  const xStep = cardW * 0.5
  const yLift = cardH * 0.1
  const angle = 8
  const height = cardH + yLift * 2 + 110
  return { cardW, cardH, xStep, yLift, angle, height }
}

// Card transforms are plain CSS (`transition: transform`), animated with a
// spring-flavoured cubic-bezier that overshoots slightly on the way in — the
// same "fan settles into place" feel as an eased JS tween, with no animation
// library required.
function cardTransform(g: Geometry, offset: number, isActive: boolean) {
  const x = offset * g.xStep
  const y = Math.abs(offset) * g.yLift - (isActive ? g.yLift * 3 + 14 : 0)
  const rotation = isActive ? 0 : offset * g.angle
  const scale = isActive ? 1.14 : 1 - Math.abs(offset) * 0.05
  return `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`
}

export function FanCardStage({ products, activeIndex }: { products: Product[]; activeIndex?: number }) {
  const items = products.slice(0, MAX_FAN_CARDS)
  const layoutRef = useRef<HTMLDivElement>(null)
  const [geometry, setGeometry] = useState<Geometry | null>(null)
  const [entered, setEntered] = useState(false)
  const center = (items.length - 1) / 2

  useEffect(() => {
    const layoutEl = layoutRef.current
    if (!layoutEl) return

    const measure = () => setGeometry(computeGeometry(layoutEl.clientWidth))
    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(layoutEl)

    // Fan out only once the stage actually scrolls into view — on mount, the
    // section is still well below the fold (behind the boot loader and the
    // hero), so an on-mount trigger would settle long before anyone sees it.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          intersectionObserver.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    intersectionObserver.observe(layoutEl)

    return () => {
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
    }
  }, [])

  if (items.length === 0) return null

  return (
    <div ref={layoutRef} className="fan-layout relative mx-auto w-full max-w-5xl" style={geometry ? { height: geometry.height } : undefined}>
      {items.map((product, i) => {
        const href = `/products/${product.categorySlug}/${product.slug}`
        const offset = i - center
        // Purely scroll-driven — no hover/focus override, since cursoring
        // across overlapping cards was fighting the scroll position.
        const isActive = activeIndex === i
        const zIndex = isActive ? 50 : 20 - Math.round(Math.abs(offset) * 4)

        return (
          <div
            key={product.id}
            className="fan-card absolute left-1/2 top-1/2"
            style={{
              width: geometry ? geometry.cardW : undefined,
              height: geometry ? geometry.cardH : undefined,
              zIndex,
              opacity: entered && geometry ? 1 : 0,
              transform: entered && geometry ? cardTransform(geometry, offset, isActive) : "translate(-50%, -50%) translate(0, 36px) scale(0.86)",
              transitionDelay: entered ? "0ms" : `${i * 70}ms`,
            }}
          >
            <Link
              href={href}
              className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_38px_-16px_rgba(27,42,128,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-accent"
            >
              <div className="relative flex-1 overflow-hidden bg-white">
                <Image src={product.image as string} alt={product.name} fill sizes="340px" className="object-contain p-5" />
              </div>
              <div className="border-t border-border bg-card px-4 py-3">
                <p className="truncate text-sm font-bold leading-tight text-foreground">{product.name}</p>
                {(product.grade || product.standard) && (
                  <p className="truncate text-xs font-semibold text-accent">{[product.grade, product.standard].filter(Boolean).join(" · ")}</p>
                )}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}
