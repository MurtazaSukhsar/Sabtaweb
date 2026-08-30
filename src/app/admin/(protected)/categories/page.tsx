import type { Metadata } from "next"
import { getCategories } from "@/lib/db"
import { CategoryEditor } from "@/components/admin/category-editor"

export const metadata: Metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

export default async function AdminCategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-6xl">
      <CategoryEditor initialCategories={categories} />
    </div>
  )
}
