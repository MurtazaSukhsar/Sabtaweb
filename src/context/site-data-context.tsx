"use client"

import React, { createContext, useContext } from "react"
import type { CategoryMeta } from "@/lib/site-data"

export type SiteData = {
  categories: CategoryMeta[]
  siteConfig: {
    name: string
    nameAr: string
    shortName: string
    tagline: string
    founded: number
    description: string
    url: string
    itemsInStock: string
  }
  contactInfo: {
    phone: string
    phoneHref: string
    fax: string
    poBox: string
    city: string
    website: string
    managingDirector: { name: string; role: string }
    contacts: Array<{
      name: string
      phone: string
      phoneHref: string
      whatsappHref: string
      email: string
    }>
    primaryWhatsappHref: string
    primaryEmail: string
    mapsPlaceUrl: string
    mapsEmbedSrc: string
    lat: number
    lng: number
  }
  industries: ReadonlyArray<{ name: string; description: string }>
  faqs: Array<{ question: string; answer: string }>
  chatbotContent: {
    fabLabel: string
    headerTitle: string
    headerStatus: string
    closeLabel: string
    inputPlaceholder: string
    sendLabel: string
    welcome: string
    welcomeWhatsApp: string
    menuPrompt: string
    showMenu: string
    mainMenu: string
    fallback: string
    fallbackWhatsApp: string
    fallbackEmail: string
  }
  quickReplies: Array<{
    id: string
    label: string
    question: string
    answer: string
    actions?: Array<{ label: string; href: string; external?: boolean }>
  }>
}

const SiteDataContext = createContext<SiteData | null>(null)

export function SiteDataProvider({ children, value }: { children: React.ReactNode; value: SiteData }) {
  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error("useSiteData must be used within a SiteDataProvider")
  }
  return context
}
