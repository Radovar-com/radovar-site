"use client"

import type { ButtonHTMLAttributes } from "react"
import { useEffect, useId, useMemo, useRef, useState } from "react"

type DropdownOption = string | {
  label: string
  value: string
  description?: string
}

type NormalizedDropdownOption = {
  label: string
  value: string
  description?: string
}

type DropdownChangeEvent = {
  target: {
    name: string
    value: string
  }
}

type DropdownProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onChange" | "onSelect" | "value"> & {
  label: string
  name?: string
  placeholder?: string
  options: readonly DropdownOption[]
  value?: string
  defaultValue?: string
  selectedValues?: string[]
  infoText?: string
  errorMessage?: string
  hint?: string
  error?: string
  readOnly?: boolean
  fullWidth?: boolean
  testId?: string
  selectionMode?: "single" | "multiple"
  confirmLabel?: string
  sheetTitle?: string
  sheetSubtitle?: string
  closeLabel?: string
  onSelect?: (value: string) => void
  onSelectionChange?: (values: string[]) => void
  onChange?: (event: DropdownChangeEvent) => void
}

export function Dropdown({
  label,
  name,
  placeholder = "Select an option",
  options,
  value,
  defaultValue = "",
  selectedValues,
  infoText,
  errorMessage,
  hint,
  error,
  readOnly = false,
  fullWidth = true,
  testId,
  selectionMode = "single",
  confirmLabel = "Confirm",
  sheetTitle,
  sheetSubtitle,
  closeLabel = "Close",
  disabled,
  className = "",
  id,
  onSelect,
  onSelectionChange,
  onChange,
  ...props
}: DropdownProps) {
  const generatedId = useId()
  const fieldId = id || name || `dropdown-${generatedId}`
  const fieldName = name || fieldId
  const [open, setOpen] = useState(false)
  const normalizedOptions = useMemo(() => normalizeDropdownOptions(options), [options])
  const resolvedSelectionMode = selectionMode === "multiple" ? "multiple" : "single"
  const normalizedSelectionFromProps = useMemo(
    () => normalizeDropdownSelection({
      options: normalizedOptions,
      value: value ?? defaultValue,
      selectedValues,
      selectionMode: resolvedSelectionMode,
    }),
    [defaultValue, normalizedOptions, resolvedSelectionMode, selectedValues, value],
  )
  const isControlled = resolvedSelectionMode === "multiple" ? Array.isArray(selectedValues) : typeof value === "string"
  const [uncontrolledSelection, setUncontrolledSelection] = useState<string[]>(normalizedSelectionFromProps)
  const committedSelection = isControlled ? normalizedSelectionFromProps : uncontrolledSelection
  const [draftSelection, setDraftSelection] = useState<string[]>(committedSelection)
  const selectedValue = committedSelection[0] || ""
  const currentText = formatDropdownDisplayValue({ selection: committedSelection, options: normalizedOptions, placeholder })
  const resolvedInfoText = infoText ?? hint
  const resolvedErrorMessage =
    typeof errorMessage === "string" && errorMessage.trim() ? errorMessage : typeof error === "string" && error.trim() ? error : ""
  const hasError = resolvedErrorMessage.length > 0
  const interactive = !disabled && !readOnly
  const firstOptionRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!isControlled) {
      setUncontrolledSelection(normalizedSelectionFromProps)
    }
  }, [isControlled, normalizedSelectionFromProps])

  useEffect(() => {
    if (!open) {
      return
    }

    setDraftSelection(committedSelection)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSurface()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    window.requestAnimationFrame(() => firstOptionRef.current?.focus())

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [committedSelection, open])

  const closeSurface = () => {
    setDraftSelection(committedSelection)
    setOpen(false)
  }

  const toggleOpen = () => {
    if (!interactive) {
      return
    }
    setDraftSelection(committedSelection)
    setOpen((current) => !current)
  }

  const handleOptionToggle = (nextValue: string) => {
    if (!interactive) {
      return
    }
    setDraftSelection((currentSelection) => toggleDropdownSelection(currentSelection, nextValue, resolvedSelectionMode))
  }

  const handleConfirm = () => {
    if (!interactive) {
      return
    }
    if (!isControlled) {
      setUncontrolledSelection(draftSelection)
    }
    onSelectionChange?.(draftSelection)
    if (resolvedSelectionMode === "single") {
      onSelect?.(draftSelection[0] || "")
    }
    onChange?.({ target: { name: fieldName, value: resolvedSelectionMode === "single" ? draftSelection[0] || "" : draftSelection.join(",") } })
    setOpen(false)
  }

  return (
    <div className={["ds-field", "ds-dropdown__surface", fullWidth ? "ds-field--full" : ""].filter(Boolean).join(" ")} data-state={disabled ? "disabled" : readOnly ? "readonly" : hasError ? "error" : committedSelection.length > 0 ? "filled" : "default"}>
      <span id={`${fieldId}-label`} className="ds-field__label">{label}</span>
      <button
        {...props}
        id={fieldId}
        type="button"
        data-testid={testId}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={interactive ? open : false}
        aria-readonly={readOnly || undefined}
        aria-invalid={hasError || undefined}
        aria-labelledby={`${fieldId}-label ${fieldId}-value`}
        className={["ds-field__input", "ds-dropdown__trigger", hasError ? "ds-field__input--error" : "", className].filter(Boolean).join(" ")}
        onClick={toggleOpen}
      >
        <span
          id={`${fieldId}-value`}
          className={committedSelection.length > 0 ? "ds-dropdown__value" : "ds-dropdown__value ds-dropdown__value--placeholder"}
        >
          {currentText}
        </span>
        <span className={open ? "ds-dropdown__chevron ds-dropdown__chevron--open" : "ds-dropdown__chevron"} aria-hidden="true">
          v
        </span>
      </button>
      <input type="hidden" name={fieldName} value={selectedValue} />
      {resolvedErrorMessage ? <span className="ds-field__support ds-field__support--error">{resolvedErrorMessage}</span> : null}
      {!resolvedErrorMessage && resolvedInfoText ? <span className="ds-field__support">{resolvedInfoText}</span> : null}

      {open ? (
        <div className="ds-dropdown__overlay" role="presentation" onMouseDown={closeSurface}>
          <div
            className="ds-dropdown__sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${fieldId}-sheet-title`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="ds-dropdown__sheet-header">
              <span id={`${fieldId}-sheet-title`} className="ds-dropdown__sheet-title">
                {sheetTitle || label}
              </span>
              <button type="button" className="ds-dropdown__close" aria-label={closeLabel} onClick={closeSurface}>
                x
              </button>
            </div>
            {sheetSubtitle || resolvedInfoText ? <p className="ds-dropdown__sheet-subtitle">{sheetSubtitle || resolvedInfoText}</p> : null}
            <div className="ds-dropdown__list" role="listbox" aria-labelledby={`${fieldId}-label`} aria-multiselectable={resolvedSelectionMode === "multiple" || undefined}>
              {normalizedOptions.map((option, index) => {
                const selected = draftSelection.includes(option.value)
                return (
                  <button
                    key={option.value}
                    ref={index === 0 ? firstOptionRef : undefined}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={selected ? "ds-dropdown__option ds-dropdown__option--selected" : "ds-dropdown__option"}
                    onClick={() => handleOptionToggle(option.value)}
                  >
                    <span>
                      <span className="ds-dropdown__option-label">{option.label}</span>
                      {option.description ? <span className="ds-dropdown__option-description">{option.description}</span> : null}
                    </span>
                    {selected ? <span className="ds-dropdown__check" aria-hidden="true">*</span> : null}
                  </button>
                )
              })}
            </div>
            <div className="ds-dropdown__footer">
              <button type="button" className="ds-button ds-button--primary ds-dropdown__confirm" onClick={handleConfirm}>
                {confirmLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function normalizeDropdownOptions(options: readonly DropdownOption[]): NormalizedDropdownOption[] {
  return options.map((option) =>
    typeof option === "string" ? { label: option, value: option } : { label: option.label, value: option.value, description: option.description },
  )
}

function normalizeDropdownSelection(input: {
  options: NormalizedDropdownOption[]
  value?: string
  selectedValues?: string[]
  selectionMode: "single" | "multiple"
}): string[] {
  const allowedValues = new Set(input.options.map((option) => option.value))
  if (input.selectionMode === "multiple") {
    return (input.selectedValues || []).filter((nextValue) => allowedValues.has(nextValue))
  }
  return input.value && allowedValues.has(input.value) ? [input.value] : []
}

function toggleDropdownSelection(
  currentSelection: string[],
  nextValue: string,
  selectionMode: "single" | "multiple",
) {
  if (selectionMode === "single") {
    return [nextValue]
  }
  return currentSelection.includes(nextValue)
    ? currentSelection.filter((currentValue) => currentValue !== nextValue)
    : [...currentSelection, nextValue]
}

function formatDropdownDisplayValue(input: {
  selection: string[]
  options: NormalizedDropdownOption[]
  placeholder: string
}) {
  if (input.selection.length === 0) {
    return input.placeholder
  }
  const optionLabels = new Map(input.options.map((option) => [option.value, option.label]))
  return input.selection.map((value) => optionLabels.get(value) || value).join(", ")
}
