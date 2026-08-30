import type { Metadata } from "next"
import { getSiteConfig, getContactInfo } from "@/lib/db"
import { SiteSettingsForm } from "@/components/admin/site-settings-form"

export const metadata: Metadata = {
  title: "Site & Contact",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminSitePage() {
  const [siteConfig, contactInfo] = await Promise.all([getSiteConfig(), getContactInfo()])

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Site & Contact</h1>
        <p className="mt-1 text-sm text-muted-foreground">Company identity, contact details and sales representatives.</p>
      </div>
      <div className="mt-8">
        <SiteSettingsForm initialSiteConfig={siteConfig} initialContactInfo={contactInfo} />
      </div>
    </div>
  )
}
