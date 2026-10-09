import Link from "next/link";
import Image from "next/image";
import { LandscapeScene } from "./LandscapeScene";

const columns = [
  { title: "Product", links: [{ href: "https://codevalanche.com", label: "Codevalanche" }, { href: "/docs/", label: "Product guide" }, { href: "/changelog/", label: "Changelog" }, { href: "/releases/", label: "Release archive" }] },
  { title: "Company", links: [{ href: "/#company", label: "About Radovar" }, { href: "/press/", label: "Press" }, { href: "/security/", label: "Security" }, { href: "mailto:info@radovar.com", label: "Contact" }] },
  { title: "Legal", links: [{ href: "/privacy/", label: "Privacy" }, { href: "/terms/", label: "Terms" }] },
];

export function SiteFooter() {
  return (
    <footer className="footer scenic-footer">
      <LandscapeScene variant="footer" />
      <div className="shell scenic-footer__content">
        <div className="scenic-footer__top">
          <div className="footer__brand">
            <Link className="wordmark" href="/" aria-label="Radovar home"><Image className="radovar-logo" src={`${process.env.BASE_PATH || ""}/radovar-logo.svg`} alt="Radovar" width={1184} height={230} /></Link>
            <p>Good ideas deserve<br />a conversation.</p>
            <a className="footer__mail" href="mailto:info@radovar.com">info@radovar.com <span aria-hidden="true">↗</span></a>
          </div>
          <div className="scenic-footer__navigation">
            {columns.map((column) => <nav key={column.title} className="footer__col" aria-labelledby={`footer-${column.title}`}><h2 id={`footer-${column.title}`}>{column.title}</h2><ul>{column.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul></nav>)}
          </div>
        </div>
        <div className="scenic-footer__message"><span>A world of possibilities.</span><p>Let’s build<br />something useful.</p></div>
        <div className="scenic-footer__base"><span>© 2026 Radovar</span><span>Codevalanche, a product by Radovar.</span><a href="#top">Back to top ↑</a></div>
      </div>
    </footer>
  );
}
