import { cn } from "@/lib/utils"

export interface TestimonialAuthor {
  name: string
  role?: string
  company?: string
  avatar?: string
}

export interface TestimonialCardProps {
  author: TestimonialAuthor
  text: string
  href?: string
}

export function TestimonialCard({ author, text, href }: TestimonialCardProps) {
  const CardWrapper = href ? "a" : "div"

  return (
    <CardWrapper
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "flex w-[300px] sm:w-[350px] shrink-0 flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-accent/30 hover:shadow-md",
        href && "cursor-pointer"
      )}
    >
      <blockquote className="text-sm leading-relaxed text-muted-foreground">
        &ldquo;{text}&rdquo;
      </blockquote>
      <div className="mt-5 flex flex-col">
        <cite className="not-italic text-sm font-bold text-foreground">
          {author.name}
        </cite>
        {(author.role || author.company) && (
          <span className="text-xs text-muted-foreground mt-0.5">
            {[author.role, author.company].filter(Boolean).join(", ")}
          </span>
        )}
      </div>
    </CardWrapper>
  )
}
