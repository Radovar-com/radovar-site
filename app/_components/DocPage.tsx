import { Children, cloneElement, isValidElement, type ReactNode } from "react"
import { SiteHeader } from "./SiteHeader"
import { SiteFooter } from "./SiteFooter"
import "../content.css"

type Props = {
  kicker: string
  title: string
  intro: string
  updated?: string
  children: ReactNode
}

function headingText(node: ReactNode): string {
  return Children.toArray(node).map(child => {
    if (typeof child === "string" || typeof child === "number") return String(child)
    return isValidElement<{ children?: ReactNode }>(child) ? headingText(child.props.children) : ""
  }).join("")
}

/** Readable source content, with native page navigation and no client dependency. */
export function DocPage({ kicker, title, intro, updated, children }: Props) {
  const headings: { id: string; title: string }[] = []
  const content = Children.toArray(children).map(child => {
    if (!isValidElement<{ id?: string; children?: ReactNode; tabIndex?: number }>(child) || child.type !== "h2") return child
    const text = headingText(child.props.children)
    const id = child.props.id || `article-${text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
    headings.push({ id, title: text })
    return cloneElement(child, { id, tabIndex: -1 })
  })
  return (
    <>
      <SiteHeader />
      <main tabIndex={-1} className="shell docWrap docPage" id="top">
        <header className="docHead" data-analytics-section="intro">
          <div className="docPage__heading">
            <p className="eyebrow">{kicker}</p>
            <h1>{title}</h1>
            <p className="docIntro">{intro}</p>
            {updated ? <p className="docMeta">Last updated {updated}</p> : null}
          </div>
        </header>
        <div className="docPage__layout">
          {headings.length ? <nav className="docPage__contents" aria-label="On this page"><p>On this page</p><ol>{headings.map(heading => <li key={heading.id}><a href={`#${heading.id}`} data-analytics-action="anchor" data-analytics-target="current" data-analytics-placement="resources">{heading.title}</a></li>)}</ol></nav> : null}
          <article className="doc docPage__body" data-analytics-section="resources">{content}</article>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}
