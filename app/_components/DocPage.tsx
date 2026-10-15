import type { ReactNode } from "react"
import Image from "next/image"
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

/** The supporting pages share the same reading measure and quiet paper layout. */
export function DocPage({ kicker, title, intro, updated, children }: Props) {
  return (
    <>
      <SiteHeader />
      <main className="shell docWrap docPage" id="top">
        <header className="docHead" data-analytics-section="intro">
          <div className="docPage__heading">
            <p className="eyebrow">{kicker}</p>
            <h1>{title}</h1>
            <p className="docIntro">{intro}</p>
            {updated ? <p className="docMeta">Last updated {updated}</p> : null}
          </div>
          <div className="docPage__detail" aria-hidden="true">
            <Image
              src={`${process.env.BASE_PATH || ""}/media/radovar-atelier-pine-v3.webp`}
              alt=""
              fill
              sizes="(max-width: 540px) 60px, (max-width: 760px) 96px, 172px"
              loading="lazy"
            />
          </div>
        </header>
        <article className="doc docPage__body" data-analytics-section="resources">{children}</article>
      </main>
      <SiteFooter />
    </>
  )
}
