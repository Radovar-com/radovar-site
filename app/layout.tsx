import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Newsreader, Geist } from "next/font/google";
import "./globals.css";
import "./landscape.css";

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

const SITE = "https://radovar.com";
const title = "Radovar | Good ideas. Better tools.";
const description =
  "Radovar builds AI tools that bring capability closer to your work. Meet Codevalanche, our local-first AI coding workspace.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: title, template: "%s | Radovar" },
  description,
  applicationName: "Radovar",
  icons: {
    apple: [{ url: `${process.env.BASE_PATH || ""}/apple-icon.png?v=20261009`, sizes: "180x180", type: "image/png" }],
    icon: [
      { url: `${process.env.BASE_PATH || ""}/radovar-icon.svg?v=20261009`, type: "image/svg+xml" },
      { url: `${process.env.BASE_PATH || ""}/favicon.ico?v=20261009`, sizes: "16x16 32x32 48x48", type: "image/x-icon" },
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
    url: SITE,
    siteName: "Radovar",
    images: [
      {
        url: "/social-card.png",
        width: 1200,
        height: 630,
        alt: "Codevalanche, an AI coding workspace by Radovar.",
      },
    ],
    title,
    description,
    locale: "en_US",
  },
  twitter: {
    images: ["/social-card.png"],
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
  "@type": "Organization",
  name: "Radovar",
  url: SITE,
  description,
  email: "info@radovar.com",
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
        <a className="skip-link" href="#top">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
