"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useSiteData } from "@/context/site-data-context"

export function WhatsAppButton() {
  const pathname = usePathname()
  const { contactInfo } = useSiteData()
  const [visible, setVisible] = useState(false)

  if (pathname.startsWith("/admin")) return null

  useEffect(() => {
    // Reveal only after a small scroll rather than on a fixed timer. On
    // common phone heights (~720-850px, e.g. iPhone 12-14) this button sits
    // directly under the hero's full-width "Request a Quote" button at
    // scroll position 0 — confirmed via layout measurement. Gating on
    // scroll keeps the two from ever overlapping on first paint, on any
    // device height, without needing to special-case the homepage.
    function updateVisibility() {
      setVisible(window.scrollY > 220)
    }
    updateVisibility()
    window.addEventListener("scroll", updateVisibility, { passive: true })
    return () => window.removeEventListener("scroll", updateVisibility)
  }, [])

  return (
    <a
      href={`${contactInfo.primaryWhatsappHref}?text=${encodeURIComponent("Hi Sabta Trading, I'd like a quote for: ")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={`fixed bottom-4 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-[#25D366]/25 transition-all duration-500 hover:scale-110 hover:shadow-xl sm:bottom-5 sm:right-5 md:size-16 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 32 32" className="size-7 fill-white md:size-8" aria-hidden="true">
        <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.593 4.463 1.72 6.406L3.2 28.8l6.573-1.687a12.74 12.74 0 0 0 6.227 1.606h.006c7.058 0 12.794-5.74 12.794-12.8 0-3.42-1.33-6.633-3.75-9.05a12.72 12.72 0 0 0-9.046-3.669zm0 23.36h-.005a10.58 10.58 0 0 1-5.394-1.477l-.387-.23-3.9 1.001 1.04-3.8-.252-.39a10.55 10.55 0 0 1-1.622-5.664c0-5.867 4.775-10.64 10.646-10.64 2.842 0 5.513 1.108 7.522 3.118a10.57 10.57 0 0 1 3.113 7.528c0 5.867-4.775 10.64-10.64 10.64zm5.837-7.97c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16-.213.32-.826 1.04-1.013 1.253-.187.214-.373.24-.693.08-.32-.16-1.352-.498-2.575-1.588-.952-.85-1.594-1.898-1.781-2.218-.187-.32-.02-.494.14-.653.144-.144.32-.374.48-.56.16-.187.213-.32.32-.534.107-.213.054-.4-.026-.56-.08-.16-.72-1.734-.987-2.374-.26-.624-.523-.54-.72-.55l-.613-.01c-.213 0-.56.08-.853.4-.293.32-1.12 1.093-1.12 2.667 0 1.573 1.146 3.093 1.306 3.306.16.214 2.256 3.444 5.466 4.83.764.33 1.36.527 1.825.674.767.244 1.465.21 2.017.127.615-.092 1.893-.774 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.134-.293-.214-.613-.374z" />
      </svg>
    </a>
  )
}
