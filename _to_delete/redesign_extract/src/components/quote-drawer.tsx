"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { useQuote } from "@/context/quote-context"
import { contactInfo } from "@/lib/site-data"

export function QuoteDrawer() {
  const { items, removeItem, updateQuantity, clearQuote, totalCount, isDrawerOpen, closeDrawer, getFormattedQuoteText } =
    useQuote()
  const router = useRouter()

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isDrawerOpen) closeDrawer()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isDrawerOpen, closeDrawer])

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isDrawerOpen])

  function handleSendViaForm() {
    closeDrawer()
    router.push("/contact?quote=basket")
  }

  function handleSendViaWhatsApp() {
    const text = getFormattedQuoteText()
    window.open(`${contactInfo.primaryWhatsappHref}?text=${encodeURIComponent(text)}`, "_blank")
  }

  return (
    <div
      className={`fixed inset-0 z-[60] ${isDrawerOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isDrawerOpen}
      inert={!isDrawerOpen}
    >
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-primary/40 backdrop-blur-sm transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <div
        className={`absolute inset-y-0 right-0 flex w-screen max-w-md flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Quote cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-primary p-5 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <ShoppingBag className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-sans text-lg font-extrabold uppercase tracking-tight">Quote Cart</h2>
              <p className="text-xs text-primary-foreground/75">
                {totalCount} {totalCount === 1 ? "item" : "items"} ready for quote
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg p-2 text-primary-foreground/80 transition-colors hover:bg-primary-foreground/10 hover:text-primary-foreground"
            aria-label="Close quote cart"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                <ShoppingBag className="size-8" aria-hidden="true" />
              </div>
              <h3 className="text-base font-bold text-foreground">Your quote cart is empty</h3>
              <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                Add products from any product page to build a bulk quote request.
              </p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="mt-6 inline-flex h-10 items-center rounded-lg btn-primary px-5 text-xs font-bold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center gap-3.5 rounded-xl border border-border bg-card p-3.5 shadow-sm transition-colors hover:border-accent/30"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-white">
                    {item.image ? (
                      <Image src={item.image} alt="" fill sizes="56px" className="object-contain p-1" />
                    ) : (
                      <div className="flex size-full items-center justify-center bg-secondary text-muted-foreground">
                        <ShoppingBag className="size-5" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-sans text-xs font-bold text-foreground">{item.productName}</h4>
                    {(item.grade || item.standard) && (
                      <p className="mt-0.5 truncate text-[10px] font-semibold text-accent">
                        {[item.grade, item.standard].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex size-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="size-3" aria-hidden="true" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="flex size-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-accent hover:text-accent"
                        aria-label="Increase quantity"
                      >
                        <Plus className="size-3" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="shrink-0 p-1.5 text-muted-foreground transition-colors hover:text-red-600"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="space-y-3 border-t border-border bg-secondary p-5">
            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-muted-foreground">
              <span>Selected items</span>
              <span className="text-sm font-bold text-foreground">
                {totalCount} {totalCount === 1 ? "item" : "items"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendViaForm}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg btn-primary text-sm font-bold shadow-md"
            >
              <Mail className="size-4" aria-hidden="true" />
              Send via Enquiry Form
            </button>

            <button
              type="button"
              onClick={handleSendViaWhatsApp}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-[#25D366] text-sm font-bold text-white shadow-md shadow-[#25D366]/20 transition-opacity hover:opacity-95"
            >
              <MessageCircle className="size-4" aria-hidden="true" />
              Send via WhatsApp
            </button>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={clearQuote}
                className="text-xs font-semibold text-muted-foreground transition-colors hover:text-red-600"
              >
                Clear all
              </button>
              <Link href="/products" onClick={closeDrawer} className="text-xs font-semibold text-accent hover:underline">
                Continue browsing
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
