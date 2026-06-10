"use client"

import { useState, type ReactNode } from "react"

type ModalProps = {
  title: string
  triggerLabel: string
  confirmLabel?: string
  cancelLabel?: string
  defaultOpen?: boolean
  children: ReactNode
}

export function Modal({ title, triggerLabel, confirmLabel = "Confirm", cancelLabel = "Cancel", defaultOpen = false, children }: ModalProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <>
      <button type="button" className="ds-button ds-button--primary" onClick={() => setOpen(true)}>{triggerLabel}</button>
      {open ? (
        <div className="ds-modal__overlay" role="presentation">
          <section className="ds-modal" role="dialog" aria-modal="true" aria-labelledby="ds-modal-title">
            <h2 id="ds-modal-title" className="ds-modal__title">{title}</h2>
            <div className="ds-modal__body">{children}</div>
            <div className="ds-modal__actions">
              <button type="button" className="ds-button ds-button--secondary" onClick={() => setOpen(false)}>{cancelLabel}</button>
              <button type="button" className="ds-button ds-button--primary" onClick={() => setOpen(false)}>{confirmLabel}</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
