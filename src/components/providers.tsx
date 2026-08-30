"use client"

import type { ReactNode } from "react"
import { ReactLenis } from "lenis/react"
import { QuoteProvider } from "@/context/quote-context"
import { SiteDataProvider, type SiteData } from "@/context/site-data-context"
import { ScrollToTop } from "@/components/scroll-to-top"

export function Providers({ children, siteData }: { children: ReactNode; siteData: SiteData }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 1.2,
      }}
    >
      <ScrollToTop />
      <SiteDataProvider value={siteData}>
        <QuoteProvider>{children}</QuoteProvider>
      </SiteDataProvider>
    </ReactLenis>
  )
}

