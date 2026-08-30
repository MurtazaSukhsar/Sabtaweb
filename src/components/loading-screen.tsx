"use client"

import { useEffect, useLayoutEffect, useState, useRef } from "react"
import Image from "next/image"

export function LoadingScreen() {
  const [pct, setPct] = useState(0)
  const [exiting, setExiting] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [skip, setSkip] = useState(false)

  const isFullyLoadedRef = useRef(false)
  const progressTargetRef = useRef(15)

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

    let isMounted = true

    // Check DOM, Images, Video, Fonts readiness
    const checkAssets = () => {
      if (!isMounted) return

      const images = Array.from(document.images)
      const video = document.querySelector("video")

      let totalCount = 1 + images.length + (video ? 1 : 0)
      let loadedCount = document.readyState === "complete" ? 1 : 0

      images.forEach((img) => {
        if (img.complete && img.naturalWidth > 0) {
          loadedCount++
        }
      })

      if (video) {
        if (video.readyState >= 3) {
          loadedCount++
        }
      }

      const ratio = loadedCount / Math.max(1, totalCount)
      const target = Math.min(95, Math.round(ratio * 95))

      if (target > progressTargetRef.current) {
        progressTargetRef.current = target
      }

      // Check if all DOM & critical media are 100% complete
      const isDomComplete = document.readyState === "complete"
      const isImagesComplete = images.every((img) => img.complete)
      const isVideoReady = !video || video.readyState >= 2

      if (isDomComplete && isImagesComplete && isVideoReady) {
        isFullyLoadedRef.current = true
        progressTargetRef.current = 100
      }
    }

    // Attach listeners
    const handleLoad = () => checkAssets()
    window.addEventListener("load", handleLoad)
    document.addEventListener("readystatechange", handleLoad)

    const videoEl = document.querySelector("video")
    if (videoEl) {
      videoEl.addEventListener("canplay", handleLoad)
      videoEl.addEventListener("loadeddata", handleLoad)
    }

    const interval = setInterval(checkAssets, 150)

    // Safety timeout: Ensure page opens after 6s even on super slow network
    const maxTimeout = setTimeout(() => {
      isFullyLoadedRef.current = true
      progressTargetRef.current = 100
    }, 6000)

    // Smooth progress animation tick
    let currentDisplayPct = 0
    let raf = 0

    function tick() {
      const targetPct = progressTargetRef.current

      if (currentDisplayPct < targetPct) {
        // Smoothly step towards target percentage
        const step = isFullyLoadedRef.current ? 4 : 2
        currentDisplayPct = Math.min(targetPct, currentDisplayPct + step)
        setPct(currentDisplayPct)
        raf = requestAnimationFrame(tick)
      } else if (currentDisplayPct >= 100 && isFullyLoadedRef.current) {
        setPct(100)
        setExiting(true)
        setTimeout(() => {
          if (!isMounted) return
          setHidden(true)
          try {
            sessionStorage.setItem("sabta-loaded", "1")
          } catch {
            // Private mode storage fallback
          }
          window.dispatchEvent(new Event("sabta:loaded"))
        }, 600)
      } else {
        raf = requestAnimationFrame(tick)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      isMounted = false
      clearInterval(interval)
      clearTimeout(maxTimeout)
      cancelAnimationFrame(raf)
      window.removeEventListener("load", handleLoad)
      document.removeEventListener("readystatechange", handleLoad)
      if (videoEl) {
        videoEl.removeEventListener("canplay", handleLoad)
        videoEl.removeEventListener("loadeddata", handleLoad)
      }
    }
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
            <span>Loading Experience</span>
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
