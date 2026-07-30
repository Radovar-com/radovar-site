import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Newsreader, Source_Sans_3 } from "next/font/google"
import "./globals.css"

const serif = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
})

const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
})

const title = "Radovar — local-first AI, built in Bucharest"
const description =
  "Radovar is a technology company building local-first AI. Creator, our desktop application, runs AI agents on your machine and keeps your code there."

export const metadata: Metadata = {
  metadataBase: new URL("https://radovar.com"),
  title: { default: title, template: "%s — Radovar" },
  description,
  applicationName: "Radovar",
  keywords: ["Radovar", "Creator", "local-first AI", "AI agents", "privacy", "desktop AI"],
  authors: [{ name: "Radovar" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "https://radovar.com",
    siteName: "Radovar",
    title,
    description,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  )
}
