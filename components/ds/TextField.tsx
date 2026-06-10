import type { InputHTMLAttributes } from "react"

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  infoText?: string
  helperText?: string
  hint?: string
  errorMessage?: string
  error?: string | boolean
  inputType?: string
  fullWidth?: boolean
  testId?: string
}

export function TextField({
  label,
  infoText,
  helperText,
  hint,
  errorMessage,
  error,
  inputType,
  fullWidth = true,
  testId,
  className = "",
  id,
  name,
  type,
  ...props
}: TextFieldProps) {
  const inputId = id || name || label.toLowerCase().replace(/[^a-z0-9]+/g, "-")
  const supportId = `${inputId}-support`
  const resolvedInfoText = infoText ?? helperText ?? hint
  const resolvedErrorMessage =
    typeof errorMessage === "string" && errorMessage.trim() ? errorMessage : typeof error === "string" && error.trim() ? error : ""
  const hasError = Boolean(resolvedErrorMessage || error === true)
  const supportText = resolvedErrorMessage || resolvedInfoText
  const resolvedType = type || inputType || "text"

  return (
    <div className={["ds-field", fullWidth ? "ds-field--full" : ""].filter(Boolean).join(" ")} data-state={props.disabled ? "disabled" : props.readOnly ? "readonly" : hasError ? "error" : "default"}>
      <label className="ds-field__label" htmlFor={inputId}>{label}</label>
      <input
        {...props}
        id={inputId}
        name={name || inputId}
        type={resolvedType}
        aria-invalid={hasError || undefined}
        aria-describedby={supportText ? supportId : undefined}
        data-testid={testId}
        className={["ds-field__input", hasError ? "ds-field__input--error" : "", className].filter(Boolean).join(" ")}
      />
      {resolvedErrorMessage ? <span id={supportId} className="ds-field__support ds-field__support--error">{resolvedErrorMessage}</span> : null}
      {!resolvedErrorMessage && resolvedInfoText ? <span id={supportId} className="ds-field__support">{resolvedInfoText}</span> : null}
    </div>
  )
}
