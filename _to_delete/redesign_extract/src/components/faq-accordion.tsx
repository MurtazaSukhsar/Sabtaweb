"use client"

import { useState } from "react"
import { ChevronDown, HelpCircle } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="grid gap-4">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i
        const triggerId = `faq-trigger-${i}`
        const panelId = `faq-panel-${i}`
        return (
          <ScrollReveal key={faq.question} delay={i * 50}>
            <article className="card-premium overflow-hidden">
              <button
                type="button"
                id={triggerId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-start gap-4 p-6 text-left transition-colors hover:bg-secondary/50"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                  <HelpCircle className="size-5 text-accent" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h2 className="pr-8 text-base font-bold text-foreground">{faq.question}</h2>
                </div>
                <ChevronDown
                  className={`mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                className="grid transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 pl-20 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              </div>
            </article>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
