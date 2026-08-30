import { Boxes, CalendarDays, Factory, Layers } from "lucide-react"
import { AnimatedCounter } from "@/components/animated-counter"
import { ScrollReveal } from "@/components/scroll-reveal"
import { categories, industries, siteConfig } from "@/lib/site-data"

export function StatsCounter() {
  const years = new Date().getFullYear() - siteConfig.founded

  const stats = [
    { icon: Boxes, value: 16000, suffix: "+", label: "Items In Stock" },
    { icon: CalendarDays, value: years, suffix: "+", label: "Years Trading" },
    { icon: Layers, value: categories.length, suffix: "", label: "Product Ranges" },
    { icon: Factory, value: industries.length, suffix: "", label: "Core Industries" },
  ]

  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0 surface-grid opacity-[0.06]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <p className="eyebrow !text-accent">By The Numbers</p>
            <h2 className="mt-3 section-heading !text-primary-foreground">A full fastener inventory</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-2 gap-5 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 80} className="h-full">
              <div className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-5 text-center backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/50 hover:bg-primary-foreground/10 sm:p-7 md:p-9">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/15 transition-transform duration-300 group-hover:scale-110 sm:size-14 sm:rounded-2xl">
                  <stat.icon className="size-5 text-white sm:size-7" strokeWidth={1.5} aria-hidden="true" />
                </div>
                <p className="text-2xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl md:text-5xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1800} />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-foreground/75 sm:text-xs md:text-sm">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
