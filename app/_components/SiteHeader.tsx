"use client";

import Link from "next/link";
import { RadovarBrand } from "./RadovarBrand";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const NAV: { id?: string; href: string; label: string }[] = [
  { id: "codevalanche", href: "/codevalanche/", label: "Codevalanche" },
  { id: "company", href: "/company/", label: "Company" },
  { href: "/research/", label: "Research" },
  { id: "press", href: "/press/", label: "Updates" },
  { id: "docs", href: "/docs/", label: "Docs" },
];
const PRODUCT = "https://codevalanche.com";

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const [compact, setCompact] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const scrollMarker = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const marker = scrollMarker.current;
    if (!marker || !window.IntersectionObserver) return;
    const observer = new IntersectionObserver(([entry]) => {
      setCompact(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    observer.observe(marker);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const syncHash = () => setHash(window.location.hash);
    const closeOutside = (event: PointerEvent) => {
      if (menu.current && !menu.current.contains(event.target as Node))
        menu.current.open = false;
    };
    syncHash();
    window.addEventListener("hashchange", syncHash);
    document.addEventListener("pointerdown", closeOutside);
    return () => {
      window.removeEventListener("hashchange", syncHash);
      document.removeEventListener("pointerdown", closeOutside);
    };
  }, [pathname]);

  const current = (href: string): "page" | "location" | undefined => {
    if (href.includes("#"))
      return pathname === "/" && hash === href.slice(1)
        ? "location"
        : undefined;
    const path = pathname.replace(/\/$/, "");
    const target = href.replace(/\/$/, "");
    if (path === target) return "page";
    // An article inside a section keeps that section marked in the header.
    return target === "/research" && path.startsWith("/research/") ? "location" : undefined;
  };

  return (
    <>
    <span className="nav-scroll-marker" ref={scrollMarker} aria-hidden="true" />
    <header className="nav" data-compact={compact ? "true" : "false"}>
      <div className="shell nav__inner">
        <Link className="wordmark header-brand" href="/" aria-label="Radovar home" data-analytics-action="header" data-analytics-target="home" data-analytics-placement="header">
          <RadovarBrand />
        </Link>
        <nav className="nav__links" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-analytics-action={item.href.includes("#") ? "anchor" : "header"}
              data-analytics-target={item.id}
              data-analytics-placement="header"
              aria-current={current(item.href)}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="nav__cta" href={PRODUCT} data-analytics-action="product" data-analytics-placement="header" data-analytics-section-id="codevalanche">codevalanche.com</a>
        <details
          className="nav__menu"
          ref={menu}
          onKeyDown={(event) => {
            if (event.key === "Escape" && menu.current?.open) {
              menu.current.open = false;
              menu.current.querySelector("summary")?.focus();
            }
          }}
        >
          <summary className="nav__toggle" aria-label="Open menu">
            <span className="nav__bars" aria-hidden="true">
              <span />
              <span />
            </span>
            Menu
          </summary>
          <nav
            className="nav__panel"
            aria-label="Mobile primary"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a") && menu.current)
                menu.current.open = false;
            }}
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-analytics-action={item.href.includes("#") ? "anchor" : "header"}
                data-analytics-target={item.id}
                data-analytics-placement="header"
                aria-current={current(item.href)}
              >
                {item.label}
              </Link>
            ))}
            <a className="nav__mobile-product" href={PRODUCT} data-analytics-action="product" data-analytics-placement="header" data-analytics-section-id="codevalanche">codevalanche.com</a>
          </nav>
        </details>
      </div>
    </header>
    </>
  );
}
