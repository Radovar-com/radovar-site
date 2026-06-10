import type { ReactNode } from "react"

type StatusTone = "info" | "success" | "warning" | "error"

type StatusProps = {
  tone?: StatusTone | string
  className?: string
  children: ReactNode
}

export function Status({ tone = "info", className = "", children }: StatusProps) {
  const normalizedTone: StatusTone = tone === "success" || tone === "warning" || tone === "error" ? tone : "info"
  return <span className={["ds-status", `ds-status--${normalizedTone}`, className].filter(Boolean).join(" ")}>{children}</span>
}
