import type { InputHTMLAttributes, ReactNode } from "react"

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode
  infoText?: string
  testId?: string
}

export function Checkbox({ label, infoText, testId, className = "", id, name, ...props }: CheckboxProps) {
  const fallbackId = typeof label === "string" ? label.toLowerCase().replace(/[^a-z0-9]+/g, "-") : "checkbox"
  const inputId = id || name || fallbackId

  return (
    <label className={["ds-checkbox", className].filter(Boolean).join(" ")} htmlFor={inputId}>
      <input
        {...props}
        id={inputId}
        name={name || inputId}
        type="checkbox"
        data-testid={testId}
        className="ds-checkbox__input"
      />
      <span className="ds-checkbox__box" aria-hidden="true" />
      <span className="ds-checkbox__content">
        <span className="ds-checkbox__label">{label}</span>
        {infoText ? <span className="ds-checkbox__support">{infoText}</span> : null}
      </span>
    </label>
  )
}
