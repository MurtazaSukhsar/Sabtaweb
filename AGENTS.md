<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Custom Repository Guidelines & Design Rules

This repository contains custom styling and structural changes requested by the user. Subsequent agent sessions (Claude, Gemini, etc.) **must not revert or overwrite** these changes:

## 1. Featured Products Section
* **File**: `src/components/home/featured-products.tsx`
* **Rules**:
  * The main section heading must remain centered and styled as a large, black title:
    `text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-wider text-black`
  * The heading text must read: `Featured Products`
  * Do **NOT** restore the `"Built to Last. Sourced to Spec."` subtitle line.
  * Do **NOT** restore the `"View All Products"` link line.
  * Product cards must be displayed in a **horizontally scrollable row** (`overflow-x-auto snap-x snap-mandatory`), NOT as a stacked ImgStack.
  * Each card uses `w-72 sm:w-80 lg:w-96` for large sizing with a `aspect-[4/3]` image area.
  * Do **NOT** revert to the ImgStack stacked card component.

## 2. Brand Logo Size
* **File**: `src/components/site-header.tsx`
* **Rules**:
  * The brand logo image in the main navigation header must use the increased, prominent dimensions:
    * **Scrolled state**: `h-[46px] sm:h-[54px] md:h-[62px]`
    * **Default (unscrolled) state**: `h-[58px] sm:h-[70px] md:h-[84px]`
  * Do **NOT** revert these values to smaller/default dimensions.

## 3. Product Usage & Technical Details
* **File**: `src/app/products/[category]/[slug]/page.tsx`
* **Rules**:
  * The dynamic content generator `getProductUsageData` must remain active and rendered below the main product specifications table.
  * This section renders visual bullet points for **Usage & Applications**, **Key Features**, and **Industries Served** badges based on product categories and names. Do **NOT** remove or comment this block out.

