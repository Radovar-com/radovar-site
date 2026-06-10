import type { InputHTMLAttributes } from "react"

type DatePickerProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  infoText?: string
  helperText?: string
  hint?: string
  errorMessage?: string
  error?: string | boolean
  minDate?: string
  maxDate?: string
  fullWidth?: boolean
  testId?: string
}

export function DatePicker({ label, name, value, infoText, helperText, hint, errorMessage, error, minDate, maxDate, fullWidth = true, testId, className = "", id, ...props }: DatePickerProps) {
  const fieldId = id || name || label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const supportId = `${fieldId}-support`
  const valueProps = value !== undefined ? { value } : {}
  const resolvedInfoText = infoText ?? helperText ?? hint
  const resolvedErrorMessage =
    typeof errorMessage === "string" && errorMessage.trim() ? errorMessage : typeof error === "string" && error.trim() ? error : ""
  const hasError = Boolean(resolvedErrorMessage || error === true)
  const supportText = resolvedErrorMessage || resolvedInfoText
  const minValue = minDate ?? props.min
  const maxValue = maxDate ?? props.max

  return (
    <div className={["ds-field", fullWidth ? "ds-field--full" : ""].filter(Boolean).join(" ")} data-state={props.disabled ? "disabled" : props.readOnly ? "readonly" : hasError ? "error" : "default"}>
      <label className="ds-field__label" htmlFor={fieldId}>{label}</label>
      <input
        {...props}
        {...valueProps}
        id={fieldId}
        name={name || fieldId}
        type="date"
        min={minValue}
        max={maxValue}
        data-testid={testId}
        aria-invalid={hasError || undefined}
        aria-describedby={supportText ? supportId : undefined}
        className={["ds-field__input", className].filter(Boolean).join(" ")}
      />
      {resolvedErrorMessage ? <span id={supportId} className="ds-field__message ds-field__message--error">{resolvedErrorMessage}</span> : null}
      {!resolvedErrorMessage && resolvedInfoText ? <span id={supportId} className="ds-field__message">{resolvedInfoText}</span> : null}
    </div>
  )
}
