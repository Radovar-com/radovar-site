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
      <main className="shell notFound" id="top">
        <h1>That page is not here.</h1>
        <p>
          The link may be out of date, or the address slightly off. The footer below has
          everything Radovar publishes.
        </p>
        <Link className="btn btn--primary" href="/">
          Back to the home page<span className="btn__arrow" aria-hidden="true">&rarr;</span>
        </Link>
      </main>
      <SiteFooter />
    </>
  )
}
