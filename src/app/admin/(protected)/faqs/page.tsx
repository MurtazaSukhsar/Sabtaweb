import type { Metadata } from "next"
import { getFaqs } from "@/lib/db"
import { FaqEditor } from "@/components/admin/faq-editor"

export const metadata: Metadata = {
  title: "FAQs",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminFaqsPage() {
  const faqs = await getFaqs()

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">FAQs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage the questions and answers shown on the FAQ page.</p>
      </div>
      <div className="mt-8">
        <FaqEditor initialFaqs={faqs} />
      </div>
    </div>
  )
}
