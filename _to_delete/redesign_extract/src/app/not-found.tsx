import Link from "next/link"

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-24 text-center sm:py-32">
      <p className="eyebrow">404</p>
      <h1 className="section-heading">Page not found</h1>
      <p className="section-subheading">The page you&rsquo;re looking for doesn&rsquo;t exist or may have moved.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex h-12 items-center rounded-lg btn-primary px-7 text-sm">
          Back to Home
        </Link>
        <Link href="/products" className="inline-flex h-12 items-center rounded-lg btn-secondary px-7 text-sm">
          Browse Products
        </Link>
      </div>
    </div>
  )
}
