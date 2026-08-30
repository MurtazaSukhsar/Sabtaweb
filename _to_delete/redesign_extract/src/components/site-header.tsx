"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ChevronDown, Menu, Phone, ShoppingBag, X } from "lucide-react"
import { categories, contactInfo } from "@/lib/site-data"
import { QuoteCartButton } from "@/components/quote-cart-button"
import { useQuote } from "@/context/quote-context"

const navLinkClass =
  "relative shrink-0 whitespace-nowrap text-sm font-semibold text-foreground transition-colors hover:text-accent"
const activeNavLinkClass = "text-accent after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-accent"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { totalCount, openDrawer } = useQuote()

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      setScrolled((prev) => {
        if (y > 56) return true
        if (y < 24) return false
        return prev
      })
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const links = [
    { href: "/about", label: "About" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ]

  const isProductsActive = pathname === "/products" || pathname.startsWith("/categories") || pathname.startsWith("/products/")
  function isLinkActive(href: string) {
    return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 w-full transition-all duration-300 ${
          scrolled ? "bg-background/98 shadow-lg shadow-primary/5 backdrop-blur-lg" : "bg-background/95 shadow-sm backdrop-blur"
        }`}
      >
        <div className={`w-full bg-primary transition-all duration-300 ${scrolled ? "h-1" : "h-4 md:h-6"}`} aria-hidden="true" />

        <div className="border-b border-border">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-6 sm:py-3 md:px-8 lg:px-12">
            <Link href="/" className="flex shrink-0 items-center gap-3" aria-label="Sabta Trading Co. LLC home">
              <Image
                src="/brand/logo.png"
                alt="Sabta Trading Co. LLC"
                width={620}
                height={202}
                priority
                className={`w-auto object-contain transition-all duration-300 ${
                  scrolled ? "h-9 sm:h-11 md:h-12" : "h-11 sm:h-13 md:h-16"
                }`}
              />
            </Link>

            <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
              <Link href="/" className={`${navLinkClass} ${isLinkActive("/") ? activeNavLinkClass : ""}`} aria-current={isLinkActive("/") ? "page" : undefined}>
                Home
              </Link>
              <div
                className="relative"
                ref={dropdownRef}
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
                onFocus={() => setDropdownOpen(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropdownOpen(false)
                }}
              >
                <Link
                  href="/products"
                  className={`${navLinkClass} flex items-center gap-1 ${isProductsActive ? activeNavLinkClass : ""}`}
                  aria-current={isProductsActive ? "page" : undefined}
                  aria-expanded={dropdownOpen}
                >
                  Products
                  <ChevronDown
                    className={`size-4 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </Link>
                <div
                  className={`absolute left-0 top-full z-50 mt-1 w-72 origin-top rounded-xl border border-border bg-card p-2 shadow-xl transition-all duration-200 ${
                    dropdownOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
                  }`}
                >
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/categories/${cat.slug}`}
                      className="block rounded-lg px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent-light hover:text-primary"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`${navLinkClass} ${isLinkActive(link.href) ? activeNavLinkClass : ""}`}
                  aria-current={isLinkActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <a
                href={contactInfo.phoneHref}
                className="hidden h-10 shrink-0 items-center gap-2 rounded-lg border border-border bg-secondary px-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-accent hover:bg-background md:inline-flex"
              >
                <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                <span className="whitespace-nowrap">{contactInfo.phone}</span>
              </a>

              <Link
                href="/contact"
                className="hidden h-10 shrink-0 items-center whitespace-nowrap rounded-lg btn-primary px-5 text-sm lg:inline-flex"
              >
                Get a Quote
              </Link>

              <QuoteCartButton />

              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="inline-flex size-10 items-center justify-center rounded-lg border border-border lg:hidden"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden border-b border-border bg-background transition-[grid-template-rows] duration-300 ease-out lg:hidden ${
            mobileOpen ? "grid grid-rows-[1fr]" : "grid grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-4 sm:px-6 md:px-8" aria-label="Mobile navigation">
              <Link href="/" className="block border-b border-border py-3.5 text-sm font-semibold">
                Home
              </Link>
              <p className="pb-1 pt-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Products</p>
              {categories.map((cat) => (
                <Link key={cat.slug} href={`/categories/${cat.slug}`} className="block py-2 pl-3 text-sm font-medium text-foreground">
                  {cat.name}
                </Link>
              ))}
              {links.map((link) => (
                <Link key={link.href} href={link.href} className="block border-t border-border py-3.5 text-sm font-semibold">
                  {link.label}
                </Link>
              ))}
              <a
                href={contactInfo.phoneHref}
                className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-semibold"
              >
                <Phone className="size-4 text-accent" aria-hidden="true" />
                <span>{contactInfo.phone}</span>
              </a>
              <Link href="/contact" className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-lg btn-primary text-sm">
                Get a Quote
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false)
                  openDrawer()
                }}
                className="mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-secondary text-sm font-semibold"
              >
                <ShoppingBag className="size-4 text-accent" aria-hidden="true" />
                Quote Cart{totalCount > 0 ? ` (${totalCount})` : ""}
              </button>
            </nav>
          </div>
        </div>
      </header>
      <div className="h-[73px] sm:h-[85px] md:h-[97px]" aria-hidden="true" />
    </>
  )
}
