# Creator Intake: radovar-site

This document captures the creation-time product brief for the generated workspace.
It is not Tier 1 and it is not a duplicate implementation spec. Tier 2 source code remains the source of truth.

## Project Brief

No user brief was supplied at project creation. Treat the selected template as the initial product intent.

## Template Direction

- Template: `blank_next_app`
- Fidelity mode: `close`
- Direction: Enterprise web application starter for code-first generation and iterative refinement.
- Design system: Mobile First (`mobile-first`)
- Starter DS primitives: Button (button), Checkbox (checkbox), Text Field (text-field), Dropdown (dropdown), Number Field (number-field), Date Picker (date-picker)

## Generation Rules

- Generate reusable Next.js App Router files, not visual-only mocks.
- Use the workspace DS primitives before raw interactive HTML controls.
- Keep contracts and validation extractable from Tier 2 source code.
- Prefer small, reviewable files over one large generated page.
- Keep web and webview handoff in scope; native codegen stays out of MVP.

## Acceptance Gate

- Code can be inspected in Studio Code tab.
- Preview validates generated source code.
- Conformance report does not hide DS drift.
- Tier 1 report is extracted from source code, not authored separately.
- ZIP/export contains source files plus handoff artifacts.
