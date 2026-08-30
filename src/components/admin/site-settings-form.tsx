"use client"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { saveSiteSettingsAction } from "@/app/admin/actions"

export function SiteSettingsForm({
  initialSiteConfig,
  initialContactInfo,
}: {
  initialSiteConfig: any
  initialContactInfo: any
}) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "contacts">("profile")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const [siteConfig, setSiteConfig] = useState(initialSiteConfig)
  const [contactInfo, setContactInfo] = useState(initialContactInfo)

  async function handleSave(key: string, data: any) {
    setLoading(true)
    setMessage(null)
    try {
      await saveSiteSettingsAction(key, data)
      setMessage({ text: "Settings saved and cached successfully!", type: "success" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      console.error(err)
      setMessage({ text: err.message || "Failed to save settings.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleContactChange = (index: number, field: string, val: string) => {
    const updatedContacts = [...contactInfo.contacts]
    updatedContacts[index][field] = val
    setContactInfo({ ...contactInfo, contacts: updatedContacts })
  }

  const addContact = () => {
    setContactInfo({
      ...contactInfo,
      contacts: [
        ...contactInfo.contacts,
        { name: "Name", phone: "+971 ...", phoneHref: "tel:+971", whatsappHref: "https://wa.me/971", email: "sales@sabtadxb.com" },
      ],
    })
  }

  const removeContact = (index: number) => {
    setContactInfo({
      ...contactInfo,
      contacts: contactInfo.contacts.filter((_: any, i: number) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap border-b border-border gap-2">
        {(["profile", "contacts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`h-11 px-4 text-sm font-bold uppercase transition-all border-b-2 -mb-[2px] ${
              activeSubTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "profile" ? "Company Profile" : "Contacts & Location"}
          </button>
        ))}
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm font-semibold ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {activeSubTab === "profile" && (
        <div className="card-premium space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h3 className="text-base font-bold uppercase text-foreground">Company Identity</h3>
            <button
              onClick={() => handleSave("site_config", siteConfig)}
              disabled={loading}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg btn-primary px-4 text-xs font-bold"
            >
              <Save className="size-4" /> {loading ? "Saving..." : "Save Identity"}
            </button>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 text-sm">
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">English Name</label>
              <input
                type="text"
                value={siteConfig.name}
                onChange={(e) => setSiteConfig({ ...siteConfig, name: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Arabic Name</label>
              <input
                type="text"
                value={siteConfig.nameAr}
                onChange={(e) => setSiteConfig({ ...siteConfig, nameAr: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Short Name</label>
              <input
                type="text"
                value={siteConfig.shortName}
                onChange={(e) => setSiteConfig({ ...siteConfig, shortName: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-muted-foreground">Founded Year</label>
              <input
                type="number"
                value={siteConfig.founded}
                onChange={(e) => setSiteConfig({ ...siteConfig, founded: Number(e.target.value) })}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Tagline</label>
              <input
                type="text"
                value={siteConfig.tagline}
                onChange={(e) => setSiteConfig({ ...siteConfig, tagline: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Dynamic Items Count String</label>
              <input
                type="text"
                value={siteConfig.itemsInStock}
                onChange={(e) => setSiteConfig({ ...siteConfig, itemsInStock: e.target.value })}
                className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-bold uppercase text-muted-foreground">Meta/Footer Description</label>
              <textarea
                rows={3}
                value={siteConfig.description}
                onChange={(e) => setSiteConfig({ ...siteConfig, description: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-accent"
              />
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "contacts" && (
        <div className="space-y-6">
          <div className="card-premium space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-base font-bold uppercase text-foreground">General Info & Map Coordinates</h3>
              <button
                onClick={() => handleSave("contact_info", contactInfo)}
                disabled={loading}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg btn-primary px-4 text-xs font-bold"
              >
                <Save className="size-4" /> {loading ? "Saving..." : "Save Coordinates"}
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 text-sm">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Office Landline</label>
                <input
                  type="text"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Office Fax</label>
                <input
                  type="text"
                  value={contactInfo.fax}
                  onChange={(e) => setContactInfo({ ...contactInfo, fax: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Primary Sales Email</label>
                <input
                  type="text"
                  value={contactInfo.primaryEmail}
                  onChange={(e) => setContactInfo({ ...contactInfo, primaryEmail: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">WhatsApp Link</label>
                <input
                  type="text"
                  value={contactInfo.primaryWhatsappHref}
                  onChange={(e) => setContactInfo({ ...contactInfo, primaryWhatsappHref: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">P.O. Box Details</label>
                <input
                  type="text"
                  value={contactInfo.poBox}
                  onChange={(e) => setContactInfo({ ...contactInfo, poBox: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Google Place Link</label>
                <input
                  type="text"
                  value={contactInfo.mapsPlaceUrl}
                  onChange={(e) => setContactInfo({ ...contactInfo, mapsPlaceUrl: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Google Maps Embed URL</label>
                <input
                  type="text"
                  value={contactInfo.mapsEmbedSrc}
                  onChange={(e) => setContactInfo({ ...contactInfo, mapsEmbedSrc: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div className="border-t border-border pt-4 sm:col-span-2">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Leadership Profile</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase">Managing Director Name</label>
                    <input
                      type="text"
                      value={contactInfo.managingDirector.name}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          managingDirector: { ...contactInfo.managingDirector, name: e.target.value },
                        })
                      }
                      className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground uppercase">Managing Director Role</label>
                    <input
                      type="text"
                      value={contactInfo.managingDirector.role}
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          managingDirector: { ...contactInfo.managingDirector, role: e.target.value },
                        })
                      }
                      className="mt-1 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card-premium space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold uppercase text-foreground">Sales Representatives</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Manage contacts shown on the contact page.</p>
              </div>
              <button
                type="button"
                onClick={addContact}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-accent bg-accent/5 text-accent px-3 text-xs font-bold hover:bg-accent hover:text-white"
              >
                <Plus className="size-3.5" /> Add Contact
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {contactInfo.contacts.map((contact: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => removeContact(i)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-red-600 p-1 rounded-lg"
                    aria-label="Remove contact"
                  >
                    <Trash2 className="size-4" />
                  </button>
                  <p className="text-xs font-bold text-accent uppercase">Contact Representative #{i + 1}</p>

                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Full Name</label>
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => handleContactChange(i, "name", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Phone Number</label>
                      <input
                        type="text"
                        value={contact.phone}
                        onChange={(e) => handleContactChange(i, "phone", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Phone Href Link (tel:)</label>
                      <input
                        type="text"
                        value={contact.phoneHref}
                        onChange={(e) => handleContactChange(i, "phoneHref", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">WhatsApp Link</label>
                      <input
                        type="text"
                        value={contact.whatsappHref}
                        onChange={(e) => handleContactChange(i, "whatsappHref", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-muted-foreground">Email Address</label>
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => handleContactChange(i, "email", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
