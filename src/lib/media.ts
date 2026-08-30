// Read-only listing for the admin Media Library. Scoped deliberately to the
// generic "sabta-media" folder (Cloudinary) / public/media (local fallback)
// — NOT product photos — so deleting an image here can never break a live
// product page. Uploads/deletes are Server Actions in app/admin/actions.ts.

import fs from "fs"
import path from "path"
import { v2 as cloudinary } from "cloudinary"

const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export type MediaImage = {
  url: string
  publicId?: string
  createdAt?: string
}

export async function listMediaImages(): Promise<MediaImage[]> {
  if (isCloudinaryConfigured) {
    try {
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: "sabta-media/",
        max_results: 200,
      })
      return (result.resources || [])
        .map((r: any) => ({ url: r.secure_url as string, publicId: r.public_id as string, createdAt: r.created_at as string }))
        .sort((a: MediaImage, b: MediaImage) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1))
    } catch (err) {
      console.error("Cloudinary media listing failed:", err)
      return []
    }
  }

  const dir = path.join(process.cwd(), "public", "media")
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(webp|png|jpe?g|gif|svg)$/i.test(entry.name))
    .map((entry) => {
      const stat = fs.statSync(path.join(dir, entry.name))
      return { url: `/media/${entry.name}`, createdAt: stat.mtime.toISOString() }
    })
    .sort((a, b) => ((a.createdAt ?? "") < (b.createdAt ?? "") ? 1 : -1))
}
