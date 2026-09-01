"use client"

import dynamic from "next/dynamic"

// The chat bubble and the quote drawer are interactive overlays, not part
// of the critical above-the-fold render. Code-splitting them out of the
// main layout bundle (ssr:false) keeps the initial page's JS smaller and
// lets the visible page hydrate before the browser fetches/parses these —
// they pop in a beat later, which is unnoticeable for a closed panel/fab.
const Chatbot = dynamic(() => import("@/components/chatbot").then((m) => m.Chatbot), { ssr: false })
const QuoteDrawer = dynamic(() => import("@/components/quote-drawer").then((m) => m.QuoteDrawer), { ssr: false })

export function DeferredWidgets() {
  return (
    <>
      <Chatbot />
      <QuoteDrawer />
    </>
  )
}
