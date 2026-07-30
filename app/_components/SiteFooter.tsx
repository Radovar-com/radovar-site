import Link from "next/link"
/* Column taxonomy follows the pattern shared by Antigravity, Cursor and
   Lovable: Product / Company / Legal, with legal split out rather than
   buried in a company list. Column titles are real headings. */
const COLUMNS = [
  {
    title: "Product",
    links: [
      { href: "/#creator", label: "Creator" },
      { href: "/docs/", label: "Docs" },
      { href: "/changelog/", label: "Changelog" },
      { href: "/releases/", label: "Releases" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/#company", label: "About" },
      { href: "/press/", label: "Press" },
      { href: "/security/", label: "Security" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy/", label: "Privacy" },
      { href: "/terms/", label: "Terms" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="wordmark">Radovar</span>
            <p className="footer__line">
              Local-first AI. Your code stays on your machine.
            </p>
            <a className="footer__mail" href="mailto:info@radovar.com">info@radovar.com</a>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} className="footer__col" aria-labelledby={`f-${col.title}`}>
              <h2 className="footer__colTitle" id={`f-${col.title}`}>{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="footer__base">
          <span>Radovar</span>
          <span>Creator is in early access.</span>
        </div>
      </div>
    </footer>
  )
}
