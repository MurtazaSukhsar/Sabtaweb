"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react"
import { useScrollLock } from "@/lib/use-scroll-lock"

export function CatalogGallery({ images, categoryName }: { images: { page: number; src: string }[]; categoryName: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useScrollLock(openIndex !== null)

  useEffect(() => {
    if (openIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenIndex(null)
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : Math.min(images.length - 1, i + 1)))
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : Math.max(0, i - 1)))
    }
    document.addEventListener("keydown", onKey)
    closeButtonRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
    }
  }, [openIndex, images.length])

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          <button
            key={img.page}
            type="button"
            onClick={() => setOpenIndex(i)}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
          >
            <Image
              src={img.src}
              alt={`${categoryName} catalogue page ${img.page}`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-primary/70 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs font-bold text-white">Page {img.page}</span>
              <ZoomIn className="size-4 text-white" aria-hidden="true" />
            </div>
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setOpenIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${categoryName} catalogue viewer`}
        >
          <button
            ref={closeButtonRef}
            type="button"
            onClick={() => setOpenIndex(null)}
            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          {openIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((i) => (i === null ? i : Math.max(0, i - 1)))
              }}
              className="absolute left-3 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
              aria-label="Previous page"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
          )}

          <div className="relative aspect-[3/4] max-h-[85vh] w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Image
              src={images[openIndex].src}
              alt={`${categoryName} catalogue page ${images[openIndex].page}`}
              fill
              sizes="90vw"
              className="rounded-lg object-contain"
              priority
            />
          </div>

          {openIndex < images.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                setOpenIndex((i) => (i === null ? i : Math.min(images.length - 1, i + 1)))
              }}
              className="absolute right-3 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
              aria-label="Next page"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          )}

          <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs font-semibold uppercase tracking-wider text-white/70">
            Page {images[openIndex].page} of catalogue &middot; {openIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  )
}
