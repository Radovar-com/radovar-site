import Link from "next/link"
const NAV = [
  { href: "/#creator", label: "Creator" },
  { href: "/docs/", label: "Docs" },
  { href: "/#company", label: "Company" },
]

export function SiteHeader() {
  return (
    <header className="nav">
      <div className="shell nav__inner">
        <Link className="wordmark" href="/">Radovar</Link>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href}>{item.label}</Link>
          ))}
        </nav>

        <a className="btn btn--ghost btn--sm nav__cta" href="mailto:info@radovar.com">
          Contact us
        </a>

        {/* Narrow viewports: native disclosure, no JavaScript. */}
        <details className="nav__menu">
          <summary className="nav__toggle" aria-label="Open menu">
            <span className="nav__bars" aria-hidden="true">
              <span /><span /><span />
            </span>
            Menu
          </summary>
          <nav className="nav__panel" aria-label="Primary">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href}>{item.label}</Link>
            ))}
            <a href="mailto:info@radovar.com">Contact us</a>
          </nav>
        </details>
      </div>
    </header>
  )
}
