type ProgressProps = {
  label?: string
  value: number
  max?: number
  showValue?: boolean
  className?: string
}

export function Progress({ label = "Progress", value, max = 100, showValue = true, className = "" }: ProgressProps) {
  const safeMax = max > 0 ? max : 100
  const clampedValue = Math.min(Math.max(value, 0), safeMax)
  const percent = Math.round((clampedValue / safeMax) * 100)

  return (
    <section className={["ds-progress", className].filter(Boolean).join(" ")} aria-label={label}>
      <div className="ds-progress__header">
        <span>{label}</span>
        {showValue ? <span>{percent}%</span> : null}
      </div>
      <progress className="ds-progress__track" value={clampedValue} max={safeMax} aria-label={label} />
    </section>
  )
}
