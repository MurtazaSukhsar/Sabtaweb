"use client"

import type { ReactNode } from "react"
import { ReactLenis } from "lenis/react"
import { QuoteProvider } from "@/context/quote-context"
import { SiteDataProvider, type SiteData } from "@/context/site-data-context"
import { ScrollToTop } from "@/components/scroll-to-top"

import { usePathname } from "next/navigation"

export function Providers({ children, siteData }: { children: ReactNode; siteData: SiteData }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  const content = (
    <>
      <ScrollToTop />
      <SiteDataProvider value={siteData}>
        <QuoteProvider>{children}</QuoteProvider>
      </SiteDataProvider>
    </>
  )

  if (isAdmin) {
    return content
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 0.9,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.5,
        infinite: false,
        overscroll: false,
      }}
    >
      {content}
    </ReactLenis>
  )
}

