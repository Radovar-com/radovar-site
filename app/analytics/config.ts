import sdkManifest from "../../public/analytics/manifest.json" with { type: "json" };

// Activation and the exact CSP collector allowlist ship together. The shared
// collector accepts https://radovar.com; www redirects there before hydration.
export const analyticsCollectorOrigin = "https://hvevaxsfeyiikjhcsafi.supabase.co";
export const analyticsConfig = Object.freeze({ enabled: true, baseUrl: `${analyticsCollectorOrigin}/functions/v1/website-analytics/v1`, pageVersion: "radovar_site_20261022" });
type AnalyticsConfig = { enabled: boolean; baseUrl: string; pageVersion: string };
const disabledConfig = Object.freeze({ ...analyticsConfig, enabled: false, baseUrl: "" });
const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

// A production flag must never turn a localhost/Pages preview into production
// telemetry. The only override is a loopback collector on a loopback page.
export function resolveAnalyticsConfig(location: { hostname: string; protocol: string }, override?: AnalyticsConfig): AnalyticsConfig {
  if (location.hostname === "radovar.com" && location.protocol === "https:") return analyticsConfig;
  if (loopbackHosts.has(location.hostname) && override) {
    if (override.enabled === false) return Object.freeze({ ...override, baseUrl: "" });
    try {
      const endpoint = new URL(override.baseUrl);
      // The unchanged shared SDK permits HTTP localhost/IPv4, not HTTP IPv6.
      if (endpoint.protocol === "http:" && endpoint.hostname === "[::1]") return disabledConfig;
      if (override.enabled === true && ["http:", "https:"].includes(endpoint.protocol) && loopbackHosts.has(endpoint.hostname) && !endpoint.username && !endpoint.password && !endpoint.search && !endpoint.hash) return override;
    } catch { /* Invalid test endpoints stay disabled. */ }
  }
  return disabledConfig;
}
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
  setConsent(choice: { websiteAnalytics: boolean }): Promise<void>;
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
