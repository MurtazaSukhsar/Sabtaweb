import type { Metadata } from "next"
import Link from "next/link"
import { getAllCategoriesWithItems } from "@/lib/db"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Products",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const categories = await getAllCategoriesWithItems()
  const totalProducts = categories.reduce((sum, c) => sum + c.items.length, 0)

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Products ({totalProducts})</h1>
          <p className="mt-1 text-sm text-muted-foreground">Drag rows to reorder items within a range.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex h-11 items-center rounded-lg btn-primary px-5 text-sm font-bold">
          Add Product
        </Link>
      </div>

      <div className="mt-8">
        <AdminDashboard categories={categories} />
      </div>
    </div>
  )
}
