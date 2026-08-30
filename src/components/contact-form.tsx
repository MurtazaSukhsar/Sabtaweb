"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ChevronRight, Send, ShoppingBag } from "lucide-react"
import { useQuote } from "@/context/quote-context"
import { useSiteData } from "@/context/site-data-context"

export function ContactForm({ initialCategory = "", initialProduct = "" }: { initialCategory?: string; initialProduct?: string }) {
  const { categories, contactInfo } = useSiteData()
  const searchParams = useSearchParams()
  const isBasketQuote = searchParams.get("quote") === "basket"
  const { items, getFormattedQuoteText } = useQuote()

  const [name, setName] = useState("")
  const [company, setCompany] = useState("")
  const [phone, setPhone] = useState("")
  const [category, setCategory] = useState(initialCategory)
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (isBasketQuote && items.length > 0) {
      setMessage(getFormattedQuoteText())
    } else if (initialProduct) {
      setMessage(`Please send me a quote for: ${initialProduct}\n\nQuantity needed: `)
    }
    // Only run this once, when the page first loads with these params.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const subject = isBasketQuote && items.length > 0
      ? `Bulk Quote Request (${items.length} items)`
      : `Quote Request${category ? ` - ${category}` : ""}`
    const bodyLines = [
      `Name: ${name}`,
      company && `Company: ${company}`,
      phone && `Phone: ${phone}`,
      category && `Product range: ${category}`,
      "",
      message,
    ].filter(Boolean)

    const mailto = `mailto:${contactInfo.primaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {isBasketQuote && items.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent-light p-4 text-xs font-semibold text-foreground">
          <ShoppingBag className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <p className="font-bold text-accent">Quote Cart</p>
            <p className="text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"} from your quote cart, details below
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Full Name *
          </label>
          <input
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Company
          </label>
          <input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="Company name"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            placeholder="+971 ..."
          />
        </div>
        <div>
          <label htmlFor="category" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Product Range
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="">Select a range (optional)</option>
            {categories.map((cat) => (
              <option key={cat.slug} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-muted-foreground">
          What do you need? *
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          placeholder="Product, grade, standard and quantity you need a quote for"
        />
      </div>

      <button
        type="submit"
        className="group relative inline-flex h-13 w-full items-center overflow-hidden rounded-lg btn-primary text-sm sm:w-auto sm:px-10"
      >
        <span className="mx-auto mr-8 flex items-center gap-2 transition-opacity duration-500 group-hover:opacity-0">
          <Send className="size-4 shrink-0" aria-hidden="true" />
          Send Enquiry
        </span>
        <span className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-md bg-white/15 transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
          <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
        </span>
      </button>

      {sent && (
        <p className="text-sm font-medium text-accent">
          Opening your email app with this enquiry pre-filled. If it doesn&rsquo;t open, email us directly at{" "}
          <a href={`mailto:${contactInfo.primaryEmail}`} className="underline">
            {contactInfo.primaryEmail}
          </a>
          .
        </p>
      )}
    </form>
  )
}
