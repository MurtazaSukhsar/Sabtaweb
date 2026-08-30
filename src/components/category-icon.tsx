import { Anchor, Cog, Disc, Hexagon, Layers, Link2, Pin, Wrench, CircleDot } from "lucide-react"
import type { CategoryMeta } from "@/lib/site-data"

const iconMap: Record<CategoryMeta["icon"], typeof Anchor> = {
  clamp: CircleDot,
  band: Layers,
  rigging: Link2,
  marine: Anchor,
  pin: Pin,
  bolt: Cog,
  nut: Hexagon,
  washer: Disc,
  misc: Wrench,
}

export function CategoryIcon({ icon, className }: { icon: CategoryMeta["icon"]; className?: string }) {
  const Icon = iconMap[icon]
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />
}
