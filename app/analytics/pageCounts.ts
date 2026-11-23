// Cookieless daily page counts, shared with codevalanche.com (table
// public.site_page_counts): one number per day, page, metric, coarse source and
// language. Nothing identifying is sent or stored, so no consent is needed and
// it works whatever the visitor chose under Manage cookies. Global Privacy
// Control, Do Not Track and automated browsers are not counted.

// Public Supabase publishable key (same project as the collector); not a credential.
export const pageCountsKey = "sb_publishable_p8gw6zszkBJZhZp6Zz6TIw_TJpO9as-";
// Same origin as analyticsCollectorOrigin in config.ts, already allowed by the CSP connect-src.
export const pageCountsUrl = "https://hvevaxsfeyiikjhcsafi.supabase.co/rest/v1/rpc/count_site_page";

const SEARCH = /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|yandex\.[a-z]+|baidu\.com|ecosia\.org|search\.brave\.com|startpage\.com|qwant\.com)$/;
const SOCIAL = /(^|\.)(x\.com|t\.co|twitter\.com|linkedin\.com|lnkd\.in|facebook\.com|instagram\.com|reddit\.com|news\.ycombinator\.com|youtube\.com|tiktok\.com|threads\.net|bsky\.app|mastodon\.social|discord\.com|t\.me|whatsapp\.com)$/;
const AI = /(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|phind\.com|you\.com)$/;

export type Source = "direct" | "internal" | "search" | "social" | "github" | "ai" | "other";

/** Where the visitor came from, as one coarse bucket. The referrer itself is never sent. */
export function referrerSource(referrer: string, origin: string): Source {
  if (!referrer) return "direct";
  let url: URL;
  try { url = new URL(referrer); } catch { return "other"; }
  if (url.origin === origin) return "internal";
  const host = url.hostname.toLowerCase();
  if (host === "github.com" || host.endsWith(".github.com")) return "github";
  if (SEARCH.test(host)) return "search";
  if (SOCIAL.test(host)) return "social";
  if (AI.test(host)) return "ai";
  return "other";
}

/** Known pages keep their analytics id; press and research articles get one from their path. */
export function pageCountId(pathname: string, known: string): string {
  if (known !== "not_found") return known;
  const path = pathname.replace(/\/$/, "");
  const article = path.match(/^\/(press|research)\/([a-z0-9-]{1,30})$/);
  return article ? `${article[1]}_${article[2].replace(/-/g, "_")}` : "other";
}

type Host = {
  navigator: { globalPrivacyControl?: boolean; doNotTrack?: string | null; webdriver?: boolean };
  fetch: typeof fetch;
};

/**
 * Counts one page view, and one visit when the page was reached from outside the
 * site. `known` is the analytics page id ("not_found" when unknown); `source` is
 * "internal" for in-app route changes.
 */
export function countPage(pathname: string, known: string, source: Source, host: Host = window): string[] {
  try {
    const nav = host.navigator;
    if (nav.globalPrivacyControl === true || nav.doNotTrack === "1" || nav.webdriver === true) return [];
    const page = pageCountId(pathname, known);
    const metrics = source === "internal" ? ["page_view"] : ["page_view", "visit"];
    for (const metric of metrics) {
      host.fetch(pageCountsUrl, {
        method: "POST",
        headers: { apikey: pageCountsKey, "content-type": "application/json" },
        body: JSON.stringify({ p_site: "radovar", p_page: page, p_metric: metric, p_source: source, p_locale: "en" }),
        keepalive: true,
        credentials: "omit",
        referrerPolicy: "no-referrer",
      }).catch(() => {});
    }
    return metrics;
  } catch {
    return [];
  }
}
