import { BadgeCheck, Boxes, Handshake, ShieldCheck } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const badges = [
  { icon: Boxes, label: "16,000+ Items In Stock" },
  { icon: ShieldCheck, label: "304 & 316 Marine Grade" },
  { icon: Handshake, label: "Trading Since 1994" },
  { icon: BadgeCheck, label: "Custom Sourcing Available" },
]

export function TrustBadges() {
  return (
    <section aria-label="Why choose Sabta Trading" className="border-b border-border bg-secondary">
      <ScrollReveal>
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
          {badges.map((badge, i) => (
            <div
              key={badge.label}
              className={`flex items-center justify-center gap-2.5 px-3 py-5 sm:gap-3 sm:px-6 sm:py-7 md:py-8
                ${i % 2 === 0 ? "border-r border-border/50" : ""}
                ${i < 2 ? "border-b border-border/50 md:border-b-0" : ""}
                ${i === 1 || i === 2 ? "md:border-r border-border/50" : ""}
              `}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary">
                <badge.icon className="size-5 text-white" strokeWidth={1.5} aria-hidden="true" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-secondary-foreground md:text-sm">{badge.label}</span>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
