"use client"

import * as React from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TiltImageProps {
  children: React.ReactNode
  className?: string
}

/**
 * Wraps an image container with the same 3D tilt-on-hover interaction as
 * InteractiveTravelCard (mouse position drives rotateX/rotateY via a
 * spring) but with no title/subtitle/button chrome — just the tilt.
 */
export function TiltImage({ children, className }: TiltImageProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springConfig = { damping: 15, stiffness: 150 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)
  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const { width, height, left, top } = rect
    const xPct = (e.clientX - left) / width - 0.5
    const yPct = (e.clientY - top) / height - 0.5
    mouseX.set(xPct)
    mouseY.set(yPct)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div style={{ perspective: "1200px" }} className={className}>
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("h-full w-full transition-shadow duration-300 hover:shadow-2xl")}
      >
        {children}
      </motion.div>
    </div>
  )
}
