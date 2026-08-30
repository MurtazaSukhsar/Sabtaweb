"use client"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { saveSiteSettingsAction } from "@/app/admin/actions"

export function ContentEditor({
  initialChatbotContent,
  initialQuickReplies,
  initialTestimonials,
}: {
  initialChatbotContent: any
  initialQuickReplies: any[]
  initialTestimonials: any[]
}) {
  const [activeSubTab, setActiveSubTab] = useState<"chatbot" | "testimonials">("chatbot")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)

  const [chatbotContent, setChatbotContent] = useState(initialChatbotContent)
  const [quickReplies, setQuickReplies] = useState<any[]>(initialQuickReplies)
  const [testimonials, setTestimonials] = useState<any[]>(initialTestimonials)

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

  const handleQuickReplyChange = (index: number, field: string, val: string) => {
    const updated = [...quickReplies]
    updated[index][field] = val
    setQuickReplies(updated)
  }

  const handleQuickReplyActionChange = (qrIndex: number, actIndex: number, field: string, val: string) => {
    const updated = [...quickReplies]
    if (!updated[qrIndex].actions) updated[qrIndex].actions = []
    updated[qrIndex].actions[actIndex][field] = val
    setQuickReplies(updated)
  }

  const addQuickReplyAction = (qrIndex: number) => {
    const updated = [...quickReplies]
    if (!updated[qrIndex].actions) updated[qrIndex].actions = []
    updated[qrIndex].actions.push({ label: "Action Button", href: "/", external: false })
    setQuickReplies(updated)
  }

  const removeQuickReplyAction = (qrIndex: number, actIndex: number) => {
    const updated = [...quickReplies]
    updated[qrIndex].actions = updated[qrIndex].actions.filter((_: any, i: number) => i !== actIndex)
    setQuickReplies(updated)
  }

  const handleTestimonialChange = (index: number, field: string, val: string) => {
    const updated = [...testimonials]
    updated[index][field] = val
    setTestimonials(updated)
  }

  const handleTestimonialAuthorChange = (index: number, field: string, val: string) => {
    const updated = [...testimonials]
    if (!updated[index].author) updated[index].author = {}
    updated[index].author[field] = val
    setTestimonials(updated)
  }

  const addTestimonial = () => {
    setTestimonials([
      ...testimonials,
      { author: { name: "Client Name", role: "Manager", company: "Company" }, text: "Excellent service and high-quality materials." },
    ])
  }

  const removeTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap border-b border-border gap-2">
        {(["chatbot", "testimonials"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`h-11 px-4 text-sm font-bold uppercase transition-all border-b-2 -mb-[2px] ${
              activeSubTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "chatbot" ? "Chatbot Helper" : "Testimonials"}
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

      {activeSubTab === "chatbot" && (
        <div className="space-y-6">
          <div className="card-premium space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h3 className="text-base font-bold uppercase text-foreground">Chatbot Copy Texts</h3>
              <button
                onClick={() => handleSave("chatbot_content", chatbotContent)}
                disabled={loading}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg btn-primary px-4 text-xs font-bold"
              >
                <Save className="size-4" /> {loading ? "Saving..." : "Save Copy"}
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 text-sm">
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Chat Floating Button Label</label>
                <input
                  type="text"
                  value={chatbotContent.fabLabel}
                  onChange={(e) => setChatbotContent({ ...chatbotContent, fabLabel: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Header Title</label>
                <input
                  type="text"
                  value={chatbotContent.headerTitle}
                  onChange={(e) => setChatbotContent({ ...chatbotContent, headerTitle: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Header Status text</label>
                <input
                  type="text"
                  value={chatbotContent.headerStatus}
                  onChange={(e) => setChatbotContent({ ...chatbotContent, headerStatus: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase text-muted-foreground">Input Placeholder</label>
                <input
                  type="text"
                  value={chatbotContent.inputPlaceholder}
                  onChange={(e) => setChatbotContent({ ...chatbotContent, inputPlaceholder: e.target.value })}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 outline-none focus:border-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Welcome Message</label>
                <textarea
                  rows={2}
                  value={chatbotContent.welcome}
                  onChange={(e) => setChatbotContent({ ...chatbotContent, welcome: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-accent"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Fallback Reply Message</label>
                <textarea
                  rows={2}
                  value={chatbotContent.fallback}
                  onChange={(e) => setChatbotContent({ ...chatbotContent, fallback: e.target.value })}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          <div className="card-premium space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-base font-bold uppercase text-foreground">Chatbot Quick Replies (Menu)</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize automatic responses mapped to categories.</p>
              </div>
              <button
                onClick={() => handleSave("quick_replies", quickReplies)}
                disabled={loading}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg btn-primary px-4 text-xs font-bold"
              >
                <Save className="size-4" /> {loading ? "Saving..." : "Save Quick Replies"}
              </button>
            </div>

            <div className="space-y-6">
              {quickReplies.map((qr, qri) => (
                <div key={qr.id} className="rounded-xl border border-border bg-secondary/30 p-5 space-y-4">
                  <p className="text-sm font-bold text-accent uppercase">Intent Mode: {qr.id}</p>

                  <div className="grid gap-4 sm:grid-cols-2 text-sm">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Menu Button Label</label>
                      <input
                        type="text"
                        value={qr.label}
                        onChange={(e) => handleQuickReplyChange(qri, "label", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Trigger Question</label>
                      <input
                        type="text"
                        value={qr.question}
                        onChange={(e) => handleQuickReplyChange(qri, "question", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-muted-foreground">Auto-Response Answer</label>
                      <textarea
                        rows={2}
                        value={qr.answer}
                        onChange={(e) => handleQuickReplyChange(qri, "answer", e.target.value)}
                        className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Response Actions</span>
                      <button
                        type="button"
                        onClick={() => addQuickReplyAction(qri)}
                        className="inline-flex h-8 items-center gap-1 rounded border border-accent bg-accent/5 text-accent px-2 text-[11px] font-bold hover:bg-accent hover:text-white"
                      >
                        <Plus className="size-3" /> Add Action
                      </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {(qr.actions || []).map((action: any, acti: number) => (
                        <div key={acti} className="rounded-lg border border-border bg-background p-3.5 relative space-y-2 text-xs">
                          <button
                            type="button"
                            onClick={() => removeQuickReplyAction(qri, acti)}
                            className="absolute right-2 top-2 text-muted-foreground hover:text-red-600 p-0.5 rounded"
                            aria-label="Remove action"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground">Button Label</label>
                            <input
                              type="text"
                              value={action.label}
                              onChange={(e) => handleQuickReplyActionChange(qri, acti, "label", e.target.value)}
                              className="mt-1 h-8 w-full rounded border border-input px-2 outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-muted-foreground">Link Href</label>
                            <input
                              type="text"
                              value={action.href}
                              onChange={(e) => handleQuickReplyActionChange(qri, acti, "href", e.target.value)}
                              className="mt-1 h-8 w-full rounded border border-input px-2 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "testimonials" && (
        <div className="card-premium space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="text-base font-bold uppercase text-foreground">Customer Testimonials</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Manage customer quote feedback displays.</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={addTestimonial}
                className="inline-flex h-10 items-center gap-1 rounded-lg border border-accent bg-accent/5 text-accent px-3 text-xs font-bold hover:bg-accent hover:text-white"
              >
                <Plus className="size-4" /> Add Testimonial
              </button>
              <button
                onClick={() => handleSave("testimonials", testimonials)}
                disabled={loading}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg btn-primary px-4 text-xs font-bold"
              >
                <Save className="size-4" /> {loading ? "Saving..." : "Save Testimonials"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {testimonials.map((test, i) => (
              <div key={i} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeTestimonial(i)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-red-600 p-1 rounded-lg"
                  aria-label="Remove Testimonial"
                >
                  <Trash2 className="size-4" />
                </button>
                <span className="text-xs font-bold text-accent uppercase">Testimonial #{i + 1}</span>
                <div className="text-sm space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-muted-foreground">Testimonial Quote / Text</label>
                    <textarea
                      rows={3}
                      value={test.text}
                      onChange={(e) => handleTestimonialChange(i, "text", e.target.value)}
                      className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-accent"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Author Name</label>
                      <input
                        type="text"
                        value={test.author.name}
                        onChange={(e) => handleTestimonialAuthorChange(i, "name", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Author Role</label>
                      <input
                        type="text"
                        value={test.author.role || ""}
                        onChange={(e) => handleTestimonialAuthorChange(i, "role", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-muted-foreground">Company Name</label>
                      <input
                        type="text"
                        value={test.author.company || ""}
                        onChange={(e) => handleTestimonialAuthorChange(i, "company", e.target.value)}
                        className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
