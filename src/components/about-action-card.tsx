"use client"

import { useRouter } from "next/navigation"
import { InteractiveTravelCard } from "@/components/ui/interactive-travel-card"

// Server components (about/page.tsx included) can't pass a function prop
// straight to a client component, so this small wrapper owns the click
// handler locally and just forwards everything else through unchanged.
// Reused for every tilt card on the About page (hero teaser, Company
// Profile, Founder) — one small client boundary instead of three.
export function AboutActionCard({
  title,
  subtitle,
  imageUrl,
  actionText,
  href,
}: {
  title: string
  subtitle: string
  imageUrl: string
  actionText: string
  href: string
}) {
  const router = useRouter()

  return (
    <InteractiveTravelCard
      title={title}
      subtitle={subtitle}
      imageUrl={imageUrl}
      actionText={actionText}
      href={href}
      onActionClick={() => router.push(href)}
    />
  )
}
