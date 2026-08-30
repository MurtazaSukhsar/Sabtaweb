"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface ImgStackProps {
  images: string[]
  dismissedCount: number
}

export default function ImgStack({ images, dismissedCount }: ImgStackProps) {
  return (
    <div className="relative flex items-center justify-center w-[290px] h-[380px] min-[360px]:w-[340px] min-[360px]:h-[440px] sm:w-[400px] sm:h-[520px]">
      {images.map((src, index) => {
        const relativeIndex = index - dismissedCount
        const isDismissed = relativeIndex < 0

        // Stack positioning for visible cards
        const offsetIncrement = -14
        const verticalOffset = -10
        const baseRotation = 2
        const rotationIncrement = 3

        // Shift all cards right by half the total spread so the deck
        // is visually centred inside its container on all screen sizes.
        const totalCards = images.length
        const centerOffset = ((totalCards - 1) * Math.abs(offsetIncrement)) / 2

        const x = isDismissed ? -450 : relativeIndex * offsetIncrement + centerOffset
        const y = isDismissed ? -80 : relativeIndex * verticalOffset
        const rotate = isDismissed
          ? -35
          : relativeIndex === 0
          ? 0
          : -(baseRotation + relativeIndex * rotationIncrement)
        const opacity = isDismissed ? 0 : 1
        const zIndex = isDismissed ? 0 : 50 - relativeIndex * 10

        return (
          <motion.div
            key={index}
            className="absolute w-[185px] min-[360px]:w-[220px] sm:w-[280px] lg:w-[320px] overflow-hidden rounded-xl shadow-xl bg-white border border-gray-100"
            style={{
              zIndex,
              aspectRatio: "3/5",
            }}
            animate={{ x, y, rotate, opacity }}
            transition={{
              duration: isDismissed ? 0.45 : 0.5,
              ease: isDismissed ? [0.36, 0, 0.66, -0.4] : "easeOut",
            }}
          >
            <Image
              src={src}
              alt={`Featured product ${index + 1}`}
              fill
              className="object-contain p-5 rounded-lg pointer-events-none"
              sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
              draggable={false}
              priority={index < 3}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
