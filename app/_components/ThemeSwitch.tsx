"use client";

import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "radovar-theme";

function storedTheme(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function applyTheme(next: Theme) {
  document.documentElement.dataset.theme = next;
  document
    .querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]')
    .forEach((meta) => {
      meta.content = next === "dark" ? "#121b17" : "#faf9f5";
    });
}

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const preference = useRef<Theme | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const next = preference.current ?? (media.matches ? "dark" : "light");
      applyTheme(next);
      setTheme(next);
    };
    preference.current = storedTheme();
    apply();
    const syncStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        preference.current = storedTheme();
        apply();
      }
    };
    media.addEventListener("change", apply);
    window.addEventListener("storage", syncStorage);
    return () => {
      media.removeEventListener("change", apply);
      window.removeEventListener("storage", syncStorage);
    };
  }, []);

  function select(next: Theme) {
    preference.current = next;
    applyTheme(next);
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The control still works when browser storage is unavailable.
    }
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => select(theme === "dark" ? "light" : "dark")}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        {theme === "dark" ? <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></> : <path d="M20.9 13.1A9 9 0 0 1 10.9 3a9 9 0 1 0 10 10.1Z" />}
      </svg>
    </button>
  );
}
