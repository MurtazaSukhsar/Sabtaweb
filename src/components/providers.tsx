"use client"

import type { ReactNode } from "react"
import { ReactLenis } from "lenis/react"
import { QuoteProvider } from "@/context/quote-context"
import { SiteDataProvider, type SiteData } from "@/context/site-data-context"
import { ScrollToTop } from "@/components/scroll-to-top"

export function Providers({ children, siteData }: { children: ReactNode; siteData: SiteData }) {
  return (
    <ReactLenis root>
      <ScrollToTop />
      <SiteDataProvider value={siteData}>
        <QuoteProvider>{children}</QuoteProvider>
      </SiteDataProvider>
    </ReactLenis>
  )
}

