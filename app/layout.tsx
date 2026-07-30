import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import { Newsreader, Source_Sans_3 } from "next/font/google"
import "./globals.css"

/* Only the weights the page actually renders. Display uses 300 (h1/h2) and
   400 (h3/wordmark); body uses 400 and 500 (nav, buttons). */
const serif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
})

const SITE = "https://radovar.com"
const title = "Radovar — local-first AI, built in Bucharest"
const description =
  "Radovar is a technology company building local-first AI. Creator, our desktop application, runs AI agents on your machine and keeps your code there."

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: title, template: "%s — Radovar" },
  description,
  applicationName: "Radovar",
  keywords: ["Radovar", "Creator", "local-first AI", "AI agents", "privacy", "desktop AI"],
  authors: [{ name: "Radovar" }],
  creator: "Radovar",
  publisher: "Radovar",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Radovar",
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f5" },
    { media: "(prefers-color-scheme: dark)", color: "#12120f" },
  ],
  colorScheme: "light dark",
}

/* Organization schema, so search engines and AI crawlers resolve the
   Radovar / Creator relationship rather than guessing it. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Radovar",
  url: SITE,
  description,
  email: "info@radovar.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bucharest",
    addressCountry: "RO",
  },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "SoftwareApplication",
      name: "Creator",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows",
      description:
        "Desktop application that runs AI agents against a local project and keeps the source code on the machine.",
    },
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <a className="skip-link" href="#top">Skip to content</a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
