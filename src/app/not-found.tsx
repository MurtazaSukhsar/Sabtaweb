import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <p className="eyebrow">404</p>
      <h1 className="section-heading">Page not found</h1>
      <p className="section-subheading">The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className="group relative inline-flex h-12 items-center overflow-hidden rounded-lg btn-primary px-7 text-sm">
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Back to Home</span>
          <span className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-md bg-white/15 transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        </Link>
        <Link href="/products" className="group relative inline-flex h-12 items-center overflow-hidden rounded-lg btn-secondary px-7 text-sm">
          <span className="mr-8 transition-opacity duration-500 group-hover:opacity-0">Browse Products</span>
          <span className="absolute bottom-1 right-1 top-1 z-10 grid w-1/4 place-items-center rounded-md bg-primary/10 transition-all duration-500 group-hover:w-[calc(100%-0.5rem)] group-active:scale-95">
            <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        </Link>
      </div>
    </div>
  )
}
