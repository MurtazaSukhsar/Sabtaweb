import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { LoadingScreen } from "@/components/loading-screen"
import { Providers } from "@/components/providers"
import { QuoteDrawer } from "@/components/quote-drawer"
import { Chatbot } from "@/components/chatbot"
import { siteConfig } from "@/lib/site-data"

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: ["/brand/logo.png"],
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <Providers>
          <LoadingScreen />
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-xl transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <WhatsAppButton />
          <Chatbot />
          <QuoteDrawer />
        </Providers>
      </body>
    </html>
  )
}
