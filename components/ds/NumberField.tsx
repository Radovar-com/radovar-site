import type { InputHTMLAttributes } from "react"

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string
  infoText?: string
  helperText?: string
  hint?: string
  errorMessage?: string
  step?: number | string
  fullWidth?: boolean
  testId?: string
}

export function NumberField({ label, infoText, helperText, hint, errorMessage, fullWidth = true, testId, id, name, className = "", ...props }: NumberFieldProps) {
  const fieldId = id || name || label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const supportId = `${fieldId}-support`
  const hasError = Boolean(errorMessage)
  const resolvedInfoText = infoText ?? helperText ?? hint
  const supportText = errorMessage || resolvedInfoText

  return (
    <div className={["ds-field", fullWidth ? "ds-field--full" : ""].filter(Boolean).join(" ")} data-state={hasError ? "error" : props.disabled ? "disabled" : "default"}>
      <label className="ds-field__label" htmlFor={fieldId}>{label}</label>
      <input
        {...props}
        id={fieldId}
        name={name || fieldId}
        type="number"
        data-testid={testId}
        aria-invalid={hasError || undefined}
        aria-describedby={supportText ? supportId : undefined}
        className={["ds-field__input", hasError ? "ds-field__input--error" : "", className].filter(Boolean).join(" ")}
      />
      {errorMessage ? <span id={supportId} className="ds-field__support ds-field__support--error">{errorMessage}</span> : null}
      {!errorMessage && resolvedInfoText ? <span id={supportId} className="ds-field__support">{resolvedInfoText}</span> : null}
    </div>
  )
}
