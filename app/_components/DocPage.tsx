import type { ReactNode } from "react"
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"

type Props = {
  kicker: string
  title: string
  intro: string
  updated?: string
  children: ReactNode
}

/** Shared shell for every long-form page, so Security reads like Terms reads
 *  like Docs. One measure, one heading scale, one rhythm. */
export function DocPage({ kicker, title, intro, updated, children }: Props) {
  return (
    <>
      <SiteHeader />
      <main className="shell docWrap" id="top">
        <header className="docHead">
          <p className="eyebrow">{kicker}</p>
          <h1>{title}</h1>
          <p className="docIntro">{intro}</p>
          {updated ? <p className="docMeta">Last updated {updated}</p> : null}
        </header>
        <div className="doc">{children}</div>
      </main>
      <SiteFooter />
    </>
  )
}
