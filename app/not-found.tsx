import Link from "next/link"
import type { Metadata } from "next"
import { SiteHeader } from "./_components/SiteHeader"
import { SiteFooter } from "./_components/SiteFooter"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main tabIndex={-1} className="shell notFound" id="top" data-analytics-section="intro">
        <h1>That page is not here.</h1>
        <p>
          The link may be out of date, or the address slightly off. The footer below has
          everything Radovar publishes.
        </p>
        <Link className="action-link action-link--primary" href="/" data-analytics-action="anchor" data-analytics-target="home" data-analytics-placement="inline">
          Back to the home page
        </Link>
      </main>
      <SiteFooter />
    </>
  )
}
