"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsPageId } from "../analytics/config";
import { countPage, referrerSource } from "../analytics/pageCounts";

/** Cookieless page counts; independent of the optional analytics and its consent. */
export function PageCounter() {
  const pathname = usePathname();
  const counted = useRef<string | null>(null);
  useEffect(() => {
    if (location.hostname !== "radovar.com" || counted.current === pathname) return;
    const first = counted.current === null;
    counted.current = pathname;
    if (first) {
      // A reload or back/forward is not a new page view.
      const type = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.type;
      if (type === "reload" || type === "back_forward") return;
    }
    countPage(pathname, analyticsPageId(pathname), first ? referrerSource(document.referrer, location.origin) : "internal");
  }, [pathname]);
  return null;
}
