# Radovar analytics activation and maintenance

The browser integration and the CSP connection allowlist must ship together. The
22 October 2026 candidate connects canonical `https://radovar.com` to the existing
Codevalanche collector. Publication/production activation requires the owner's
explicit approval. Preparing a branch or preview is not evidence of live collection.

## Boundaries to preserve

- `app/analytics/config.ts` owns the reviewed collector URL and page version.
  `scripts/postbuild-security.mjs` imports its exact origin; never add a wildcard,
  all-HTTPS connection policy, or a second tracker to repair an integration.
- `resolveAnalyticsConfig` enables the production endpoint only on HTTPS
  `radovar.com`. The public `www` host redirects to the apex; it is not separately
  allowlisted by the collector. Localhost and Pages/preview hosts must not inherit
  production collection. Test overrides can target only supported loopback URLs.
- Retain the shared SDK/manifest hashes and semantic `data-analytics-*` markers.
  This activation does not change the SDK, its event schema or the backend.
- Consent alone is not a page view: a valid collector receipt is also required.
  Keep refusal, withdrawal, failed receipt handling and site/account separation.
  A preference saved during the disabled release may have no usable receipt;
  the existing cookie dialog must remain accessible to review/retry that choice.
  Do not silently grant consent or send identifiers before a valid receipt.
- No queries, form content, email addresses or credentials belong in events.
  Never generate production test rows from a preview or copy grants between sites.

## Release verification

1. Run type checking, the configuration/export-policy tests and the ordinary
   build/SEO checks. Preserve the browser consent, lifecycle and CSP CI checks.
2. Qualify the actual export against an isolated loopback collector: refusal must
   send zero events; acceptance can send a page view once; navigation and section
   observations must validate; withdrawal stops further events. A failed receipt
   must leave the site usable, expose preferences and send no optional events.
3. After separate approval and normal deployment, read back the public compiled
   config, exact CSP allowlist and matching SDK manifest. Do not use local fixture
   results to claim production ingestion.
4. Company OS reads `wa_events` aggregates; new data needs a successful read
   (the manual refresh or the ordinary 15-minute poll). Counted visits represent
   consenting browsers, not all visitors. No historical traffic can be backfilled
   merely by enabling this configuration. Empty data is not a collector diagnosis.

## Recovery

Revert the reviewed activation commit through the organization's normal PR/main
workflow and redeploy. This restores the former disabled configuration and
connection policy without deleting consent records, events or reports. Do not
change Supabase, DNS, Cloudflare, Codevalanche, or the desktop release repositories
to roll back this Radovar-only change.
