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
    <div className="theme-switch" role="group" aria-label="Color theme">
      {(["light", "dark"] as const).map((value) => (
        <button
          key={value}
          type="button"
          data-theme-choice={value}
          aria-pressed={theme === value}
          onClick={() => select(value)}
        >
          {value === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
