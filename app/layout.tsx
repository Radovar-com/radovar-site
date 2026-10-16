import type { ReactNode } from "react";
import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Newsreader, Geist } from "next/font/google";
import "./globals.css";
import "./landscape.css";
import { AnalyticsProvider } from "./_components/AnalyticsProvider";
import { SITE_URL as SITE, SITE_DESCRIPTION as description, SOCIAL_IMAGE } from "./_lib/site-metadata";

/* Only the weights the page actually renders. Display uses 300 (h1/h2) and
   400 (h3/wordmark); body uses 400 and 500 (nav, buttons). */
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const sans = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const title = "Radovar";

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
  keywords: [
    "Radovar",
    "Codevalanche",
    "local-first AI",
    "AI agents",
    "privacy",
    "desktop AI",
  ],
  authors: [{ name: "Radovar" }],
  creator: "Radovar",
  publisher: "Radovar",
  alternates: { canonical: "/" },
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
  "@graph": [{
  "@type": "Organization",
  "@id": `${SITE}/#organization`,
  name: "Radovar",
  url: SITE,
  description,
  email: "info@radovar.com",
  logo: {
    "@type": "ImageObject",
    url: `${SITE}/radovar-logo.svg`,
    width: 1184,
    height: 230,
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "SoftwareApplication",
      name: "Codevalanche",
      url: "https://codevalanche.com",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows",
      description:
        "A local-first AI coding workspace for repositories, supported runtimes, and review.",
    },
  },
  }, {
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "Radovar",
    url: `${SITE}/`,
    inLanguage: "en",
    publisher: { "@id": `${SITE}/#organization` },
  }],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable}`}
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
        <Link className="skip-link" href="#top">
          Skip to content
        </Link>
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
