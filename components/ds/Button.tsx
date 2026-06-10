import type { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonSize = "default" | "small" | "sm" | "md" | "lg"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "text"
  size?: ButtonSize
  fullWidth?: boolean
  testId?: string
  children: ReactNode
}

function normalizeButtonSize(size: ButtonSize) {
  return size === "small" || size === "sm" ? "small" : "default"
}

export function Button({ variant = "primary", size = "default", fullWidth = false, testId, className = "", children, ...props }: ButtonProps) {
  const normalizedSize = normalizeButtonSize(size)
  return (
    <button
      {...props}
      data-ds-button=""
      data-variant={variant}
      data-testid={testId}
      className={["ds-button", `ds-button--${variant}`, normalizedSize === "small" ? "ds-button--small" : "", fullWidth ? "ds-button--full" : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </button>
  )
}
