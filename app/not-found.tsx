import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <header className="nav">
        <div className="shell nav__inner">
          <a className="wordmark" href="/">Radovar</a>
        </div>
      </header>

      <main className="shell notFound">
        <h1>That page is not here.</h1>
        <p>
          The link may be out of date, or the address slightly off. Everything Radovar
          publishes lives on the home page.
        </p>
        <a className="btn btn--primary" href="/">Back to the home page</a>
      </main>
    </>
  )
}
