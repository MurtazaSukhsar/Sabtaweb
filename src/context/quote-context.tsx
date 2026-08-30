"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type QuoteItem = {
  productId: string
  productName: string
  categoryName: string
  categorySlug: string
  grade?: string
  standard?: string
  image?: string
  quantity: number
}

type NewQuoteItem = Omit<QuoteItem, "quantity">

type QuoteContextType = {
  items: QuoteItem[]
  addItem: (item: NewQuoteItem, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearQuote: () => void
  totalCount: number
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  getFormattedQuoteText: () => string
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined)

const STORAGE_KEY = "sabta_quote_cart_v1"

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load any previously saved cart once the page mounts in the browser.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) setItems(JSON.parse(stored))
    } catch (e) {
      console.error("Failed to load quote cart", e)
    }
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error("Failed to save quote cart", e)
    }
  }, [items, isInitialized])

  function addItem(newItem: NewQuoteItem, quantity = 1) {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => i.productId === newItem.productId)
      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + quantity }
        return updated
      }
      return [...prev, { ...newItem, quantity }]
    })
    setIsDrawerOpen(true)
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)))
  }

  function clearQuote() {
    setItems([])
  }

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  function openDrawer() {
    setIsDrawerOpen(true)
  }

  function closeDrawer() {
    setIsDrawerOpen(false)
  }

  function getFormattedQuoteText(): string {
    if (items.length === 0) return ""
    let text = `Hello Sabta Trading Team,\n\nI would like to request a quote for the following items:\n\n`
    items.forEach((item, index) => {
      text += `${index + 1}. ${item.productName}`
      const details = [item.grade, item.standard].filter(Boolean).join(" · ")
      if (details) text += ` (${details})`
      text += ` — Qty: ${item.quantity}`
      text += `\n`
    })
    text += `\nPlease confirm availability, pricing and delivery. Thank you!`
    return text
  }

  return (
    <QuoteContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearQuote,
        totalCount,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        getFormattedQuoteText,
      }}
    >
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const context = useContext(QuoteContext)
  if (!context) {
    throw new Error("useQuote must be used within a QuoteProvider")
  }
  return context
}
