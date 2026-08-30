"use client"

import { useEffect, useLayoutEffect, useState } from "react"
import Image from "next/image"

const DURATION_MS = 2200

export function LoadingScreen() {
  const [pct, setPct] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [skip, setSkip] = useState(false)

  // Runs before paint so a returning visitor (same tab session) never sees
  // the boot animation flash in.
  useLayoutEffect(() => {
    if (sessionStorage.getItem("sabta-loaded")) {
      setSkip(true)
      setHidden(true)
    }
  }, [])

  useEffect(() => {
    if (skip) return

    const start = performance.now()
    let raf = 0

    function tick(now: number) {
      const t = Math.min(1, (now - start) / DURATION_MS)
      const eased = t < 0.55 ? 1.55 * t - 0.55 * t * t : 0.715 + 0.285 * Math.pow((t - 0.55) / 0.45, 1.7)
      setPct(Math.min(100, Math.round(eased * 100)))

      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setExiting(true)
        setTimeout(() => {
          setHidden(true)
          try {
            sessionStorage.setItem("sabta-loaded", "1")
          } catch {
            // Private-mode browsers can refuse storage; the event below still
            // fires, so the hero reveal is not blocked by this.
          }
          // Let the hero (and anything else waiting on first paint) start its
          // entrance now that the loader is actually out of the way.
          window.dispatchEvent(new Event("sabta:loaded"))
        }, 700)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [skip])

  return (
    <div id="sabta-loader" data-hidden={hidden} aria-hidden="true">
      <div className="sabta-loader-bg-top" />
      <div className="sabta-loader-pool-a" />
      <div className="sabta-loader-pool-b" />
      <div className="sabta-loader-bg-overlay" />

      <div className="sabta-loader-stage" data-exit={exiting}>
        <div className="sabta-loader-logo">
          <div className="sabta-loader-logo-wipe">
            <Image src="/brand/logo.png" alt="Sabta Trading Co. L.L.C." width={620} height={202} priority unoptimized style={{ height: "auto" }} className="block w-full" />
          </div>
        </div>

        <div className="sabta-loader-progress">
          <div className="sabta-loader-track">
            <div className="sabta-loader-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="sabta-loader-text">
            <span>Loading</span>
            <span className="sabta-loader-divider" />
            <span className="sabta-loader-pct">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="sabta-loader-caption">
        <span>Sabta Trading Co. L.L.C.</span>
      </div>
    </div>
  )
}
