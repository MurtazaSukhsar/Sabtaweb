import type { Metadata } from "next"
import { getChatbotContent, getQuickReplies, getTestimonials } from "@/lib/db"
import { ContentEditor } from "@/components/admin/content-editor"

export const metadata: Metadata = {
  title: "Page Text",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminContentPage() {
  const [chatbotContent, quickReplies, testimonials] = await Promise.all([
    getChatbotContent(),
    getQuickReplies(),
    getTestimonials(),
  ])

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Page Text</h1>
        <p className="mt-1 text-sm text-muted-foreground">Chatbot copy, quick replies and customer testimonials.</p>
      </div>
      <div className="mt-8">
        <ContentEditor
          initialChatbotContent={chatbotContent}
          initialQuickReplies={quickReplies}
          initialTestimonials={testimonials}
        />
      </div>
    </div>
  )
}
