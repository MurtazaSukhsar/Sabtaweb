"use client"

import { useState } from "react"
import { Plus, Save, Trash2 } from "lucide-react"
import { saveSiteSettingsAction } from "@/app/admin/actions"

export function FaqEditor({ initialFaqs }: { initialFaqs: any[] }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [faqs, setFaqs] = useState<any[]>(initialFaqs)

  const handleFaqChange = (index: number, field: string, val: string) => {
    const updated = [...faqs]
    updated[index][field] = val
    setFaqs(updated)
  }

  const addFaq = () => {
    setFaqs([...faqs, { question: "New Question", answer: "New Answer" }])
  }

  const removeFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index))
  }

  async function handleSave() {
    setLoading(true)
    setMessage(null)
    try {
      await saveSiteSettingsAction("faqs", faqs)
      setMessage({ text: "FAQs saved and cached successfully!", type: "success" })
      setTimeout(() => setMessage(null), 3000)
    } catch (err: any) {
      console.error(err)
      setMessage({ text: err.message || "Failed to save FAQs.", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
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

      <div className="card-premium space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h3 className="text-base font-bold uppercase text-foreground">Frequently Asked Questions (FAQ)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Edit existing QA pairs or add new ones.</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addFaq}
              className="inline-flex h-10 items-center gap-1 rounded-lg border border-accent bg-accent/5 text-accent px-3 text-xs font-bold hover:bg-accent hover:text-white"
            >
              <Plus className="size-4" /> Add FAQ
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg btn-primary px-4 text-xs font-bold"
            >
              <Save className="size-4" /> {loading ? "Saving..." : "Save FAQs"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3 relative">
              <button
                type="button"
                onClick={() => removeFaq(i)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-red-600 p-1 rounded-lg"
                aria-label="Remove FAQ"
              >
                <Trash2 className="size-4" />
              </button>
              <span className="text-xs font-bold text-accent uppercase">FAQ Item #{i + 1}</span>
              <div className="text-sm space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground">Question</label>
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(i, "question", e.target.value)}
                    className="mt-1 h-10 w-full rounded-lg border border-input bg-background px-3 outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground">Answer</label>
                  <textarea
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(i, "answer", e.target.value)}
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 outline-none focus:border-accent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
