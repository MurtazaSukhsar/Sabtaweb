"use client"

import { useEffect } from "react"
import { useLenis } from "lenis/react"

// Shared across every overlay that needs to lock page scroll (chatbot,
// quote drawer, catalog lightbox, …) so simultaneous locks compose
// correctly instead of stomping on each other.
//
// Before this, each overlay set document.body.style.overflow directly and
// restored it independently on close. That breaks the moment two overlays
// are open at once: e.g. open the quote drawer, then open the chatbot
// (which snapshots body.style.overflow as "hidden", since the drawer is
// already locking it), then close the drawer (resets overflow to ""), then
// close the chatbot — its cleanup "restores" overflow to the "hidden" value
// it snapshotted on open, and nothing ever sets it back. The page is left
// permanently unable to scroll (mouse wheel does nothing) until reload.
// A reference count fixes that regardless of open/close order.
let lockCount = 0
let previousOverflow = ""

function lockBody() {
  if (lockCount === 0) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
  }
  lockCount++
}

function unlockBody() {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) {
    document.body.style.overflow = previousOverflow
  }
}

/**
 * Locks page scroll while `isLocked` is true. Also pauses/resumes Lenis's
 * own smooth-scroll loop (via lenis.stop()/start()) so the native overflow
 * lock and Lenis's virtual scroll never disagree about whether the page is
 * scrollable — Lenis manages scrolling itself, so toggling body overflow
 * alone doesn't reliably stop it from processing wheel input.
 */
export function useScrollLock(isLocked: boolean) {
  const lenis = useLenis()

  useEffect(() => {
    if (!isLocked) return
    lockBody()
    lenis?.stop()
    return () => {
      unlockBody()
      if (lockCount === 0) lenis?.start()
    }
  }, [isLocked, lenis])
}
