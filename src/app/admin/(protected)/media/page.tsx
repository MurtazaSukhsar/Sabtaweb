import type { Metadata } from "next"
import { listMediaImages } from "@/lib/media"
import { MediaLibrary } from "@/components/admin/media-library"

export const metadata: Metadata = {
  title: "Media Library",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminMediaPage() {
  const images = await listMediaImages()

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Media Library</h1>
        <p className="mt-1 text-sm text-muted-foreground">Browse, upload and remove general site imagery.</p>
      </div>
      <div className="mt-8">
        <MediaLibrary initialImages={images} />
      </div>
    </div>
  )
}
