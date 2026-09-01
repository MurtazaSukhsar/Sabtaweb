// Shown instantly by Next.js the moment a link is clicked, while the
// destination route's server data streams in — this is what makes a
// navigation feel immediate instead of "frozen" for however long the
// fetch takes. Kept intentionally light (no images, no motion libraries)
// so it never itself becomes something slow to paint.
export function RouteLoading({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex min-h-[70dvh] w-full flex-col items-center justify-center gap-4 px-4">
      <span
        className="size-9 animate-spin rounded-full border-[3px] border-border border-t-accent"
        aria-hidden="true"
      />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
    </div>
  )
}
