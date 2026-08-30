"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { useLenis } from "lenis/react"

/**
 * Lenis takes over document scrolling, so Next.js's default "scroll to top
 * on navigation" behavior no longer applies — the smooth-scrolled position
 * from the previous page (which can be scrolled far down, e.g. near the
 * footer) carries over into the next page instead of resetting. This
 * listens for route changes and snaps Lenis (and the native scroll
 * position, as a fallback) back to the top on every navigation.
 */
export function ScrollToTop() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [pathname, lenis])

  return null
}
