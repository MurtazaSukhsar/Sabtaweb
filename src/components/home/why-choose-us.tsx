import { BadgeCheck, Boxes, PhoneCall, ShieldCheck } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

import { getSiteConfig } from "@/lib/db"

export async function WhyChooseUs() {
  const siteConfig = await getSiteConfig()

  const reasons = [
    {
      icon: Boxes,
      title: "Deep Ready Stock",
      description: `${siteConfig.itemsInStock} items on the shelf across our product ranges, updated regularly to meet demand.`,
    },
    {
      icon: ShieldCheck,
      title: "Grades You Can Verify",
      description: "GI, 304 and marine-grade 316 stainless stocked to DIN, NFE and G70/G80 standards.",
    },
    {
      icon: BadgeCheck,
      title: "Custom Sourcing",
      description: "Not in stock? Our supplier network can source any fastener spec you need.",
    },
    {
      icon: PhoneCall,
      title: "Direct Sales Access",
      description: "Speak straight to our sales team by phone or WhatsApp, no call centre in between.",
    },
  ]
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal>
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <h2 className="section-heading">Built on stock &amp; service</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
        {reasons.map((reason, i) => (
          <ScrollReveal key={reason.title} delay={i * 80} className="h-full">
            <div className="card-premium group flex h-full flex-col items-start gap-5 p-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary transition-all duration-300 group-hover:bg-accent">
                <reason.icon className="size-7 text-white" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">{reason.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{reason.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
