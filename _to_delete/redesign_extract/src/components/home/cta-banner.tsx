import { Mail, Phone } from "lucide-react"
import { contactInfo } from "@/lib/site-data"
import { ScrollReveal } from "@/components/scroll-reveal"

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 surface-grid opacity-[0.06]" aria-hidden="true" />
      <div className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/10 blur-3xl" aria-hidden="true" />
      <ScrollReveal>
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:gap-8 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between md:px-8 md:py-24 lg:px-12">
          <div>
            <h2 className="text-balance text-2xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-4xl">
              Need a Fastener Quote Today?
            </h2>
            <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-primary-foreground/75 md:text-base">
              Tell us the spec, grade and quantity, and our sales team responds fast by phone, WhatsApp or email.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a href={contactInfo.phoneHref} className="inline-flex h-13 shrink-0 items-center justify-center gap-2.5 rounded-lg btn-primary px-7 text-sm whitespace-nowrap">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              <span className="whitespace-nowrap font-bold">{contactInfo.phone}</span>
            </a>
            <a
              href={`mailto:${contactInfo.primaryEmail}`}
              className="inline-flex h-13 shrink-0 items-center justify-center gap-2.5 rounded-lg border border-primary-foreground/30 px-4 text-sm font-semibold text-primary-foreground transition-all duration-280 hover:-translate-y-0.5 hover:bg-primary-foreground hover:text-primary sm:px-7"
            >
              <Mail className="size-4 shrink-0" aria-hidden="true" />
              <span className="max-w-[200px] truncate sm:max-w-none">{contactInfo.primaryEmail}</span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
