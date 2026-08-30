import type { Metadata } from "next"
import { requireAdmin } from "@/lib/auth"
import { getCategories } from "@/lib/db"
import { ProductForm } from "@/components/admin/product-form"
import { createProductAction } from "@/app/admin/actions"

export const metadata: Metadata = {
  title: "Add Product",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function NewProductPage() {
  await requireAdmin()
  const categories = await getCategories()
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:px-8">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Add Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">This will appear on the site immediately.</p>
      <div className="mt-8">
        <ProductForm categories={categories} action={createProductAction} />
      </div>
    </div>
  )
}
