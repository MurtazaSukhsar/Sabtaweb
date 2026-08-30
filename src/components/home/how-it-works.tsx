import { MousePointerClick, ListChecks, MessageCircle } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const steps = [
  {
    icon: MousePointerClick,
    step: "01",
    title: "Browse & Select",
    description: "Find what you need across our 9 product ranges — search by category, grade (GI, 304, 316) or DIN/NFE standard.",
  },
  {
    icon: ListChecks,
    step: "02",
    title: "Add To Quote Cart",
    description: "Add every item you need to your Quote Cart, the bag icon in the header, no limit on how many products or ranges you mix.",
  },
  {
    icon: MessageCircle,
    step: "03",
    title: "Submit & Get Pricing",
    description: "Send your whole list in one message via WhatsApp or our contact form. Our sales team replies directly with pricing and availability.",
  },
]

export function HowItWorks() {
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal>
        <div className="mb-14 flex flex-col items-center gap-3 text-center">
          <p className="eyebrow">How To Order</p>
          <h2 className="section-heading">From Browsing To A Quote In 3 Steps</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-6 sm:grid-cols-3 md:gap-8">
        {steps.map((s, i) => (
          <ScrollReveal key={s.step} delay={i * 100} className="h-full">
            <div className="card-premium group flex h-full flex-col items-start gap-5 p-8">
              <div className="flex w-full items-center justify-between">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary transition-all duration-300 group-hover:bg-accent">
                  <s.icon className="size-7 text-white" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground/50">
                  Step {s.step}
                </span>
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">{s.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
