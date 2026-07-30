import type { NextConfig } from "next"
import path from "node:path"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export: produces a plain HTML/CSS/JS site in out/ that any host can serve.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    root: path.resolve(__dirname),
  },
}

export default nextConfig
