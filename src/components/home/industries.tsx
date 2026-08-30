import { Car, Factory, Ship, Waves } from "lucide-react"
import { getIndustries } from "@/lib/db"
import { ScrollReveal } from "@/components/scroll-reveal"

const icons = [Car, Factory, Ship, Waves]

export async function Industries() {
  const industries = await getIndustries()
  return (
    <section className="section-pad mx-auto max-w-7xl px-4 sm:px-6 md:px-8 lg:px-12">
      <ScrollReveal>
        <div className="mb-14 flex flex-col items-center gap-3 text-center">

          <h2 className="section-heading">Industries We Serve</h2>
        </div>
      </ScrollReveal>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 md:gap-6">
        {industries.map((ind, i) => {
          const Icon = icons[i]
          return (
            <ScrollReveal key={ind.name} delay={i * 80} className="h-full">
              <div className="card-premium flex h-full flex-col gap-4 p-7">
                <div className="flex size-12 items-center justify-center rounded-xl bg-accent-light">
                  <Icon className="size-6 text-accent" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="text-base font-black uppercase tracking-tight text-foreground">{ind.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{ind.description}</p>
              </div>
            </ScrollReveal>
          )
        })}
      </div>
    </section>
  )
}
