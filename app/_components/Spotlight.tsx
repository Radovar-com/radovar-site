"use client"

import { useEffect, useRef } from "react"

/**
 * A soft light that follows the cursor across the parent surface.
 *
 * Writes to CSS custom properties through a ref, never through React state, so
 * pointer movement never re-renders the tree. Throttled to one write per frame.
 * Opts out entirely on touch and under reduced-motion.
 */
export function Spotlight() {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const host = el?.parentElement
    if (!el || !host) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const canHover = window.matchMedia("(hover: hover)").matches
    if (reduced || !canHover) return

    let frame = 0

    const onMove = (event: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const rect = host.getBoundingClientRect()
        el.style.setProperty("--mx", `${event.clientX - rect.left}px`)
        el.style.setProperty("--my", `${event.clientY - rect.top}px`)
      })
    }

    host.addEventListener("pointermove", onMove, { passive: true })
    return () => {
      host.removeEventListener("pointermove", onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <span ref={ref} className="block__spot" aria-hidden="true" />
}
