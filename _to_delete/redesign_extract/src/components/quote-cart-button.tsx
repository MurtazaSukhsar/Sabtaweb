"use client"

import { ShoppingBag } from "lucide-react"
import { useQuote } from "@/context/quote-context"

export function QuoteCartButton({ className = "" }: { className?: string }) {
  const { totalCount, openDrawer } = useQuote()

  return (
    <button
      type="button"
      onClick={openDrawer}
      className={`relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary text-foreground shadow-sm transition-all hover:border-accent hover:bg-background ${className}`}
      aria-label={`Open quote cart${totalCount > 0 ? ` (${totalCount} items)` : ""}`}
    >
      <ShoppingBag className="size-4.5 text-accent" aria-hidden="true" />
      {totalCount > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
          {totalCount > 99 ? "99+" : totalCount}
        </span>
      )}
    </button>
  )
}
