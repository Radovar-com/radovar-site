# Existing Radovar fonts

These are the existing Latin Newsreader normal/italic and Geist font files,
copied from Radovar's already-generated export to make builds independent of
Google Fonts responses. Their SHA-256 digests were also compared with the live
radovar.com font responses on 18 October 2026:

| File | SHA-256 |
|---|---|
| newsreader-latin.woff2 | 2a69ec1c0fb79a464de0e19957cdb3a65b5f626d85fffd164f9de557d3a64878 |
| newsreader-italic-latin.woff2 | 19a83cc7ce02aab990c0f5fb8bd8f12f2f8e4f56430d5a3459521cabd852a51c |
| geist-latin.woff2 | 9b6f5ff45b278c744b5f379a2c4ecbaf858a842b8eaf82ac8d21b699ca16c608 |

The font bytes are unchanged. `next/font/local` keeps the existing CSS variables,
weights and same-origin delivery. Newsreader and Geist use the SIL Open Font
License 1.1; the license text and Newsreader attribution are included here.
