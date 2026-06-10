import type { HTMLAttributes, ReactNode } from "react"

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string
  description?: string
  className?: string
  testId?: string
  children: ReactNode
}

export function Card({ title, description, className = "", testId, children, ...props }: CardProps) {
  return (
    <section {...props} className={["ds-card", className].filter(Boolean).join(" ")} data-testid={testId}>
      {title ? <h3 className="ds-card__title">{title}</h3> : null}
      {description ? <p className="ds-card__description">{description}</p> : null}
      <div className="ds-card__body">{children}</div>
    </section>
  )
}
