"use client"

import { useMemo, useState, type ReactNode } from "react"

type TabItem = {
  label: string
  value: string
  content: ReactNode
}

type TabsProps = {
  tabs: TabItem[]
  defaultValue?: string
  ariaLabel?: string
  children?: ReactNode
}

export function Tabs({ tabs, defaultValue, ariaLabel = "Sections", children }: TabsProps) {
  const fallbackValue = tabs[0]?.value ?? ""
  const [selected, setSelected] = useState(defaultValue || fallbackValue)
  const activeTab = useMemo(() => tabs.find((tab) => tab.value === selected) ?? tabs[0], [selected, tabs])

  return (
    <section className="ds-tabs">
      <div className="ds-tabs__list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <button key={tab.value} type="button" role="tab" aria-selected={tab.value === activeTab?.value} className="ds-tabs__tab" onClick={() => setSelected(tab.value)}>
            {tab.label}
          </button>
        ))}
      </div>
      <div className="ds-tabs__panel" role="tabpanel">{activeTab?.content}</div>
      {children ? <div className="ds-tabs__content">{children}</div> : null}
    </section>
  )
}
