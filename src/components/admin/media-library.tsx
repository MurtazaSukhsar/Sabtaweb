"use client"

import { useRef, useState, useTransition } from "react"
import Image from "next/image"
import { Copy, ImageUp, Trash2 } from "lucide-react"
import { deleteMediaAction, uploadMediaAction } from "@/app/admin/actions"
import type { MediaImage } from "@/lib/media"

export function MediaLibrary({ initialImages }: { initialImages: MediaImage[] }) {
  const [images, setImages] = useState(initialImages)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File | null) {
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const result = await uploadMediaAction(file)
      setImages((prev) => [{ url: result.url, publicId: result.publicId, createdAt: new Date().toISOString() }, ...prev])
    } catch (err: any) {
      setError(err.message || "Failed to upload image.")
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  function handleDelete(image: MediaImage) {
    if (!confirm("Delete this image? This cannot be undone.")) return
    setImages((prev) => prev.filter((i) => i.url !== image.url))
    startTransition(async () => {
      try {
        await deleteMediaAction({ url: image.url, publicId: image.publicId })
      } catch (err: any) {
        setError(err.message || "Failed to delete image.")
      }
    })
  }

  function handleCopy(url: string) {
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 1500)
    })
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div>
      )}

      <div className="card-premium flex items-center justify-between gap-4 p-5">
        <div>
          <h3 className="text-sm font-bold uppercase text-foreground">Site Imagery</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Upload images for blog covers and general page use. Product photos are managed from each product&apos;s edit page.
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files?.[0] ?? null)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-lg btn-primary px-5 text-sm font-bold"
        >
          <ImageUp className="size-4" /> {uploading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {images.length === 0 ? (
        <div className="card-premium p-10 text-center text-sm text-muted-foreground">
          No images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.url} className="card-premium group relative overflow-hidden p-0">
              <div className="relative aspect-square w-full bg-white">
                <Image src={image.url} alt="" fill sizes="200px" className="object-contain p-2" />
              </div>
              <div className="flex items-center justify-between gap-2 border-t border-border p-2">
                <button
                  type="button"
                  onClick={() => handleCopy(image.url)}
                  className="inline-flex h-8 flex-1 items-center justify-center gap-1 rounded-lg border border-input text-[11px] font-bold text-muted-foreground hover:border-accent hover:text-accent"
                >
                  <Copy className="size-3.5" /> {copiedUrl === image.url ? "Copied!" : "Copy URL"}
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDelete(image)}
                  className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-input text-muted-foreground hover:border-red-300 hover:text-red-600"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
