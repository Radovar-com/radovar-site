import sdkManifest from "../../public/analytics/manifest.json" with { type: "json" };

// Activation is a separate, qualified release operation. No relative collector URL.
export const analyticsConfig = Object.freeze({ enabled: false, baseUrl: "", pageVersion: "radovar_site_20261016" });
export const analyticsAsset = `${process.env.BASE_PATH || ""}/analytics/owned-analytics.js?v=${sdkManifest.sha256}`;
const pages: Record<string, string> = { "/": "home", "/docs": "docs", "/security": "security", "/privacy": "privacy", "/terms": "terms", "/press": "press", "/releases": "releases_archive", "/changelog": "changelog_archive", "/codevalanche": "codevalanche", "/company": "company", "/research": "research", "/research/wave-ai": "research_wave_ai" };
export function analyticsPageId(pathname: string) {
  const base = process.env.BASE_PATH || "";
  const path = base && (pathname === base || pathname.startsWith(base + "/")) ? pathname.slice(base.length) : pathname;
  return pages[path.replace(/\/$/, "") || "/"] ?? "not_found";
}
export type ConsentState = { websiteAnalytics: boolean; accountAnalytics: boolean; state: string; generation: number };
export type ConsentManager = {
  getState(): ConsentState;
  subscribe(listener: (state: ConsentState) => void): () => void;
  getCollectionContext(options: { touchActivity: boolean }): unknown;
  acceptAck(...args: unknown[]): boolean;
  dispose(): void;
};
export type AnalyticsClient = {
  consentManager: ConsentManager;
  setConsent(choice: { websiteAnalytics: boolean }): Promise<void>;
  startPage(options: { pageId: string; navigationType: string }): { observeSection(element: Element, options: { sectionId: string }): void };
  track(name: string, properties: Record<string, string | boolean>): unknown;
  flush(reason?: string): Promise<void>;
  dispose(): void;
};
export type AnalyticsRuntime = {
  consentManager: ConsentManager;
  setConsent(choice: { websiteAnalytics: boolean }): Promise<void>;
  flush(): Promise<void>;
  status(): "not_configured" | "ready" | "unavailable" | "disabled";
  readonly pageId: string;
};
export type AnalyticsSDK = {
  createConsentManager(options: Record<string, unknown>): ConsentManager;
  createConsentTransport(options: { baseUrl: string }): unknown;
  createAnalyticsClient(options: Record<string, unknown>): AnalyticsClient;
};
declare global {
  interface Window {
    __RADOVAR_ANALYTICS_TEST_CONFIG__?: { enabled: boolean; baseUrl: string; pageVersion: string };
    RadovarAnalytics?: AnalyticsRuntime;
  }
}

// Semantic actions only; the optional analytics leaf may not be loaded yet.
export function trackFeature(featureId: string) {
  window.dispatchEvent(new CustomEvent("radovar:feature", { detail: featureId }));
}
