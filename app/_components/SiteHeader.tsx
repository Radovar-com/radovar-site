"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitch } from "./ThemeSwitch";

const NAV = [
  { id: "home", href: "/#codevalanche", label: "Product" },
  { id: "docs", href: "/docs/", label: "Docs" },
  { id: "home", href: "/#company", label: "Company" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [hash, setHash] = useState("");
  const menu = useRef<HTMLDetailsElement>(null);

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
    return pathname.replace(/\/$/, "") === href.replace(/\/$/, "")
      ? "page"
      : undefined;
  };

  return (
    <header className="nav">
      <div className="shell nav__inner">
        <Link className="wordmark" href="/" aria-label="Radovar home" data-analytics-action="header" data-analytics-target="home" data-analytics-placement="header">
          <Image
            className="radovar-logo"
            src={`${process.env.BASE_PATH || ""}/radovar-logo.svg`}
            alt="Radovar"
            width={1184}
            height={230}
            priority
          />
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
        <div className="nav__actions">
          <ThemeSwitch />
        </div>
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
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
