"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

type CharacterProps = {
  char: string
  index: number
  centerIndex: number
  scrollYProgress: any
}

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " "
  const distanceFromCenter = index - centerIndex

  const x = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 40, 0])
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [distanceFromCenter * 25, 0])

  return (
    <motion.span
      className={cn("inline-block text-orange-500", isSpace && "w-4")}
      style={{ x, rotateX }}
    >
      {char}
    </motion.span>
  )
}

export function ScrollRevealText() {
  const targetRef = useRef<HTMLDivElement | null>(null)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  })

  const text = "see more from "
  const characters = text.split("")
  const centerIndex = Math.floor(characters.length / 2)

  return (
    <div className="w-full bg-[#f5f4f3] relative">
      {/* Scroll Guide Indicator */}
      <div className="absolute top-8 left-1/2 z-10 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-[10px] uppercase font-bold tracking-wider leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:mt-2 after:h-16 after:w-px after:bg-gradient-to-b after:from-black after:to-transparent after:content-['']">
          Scroll to see more
        </span>
      </div>

      {/* Block 1 - text */}
      <div ref={targetRef} className="relative h-[150vh] w-full">
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden p-4">
          <div
            className="w-full max-w-4xl text-center text-6xl font-black uppercase tracking-tighter text-black"
            style={{ perspective: "1000px" }}
          >
            {characters.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
