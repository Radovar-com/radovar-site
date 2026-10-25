import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./landscape.css";
import { AnalyticsProvider } from "./_components/AnalyticsProvider";
import { HOME_TITLE, SITE_URL as SITE, SITE_DESCRIPTION as description, SOCIAL_IMAGE } from "./_lib/site-metadata";

/* Only the weights the page actually renders. Display uses 300 (h1/h2) and
   400 (h3/wordmark); body uses 400 and 500 (nav, buttons). */
const Newsreader = localFont({
  src: [
    { path: "../public/fonts/newsreader-latin.woff2", weight: "300 400", style: "normal" },
    { path: "../public/fonts/newsreader-italic-latin.woff2", weight: "300 400", style: "italic" },
  ],
  declarations: [{ prop: "font-family", value: "Newsreader" }],
  adjustFontFallback: "Times New Roman",
  variable: "--font-serif",
  display: "swap",
});

const Geist = localFont({
  src: "../public/fonts/geist-latin.woff2",
  weight: "400 700",
  declarations: [{ prop: "font-family", value: "Geist" }],
  adjustFontFallback: "Arial",
  variable: "--font-sans",
  display: "swap",
});

const title = HOME_TITLE;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: title, template: "%s | Radovar" },
  description,
  applicationName: "Radovar",
  referrer: "strict-origin-when-cross-origin",
  icons: {
    apple: [{ url: `${process.env.BASE_PATH || ""}/apple-icon.png?v=20261016r7`, sizes: "180x180", type: "image/png" }],
    icon: [
      { url: `${process.env.BASE_PATH || ""}/radovar-icon.svg?v=20261016r7`, type: "image/svg+xml" },
      { url: `${process.env.BASE_PATH || ""}/favicon.ico?v=20261016r7`, sizes: "16x16 32x32 48x48", type: "image/x-icon" },
    ],
  },
  authors: [{ name: "Radovar" }],
  creator: "Radovar",
  publisher: "Radovar",
  alternates: { canonical: "/", types: { "application/rss+xml": [{ url: "/feed.xml", title: "Radovar updates" }] } },
  openGraph: {
    type: "website",
    url: `${SITE}/`,
    siteName: "Radovar",
    images: [SOCIAL_IMAGE],
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    images: [{ url: SOCIAL_IMAGE.url, alt: SOCIAL_IMAGE.alt }],
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#121b17" },
  ],
  colorScheme: "light dark",
};

/* Organization schema, so search engines and AI crawlers resolve the
   Radovar / Codevalanche relationship rather than guessing it. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Radovar",
      url: `${SITE}/`,
      description,
      email: "info@radovar.com",
      sameAs: ["https://x.com/radovarcom"],
      logo: {
        "@type": "ImageObject",
        url: `${SITE}/radovar-logo.svg`,
        width: 1184,
        height: 230,
      },
      contactPoint: [
        { "@type": "ContactPoint", contactType: "customer support", email: "info@radovar.com", availableLanguage: ["en", "ro"] },
        { "@type": "ContactPoint", contactType: "press", email: "press@radovar.com", availableLanguage: ["en", "ro"] },
        { "@type": "ContactPoint", contactType: "security", email: "security@radovar.com", availableLanguage: ["en"] },
      ],
      brand: { "@id": `${SITE}/#codevalanche` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE}/#codevalanche`,
      name: "Codevalanche",
      url: "https://codevalanche.com/",
      sameAs: [`${SITE}/codevalanche/`],
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows",
      description:
        "A desktop app for coding with AI agents: your local projects, cloud agents or supported local models, and a review of every change in one window.",
      publisher: { "@id": `${SITE}/#organization` },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      name: "Radovar",
      url: `${SITE}/`,
      inLanguage: "en",
      publisher: { "@id": `${SITE}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${Newsreader.variable} ${Geist.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(()=>{let t;try{t=localStorage.getItem("radovar-theme")}catch{}document.documentElement.dataset.theme=t==="light"||t==="dark"?t:matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"})()`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        {children}
        <AnalyticsProvider />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
