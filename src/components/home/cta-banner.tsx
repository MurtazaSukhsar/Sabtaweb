import { ChevronRight, Mail, Phone } from "lucide-react"
import { getContactInfo } from "@/lib/db"
import { ScrollReveal } from "@/components/scroll-reveal"

export async function CtaBanner() {
  const contactInfo = await getContactInfo()
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
              Tell us the spec, grade and quantity &mdash; we respond fast by phone, WhatsApp or email.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <a
              href={contactInfo.phoneHref}
              className="group relative inline-flex h-13 shrink-0 items-center overflow-hidden whitespace-nowrap rounded-lg btn-primary px-7 text-sm"
            >
              <span className="mx-auto mr-8 flex items-center gap-2.5 whitespace-nowrap font-bold transition-opacity duration-500 group-hover:opacity-0">
                <Phone className="size-4 shrink-0" aria-hidden="true" />
                {contactInfo.phone}
              </span>
              <span className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-md bg-white/15 transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </a>
            <a
              href={`mailto:${contactInfo.primaryEmail}`}
              className="group relative inline-flex h-13 shrink-0 items-center overflow-hidden rounded-lg border border-primary-foreground/30 px-4 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-foreground hover:text-primary sm:px-7"
            >
              <span className="mx-auto mr-8 flex items-center gap-2.5 transition-opacity duration-500 group-hover:opacity-0">
                <Mail className="size-4 shrink-0" aria-hidden="true" />
                <span className="max-w-[200px] truncate sm:max-w-none">{contactInfo.primaryEmail}</span>
              </span>
              <span className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-md bg-primary-foreground/20 transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
