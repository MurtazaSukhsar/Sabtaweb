"use client"

import { useEffect, useLayoutEffect, useState, useRef } from "react"
import Image from "next/image"

export function LoadingScreen() {
  const [pct, setPct] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [skip, setSkip] = useState(false)
  const isLoadedRef = useRef(false)

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

    // Track window / DOM load completion
    if (typeof window !== "undefined") {
      if (document.readyState === "complete") {
        isLoadedRef.current = true
      } else {
        const handleLoad = () => {
          isLoadedRef.current = true
        }
        window.addEventListener("load", handleLoad, { once: true })
      }
    }

    const start = performance.now()
    let raf = 0

    function tick(now: number) {
      const elapsed = now - start
      const isLoaded = isLoadedRef.current

      let currentPct = 0

      if (!isLoaded) {
        // While page is loading, progress smoothly up to 90%
        const simulatedT = Math.min(1, elapsed / 1800)
        currentPct = Math.min(90, Math.round(simulatedT * 90))
      } else {
        // Once page load completes, quickly finish from current % up to 100%
        const finishStart = start + 500
        const finishT = Math.min(1, Math.max(0, (now - finishStart) / 400))
        currentPct = Math.min(100, Math.round(90 + finishT * 10))

        // Also enforce minimum display time (800ms) so fast connections get a smooth transition
        if (elapsed < 800) {
          const minT = elapsed / 800
          currentPct = Math.min(100, Math.round(minT * 100))
        }
      }

      setPct(currentPct)

      if (currentPct < 100) {
        raf = requestAnimationFrame(tick)
      } else {
        // 100% reached & page ready -> trigger smooth curtain exit
        setExiting(true)
        setTimeout(() => {
          setHidden(true)
          try {
            sessionStorage.setItem("sabta-loaded", "1")
          } catch {
            // Private-mode browsers can refuse storage
          }
          // Let hero animations play now that loading curtain is removed
          window.dispatchEvent(new Event("sabta:loaded"))
        }, 600)
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
            <Image
              src="/brand/logo.png"
              alt="Sabta Trading Co. L.L.C."
              width={620}
              height={202}
              priority
              unoptimized
              style={{ height: "auto" }}
              className="block w-full"
            />
          </div>
        </div>

        <div className="sabta-loader-progress">
          <div className="sabta-loader-track">
            <div className="sabta-loader-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="sabta-loader-text">
            <span>Loading Assets</span>
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
