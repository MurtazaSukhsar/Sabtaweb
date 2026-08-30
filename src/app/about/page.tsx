import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Boxes, CalendarDays, ChevronRight, Layers, Users } from "lucide-react"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { AnimatedCounter } from "@/components/animated-counter"
import { ScrollReveal } from "@/components/scroll-reveal"
import { CtaBanner } from "@/components/home/cta-banner"
import { Industries } from "@/components/home/industries"
import { getSiteConfig, getContactInfo, getCategories } from "@/lib/db"

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig()
  return {
    title: "About Us",
    description: `${siteConfig.name}, Dubai-based fastener and marine rigging hardware distributor since ${siteConfig.founded}. Learn about our company profile and the industries we serve.`,
    alternates: { canonical: "/about" },
  }
}

export default async function AboutPage() {
  const [siteConfig, contactInfo, categories] = await Promise.all([
    getSiteConfig(),
    getContactInfo(),
    getCategories(),
  ])

  const years = new Date().getFullYear() - siteConfig.founded

  const stats = [
    { icon: Boxes, value: 16000, suffix: "+", label: "Items In Stock" },
    { icon: CalendarDays, value: years, suffix: "+", label: "Years Trading" },
    { icon: Layers, value: categories.length, suffix: "", label: "Product Ranges" },
    { icon: Users, value: contactInfo.contacts.length + 1, suffix: "", label: "Direct Sales Contacts" },
  ]

  return (
    <>
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
          <p className="eyebrow !text-accent">About Sabta Trading</p>
          <h1 className="mt-4 max-w-3xl text-balance text-3xl font-extrabold uppercase tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
            A Fastener &amp; Marine Rigging Hardware Distributor Since {siteConfig.founded}
          </h1>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-20 lg:px-12">
        <Breadcrumbs crumbs={[{ label: "About" }]} />

        <div className="mt-12 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <ScrollReveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-white shadow-sm flex items-center justify-center">
              <Image
                src={siteConfig.companyProfileImage || "/brand/logo.png"}
                alt={`${siteConfig.name} Company Profile`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8 sm:p-12"
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={150}>
            <div>
              <h2 className="text-balance text-2xl font-extrabold uppercase tracking-tight text-foreground md:text-3xl">Company Profile</h2>
              <div className="mt-6 flex max-w-prose flex-col gap-5 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
                <p>
                  {siteConfig.name} has supplied fasteners and marine rigging hardware from Dubai since{" "}
                  {siteConfig.founded} &mdash; serving the Automotive, Manufacturing, Marine and Oilfield industries with
                  the same commitment to quality and service that built our name.
                </p>
                <p>
                  {siteConfig.itemsInStock} items in ready stock at competitive pricing, updated regularly to meet
                  demand, backed by a trusted supplier network for anything we don&rsquo;t hold on the shelf.
                </p>
              </div>
              <Link
                href="/contact"
                className="group relative mt-8 inline-flex h-13 items-center overflow-hidden rounded-lg btn-primary px-8 text-sm"
              >
                <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Get In Touch</span>
                <span className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-md bg-white/15 transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
                  <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-5 md:mt-28 md:gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 90} className="h-full">
              <div className="card-premium flex h-full flex-col items-center justify-center gap-3 p-5 text-center sm:p-8 md:p-10">
                <stat.icon className="size-7 text-accent" aria-hidden="true" />
                <p className="text-2xl font-extrabold text-primary sm:text-3xl md:text-4xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} duration={1800} />
                </p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground sm:text-xs">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-20 md:mt-28">
          <div className="card-premium grid gap-8 p-8 sm:p-10 md:grid-cols-2 md:p-12">
            <div>
              <p className="eyebrow">Leadership</p>
              <h2 className="mt-3 text-2xl font-extrabold uppercase tracking-tight text-foreground">{contactInfo.managingDirector.name}</h2>
              <p className="mt-1 text-sm font-semibold text-accent">{contactInfo.managingDirector.role}</p>
              <p className="mt-4 max-w-prose text-sm leading-relaxed text-muted-foreground">
                Sabta Trading&rsquo;s sales team is reachable directly, no call centre, no waiting.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactInfo.contacts.map((c) => (
                <div key={c.name} className="rounded-xl border border-border bg-secondary p-5">
                  <p className="text-sm font-bold text-foreground">{c.name}</p>
                  <a href={c.phoneHref} className="mt-2 block text-sm text-muted-foreground hover:text-accent">
                    {c.phone}
                  </a>
                  <a href={`mailto:${c.email}`} className="mt-1 block text-sm text-muted-foreground hover:text-accent">
                    {c.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Industries />
      <CtaBanner />
    </>
  )
}

