"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsAsset, analyticsPageId, resolveAnalyticsConfig, type AnalyticsSDK, type AnalyticsClient, type AnalyticsRuntime } from "../analytics/config";
import { CookiePreferences } from "./CookiePreferences";

/** Optional leaf: rejected loading/bootstrap never rejects the ordinary UI module graph. */
export function AnalyticsProvider() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);
  return hydrated ? <AnalyticsLeaf /> : null;
}

function AnalyticsLeaf() {
  const pathname = usePathname();
  const latestPath = useRef(pathname);
  const navigate = useRef<((path: string) => void) | null>(null);
  const [runtime, setRuntime] = useState<AnalyticsRuntime | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    latestPath.current = pathname;
    // Next can synchronously render during its popstate handler. Observe the committed
    // route after all handlers have had the chance to mark browser traversal.
    const task = window.setTimeout(() => navigate.current?.(pathname), 0);
    return () => window.clearTimeout(task);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | undefined;
    void (async () => {
      // Runtime public asset import remains outside the Next/core component module graph.
      const sdk = await import(/* webpackIgnore: true */ `${analyticsAsset.replace("owned-analytics.js", "consent-manager.js")}`) as AnalyticsSDK;
      if (cancelled) return;
      const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
      const config = resolveAnalyticsConfig(location, window.__RADOVAR_ANALYTICS_TEST_CONFIG__);
      // Keep invalid optional bootstrap isolated even when collection stays lazy.
      if (!/^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$/.test(config.pageVersion)) throw new Error("Invalid analytics page version");
      let baseUrl = "";
      try {
        const url = new URL(config.baseUrl);
        const localCollector = local && url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
        if (config.enabled === true && (url.protocol === "https:" || localCollector) && !url.username && !url.password && !url.search && !url.hash) baseUrl = url.href.replace(/\/$/, "");
      } catch { /* Disabled configuration has no collector. */ }
      let storage: Storage | Pick<Storage, "getItem" | "setItem" | "removeItem">;
      try { storage = window.localStorage; } catch { storage = { getItem: () => null, setItem: () => { throw new Error("Storage unavailable"); }, removeItem: () => {} }; }
      const host = { localStorage: storage, document, location, crypto: window.crypto, BroadcastChannel: window.BroadcastChannel, addEventListener: window.addEventListener.bind(window), removeEventListener: window.removeEventListener.bind(window) };
      const manager = sdk.createConsentManager({ siteId: "radovar", window: host, transport: baseUrl ? sdk.createConsentTransport({ baseUrl }) : {} });
      let client: AnalyticsClient | undefined;
      let loading: Promise<void> | undefined;
      let pageId = "", traversalPath = "", requested = -1;
      const ensureClient = () => {
        if (client || !baseUrl || !manager.getState().websiteAnalytics || cancelled) return Promise.resolve();
        return loading ??= (async () => {
          const optional = await import(/* webpackIgnore: true */ analyticsAsset) as AnalyticsSDK;
          if (cancelled || !manager.getState().websiteAnalytics) return;
          client = optional.createAnalyticsClient({ siteId: "radovar", baseUrl, pageVersion: config.pageVersion, consentManager: manager });
          start(latestPath.current, true);
        })().finally(() => { loading = undefined; });
      };
      const activeManager = baseUrl ? manager : { ...manager, getCollectionContext: () => null, acceptAck: () => false };
      const api: AnalyticsRuntime = {
        consentManager: activeManager,
        async setConsent(choice) { const operation = manager.setConsent(choice); requested = choice.websiteAnalytics ? activeManager.getState().generation : -1; await operation; await ensureClient(); },
        flush: async () => { await loading; await client?.flush(); },
        status: () => !baseUrl ? "not_configured" : activeManager.getCollectionContext({ touchActivity: false }) ? "ready" : activeManager.getState().websiteAnalytics || requested === activeManager.getState().generation ? "unavailable" : "disabled",
        get pageId() { return pageId; },
      };
      const start = (path: string, force = false) => {
        const next = analyticsPageId(path);
        if (!force && next === pageId) { traversalPath = ""; return; }
        const page = client?.startPage({ pageId: next, navigationType: force ? "initial" : pageId ? traversalPath && analyticsPageId(traversalPath) === next ? "back_forward" : "route" : "initial" });
        pageId = next; traversalPath = "";
        for (const element of document.querySelectorAll<HTMLElement>("[data-analytics-section]")) page?.observeSection(element, { sectionId: element.dataset.analyticsSection! });
      };
      const popstate = () => { traversalPath = location.pathname; };
      const feature = (event: Event) => { const id: unknown = (event as CustomEvent).detail; if (typeof id === "string" && ["project", "agents", "review"].includes(id)) client?.track("feature_selected", { feature_id: id, selection_id: id }); };
      const click = (event: MouseEvent) => {
        if (event.defaultPrevented || !(event.target instanceof Element)) return;
        const link = event.target.closest<HTMLElement>("[data-analytics-action]");
        if (!link) return;
        const data = link.dataset, placement = data.analyticsPlacement || "inline";
        if (data.analyticsAction === "product") client?.track("cta_clicked", { cta_id: ["header", "intro", "product_panel", "resources", "footer"].includes(placement) ? placement : "product", section_id: data.analyticsSectionId || "codevalanche", action_id: "product", placement });
        else if (data.analyticsAction === "contact") client?.track("contact_clicked", { contact_id: data.analyticsContact || "info", placement });
        else if (data.analyticsTarget && data.analyticsAction) client?.track("navigation_used", { navigation_id: data.analyticsAction, target_page_id: data.analyticsTarget === "current" ? pageId : data.analyticsTarget, placement });
      };
      const unsubscribe = manager.subscribe(() => { void ensureClient().catch(() => { if (!cancelled) setFailed(true); }); });
      try { start(latestPath.current); } catch (error) { unsubscribe(); client?.dispose(); manager.dispose(); throw error; }
      if (cancelled) { unsubscribe(); client?.dispose(); manager.dispose(); return; }
      navigate.current = start;
      // Record traversal for the deferred route observation; never patch History.
      window.addEventListener("popstate", popstate, true);
      window.addEventListener("radovar:feature", feature);
      // Capture explicit semantics before Next Link handles its ordinary client navigation.
      document.addEventListener("click", click, true);
      if (local) window.RadovarAnalytics = api; // Local harness handle; no identity or consent sharing across domains.
      teardown = () => { navigate.current = null; window.removeEventListener("popstate", popstate, true); window.removeEventListener("radovar:feature", feature); document.removeEventListener("click", click, true); if (window.RadovarAnalytics === api) delete window.RadovarAnalytics; unsubscribe(); client?.dispose(); manager.dispose(); };
      setRuntime(api);
      void ensureClient().catch(() => { if (!cancelled) setFailed(true); });
    })().catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; teardown?.(); };
  }, []);

  return <CookiePreferences runtime={runtime} failed={failed} />;
}
