import type { ReactNode } from "react"

type AlertTone = "info" | "success" | "warning" | "error"

type AlertProps = {
  tone?: AlertTone | string
  title?: string
  className?: string
  children: ReactNode
}

export function Alert({ tone = "info", title, className = "", children }: AlertProps) {
  const normalizedTone: AlertTone = tone === "success" || tone === "warning" || tone === "error" ? tone : "info"
  const role = normalizedTone === "warning" || normalizedTone === "error" ? "alert" : "status"
  return (
    <section className={["ds-alert", `ds-alert--${normalizedTone}`, className].filter(Boolean).join(" ")} role={role}>
      {title ? <strong className="ds-alert__title">{title}</strong> : null}
      <div className="ds-alert__body">{children}</div>
    </section>
  )
}
