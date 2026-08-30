import type { Metadata } from "next"
import Link from "next/link"
import {
  FolderTree,
  HelpCircle,
  Images,
  Newspaper,
  Package,
  Phone,
  Plus,
  Star,
  Type,
} from "lucide-react"
import { getAllCategoriesWithItems, getCategories, getFaqs } from "@/lib/db"
import { readAllPosts } from "@/lib/blog"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
}

export const dynamic = "force-dynamic"

const quickActions = [
  { href: "/admin/products/new", label: "Add a product", description: "List a new item in the catalogue.", icon: Plus },
  { href: "/admin/blog/new", label: "Write a blog post", description: "Publish a new buying guide or article.", icon: Newspaper },
  { href: "/admin/content", label: "Edit hero & page text", description: "Update chatbot copy and testimonials.", icon: Type },
  { href: "/admin/site", label: "Contact details & images", description: "Company profile and sales contacts.", icon: Phone },
  { href: "/admin/media", label: "Manage images", description: "Browse and upload site imagery.", icon: Images },
]

export default async function AdminDashboardHome() {
  const [categoriesWithItems, categories, faqs, posts] = await Promise.all([
    getAllCategoriesWithItems(),
    getCategories(),
    getFaqs(),
    readAllPosts(),
  ])

  const totalProducts = categoriesWithItems.reduce((sum, c) => sum + c.items.length, 0)
  const featuredCount = categoriesWithItems.reduce(
    (sum, c) => sum + c.items.filter((i) => i.featured).length,
    0,
  )

  const stats = [
    { label: "Products", value: totalProducts, icon: Package },
    { label: "Categories", value: categories.length, icon: FolderTree },
    { label: "Featured", value: featuredCount, icon: Star },
    { label: "FAQs", value: faqs.length, icon: HelpCircle },
    { label: "Blog Posts", value: posts.length, icon: Newspaper },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-tight text-foreground">Sabta Trading Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your product catalogue, categories, settings, and website contents.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="card-premium flex flex-col gap-3 p-5">
            <stat.icon className="size-5 text-accent" aria-hidden="true" />
            <div>
              <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="card-premium flex items-start gap-4 p-5 transition-colors hover:border-accent/40"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
              <action.icon className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">{action.label}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
