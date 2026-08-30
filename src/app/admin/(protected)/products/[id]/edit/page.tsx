import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireAdmin } from "@/lib/auth"
import { getCategories, getProductById } from "@/lib/db"
import { ProductForm } from "@/components/admin/product-form"
import { updateProductAction } from "@/app/admin/actions"

export const metadata: Metadata = {
  title: "Edit Product",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin()
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ])
  if (!product) notFound()

  const action = updateProductAction.bind(null, id)

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 md:px-8">
      <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Edit Product</h1>
      <p className="mt-1 text-sm text-muted-foreground">{product.name}</p>
      <div className="mt-8">
        <ProductForm categories={categories} product={product} action={action} />
      </div>
    </div>
  )
}
